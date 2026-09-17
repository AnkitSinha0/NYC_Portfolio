// Real Codeforces rank bands and their official colours.
const BANDS = [
  { name: "Legendary Grandmaster", min: 3000, color: "#B20000" },
  { name: "International Grandmaster", min: 2600, color: "#B20000" },
  { name: "Grandmaster", min: 2400, color: "#B20000" },
  { name: "Master", min: 2100, color: "#C58A1A" },
  { name: "Candidate Master", min: 1900, color: "#7C3AA8" },
  { name: "Expert", min: 1600, color: "#2A4FC4" },
  { name: "Specialist", min: 1400, color: "#28A0A0" },
  { name: "Pupil", min: 1200, color: "#2E8B57" },
  { name: "Newbie", min: 0, color: "#808080" },
] as const;

const CHART_TOP = 3200; // caps the open-ended top band to a fixed drawing height
const W = 300;
const H = 152;
const AXIS_X = 96;
const CHART_W = 190;
const CHART_TOP_Y = 8;
const CHART_BOTTOM_Y = 128;

function bandFor(rating: number) {
  return BANDS.find((b) => rating >= b.min) ?? BANDS[BANDS.length - 1];
}

/**
 * The Codeforces rank ladder, drawn with the platform's own colours,
 * with the current rating marked on it. Used in place of a rating-
 * over-time line while there is only one rated contest to plot.
 */
export function RatingLadder({
  rating,
  maxRating,
  handle,
}: {
  rating: number;
  maxRating: number;
  handle: string;
}) {
  const range = CHART_TOP;
  const yFor = (r: number) =>
    CHART_BOTTOM_Y - (Math.min(r, CHART_TOP) / range) * (CHART_BOTTOM_Y - CHART_TOP_Y);

  const boundaries = [...BANDS.map((b) => b.min), CHART_TOP].sort((a, b) => a - b);
  const rects = BANDS.map((band) => {
    const upperIdx = boundaries.indexOf(band.min) + 1;
    const upper = boundaries[upperIdx] ?? CHART_TOP;
    const y1 = yFor(upper);
    const y2 = yFor(band.min);
    return { ...band, y: y1, height: Math.max(y2 - y1, 1) };
  });

  const markerY = yFor(rating);
  const currentBand = bandFor(rating);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Codeforces rank ladder: ${handle} at ${rating}, rank ${currentBand.name}`} className="w-full h-auto">
      <g>
        {rects.map((r) => (
          <rect key={r.name} x={AXIS_X} y={r.y} width={CHART_W} height={r.height} fill={r.color} opacity={0.34} />
        ))}
      </g>
      <g fontFamily="var(--font-utility)" fontSize="8.5" fill="#c6bfb1" textAnchor="end">
        {rects
          .filter((r) => r.height > 10)
          .map((r) => (
            <text key={r.name} x={W - 8} y={r.y + Math.min(r.height / 2 + 3, r.height - 2)}>
              {r.name} {r.min || ""}
            </text>
          ))}
      </g>
      <line x1={AXIS_X - 10} y1={markerY} x2={AXIS_X + CHART_W - 44} y2={markerY} stroke="#FBFAF6" strokeWidth={2} />
      <circle cx={AXIS_X + 24} cy={markerY} r={5} fill="#FBFAF6" />
      <text x={AXIS_X - 16} y={markerY + 4} fontFamily="var(--font-utility)" fontSize="12" fontWeight={700} fill="#FBFAF6" textAnchor="end">
        {rating}
      </text>
      <text x={AXIS_X} y={H - 6} fontFamily="var(--font-utility)" fontSize="8.5" fill="#8F8779">
        Codeforces · {handle} · max {maxRating}
      </text>
    </svg>
  );
}
