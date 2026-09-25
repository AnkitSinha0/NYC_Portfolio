"use client";

import { useEffect, useState } from "react";
import type { Scene } from "@/lib/content";

const TICKER = "GO · CLOUD · DISTRIBUTED SYSTEMS · STORAGE · MESSAGING · KUBERNETES · POSTGRESQL · REDIS · ";
const FADE_MS = 380;

function RegMark() {
  return (
    <svg viewBox="0 0 18 18" className="desk-reg">
      <circle cx="9" cy="9" r="6" />
      <line x1="9" y1="0" x2="9" y2="18" />
      <line x1="0" y1="9" x2="18" y2="9" />
    </svg>
  );
}

/**
 * The desk, turning its pages with you: whichever section sits across
 * the middle of the screen sets what the margins say. Changes cross-
 * fade slowly; nothing here is interactive or announced.
 */
export function SceneMargins({ scenes }: { scenes: Scene[] }) {
  const [active, setActive] = useState(0); // the scene being shown
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let pending: number | null = null;
    let current = 0;
    let timer = 0;
    const show = (i: number) => {
      if (i < 0 || i === current || i === pending) return;
      pending = i;
      window.clearTimeout(timer);
      setFading(true);
      timer = window.setTimeout(() => {
        current = i;
        pending = null;
        setActive(i);
        setFading(false);
      }, FADE_MS);
    };
    const atBottom = () => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 40;
    const io = new IntersectionObserver(
      (entries) => {
        if (atBottom()) return; // the closing scene owns the bottom of the page
        for (const e of entries) {
          if (e.isIntersecting) show(scenes.findIndex((s) => s.id === e.target.id));
        }
      },
      // a thin band across the middle of the viewport
      { rootMargin: "-48% 0px -48% 0px" },
    );
    scenes.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    // The last section can't reach the middle of the screen — the page
    // ends first — so arriving at the bottom turns to the final scene.
    const onScroll = () => {
      if (atBottom()) show(scenes.length - 1);
      else {
        // leaving the bottom: hand back to whichever section is mid-screen
        const mid = window.innerHeight / 2;
        const i = scenes.findIndex((sc) => {
          const r = document.getElementById(sc.id)?.getBoundingClientRect();
          return r ? r.top <= mid && r.bottom >= mid : false;
        });
        if (i >= 0) show(i);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [scenes]);

  const s = scenes[active];
  const cls = fading ? "desk-scene out" : "desk-scene";

  return (
    <div className="desk" aria-hidden="true">
      <div className="desk-side l">
        <RegMark />
        <div className={cls}>
          <div className="desk-frag">
            <b>{s.left.title}</b>
            <span>{s.left.line}</span>
            {s.left.quote && (
              <>
                <hr />
                <i>&ldquo;{s.left.quote}&rdquo;</i>
              </>
            )}
          </div>
        </div>
        <p className={`desk-vert ${cls}`}>{s.vert}</p>
        <RegMark />
      </div>

      <div className="desk-side r">
        <RegMark />
        <div className={cls}>
          <div className="desk-frag">
            <b>{s.right.title}</b>
            {s.right.big && <span className="big">{s.right.big}</span>}
            <span>{s.right.line}</span>
            <hr />
            <span>{s.right.foot}</span>
          </div>
        </div>
        <p className="desk-vert">Patna · India · Est. 2026 · Issue 001</p>
        <div className="desk-ticker">
          <p>{TICKER.repeat(4)}</p>
        </div>
        <RegMark />
      </div>
    </div>
  );
}
