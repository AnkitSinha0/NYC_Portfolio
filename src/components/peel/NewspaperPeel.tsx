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
 *   - The newspaper's visible region is the page minus that triangle
 *     (a clip-path), and the physical flap is the same triangle,
 *     redrawn with curved outer edges, paper grain, and a shading
 *     gradient standing in for its back.
 *
 * On release it doesn't snap anywhere — it relaxes toward a
 * gravity-sagged rest point under a damped spring and just hangs
 * until grabbed again. Pull far enough and it tears free instead:
 * the hinge roughens into a torn edge and the sheet falls away,
 * permanently revealing the page underneath. A small link brings it
 * back.
 */

const MIN_U = 10;
const MIN_V = 8;
const MAX_FRACTION = 0.92;
const DEFAULT_U = 78; // resting "dog-ear" — always a little lifted, always grabbable
const DEFAULT_V = 58;

// spring tuning: soft enough to read as paper, not elastic
const STIFFNESS = 70;
const DAMPING = 11;
const GRAVITY_PULL = 0.22; // fraction of remaining slack the corner sags on release
const SETTLE_EPS = 0.06;

// past this fraction of the max pull, the hinge starts to roughen
const TEAR_START = 0.62;
// release past this fraction and the sheet tears free rather than hangs
const TEAR_RELEASE = 0.82;

// fixed pattern so the torn edge has a consistent, non-jittery shape
// as A and B move — amplitude multipliers, not raw pixels.
const TEAR_JITTER = [0.35, -0.65, 0.85, -0.3, 0.6, -0.8, 0.4, -0.5, 0.7, -0.4];

type Vec = { u: number; v: number };
type Pt = { x: number; y: number };

function tornPoints(A: Pt, B: Pt): Pt[] {
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const amp = Math.min(11, len * 0.045);
  return TEAR_JITTER.map((j, i) => {
    const t = (i + 1) / (TEAR_JITTER.length + 1);
    return { x: A.x + dx * t + nx * j * amp, y: A.y + dy * t + ny * j * amp };
  });
}

// Deterministic hash so the torn edge has a fixed fibrous pattern —
// stable as A/B move, instead of flickering with Math.random().
function hash(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

type Fiber = { x1: number; y1: number; x2: number; y2: number; op: number };

/** A ragged, feathered band along A-B — the actual torn-paper edge,
 * not a clean line: a jittered-width ribbon plus short fiber ticks
 * spiking off it, the way a hand-torn sheet's edge frays. */
function tearRibbon(A: Pt, B: Pt): { ribbonPoints: string; fibers: Fiber[] } {
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const N = 20;
  const amp = Math.min(9, len * 0.04);
  const upper: Pt[] = [];
  const lower: Pt[] = [];
  const fibers: Fiber[] = [];

  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const baseX = A.x + dx * t;
    const baseY = A.y + dy * t;
    const j = hash(i) * 2 - 1;
    const cx = baseX + nx * j * amp;
    const cy = baseY + ny * j * amp;
    const halfW = 1 + Math.abs(j) * 3.4;
    upper.push({ x: cx + nx * halfW, y: cy + ny * halfW });
    lower.push({ x: cx - nx * halfW, y: cy - ny * halfW });
    if (i % 2 === 1) {
      const flen = 3 + hash(i + 50) * 9;
      const dir = j >= 0 ? 1 : -1;
      fibers.push({
        x1: cx,
        y1: cy,
        x2: cx + nx * flen * dir,
        y2: cy + ny * flen * dir,
        op: 0.22 + hash(i + 90) * 0.4,
      });
    }
  }

  const ribbon = [...upper, ...lower.reverse()];
  return { ribbonPoints: ribbon.map((pt) => `${pt.x},${pt.y}`).join(" "), fibers };
}

function bulge(from: Pt, to: Pt, awayFrom: Pt, amount: number): Pt {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  let nx = -dy / len;
  let ny = dx / len;
  // point the bulge away from the triangle's own centroid
  const toMid = { x: mx - awayFrom.x, y: my - awayFrom.y };
  if (nx * toMid.x + ny * toMid.y < 0) {
    nx = -nx;
    ny = -ny;
  }
  return { x: mx + nx * amount, y: my + ny * amount };
}

export function NewspaperPeel({ children }: { children: React.ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef({ w: 1, h: 1 });
  const [size, setSize] = useState({ w: 1, h: 1 });
  const [p, setP] = useState<Vec>({ u: DEFAULT_U, v: DEFAULT_V });
  const [resting, setResting] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [phase, setPhase] = useState<"attached" | "detaching" | "removed">("attached");
  const [detachT, setDetachT] = useState(0);

  const pRef = useRef(p);
  useEffect(() => {
    pRef.current = p;
  }, [p]);
  const velRef = useRef({ u: 0, v: 0 });
  const lastMoveRef = useRef<{ u: number; v: number; t: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const draggingRef = useRef(false);

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

  const peelRatio = useCallback((v: Vec) => {
    const { w, h } = rectRef.current;
    return (v.u / (w * MAX_FRACTION) + v.v / (h * MAX_FRACTION)) / 2;
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

  // The sheet tears free: it turns — rotating about the torn hinge,
  // not just sliding away — while the crease itself keeps peeling
  // open, then fades in its last third and stops rendering.
  const runDetach = useCallback(() => {
    setPhase("detaching");
    const { w, h } = rectRef.current;
    const start = pRef.current;
    const t0 = performance.now();
    const dur = 760;
    const from = { u: start.u, v: start.v };
    const to = { u: w * 1.5, v: h * 1.45 };

    const step = (now: number) => {
      const t = Math.min((now - t0) / dur, 1);
      const ease = t * t * (3 - 2 * t);
      const next = { u: from.u + (to.u - from.u) * ease, v: from.v + (to.v - from.v) * ease };
      pRef.current = next;
      setP(next);
      setDetachT(t);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
        setPhase("removed");
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  const toLocal = useCallback((clientX: number, clientY: number): Vec => {
    const el = hostRef.current;
    if (!el) return pRef.current;
    const r = el.getBoundingClientRect();
    return { u: r.width - (clientX - r.left), v: clientY - r.top };
  }, []);

  const beginDrag = useCallback(
    (clientX: number, clientY: number) => {
      stopSpring();
      draggingRef.current = true;
      setDragging(true);
      setResting(false);
      lastMoveRef.current = { ...toLocal(clientX, clientY), t: performance.now() };
    },
    [stopSpring, toLocal],
  );

  const moveDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (!draggingRef.current) return;
      const next = clamp(toLocal(clientX, clientY));
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
    [clamp, toLocal],
  );

  const endDrag = useCallback(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    if (peelRatio(pRef.current) >= TEAR_RELEASE) {
      runDetach();
    } else {
      runSpring();
    }
  }, [peelRatio, runDetach, runSpring]);

  // React's pointer-capture-and-forget model is exactly what breaks
  // "grab it again" if any single event gets lost (fast flicks,
  // the pointer leaving the window mid-drag, etc.) — so on top of
  // capture, a window-level listener guarantees the drag always ends
  // and the sheet is always regrabbable afterwards.
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => moveDrag(e.clientX, e.clientY);
    const onUp = () => endDrag();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("blur", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("blur", onUp);
    };
  }, [dragging, moveDrag, endDrag]);

  useEffect(() => stopSpring, [stopSpring]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (phase !== "attached") return;
      beginDrag(e.clientX, e.clientY);
      e.preventDefault();
    },
    [phase, beginDrag],
  );

  const reattach = useCallback(() => {
    stopSpring();
    draggingRef.current = false;
    setDragging(false);
    setResting(true);
    setDetachT(0);
    setPhase("attached");
    pRef.current = { u: DEFAULT_U, v: DEFAULT_V };
    setP(pRef.current);
  }, [stopSpring]);

  // ── geometry ──
  const measured = size.w > 1 && size.h > 1;
  const { w, h } = size;
  const C = { x: w, y: 0 };
  const P = { x: w - p.u, y: p.v };
  const M = { x: (C.x + P.x) / 2, y: (C.y + P.y) / 2 };
  const f = { x: p.v, y: p.u }; // perpendicular to (P - C)

  const tTop = p.u > 0.001 ? -M.y / f.y : 0;
  const A = { x: Math.min(Math.max(M.x + tTop * f.x, 0), w), y: 0 };
  const tRight = p.v > 0.001 ? (w - M.x) / f.x : 0;
  const B = { x: w, y: Math.min(Math.max(M.y + tRight * f.y, 0), h) };

  const ratio = (p.u / (w * MAX_FRACTION) + p.v / (h * MAX_FRACTION)) / 2;
  const tearing = ratio >= TEAR_START;
  const hingePts = tearing ? tornPoints(A, B) : [];

  const hingeClipSegment = hingePts.map((pt) => `${pt.x}px ${pt.y}px`).join(", ");
  const clipPath = measured
    ? `polygon(0 0, ${A.x}px 0, ${hingeClipSegment ? hingeClipSegment + ", " : ""}${w}px ${B.y}px, ${w}px ${h}px, 0 ${h}px)`
    : undefined;

  const centroid = { x: (A.x + P.x + B.x) / 3, y: (A.y + P.y + B.y) / 3 };
  const segAP = Math.hypot(P.x - A.x, P.y - A.y);
  const segPB = Math.hypot(B.x - P.x, B.y - P.y);
  const c1 = bulge(A, P, centroid, Math.min(16, segAP * 0.1));
  const c2 = bulge(P, B, centroid, Math.min(16, segPB * 0.1));

  const flapPath = measured
    ? `M ${A.x},${A.y} Q ${c1.x},${c1.y} ${P.x},${P.y} Q ${c2.x},${c2.y} ${B.x},${B.y} ` +
      (hingePts.length
        ? hingePts
            .slice()
            .reverse()
            .map((pt) => `L ${pt.x},${pt.y} `)
            .join("")
        : "") +
      "Z"
    : "";

  // Turning, not fading: the flap rotates about the torn hinge as it
  // detaches, easing in a moderate arc, with a slight recede in scale
  // and only fading in its final third — reads as a page being
  // flipped and flung away, not a shape sliding off and dissolving.
  const detachEase = detachT * detachT * (3 - 2 * detachT);
  const hingeMid = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
  const flapTransform =
    phase === "detaching"
      ? {
          transform: `rotate(${-58 * detachEase}deg) scale(${1 - 0.14 * detachEase})`,
          transformOrigin: `${hingeMid.x}px ${hingeMid.y}px`,
          opacity: detachT < 0.62 ? 1 : Math.max(0, 1 - (detachT - 0.62) / 0.38),
        }
      : undefined;

  const tearVisual = tearing ? tearRibbon(A, B) : null;

  if (phase === "removed") {
    return (
      <button type="button" className="peel-restore" onClick={reattach}>
        The Ankit Times ↗
      </button>
    );
  }

  return (
    <div
      ref={hostRef}
      className={`peel-host${dragging ? " dragging" : ""}${phase === "detaching" ? " detaching" : ""}`}
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
          >
            <defs>
              <linearGradient id="peelShade" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--paper-hi)" />
                <stop offset="45%" stopColor="var(--paper)" />
                <stop offset="80%" stopColor="var(--paper-lo)" />
                <stop offset="100%" stopColor="var(--hair-2)" />
              </linearGradient>
              <filter id="peelGrain" x="-30%" y="-30%" width="160%" height="160%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.012 0.55"
                  numOctaves="2"
                  seed="7"
                  result="noise"
                />
                <feColorMatrix
                  in="noise"
                  type="matrix"
                  values="0 0 0 0 0.35  0 0 0 0 0.32  0 0 0 0 0.26  0 0 0 0.5 0"
                  result="grain"
                />
                <feComposite in="grain" in2="SourceGraphic" operator="in" result="grainClip" />
                <feBlend in="grainClip" in2="SourceGraphic" mode="multiply" />
              </filter>
              <filter id="tearBlur" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="0.9" />
              </filter>
            </defs>
            <g
              className={
                resting && !dragging && phase === "attached" ? "peel-idle-drift" : undefined
              }
              style={flapTransform}
            >
              <path d={flapPath} fill="url(#peelShade)" className="peel-flap" />
              <path d={flapPath} fill="transparent" filter="url(#peelGrain)" className="peel-flap-grain" />
              <path
                d={`M ${A.x},${A.y} L ${c1.x},${c1.y} L ${P.x},${P.y}`}
                className="peel-highlight"
                fill="none"
              />
              {!tearing && <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} className="peel-hinge" />}
              {tearVisual && (
                <g className="peel-tear">
                  <polygon
                    points={tearVisual.ribbonPoints}
                    className="peel-tear-ribbon"
                    filter="url(#tearBlur)"
                  />
                  {tearVisual.fibers.map((f, i) => (
                    <line
                      key={i}
                      x1={f.x1}
                      y1={f.y1}
                      x2={f.x2}
                      y2={f.y2}
                      className="peel-tear-fiber"
                      style={{ opacity: f.op }}
                    />
                  ))}
                </g>
              )}
            </g>
          </svg>

          {/* the whole visible flap is grabbable, not just its tip */}
          <svg
            className="peel-hit-svg"
            width={w}
            height={h}
            viewBox={`0 0 ${w} ${h}`}
            style={{ position: "absolute", inset: 0 }}
          >
            <path
              d={flapPath}
              className="peel-hit"
              onPointerDown={onPointerDown}
              role="button"
              tabIndex={0}
              aria-label="Peel the front page back to see the profile underneath"
            />
          </svg>

          {resting && !dragging && phase === "attached" && p.u < DEFAULT_U * 1.3 && p.v < DEFAULT_V * 1.3 && (
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
