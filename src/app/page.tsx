import { PageHeader } from "@/components/PageHeader";
import { Rule } from "@/components/Rule";
import { Kicker } from "@/components/Kicker";
import { Article } from "@/components/Article";
import { Plate } from "@/components/Plate";
import { ColumnGrid } from "@/components/ColumnGrid";

export default function FrontPage() {
  return (
    <main className="mx-auto max-w-[1180px] w-full px-5 py-7 bg-paper text-ink">
      <PageHeader active="/" />

      {/* ══ FRONT PAGE ══ */}
      <div className="mt-5">
        <ColumnGrid columns={3}>
          <div>
            <Article
              kicker="The Lead · Go"
              kickerAccent
              hed="The Same Bytes, Stored Once"
              hedSize="lead"
              byline="By Ankit Sinha · HashVault · Mar 2026"
              drop
            >
              <p>
                Two users upload the same file. Most systems store it twice. HashVault hashes the
                content with SHA-256 and resolves identical bytes to a single S3 key — reference
                counts increment and decrement atomically in SQL, and the object is purged from S3
                and Postgres only when the count reaches zero. A dedup hit skips the upload round
                trip entirely.
              </p>
              <p>
                The service is a modular monolith in Go: interface-driven repository, service and
                handler layers, with a sentinel-error boundary that keeps persistence failures
                from leaking into business logic. Presigned S3 URLs move file bytes browser-to-S3
                directly, leaving the Go server on the control plane.
              </p>
            </Article>
            <p className="font-body italic text-[12px] text-soft mt-1">
              Continued below — the two-token auth scheme and the RabbitMQ pipeline.
            </p>

            <Rule weight="hairline" className="my-4" />

            <Kicker>Also in Work</Kicker>
            <Article hed="Konnect: Six Services, One Conversation" hedSize="small">
              <p>
                A real-time chat platform across six microservices behind Traefik, with a
                Socket.IO gateway and an event-driven backbone on RabbitMQ and Kafka feeding an AI
                moderation pipeline. Redis sliding-window aggregation suppresses false-positive
                harassment flags.
              </p>
            </Article>
          </div>

          <div>
            <Plate
              src="/ankit-sinha.png"
              alt="Portrait of Ankit Sinha"
              caption="Ankit Sinha. Also known as Haunts."
              duotone
            />

            <Rule weight="hairline" className="my-4" />

            <Kicker accent>Dispatch</Kicker>
            <Article
              hed="Payments Confirmed Only on Cryptographic Proof"
              hedSize="sub"
              byline="Denthinkers Foundation · Nov 2025 – Apr 2026"
            >
              <p>
                The donation module verifies Razorpay orders with server-side HMAC-SHA256
                signatures, so a payment is confirmed on proof rather than on what the client
                claims. It has processed over ₹1.5L in verified transactions on a platform serving
                2,500+ monthly visits.
              </p>
              <p>
                Fifteen API route handlers, twenty-three endpoints, cookie-based JWT admin auth
                behind middleware-gated routes, and a draft/publish CMS workflow with deterministic
                slug-collision handling.
              </p>
            </Article>
          </div>

          <aside>
            <Kicker>Profile</Kicker>
            <dl className="font-body text-[12px] leading-[1.5]">
              <dt className="font-utility text-[8.5px] font-bold tracking-[0.14em] uppercase text-soft mt-2">
                Reading
              </dt>
              <dd className="mt-0.5">
                MCA, IIT Patna
                <br />
                <span className="text-soft">Jul 2026 – 2028 (expected)</span>
              </dd>
              <dt className="font-utility text-[8.5px] font-bold tracking-[0.14em] uppercase text-soft mt-2">
                Read
              </dt>
              <dd className="mt-0.5">
                BCA, Lovely Professional University
                <br />
                <span className="text-soft">CGPA 9.86 / 10.0 · 2023 – 2026</span>
              </dd>
              <dt className="font-utility text-[8.5px] font-bold tracking-[0.14em] uppercase text-soft mt-2">
                Languages
              </dt>
              <dd className="mt-0.5">Go, Java, Python, TypeScript, C++, SQL</dd>
              <dt className="font-utility text-[8.5px] font-bold tracking-[0.14em] uppercase text-soft mt-2">
                Backend
              </dt>
              <dd className="mt-0.5">Gin, GORM, Node, Express, Next.js, FastAPI, Socket.IO</dd>
              <dt className="font-utility text-[8.5px] font-bold tracking-[0.14em] uppercase text-soft mt-2">
                Infrastructure
              </dt>
              <dd className="mt-0.5">Docker, Traefik, AWS S3 &amp; EC2, MinIO, GCP, Linux</dd>
              <dt className="font-utility text-[8.5px] font-bold tracking-[0.14em] uppercase text-soft mt-2">
                Data &amp; Messaging
              </dt>
              <dd className="mt-0.5">PostgreSQL, MongoDB, Redis, RabbitMQ, Kafka</dd>
            </dl>

            <Rule weight="hairline" className="my-4" />

            <Kicker>Directory</Kicker>
            <ul className="font-body text-[12px] list-none p-0 m-0 space-y-1">
              <li>
                GitHub · <span className="text-soft">AnkitSinha0</span>
              </li>
              <li>
                LinkedIn · <span className="text-soft">ankit0sinha</span>
              </li>
              <li>
                X · <span className="text-soft">Haunts_01</span>
              </li>
              <li>
                Instagram · <span className="text-soft">haunts_01</span>
              </li>
            </ul>
          </aside>
        </ColumnGrid>
      </div>

      {/* ══ MARKETS — the practice record ══ */}
      <Rule weight="thick" className="mt-9" />
      <div className="mt-4">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <h2 className="font-display font-bold text-[clamp(1.4rem,3vw,1.9rem)] leading-tight m-0">
            Practice Volume Holds Through September
          </h2>
          <span className="font-utility text-[9.5px] tracking-[0.14em] uppercase text-soft">
            As of 17 Sep 2026 · LeetCode &amp; Codeforces
          </span>
        </div>
        <Rule className="mt-2 mb-5" />

        <ColumnGrid columns={2}>
          <div>
            <p className="font-body text-[13px] leading-[1.55] text-justify [hyphens:auto] mb-3">
              <strong>Sixty-four consecutive days</strong> is the figure worth leading on. The
              streak was opened in July and carried, substantially intact, into September.
              Submissions totalled <strong>685</strong> across the trailing twelve months against{" "}
              <strong>75</strong> active sessions — a concentration that favours sustained runs
              over scattered activity.
            </p>
            <p className="font-body text-[13px] leading-[1.55] text-justify [hyphens:auto]">
              Contest exposure stays thin: one rated round on each venue leaves both ratings
              provisional. LeetCode opened at 1,569 (top 29.13%); Codeforces sits at 655, inside
              the Newbie band. Neither number carries a trend yet, and this page does not imply
              one.
            </p>
          </div>

          <div>
            <table className="agate">
              <caption>Contest Ratings</caption>
              <thead>
                <tr>
                  <th>Venue</th>
                  <th>Last</th>
                  <th>Rounds</th>
                  <th>Pctl</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>LeetCode</td>
                  <td>1,569</td>
                  <td>1</td>
                  <td>29.13</td>
                </tr>
                <tr>
                  <td>Codeforces</td>
                  <td>655</td>
                  <td>1</td>
                  <td>Newbie</td>
                </tr>
              </tbody>
            </table>

            <table className="agate mt-4">
              <caption>Solved, by Difficulty</caption>
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Solved</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Easy</td>
                  <td>64</td>
                  <td>48.9%</td>
                </tr>
                <tr>
                  <td>Medium</td>
                  <td>63</td>
                  <td>48.1%</td>
                </tr>
                <tr>
                  <td>Hard</td>
                  <td>4</td>
                  <td>3.0%</td>
                </tr>
              </tbody>
            </table>
            <p className="agate-note">131 solved, all time · 64-day max streak · 685 submissions trailing 12 months.</p>
          </div>
        </ColumnGrid>
      </div>

      {/* ══ TECHNICAL SUPPLEMENT — HashVault, in plate form ══ */}
      <Rule weight="thick" className="mt-9" />
      <div className="mt-4">
        <Kicker>Technical Supplement · Plate I</Kicker>
        <div className="plate-blue">
          <h3>HashVault</h3>
          <p className="sub">System architecture · content-addressable deduplication</p>
          <svg
            viewBox="0 0 620 210"
            role="img"
            aria-label="Blueprint of the HashVault upload path: client to Gin API, dedup check, branching to S3 write or skip"
          >
            <g stroke="#e8f0ff" strokeWidth="1" fill="none">
              <rect x="14" y="20" width="120" height="34" />
              <rect x="14" y="90" width="120" height="34" />
              <rect x="220" y="20" width="130" height="34" />
              <rect x="220" y="90" width="130" height="34" />
              <rect x="140" y="160" width="140" height="34" />
              <path d="M134,37 H220" />
              <path d="M134,107 H220" />
              <path d="M74,54 V90" />
              <path d="M285,54 V90" />
              <path d="M210,124 V160" />
            </g>
            <g fontFamily="var(--font-mono)" fontSize="10" fill="#e8f0ff" textAnchor="middle">
              <text x="74" y="41">
                Client
              </text>
              <text x="74" y="111">
                SHA-256 Hash
              </text>
              <text x="285" y="41">
                Gin API
              </text>
              <text x="285" y="111" fill="#ff6b5e">
                Hash Exists?
              </text>
              <text x="210" y="181">
                S3 Write / Skip
              </text>
            </g>
          </svg>
          <div className="titleblock">
            <div>
              <span>Drawing Title</span>
              <b>HashVault — Upload Path, Elevation</b>
            </div>
            <div>
              <span>Drawn By</span>
              <b>A. Sinha</b>
            </div>
            <div>
              <span>Scale</span>
              <b>N.T.S.</b>
            </div>
            <div>
              <span>Dwg No.</span>
              <b>HV-01 · Rev 1</b>
            </div>
          </div>
        </div>
      </div>

      {/* ══ LETTERS ══ */}
      <Rule weight="thick" className="mt-9" />
      <div className="mt-4 mb-8 flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <Kicker>Letters</Kicker>
          <p className="font-body text-[13px] leading-[1.5] max-w-[46ch]">
            Open to opportunities, collaborations, or a good conversation. The fastest way in is
            email.
          </p>
        </div>
        <a
          href="mailto:ankits0057@gmail.com"
          className="font-display font-bold text-[15px] underline decoration-1 underline-offset-4"
        >
          ankits0057@gmail.com
        </a>
      </div>
    </main>
  );
}
