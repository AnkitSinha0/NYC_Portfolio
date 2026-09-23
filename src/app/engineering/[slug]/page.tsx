import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Colophon } from "@/components/edition/Colophon";
import { Masthead } from "@/components/edition/Masthead";
import { ReportDiagram } from "@/components/edition/Plates";
import { PROJECTS, REPORTS } from "@/lib/content";
import "@/styles/edition.css";

export const revalidate = 3600;

export function generateStaticParams() {
  return REPORTS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/engineering/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = REPORTS.find((x) => x.slug === slug);
  if (!r) return {};
  return { title: `Report ${r.no}: ${r.title}`, description: r.dek, alternates: { canonical: `/engineering/${r.slug}` } };
}

export default async function Report({ params }: PageProps<"/engineering/[slug]">) {
  const { slug } = await params;
  const i = REPORTS.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const r = REPORTS[i];
  const next = REPORTS[(i + 1) % REPORTS.length];
  const project = PROJECTS.find((p) => p.report === r.slug);

  return (
    <div className="se">
      <div className="edition">
        <Masthead active="/engineering" desk={`Technical Report ${r.no}`} />

        <article className="report">
          <header className="pad page-open">
            <p className="kicker navy">Technical Report {r.no} · {r.project}</p>
            <h1 className="page-hed">{r.title}</h1>
            <p className="lead-dek">{r.dek}</p>
            <p className="filed">Issue 01 · {r.date} · Filed under: {r.filedUnder}</p>
          </header>

          <div className="pad">
            <ReportDiagram kind={r.diagram} />
          </div>

          <div className="pad report-body">
            {r.sections.map((s, n) => (
              <section key={s.heading}>
                <h2 className="case-h"><span>§{n + 1}</span> {s.heading}</h2>
                {s.body.map((t, k) => <p key={k} className={n === 0 && k === 0 ? "body drop" : "body"}>{t}</p>)}
              </section>
            ))}
          </div>

          <div className="pad case-foot">
            {project && <Link className="btn solid" href={`/work/${project.slug}`}>Case study: {project.name} →</Link>}
            <Link className="btn" href={`/engineering/${next.slug}`}>Next: Report {next.no} →</Link>
            <Link className="btn ghost" href="/engineering">← All reports</Link>
          </div>
        </article>

        <Colophon />
      </div>
    </div>
  );
}
