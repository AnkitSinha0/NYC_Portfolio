import type { Metadata } from "next";
import Image from "next/image";
import { Colophon } from "@/components/edition/Colophon";
import { Masthead } from "@/components/edition/Masthead";
import { TechIcon } from "@/components/edition/TechIcon";
import { LINKS, STACK } from "@/lib/content";
import "@/styles/edition.css";

export const metadata: Metadata = {
  title: "Profile",
  description: "Ankit Sinha — education, experience and technical skills. MCA at IIT Patna, BCA from Lovely Professional University (CGPA 9.86).",
  alternates: { canonical: "/profile" },
};

export const revalidate = 3600;

const EDUCATION: [string, string, string][] = [
  ["Indian Institute of Technology Patna", "Master of Computer Applications", "2026 – 2028 (expected)"],
  ["Lovely Professional University, Punjab", "Bachelor of Computer Applications · CGPA 9.86", "Graduated Aug 2026"],
  ["BOSSE, Sikkim", "Senior Secondary (Class XII) · 84%", "Sep 2023"],
  ["S.J. D.A.V. Public School, Chaibasa", "Secondary (Class X) · 95.6%", "Apr 2020"],
];

export default function Profile() {
  return (
    <div className="se">
      <div className="edition">
        <Masthead active="/profile" desk="Profile" />

        <section className="pad lead profile-open">
          <div className="lead-main">
            <p className="kicker red">Profile</p>
            <h1 className="page-hed">Ankit Sinha</h1>
            <p className="lead-dek">
              Backend engineer. Distributed systems, cloud and infrastructure. Also known as Haunts — the
              handle on LeetCode and Codeforces.
            </p>
            <div className="actions">
              <a className="btn solid" href={LINKS.resume} download>Download résumé (PDF) ↓</a>
              <a className="btn" href={`mailto:${LINKS.email}`}>Email</a>
            </div>
          </div>
          <aside className="lead-side">
            <figure className="portrait">
              <div className="screen">
                <Image src="/ankit-sinha.png" alt="Portrait of Ankit Sinha" fill sizes="(max-width: 880px) 90vw, 360px" />
              </div>
              <figcaption>Patna, India.</figcaption>
            </figure>
          </aside>
        </section>

        <section className="pad case-section" id="experience">
          <h2 className="case-h">Experience</h2>
          <dl className="cv-list">
            <div>
              <dt>Nov 2025 – Apr 2026</dt>
              <dd>
                <b>Software Developer Intern · Denthinkers Foundation</b>
                <p className="body">
                  Built the end-to-end donation module verifying Razorpay orders with server-side HMAC-SHA256
                  signatures. ₹1.5L+ processed in verified transactions across fifteen route handlers and
                  twenty-three endpoints, on a platform serving 2,500+ monthly visits.
                </p>
              </dd>
            </div>
            <div>
              <dt>Jul 2024 · 1 month</dt>
              <dd>
                <b>Project Intern · Srijan Mahila Vikash Manch (NGO)</b>
                <p className="body">
                  Designed gamified, activity-based workshops for underprivileged children across community
                  learning centres, and helped train facilitators in learner-centred teaching.
                </p>
              </dd>
            </div>
          </dl>
        </section>

        <section className="pad case-section">
          <h2 className="case-h">Education</h2>
          <dl className="cv-list">
            {EDUCATION.map(([school, what, when]) => (
              <div key={school}>
                <dt>{when}</dt>
                <dd><b>{school}</b><p className="body">{what}</p></dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="pad case-section">
          <h2 className="case-h">Skills</h2>
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
          <p className="caption">Certification: Developing Back-End Apps with Node.js and Express — Coursera, Jan 2026.</p>
        </section>

        <Colophon />
      </div>
    </div>
  );
}
