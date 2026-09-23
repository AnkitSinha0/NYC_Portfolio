import { dayKey } from "../stats/days";
import { fromCodeforces, fromGitHub, fromLeetCode, type SourceResult } from "./sources";
import type { ActivityEvent, ActivityFeed } from "./types";
import { weekFrom } from "./week";

export type { ActivityEvent, ActivityFeed } from "./types";
export { ACTIVITY_REVALIDATE } from "./sources";

const TAPE_LENGTH = 40;

/**
 * The real tape: GitHub pushes and PRs, LeetCode accepted solves and
 * Codeforces submissions and rating changes, newest first. A source
 * that fails is left out and named in `down`; nothing is invented.
 */
export async function getActivity(): Promise<ActivityFeed> {
  const now = Date.now();
  const [gh, lc, cf] = await Promise.all([fromGitHub(now), fromLeetCode(now), fromCodeforces(now)]);
  const ok = [gh, lc, cf].filter(Boolean) as NonNullable<SourceResult>[];

  const events: ActivityEvent[] = ok
    .flatMap((s) => s.events)
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, TAPE_LENGTH);

  const week = weekFrom(ok.map((s) => s.daily), dayKey(now));
  const repos = gh?.repos24 ?? [];

  return {
    mode: "live",
    generatedAt: new Date(now).toISOString(),
    events,
    summary: {
      pushes: gh?.pushes24 ?? 0,
      solved: (lc?.solved24 ?? 0) + (cf?.solved24 ?? 0),
      prs: gh?.prs24 ?? 0,
      repos: repos.length,
      cfLastChange: cf?.cfLastChange ?? null,
      topRepo: events.find((e) => e.source === "github" || e.source === "project")?.title ?? null,
      week: week.reduce((a, d) => a + d.count, 0),
    },
    week,
    down: [!gh && "GitHub", !lc && "LeetCode", !cf && "Codeforces"].filter(Boolean) as ActivityFeed["down"],
  };
}
