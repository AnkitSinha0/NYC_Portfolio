import { dayKey, formatDay, timeIST, weekday } from "./stats/days";

/** Seconds the calendar is cached for. */
export const CONTESTS_REVALIDATE = 1800;

export type Contest = {
  id: string;
  venue: "CF" | "LC";
  name: string;
  start: string; // ISO
  day: string; // "FRI 25 SEP"
  time: string; // "20:05"
  minutes: number;
  url: string;
};

async function codeforces(): Promise<Contest[]> {
  try {
    const res = await fetch("https://codeforces.com/api/contest.list?gym=false", {
      next: { revalidate: CONTESTS_REVALIDATE },
    });
    if (!res.ok) return [];
    const json = await res.json();
    if (json.status !== "OK") return [];
    type C = { id: number; name: string; phase: string; startTimeSeconds?: number; durationSeconds: number };
    return (json.result as C[])
      .filter((c) => c.phase === "BEFORE" && c.startTimeSeconds)
      .map((c) => contest("CF", `cf-${c.id}`, c.name.replace(/^Codeforces\s+/, ""), c.startTimeSeconds! * 1000, c.durationSeconds, `https://codeforces.com/contests/${c.id}`));
  } catch {
    return [];
  }
}

async function leetcode(): Promise<Contest[]> {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", Referer: "https://leetcode.com/contest/" },
      body: JSON.stringify({ query: "{ upcomingContests { title titleSlug startTime duration } }" }),
      next: { revalidate: CONTESTS_REVALIDATE },
    });
    if (!res.ok) return [];
    type C = { title: string; titleSlug: string; startTime: number; duration: number };
    const list: C[] = (await res.json()).data?.upcomingContests ?? [];
    return list.map((c) => contest("LC", `lc-${c.titleSlug}`, c.title, c.startTime * 1000, c.duration, `https://leetcode.com/contest/${c.titleSlug}/`));
  } catch {
    return [];
  }
}

function contest(venue: Contest["venue"], id: string, name: string, ms: number, seconds: number, url: string): Contest {
  const key = dayKey(ms);
  return {
    id,
    venue,
    name,
    start: new Date(ms).toISOString(),
    day: `${weekday(key)} ${formatDay(key).split(" ").slice(0, 2).join(" ").toUpperCase()}`,
    time: timeIST(ms).slice(0, 5),
    minutes: Math.round(seconds / 60),
    url,
  };
}

/** The next rated rounds on both venues, soonest first. Empty if both feeds fail. */
export async function getContests(limit = 6): Promise<Contest[]> {
  const now = Date.now();
  const [cf, lc] = await Promise.all([codeforces(), leetcode()]);
  return [...cf, ...lc]
    .filter((c) => Date.parse(c.start) > now)
    .sort((a, b) => a.start.localeCompare(b.start))
    .slice(0, limit);
}
