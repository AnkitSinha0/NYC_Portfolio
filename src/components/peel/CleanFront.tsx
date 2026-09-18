import Image from "next/image";
import Link from "next/link";

const PROJECTS = [
  {
    slug: "hashvault",
    name: "HashVault",
    blurb: "Distributed cloud storage with SHA-256 deduplication, presigned S3 uploads and async processing.",
    tags: ["Go", "PostgreSQL", "Redis", "S3"],
  },
  {
    slug: "konnect",
    name: "Konnect",
    blurb: "Real-time chat platform across six microservices, event-driven on RabbitMQ and Kafka.",
    tags: ["Node.js", "MongoDB", "Socket.IO"],
  },
];

/**
 * The clean page underneath — deliberately a different register from
 * the newspaper above it, not a smaller copy of it: sans-serif, card
 * grid, buttons. Modern editorial, the way the front page would read
 * if it were designed for reading rather than for character.
 */
export function CleanFront() {
  return (
    <main className="w-full h-full overflow-hidden bg-paper text-ink flex flex-col">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-10 px-8 md:px-16 py-10 md:py-14 min-h-0">
        {/* ── left: identity + work ── */}
        <div className="flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-baseline justify-between text-[10px] font-bold tracking-[0.18em] uppercase text-soft mb-5">
            <span>Software Engineer</span>
            <span>Patna, India</span>
          </div>

          <h1 className="font-utility font-black text-[clamp(2.4rem,4.6vw,4rem)] leading-[0.98] tracking-[-0.02em] text-ink m-0">
            Ankit Sinha<span className="text-red">.</span>
          </h1>
          <p className="font-body text-[15px] md:text-[16px] leading-[1.5] text-soft mt-3 max-w-[46ch]">
            I build backend systems and storage infrastructure for a more open internet —
            distributed, dependable, and built to survive real production traffic.
          </p>

          <div className="flex items-center gap-5 mt-6">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 bg-ink text-paper text-[11.5px] font-bold tracking-[0.08em] uppercase px-5 py-3 hover:opacity-85 transition-opacity"
            >
              View My Work →
            </Link>
            <Link
              href="/resume"
              className="text-[11.5px] font-bold tracking-[0.08em] uppercase text-ink border-b border-hair hover:border-ink pb-0.5 transition-colors"
            >
              View Résumé
            </Link>
          </div>

          <div className="flex items-baseline justify-between mt-9 mb-3">
            <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-soft m-0">
              Selected Work
            </h2>
            <Link href="/work" className="text-[10px] font-bold tracking-[0.1em] uppercase text-soft hover:text-ink">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PROJECTS.map((p) => (
              <Link
                key={p.slug}
                href={`/work/${p.slug}`}
                className="block border border-hair p-4 hover:border-ink transition-colors"
              >
                <h3 className="font-utility font-bold text-[15px] tracking-[-0.01em] m-0 mb-1.5">
                  {p.name}
                </h3>
                <p className="font-body text-[11.5px] leading-[1.45] text-soft m-0 mb-3">
                  {p.blurb}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[9px] font-bold tracking-[0.06em] uppercase text-soft border border-hair px-1.5 py-0.5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-ink">
                  Case Study →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── right: portrait + data ── */}
        <div className="flex flex-col min-h-0">
          <div className="relative aspect-[4/3] w-full flex-shrink-0 overflow-hidden">
            <Image
              src="/ankit-sinha.png"
              alt="Ankit Sinha"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover grayscale"
            />
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="text-[9.5px] font-bold tracking-[0.16em] uppercase text-soft m-0 mb-2">
                Tech Stack
              </h3>
              <dl className="font-body text-[11.5px] leading-[1.6] space-y-1.5">
                <div>
                  <dt className="inline font-bold text-ink">Languages </dt>
                  <dd className="inline text-soft">Go, Python, TypeScript, C++</dd>
                </div>
                <div>
                  <dt className="inline font-bold text-ink">Backend </dt>
                  <dd className="inline text-soft">Gin, Node, Express, FastAPI</dd>
                </div>
                <div>
                  <dt className="inline font-bold text-ink">Data </dt>
                  <dd className="inline text-soft">PostgreSQL, MongoDB, Redis</dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="text-[9.5px] font-bold tracking-[0.16em] uppercase text-soft m-0 mb-2">
                Problem Solving
              </h3>
              <dl className="font-body text-[11.5px] leading-[1.6] space-y-1.5">
                <div>
                  <dt className="inline font-bold text-ink">LeetCode </dt>
                  <dd className="inline text-soft">131 solved · 64-day streak</dd>
                </div>
                <div>
                  <dt className="inline font-bold text-ink">Codeforces </dt>
                  <dd className="inline text-soft">655 rated</dd>
                </div>
              </dl>
              <Link
                href="/markets"
                className="inline-block mt-2 text-[10px] font-bold tracking-[0.08em] uppercase text-ink border-b border-hair hover:border-ink"
              >
                View Profiles →
              </Link>
            </div>
          </div>

          <p className="font-body italic text-[13px] text-soft mt-auto pt-6">
            “Building tools for a more open internet.”
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between px-8 md:px-16 py-4 border-t border-hair text-[10px] font-bold tracking-[0.1em] uppercase text-soft">
        <span>Let&rsquo;s build something interesting.</span>
        <div className="flex gap-5">
          <a href="https://github.com/AnkitSinha0" target="_blank" rel="noopener noreferrer" className="hover:text-ink">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/ankit0sinha/" target="_blank" rel="noopener noreferrer" className="hover:text-ink">
            LinkedIn
          </a>
          <a href="https://x.com/Haunts_01" target="_blank" rel="noopener noreferrer" className="hover:text-ink">
            X
          </a>
        </div>
      </div>
    </main>
  );
}
