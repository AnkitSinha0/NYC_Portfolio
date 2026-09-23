const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "YYYY-MM-DD" for the IST calendar day containing this instant. */
export function dayKey(ms: number): string {
  return new Date(ms + IST_OFFSET_MS).toISOString().slice(0, 10);
}

/** The key `n` days after `key` (negative for before). */
export function addDays(key: string, n: number): string {
  return new Date(Date.parse(`${key}T00:00:00Z`) + n * DAY_MS).toISOString().slice(0, 10);
}

/** "23 Sep 2026" */
export function formatDay(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** "Sep 23, 2026" — the masthead's style. */
export function formatDateline(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export function monthOf(key: string): string {
  return MONTHS[Number(key.slice(5, 7)) - 1];
}

/** "HH:MM:SS" on the IST clock. */
export function timeIST(ms: number): string {
  return new Date(ms + IST_OFFSET_MS).toISOString().slice(11, 19);
}

/** "23 Sep 2026 · 22:31 IST" */
export function stampIST(ms: number): string {
  return `${formatDay(dayKey(ms))} · ${timeIST(ms).slice(0, 5)} IST`;
}

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
export function weekday(key: string): string {
  return WEEKDAYS[new Date(`${key}T00:00:00Z`).getUTCDay()];
}
