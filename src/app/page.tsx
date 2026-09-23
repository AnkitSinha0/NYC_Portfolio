import Link from "next/link";
import { MarketReport } from "@/components/MarketReport";
import { getStats } from "@/lib/stats";
import "@/styles/edition.css";

const BARCODE = [2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 1, 2, 3, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 3, 1, 2, 2, 1, 3];

const STACK = ["Go", "Gin", "PostgreSQL", "Redis", "RabbitMQ", "Kafka", "AWS S3", "MinIO", "Docker", "Traefik", "Next.js"];

const SPECS: [string, number][] = [
  ["Go / Backend", 94],
  ["Distributed Sys", 86],
  ["Cloud / S3", 82],
  ["Databases", 88],
  ["Messaging", 79],
  ["Security / Auth", 84],
];

// Keep in step with REVALIDATE in src/lib/stats/config.ts (must be a literal here).
export const revalidate = 3600;

export default async function Home() {
  const stats = await getStats();

  return (
    <div className="se">
      <div className="edition">
        {/* ═══════ 1 · MASTHEAD & FRONT PAGE ═══════ */}
        <div className="pad" style={{ paddingTop: 22 }}>
          <div className="folio">
            <span>Vol. I · No. 1</span>
            <span>Patna · Phagwara · Chaibasa</span>
            <span>ankitsin.in</span>
          </div>
          <hr className="rule-hair" />
          <h1 className="nameplate">Ankit Sinha</h1>
          <hr className="rule-thick" />
          <div className="folio">
            <span>Backend Engineer</span>
            <span>Distributed Systems &amp; Cloud Infrastructure</span>
            <span>Also known as Haunts</span>
          </div>
          <hr className="rule" />
          <nav className="secnav" aria-label="Sections">
            <Link href="/" className="on" aria-current="page">Front Page</Link>
            <a href="#plate-1">Work</a>
            <Link href="/markets">Markets</Link>
            <a href="#profile">Profile</a>
            <i>Writing</i>
            <a href="#classifieds">Letters</a>
            <i>Archive</i>
          </nav>
          <hr className="rule-thick" />

          <div className="front">
            <div>
              <p className="kicker red">The Lead · Go</p>
              <h2 className="hed" style={{ fontSize: "clamp(1.5rem,3.3vw,2.3rem)" }}>
                The Same Bytes, Stored Once
              </h2>
              <p className="byline">By Ankit Sinha · HashVault · Mar 2026</p>
              <p className="body drop">
                Two users upload the same file. Most systems store it twice. HashVault hashes the
                content with SHA-256 and resolves identical bytes to a single S3 key — reference
                counts increment and decrement atomically in SQL, and the object is purged from S3
                and Postgres only when the count reaches zero. A dedup hit skips the upload round
                trip entirely.
              </p>
              <p className="body">
                The service is a modular monolith in Go: interface-driven repository, service and
                handler layers, with a sentinel-error boundary that keeps persistence failures from
                leaking into business logic.
              </p>
              <p className="jump">
                <a href="#plate-1">Continued in the Technical Supplement, Plate I.</a>
              </p>
              <hr className="rule-hair" style={{ margin: "13px 0" }} />
              <p className="kicker">Also in Work</p>
              <h3 className="hed" style={{ fontSize: ".97rem", lineHeight: 1.16 }}>
                Konnect: Six Services, One Conversation
              </h3>
              <p className="body" style={{ marginBottom: 0 }}>
                A real-time chat platform across six microservices behind Traefik, with a Socket.IO
                gateway and an event-driven backbone on RabbitMQ and Kafka feeding an AI moderation
                pipeline.
              </p>
            </div>

            <div className="coldiv">
              <div className="halftone">
                <span>Ankit Sinha, at the desk</span>
              </div>
              <p className="caption">
                Screened at 85 lines per inch, as newspapers print a photograph. The
                full-resolution portrait runs on the front page of the live site.
              </p>
              <hr className="rule-hair" style={{ margin: "13px 0" }} />
              <p className="kicker red">Dispatch</p>
              <h3 className="hed" style={{ fontSize: "1.25rem" }}>
                Payments Confirmed Only on Cryptographic Proof
              </h3>
              <p className="byline">Denthinkers Foundation · Nov 2025 – Apr 2026</p>
              <p className="body">
                The donation module verifies Razorpay orders with server-side HMAC-SHA256
                signatures, so a payment is confirmed on proof rather than on what the client claims
                — ₹1.5L+ in verified transactions on a platform serving 2,500+ monthly visits.
              </p>
              <p className="body" style={{ marginBottom: 0 }}>
                Fifteen route handlers, twenty-three endpoints, cookie-based JWT admin auth behind
                middleware-gated routes.
              </p>
            </div>

            <aside className="coldiv" id="profile">
              <p className="kicker">Profile</p>
              <dl className="profile">
                <dt>Reading</dt>
                <dd>
                  MCA, IIT Patna
                  <br />
                  <span className="dim">Jul 2026 – 2028 (expected)</span>
                </dd>
                <dt>Read</dt>
                <dd>
                  BCA, Lovely Professional University
                  <br />
                  <span className="dim">CGPA 9.86 / 10.0</span>
                </dd>
                <dt>Stack</dt>
                <dd>Go, Java, Python, TypeScript, C++, SQL</dd>
              </dl>

              <div className="index-box">
                <h4>Inside This Edition</h4>
                <nav>
                  <a className="row" href="#ad"><b>Advertisement</b><span>2</span></a>
                  <a className="row" href="#market"><b>Market Report</b><span>3</span></a>
                  <a className="row" href="#plate-1"><b>Technical Supplement</b><span>4</span></a>
                  <a className="row" href="#plate-2"><b>Detail Plate</b><span>5</span></a>
                  <a className="row" href="#classifieds"><b>Classifieds</b><span>6</span></a>
                </nav>
              </div>

              <hr className="rule-hair" style={{ margin: "13px 0" }} />
              <p className="kicker">Directory</p>
              <p className="body dir">
                <a href="https://github.com/AnkitSinha0" target="_blank" rel="noopener noreferrer">
                  GitHub · <span className="dim">AnkitSinha0</span>
                </a>
              </p>
              <p className="body dir">
                <a href="https://www.linkedin.com/in/ankit0sinha/" target="_blank" rel="noopener noreferrer">
                  LinkedIn · <span className="dim">ankit0sinha</span>
                </a>
              </p>
              <p className="body dir" style={{ margin: 0 }}>
                <a href="https://x.com/Haunts_01" target="_blank" rel="noopener noreferrer">
                  X · <span className="dim">Haunts_01</span>
                </a>
              </p>
            </aside>
          </div>
        </div>

        {/* ═══════ 2 · DISPLAY ADVERTISEMENT ═══════ */}
        <div className="pad" id="ad">
          <p className="ad-label">Advertisement</p>
        </div>
        <section className="ad">
          <div className="ad-top">
            <span className="badge"><i /></span>
            <div style={{ textAlign: "right", lineHeight: 1.5 }}>
              FULL PAGE · NO. 02
              <br />
              PATNA, IN · EST. 2026
            </div>
          </div>

          <div className="ad-grid">
            <div>
              <h2 className="ad-hed">
                The Whole
                <br />
                Stack.
                <br />
                <span className="red">One Engineer.</span>
              </h2>
              <p className="ad-sub">
                Services that stay up when the network doesn&rsquo;t. Storage that refuses to keep
                the same bytes twice. Auth you can&rsquo;t replay. Built in Go, shipped in Docker,
                observed in Zap.
              </p>
              <div className="ad-stack">
                {STACK.map((s, i) => (
                  <span key={s} style={{ display: "contents" }}>
                    {i > 0 && <span className="q">/</span>}
                    <span>{s}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="ad-specs">
              {SPECS.map(([label, n]) => (
                <div className="spec-row" key={label}>
                  <span className="lbl">{label}</span>
                  <span className="track"><i style={{ width: `${n}%` }} /></span>
                  <span className="n">{n}</span>
                </div>
              ))}
              <p className="ad-fine">
                Self-assessed. Verifiable against the Technical Supplement, Plates I–II.
              </p>
            </div>
          </div>

          <div className="ad-foot">
            <div className="ad-foot-l">
              <div className="barcode" aria-hidden="true">
                {BARCODE.map((w, i) => (
                  <i key={i} style={{ width: w, height: 12 + w * 5 }} />
                ))}
              </div>
              <div className="colorbar" aria-hidden="true">
                <i style={{ background: "#00AEEF" }} />
                <i style={{ background: "#EC008C" }} />
                <i style={{ background: "#FFF200" }} />
                <i style={{ background: "#000" }} />
                <i style={{ background: "var(--ad-paper)" }} />
              </div>
            </div>
            <p className="ad-fine">
              Distributed systems sold separately. Graceful degradation included at no additional
              cost. Over-engineering is a known side effect and is not covered under warranty.
              Offer valid while curiosity lasts.
            </p>
            <span className="ad-cta">ankitsin.in →</span>
          </div>
        </section>

        {/* ═══════ 3 · MARKET REPORT — live, see src/lib/stats ═══════ */}
        <MarketReport stats={stats} />

        {/* ═══════ 4 · TECHNICAL SUPPLEMENT — PLATE I ═══════ */}
        <div className="pad" id="plate-1">
          <div className="supp-label"><span>Technical Supplement · Pull-Out</span><span>Plate I of II</span></div>
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
        </div>

        {/* ═══════ 5 · DETAIL PLATE ═══════ */}
        <div className="pad" id="plate-2">
          <div className="supp-label"><span>Technical Supplement · Detail Sheet</span><span>Plate II of II</span></div>
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
        </div>

        {/* ═══════ 6 · CLASSIFIEDS ═══════ */}
        <div className="pad" id="classifieds">
          <div className="sec-break"><span>Classified · Page 6</span></div>
          <div className="classifieds">
            <div className="cl">
              <h5>Situations Wanted</h5>
              <p>
                BACKEND ENGINEER, Go and distributed systems. MCA candidate, IIT Patna; BCA, LPU,
                CGPA 9.86. Modular monoliths a speciality. Sentinel errors kept strictly out of
                business logic. Will not vibe-code. Reply{" "}
                <a href="mailto:ankits0057@gmail.com">ankits0057@gmail.com</a>.
              </p>
            </div>
            <div className="cl">
              <h5>Services Offered</h5>
              <p>
                DEDUPLICATION, content-addressable, SHA-256. Your bytes stored once, referenced
                many. Atomic counts, clean purge on last release. See Plate I, this edition.
              </p>
            </div>
            <div className="cl">
              <h5>Public Notice</h5>
              <p>
                BE IT KNOWN that payments are confirmed on cryptographic proof and not on
                client-reported status. HMAC-SHA256, server side. ₹1.5L+ verified to date without
                dispute.
              </p>
            </div>
            <div className="cl">
              <h5>Lost &amp; Found</h5>
              <p>
                FOUND: two hours, recovered after a PostgreSQL connection failure proved to be a
                wrong password. No reward sought. Lesson retained.
              </p>
            </div>
            <div className="cl">
              <h5>Personals</h5>
              <p>
                ENGINEER, 21, seeks interesting problems. Enjoys long walks through stack traces,
                Formula 1, and the mountains. Fluent in Go; conversational in Java, Python,
                TypeScript and C++.
              </p>
            </div>
            <div className="cl">
              <h5>Subscriptions</h5>
              <p>
                THE EDITION publishes continuously at <b>ankitsin.in</b>. Market figures refresh
                hourly. Back issues on GitHub,{" "}
                <a href="https://github.com/AnkitSinha0" target="_blank" rel="noopener noreferrer">
                  AnkitSinha0
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        {/* ═══════ 7 · COLOPHON ═══════ */}
        <div className="pad">
          <hr className="rule-thick colophon-rule" />
          <div className="colophon">
            <svg className="regmark" viewBox="0 0 18 18" aria-hidden="true">
              <circle cx="9" cy="9" r="6" fill="none" stroke="#16130F" strokeWidth=".8" />
              <line x1="9" y1="0" x2="9" y2="18" stroke="#16130F" strokeWidth=".8" />
              <line x1="0" y1="9" x2="18" y2="9" stroke="#16130F" strokeWidth=".8" />
            </svg>
            <p className="mark">Ankit Sinha</p>
            <p>
              Set in Playfair Display, Source Serif, Libre Franklin and Archivo Narrow.
              <br />
              Market tables set in agate, 5.5 pt, as the financial pages require.
            </p>
            <p className="printed">Vol. I · No. 1 · Printed at Patna · ankitsin.in</p>
          </div>
        </div>
      </div>
    </div>
  );
}
