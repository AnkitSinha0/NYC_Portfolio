import { REVALIDATE } from "./config";
import { dayKey } from "./days";
import type { LeetCodeRaw } from "./types";

const HANDLE = "Haunts_01";
export const LEETCODE_URL = `https://leetcode.com/u/${HANDLE}/`;

const QUERY = `
  query profile($username: String!) {
    allQuestionsCount { difficulty count }
    matchedUser(username: $username) {
      submitStats { acSubmissionNum { difficulty count } }
      languageProblemCount { languageName problemsSolved }
      userCalendar { streak totalActiveDays submissionCalendar }
    }
    userContestRanking(username: $username) {
      rating topPercentage attendedContestsCount globalRanking totalParticipants
    }
    userContestRankingHistory(username: $username) { attended rating }
  }
`;

type Count = { difficulty: string; count: number };
const byDifficulty = (rows: Count[] = []) =>
  Object.fromEntries(rows.map((r) => [r.difficulty.toLowerCase(), r.count])) as Record<string, number>;

/**
 * Unofficial GraphQL endpoint — rejects requests without a
 * browser-like Referer. That quirk is isolated here; nothing else in
 * the app knows about it. Never throws: any failure resolves to null.
 */
export async function fetchLeetCode(): Promise<LeetCodeRaw | null> {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", Referer: LEETCODE_URL },
      body: JSON.stringify({ query: QUERY, variables: { username: HANDLE } }),
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;

    const { data } = await res.json();
    const user = data?.matchedUser;
    if (!user) return null;

    const solved = byDifficulty(user.submitStats?.acSubmissionNum);
    const totals = byDifficulty(data.allQuestionsCount);

    // Keys arrive as unix seconds at UTC midnight.
    const calendar: Record<string, number> = {};
    const rawCalendar: Record<string, number> = JSON.parse(user.userCalendar?.submissionCalendar ?? "{}");
    for (const [ts, n] of Object.entries(rawCalendar)) {
      const key = dayKey(Number(ts) * 1000);
      calendar[key] = (calendar[key] ?? 0) + n;
    }

    const ranking = data.userContestRanking;
    const attended: { attended: boolean; rating: number }[] = data.userContestRankingHistory ?? [];
    const peak = Math.max(0, ...attended.filter((c) => c.attended).map((c) => c.rating));

    return {
      solved: solved.all ?? 0,
      easy: solved.easy ?? 0,
      medium: solved.medium ?? 0,
      hard: solved.hard ?? 0,
      totals: { easy: totals.easy ?? 0, medium: totals.medium ?? 0, hard: totals.hard ?? 0 },
      languages: (user.languageProblemCount ?? [])
        .map((l: { languageName: string; problemsSolved: number }) => ({
          name: l.languageName,
          solved: l.problemsSolved,
        }))
        .sort((a: { solved: number }, b: { solved: number }) => b.solved - a.solved),
      maxStreak: user.userCalendar?.streak ?? 0,
      activeDays: user.userCalendar?.totalActiveDays ?? 0,
      calendar,
      contest: ranking
        ? {
            rating: Math.round(ranking.rating),
            maxRating: Math.round(Math.max(peak, ranking.rating)),
            topPercent: ranking.topPercentage,
            attended: ranking.attendedContestsCount,
            globalRanking: ranking.globalRanking,
            totalParticipants: ranking.totalParticipants,
          }
        : null,
    };
  } catch {
    return null;
  }
}
