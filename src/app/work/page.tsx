import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Rule } from "@/components/Rule";
import { Kicker } from "@/components/Kicker";
import { PROJECTS } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Projects by Ankit Sinha: HashVault, a Go cloud-storage platform, and Konnect, a real-time chat platform across six microservices.",
  alternates: { canonical: "/work" },
};

export default function WorkIndexPage() {
  return (
    <main className="mx-auto max-w-[1180px] w-full px-5 py-7 bg-paper text-ink">
      <PageHeader active="/work" />

      <div className="mt-5 max-w-[900px] mx-auto">
        <Kicker accent>Section I · Work</Kicker>
        <h1 className="font-display font-bold text-[clamp(1.75rem,4vw,2.75rem)] leading-tight text-balance mb-6">
          Projects, in Full
        </h1>

        <div className="space-y-8">
          {PROJECTS.map((p, i) => (
            <div key={p.slug}>
              {i > 0 && <Rule weight="hairline" className="mb-8" />}
              <Link href={`/work/${p.slug}`} className="group block">
                <Kicker>{p.dek}</Kicker>
                <h2 className="font-display font-bold text-[1.5rem] leading-tight text-balance mb-1.5 group-hover:underline">
                  {p.title}
                </h2>
                <p className="text-[9.5px] tracking-[0.14em] uppercase text-soft mb-2.5">
                  {p.byline}
                </p>
                <p className="font-body text-[13px] leading-[1.5] max-w-[65ch]">{p.intro[0]}</p>
                <p className="font-body italic text-[12px] text-soft mt-1.5">
                  Read the full article →
                </p>
              </Link>
            </div>
          ))}
        </div>

        <Rule weight="hairline" className="my-8" />

        <Kicker accent>Dispatch</Kicker>
        <h2 className="font-display font-bold text-[1.25rem] leading-tight text-balance mb-1.5">
          Payments Confirmed Only on Cryptographic Proof
        </h2>
        <p className="text-[9.5px] tracking-[0.14em] uppercase text-soft mb-2.5">
          Software Developer Intern · Denthinkers Foundation · Nov 2025 – Apr 2026
        </p>
        <div className="font-body text-[13px] leading-[1.5] max-w-[65ch] space-y-2">
          <p>
            Built and shipped features on a live production platform (denthinkers.in) spanning 15
            API route handlers across 23 endpoints, working across both backend services and
            frontend delivery.
          </p>
          <p>
            Developed the end-to-end donation module integrating Razorpay order creation with
            server-side HMAC-SHA256 signature verification, so payments are confirmed only on
            cryptographic proof rather than client-reported status; the module has processed
            INR 1.5L+ in verified transactions.
          </p>
          <p>
            Implemented cookie-based JWT admin authentication (httpOnly, 7-day expiry) with
            middleware-gated protected routes, and built a draft/publish CMS content workflow with
            deterministic slug-collision handling.
          </p>
          <p>
            Tuned the platform for production traffic via MongoDB connection pooling and
            cache-control / ISR revalidation, supporting 2,500+ monthly visits (Similarweb,
            Jul 2026).
          </p>
        </div>
      </div>
    </main>
  );
}
