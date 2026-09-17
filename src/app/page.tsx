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

      <div className="mt-5">
        <ColumnGrid columns={3}>
          <div>
            <Article kicker="The Lead · Go" kickerAccent hed="The Same Bytes, Stored Once" hedSize="lead" byline="By Ankit Sinha · HashVault · Mar 2026" drop>
              <p>
                Two users upload the same file. Most systems store it twice. HashVault hashes the
                content with SHA-256 and resolves identical bytes to a single S3 key — reference
                counts increment and decrement atomically in SQL, and the object is purged from S3
                and Postgres only when the count reaches zero. A dedup hit skips the upload round
                trip entirely.
              </p>
              <p>
                The service is a modular monolith in Go: interface-driven repository, service and
                handler layers, with a sentinel-error boundary that keeps persistence failures from
                leaking into business logic. Presigned S3 URLs move file bytes browser-to-S3
                directly, leaving the Go server on the control plane.
              </p>
            </Article>
            <p className="font-body italic text-[12px] text-soft mt-1">
              Continued in Work — the two-token auth scheme, the RabbitMQ pipeline, and what a
              30-second graceful shutdown actually buys.
            </p>

            <Rule weight="hairline" className="my-4" />

            <Kicker>Also in Work</Kicker>
            <Article hed="Konnect: Six Services, One Conversation" hedSize="small">
              <p>
                A real-time chat platform across six microservices behind Traefik, with a Socket.IO
                gateway and an event-driven backbone on RabbitMQ and Kafka feeding an AI moderation
                pipeline. Redis sliding-window aggregation suppresses false-positive harassment
                flags.
              </p>
            </Article>
          </div>

          <div>
            <Plate
              src="/ankit-sinha.png"
              alt="Portrait of Ankit Sinha"
              caption="Ankit Sinha. The colour original serves as the social-card image; this duotone runs on the page."
              duotone
            />

            <Rule weight="hairline" className="my-4" />

            <Kicker accent>Dispatch</Kicker>
            <Article hed="Payments Confirmed Only on Cryptographic Proof" hedSize="sub" byline="Denthinkers Foundation · Nov 2025 – Apr 2026">
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
    </main>
  );
}
