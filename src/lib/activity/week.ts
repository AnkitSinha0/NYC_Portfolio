import { addDays, weekday } from "../stats/days";

/** Seven IST days ending today, oldest first, summed across sources. */
export function weekFrom(dailies: Record<string, number>[], today: string) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(today, i - 6);
    return { label: weekday(d), count: dailies.reduce((a, daily) => a + (daily[d] ?? 0), 0) };
  });
}
