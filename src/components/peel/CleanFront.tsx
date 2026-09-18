import Image from "next/image";
import Link from "next/link";

const PROJECTS = [
  {
    slug: "hashvault",
    name: "HashVault",
    blurb:
      "Distributed cloud storage with SHA-256 content deduplication, presigned S3 uploads and an async processing pipeline.",
    tags: ["Go", "PostgreSQL", "Redis", "S3"],
  },
  {
    slug: "konnect",
    name: "Konnect",
    blurb:
      "Real-time chat across six microservices, event-driven on RabbitMQ and Kafka, with Redis-aggregated moderation.",
    tags: ["Node.js", "MongoDB", "Socket.IO"],
  },
];

const SKILLS: [string, string][] = [
  ["Languages", "Go, Python, TypeScript, C++, Java, SQL"],
  ["Backend", "Gin, GORM, Node.js, Express, FastAPI, Socket.IO"],
  ["Data", "PostgreSQL, MongoDB, Redis"],
  ["Messaging", "RabbitMQ, Apache Kafka"],
  ["Infrastructure", "Docker, Traefik, AWS S3 & EC2, MinIO, GCP"],
  ["Security", "JWT (HS256/RS256), OAuth 2.0, HMAC-SHA256, CSRF"],
];

/**
 * The actual website. A long, independent editorial document that
 * exists in the DOM from the first render — not a box sized to
 * match whatever sits on top of it. See NewspaperOverlay for that.
 *
 * Deliberately not a newspaper: no aged texture, no masthead, no
 * newsprint tokens. Its own palette (--clean-*), its own register —
 * a premium editorial studio site, not a developer-portfolio beige
 * page and not a smaller copy of the front page above it.
 */
export function CleanFront() {
  return (
    <main className="w-full bg-clean-bg text-clean-ink">
      {/* ── hero ── */}
      <section className="max-w-[1280px] mx-auto px-8 md:px-16 pt-16 md:pt-24 pb-20 md:pb-28">
        <div className="flex items-baseline justify-between text-[10px] font-bold tracking-[0.2em] uppercase text-clean-soft mb-8">
          <span>Software Engineer</span>
          <span>Patna, India</span>
        </div>
        <h1 className="font-utility font-black text-[clamp(3rem,7vw,6.5rem)] leading-[0.94] tracking-[-0.03em] m-0">
          Ankit Sinha<span className="text-clean-red">.</span>
        </h1>
        <p className="font-body text-[17px] md:text-[19px] leading-[1.55] text-clean-soft mt-6 max-w-[52ch]">
          I build backend systems and storage infrastructure for a more open internet —
          distributed, dependable, and built to survive real production traffic.
        </p>
        <div className="flex items-center gap-6 mt-9">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 bg-clean-ink text-clean-bg text-[12px] font-bold tracking-[0.08em] uppercase px-6 py-3.5 hover:opacity-85 transition-opacity"
          >
            View My Work →
          </Link>
          <Link
            href="/resume"
            className="text-[12px] font-bold tracking-[0.08em] uppercase border-b border-clean-hair hover:border-clean-ink pb-0.5 transition-colors"
          >
            View Résumé
          </Link>
        </div>
      </section>

      {/* ── selected work ── */}
      <section className="border-t border-clean-hair">
        <div className="max-w-[1280px] mx-auto px-8 md:px-16 py-16 md:py-24">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="font-display font-bold text-[clamp(1.6rem,3vw,2.3rem)] m-0">
              Selected Work
            </h2>
            <Link href="/work" className="text-[10px] font-bold tracking-[0.12em] uppercase text-clean-soft hover:text-clean-ink">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROJECTS.map((p, i) => (
              <Link
                key={p.slug}
                href={`/work/${p.slug}`}
                className="group block border-t border-clean-hair pt-6 hover:border-clean-ink transition-colors"
              >
                <span className="font-utility text-[10px] font-bold tracking-[0.12em] uppercase text-clean-soft">
                  0{i + 1}
                </span>
                <h3 className="font-display font-bold text-[26px] leading-tight mt-2 mb-3 group-hover:text-clean-red transition-colors">
                  {p.name}
                </h3>
                <p className="font-body text-[14px] leading-[1.55] text-clean-soft mb-4 max-w-[46ch]">
                  {p.blurb}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[9px] font-bold tracking-[0.06em] uppercase text-clean-soft border border-clean-hair px-2 py-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <span className="text-[11px] font-bold tracking-[0.08em] uppercase">
                  Case Study →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── about ── */}
      <section className="border-t border-clean-hair">
        <div className="max-w-[1280px] mx-auto px-8 md:px-16 py-16 md:py-24 grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-10 md:gap-16">
          <h2 className="font-display font-bold text-[clamp(1.6rem,3vw,2.3rem)] m-0">About</h2>
          <div>
            <div className="relative aspect-[4/3] w-full max-w-[440px] mb-8">
              <Image
                src="/ankit-sinha.png"
                alt="Ankit Sinha"
                fill
                sizes="(max-width: 768px) 100vw, 440px"
                className="object-cover grayscale"
              />
            </div>
            <p className="font-body text-[16px] leading-[1.65] text-clean-soft max-w-[60ch] mb-4">
              Currently pursuing an MCA at IIT Patna after a BCA at Lovely Professional
              University, CGPA 9.86 / 10.0. Most of what I build is backend: storage systems,
              distributed services, the parts of a product nobody sees until they break.
            </p>
            <p className="font-body text-[16px] leading-[1.65] text-clean-soft max-w-[60ch]">
              Also known as Haunts — the handle on LeetCode and Codeforces, where the same habit
              of showing up daily applies to problem-solving as it does to shipping code.
            </p>
          </div>
        </div>
      </section>

      {/* ── experience ── */}
      <section className="border-t border-clean-hair">
        <div className="max-w-[1280px] mx-auto px-8 md:px-16 py-16 md:py-24">
          <h2 className="font-display font-bold text-[clamp(1.6rem,3vw,2.3rem)] m-0 mb-10">
            Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-x-10 gap-y-3 border-t border-clean-hair pt-8">
            <span className="font-utility text-[11px] font-bold tracking-[0.06em] uppercase text-clean-soft">
              Nov 2025 – Apr 2026
            </span>
            <div>
              <h3 className="font-display font-bold text-[20px] m-0 mb-2">
                Software Developer Intern · Denthinkers Foundation
              </h3>
              <p className="font-body text-[15px] leading-[1.65] text-clean-soft max-w-[70ch]">
                Built the end-to-end donation module verifying Razorpay orders with server-side
                HMAC-SHA256 signatures — payments confirmed on cryptographic proof, not
                client-reported status. Over ₹1.5L processed in verified transactions across
                fifteen API route handlers and twenty-three endpoints, on a platform serving
                2,500+ monthly visits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── engineering ── */}
      <section className="border-t border-clean-hair">
        <div className="max-w-[1280px] mx-auto px-8 md:px-16 py-16 md:py-24">
          <h2 className="font-display font-bold text-[clamp(1.6rem,3vw,2.3rem)] m-0 mb-10">
            Engineering
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {SKILLS.map(([label, value]) => (
                <div key={label}>
                  <h3 className="text-[10px] font-bold tracking-[0.14em] uppercase text-clean-soft m-0 mb-2">
                    {label}
                  </h3>
                  <p className="font-body text-[14px] leading-[1.5] m-0">{value}</p>
                </div>
              ))}
            </div>
            <div className="border-t md:border-t-0 md:border-l border-clean-hair pt-8 md:pt-0 md:pl-12">
              <h3 className="text-[10px] font-bold tracking-[0.14em] uppercase text-clean-soft m-0 mb-4">
                Problem Solving
              </h3>
              <div className="flex gap-10 mb-4">
                <div>
                  <div className="font-display font-bold text-[32px] leading-none">131</div>
                  <div className="text-[10px] tracking-[0.06em] uppercase text-clean-soft mt-1">
                    LeetCode solved
                  </div>
                </div>
                <div>
                  <div className="font-display font-bold text-[32px] leading-none">64</div>
                  <div className="text-[10px] tracking-[0.06em] uppercase text-clean-soft mt-1">
                    Day streak
                  </div>
                </div>
                <div>
                  <div className="font-display font-bold text-[32px] leading-none">655</div>
                  <div className="text-[10px] tracking-[0.06em] uppercase text-clean-soft mt-1">
                    Codeforces
                  </div>
                </div>
              </div>
              <Link
                href="/markets"
                className="inline-block text-[11px] font-bold tracking-[0.08em] uppercase border-b border-clean-hair hover:border-clean-ink"
              >
                View Profiles →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── writing ── */}
      <section className="border-t border-clean-hair">
        <div className="max-w-[1280px] mx-auto px-8 md:px-16 py-16 md:py-24">
          <h2 className="font-display font-bold text-[clamp(1.6rem,3vw,2.3rem)] m-0 mb-4">
            Writing
          </h2>
          <p className="font-body text-[15px] leading-[1.6] text-clean-soft max-w-[60ch]">
            Nothing filed yet. The first piece runs here once it&rsquo;s written — in the
            meantime, the work above speaks for itself.
          </p>
        </div>
      </section>

      {/* ── contact ── */}
      <section className="border-t border-clean-hair">
        <div className="max-w-[1280px] mx-auto px-8 md:px-16 py-16 md:py-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="font-display font-bold text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.05] m-0">
              Let&rsquo;s build
              <br />
              something interesting.
            </h2>
          </div>
          <ul className="list-none p-0 m-0 space-y-2 font-body text-[15px]">
            <li>
              <a href="https://github.com/AnkitSinha0" target="_blank" rel="noopener noreferrer" className="border-b border-clean-hair hover:border-clean-ink">
                GitHub
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/ankit0sinha/" target="_blank" rel="noopener noreferrer" className="border-b border-clean-hair hover:border-clean-ink">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="https://x.com/Haunts_01" target="_blank" rel="noopener noreferrer" className="border-b border-clean-hair hover:border-clean-ink">
                X
              </a>
            </li>
            <li>
              <a href="mailto:ankits0057@gmail.com" className="border-b border-clean-hair hover:border-clean-ink">
                Email
              </a>
            </li>
          </ul>
        </div>
        <div className="max-w-[1280px] mx-auto px-8 md:px-16 pb-10 text-[10px] tracking-[0.1em] uppercase text-clean-soft">
          Ankit Sinha · ankitsin.in
        </div>
      </section>
    </main>
  );
}
