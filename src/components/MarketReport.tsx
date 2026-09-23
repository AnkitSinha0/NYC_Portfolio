import Link from "next/link";
import { num, plural, type Stats } from "@/lib/stats";

const pct = (n: number, total: number) => (total ? `${((n / total) * 100).toFixed(1)}%` : "—");

/**
 * Page 3 of the Sunday Edition. Every figure and every claim in the
 * prose is computed from live stats, so the report never asserts a
 * trend the numbers no longer show.
 */
export function MarketReport({ stats }: { stats: Stats }) {
  const { lc, cf } = stats;
  const rising = lc.sub30 >= lc.subPrev30;
  const contest = lc.contest;
  const totalAvail = lc.totals.easy + lc.totals.medium + lc.totals.hard;
  const peak = Math.max(...stats.weekly, 1);

  const headline = rising ? "Practice Volume Climbs as the Streak Holds" : "Practice Volume Eases From Its Peak";

  const gap = lc.easy - lc.medium;
  const bookSentence =
    gap <= 0
      ? "Medium has overtaken Easy, a shift that historically precedes a rating move."
      : gap <= 5
        ? "Medium has all but closed its gap to Easy, a shift that historically precedes a rating move."
        : `Easy still leads Medium by ${gap}, and the book would benefit from rebalancing.`;

  const thin = (contest?.attended ?? 0) < 3 || cf.rounds < 3;

  return (
    <div className="pad market" id="market">
      <div className="sec-break"><span>Market Report · Page 3</span></div>
      <div className="market-head">
        <h2>{headline}</h2>
        <span className="stamp">
          {stats.isFallback ? "Last known figures" : "Close of"} {stats.asOfLabel} · Figures from LeetCode &amp; Codeforces
        </span>
      </div>
      <hr className="rule" />

      <div className="market-grid">
        <div className="summary">
          <p className="lede">
            <b>PRACTICE VOLUME {rising ? "CLIMBED" : "EASED"}</b> over the past thirty days, with{" "}
            <b>{num(lc.sub30)}</b> submissions against {num(lc.subPrev30)} in the thirty before.
            The trailing twelve months total <b>{num(lc.sub365)}</b> across <b>{lc.act365}</b> active
            sessions, and the longest unbroken run on the books stands at {lc.maxStreak} days — the
            single most defensible figure on this page.
          </p>
          <p>
            The difficulty book reads Easy {lc.easy}, Medium {lc.medium}, Hard {lc.hard}. {bookSentence}{" "}
            Hard remains underweight at {lc.hard} of {num(lc.totals.hard)} available, and is the
            obvious place to deploy next quarter.
          </p>
          <p>
            {contest ? (
              <>
                LeetCode stands at <b>{num(contest.rating)}</b> after {plural(contest.attended, "rated round")},
                placing in the top {contest.topPercent}% of {num(contest.totalParticipants)};{" "}
              </>
            ) : (
              <>LeetCode has no rated round on the books; </>
            )}
            Codeforces sits at <b>{num(cf.rating)}</b> after {plural(cf.rounds, "round")}, inside the{" "}
            {cf.rank} band
            {cf.lastChange !== null && cf.lastChange !== 0
              ? `, ${cf.lastChange > 0 ? "up" : "down"} ${Math.abs(cf.lastChange)} on the last round`
              : ""}
            .{thin ? " Ratings on this few rounds carry no trend yet, and this page declines to imply one." : ""}
          </p>
          <p className="agate-note">
            Analysis reflects the position as reported by each venue{stats.isFallback ? " at last contact" : " within the hour"}.
            Ratings from a handful of rated rounds are not annualised.
          </p>
          <Link className="more" href="/markets">Full report: The Coding Exchange →</Link>
        </div>

        <div>
          <table className="agate">
            <caption>Contest Ratings</caption>
            <thead>
              <tr><th>Venue</th><th>Sym</th><th>Last</th><th>High</th><th>Rnds</th><th>Pctl</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>LeetCode</td><td>LCR</td>
                <td>{contest ? num(contest.rating) : "—"}</td>
                <td>{contest ? num(contest.maxRating) : "—"}</td>
                <td>{contest?.attended ?? 0}</td>
                <td className="chg-up">{contest ? contest.topPercent.toFixed(2) : "UNQT"}</td>
              </tr>
              <tr>
                <td>Codeforces</td><td>CFR</td>
                <td>{num(cf.rating)}</td><td>{num(cf.maxRating)}</td><td>{cf.rounds}</td>
                <td>{cf.rank.slice(0, 4).toUpperCase()}</td>
              </tr>
              <tr>
                <td className="dim">AtCoder</td><td className="dim">ATC</td><td className="dim">—</td>
                <td className="dim">—</td><td className="dim">0</td><td className="dim">UNQT</td>
              </tr>
            </tbody>
          </table>
          <p className="agate-note">UNQT — unquoted; no rated round on the books.</p>

          <table className="agate">
            <caption>Issues Solved, by Difficulty</caption>
            <thead>
              <tr><th>Issue</th><th>Held</th><th>Avail</th><th>Share</th></tr>
            </thead>
            <tbody>
              <tr><td>Easy</td><td>{lc.easy}</td><td>{num(lc.totals.easy)}</td><td>{pct(lc.easy, lc.solved)}</td></tr>
              <tr><td>Medium</td><td>{lc.medium}</td><td>{num(lc.totals.medium)}</td><td>{pct(lc.medium, lc.solved)}</td></tr>
              <tr><td>Hard</td><td>{lc.hard}</td><td>{num(lc.totals.hard)}</td><td>{pct(lc.hard, lc.solved)}</td></tr>
              <tr className="total"><td>Total</td><td>{lc.solved}</td><td>{num(totalAvail)}</td><td>100%</td></tr>
            </tbody>
          </table>

          <table className="agate">
            <caption>Most Active Languages</caption>
            <thead><tr><th>Language</th><th>Solved</th><th>Share</th></tr></thead>
            <tbody>
              {lc.languages.slice(0, 4).map((l) => (
                <tr key={l.name}><td>{l.name}</td><td>{l.solved}</td><td>{pct(l.solved, lc.solved)}</td></tr>
              ))}
            </tbody>
          </table>

          <div className="yearchart">
            <h5>Trailing 12 Months · Weekly Submissions</h5>
            <svg
              viewBox="0 0 320 60"
              role="img"
              aria-label={`Weekly submissions across LeetCode and Codeforces over the trailing twelve months, peaking at ${peak}`}
            >
              <line x1="0" y1="52" x2="320" y2="52" stroke="#16130F" strokeWidth="1" />
              <g fill="#16130F">
                {stats.weekly.map((v, i) =>
                  v > 0 ? (
                    <rect key={i} x={2 + i * 6.1} y={52 - (v / peak) * 44} width="3" height={(v / peak) * 44} />
                  ) : null,
                )}
              </g>
              <g fontSize="6" fill="#6E6858">
                <text x="0" y="59">{stats.weeklyLabels.start}</text>
                <text x="160" y="59" textAnchor="middle">{stats.weeklyLabels.mid}</text>
                <text x="320" y="59" textAnchor="end">{stats.weeklyLabels.end}</text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
