import { REVALIDATE } from "./config";
import { dayKey } from "./days";
import type { CodeforcesRaw } from "./types";

const HANDLE = "Haunts";
export const CODEFORCES_URL = `https://codeforces.com/profile/${HANDLE}`;

async function api<T>(method: string): Promise<T | null> {
  const res = await fetch(`https://codeforces.com/api/${method}`, { next: { revalidate: REVALIDATE } });
  if (!res.ok) return null;
  const json = await res.json();
  return json.status === "OK" ? (json.result as T) : null;
}

/**
 * Official, documented API. Three calls — profile, rating history and
 * submissions — and all three must succeed, otherwise the caller falls
 * back to the committed snapshot. Never throws.
 */
export async function fetchCodeforces(): Promise<CodeforcesRaw | null> {
  try {
    type Info = { rating?: number; maxRating?: number; rank?: string };
    type Change = { contestName: string; rank: number; oldRating: number; newRating: number; ratingUpdateTimeSeconds: number };
    type Submission = { creationTimeSeconds: number };

    const [info, history, status] = await Promise.all([
      api<Info[]>(`user.info?handles=${HANDLE}`),
      api<Change[]>(`user.rating?handle=${HANDLE}`),
      api<Submission[]>(`user.status?handle=${HANDLE}`),
    ]);
    if (!info?.[0] || !history || !status) return null;

    const submissions: Record<string, number> = {};
    for (const s of status) {
      const key = dayKey(s.creationTimeSeconds * 1000);
      submissions[key] = (submissions[key] ?? 0) + 1;
    }

    return {
      rating: info[0].rating ?? null,
      maxRating: info[0].maxRating ?? null,
      rank: info[0].rank ?? null,
      history: history.map((h) => ({
        contest: h.contestName,
        rank: h.rank,
        oldRating: h.oldRating,
        newRating: h.newRating,
        day: dayKey(h.ratingUpdateTimeSeconds * 1000),
      })),
      submissions,
    };
  } catch {
    return null;
  }
}
