import type { Metadata } from "next";
import Link from "next/link";
import { Colophon } from "@/components/edition/Colophon";
import { Masthead } from "@/components/edition/Masthead";
import { HashVaultInterface, KonnectInterface } from "@/components/edition/Plates";
import { PROJECTS } from "@/lib/content";
import "@/styles/edition.css";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected work by Ankit Sinha: HashVault, a content-addressable storage platform in Go, and Konnect, a real-time chat platform across six microservices.",
  alternates: { canonical: "/work" },
};

export const revalidate = 3600;

export default function WorkIndex() {
  return (
    <div className="se">
      <div className="edition">
        <Masthead active="/work" desk="The Work Section" />
        <section className="pad page-open">
          <p className="kicker red">The Work Section</p>
          <h1 className="page-hed">What Has Been Built</h1>
          <p className="lead-dek">
            Each project runs here as a feature. The case studies carry the architecture, the decisions
            and what went wrong.
          </p>
        </section>

        {PROJECTS.map((p, i) => (
          <section className="pad work-feature" key={p.slug}>
            <div className="sec-head">
              <h2>{p.no} / {p.name}</h2>
              <span>{p.date}</span>
            </div>
            <div className={i % 2 ? "building-grid flip" : "building-grid"}>
              {p.slug === "hashvault" ? <HashVaultInterface /> : <KonnectInterface />}
              <article>
                <p className="kicker">{p.kicker}</p>
                <h3 className="hed feature-hed">{p.dek}</h3>
                <p className="body">{p.teaser}</p>
                <p className="meta-mono">{p.stack.join(" · ").toUpperCase()}</p>
                <p className="status"><span>Status</span> {p.status}</p>
                <Link className="more" href={`/work/${p.slug}`}>Read case study →</Link>
              </article>
            </div>
          </section>
        ))}

        <Colophon />
      </div>
    </div>
  );
}
