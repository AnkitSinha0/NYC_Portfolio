import Image from "next/image";
import Link from "next/link";
import { Colophon } from "@/components/edition/Colophon";
import { HobbyArt } from "@/components/edition/HobbyArt";
import { Masthead } from "@/components/edition/Masthead";
import { BlueprintFragment, HashVaultInterface, KonnectInterface } from "@/components/edition/Plates";
import { TechIcon } from "@/components/edition/TechIcon";
import { Terminal } from "@/components/edition/Terminal";
import { HOBBIES, LINKS, PROJECTS, REPORTS, STACK } from "@/lib/content";
import { getStats, num } from "@/lib/stats";
import "@/styles/edition.css";

// Keep in step with REVALIDATE in src/lib/stats/config.ts (must be a literal here).
export const revalidate = 3600;

/** A tiny printed sparkline of weekly practice volume. */
function Spark({ values }: { values: number[] }) {
  const recent = values.slice(-16);
  const max = Math.max(1, ...recent);
  const pts = recent.map((v, i) => `${(i * 200) / (recent.length - 1)},${40 - (v / max) * 34}`).join(" ");
  return (
    <svg viewBox="0 0 200 44" className="spark-se" role="img" aria-label="Weekly submissions, last sixteen weeks">
      <polyline points={`0,40 ${pts} 200,40`} className="area" />
      <polyline points={pts} className="line" />
    </svg>
  );
}

export default async function Home() {
  const stats = await getStats();
  const { lc, cf } = stats;
  const [hashvault, konnect] = PROJECTS;

  return (
    <div className="se home">
      <div className="edition">
        <Masthead active="/" />

        {/* ═══════ THE LEAD ═══════ */}
        <section className="pad lead" aria-labelledby="lead-hed">
          <div className="lead-main">
            <p className="kicker red">The Lead · Backend Engineering</p>
            <h1 id="lead-hed" className="lead-hed">
              I Build Systems
              <br />
              That Survive
              <br />
              the Real World.
            </h1>
            <p className="lead-dek">
              Backend engineer focused on distributed systems, cloud infrastructure, storage and
              messaging — the parts of a product nobody sees until they break.
            </p>
            <p className="lead-now">
              <span className="tag green">Now</span> Building <Link href="/work/hashvault">HashVault</Link>, a
              content-addressable storage platform in Go, and reading MCA at IIT Patna. Exploring Kubernetes
              and production infrastructure.
            </p>
            <p className="meta-mono">GO · POSTGRESQL · REDIS · RABBITMQ · AWS S3 · DOCKER</p>
            <div className="actions">
              <Link className="btn solid" href="/work">View Work</Link>
              <Link className="btn" href="/engineering">Engineering</Link>
              <a className="btn" href="#contact">Contact</a>
              <a className="btn ghost" href={LINKS.resume} download>Résumé PDF ↓</a>
            </div>
          </div>

          <aside className="lead-side">
            <figure className="portrait">
              <div className="screen">
                <Image src="/ankit-sinha.png" alt="Portrait of Ankit Sinha" fill priority sizes="(max-width: 880px) 90vw, 360px" />
              </div>
              <figcaption>Ankit Sinha, Patna. Also known as Haunts.</figcaption>
            </figure>
            <dl className="facts">
              <div><dt>Reading</dt><dd>MCA, IIT Patna <span className="dim">· 2026–28</span></dd></div>
              <div><dt>Read</dt><dd>BCA, LPU <span className="dim">· CGPA 9.86</span></dd></div>
              <div><dt>Last post</dt><dd>SDE Intern, Denthinkers <span className="dim">· 2025–26</span></dd></div>
            </dl>
          </aside>
        </section>

        {/* ═══════ TECHNICAL DESK ═══════ */}
        <section className="pad desk" aria-labelledby="desk-hed">
          <div className="sec-head">
            <h2 id="desk-hed">Technical Desk</h2>
            <span>Filed under: Stack · Tools in daily use</span>
          </div>
          <div className="stack-index">
            {STACK.map((d) => (
              <div className="stack-row" key={d.desk}>
                <h3>{d.desk}</h3>
                <ul>
                  {d.items.map((t) => (
                    <li key={t.name} className={t.exploring ? "exploring" : undefined}>
                      <TechIcon icon={t.icon} />
                      <span>{t.name}</span>
                      {t.exploring && <em>exploring</em>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ CURRENTLY BUILDING ═══════ */}
        <section className="pad building" aria-labelledby="building-hed">
          <div className="sec-head">
            <h2 id="building-hed">Currently Building</h2>
            <span className="tag green">In development</span>
          </div>
          <div className="building-grid">
            <HashVaultInterface />
            <article>
              <p className="kicker">{hashvault.no} / {hashvault.name}</p>
              <h3 className="hed feature-hed">{hashvault.name}</h3>
              <p className="feature-dek">{hashvault.dek}</p>
              <p className="body">{hashvault.teaser}</p>
              <p className="meta-mono">{hashvault.stack.join(" · ").toUpperCase()}</p>
              <p className="status"><span>Status</span> {hashvault.status}</p>
              <Link className="more" href="/work/hashvault">Read case study →</Link>
            </article>
          </div>
        </section>

        {/* ═══════ SELECTED WORK ═══════ */}
        <section className="pad work" aria-labelledby="work-hed">
          <div className="sec-head">
            <h2 id="work-hed">Selected Work</h2>
            <Link href="/work">All work →</Link>
          </div>
          <div className="work-grid">
            <article className="story">
              <KonnectInterface />
              <p className="kicker">{konnect.no} / {konnect.name} · {konnect.date}</p>
              <h3 className="hed">{konnect.dek}</h3>
              <p className="body">{konnect.teaser}</p>
              <p className="meta-mono">{konnect.stack.slice(0, 6).join(" · ").toUpperCase()}</p>
              <Link className="more" href="/work/konnect">Read case study →</Link>
            </article>
            <article className="story dispatch">
              <p className="kicker red">03 / Dispatch · Denthinkers Foundation</p>
              <h3 className="hed">Payments Confirmed Only on Cryptographic Proof</h3>
              <p className="byline">Software Developer Intern · Nov 2025 – Apr 2026</p>
              <p className="body drop">
                The donation module verifies Razorpay orders with server-side HMAC-SHA256 signatures, so a
                payment is confirmed on proof rather than on what the client claims.
              </p>
              <div className="figures">
                <div><b>₹1.5L+</b><span>verified transactions</span></div>
                <div><b>23</b><span>endpoints</span></div>
                <div><b>2,500+</b><span>monthly visits</span></div>
              </div>
              <Link className="more" href="/engineering/payment-verification">Read the report →</Link>
            </article>
          </div>
        </section>

        {/* ═══════ CLASSIFIEDS — accent notices ═══════ */}
        <section className="pad notices" aria-label="Notices">
          <div className="notice red">
            <h4>Situations Wanted</h4>
            <p>Backend engineer, Go and distributed systems. Available for internships and roles. Will not vibe-code.</p>
            <a href={`mailto:${LINKS.email}`}>Reply by email →</a>
          </div>
          <div className="notice ochre">
            <h4>Public Notice</h4>
            <p>HashVault Phase 4b complete: deduplication ships. An integration test suite against real Postgres follows.</p>
            <Link href="/work/hashvault">Details →</Link>
          </div>
          <div className="notice navy">
            <h4>Technical Notice</h4>
            <p>Report {REPORTS[2].no} filed: {REPORTS[2].title.toLowerCase()}. A stolen refresh token cannot be replayed.</p>
            <Link href={`/engineering/${REPORTS[2].slug}`}>Read →</Link>
          </div>
        </section>

        {/* ═══════ ENGINEERING DESK ═══════ */}
        <section className="pad eng" aria-labelledby="eng-hed">
          <div className="sec-head">
            <h2 id="eng-hed">Engineering Desk</h2>
            <span>How Ankit thinks about systems</span>
          </div>
          <div className="eng-grid">
            <div>
              <BlueprintFragment steps={["CLIENT", "API", "SHA-256", "DEDUP", "S3"]} />
              <p className="caption">
                HashVault: content-addressable storage. The full blueprint runs with the{" "}
                <Link href="/work/hashvault#architecture">case study</Link>.
              </p>
            </div>
            <ol className="reports">
              {REPORTS.map((r) => (
                <li key={r.slug}>
                  <Link href={`/engineering/${r.slug}`}>
                    <span className="rno">Technical Report {r.no}</span>
                    <b>{r.title}</b>
                    <span className="rmeta">{r.filedUnder}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
          <Link className="more" href="/engineering">Read the Engineering Desk →</Link>
        </section>

        {/* ═══════ CODING EXCHANGE ═══════ */}
        <section className="pad exch" aria-labelledby="exch-hed">
          <div className="sec-head">
            <h2 id="exch-hed">Coding Exchange</h2>
            <span className="meta-mono">
              {stats.isFallback ? "Last known" : "Live"} · {stats.asOfLabel}
            </span>
          </div>
          <div className="exch-grid">
            <div className="quote">
              <p className="sym">LeetCode</p>
              <b>{lc.contest ? num(lc.contest.rating) : num(lc.solved)}</b>
              <p>
                {lc.contest ? `contest rating · top ${lc.contest.topPercent}%` : "problems solved"}
                <br />
                {lc.solved} problems solved · {lc.easy}/{lc.medium}/{lc.hard}
              </p>
            </div>
            <div className="quote">
              <p className="sym">Codeforces</p>
              <b>{num(cf.rating)}</b>
              <p>
                {cf.rank} · {cf.rounds} rated {cf.rounds === 1 ? "round" : "rounds"}
                <br />
                {cf.lastChange ? `${cf.lastChange > 0 ? "▲ +" : "▼ "}${cf.lastChange} last round` : "—"}
              </p>
            </div>
            <div className="quote">
              <p className="sym">Streak</p>
              <b>{lc.currentStreak}</b>
              <p>
                days running · best {lc.maxStreak}
                <br />
                {lc.act30} active of the last 30
              </p>
            </div>
            <div className="spark-box">
              <p className="sym">Weekly submissions</p>
              <Spark values={stats.weekly} />
            </div>
          </div>
          <Link className="more" href="/markets">Open the full exchange →</Link>
        </section>

        {/* ═══════ BEYOND THE STACK ═══════ */}
        <section className="beyond" aria-labelledby="beyond-hed">
          <div className="pad">
            <div className="beyond-rule" />
            <p className="kicker">Beyond the Stack</p>
            <h2 id="beyond-hed" className="beyond-hed">The Person Behind the Systems</h2>
            <div className="beyond-grid">
              {(Object.keys(HOBBIES) as (keyof typeof HOBBIES)[]).map((k) => {
                const h = HOBBIES[k];
                return (
                  <Link key={k} href={`/${k}`} className={`hobby ${k}`}>
                    <HobbyArt kind={k} />
                    <h3>{h.title}</h3>
                    <p>{h.line}</p>
                    <span>{h.verb} →</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════ THE TERMINAL ═══════ */}
        <section className="pad terminal-sec" aria-labelledby="term-hed">
          <div className="sec-head">
            <h2 id="term-hed">The Terminal</h2>
            <span>Type <code>help</code> · ↑ history · Tab completes</span>
          </div>
          <Terminal
            stats={{
              solved: lc.solved,
              lcRating: lc.contest?.rating ?? null,
              cfRating: cf.rating,
              cfRank: cf.rank,
              streak: lc.currentStreak,
            }}
          />
        </section>

        <Colophon />
      </div>
    </div>
  );
}
