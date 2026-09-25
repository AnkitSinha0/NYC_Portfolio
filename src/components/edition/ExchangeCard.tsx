import Link from "next/link";
import { num, type Stats } from "@/lib/stats";

/** Weekly submissions as a printed market chart, 52 weeks wide. */
function WeeklyChart({ weekly, labels }: { weekly: number[]; labels: Stats["weeklyLabels"] }) {
  const W = 600;
  const top = 16;
  const base = 120;
  const max = Math.max(1, ...weekly);
  const x = (i: number) => (i * W) / (weekly.length - 1);
  const y = (v: number) => base - (v / max) * (base - top);
  const line = weekly.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const peak = weekly.indexOf(max);
  const px = x(peak);

  return (
    <svg viewBox={`0 0 ${W} 146`} className="exch-svg" role="img" aria-label={`Weekly submissions over the last year, peaking at ${max} in one week`}>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1="0" x2={W} y1={base - f * (base - top)} y2={base - f * (base - top)} className="grid" />
      ))}
      <line x1="0" x2={W} y1={base} y2={base} className="axis" />
      <path d={`${line} L${W},${base} L0,${base} Z`} className="area" />
      <path d={line} className="line" pathLength={1} />
      <circle cx={px} cy={y(max)} r="4.5" className="peak" />
      <text x={Math.min(Math.max(px, 40), W - 40)} y={y(max) - 10} textAnchor="middle" className="peak-label">
        {max} · peak week
      </text>
      <text x="0" y="140" className="tick">{labels.start}</text>
      <text x={W / 2} y="140" textAnchor="middle" className="tick">{labels.mid}</text>
      <text x={W} y="140" textAnchor="end" className="tick">{labels.end}</text>
    </svg>
  );
}

/**
 * The front page's Coding Exchange: a newspaper market section that is
 * one big invitation to open the full exchange. Colour marks data only —
 * green solved, blue Codeforces, orange streak, red never unless falling.
 */
export function ExchangeCard({ stats }: { stats: Stats }) {
  const { lc, cf } = stats;
  const solvedParts = [
    { n: lc.easy, cls: "easy" },
    { n: lc.medium, cls: "med" },
    { n: lc.hard, cls: "hard" },
  ];
  const cfSpan = cf.nextRankAt ? cf.nextRankAt - cf.rankFloor : 1;
  const cfProgress = cf.nextRankAt ? Math.min(1, (cf.rating - cf.rankFloor) / cfSpan) : 1;
  const streakRatio = lc.maxStreak ? Math.min(1, lc.currentStreak / lc.maxStreak) : 0;
  const lastChange = cf.lastChange ?? 0;

  return (
    <Link href="/markets" className="exch-card" aria-label="Open the Coding Exchange: live LeetCode and Codeforces figures">
      <div className="sec-head">
        <h2 id="exch-hed">Coding Exchange</h2>
        <span className="exch-live">
          <i aria-hidden="true" /> {stats.isFallback ? "Last known" : "Live"} · {stats.asOfLabel}
        </span>
      </div>
      <p className="exch-dek">Tracking progress in a volatile, rewarding market.</p>

      <div className="exch-quotes">
        <div className="q lc">
          <p className="sym">LeetCode</p>
          <b>{lc.solved}</b>
          <p className="unit">problems solved</p>
          <div className="qbar split" aria-label={`Easy ${lc.easy}, medium ${lc.medium}, hard ${lc.hard}`}>
            {solvedParts.map((p) => (
              <i key={p.cls} className={p.cls} style={{ flexGrow: Math.max(p.n, 0.0001) }} />
            ))}
          </div>
          <p className="cap">
            {lc.easy} easy · {lc.medium} medium · {lc.hard} hard
            {lc.contest && <><br />contest {num(lc.contest.rating)} · top {lc.contest.topPercent}%</>}
          </p>
        </div>

        <div className="q cf">
          <p className="sym">Codeforces</p>
          <b>{num(cf.rating)}</b>
          <p className="unit">rating · {cf.rank}</p>
          <div className="qbar" aria-label={`${Math.round(cfProgress * 100)}% of the way to ${cf.nextRank ?? "the top"}`}>
            <i style={{ width: `${cfProgress * 100}%` }} />
          </div>
          <p className="cap">
            {cf.nextRankAt ? `${cf.nextRankAt - cf.rating} to ${cf.nextRank}` : "Top band"} · {cf.rounds} rated rounds
            <br />
            <span className={lastChange >= 0 ? "up" : "down"}>
              {lastChange >= 0 ? "▲ +" : "▼ "}
              {lastChange}
            </span>{" "}
            last round
          </p>
        </div>

        <div className="q st">
          <p className="sym">Streak</p>
          <b>{lc.currentStreak}</b>
          <p className="unit">days running</p>
          <div className="qbar" aria-label={`Current streak ${lc.currentStreak} of best ${lc.maxStreak}`}>
            <i style={{ width: `${streakRatio * 100}%` }} />
          </div>
          <p className="cap">
            best {lc.maxStreak} days
            <br />
            {lc.act30} active of the last 30
          </p>
        </div>
      </div>

      <div className="exch-lower">
        <figure className="exch-chart">
          <figcaption>
            <span>Weekly submission activity</span>
            <span>LeetCode + Codeforces · 52 weeks</span>
          </figcaption>
          <WeeklyChart weekly={stats.weekly} labels={stats.weeklyLabels} />
        </figure>
        <aside className="exch-ad" aria-hidden="true">
          <b className="w1">Build</b>
          <b className="w2">Solve</b>
          <b className="w3">Learn</b>
          <b className="w4">Repeat</b>
          <span>The only index that matters</span>
        </aside>
      </div>

      <span className="exch-cta">
        View the full exchange <i aria-hidden="true">→</i>
      </span>
    </Link>
  );
}
