import type { LanguageMarket as Market } from "@/lib/languages";

const BLOCKS = 20;

function move(pp: number): { text: string; cls: string } {
  if (pp > 0) return { text: `▲ +${pp}pp`, cls: "r-up" };
  if (pp < 0) return { text: `▼ ${pp}pp`, cls: "r-dn" };
  return { text: "─ 0pp", cls: "r-flat" };
}

/** Share of 90-day coding activity by language, set as a market board. */
export function LanguageMarket({ market }: { market: Market }) {
  const rows = [...market.languages].sort((a, b) => b.share - a.share).slice(0, 5);
  const top = Math.max(1, ...rows.map((l) => l.share));

  return (
    <div className="box langs">
      <h5>Language Market</h5>
      <p className="langs-sub">90-day coding activity</p>
      <table>
        <caption className="sr-only">
          Share of coding activity by language over the last 90 days, and the change in percentage points
          against the previous 90 days
        </caption>
        <thead>
          <tr>
            <th scope="col">Lang</th>
            <th scope="col" aria-hidden="true" />
            <th scope="col">Share</th>
            <th scope="col">90d</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((l) => {
            const blocks = Math.max(1, Math.round((l.share / top) * BLOCKS));
            const m = move(l.change);
            return (
              <tr key={l.name}>
                <th scope="row">{l.name.toUpperCase()}</th>
                <td className="bar" aria-hidden="true">
                  <span>{"█".repeat(blocks)}</span>
                </td>
                <td className="num">{l.share}%</td>
                <td className={`num ${m.cls}`}>{m.text}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="fine-print">
        Share = weighted activity (commits ×5, files ×2, lines ×0.1) · change vs the previous 90 days
      </p>
      <p className={market.source === "github" ? "langs-src live" : "langs-src"}>
        {market.source === "github" ? "● Live from GitHub" : "Sample figures · GitHub feed pending"}
      </p>
    </div>
  );
}
