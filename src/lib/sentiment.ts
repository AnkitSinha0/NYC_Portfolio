import type { ActivityFeed } from "./activity/types";
import type { Stats } from "./stats";

export type Mood = "BULLISH" | "NEUTRAL" | "BEARISH";
export type Reason = { sign: "+" | "−" | "·"; text: string; weight: number };

export type Sentiment = {
  mood: Mood;
  score: number;
  fill: number; // 0..1 along the gauge
  reasons: Reason[];
  analyst: string;
  partial: string | null;
};

const MIN = -8;
const MAX = 9;
const DAY_MS = 86_400_000;

const ANALYST: Record<Mood, string> = {
  BULLISH: "Analysts expect continued upside, pending sleep.",
  NEUTRAL: "Consolidating. Analysts cite coffee supply.",
  BEARISH: "Sell-off in progress. Analysts recommend one Easy problem.",
};

/**
 * The market's mood, computed — never written. Each factor adds or
 * takes points and explains itself; the verdict is the sum.
 */
export function marketSentiment(stats: Stats, activity: ActivityFeed, now = Date.now()): Sentiment {
  const { lc, cf } = stats;
  const s = activity.summary;
  const reasons: Reason[] = [];
  const add = (weight: number, text: string) =>
    reasons.push({ sign: weight > 0 ? "+" : weight < 0 ? "−" : "·", text, weight });

  // Streak — the headline position.
  if (lc.currentStreak >= 7) add(2, `${lc.currentStreak}-day streak intact`);
  else if (lc.currentStreak >= 1) add(1, `${lc.currentStreak}-day streak`);
  else add(-2, `Streak broken (best ${lc.maxStreak})`);

  // Momentum — this month against the last.
  if (lc.subPrev30 > 0) {
    const change = Math.round(((lc.sub30 - lc.subPrev30) / lc.subPrev30) * 100);
    if (change >= 10) add(1, `Volume up ${change}% on the month`);
    else if (change <= -10) add(-1, `Volume down ${-change}% on the month`);
    else add(0, "Volume flat on the month");
  } else if (lc.sub30 > 0) {
    add(1, "Fresh volume this month");
  }

  // Monthly volume and breadth.
  if (lc.sub30 >= 60) add(1, `${lc.sub30} submissions this month`);
  else if (lc.sub30 < 15) add(-1, `Only ${lc.sub30} submissions this month`);
  else add(0, `${lc.sub30} submissions this month`);

  if (lc.act30 >= 20) add(1, `Active ${lc.act30} of the last 30 days`);
  else if (lc.act30 < 8) add(-1, `Active just ${lc.act30} of the last 30 days`);

  // GitHub — shipping, not just solving.
  if (!activity.down.includes("GitHub")) {
    if (s.pushes7 >= 10) add(1, `${s.pushes7} pushes this week`);
    else if (s.pushes7 === 0) add(-1, "No pushes this week");
    else add(0, `${s.pushes7} pushes this week`);

    if (s.hashvaultAt) {
      const days = Math.floor((now - Date.parse(s.hashvaultAt)) / DAY_MS);
      if (days <= 14) add(1, days === 0 ? "HashVault active today" : `HashVault active (${days}d ago)`);
      else add(0, `HashVault quiet for ${days} days`);
    }
  }

  // Codeforces — the last print.
  if (cf.lastChange !== null && cf.lastChange !== 0) {
    add(cf.lastChange > 0 ? 1 : -1, `Codeforces ${cf.lastChange > 0 ? "+" : ""}${cf.lastChange} last round`);
  }

  const score = reasons.reduce((a, r) => a + r.weight, 0);
  const mood: Mood = score >= 4 ? "BULLISH" : score <= -1 ? "BEARISH" : "NEUTRAL";
  const fill = Math.min(1, Math.max(0, (score - MIN) / (MAX - MIN)));

  const missing = [...(stats.isFallback ? ["LeetCode/Codeforces"] : []), ...activity.down];
  return {
    mood,
    score,
    fill,
    // Strongest movers first, flat lines last.
    reasons: [...reasons].sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight)).slice(0, 6),
    analyst: ANALYST[mood],
    partial: missing.length ? `${[...new Set(missing)].join(", ")} feed delayed — partial read.` : null,
  };
}
