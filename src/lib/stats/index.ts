import fallback from "../../../data/stats-fallback.json";
import { fetchCodeforces } from "./codeforces";
import { fetchLeetCode } from "./leetcode";
import type { MarketsStats } from "./types";

// AtCoder is intentionally not integrated: Haunts has no rated
// contests there yet. See ARCHITECTURE.md §6 — revisit if that changes.

/**
 * Live figures, cached 24h by each adapter's fetch(). If either call
 * fails, that platform falls back to the last committed snapshot and
 * the page marks the whole section as non-live so it never claims a
 * stale number is fresh.
 */
export async function getMarketsStats(): Promise<MarketsStats> {
  const [leetcode, codeforces] = await Promise.all([fetchLeetCode(), fetchCodeforces()]);

  return {
    leetcode: leetcode ?? fallback.leetcode,
    codeforces: codeforces ?? fallback.codeforces,
    isFallback: !leetcode || !codeforces,
  };
}
