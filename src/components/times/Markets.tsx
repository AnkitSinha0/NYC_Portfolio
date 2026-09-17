"use client";

import { useEffect, useRef, useState } from "react";

// Monthly practice volume, Sep '25 → Sep '26. Flat, then the run.
const VOLS = [3, 4, 3, 5, 4, 6, 5, 8, 26, 38, 30, 22, 14];

const INVESTMENTS: [string, number][] = [
  ["Data Structures", 78],
  ["Algorithms", 72],
  ["System Design", 64],
  ["Distributed Systems", 70],
  ["Go", 88],
  ["Physical Health", 52],
];

export function Markets() {
  const ref = useRef<HTMLElement>(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || filled) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setFilled(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [filled]);

  return (
    <section className="band night" id="s6" ref={ref}>
      <div className="mk">
        <div>
          <h5>Live Feed</h5>
          <div className="feed">
            <div className="feed-row">
              <i className="dot" />
              <span className="nm">LeetCode</span>
              <span className="vl">131 solved</span>
              <span className="ch">↑ 64d</span>
            </div>
            <div className="feed-row">
              <i className="dot" style={{ animationDelay: ".5s" }} />
              <span className="nm">Codeforces</span>
              <span className="vl">Newbie (655)</span>
              <span className="ch">→ pupil</span>
            </div>
            <div className="feed-row">
              <i className="dot" style={{ animationDelay: "1s" }} />
              <span className="nm">Submissions</span>
              <span className="vl">685 / yr</span>
              <span className="ch">↑ 75d</span>
            </div>
          </div>
        </div>

        <div className="candle">
          <h5>Practice, 12 Months</h5>
          <svg
            viewBox="0 0 320 130"
            role="img"
            aria-label="Monthly practice volume rising sharply from June and easing through September"
          >
            {VOLS.map((v, i) => {
              const x = 8 + i * 24;
              const h = Math.max(4, v * 2.6);
              const y = 118 - h;
              const up = i === 0 || v >= VOLS[i - 1];
              const col = up ? "var(--grn)" : "#D8402F";
              return (
                <g key={i}>
                  <line x1={x + 5} y1={y - 5} x2={x + 5} y2={y + h + 4} stroke={col} strokeWidth="1" opacity=".7" />
                  <rect x={x} y={y} width="10" height={h} fill={col} opacity=".85" />
                </g>
              );
            })}
            <line x1="0" y1="120" x2="320" y2="120" stroke="currentColor" strokeWidth="1" opacity=".3" />
          </svg>
        </div>

        <div>
          <h5>Things I&rsquo;m Investing In</h5>
          <div className="invest">
            {INVESTMENTS.map(([label, w], i) => (
              <div className="inv-row" key={label}>
                <span>{label}</span>
                <span className="bar">
                  <i style={{ width: filled ? `${w}%` : 0, transitionDelay: `${i * 90}ms` }} />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="quote">“Compound progress beats hype.”</p>
          <svg viewBox="0 0 90 40" role="img" aria-label="Volume bars" style={{ width: "100%" }}>
            <g fill="currentColor" opacity=".7">
              {[10, 14, 8, 20, 28, 34, 24, 18, 26, 12, 16].map((h, i) => (
                <rect key={i} x={2 + i * 8} y={40 - h} width="4" height={h} />
              ))}
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
