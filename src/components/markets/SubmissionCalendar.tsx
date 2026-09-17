const WEEKS = 53;
const DAYS = 7;
const CELL = 11;
const GAP = 2;

function quantile(count: number, max: number) {
  if (count <= 0) return 0;
  if (max <= 0) return 1;
  const ratio = count / max;
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;
  return 1;
}

const LEVEL_FILL = ["#221F1A", "#3E3A31", "#645E51", "#948C7B", "#D8D1C0"];

/**
 * Server-rendered SVG submission heatmap — no client JS, no charting
 * library. Reads straight from the LeetCode submissionCalendar map
 * (unix-day-seconds -> count), real data or the committed fallback.
 */
export function SubmissionCalendar({
  calendar,
  ariaLabel,
}: {
  calendar: Record<string, number>;
  ariaLabel: string;
}) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const totalDays = WEEKS * DAYS;
  const start = new Date(today);
  start.setUTCDate(start.getUTCDate() - (totalDays - 1));
  // Align to the most recent Sunday-start grid.
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());

  const counts: number[] = [];
  const cursor = new Date(start);
  for (let i = 0; i < totalDays; i++) {
    const dayStart = Math.floor(cursor.getTime() / 1000);
    // LeetCode buckets by UTC day-start; match within a day window.
    let count = 0;
    for (const [key, value] of Object.entries(calendar)) {
      const t = Number(key);
      if (t >= dayStart && t < dayStart + 86400) count += value;
    }
    counts.push(count);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  const max = Math.max(1, ...counts);
  const width = WEEKS * (CELL + GAP) - GAP;
  const height = DAYS * (CELL + GAP) - GAP;

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel} className="w-full h-auto block">
        {counts.map((c, i) => {
          const week = Math.floor(i / DAYS);
          const day = i % DAYS;
          const level = quantile(c, max);
          return (
            <rect
              key={i}
              x={week * (CELL + GAP)}
              y={day * (CELL + GAP)}
              width={CELL}
              height={CELL}
              fill={LEVEL_FILL[level]}
            />
          );
        })}
      </svg>
      <div className="flex items-center gap-1.5 mt-2 text-[9px] tracking-[0.1em] uppercase text-press-soft">
        <span>Less</span>
        {LEVEL_FILL.map((c) => (
          <i key={c} className="w-2 h-2 block" style={{ background: c }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
