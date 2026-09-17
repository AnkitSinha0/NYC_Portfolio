"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The torn clipping, the red circle that draws itself, and the
 * HashVault card. Clicking the card sets the #hashvault hash — the
 * spread listens for it, so a project view is deep-linkable.
 */
export function Projects() {
  const circleRef = useRef<HTMLSpanElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = circleRef.current;
    if (!el || drawn) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setDrawn(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [drawn]);

  function open() {
    if (location.hash !== "#hashvault") location.hash = "hashvault";
  }

  return (
    <section className="band night" id="s3">
      <div className="projects">
        <div className="torn tex">
          <p className="mini-mast">The Ankit Times</p>
          <hr className="rule-hair" style={{ marginBottom: 10 }} />
          <p className="sub">Projects</p>
          <h3>
            From Ideas{" "}
            <span ref={circleRef} className={`circled${drawn ? " drawn" : ""}`}>
              to Systems
              <svg viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
                <path d="M12,30 C12,10 60,4 104,6 C158,9 192,18 190,32 C188,47 140,56 92,55 C44,54 10,45 14,31" />
              </svg>
            </span>
          </h3>
          <div className="photo strip-photo">
            <span className="lbl">A closer look at what I&rsquo;ve built</span>
          </div>
          <p className="sub" style={{ margin: 0 }}>
            A closer look at what I&rsquo;ve built
          </p>
        </div>

        <div>
          <p className="arch-note">{"// Architecture"} &nbsp;[ full view ]</p>
          <button
            type="button"
            className="proj-card"
            onClick={open}
            aria-label="Open the HashVault feature spread"
          >
            <span className="proj-head">
              <h3>HashVault</h3>
              <span className="no">01</span>
            </span>
            <p className="tagline">Distributed cloud storage system</p>
            <p className="blurb">
              Store files once. Access anywhere. Built with Go, PostgreSQL, Redis, S3 and a lot of
              late nights.
            </p>
            <div className="arch">
              <svg
                viewBox="0 0 560 150"
                role="img"
                aria-label="HashVault architecture: client through Nginx to the Go API, branching to PostgreSQL, Redis, S3 and RabbitMQ workers"
              >
                <g stroke="currentColor" strokeWidth="1" fill="none" opacity=".55">
                  <path d="M92,42 H130" />
                  <path d="M196,42 H236" />
                  <path d="M330,42 H366" />
                  <path d="M330,42 V78 H366" />
                  <path d="M330,42 V114 H366" />
                  <path d="M283,60 V104 H300" />
                </g>
                <g fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="16" y="26" width="76" height="32" />
                  <rect x="130" y="26" width="66" height="32" />
                  <rect x="236" y="26" width="94" height="34" />
                  <rect x="366" y="26" width="112" height="32" />
                  <rect x="366" y="62" width="112" height="32" />
                  <rect x="366" y="98" width="112" height="32" />
                  <rect x="300" y="88" width="96" height="32" />
                </g>
                <g fontFamily="var(--font-utility), sans-serif" fontSize="9" fill="currentColor" textAnchor="middle">
                  <text x="54" y="44">Client</text>
                  <text x="54" y="53" fontSize="7" opacity=".6">(React)</text>
                  <text x="163" y="46">Nginx</text>
                  <text x="283" y="42">API</text>
                  <text x="283" y="52" fontSize="7" opacity=".6">(Go + Gin)</text>
                  <text x="422" y="42">PostgreSQL</text>
                  <text x="422" y="51" fontSize="7" opacity=".6">(metadata)</text>
                  <text x="422" y="78">Redis</text>
                  <text x="422" y="87" fontSize="7" opacity=".6">(cache + queues)</text>
                  <text x="422" y="114">S3</text>
                  <text x="422" y="123" fontSize="7" opacity=".6">(file storage)</text>
                  <text x="348" y="104">RabbitMQ</text>
                  <text x="348" y="113" fontSize="7" opacity=".6">(workers)</text>
                </g>
              </svg>
            </div>
            <span className="proj-actions">
              <span className="btn solid">View Project →</span>
              <a
                className="btn"
                href="https://github.com/AnkitSinha0"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                GitHub ↗
              </a>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
