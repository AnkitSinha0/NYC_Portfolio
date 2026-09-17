import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Rule } from "@/components/Rule";
import { Kicker } from "@/components/Kicker";

export const metadata: Metadata = {
  title: "Archive",
  description: "Ankit Sinha's résumé — education, experience, projects and technical skills, in full.",
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <main className="mx-auto max-w-[1180px] w-full px-5 py-7 bg-paper text-ink">
      <PageHeader active="/resume" />

      <div className="mt-5 max-w-[720px] mx-auto">
        <div className="flex flex-wrap justify-between items-baseline gap-4 mb-6">
          <div>
            <Kicker accent>Section VII · Archive</Kicker>
            <h1 className="font-display font-bold text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-balance">
              The Full Record
            </h1>
          </div>
          {/* TODO(cv): wire to /ankit-sinha-resume.pdf once the file is supplied */}
          <span className="text-[10.5px] tracking-[0.12em] uppercase text-soft border border-hair px-3 py-2">
            PDF pending
          </span>
        </div>

        <p className="font-body text-[13.5px] leading-[1.55] mb-7 text-soft">
          The HTML below is the same résumé Google indexes — same facts as the projects and
          profile pages, laid out for a single read. A PDF download replaces the notice above
          once it&rsquo;s supplied.
        </p>

        <Rule weight="hairline" className="mb-6" />

        <Kicker>Education</Kicker>
        <div className="font-body text-[13px] leading-[1.5] mb-6">
          <p className="mb-1">
            <strong>Indian Institute of Technology Patna</strong> — Master of Computer
            Applications (MCA), Jul 2026 – 2028 (expected)
          </p>
          <p>
            <strong>Lovely Professional University</strong> — Bachelor of Computer Applications
            (BCA), CGPA 9.86 / 10.0, Aug 2023 – May 2026
          </p>
        </div>

        <Kicker>Experience</Kicker>
        <p className="font-body text-[13px] leading-[1.5] mb-6">
          <strong>Software Developer Intern</strong>, Denthinkers Foundation — Nov 2025 – Apr
          2026. Built the end-to-end Razorpay donation module with server-side HMAC-SHA256
          verification (INR 1.5L+ processed); cookie-based JWT admin auth; 15 route handlers
          across 23 endpoints on a platform serving 2,500+ monthly visits.
        </p>

        <Kicker>Projects</Kicker>
        <p className="font-body text-[13px] leading-[1.5] mb-1">
          <strong>HashVault</strong> — modular-monolith cloud storage in Go, SHA-256
          content-addressable deduplication, two-token auth, RabbitMQ event pipeline.
        </p>
        <p className="font-body text-[13px] leading-[1.5] mb-6">
          <strong>Konnect</strong> — real-time chat across six microservices, Socket.IO gateway,
          RabbitMQ + Kafka backbone, Redis-aggregated AI moderation.
        </p>

        <Kicker>Certification</Kicker>
        <p className="font-body text-[13px] leading-[1.5] mb-6">
          Developing Back-End Apps with Node.js and Express — IBM / Coursera, Jan 2026.
        </p>

        <Kicker>Skills</Kicker>
        <p className="font-body text-[13px] leading-[1.5]">
          Go, Java, Python, TypeScript, C++, SQL · Gin, GORM, Next.js, FastAPI, Socket.IO ·
          PostgreSQL, MongoDB, Redis, RabbitMQ, Kafka · AWS S3 &amp; EC2, MinIO, GCP, Docker,
          Traefik · JWT (HS256/RS256), OAuth 2.0, HMAC-SHA256, CSRF protection.
        </p>
      </div>
    </main>
  );
}
