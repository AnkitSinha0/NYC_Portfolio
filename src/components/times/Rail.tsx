"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "s1", n: "01", t: "Front Page", s: "Start here." },
  { id: "s2", n: "02", t: "About", s: "A closer look." },
  { id: "s3", n: "03", t: "Projects", s: "Ideas to systems." },
  { id: "s4", n: "04", t: "Terminal", s: "Play around." },
  { id: "s5", n: "05", t: "F1", s: "Speed matters." },
  { id: "s6", n: "06", t: "Markets", s: "Solve. Invest. Grow." },
  { id: "s7", n: "07", t: "Notes", s: "Unfiltered." },
  { id: "s8", n: "08", t: "Contact", s: "Say hello." },
];

type Tone = "aged" | "press";

export function Rail() {
  const [active, setActive] = useState("s1");
  const [tone, setTone] = useState<Tone>("aged");

  // Keep <html data-tone> in sync with the chosen press run.
  // Session-only on purpose: persisting the choice would need a
  // blocking inline script to avoid a flash of the wrong run on load.
  useEffect(() => {
    document.documentElement.setAttribute("data-tone", tone);
  }, [tone]);

  // Scroll-spy across the eight bands.
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.35 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <aside className="rail">
      <div className="mark">A.</div>
      <nav aria-label="Sections">
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} className={active === s.id ? "on" : undefined}>
            <span className="n">{s.n}</span>
            <span>
              <span className="t">{s.t}</span>
              <span className="s">{s.s}</span>
            </span>
          </a>
        ))}
      </nav>
      <div className="strip" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="tone" role="group" aria-label="Press run">
        <button
          type="button"
          className={tone === "aged" ? "on" : undefined}
          aria-pressed={tone === "aged"}
          onClick={() => setTone("aged")}
        >
          Aged
        </button>
        <button
          type="button"
          className={tone === "press" ? "on" : undefined}
          aria-pressed={tone === "press"}
          onClick={() => setTone("press")}
        >
          Press
        </button>
      </div>
      <div className="foot">
        PATNA, INDIA
        <br />
        25.5941° N
        <br />
        85.1376° E
        <span className="hand">
          Same Bytes.
          <br />
          Different Stories.
        </span>
      </div>
    </aside>
  );
}
