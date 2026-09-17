import type { LeetCodeStats } from "./types";

const HANDLE = "Haunts_01";
const PROFILE_URL = `https://leetcode.com/u/${HANDLE}/`;

const QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      submitStats {
        acSubmissionNum { difficulty count }
      }
      userCalendar {
        streak
        totalActiveDays
        submissionCalendar
      }
    }
    userContestRanking(username: $username) {
      rating
      topPercentage
      attendedContestsCount
      globalRanking
    }
  }
`;

/**
 * Unofficial GraphQL endpoint — rejects requests without a
 * browser-like Referer. That quirk is isolated here; nothing else in
 * the app knows about it. Never throws: any failure resolves to null.
 */
export async function fetchLeetCode(): Promise<LeetCodeStats | null> {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: PROFILE_URL,
      },
      body: JSON.stringify({ query: QUERY, variables: { username: HANDLE } }),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;

    const json = await res.json();
    const user = json.data?.matchedUser;
    if (!user) return null;

    const byDifficulty = Object.fromEntries(
      (user.submitStats?.acSubmissionNum ?? []).map(
        (d: { difficulty: string; count: number }) => [d.difficulty.toLowerCase(), d.count],
      ),
    ) as Record<string, number>;

    const calendarRaw: Record<string, number> = user.userCalendar?.submissionCalendar
      ? JSON.parse(user.userCalendar.submissionCalendar)
      : {};
    const submissions = Object.values(calendarRaw).reduce((a, b) => a + b, 0);

    const ranking = json.data?.userContestRanking;

    return {
      handle: HANDLE,
      profileUrl: PROFILE_URL,
      solved: byDifficulty.all ?? null,
      byDifficulty: {
        easy: byDifficulty.easy ?? 0,
        medium: byDifficulty.medium ?? 0,
        hard: byDifficulty.hard ?? 0,
      },
      maxStreak: user.userCalendar?.streak ?? null,
      activeDays: user.userCalendar?.totalActiveDays ?? null,
      submissions: submissions || null,
      calendar: calendarRaw,
      contest: ranking
        ? {
            rating: Math.round(ranking.rating * 10) / 10,
            topPercent: ranking.topPercentage,
            attended: ranking.attendedContestsCount,
            globalRanking: ranking.globalRanking,
          }
        : null,
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
