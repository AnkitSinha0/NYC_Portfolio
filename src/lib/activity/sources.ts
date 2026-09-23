import { dayKey, stampIST, timeIST } from "../stats/days";
import type { ActivityEvent, ActivitySource, SignalType } from "./types";

/** Seconds the activity sources are cached for. /api/activity uses the same. */
export const ACTIVITY_REVALIDATE = 300;

const GITHUB_USER = "AnkitSinha0";
const LEETCODE_USER = "Haunts_01";
const CODEFORCES_USER = "Haunts";

export type SourceResult = {
  events: ActivityEvent[];
  daily: Record<string, number>; // IST day -> raw activity count
  pushes24?: number;
  prs24?: number;
  repos24?: string[];
  solved24?: number;
  cfLastChange?: number | null;
} | null;

function event(
  ms: number,
  e: Omit<ActivityEvent, "at" | "day" | "timestamp" | "detail"> & {
    detail?: Omit<NonNullable<ActivityEvent["detail"]>, "when">;
  },
): ActivityEvent {
  return {
    ...e,
    at: new Date(ms).toISOString(),
    day: dayKey(ms),
    timestamp: timeIST(ms),
    detail: e.detail ? { ...e.detail, when: stampIST(ms) } : undefined,
  };
}

const bump = (daily: Record<string, number>, ms: number, n = 1) => {
  const k = dayKey(ms);
  daily[k] = (daily[k] ?? 0) + n;
};

const DAY_MS = 86_400_000;

// ─────────────────────────── GitHub ───────────────────────────

type GhEvent = {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: { ref?: string; head?: string; before?: string; action?: string; ref_type?: string; number?: number; pull_request?: { merged?: boolean; title?: string; html_url?: string } };
};

function repoLabel(full: string) {
  const name = full.split("/")[1] ?? full;
  return name.replace(/[-_]+$/, "").replace(/[-_]+/g, " ").toUpperCase();
}

function repoSymbol(full: string): { source: ActivitySource; symbol: ActivityEvent["symbol"] } {
  return /\/hashvault$/i.test(full) ? { source: "project", symbol: "HV" } : { source: "github", symbol: "GH" };
}

async function gh<T>(path: string): Promise<T | null> {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  // Optional: with a token, pushes are enriched with commit counts,
  // messages and line changes, and the rate limit rises to 5,000/h.
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com${path}`, { headers, next: { revalidate: ACTIVITY_REVALIDATE } });
  return res.ok ? ((await res.json()) as T) : null;
}

type Compare = {
  total_commits: number;
  commits: { commit: { message: string } }[];
  files?: { filename: string; additions: number; deletions: number }[];
};

export async function fromGitHub(now: number): Promise<SourceResult> {
  try {
    const raw = await gh<GhEvent[]>(`/users/${GITHUB_USER}/events/public?per_page=100`);
    if (!raw) return null;

    const daily: Record<string, number> = {};
    const since = now - DAY_MS;
    let pushes24 = 0;
    let prs24 = 0;
    const repos24 = new Set<string>();

    // Consecutive pushes to one repo within 45 minutes print as a single row.
    type Group = { repo: string; pushes: GhEvent[] };
    const groups: Group[] = [];
    const others: ActivityEvent[] = [];

    for (const e of raw) {
      const ms = Date.parse(e.created_at);
      if (e.type === "PushEvent") {
        bump(daily, ms);
        if (ms >= since) {
          pushes24++;
          repos24.add(e.repo.name);
        }
        const last = groups[groups.length - 1];
        const lastMs = last ? Date.parse(last.pushes[last.pushes.length - 1].created_at) : 0;
        if (last && last.repo === e.repo.name && lastMs - ms < 45 * 60_000) last.pushes.push(e);
        else groups.push({ repo: e.repo.name, pushes: [e] });
      } else if (e.type === "PullRequestEvent" && e.payload.pull_request) {
        const pr = e.payload.pull_request;
        const merged = e.payload.action === "closed" && pr.merged;
        if (e.payload.action !== "opened" && !merged) continue;
        bump(daily, ms);
        if (ms >= since) prs24++;
        others.push(
          event(ms, {
            id: `gh-${e.id}`,
            ...repoSymbol(e.repo.name),
            title: `PULL REQUEST #${e.payload.number}`,
            description: `${repoLabel(e.repo.name)} · ${merged ? "Merged" : "Opened"}`,
            signal: merged ? "✓" : "●",
            signalType: merged ? "positive" : "neutral",
            detail: { lines: [pr.title ?? ""], url: pr.html_url, linkLabel: "View on GitHub →" },
          }),
        );
      } else if (e.type === "CreateEvent" && e.payload.ref_type === "repository") {
        others.push(
          event(ms, {
            id: `gh-${e.id}`,
            ...repoSymbol(e.repo.name),
            title: repoLabel(e.repo.name),
            description: "New repository listed",
            signal: "IPO",
            signalType: "neutral",
            detail: { lines: [e.repo.name], url: `https://github.com/${e.repo.name}`, linkLabel: "View on GitHub →" },
          }),
        );
      }
    }

    const pushEvents = await Promise.all(
      groups.map(async (g, i) => {
        const newest = g.pushes[0];
        const oldest = g.pushes[g.pushes.length - 1];
        const head = newest.payload.head ?? "";
        const branch = (newest.payload.ref ?? "").replace("refs/heads/", "");
        const n = g.pushes.length;

        let lines = [`Branch ${branch}`, `Head ${head.slice(0, 7)}`];
        let description = `${n === 1 ? "Push" : `${n} pushes`} · ${branch}`;
        let signal = `▲ +${n}`;
        // Enrich only the newest rows, and only with a token — unauthenticated
        // requests are capped at 60 an hour.
        if (process.env.GITHUB_TOKEN && i < 6 && oldest.payload.before && head) {
          const cmp = await gh<Compare>(`/repos/${g.repo}/compare/${oldest.payload.before}...${head}`).catch(() => null);
          if (cmp) {
            const files = cmp.files ?? [];
            const changed = files.reduce((a, f) => a + f.additions + f.deletions, 0);
            const message = cmp.commits[cmp.commits.length - 1]?.commit.message.split("\n")[0] ?? "";
            description = `${cmp.total_commits} ${cmp.total_commits === 1 ? "commit" : "commits"} pushed`;
            signal = `▲ +${cmp.total_commits}`;
            lines = [
              message,
              ...files.slice(0, 3).map((f) => f.filename),
              `Commit ${head.slice(0, 7)} · ${changed} lines changed`,
            ].filter(Boolean);
          }
        }

        return event(Date.parse(newest.created_at), {
          id: `gh-${newest.id}`,
          ...repoSymbol(g.repo),
          title: repoLabel(g.repo),
          description,
          signal,
          signalType: "positive",
          detail: { lines, url: `https://github.com/${g.repo}/commit/${head}`, linkLabel: "View on GitHub →" },
        });
      }),
    );

    return { events: [...pushEvents, ...others], daily, pushes24, prs24, repos24: [...repos24] };
  } catch {
    return null;
  }
}

// ─────────────────────────── LeetCode ───────────────────────────

async function lcQuery<T>(query: string, variables: Record<string, unknown> = {}): Promise<T | null> {
  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json", Referer: `https://leetcode.com/u/${LEETCODE_USER}/` },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: ACTIVITY_REVALIDATE },
  });
  if (!res.ok) return null;
  return ((await res.json()).data ?? null) as T | null;
}

export async function fromLeetCode(now: number): Promise<SourceResult> {
  try {
    type Recent = { id: string; title: string; titleSlug: string; timestamp: string; lang: string };
    const data = await lcQuery<{
      recentAcSubmissionList: Recent[];
      matchedUser: { userCalendar: { submissionCalendar: string } } | null;
    }>(
      `query($u: String!) {
        recentAcSubmissionList(username: $u, limit: 20) { id title titleSlug timestamp lang }
        matchedUser(username: $u) { userCalendar { submissionCalendar } }
      }`,
      { u: LEETCODE_USER },
    );
    if (!data?.recentAcSubmissionList) return null;
    const recent = data.recentAcSubmissionList;

    // Difficulties in one round trip, one alias per problem.
    const slugs = [...new Set(recent.map((r) => r.titleSlug))];
    const diffs = slugs.length
      ? await lcQuery<Record<string, { difficulty: string } | null>>(
          `query { ${slugs.map((s, i) => `q${i}: question(titleSlug: ${JSON.stringify(s)}) { difficulty }`).join(" ")} }`,
        )
      : null;
    const difficulty = (slug: string) => diffs?.[`q${slugs.indexOf(slug)}`]?.difficulty ?? null;

    const daily: Record<string, number> = {};
    const calendar: Record<string, number> = JSON.parse(data.matchedUser?.userCalendar.submissionCalendar ?? "{}");
    for (const [ts, n] of Object.entries(calendar)) bump(daily, Number(ts) * 1000, n);

    const since = now - DAY_MS;
    const lang = (l: string) => ({ java: "Java", python3: "Python3", cpp: "C++", python: "Python" })[l] ?? l;

    const events = recent.map((r) => {
      const ms = Number(r.timestamp) * 1000;
      const d = difficulty(r.titleSlug);
      return event(ms, {
        id: `lc-${r.id}`,
        source: "leetcode",
        symbol: "LC",
        title: r.title.toUpperCase(),
        description: `${d ? `${d} · ` : ""}Accepted`,
        signal: "✓",
        signalType: "positive",
        detail: {
          lines: [r.title, `${d ?? "—"} · ${lang(r.lang)}`, `Submission ${r.id}`],
          url: `https://leetcode.com/problems/${r.titleSlug}/`,
          linkLabel: "View on LeetCode →",
        },
      });
    });

    return { events, daily, solved24: recent.filter((r) => Number(r.timestamp) * 1000 >= since).length };
  } catch {
    return null;
  }
}

// ─────────────────────────── Codeforces ───────────────────────────

const VERDICTS: Record<string, [string, string, SignalType]> = {
  OK: ["Accepted", "✓", "positive"],
  WRONG_ANSWER: ["Wrong answer", "✕", "negative"],
  TIME_LIMIT_EXCEEDED: ["Time limit", "✕", "negative"],
  MEMORY_LIMIT_EXCEEDED: ["Memory limit", "✕", "negative"],
  RUNTIME_ERROR: ["Runtime error", "✕", "negative"],
  COMPILATION_ERROR: ["Compile error", "✕", "negative"],
};

export async function fromCodeforces(now: number): Promise<SourceResult> {
  try {
    const api = async <T,>(m: string) => {
      const res = await fetch(`https://codeforces.com/api/${m}`, { next: { revalidate: ACTIVITY_REVALIDATE } });
      if (!res.ok) return null;
      const j = await res.json();
      return j.status === "OK" ? (j.result as T) : null;
    };
    type Sub = { id: number; creationTimeSeconds: number; verdict?: string; programmingLanguage: string; contestId?: number; problem: { contestId?: number; index: string; name: string; rating?: number } };
    type Change = { contestId: number; contestName: string; rank: number; oldRating: number; newRating: number; ratingUpdateTimeSeconds: number };

    const [subs, rating] = await Promise.all([
      api<Sub[]>(`user.status?handle=${CODEFORCES_USER}`),
      api<Change[]>(`user.rating?handle=${CODEFORCES_USER}`),
    ]);
    if (!subs || !rating) return null;

    const daily: Record<string, number> = {};
    const since = now - DAY_MS;
    let solved24 = 0;
    for (const s of subs) {
      bump(daily, s.creationTimeSeconds * 1000);
      if (s.verdict === "OK" && s.creationTimeSeconds * 1000 >= since) solved24++;
    }

    const subEvents = subs.slice(0, 30).map((s) => {
      const [label, signal, signalType] = VERDICTS[s.verdict ?? ""] ?? ["Judging", "●", "neutral" as SignalType];
      const code = `${s.problem.contestId ?? ""}${s.problem.index}`;
      return event(s.creationTimeSeconds * 1000, {
        id: `cf-${s.id}`,
        source: "codeforces",
        symbol: "CF",
        title: `${code} · ${s.problem.name.toUpperCase()}`,
        description: label,
        signal,
        signalType,
        detail: {
          lines: [s.problem.name, `${s.programmingLanguage}${s.problem.rating ? ` · rated ${s.problem.rating}` : ""}`, `Submission ${s.id}`],
          url: s.contestId ? `https://codeforces.com/contest/${s.contestId}/submission/${s.id}` : undefined,
          linkLabel: "View on Codeforces →",
        },
      });
    });

    const ratingEvents = rating.map((r) => {
      const change = r.newRating - r.oldRating;
      return event(r.ratingUpdateTimeSeconds * 1000, {
        id: `cfr-${r.contestId}`,
        source: "codeforces",
        symbol: "CF",
        title: r.contestName.replace(/^Codeforces\s+/, "").toUpperCase(),
        description: `Rating change · rank ${r.rank.toLocaleString("en-US")}`,
        signal: `${change >= 0 ? "▲ +" : "▼ "}${change}`,
        signalType: change >= 0 ? "positive" : "negative",
        detail: {
          lines: [r.contestName, `${r.oldRating} → ${r.newRating}`, `Rank ${r.rank.toLocaleString("en-US")}`],
          url: `https://codeforces.com/contest/${r.contestId}/standings`,
          linkLabel: "View standings →",
        },
      });
    });

    const last = rating[rating.length - 1];
    return {
      events: [...subEvents, ...ratingEvents],
      daily,
      solved24,
      cfLastChange: last ? last.newRating - last.oldRating : null,
    };
  } catch {
    return null;
  }
}
