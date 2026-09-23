import type { Mood, Sentiment } from "@/lib/sentiment";

const BLOCKS = 20;
const SCALE: [Mood, string][] = [
  ["BULLISH", "▲"],
  ["NEUTRAL", "—"],
  ["BEARISH", "▼"],
];

/** Coding Market Sentiment — a computed mood, printed like a market gauge. */
export function MarketSentiment({ sentiment }: { sentiment: Sentiment }) {
  const filled = Math.round(sentiment.fill * BLOCKS);
  const cls = sentiment.mood.toLowerCase();

  return (
    <div className={`box sentiment ${cls}`}>
      <h5>Coding Market Sentiment</h5>
      <p className="gauge" role="img" aria-label={`Sentiment gauge: ${filled} of ${BLOCKS}, ${sentiment.mood.toLowerCase()}`}>
        <span className="on">{"█".repeat(filled)}</span>
        <span className="off">{"░".repeat(BLOCKS - filled)}</span>
      </p>
      <p className="mood">
        {sentiment.mood} {SCALE.find(([m]) => m === sentiment.mood)?.[1]}
      </p>
      <ul className="scale" aria-hidden="true">
        {SCALE.map(([m, arrow]) => (
          <li key={m} className={m === sentiment.mood ? "here" : undefined}>
            {m} {arrow}
          </li>
        ))}
      </ul>
      <p className="why">Why?</p>
      <ul className="reasons">
        {sentiment.reasons.map((r) => (
          <li key={r.text} className={r.sign === "+" ? "r-up" : r.sign === "−" ? "r-dn" : "r-flat"}>
            <b>{r.sign}</b> {r.text}
          </li>
        ))}
      </ul>
      <p className="analyst">{sentiment.analyst}</p>
      {sentiment.partial && <p className="fine-print">{sentiment.partial}</p>}
      <p className="fine-print">Computed from live activity. Not financial advice. Past streaks do not guarantee future commits.</p>
    </div>
  );
}
