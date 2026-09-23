export type ActivitySource = "github" | "leetcode" | "codeforces" | "project";
export type SignalType = "positive" | "neutral" | "negative";

/** One transaction on the tape. The UI renders these and nothing else. */
export type ActivityEvent = {
  id: string;
  at: string; // ISO instant
  day: string; // "YYYY-MM-DD", IST
  timestamp: string; // "HH:MM:SS", IST
  source: ActivitySource;
  symbol: "GH" | "LC" | "CF" | "HV";
  title: string;
  description: string;
  signal?: string;
  signalType?: SignalType;
  detail?: {
    lines: string[];
    when: string; // "23 Sep 2026 · 22:31 IST"
    url?: string;
    linkLabel?: string;
  };
};

/** GET /api/activity returns exactly this. */
export type ActivityFeed = {
  mode: "live" | "demo";
  generatedAt: string; // ISO — when the sources were last read
  events: ActivityEvent[];
  summary: {
    pushes: number; // last 24 hours
    solved: number;
    prs: number;
    repos: number;
    cfLastChange: number | null;
    topRepo: string | null;
    week: number; // total over the 7-day chart
  };
  week: { label: string; count: number }[]; // 7 IST days, oldest first
  down: ("GitHub" | "LeetCode" | "Codeforces")[];
};
