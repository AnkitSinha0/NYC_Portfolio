import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Colophon } from "@/components/edition/Colophon";
import { Masthead } from "@/components/edition/Masthead";
import { HashVaultBlueprint, HashVaultInterface, KonnectInterface, KonnectPlate } from "@/components/edition/Plates";
import { PROJECTS, REPORTS } from "@/lib/content";
import "@/styles/edition.css";

export const revalidate = 3600;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = PROJECTS.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: `${p.name} — Case Study`, description: p.teaser, alternates: { canonical: `/work/${p.slug}` } };
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = PROJECTS.find((x) => x.slug === slug);
  if (!p) notFound();
  const report = REPORTS.find((r) => r.slug === p.report);
  const hv = p.slug === "hashvault";

  return (
    <div className="se">
      <div className="edition">
        <Masthead active="/work" desk={`Case Study ${p.no} · ${p.name}`} />

        <article>
          <header className="pad page-open case-open">
            <p className="kicker red">{p.kicker}</p>
            <h1 className="page-hed">{p.name}</h1>
            <p className="lead-dek">{p.dek} {p.teaser}</p>
            <p className="meta-mono">{p.stack.join(" · ").toUpperCase()}</p>
            <p className="filed">
              Filed {p.date} · <a href={p.github} target="_blank" rel="noopener noreferrer">{p.githubLabel} ↗</a>
            </p>
          </header>

          <div className="pad">{hv ? <HashVaultInterface /> : <KonnectInterface />}</div>

          <div className="pad case-cols">
            <section>
              <h2 className="case-h">Overview</h2>
              {p.overview.map((t, i) => <p className={i === 0 ? "body drop" : "body"} key={i}>{t}</p>)}
            </section>
            <section>
              <h2 className="case-h">The Problem</h2>
              {p.problem.map((t, i) => <p className="body" key={i}>{t}</p>)}
            </section>
          </div>

          <section className="pad" id="architecture">
            <div className="supp-label"><span>Architecture · Full Blueprint</span><span>{hv ? "Plate I" : "Plate II"}</span></div>
            {hv ? <HashVaultBlueprint /> : <KonnectPlate />}
          </section>

          <section className="pad case-section">
            <h2 className="case-h">Key Features</h2>
            <dl className="feature-list">
              {p.features.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
          </section>

          <section className="pad case-section">
            <h2 className="case-h">Technical Decisions</h2>
            <dl className="decision-list">
              {p.decisions.map(([k, v], i) => (
                <div key={k}><dt><span>{String(i + 1).padStart(2, "0")}</span>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
          </section>

          <div className="pad case-cols">
            <section>
              <h2 className="case-h">Reliability</h2>
              <ul className="rel-list">{p.reliability.map((t) => <li key={t}>{t}</li>)}</ul>
            </section>
            <section>
              <h2 className="case-h">Lessons</h2>
              {p.lessons.map((t, i) => <p className="body" key={i}>{t}</p>)}
            </section>
          </div>

          <div className="pad case-foot">
            {report && (
              <Link className="notice navy" href={`/engineering/${report.slug}`}>
                <h4>Technical Report {report.no}</h4>
                <p>{report.title} — {report.dek}</p>
              </Link>
            )}
            <a className="btn solid" href={p.github} target="_blank" rel="noopener noreferrer">View on GitHub ↗</a>
            <Link className="btn" href="/work">← All work</Link>
          </div>
        </article>

        <Colophon />
      </div>
    </div>
  );
}
