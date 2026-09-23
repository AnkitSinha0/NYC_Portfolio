/** Days are keyed "YYYY-MM-DD" in IST throughout. */
export type DayCounts = Record<string, number>;

/** What the LeetCode adapter returns — raw figures, nothing derived. */
export type LeetCodeRaw = {
  solved: number;
  easy: number;
  medium: number;
  hard: number;
  totals: { easy: number; medium: number; hard: number };
  languages: { name: string; solved: number }[];
  maxStreak: number;
  activeDays: number;
  calendar: DayCounts;
  contest: {
    rating: number;
    maxRating: number;
    topPercent: number;
    attended: number;
    globalRanking: number;
    totalParticipants: number;
  } | null;
};

/** What the Codeforces adapter returns. */
export type CodeforcesRaw = {
  rating: number | null;
  maxRating: number | null;
  rank: string | null;
  history: { contest: string; rank: number; oldRating: number; newRating: number; day: string }[];
  submissions: DayCounts;
};

/** Shape of data/stats-fallback.json — the last committed snapshot. */
export type StatsSnapshot = {
  fetchedAt: string;
  leetcode: LeetCodeRaw;
  codeforces: CodeforcesRaw;
};
