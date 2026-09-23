import type { Contest } from "@/lib/contests";

/** "in 1d 13h", "in 5h 20m" — relative to render time. */
function until(iso: string, now: number) {
  const mins = Math.max(0, Math.round((Date.parse(iso) - now) / 60_000));
  const d = Math.floor(mins / 1440);
  const h = Math.floor((mins % 1440) / 60);
  const m = mins % 60;
  return d ? `${d}d ${h}h` : h ? `${h}h ${m}m` : `${m}m`;
}

const duration = (m: number) => (m % 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m / 60}h`);

/**
 * The financial page's economic calendar, for contests: the next rated
 * rounds on Codeforces and LeetCode, in IST.
 */
export function ContestCalendar({ contests, now }: { contests: Contest[]; now: number }) {
  const next = contests[0];

  return (
    <div className="box cal">
      <h5>Contest Calendar</h5>
      <p className="cal-sub">Upcoming rated rounds · times in IST</p>

      {next ? (
        <>
          <a className="cal-next" href={next.url} target="_blank" rel="noopener noreferrer">
            <span className="cal-bell">Next bell</span>
            <b>{next.name}</b>
            <span className="cal-when">
              {next.day} · {next.time} · <em>in {until(next.start, now)}</em>
            </span>
          </a>

          <table>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">IST</th>
                <th scope="col">Sym</th>
                <th scope="col">Event</th>
                <th scope="col">Length</th>
              </tr>
            </thead>
            <tbody>
              {contests.slice(1).map((c) => (
                <tr key={c.id}>
                  <td className="cdate">{c.day}</td>
                  <td className="t">{c.time}</td>
                  <td><span className={`csym ${c.venue}`}>{c.venue}</span></td>
                  <td className="n">
                    <a href={c.url} target="_blank" rel="noopener noreferrer">{c.name}</a>
                  </td>
                  <td className="t">{duration(c.minutes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p className="cal-empty">No rounds on the calendar — the exchanges are closed for now.</p>
      )}
      <p className="cut-cap">Live from Codeforces and LeetCode. Markets open at the bell.</p>
    </div>
  );
}
