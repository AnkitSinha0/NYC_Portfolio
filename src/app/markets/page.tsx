import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { ActivityFloor } from "@/components/ActivityFloor";
import { ContestCalendar } from "@/components/ContestCalendar";
import { ExchangeMotion } from "@/components/ExchangeMotion";
import { LanguageMarket } from "@/components/LanguageMarket";
import { MarketSentiment } from "@/components/MarketSentiment";
import { getActivity } from "@/lib/activity";
import { getContests } from "@/lib/contests";
import { getLanguageMarket } from "@/lib/languages";
import { marketSentiment } from "@/lib/sentiment";
import { CODEFORCES_URL, LEETCODE_URL, delta, getStats, num, plural } from "@/lib/stats";
import "@/styles/exchange.css";

export const metadata: Metadata = {
  title: "The Coding Exchange",
  description:
    "Ankit Sinha's competitive-programming practice — live LeetCode streak and difficulty split, Codeforces rating, set as the markets page of The Ankit Times.",
  alternates: { canonical: "/markets" },
};

// Keep in step with REVALIDATE in src/lib/stats/config.ts (must be a literal here).
export const revalidate = 3600;

type Tick = [string, string, "up" | "dn" | "fl", string];

/** ▲ when the last 30 days beat the 30 before, ▼ when they fell short. */
function trend(now: number, before: number): ["up" | "dn" | "fl", string] {
  if (now > before) return ["up", "▲"];
  if (now < before) return ["dn", "▼"];
  return ["fl", "—"];
}

/** Weekly volume as chart geometry inside the 520×190 plot: x 40→510, y 155 (zero) → 20. */
function volumeChart(weekly: number[]) {
  const peak = Math.max(...weekly);
  const top = Math.max(15, Math.ceil(peak / 15) * 15);
  const x = (i: number) => 40 + (i * 470) / (weekly.length - 1);
  const y = (v: number) => 155 - (v / top) * 135;
  const line = weekly.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const peakIndex = weekly.indexOf(peak);
  return {
    line,
    area: `${line} L510,155 L40,155 Z`,
    ticks: [top, (top * 2) / 3, top / 3, 0].map((v) => ({ v: Math.round(v), y: y(v) })),
    peak: { x: x(peakIndex), y: y(peak), v: peak },
  };
}

export default async function MarketsPage() {
  const [s, activity, languages, contests] = await Promise.all([
    getStats(),
    getActivity(),
    getLanguageMarket(),
    getContests(),
  ]);
  const renderedAt = Date.parse(activity.generatedAt);
  const sentiment = marketSentiment(s, activity);
  const { lc, cf } = s;
  const contest = lc.contest;

  const [subCls, subArrow] = trend(lc.sub30, lc.subPrev30);
  const [actCls, actArrow] = trend(lc.act30, lc.actPrev30);
  const cfMove = cf.lastChange ?? 0;
  const ticker: Tick[] = [
    ["LeetCode", num(lc.solved), lc.sub7 > 0 ? "up" : "fl", lc.sub7 > 0 ? "▲" : "—"],
    ["Streak", `${lc.currentStreak} D`, lc.currentStreak > 0 ? "up" : "dn", lc.currentStreak > 0 ? "▲" : "▼"],
    ["Submissions", num(lc.sub365), subCls, subArrow],
    ["Codeforces", num(cf.rating), cfMove > 0 ? "up" : cfMove < 0 ? "dn" : "fl", cfMove > 0 ? "▲" : cfMove < 0 ? "▼" : "—"],
    ["Easy", num(lc.easy), "fl", "·"],
    ["Medium", num(lc.medium), "fl", "·"],
    ["Hard", num(lc.hard), "fl", "·"],
    ["Active Days", num(lc.act365), actCls, actArrow],
    ["Contests", num(cf.rounds + (contest?.attended ?? 0)), "fl", "—"],
    ["Procrastination", "−15%", "dn", "▼"],
    ["Coffee", "+25%", "up", "▲"],
  ];
  const tickerRow = ticker.map(([name, v, cls, arrow]) => (
    <span className="tick-item" key={name}>
      {name} <span className={`v ${cls}`}>{v}</span> <span className={cls}>{arrow}</span>
    </span>
  ));

  const maxDiff = Math.max(lc.easy, lc.medium, lc.hard, 1);
  const chart = volumeChart(s.weekly);
  const summary: [string, number, number, number, number][] = [
    ["LeetCode submissions", lc.sub365, lc.sub7, lc.sub30, lc.sub365],
    ["Active days", lc.act365, lc.act7, lc.act30, lc.act365],
    ["Codeforces rating", cf.rating, cf.w7.change, cf.w30.change, cf.w365.change],
    ["Codeforces rounds", cf.rounds, cf.w7.rounds, cf.w30.rounds, cf.w365.rounds],
    ["Codeforces submissions", cf.subs365, cf.subs7, cf.subs30, cf.subs365],
  ];

  return (
    <div className="cx">
      <main className="stage">
        <div className="sheet">
          {/* masthead */}
          <div className="masthead">
            <div className="side">Vol. I &nbsp;No. 6</div>
            <h1><Link href="/">The Ankit Times</Link></h1>
            <div className="side r">
              Patna, India
              <br />
              {s.dateline}
            </div>
          </div>
          <hr className="rule-thick" />

          <div className="headbar">
            <div>
              <h2>
                The Coding
                <br />
                Exchange
              </h2>
              <p className="dek">Tracking progress in a volatile, rewarding market.</p>
              <p className="asof">
                {s.isFallback
                  ? `Last known figures, ${s.asOfLabel} — live feed unavailable`
                  : `Live · refreshed hourly · ${s.asOfLabel}`}
              </p>
            </div>
            <div>
              <p className="pull">
                Discipline compounds faster than motivation.<cite>— Ankit Sinha</cite>
              </p>
            </div>
            <div className="cutwrap">
              <div className="cut">
                <b>
                  BUILD
                  <br />
                  SOLVE
                  <br />
                  LEARN
                  <br />
                  REPEAT
                </b>
              </div>
              <p className="cut-cap">Fig. 1 — The only index that matters.</p>
            </div>
          </div>

          {/* ══ TICKER ══ */}
          <div className="ticker" aria-label="Practice ticker">
            <div className="tick-track">
              {tickerRow}
              <span style={{ display: "contents" }} aria-hidden="true">
                {tickerRow}
              </span>
            </div>
          </div>

          {/* ══ PANELS ══ */}
          <div className="panels">
            {/* LEETCODE */}
            <section className="panel rise">
              <div className="p-head">
                <svg className="logo" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M18 4 L8 14.5 a4 4 0 0 0 0 5.5 L18 30" fill="none" stroke="#C08A2A" strokeWidth="3.2" strokeLinecap="round" />
                  <path d="M13 17 H27" fill="none" stroke="#1A1712" strokeWidth="3.2" strokeLinecap="round" />
                  <path d="M18 4 L24 10" fill="none" stroke="#6C6353" strokeWidth="3.2" strokeLinecap="round" />
                </svg>
                <div>
                  <h3>LeetCode</h3>
                  <p className="sub">Daily. Consistent. Better.</p>
                </div>
              </div>
              <div className="stats">
                <div className="stat">
                  <span className="lbl">Solved</span>
                  <div className="big" data-count={lc.solved}>{num(lc.solved)}</div>
                  <p className="note up">▲ Easy {lc.easy} · Med {lc.medium}</p>
                </div>
                <div className="stat">
                  <span className="lbl"><i />Max Streak</span>
                  <div className="big"><span data-count={lc.maxStreak}>{lc.maxStreak}</span> Days</div>
                  <p className="note">{lc.activeDays} active days, 1 yr</p>
                </div>
                <div className="stat">
                  <span className="lbl">Contest</span>
                  {contest ? (
                    <>
                      <div className="big">
                        Top <span data-count={contest.topPercent} data-dec="2">{contest.topPercent.toFixed(2)}</span>%
                      </div>
                      <p className="note">{plural(contest.attended, "rated round")}</p>
                    </>
                  ) : (
                    <>
                      <div className="big">—</div>
                      <p className="note">No rated round yet</p>
                    </>
                  )}
                </div>
              </div>

              <h4 className="sub-h">Problem Distribution</h4>
              <div className="dist">
                {(
                  [
                    ["Easy", lc.easy, "var(--lc-easy)"],
                    ["Medium", lc.medium, "var(--lc-med)"],
                    ["Hard", lc.hard, "var(--lc-hard)"],
                  ] as const
                ).map(([label, n, color]) => (
                  <div className="dist-row" key={label}>
                    <span>{label}</span>
                    <span className="track">
                      <i className="fill" style={{ background: color }} data-w={Math.round((n / maxDiff) * 100)} />
                    </span>
                    <span className="n">{n}</span>
                  </div>
                ))}
              </div>

              <h4 className="sub-h">Activity (Last 6 Months)</h4>
              <div className="heat" id="heat">
                {lc.heat.map((c, i) => (
                  <i key={i} className={c.lvl ? `l${c.lvl}` : undefined} data-n={c.n} data-d={c.d} />
                ))}
              </div>
              <div className="heat-months">
                {lc.heatMonths.map((m, i) => (
                  <span key={i}>{m}</span>
                ))}
              </div>

              <h4 className="sub-h">Trailing Twelve Months</h4>
              <table className="mini">
                <thead><tr><th>Metric</th><th className="r">Value</th><th className="r">Note</th></tr></thead>
                <tbody>
                  <tr><td>Submissions</td><td className="r">{num(lc.sub365)}</td><td className={`r ${subCls === "dn" ? "no" : "ok"}`}>{subArrow}</td></tr>
                  <tr><td>Active days</td><td className="r">{lc.act365}</td><td className={`r ${actCls === "dn" ? "no" : "ok"}`}>{actArrow}</td></tr>
                  <tr><td>Longest streak</td><td className="r">{lc.maxStreak}</td><td className="r f">best</td></tr>
                  <tr><td>Current streak</td><td className="r">{lc.currentStreak}</td><td className="r f">live</td></tr>
                  <tr><td>Hard solved</td><td className="r">{lc.hard}</td><td className="r f">of {num(lc.totals.hard)}</td></tr>
                </tbody>
              </table>
              <p className="cut-cap">Arrows compare the last 30 days with the 30 before.</p>
              <a className="view" href={LEETCODE_URL} target="_blank" rel="noopener noreferrer">
                View Profile ↗
              </a>
            </section>

            {/* CODEFORCES */}
            <section className="panel dark rise">
              <div className="p-head">
                <svg className="logo" viewBox="0 0 32 32" aria-hidden="true">
                  <rect x="3" y="12" width="6.5" height="17" rx="1.5" fill="#E0665A" />
                  <rect x="12.75" y="4" width="6.5" height="25" rx="1.5" fill="#F0C447" />
                  <rect x="22.5" y="16" width="6.5" height="13" rx="1.5" fill="#6E9BD6" />
                </svg>
                <div>
                  <h3>Codeforces</h3>
                  <p className="sub">Rating is a journey.</p>
                </div>
              </div>
              <div className="stats">
                <div className="stat">
                  <span className="lbl">Current Rating</span>
                  <div className="big" data-count={cf.rating}>{num(cf.rating)}</div>
                  <p className="note">{plural(cf.rounds, "rated round")}</p>
                </div>
                <div className="stat">
                  <span className="lbl"><i />Max Rating</span>
                  <div className="big" data-count={cf.maxRating}>{num(cf.maxRating)}</div>
                  <p className="note">({cf.maxRatingMonth})</p>
                </div>
                <div className="stat">
                  <span className="lbl">Rank</span>
                  <div className="big word">{cf.rank}</div>
                  {cf.nextRank && (
                    <p className="note">Climbing <span className="spec">→ {cf.nextRank}</span></p>
                  )}
                </div>
              </div>

              <div className="chartbox">
                <h5>Practice Volume — Weekly, Trailing 12 Months</h5>
                <svg
                  viewBox="0 0 520 190"
                  role="img"
                  aria-label={`Weekly submissions across LeetCode and Codeforces over the last twelve months, peaking at ${chart.peak.v} in one week`}
                >
                  <g stroke="#2C2820" strokeWidth="1">
                    {chart.ticks.map((t) => (
                      <line key={t.v} x1="40" y1={t.y} x2="510" y2={t.y} />
                    ))}
                  </g>
                  <g fontSize="8.5" fill="#8C8375" textAnchor="end">
                    {chart.ticks.map((t) => (
                      <text key={t.v} x="34" y={t.y + 3}>{t.v}</text>
                    ))}
                  </g>
                  <path id="area" className="area" d={chart.area} />
                  <path id="spark" className="spark" d={chart.line} pathLength={1} />
                  <g id="peak" className="peak">
                    <circle cx={chart.peak.x} cy={chart.peak.y} r="4" fill="#5FBF63" />
                    <text
                      x={Math.min(Math.max(chart.peak.x, 70), 480)}
                      y={chart.peak.y - 9}
                      fontSize="8.5"
                      fill="#E7DFCA"
                      textAnchor="middle"
                    >
                      {chart.peak.v} · peak week
                    </text>
                  </g>
                  <g fontSize="8.5" fill="#8C8375">
                    <text x="40" y="175">{s.weeklyLabels.start}</text>
                    <text x="275" y="175" textAnchor="middle">{s.weeklyLabels.mid}</text>
                    <text x="510" y="175" textAnchor="end">{s.weeklyLabels.end}</text>
                  </g>
                </svg>
              </div>

              <h4 className="sub-h">Contest Stats</h4>
              <div className="stats open">
                <div className="stat"><span className="lbl">Rounds</span><div className="big sm">{cf.rounds}</div></div>
                <div className="stat"><span className="lbl">Best Rank</span><div className="big sm">{cf.bestRank ? num(cf.bestRank) : "—"}</div></div>
                <div className="stat">
                  <span className="lbl">Last Change</span>
                  <div className="big sm">{cf.lastChange === null ? "—" : `${cf.lastChange > 0 ? "+" : ""}${cf.lastChange}`}</div>
                </div>
              </div>
              <h4 className="sub-h">Rank Ladder</h4>
              <div className="ladder">
                {cf.ladder.map((r) => (
                  <div
                    key={r.name}
                    className={r.mod ? `lad ${r.mod}` : "lad"}
                    style={{ "--c": r.color } as CSSProperties}
                  >
                    <span>{r.name}</span>
                    <b>{r.value}</b>
                  </div>
                ))}
              </div>
              <a className="view" href={CODEFORCES_URL} target="_blank" rel="noopener noreferrer">
                View Profile ↗
              </a>
            </section>
          </div>

          {/* ══ ADS ══ */}
          <div className="ads">
            <div className="ad photo">
              <h4>
                Invest in
                <br />
                a Better You.
              </h4>
              <p className="fine">Consistency yields higher returns.</p>
              <span className="tagbox">A Long-Term Play</span>
            </div>
            <div className="ad">
              <h4>
                LeetCode. Codeforces.
                <br />
                Real Problems. Real Growth.
              </h4>
              <p className="fine">Not financial advice.</p>
            </div>
            <div className="ad">
              <h4 className="serif">
                Discipline
                <br />
                Compounds.
              </h4>
              <p className="hand">
                Solve today
                <br />
                so tomorrow
                <br />
                feels easier.
              </p>
            </div>
          </div>

          {/* ══ DEVELOPER EXCHANGE — live activity tape ══ */}
          <ActivityFloor initial={activity} />

          {/* ══ BOTTOM ══ */}
          <div className="bottom">
            <div className="left-col">
              <div className="box">
                <h5>Market Summary</h5>
                <table className="summary">
                  <thead><tr><th>Asset</th><th>Value</th><th>1W</th><th>1M</th><th>1Y</th></tr></thead>
                  <tbody>
                    {summary.map(([label, value, ...windows]) => (
                      <tr key={label}>
                        <td>{label}</td>
                        <td>{num(value)}</td>
                        {windows.map((w, i) => {
                          const d = delta(w);
                          return <td key={i} className={d.cls}>{d.text}</td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="cut-cap">
                  Windows are the trailing 7, 30 and 365 days; rating columns show the change over each.
                </p>
              </div>
              <ContestCalendar contests={contests} now={renderedAt} />
            </div>

            <div className="mid-col">
              <LanguageMarket market={languages} />
              <div className="quote-box">
                <p>&ldquo;The market rewards those who show up.&rdquo;</p>
                <span className="sig">Ankit Sinha</span>
              </div>
            </div>

            <div className="notes-col">
              <MarketSentiment sentiment={sentiment} />
              <div className="sticky"><p>Progress &gt; Perfection</p></div>
              <div className="sticky b">
                <p>
                  Same Bytes.
                  <br />
                  Different Stories.
                </p>
              </div>
            </div>
          </div>

          <div className="sheet-foot">
            <span className="hand">Not just a portfolio. A work in progress.</span>
            <span className="line" />
            <Link className="url" href="/">ANKITSIN.IN</Link>
          </div>
        </div>
      </main>

      <div className="tip" id="tip" role="status" aria-live="polite" />
      <ExchangeMotion />
    </div>
  );
}
