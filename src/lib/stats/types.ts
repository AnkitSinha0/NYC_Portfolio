export type CodeforcesStats = {
  handle: string;
  profileUrl: string;
  rating: number | null;
  maxRating: number | null;
  rank: string | null;
  updatedAt: string; // ISO
};

export type LeetCodeStats = {
  handle: string;
  profileUrl: string;
  solved: number | null;
  byDifficulty: { easy: number; medium: number; hard: number };
  maxStreak: number | null;
  activeDays: number | null;
  submissions: number | null; // trailing 12 months, summed from the calendar
  calendar: Record<string, number>; // unix-day-string -> submission count
  contest: {
    rating: number;
    topPercent: number;
    attended: number;
    globalRanking: number;
  } | null;
  updatedAt: string;
};

export type MarketsStats = {
  leetcode: LeetCodeStats;
  codeforces: CodeforcesStats;
  isFallback: boolean;
};
