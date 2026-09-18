import { Nameplate } from "@/components/Nameplate";
import { SectionBar } from "@/components/SectionBar";
import { Rule } from "@/components/Rule";
import { Kicker } from "@/components/Kicker";
import { Plate } from "@/components/Plate";

/**
 * The clean page underneath — the same NYC broadsheet identity as
 * the peeled front page, not a different genre. What changes isn't
 * the style, it's the density: one story, one portrait, one profile
 * rail. This is the front page set for a recruiter with ninety
 * seconds, not for character — the "professional reader version."
 */
export function CleanFront() {
  return (
    <main className="w-full h-full px-8 md:px-14 py-7 bg-paper text-ink overflow-hidden flex flex-col">
      <Nameplate
        edition="Vol. I · No. 1"
        dateline="Patna, India"
        tagline={["Backend Engineer", "Distributed Systems & Cloud Infrastructure", "ankitsin.in"]}
      />
      <Rule />
      <SectionBar active="/" />

      <div className="flex-1 grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-10 mt-6 min-h-0">
        <div className="min-h-0 overflow-hidden">
          <Kicker accent>The Lead · Go</Kicker>
          <h1 className="font-display font-bold text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.03] tracking-[-0.01em] text-balance m-0 mb-2">
            The Same Bytes, Stored Once
          </h1>
          <p className="text-[9.5px] font-bold tracking-[0.14em] uppercase text-soft mb-4">
            By Ankit Sinha · HashVault · Mar 2026
          </p>
          <p className="font-body text-[14.5px] leading-[1.6] max-w-[62ch] first-letter:font-display first-letter:font-black first-letter:text-[3.1em] first-letter:leading-[0.8] first-letter:float-left first-letter:pr-[0.09em] first-letter:pt-[0.02em]">
            Two users upload the same file. Most systems store it twice. HashVault hashes the
            content with SHA-256 and resolves identical bytes to a single S3 key — reference
            counts increment and decrement atomically in SQL, and the object is purged from S3 and
            Postgres only when the count reaches zero. A dedup hit skips the upload round trip
            entirely.
          </p>
          <p className="font-body italic text-[12.5px] text-soft mt-3">
            Continued in Work — the two-token auth scheme and the RabbitMQ pipeline.
          </p>

          <Rule weight="hairline" className="my-5" />

          <Kicker>Also This Edition</Kicker>
          <p className="font-body text-[13px] leading-[1.55] max-w-[62ch]">
            <strong className="font-display font-bold">Konnect</strong> — a real-time chat
            platform across six microservices, event-driven on RabbitMQ and Kafka. And a
            dispatch from Denthinkers Foundation: payments confirmed on cryptographic proof, not
            client-reported status.
          </p>
        </div>

        <aside className="min-h-0 flex flex-col">
          <Plate
            src="/ankit-sinha.png"
            alt="Portrait of Ankit Sinha"
            caption="Also known as Haunts."
            duotone
          />

          <Rule weight="hairline" className="my-4" />

          <Kicker>Profile</Kicker>
          <dl className="font-body text-[12px] leading-[1.5] mb-4">
            <dt className="font-utility text-[8.5px] font-bold tracking-[0.14em] uppercase text-soft mt-1.5">
              Solving
            </dt>
            <dd className="mt-0.5">LeetCode 131 solved, 64-day streak · Codeforces 655</dd>
            <dt className="font-utility text-[8.5px] font-bold tracking-[0.14em] uppercase text-soft mt-1.5">
              Stack
            </dt>
            <dd className="mt-0.5">Go, TypeScript, PostgreSQL, Redis, Docker</dd>
          </dl>

          <div className="mt-auto pt-3 border-t border-hair flex items-center justify-between text-[10px] font-bold tracking-[0.1em] uppercase text-soft">
            <span>Let&rsquo;s talk</span>
            <span>GitHub · LinkedIn · X</span>
          </div>
        </aside>
      </div>
    </main>
  );
}
