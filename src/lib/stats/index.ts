import fallback from "../../../data/stats-fallback.json";
import { fetchCodeforces } from "./codeforces";
import { addDays, dayKey, formatDateline, formatDay, monthOf } from "./days";
import { fetchLeetCode } from "./leetcode";
import type { CodeforcesRaw, DayCounts, LeetCodeRaw, StatsSnapshot } from "./types";

export { REVALIDATE } from "./config";
export { LEETCODE_URL } from "./leetcode";
export { CODEFORCES_URL } from "./codeforces";

const snapshot = fallback as StatsSnapshot;

// Codeforces rank bands, lower bound inclusive.
const CF_RANKS: [string, number, string][] = [
  ["Newbie", 0, "#8C8375"],
  ["Pupil", 1200, "#4E9A51"],
  ["Specialist", 1400, "#34A6A6"],
  ["Expert", 1600, "#4E7BD6"],
  ["Candidate Master", 1900, "#8E5BC6"],
  ["Master", 2100, "#D08A2E"],
  ["International Master", 2300, "#D08A2E"],
  ["Grandmaster", 2400, "#B8453A"],
];

/** Sum of counts over the `days` days ending `end` (inclusive). */
function sumWindow(counts: DayCounts, end: string, days: number) {
  let total = 0;
  for (let i = 0; i < days; i++) total += counts[addDays(end, -i)] ?? 0;
  return total;
}

/** Days with at least one submission over the same window. */
function activeWindow(counts: DayCounts, end: string, days: number) {
  let total = 0;
  for (let i = 0; i < days; i++) if ((counts[addDays(end, -i)] ?? 0) > 0) total++;
  return total;
}

/** Unbroken run of active days ending today — or yesterday, since today may not be over. */
function currentStreak(counts: DayCounts, today: string) {
  let day = (counts[today] ?? 0) > 0 ? today : addDays(today, -1);
  let n = 0;
  while ((counts[day] ?? 0) > 0) {
    n++;
    day = addDays(day, -1);
  }
  return n;
}

function titleCase(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function derive(lc: LeetCodeRaw, cf: CodeforcesRaw, asOf: string, isFallback: boolean) {
  const today = asOf;

  // ── LeetCode windows ──
  const win = {
    sub7: sumWindow(lc.calendar, today, 7),
    sub30: sumWindow(lc.calendar, today, 30),
    subPrev30: sumWindow(lc.calendar, addDays(today, -30), 30),
    sub365: sumWindow(lc.calendar, today, 365),
    act7: activeWindow(lc.calendar, today, 7),
    act30: activeWindow(lc.calendar, today, 30),
    actPrev30: activeWindow(lc.calendar, addDays(today, -30), 30),
    act365: activeWindow(lc.calendar, today, 365),
  };

  // ── heatmap: 26 weeks × 7 days, ending today ──
  const HEAT_DAYS = 26 * 7;
  const heatStart = addDays(today, -(HEAT_DAYS - 1));
  const heat = Array.from({ length: HEAT_DAYS }, (_, i) => {
    const d = addDays(heatStart, i);
    const n = lc.calendar[d] ?? 0;
    const lvl = n === 0 ? 0 : n > 10 ? 4 : n > 5 ? 3 : n > 2 ? 2 : 1;
    return { n, lvl, d: formatDay(d) };
  });
  const heatMonths = Array.from({ length: 6 }, (_, i) =>
    monthOf(addDays(heatStart, Math.round((i * (HEAT_DAYS - 1)) / 5))).toUpperCase(),
  );

  // ── weekly practice volume, LeetCode + Codeforces, 52 weeks ending today ──
  const weekly = Array.from({ length: 52 }, (_, w) => {
    const end = addDays(today, -7 * (51 - w));
    return sumWindow(lc.calendar, end, 7) + sumWindow(cf.submissions, end, 7);
  });
  const weeklyStart = addDays(today, -7 * 52 + 1);
  const weeklyLabels = {
    start: `${monthOf(weeklyStart).toUpperCase()} ’${weeklyStart.slice(2, 4)}`,
    mid: monthOf(addDays(today, -182)).toUpperCase(),
    end: `${monthOf(today).toUpperCase()} ’${today.slice(2, 4)}`,
  };

  // ── Codeforces ──
  const rating = cf.rating ?? 0;
  const rounds = cf.history.length;
  const ratingAt = (day: string) => {
    const before = cf.history.filter((h) => h.day <= day);
    return before.length ? before[before.length - 1].newRating : 0;
  };
  const cfWin = (days: number) => ({
    change: rating - ratingAt(addDays(today, -days)),
    rounds: cf.history.filter((h) => h.day > addDays(today, -days)).length,
  });
  const peakRound = cf.history.reduce<CodeforcesRaw["history"][number] | null>(
    (best, h) => (!best || h.newRating > best.newRating ? h : best),
    null,
  );
  const bandIndex = CF_RANKS.reduce((idx, [, min], i) => (rating >= min ? i : idx), 0);
  const ladder = CF_RANKS.slice(bandIndex, Math.min(bandIndex + 6, CF_RANKS.length)).map(
    ([name, min, color], i, rows) => ({
      name: i === 0 ? `${name} · you are here` : name,
      value: i === 0 ? String(rating) : i === rows.length - 1 ? `${min}+` : String(min),
      color,
      mod: i === 0 ? "here" : i === 1 ? "next" : undefined,
    }),
  ).reverse(); // highest band first; the ladder stacks bottom-up

  const cfData = {
    rating,
    maxRating: cf.maxRating ?? rating,
    maxRatingMonth: peakRound ? `${monthOf(peakRound.day)} ${peakRound.day.slice(0, 4)}` : "—",
    rank: titleCase(cf.rank ?? "unrated"),
    nextRank: CF_RANKS[bandIndex + 1]?.[0] ?? null,
    rankFloor: CF_RANKS[bandIndex][1],
    nextRankAt: CF_RANKS[bandIndex + 1]?.[1] ?? null,
    rounds,
    bestRank: rounds ? Math.min(...cf.history.map((h) => h.rank)) : null,
    lastChange: rounds ? cf.history[rounds - 1].newRating - cf.history[rounds - 1].oldRating : null,
    w7: cfWin(7),
    w30: cfWin(30),
    w365: cfWin(365),
    subs7: sumWindow(cf.submissions, today, 7),
    subs30: sumWindow(cf.submissions, today, 30),
    subs365: sumWindow(cf.submissions, today, 365),
    ladder,
  };

  return {
    asOf,
    asOfLabel: formatDay(asOf),
    dateline: formatDateline(asOf),
    isFallback,
    lc: {
      ...lc,
      ...win,
      currentStreak: currentStreak(lc.calendar, today),
      heat,
      heatMonths,
    },
    cf: cfData,
    weekly,
    weeklyLabels,
  };
}

export type Stats = ReturnType<typeof derive>;

/**
 * Live figures, cached for REVALIDATE seconds. If either platform
 * fails, it falls back to the last committed snapshot and the pages
 * say so instead of passing a stale number off as fresh.
 */
export async function getStats(): Promise<Stats> {
  const [lc, cf] = await Promise.all([fetchLeetCode(), fetchCodeforces()]);
  const isFallback = !lc || !cf;
  const asOf = isFallback ? dayKey(Date.parse(snapshot.fetchedAt)) : dayKey(Date.now());
  return derive(lc ?? snapshot.leetcode, cf ?? snapshot.codeforces, asOf, isFallback);
}

// ── formatting helpers shared by both pages ──

export const num = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/** "▲ 9", "▼ 3" or "—", with the class that colours it. */
export function delta(n: number): { text: string; cls: "u" | "d" | "f" } {
  if (n > 0) return { text: `▲ ${num(n)}`, cls: "u" };
  if (n < 0) return { text: `▼ ${num(-n)}`, cls: "d" };
  return { text: "—", cls: "f" };
}

export const plural = (n: number, one: string, many = `${one}s`) => `${num(n)} ${n === 1 ? one : many}`;
