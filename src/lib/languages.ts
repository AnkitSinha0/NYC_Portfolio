/**
 * Language Market data.
 *
 * `share`  — the language's percentage of weighted coding activity in
 *            the current 90-day window, where activity per commit is
 *            commits × 5 + changed files × 2 + changed lines × 0.1.
 * `change` — percentage points against the previous 90-day window.
 *
 * Frontend only for now: getLanguageMarket() returns SAMPLE figures,
 * and the page labels them as such. When the backend exists, replace
 * the body with a fetch of its JSON — same shape, `source: "github"` —
 * and the UI switches its label to "Live from GitHub" by itself.
 */

export type LanguageShare = {
  name: string;
  share: number; // 0–100
  change: number; // percentage points vs the previous window
};

export type LanguageMarket = {
  period: "90d";
  source: "sample" | "github";
  languages: LanguageShare[];
};

const SAMPLE: LanguageMarket = {
  period: "90d",
  source: "sample",
  languages: [
    { name: "Go", share: 41, change: 12 },
    { name: "TypeScript", share: 29, change: 4 },
    { name: "Java", share: 15, change: -8 },
    { name: "Python", share: 9, change: 0 },
    { name: "C++", share: 6, change: -8 },
  ],
};

export async function getLanguageMarket(): Promise<LanguageMarket> {
  // Later: const res = await fetch(`${API}/languages?period=90d`, { next: { revalidate: 3600 } });
  //        return (await res.json()) as LanguageMarket;
  return SAMPLE;
}
