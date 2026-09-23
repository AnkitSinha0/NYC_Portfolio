import Link from "next/link";
import "@/styles/edition.css";

export default function NotFound() {
  return (
    <div className="se">
      <div className="edition">
        <div className="pad" style={{ paddingTop: 22, paddingBottom: 60 }}>
          <hr className="rule-hair" />
          <p className="nameplate">Ankit Sinha</p>
          <hr className="rule-thick" />
          <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center", padding: "56px 0" }}>
            <p className="kicker red">Correction</p>
            <h1 className="hed" style={{ fontSize: "clamp(1.5rem,3.5vw,2rem)" }}>
              This Page Was Never Printed
            </h1>
            <p className="body" style={{ textAlign: "center" }}>
              No edition ran the page you&rsquo;re looking for. Try the{" "}
              <Link href="/" style={{ borderBottom: "1px solid var(--ink)" }}>front page</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
