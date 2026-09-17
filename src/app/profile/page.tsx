import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Rule } from "@/components/Rule";
import { Kicker } from "@/components/Kicker";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "Ankit Sinha — MCA candidate at IIT Patna, BCA from Lovely Professional University, backend engineer working in Go, Postgres, Redis and distributed systems.",
  alternates: { canonical: "/profile" },
};

function Entry({
  title,
  place,
  when,
  detail,
}: {
  title: string;
  place: string;
  when: string;
  detail?: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex flex-wrap justify-between items-baseline gap-x-4">
        <h3 className="font-display font-bold text-[1.0625rem] leading-tight m-0">{title}</h3>
        <span className="text-[9.5px] tracking-[0.12em] uppercase text-soft whitespace-nowrap">
          {when}
        </span>
      </div>
      <p className="text-[9.5px] tracking-[0.14em] uppercase text-soft mt-0.5 mb-1">{place}</p>
      {detail && <p className="font-body text-[13px] leading-[1.5] max-w-[65ch]">{detail}</p>}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-[1180px] w-full px-5 py-7 bg-paper text-ink">
      <PageHeader active="/profile" />

      <div className="mt-5 grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-8">
        <div>
          <Kicker accent>Profile</Kicker>
          <h1 className="font-display font-bold text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-balance mb-4">
            Backend Engineer, Distributed Systems
          </h1>
          <p className="font-body text-[14px] leading-[1.6] max-w-[65ch] mb-6">
            Ankit Sinha — also known as Haunts — builds backend services and storage systems in
            Go: modular monoliths with interface-driven boundaries, content-addressable
            deduplication, and the operational detail that keeps a service alive under real
            traffic. Currently pursuing an MCA at IIT Patna after a BCA at Lovely Professional
            University.
          </p>

          <Rule weight="hairline" className="mb-5" />

          <Kicker>Education</Kicker>
          <Entry
            title="Master of Computer Applications (MCA)"
            place="Indian Institute of Technology Patna · Bihta, Patna, India"
            when="Jul 2026 – 2028 (expected)"
          />
          <Entry
            title="Bachelor of Computer Applications (BCA)"
            place="Lovely Professional University · Phagwara, Punjab, India"
            when="Aug 2023 – May 2026"
            detail="CGPA 9.86 / 10.0."
          />

          <Rule weight="hairline" className="my-5" />

          <Kicker>Experience</Kicker>
          <Entry
            title="Software Developer Intern"
            place="Denthinkers Foundation — Hybrid"
            when="Nov 2025 – Apr 2026"
            detail="Next.js 15, React 19, TypeScript, MongoDB, Razorpay, JWT. Built the end-to-end donation module with server-side HMAC-SHA256 signature verification; INR 1.5L+ processed in verified transactions."
          />

          <Rule weight="hairline" className="my-5" />

          <Kicker>Certification</Kicker>
          <Entry
            title="Developing Back-End Apps with Node.js and Express"
            place="IBM / Coursera"
            when="Jan 2026"
          />

          <Rule weight="hairline" className="my-5" />

          <Kicker>Volunteering</Kicker>
          <Entry
            title="Project Intern"
            place="Srijan Mahila Vikash Manch (SMVM) — NGO · Chaibasa, India"
            when="Jul 2024"
            detail="Designed and facilitated gamified, activity-based educational workshops for underprivileged children across community learning centers, and trained facilitators in participatory, learner-centered pedagogy."
          />
        </div>

        <aside>
          <Kicker>Skills</Kicker>
          <dl className="font-body text-[12.5px] leading-[1.55]">
            {[
              ["Languages", "Go, Java, Python, TypeScript, JavaScript, C++, C, SQL"],
              ["Backend & APIs", "Gin (Go), GORM, REST APIs, Node.js, Express.js, Next.js, FastAPI, WebSockets (Socket.IO)"],
              ["Architecture", "Modular Monolith, Microservices, Event-Driven Architecture, Pub/Sub, Caching, Content-Addressable Storage, Graceful Degradation, Distributed Systems"],
              ["Cloud & Storage", "AWS S3 (presigned URLs, SDK v2), AWS EC2, MinIO, Google Cloud Platform (Compute Engine)"],
              ["Infrastructure", "Docker, Docker Compose, Linux, Git, Traefik"],
              ["Databases", "PostgreSQL, MySQL, MongoDB, Redis"],
              ["Messaging & Observability", "RabbitMQ, Apache Kafka, Zap Structured Logging"],
              ["Security", "JWT (HS256, RS256), OAuth 2.0 (Google, GitHub), Opaque Refresh Token Rotation, HMAC-SHA256 Signature Verification, CSRF Protection"],
            ].map(([label, value]) => (
              <div key={label} className="mb-3">
                <dt className="font-utility text-[8.5px] font-bold tracking-[0.14em] uppercase text-soft mb-0.5">
                  {label}
                </dt>
                <dd className="m-0">{value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </main>
  );
}
