const TICKER = "GO · CLOUD · DISTRIBUTED SYSTEMS · STORAGE · MESSAGING · KUBERNETES · POSTGRESQL · REDIS · ";

function RegMark() {
  return (
    <svg viewBox="0 0 18 18" className="desk-reg">
      <circle cx="9" cy="9" r="6" />
      <line x1="9" y1="0" x2="9" y2="18" />
      <line x1="0" y1="9" x2="18" y2="9" />
    </svg>
  );
}

/**
 * The desk the paper sits on: vertical metadata, faint fragments and
 * registration marks in the margins either side of the page. Purely
 * atmospheric — hidden from assistive tech, never clickable, and only
 * drawn when the margins are wide enough to hold it.
 */
export function DeskMargins() {
  return (
    <div className="desk" aria-hidden="true">
      <div className="desk-side l">
        <RegMark />
        <div className="desk-frag">
          <b>Engineering<br />Desk</b>
          <span>Systems · Storage · Cloud</span>
          <hr />
          <i>&ldquo;Build it.<br />Break it.<br />Understand it.&rdquo;</i>
        </div>
        <p className="desk-vert">Vol. 01 · Backend Engineering · Distributed Systems · Cloud Infrastructure</p>
        <RegMark />
      </div>

      <div className="desk-side r">
        <RegMark />
        <div className="desk-frag">
          <b>Currently<br />Building</b>
          <span className="big">HashVault</span>
          <span>Go · PostgreSQL · Redis<br />RabbitMQ · S3</span>
          <hr />
          <span>Vol. 01 · 2026</span>
        </div>
        <p className="desk-vert">Patna · India · Est. 2026 · Issue 001</p>
        <div className="desk-ticker">
          <p>{TICKER.repeat(4)}</p>
        </div>
        <RegMark />
      </div>
    </div>
  );
}
