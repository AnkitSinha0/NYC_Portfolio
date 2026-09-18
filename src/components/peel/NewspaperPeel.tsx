"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Physically peels a corner of `children` (the newspaper layer) back
 * to reveal whatever sits behind it in the DOM. This is corner-fold
 * geometry, not a CSS trick:
 *
 *   - `u` = how far the pulled corner has moved left of the top-right
 *     corner, `v` = how far it has moved down. Together they define
 *     point P — where the reader's fingertip is holding the paper.
 *   - The crease is the perpendicular bisector of the segment from
 *     the true corner C=(W,0) to P. That line meets the top edge at
 *     A and the right edge at B — by construction, folding the
 *     triangle A-C-B over line A-B lands C exactly on P.
 *   - So the newspaper's visible region is the page minus triangle
 *     A-C-B (a clip-path), and the physical flap you see is triangle
 *     A-P-B, drawn with a shaded gradient standing in for its back.
 *
 * On release it doesn't snap anywhere — it relaxes toward a
 * gravity-sagged rest point under a damped spring, oscillates once
 * or twice, and then just hangs there until grabbed again.
 */

const MIN_U = 10;
const MIN_V = 8;
const MAX_FRACTION = 0.86; // never let the crease approach the far corner
const DEFAULT_U = 78; // resting "dog-ear" — always a little lifted, always grabbable
const DEFAULT_V = 58;

// spring tuning: soft enough to read as paper, not elastic
const STIFFNESS = 70;
const DAMPING = 11;
const GRAVITY_PULL = 0.22; // fraction of remaining slack the corner sags on release
const SETTLE_EPS = 0.06;

type Vec = { u: number; v: number };

export function NewspaperPeel({ children }: { children: React.ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef({ w: 1, h: 1 });
  const [size, setSize] = useState({ w: 1, h: 1 });
  const [p, setP] = useState<Vec>({ u: DEFAULT_U, v: DEFAULT_V });
  const [resting, setResting] = useState(true);
  const [dragging, setDragging] = useState(false);

  const pRef = useRef(p);
  useEffect(() => {
    pRef.current = p;
  }, [p]);
  const velRef = useRef({ u: 0, v: 0 });
  const lastMoveRef = useRef<{ u: number; v: number; t: number } | null>(null);
  const rafRef = useRef<number | null>(null);

  // Track container size so the geometry stays correct on resize.
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (!r) return;
      rectRef.current = { w: r.width, h: r.height };
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const clamp = useCallback((v: Vec): Vec => {
    const { w, h } = rectRef.current;
    return {
      u: Math.min(Math.max(v.u, MIN_U), w * MAX_FRACTION),
      v: Math.min(Math.max(v.v, MIN_V), h * MAX_FRACTION),
    };
  }, []);

  const stopSpring = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const runSpring = useCallback(() => {
    const { h } = rectRef.current;
    const current = pRef.current;
    const restU = current.u * (1 - GRAVITY_PULL * 0.25);
    const restV = current.v + (h * MAX_FRACTION - current.v) * GRAVITY_PULL;
    const rest = clamp({ u: restU, v: restV });

    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.032);
      last = now;

      const cur = pRef.current;
      const vel = velRef.current;

      const ax = -STIFFNESS * (cur.u - rest.u) - DAMPING * vel.u;
      const ay = -STIFFNESS * (cur.v - rest.v) - DAMPING * vel.v;
      vel.u += ax * dt;
      vel.v += ay * dt;

      const next = clamp({ u: cur.u + vel.u * dt, v: cur.v + vel.v * dt });
      pRef.current = next;
      setP(next);

      const settled =
        Math.abs(vel.u) + Math.abs(vel.v) < SETTLE_EPS * 20 &&
        Math.abs(next.u - rest.u) + Math.abs(next.v - rest.v) < SETTLE_EPS * 20;

      if (settled) {
        rafRef.current = null;
        setResting(true);
        return;
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  }, [clamp]);

  const toLocal = useCallback((clientX: number, clientY: number): Vec => {
    const el = hostRef.current;
    if (!el) return pRef.current;
    const r = el.getBoundingClientRect();
    return { u: r.width - (clientX - r.left), v: clientY - r.top };
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      stopSpring();
      setDragging(true);
      setResting(false);
      (e.target as Element).setPointerCapture(e.pointerId);
      lastMoveRef.current = { ...toLocal(e.clientX, e.clientY), t: performance.now() };
      e.preventDefault();
    },
    [stopSpring, toLocal],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const raw = toLocal(e.clientX, e.clientY);
      const next = clamp(raw);
      const now = performance.now();
      const last = lastMoveRef.current;
      if (last) {
        const dt = Math.max((now - last.t) / 1000, 0.001);
        velRef.current = { u: (next.u - last.u) / dt, v: (next.v - last.v) / dt };
      }
      lastMoveRef.current = { ...next, t: now };
      pRef.current = next;
      setP(next);
    },
    [dragging, clamp, toLocal],
  );

  const endDrag = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    runSpring();
  }, [dragging, runSpring]);

  useEffect(() => stopSpring, [stopSpring]);

  // ── geometry ──
  const measured = size.w > 1 && size.h > 1;
  const { w, h } = size;
  const C = { x: w, y: 0 };
  const P = { x: w - p.u, y: p.v };
  const M = { x: (C.x + P.x) / 2, y: (C.y + P.y) / 2 };
  const f = { x: p.v, y: p.u }; // perpendicular to (P - C)

  const tTop = p.u > 0.001 ? -M.y / f.y : 0;
  const A = {
    x: Math.min(Math.max(M.x + tTop * f.x, 0), w),
    y: 0,
  };
  const tRight = p.v > 0.001 ? (w - M.x) / f.x : 0;
  const B = {
    x: w,
    y: Math.min(Math.max(M.y + tRight * f.y, 0), h),
  };

  const clipPath = measured
    ? `polygon(0 0, ${A.x}px 0, ${w}px ${B.y}px, ${w}px ${h}px, 0 ${h}px)`
    : undefined;
  const flapPoints = `${A.x},${A.y} ${P.x},${P.y} ${B.x},${B.y}`;

  return (
    <div
      ref={hostRef}
      className={`peel-host${dragging ? " dragging" : ""}`}
      style={{ position: "absolute", inset: 0 }}
    >
      <div className="peel-page" style={{ clipPath, WebkitClipPath: clipPath }}>
        {children}
      </div>

      {measured && (
        <>
          <svg
            className="peel-flap-svg"
            width={w}
            height={h}
            viewBox={`0 0 ${w} ${h}`}
            style={{ position: "absolute", inset: 0, overflow: "visible" }}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="peelShade" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--paper-hi)" />
                <stop offset="55%" stopColor="var(--paper-lo)" />
                <stop offset="100%" stopColor="var(--hair-2)" />
              </linearGradient>
            </defs>
            <g className={resting && !dragging ? "peel-idle-drift" : undefined}>
              <polygon points={flapPoints} fill="url(#peelShade)" className="peel-flap" />
              <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} className="peel-hinge" />
            </g>
          </svg>

          {/* the actual grab target — generous hit area around the flap tip */}
          <div
            className="peel-handle"
            style={{ left: P.x, top: P.y }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            role="button"
            tabIndex={0}
            aria-label="Peel the front page back to see the profile underneath"
          />

          {resting && !dragging && p.u < DEFAULT_U * 1.3 && p.v < DEFAULT_V * 1.3 && (
            <div className="peel-hint" style={{ right: Math.max(w * 0.02, 12) }}>
              <span className="arrow">↙</span>
              Pull to reveal
              <em>a cleaner perspective</em>
            </div>
          )}
        </>
      )}
    </div>
  );
}
