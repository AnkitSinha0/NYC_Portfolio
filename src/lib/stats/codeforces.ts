import type { CodeforcesStats } from "./types";

const HANDLE = "Haunts";
const PROFILE_URL = `https://codeforces.com/profile/${HANDLE}`;

/**
 * Official, documented endpoint — the lowest-fragility of the two
 * adapters. Still never throws: a bad response resolves to null and
 * the caller falls back to data/stats-fallback.json.
 */
export async function fetchCodeforces(): Promise<CodeforcesStats | null> {
  try {
    const res = await fetch(
      `https://codeforces.com/api/user.info?handles=${HANDLE}`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return null;

    const json = await res.json();
    if (json.status !== "OK" || !json.result?.[0]) return null;

    const u = json.result[0];
    return {
      handle: HANDLE,
      profileUrl: PROFILE_URL,
      rating: typeof u.rating === "number" ? u.rating : null,
      maxRating: typeof u.maxRating === "number" ? u.maxRating : null,
      rank: typeof u.rank === "string" ? u.rank : null,
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
