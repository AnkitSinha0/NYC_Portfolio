import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { ExchangeMotion } from "@/components/ExchangeMotion";
import "@/styles/exchange.css";

export const metadata: Metadata = {
  title: "The Coding Exchange",
  description:
    "Ankit Sinha's competitive-programming practice — LeetCode streak and difficulty split, Codeforces rating, set as the markets page of The Ankit Times.",
  alternates: { canonical: "/markets" },
};

const TICKER: [string, string, "up" | "dn" | "fl", string][] = [
  ["LeetCode", "131", "up", "▲"], ["Streak", "64 D", "up", "▲"], ["Submissions", "685", "up", "▲"],
  ["Codeforces", "655", "fl", "—"], ["Easy", "64", "up", "▲"], ["Medium", "63", "up", "▲"],
  ["Hard", "4", "dn", "▼"], ["Active Days", "75", "up", "▲"], ["Contests", "1", "fl", "—"],
  ["Procrastination", "−15%", "dn", "▼"], ["Coffee", "+25%", "up", "▲"],
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Six months of practice as 26 weeks × 7 days. Seeded, so server and
 * client render the same cells: quiet, then the 64-day summer run,
 * then tapering.
 */
function heatCells() {
  const total = 26 * 7;
  let seed = 11;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const cells: { n: number; lvl: number; d: string }[] = [];
  for (let i = 0; i < total; i++) {
    const d = new Date(2026, 8, 18);
    d.setDate(d.getDate() - (total - 1 - i));
    let n = 0;
    if (i > 78 && i < 146) n = 1 + Math.floor(rnd() * 14);
    else if (i >= 146) n = rnd() > 0.55 ? 1 + Math.floor(rnd() * 9) : 0;
    else if (rnd() > 0.93) n = 1 + Math.floor(rnd() * 3);
    const lvl = n === 0 ? 0 : n > 20 ? 4 : n > 10 ? 3 : n > 4 ? 2 : 1;
    cells.push({ n, lvl, d: `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}` });
  }
  return cells;
}

const LADDER: [string, string, string, string?][] = [
  ["Master", "2100+", "#B8453A"],
  ["Candidate Master", "1900", "#8E5BC6"],
  ["Expert", "1600", "#4E7BD6"],
  ["Specialist", "1400", "#34A6A6"],
  ["Pupil", "1200", "#4E9A51", "next"],
  ["Newbie · you are here", "655", "#8C8375", "here"],
];

const SPARK =
  "M40,155 L70,153 L100,154 L130,152 L160,153 L190,151 L220,150 L250,120 L280,62 L310,28 L340,70 L370,96 L400,88 L430,118 L460,134 L490,142 L510,148";

export default function MarketsPage() {
  const tickerRow = TICKER.map(([name, v, cls, arrow]) => (
    <span className="tick-item" key={name}>
      {name} <span className={`v ${cls}`}>{v}</span> <span className={cls}>{arrow}</span>
    </span>
  ));

  return (
    <div className="cx">
      {/* ══ SHEET ══ */}
      <main className="stage">
        <div className="sheet">
          {/* masthead */}
          <div className="masthead">
            <div className="side">Vol. I &nbsp;No. 6</div>
            <h1><Link href="/">The Ankit Times</Link></h1>
            <div className="side r">
              Patna, India
              <br />
              Sep 18, 2026
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
          <div className="ticker" aria-label="Live practice ticker">
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
                  <div className="big" data-count="131">131</div>
                  <p className="note up">▲ Easy 64 · Med 63</p>
                </div>
                <div className="stat">
                  <span className="lbl"><i />Max Streak</span>
                  <div className="big"><span data-count="64">64</span> Days</div>
                  <p className="note">75 active days, 1 yr</p>
                </div>
                <div className="stat">
                  <span className="lbl">Contest</span>
                  <div className="big">Top <span data-count="29.13" data-dec="2">29.13</span>%</div>
                  <p className="note">1 rated round</p>
                </div>
              </div>

              <h4 className="sub-h">Problem Distribution</h4>
              <div className="dist">
                <div className="dist-row"><span>Easy</span><span className="track"><i className="fill" style={{ background: "var(--lc-easy)" }} data-w="100" /></span><span className="n">64</span></div>
                <div className="dist-row"><span>Medium</span><span className="track"><i className="fill" style={{ background: "var(--lc-med)" }} data-w="98" /></span><span className="n">63</span></div>
                <div className="dist-row"><span>Hard</span><span className="track"><i className="fill" style={{ background: "var(--lc-hard)" }} data-w="6" /></span><span className="n">4</span></div>
              </div>

              <h4 className="sub-h">Activity (Last 6 Months)</h4>
              <div className="heat" id="heat">
                {heatCells().map((c, i) => (
                  <i key={i} className={c.lvl ? `l${c.lvl}` : undefined} data-n={c.n} data-d={c.d} />
                ))}
              </div>
              <div className="heat-months">
                <span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span><span>AUG</span><span>SEP</span>
              </div>

              <h4 className="sub-h">Trailing Twelve Months</h4>
              <table className="mini">
                <thead><tr><th>Metric</th><th className="r">Value</th><th className="r">Note</th></tr></thead>
                <tbody>
                  <tr><td>Submissions</td><td className="r">685</td><td className="r ok">▲</td></tr>
                  <tr><td>Active days</td><td className="r">75</td><td className="r ok">▲</td></tr>
                  <tr><td>Longest streak</td><td className="r">64</td><td className="r ok">▲</td></tr>
                  <tr><td>Hard solved</td><td className="r">4</td><td className="r no">▼</td></tr>
                  <tr><td>Badge</td><td className="r">50 Days</td><td className="r f">2026</td></tr>
                </tbody>
              </table>
              <a className="view" href="https://leetcode.com/u/Haunts_01/" target="_blank" rel="noopener noreferrer">
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
                  <div className="big" data-count="655">655</div>
                  <p className="note">1 rated round</p>
                </div>
                <div className="stat">
                  <span className="lbl"><i />Max Rating</span>
                  <div className="big" data-count="655">655</div>
                  <p className="note">(Feb 2026)</p>
                </div>
                <div className="stat">
                  <span className="lbl">Rank</span>
                  <div className="big word">Newbie</div>
                  <p className="note">Climbing <span className="spec">→ Pupil</span></p>
                </div>
              </div>

              <div className="chartbox">
                <h5>Practice Volume — Trailing 12 Months</h5>
                <svg
                  viewBox="0 0 520 190"
                  role="img"
                  aria-label="Daily submission volume over twelve months: near flat until June, then a sustained sixty-four day run through July and August"
                >
                  <g stroke="#2C2820" strokeWidth="1">
                    <line x1="40" y1="20" x2="510" y2="20" /><line x1="40" y1="65" x2="510" y2="65" />
                    <line x1="40" y1="110" x2="510" y2="110" /><line x1="40" y1="155" x2="510" y2="155" />
                  </g>
                  <g fontSize="8.5" fill="#8C8375" textAnchor="end">
                    <text x="34" y="23">40</text><text x="34" y="68">30</text><text x="34" y="113">15</text><text x="34" y="158">0</text>
                  </g>
                  <path id="area" className="area" d={`${SPARK} L510,155 L40,155 Z`} />
                  <path id="spark" className="spark" d={SPARK} />
                  <g id="peak" className="peak">
                    <circle cx="310" cy="28" r="4" fill="#5FBF63" />
                    <line x1="310" y1="34" x2="310" y2="60" stroke="#5FBF63" strokeWidth="1" strokeDasharray="2 2" />
                    <text x="310" y="20" fontSize="8.5" fill="#E7DFCA" textAnchor="middle">42 · peak day</text>
                  </g>
                  <g fontSize="8.5" fill="#8C8375">
                    <text x="40" y="175">SEP &rsquo;25</text>
                    <text x="265" y="175" textAnchor="middle">JUN</text>
                    <text x="510" y="175" textAnchor="end">SEP &rsquo;26</text>
                  </g>
                </svg>
              </div>

              <h4 className="sub-h">Contest Stats</h4>
              <div className="stats open">
                <div className="stat"><span className="lbl">Rounds</span><div className="big sm">1</div></div>
                <div className="stat"><span className="lbl">Global Rank</span><div className="big sm">254,081</div></div>
                <div className="stat"><span className="lbl">Field</span><div className="big sm">883,546</div></div>
              </div>
              <h4 className="sub-h">Rank Ladder</h4>
              <div className="ladder">
                {LADDER.map(([name, rating, color, mod]) => (
                  <div
                    key={name}
                    className={mod ? `lad ${mod}` : "lad"}
                    style={{ "--c": color } as CSSProperties}
                  >
                    <span>{name}</span>
                    <b>{rating}</b>
                  </div>
                ))}
              </div>
              <a className="view" href="https://codeforces.com/profile/Haunts" target="_blank" rel="noopener noreferrer">
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

          {/* ══ BOTTOM ══ */}
          <div className="bottom">
            <div className="box">
              <h5>Market Summary</h5>
              <table className="summary">
                <thead><tr><th>Asset</th><th>Value</th><th>1W</th><th>1M</th><th>1Y</th></tr></thead>
                <tbody>
                  <tr><td>LeetCode solved</td><td>131</td><td className="u">▲ 9</td><td className="u">▲ 38</td><td className="u">▲ 131</td></tr>
                  <tr><td>Submissions</td><td>685</td><td className="u">▲ 31</td><td className="u">▲ 96</td><td className="u">▲ 685</td></tr>
                  <tr><td>Codeforces</td><td>655</td><td className="f">—</td><td className="f">—</td><td className="u">▲ 655</td></tr>
                  <tr><td>Max streak</td><td>64</td><td className="f">—</td><td className="u">▲ 14</td><td className="u">▲ 64</td></tr>
                  <tr><td>Hard solved</td><td>4</td><td className="f">—</td><td className="u">▲ 1</td><td className="u">▲ 4</td></tr>
                </tbody>
              </table>
              <p className="cut-cap">Deltas are since first rated activity. Nothing here is annualised.</p>
            </div>

            <div className="quote-box">
              <p>&ldquo;The market rewards those who show up.&rdquo;</p>
              <span className="sig">Ankit Sinha</span>
            </div>

            <div className="notes-col">
              <div className="box">
                <h5>This Month</h5>
                <ul className="check">
                  <li className="done"><span className="bx on" />Hold the daily streak</li>
                  <li className="done"><span className="bx on" />Ship HashVault dedup</li>
                  <li><span className="bx" />Clear 10 hard problems</li>
                  <li><span className="bx" />Enter a rated round</li>
                  <li><span className="bx" />Write one explanation</li>
                </ul>
              </div>
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
