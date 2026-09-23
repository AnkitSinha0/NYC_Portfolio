/**
 * DEMO DATA — sample transactions for previewing the tape at
 * /markets?feed=demo. Never shown on the live feed, and always
 * labelled as sample data when it is. Real events come from
 * getActivity() / GET /api/activity.
 */
import { addDays, dayKey, stampIST, timeIST } from "../stats/days";
import { weekFrom } from "./week";
import type { ActivityEvent, ActivityFeed } from "./types";

type Template = Pick<ActivityEvent, "source" | "symbol" | "title" | "description" | "signal" | "signalType"> & {
  lines: string[];
};

const TEMPLATES: Template[] = [
  { source: "project", symbol: "HV", title: "HASHVAULT", description: "3 commits pushed", signal: "▲ +3", signalType: "positive", lines: ["feat(storage): stream uploads through dedup", "internal/storage/storage.go", "Commit a82f91c · 37 lines changed"] },
  { source: "leetcode", symbol: "LC", title: "FIND A PEAK ELEMENT II", description: "Medium · Accepted", signal: "✓", signalType: "positive", lines: ["Find a Peak Element II", "Medium · Java"] },
  { source: "project", symbol: "HV", title: "PULL REQUEST #42", description: "HASHVAULT · Merged", signal: "✓", signalType: "positive", lines: ["Refcount purge on last release"] },
  { source: "codeforces", symbol: "CF", title: "ROUND 1042 (DIV. 3)", description: "Rating change · rank 9,812", signal: "▲ +18", signalType: "positive", lines: ["814 → 832", "Rank 9,812"] },
  { source: "project", symbol: "HV", title: "HASHVAULT", description: "storage.go modified", signal: "●", signalType: "neutral", lines: ["internal/storage/storage.go", "37 lines changed"] },
  { source: "leetcode", symbol: "LC", title: "SQRT(X)", description: "Easy · Accepted", signal: "✓", signalType: "positive", lines: ["Sqrt(x)", "Easy · Java"] },
  { source: "codeforces", symbol: "CF", title: "2266B · THREE PILES", description: "Wrong answer", signal: "✕", signalType: "negative", lines: ["Three Piles", "Java 21"] },
  { source: "github", symbol: "GH", title: "ALGORITHMISCHE PROBLEME", description: "Commit pushed · main", signal: "▲ +1", signalType: "positive", lines: ["Add solution: Longest Common Prefix", "Commit 9adb180"] },
];

let seq = 0;

/** A sample event stamped at `ms`. */
export function mockEvent(ms: number, t = TEMPLATES[seq % TEMPLATES.length]): ActivityEvent {
  seq++;
  const { lines, ...rest } = t;
  return {
    id: `demo-${seq}-${ms}`,
    at: new Date(ms).toISOString(),
    day: dayKey(ms),
    timestamp: timeIST(ms),
    ...rest,
    detail: { lines, when: stampIST(ms), url: "#", linkLabel: "Sample link →" },
  };
}

/** A believable sample tape ending at `now`. */
export function mockFeed(now: number): ActivityFeed {
  const gaps = [11, 23, 38, 71, 95, 160, 245, 420, 610, 900, 1300, 1720];
  const events = gaps.map((m, i) => mockEvent(now - m * 60_000, TEMPLATES[i % TEMPLATES.length]));
  const today = dayKey(now);
  const daily = Object.fromEntries([9, 14, 6, 11, 17, 8, 12].map((n, i) => [addDays(today, i - 6), n]));
  const week = weekFrom([daily], today);
  return {
    mode: "demo",
    generatedAt: new Date(now).toISOString(),
    events,
    summary: { pushes: 6, solved: 4, prs: 2, repos: 3, cfLastChange: 18, topRepo: "HASHVAULT", week: week.reduce((a, d) => a + d.count, 0) },
    week,
    down: [],
  };
}
