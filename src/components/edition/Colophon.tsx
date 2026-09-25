import Link from "next/link";
import { LINKS } from "@/lib/content";

/** Profile, contact and résumé — the back page of every edition. */
export function Colophon() {
  return (
    <footer className="pad backpage" id="contact">
      <hr className="rule-double" />
      <div className="backpage-grid">
        <div>
          <p className="kicker red">Contact</p>
          <h2 className="hed backpage-hed">Let&rsquo;s build something that survives production.</h2>
          <p className="body backpage-body">
            Open to backend and infrastructure roles, internships and interesting collaborations. The
            fastest route is email.
          </p>
          <a className="btn solid" href={`mailto:${LINKS.email}`}>
            {LINKS.email}
          </a>
        </div>

        <dl className="directory">
          <div><dt>Résumé</dt><dd><a href={LINKS.resume} download>Download PDF ↓</a></dd></div>
          <div><dt>GitHub</dt><dd><a href={LINKS.github} target="_blank" rel="noopener noreferrer">AnkitSinha0 ↗</a></dd></div>
          <div><dt>LinkedIn</dt><dd><a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">ankit0sinha ↗</a></dd></div>
          <div><dt>X</dt><dd><a href={LINKS.x} target="_blank" rel="noopener noreferrer">Haunts_01 ↗</a></dd></div>
          <div><dt>Instagram</dt><dd><a href={LINKS.instagram} target="_blank" rel="noopener noreferrer">haunts_01 ↗</a></dd></div>
          <div><dt>Profile</dt><dd><Link href="/profile">Education &amp; experience →</Link></dd></div>
        </dl>
      </div>

      <hr className="rule-thick" />
      <div className="colophon">
        <svg className="regmark" viewBox="0 0 18 18" aria-hidden="true">
          <circle cx="9" cy="9" r="6" fill="none" stroke="#16130F" strokeWidth=".8" />
          <line x1="9" y1="0" x2="9" y2="18" stroke="#16130F" strokeWidth=".8" />
          <line x1="0" y1="9" x2="18" y2="9" stroke="#16130F" strokeWidth=".8" />
        </svg>
        <p className="mark">Ankit Sinha</p>
        <p>Nameplate in Old Standard. Set in Playfair Display, Source Serif, Libre Franklin, Archivo Narrow and JetBrains Mono.</p>
        <p className="printed">Issue No. 01 · Printed at Patna · ankitsin.in</p>
      </div>
    </footer>
  );
}
