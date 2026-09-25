import type { Metadata } from "next";
import Link from "next/link";
import { Colophon } from "@/components/edition/Colophon";
import { Masthead } from "@/components/edition/Masthead";
import { ReportDiagram } from "@/components/edition/Plates";
import { REPORTS } from "@/lib/content";
import "@/styles/edition.css";
import { deskFor } from "@/lib/desk";

export const metadata: Metadata = {
  title: "Engineering Desk",
  description: "Technical reports by Ankit Sinha on content-addressable storage, message-driven systems, token rotation and payment verification.",
  alternates: { canonical: "/engineering" },
};

export const revalidate = 3600;

export default function EngineeringDesk() {
  return (
    <div className={`se ${deskFor("/engineering")}`}>
      <div className="edition">
        <Masthead active="/engineering" desk="The Engineering Desk" />
        <section className="pad page-open">
          <p className="kicker red">The Engineering Desk</p>
          <h1 className="page-hed">How the Systems Are Thought Through</h1>
          <p className="lead-dek">
            Technical reports from the projects: the trade-offs, the failure modes and the reasoning behind
            each design — not another gallery.
          </p>
        </section>

        <section className="pad">
          <ol className="report-archive">
            {REPORTS.map((r) => (
              <li key={r.slug}>
                <Link href={`/engineering/${r.slug}`}>
                  <ReportDiagram kind={r.diagram} />
                  <div>
                    <p className="rno">Technical Report {r.no} · {r.date}</p>
                    <h2 className="hed">{r.title}</h2>
                    <p className="body">{r.dek}</p>
                    <p className="rmeta">Filed under: {r.filedUnder} · {r.project}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <Colophon />
      </div>
    </div>
  );
}
