/**
 * The engineering plates. Full blueprints live with their projects
 * (/work/*); the home page only ever shows BlueprintFragment.
 */

/** Plate I — HashVault upload path, full blueprint. */
export function HashVaultBlueprint() {
  return (
    <div className="plate-blue">
      <div className="grid" />
      <div className="rev-tag"><i>1</i></div>
      <h3>HashVault</h3>
      <p className="sub">
        Cloud storage platform · content-addressable deduplication · Go / Gin / PostgreSQL /
        Redis / RabbitMQ / S3
      </p>

      <div className="plate-body">
        <div className="plate-copy">
          <p>
            Every upload is hashed with SHA-256 before a byte leaves the client. Identical
            content resolves to one S3 key; reference counts increment and decrement
            atomically in SQL, and the object is purged only when the last reference drops
            to zero.
          </p>
          <p>
            A two-token scheme pairs 15-minute HS256 access tokens with 64-character opaque
            refresh tokens, stored only as SHA-256 hashes in Redis. The prior key is deleted
            on every refresh — a stolen token cannot be replayed.
          </p>
          <p>
            Presigned S3 URLs move file bytes browser-to-S3 directly. The Go server never
            touches the data plane.
          </p>
          <div className="plate-dims">
            <div><b>15m</b><span>Access TTL</span></div>
            <div><b>25</b><span>Max DB conns</span></div>
            <div><b>30s</b><span>Drain on SIGTERM</span></div>
            <div><b>1</b><span>Copy per hash</span></div>
          </div>
        </div>

        <div>
          <svg
            viewBox="0 0 340 250"
            role="img"
            aria-label="Blueprint elevation of the HashVault upload path: client, SHA-256 hash, API, dedup decision, branching to S3 write or skip"
          >
            <g stroke="#E8F0FF" strokeWidth="1" fill="none">
              <rect x="14" y="14" width="112" height="32" />
              <rect x="14" y="88" width="112" height="32" />
              <rect x="196" y="14" width="126" height="32" />
              <rect x="196" y="88" width="126" height="32" />
              <rect x="104" y="172" width="140" height="32" />
              <path d="M126,30 H196" /><path d="M126,104 H196" />
              <path d="M70,46 V88" /><path d="M259,46 V88" /><path d="M174,120 V172" />
              <path d="M259,120 V146 H174" />
              <circle cx="196" cy="30" r="2.6" fill="#E8F0FF" />
              <circle cx="196" cy="104" r="2.6" fill="#E8F0FF" />
            </g>
            <g fill="#E8F0FF" fontSize="9" textAnchor="middle">
              <text x="70" y="34">CLIENT</text>
              <text x="70" y="108">SHA-256</text>
              <text x="259" y="34">GIN API</text>
              <text x="259" y="108" fill="#FF6B5E">HASH EXISTS?</text>
              <text x="174" y="192">S3 WRITE / SKIP</text>
            </g>
            {/* dimension line, drafting convention */}
            <g stroke="rgba(232,240,255,.5)" strokeWidth="1">
              <line x1="14" y1="228" x2="126" y2="228" />
              <line x1="14" y1="223" x2="14" y2="233" />
              <line x1="126" y1="223" x2="126" y2="233" />
            </g>
            <text x="70" y="243" fill="#E8F0FF" fontSize="7.5" textAnchor="middle" opacity=".75">
              DEDUP BOUNDARY
            </text>
          </svg>
        </div>
      </div>

      <div className="titleblock">
        <div><span>Drawing Title</span><b>HashVault — Upload Path, Elevation</b></div>
        <div><span>Drawn By</span><b>A. Sinha</b></div>
        <div><span>Scale</span><b>N.T.S.</b></div>
        <div><span>Dwg No.</span><b>HV-01 · Rev 1</b></div>
      </div>
    </div>
  );
}

/** Plate II — Konnect details & assemblies. */
export function KonnectPlate() {
  return (
    <div className="plate-cream">
      <div className="ph">
        <h3>Konnect — Details &amp; Assemblies</h3>
        <em>Six services · Sheet K-02 · Rev 0</em>
      </div>

      <div className="figs">
        <div className="fig">
          <h6>Fig. 1 — Gateway</h6>
          <svg viewBox="0 0 120 80" role="img" aria-label="Socket.IO gateway elevation">
            <g stroke="#3B3226" strokeWidth=".9" fill="none">
              <rect x="14" y="16" width="92" height="44" />
              <line x1="14" y1="28" x2="106" y2="28" />
              <line x1="34" y1="28" x2="34" y2="60" /><line x1="60" y1="28" x2="60" y2="60" /><line x1="86" y1="28" x2="86" y2="60" />
              <path d="M4,38 H14" strokeDasharray="2 2" /><path d="M106,38 H116" strokeDasharray="2 2" />
            </g>
            <text x="60" y="25" fontSize="6" textAnchor="middle" fill="#3B3226">SOCKET.IO</text>
          </svg>
          <p>Persistent duplex channel; one connection per client.</p>
        </div>

        <div className="fig">
          <h6>Fig. 2 — Proxy</h6>
          <svg viewBox="0 0 120 80" role="img" aria-label="Traefik reverse proxy routing plan">
            <g stroke="#3B3226" strokeWidth=".9" fill="none">
              <rect x="10" y="30" width="34" height="20" />
              <path d="M44,40 H66" />
              <path d="M66,40 V16 H104" /><path d="M66,40 H104" /><path d="M66,40 V64 H104" />
              <rect x="104" y="10" width="10" height="12" /><rect x="104" y="34" width="10" height="12" /><rect x="104" y="58" width="10" height="12" />
            </g>
            <text x="27" y="43" fontSize="5.5" textAnchor="middle" fill="#3B3226">TRAEFIK</text>
          </svg>
          <p>Routes by host rule to six upstream services.</p>
        </div>

        <div className="fig">
          <h6>Fig. 3 — Topic</h6>
          <svg viewBox="0 0 120 80" role="img" aria-label="Kafka topic partitions, section">
            <g stroke="#3B3226" strokeWidth=".9" fill="none">
              <rect x="16" y="14" width="88" height="14" /><rect x="16" y="33" width="88" height="14" /><rect x="16" y="52" width="88" height="14" />
              <line x1="38" y1="14" x2="38" y2="28" /><line x1="60" y1="14" x2="60" y2="28" /><line x1="82" y1="14" x2="82" y2="28" />
              <line x1="38" y1="33" x2="38" y2="47" /><line x1="60" y1="33" x2="60" y2="47" /><line x1="82" y1="33" x2="82" y2="47" />
              <line x1="38" y1="52" x2="38" y2="66" /><line x1="60" y1="52" x2="60" y2="66" /><line x1="82" y1="52" x2="82" y2="66" />
              <path d="M8,21 H16" strokeDasharray="2 2" />
            </g>
            <text x="60" y="76" fontSize="5.5" textAnchor="middle" fill="#3B3226">3 PARTITIONS</text>
          </svg>
          <p>Ordered within a partition; consumers read by offset.</p>
        </div>

        <div className="fig">
          <h6>Fig. 4 — Window</h6>
          <svg viewBox="0 0 120 80" role="img" aria-label="Redis sliding window detail">
            <g stroke="#3B3226" strokeWidth=".9" fill="none">
              <line x1="10" y1="52" x2="110" y2="52" />
              <rect x="34" y="24" width="44" height="28" strokeDasharray="3 2" />
              <line x1="20" y1="48" x2="20" y2="52" /><line x1="34" y1="44" x2="34" y2="52" />
              <line x1="48" y1="38" x2="48" y2="52" /><line x1="62" y1="34" x2="62" y2="52" />
              <line x1="76" y1="42" x2="76" y2="52" /><line x1="90" y1="46" x2="90" y2="52" />
              <path d="M78,18 L86,18" /><path d="M84,15 L88,18 L84,21" />
            </g>
            <text x="56" y="70" fontSize="5.5" textAnchor="middle" fill="#3B3226">SLIDING · REDIS</text>
          </svg>
          <p>Judges a pattern of messages, never one alone.</p>
        </div>

        <div className="fig">
          <h6>Fig. 5 — Dual Token</h6>
          <svg viewBox="0 0 120 80" role="img" aria-label="JWT RS256 dual token assembly">
            <g stroke="#3B3226" strokeWidth=".9" fill="none">
              <rect x="12" y="20" width="42" height="18" /><rect x="66" y="20" width="42" height="18" />
              <path d="M54,29 H66" strokeDasharray="2 2" />
              <rect x="12" y="48" width="96" height="14" />
              <line x1="33" y1="38" x2="33" y2="48" /><line x1="87" y1="38" x2="87" y2="48" />
            </g>
            <g fontSize="5.5" textAnchor="middle" fill="#3B3226">
              <text x="33" y="32">ACCESS</text><text x="87" y="32">REFRESH</text><text x="60" y="58">RS256 SIGNATURE</text>
            </g>
          </svg>
          <p>Private key signs; every service verifies with the public half.</p>
        </div>

        <div className="fig">
          <h6>Fig. 6 — Handshake</h6>
          <svg viewBox="0 0 120 80" role="img" aria-label="OAuth handshake sequence with CSRF state">
            <g stroke="#3B3226" strokeWidth=".9" fill="none">
              <line x1="22" y1="12" x2="22" y2="70" /><line x1="98" y1="12" x2="98" y2="70" />
              <path d="M22,24 H98" /><path d="M92,21 L98,24 L92,27" />
              <path d="M98,40 H22" /><path d="M28,37 L22,40 L28,43" />
              <path d="M22,56 H98" /><path d="M92,53 L98,56 L92,59" />
            </g>
            <g fontSize="5" textAnchor="middle" fill="#3B3226">
              <text x="60" y="21">AUTH + STATE</text><text x="60" y="37">CODE</text><text x="60" y="53">EXCHANGE</text>
            </g>
          </svg>
          <p>State token held in Redis; CSRF cannot forge the return.</p>
        </div>

        <div className="fig">
          <h6>Fig. 7 — Moderation</h6>
          <svg viewBox="0 0 120 80" role="img" aria-label="Moderation pipeline isometric">
            <g stroke="#3B3226" strokeWidth=".9" fill="none">
              <path d="M18,44 L44,30 L70,44 L44,58 Z" />
              <path d="M50,60 L76,46 L102,60 L76,74 Z" />
              <path d="M70,44 L76,46" />
              <path d="M44,30 V18" /><path d="M41,22 L44,17 L47,22" />
            </g>
            <g fontSize="5" textAnchor="middle" fill="#3B3226">
              <text x="44" y="46">FLAG</text><text x="76" y="62">REVIEW</text>
            </g>
          </svg>
          <p>Suppresses false positives before a human ever sees them.</p>
        </div>

        <div className="fig">
          <h6>Fig. 8 — Service Plan</h6>
          <svg viewBox="0 0 120 80" role="img" aria-label="Plan view of six microservices">
            <g stroke="#3B3226" strokeWidth=".9" fill="none">
              <rect x="10" y="14" width="30" height="18" /><rect x="45" y="14" width="30" height="18" /><rect x="80" y="14" width="30" height="18" />
              <rect x="10" y="44" width="30" height="18" /><rect x="45" y="44" width="30" height="18" /><rect x="80" y="44" width="30" height="18" />
              <path d="M25,32 V44" strokeDasharray="2 2" /><path d="M60,32 V44" strokeDasharray="2 2" /><path d="M95,32 V44" strokeDasharray="2 2" />
            </g>
            <text x="60" y="76" fontSize="5.5" textAnchor="middle" fill="#3B3226">6 SERVICES</text>
          </svg>
          <p>Each owns its data; none reaches into another&rsquo;s store.</p>
        </div>
      </div>

      <div className="pf">
        <span>Drawn by A. Sinha</span><span>Scale N.T.S.</span><span>Sept 2025</span><span>Sheet K-02</span>
      </div>
    </div>
  );
}

/** A navy strip for the home page: just the idea, not the architecture. */
export function BlueprintFragment({ steps }: { steps: string[] }) {
  const w = 104;
  return (
    <div className="bp-fragment">
      <div className="grid" />
      <svg viewBox={`0 0 ${steps.length * w + 8} 74`} role="img" aria-label={steps.join(" to ")}>
        {steps.map((label, i) => (
          <g key={label} className="bp-node">
            <rect x={6 + i * w} y="22" width={w - 26} height="28" />
            <text x={6 + i * w + (w - 26) / 2} y="40" textAnchor="middle">{label}</text>
            {i < steps.length - 1 && (
              <>
                <path className="bp-flow" d={`M${6 + i * w + (w - 26)},36 H${6 + (i + 1) * w}`} />
                <path d={`M${(i + 1) * w},32 L${6 + (i + 1) * w},36 L${(i + 1) * w},40`} />
              </>
            )}
            <text className="bp-num" x={6 + i * w} y="15">{String(i + 1).padStart(2, "0")}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/** One small diagram per engineering report. */
export function ReportDiagram({ kind }: { kind: "dedup" | "events" | "tokens" | "hmac" }) {
  if (kind === "dedup") return <BlueprintFragment steps={["CLIENT", "SHA-256", "API", "DEDUP?", "S3"]} />;
  if (kind === "events") return <BlueprintFragment steps={["GATEWAY", "RABBITMQ", "KAFKA", "MODERATE", "REDIS"]} />;
  if (kind === "tokens") return <BlueprintFragment steps={["LOGIN", "ACCESS 15M", "REFRESH", "ROTATE", "REDIS"]} />;
  return <BlueprintFragment steps={["BROWSER", "RAZORPAY", "SIGNATURE", "HMAC", "CONFIRM"]} />;
}

/**
 * HashVault has no screen to photograph: its interface is its API.
 * This prints the upload path as a request transcript.
 */
export function HashVaultInterface() {
  return (
    <figure className="api-plate">
      <div className="api-sheet">
        <p className="api-bar"><span>hashvault · api/v1</span><span>control plane</span></p>
        <pre>
          <span className="c"># 1 · client hashes the file, asks to upload</span>{"\n"}
          <span className="m">POST</span> /files/init-upload{"\n"}
          {"{ "}<span className="k">&quot;name&quot;</span>: &quot;thesis.pdf&quot;, <span className="k">&quot;size&quot;</span>: 2481152,{"\n"}
          {"  "}<span className="k">&quot;checksum&quot;</span>: &quot;9f2c…e41a&quot; {"}"}{"\n"}
          {"\n"}
          <span className="ok">200</span> {"{ "}<span className="k">&quot;deduplicated&quot;</span>: <span className="v">true</span> {"}"}{"\n"}
          <span className="c"># same bytes already stored → no presigned URL, no upload</span>{"\n"}
          {"\n"}
          <span className="m">POST</span> /files/confirm{"\n"}
          <span className="ok">201</span> {"{ "}<span className="k">&quot;object&quot;</span>: &quot;objects/9f2c…e41a&quot;, <span className="k">&quot;ref_count&quot;</span>: <span className="v">3</span> {"}"}
        </pre>
      </div>
      <figcaption>
        <b>Fig. 1</b> — The upload path as the API sees it. A deduplication hit skips the upload entirely.
        Illustrative request.
      </figcaption>
    </figure>
  );
}

/** Konnect's moderation pipeline, drawn as the chat it protects. Illustration. */
export function KonnectInterface() {
  const rows: [string, string, "ok" | "flag" | "hold"][] = [
    ["ria", "anyone up for the 9pm game?", "ok"],
    ["dev", "count me in, bringing snacks", "ok"],
    ["anon_42", "██████ ██ ████", "hold"],
    ["ria", "lol you're so bad at this", "flag"],
  ];
  return (
    <figure className="chat-plate">
      <div className="chat-sheet">
        <p className="api-bar"><span># general</span><span>6 services · live</span></p>
        <ol>
          {rows.map(([who, text, state], i) => (
            <li key={i} className={state}>
              <b>{who}</b>
              <span>{text}</span>
              <em>{state === "ok" ? "delivered" : state === "hold" ? "held · pattern" : "flag · no action"}</em>
            </li>
          ))}
        </ol>
      </div>
      <figcaption>
        <b>Fig. 2</b> — A single rough message is flagged but not acted on; a pattern is held for review.
        Illustration of the moderation pipeline.
      </figcaption>
    </figure>
  );
}
