import type { LanguageMarket as Market } from "@/lib/languages";

function move(pp: number): { text: string; cls: string } {
  if (pp > 0) return { text: `▲ +${pp}`, cls: "r-up" };
  if (pp < 0) return { text: `▼ ${pp}`, cls: "r-dn" };
  return { text: "— 0", cls: "r-flat" };
}

/** Share of 90-day coding activity by language, set as a market board. */
export function LanguageMarket({ market }: { market: Market }) {
  const rows = [...market.languages].sort((a, b) => b.share - a.share).slice(0, 5);
  const top = Math.max(1, ...rows.map((l) => l.share));

  return (
    <div className="box langs">
      <h5>Language Market</h5>
      <p className="langs-sub">Share of 90-day coding activity</p>

      <div className="lm-head" aria-hidden="true">
        <span>Language</span>
        <span>Share</span>
        <span>Δ pp</span>
      </div>
      <ol className="lm" aria-label="Share of coding activity by language, with change in percentage points against the previous 90 days">
        {rows.map((l, i) => {
          const m = move(l.change);
          return (
            <li key={l.name}>
              <span className="lm-name">{l.name}</span>
              <span className="lm-track" aria-hidden="true">
                <i style={{ width: `${(l.share / top) * 100}%`, opacity: 1 - i * 0.14 }} />
              </span>
              <span className="lm-share">{l.share}%</span>
              <span className={`lm-move ${m.cls}`}>{m.text}</span>
            </li>
          );
        })}
      </ol>

      <p className="langs-note">
        Weighted activity: commits ×5, files ×2, lines ×0.1. Change against the previous 90 days.
      </p>
      <p className={market.source === "github" ? "langs-src live" : "langs-src"}>
        {market.source === "github" ? "● Live from GitHub" : "Sample figures · GitHub feed pending"}
      </p>
    </div>
  );
}
