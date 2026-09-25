import type { Metadata } from "next";
import Link from "next/link";
import { Colophon } from "@/components/edition/Colophon";
import { Masthead } from "@/components/edition/Masthead";
import { REPORTS } from "@/lib/content";
import "@/styles/edition.css";
import { deskFor } from "@/lib/desk";

export const metadata: Metadata = {
  title: "Writing",
  description: "Everything Ankit Sinha has filed: technical reports on storage, messaging, authentication and payments.",
  alternates: { canonical: "/writing" },
};

export const revalidate = 3600;

export default function Writing() {
  return (
    <div className={`se ${deskFor("/writing")}`}>
      <div className="edition">
        <Masthead active="/writing" desk="Writing · The Archive" />
        <section className="pad page-open">
          <p className="kicker red">Writing</p>
          <h1 className="page-hed">The Archive</h1>
          <p className="lead-dek">Everything filed so far, newest first. Essays beyond the engineering desk will run here too.</p>
        </section>
        <section className="pad">
          <ol className="archive-list">
            {REPORTS.map((r) => (
              <li key={r.slug}>
                <span className="rno">{r.date}</span>
                <Link href={`/engineering/${r.slug}`}>
                  <b>{r.title}</b>
                  <span className="body">{r.dek}</span>
                </Link>
                <span className="rmeta">Report {r.no} · {r.filedUnder}</span>
              </li>
            ))}
          </ol>
        </section>
        <Colophon />
      </div>
    </div>
  );
}
