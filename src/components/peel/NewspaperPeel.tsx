"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Two independent physical interactions with the newspaper cover:
 *
 *   1. CORNER CURL — grab the top-right corner and it rolls back,
 *      a rounded tube of paper, not a flat diagonal triangle. The
 *      cut between the flat page and the curl is a curve (a
 *      quadratic bezier bulging into the page), and the curled flap
 *      is that same curve translated toward the pointer — a rounded
 *      petal, shaded like a cylinder. Release and it doesn't snap:
 *      a damped spring settles it toward a gravity-sagged rest point
 *      and it just hangs there until grabbed again. This alone never
 *      removes the paper — it is the "lift and peek" gesture.
 *
 *   2. BOTTOM TEAR — once the corner has been curled back far enough,
 *      the bottom edge becomes grabbable. Dragging it up tears the
 *      sheet off from the bottom, a horizontal (not diagonal) torn
 *      edge rising to reveal the page underneath. This is the actual
 *      removal gesture — drag far enough and release, and the sheet
 *      finishes tearing free.
 *
 * Both share one pointer-drag state machine with a window-level
 * safety net (see beginDrag/moveDrag/endDrag) so a lost pointerup
 * can never leave the sheet stuck mid-gesture.
 */

const MIN_U = 10;
const MIN_V = 8;
const MAX_FRACTION = 0.72; // the curl alone only ever lifts a corner, never the whole sheet
const DEFAULT_U = 74; // resting "dog-ear" — always a little lifted, always grabbable
const DEFAULT_V = 56;

const STIFFNESS = 70;
const DAMPING = 11;
const GRAVITY_PULL = 0.22;
const SETTLE_EPS = 0.06;

const TEAR_UNLOCK = 0.3; // fraction of max curl before the bottom edge responds
const TEAR_COMPLETE = 0.82; // release past this fraction of height and it finishes tearing free

const JITTER = [0.35, -0.65, 0.85, -0.3, 0.6, -0.8, 0.4, -0.5, 0.7, -0.4, 0.55, -0.6];

type Vec = { u: number; v: number };
type Pt = { x: number; y: number };
type DragMode = "curl" | "tear" | null;

function fmt(p: Pt) {
  return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
}

export function NewspaperPeel({ children }: { children: React.ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef({ w: 1, h: 1 });
  const [size, setSize] = useState({ w: 1, h: 1 });

  const [p, setP] = useState<Vec>({ u: DEFAULT_U, v: DEFAULT_V });
  const [resting, setResting] = useState(true);
  const [tearY, setTearY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragMode, setDragMode] = useState<DragMode>(null);
  const [phase, setPhase] = useState<"attached" | "removed">("attached");

  const pRef = useRef(p);
  useEffect(() => {
    pRef.current = p;
  }, [p]);
  const tearYRef = useRef(0);
  useEffect(() => {
    tearYRef.current = tearY;
  }, [tearY]);

  const velRef = useRef({ u: 0, v: 0 });
  const lastMoveRef = useRef<{ u: number; v: number; t: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const dragModeRef = useRef<DragMode>(null);
  const tearProxyRef = useRef<{ y: number } | null>(null);

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

  const clampCurl = useCallback((v: Vec): Vec => {
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

  // ── the curl's release physics: sag under gravity, settle, hang ──
  const runCurlSpring = useCallback(() => {
    const { h } = rectRef.current;
    const current = pRef.current;
    const restU = current.u * (1 - GRAVITY_PULL * 0.25);
    const restV = current.v + (h * MAX_FRACTION - current.v) * GRAVITY_PULL;
    const rest = clampCurl({ u: restU, v: restV });

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
      const next = clampCurl({ u: cur.u + vel.u * dt, v: cur.v + vel.v * dt });
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
  }, [clampCurl]);

  // ── finishing the tear once released past the threshold ──
  const finishTear = useCallback(() => {
    const { h } = rectRef.current;
    const proxy = { y: tearYRef.current };
    tearProxyRef.current = proxy;
    gsap.to(proxy, {
      y: h,
      duration: 0.32,
      ease: "power2.in",
      onUpdate: () => {
        tearYRef.current = proxy.y;
        setTearY(proxy.y);
      },
      onComplete: () => setPhase("removed"),
    });
  }, []);

  const toLocal = useCallback((clientX: number, clientY: number) => {
    const el = hostRef.current;
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    return { x: clientX - r.left, y: clientY - r.top };
  }, []);

  const beginDrag = useCallback(
    (mode: DragMode, clientX: number, clientY: number) => {
      if (mode === "curl") stopSpring();
      if (mode === "tear" && tearProxyRef.current) gsap.killTweensOf(tearProxyRef.current);
      dragModeRef.current = mode;
      setDragMode(mode);
      setDragging(true);
      setResting(false);
      const loc = toLocal(clientX, clientY);
      lastMoveRef.current = {
        u: rectRef.current.w - loc.x,
        v: loc.y,
        t: performance.now(),
      };
    },
    [stopSpring, toLocal],
  );

  const moveDrag = useCallback(
    (clientX: number, clientY: number) => {
      const mode = dragModeRef.current;
      if (!mode) return;
      const loc = toLocal(clientX, clientY);
      if (mode === "curl") {
        const next = clampCurl({ u: rectRef.current.w - loc.x, v: loc.y });
        const now = performance.now();
        const last = lastMoveRef.current;
        if (last) {
          const dt = Math.max((now - last.t) / 1000, 0.001);
          velRef.current = { u: (next.u - last.u) / dt, v: (next.v - last.v) / dt };
        }
        lastMoveRef.current = { ...next, t: now };
        pRef.current = next;
        setP(next);
      } else {
        const { h } = rectRef.current;
        const next = Math.min(Math.max(h - loc.y, 0), h);
        tearYRef.current = next;
        setTearY(next);
      }
    },
    [clampCurl, toLocal],
  );

  const endDrag = useCallback(() => {
    const mode = dragModeRef.current;
    if (!mode) return;
    dragModeRef.current = null;
    setDragMode(null);
    setDragging(false);
    if (mode === "curl") {
      runCurlSpring();
    } else {
      const { h } = rectRef.current;
      if (tearYRef.current / h >= TEAR_COMPLETE) {
        finishTear();
      }
      // else: stays exactly where released — a partial tear holds.
    }
  }, [runCurlSpring, finishTear]);

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

  const onCurlDown = useCallback(
    (e: React.PointerEvent) => {
      if (phase !== "attached") return;
      beginDrag("curl", e.clientX, e.clientY);
      e.preventDefault();
    },
    [phase, beginDrag],
  );
  const onTearDown = useCallback(
    (e: React.PointerEvent) => {
      if (phase !== "attached") return;
      beginDrag("tear", e.clientX, e.clientY);
      e.preventDefault();
    },
    [phase, beginDrag],
  );

  const reattach = useCallback(() => {
    stopSpring();
    if (tearProxyRef.current) gsap.killTweensOf(tearProxyRef.current);
    dragModeRef.current = null;
    setDragMode(null);
    setDragging(false);
    setResting(true);
    setTearY(0);
    tearYRef.current = 0;
    setPhase("attached");
    pRef.current = { u: DEFAULT_U, v: DEFAULT_V };
    setP(pRef.current);
  }, [stopSpring]);

  // ── geometry ──────────────────────────────────────────────────
  const measured = size.w > 1 && size.h > 1;
  const { w, h } = size;
  const C: Pt = { x: w, y: 0 };
  const P: Pt = { x: w - p.u, y: p.v };
  const A: Pt = { x: w - p.u, y: 0 };
  const B: Pt = { x: w, y: p.v };

  // hinge curve bulges away from the corner, into the page — a
  // rounded cut, never a straight diagonal.
  const mid: Pt = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const len = Math.hypot(dx, dy) || 1;
  let perp: Pt = { x: -dy / len, y: dx / len };
  const center: Pt = { x: w / 2, y: h / 2 };
  const towardCenter = { x: center.x - mid.x, y: center.y - mid.y };
  if (perp.x * towardCenter.x + perp.y * towardCenter.y < 0) {
    perp = { x: -perp.x, y: -perp.y };
  }
  const bulge = Math.min(46, len * 0.34);
  const Hc: Pt = { x: mid.x + perp.x * bulge, y: mid.y + perp.y * bulge };

  // the curled flap: the same hinge curve, translated toward the
  // pointer — a rounded petal/tube shape, not a pointed triangle.
  const roll = { x: (P.x - mid.x) * 0.94, y: (P.y - mid.y) * 0.94 };
  const A2: Pt = { x: A.x + roll.x, y: A.y + roll.y };
  const B2: Pt = { x: B.x + roll.x, y: B.y + roll.y };
  const Hc2: Pt = { x: Hc.x + roll.x * 1.05, y: Hc.y + roll.y * 1.05 };

  const cutoutPath = measured
    ? `M ${fmt(A)} Q ${fmt(Hc)} ${fmt(B)} L ${fmt(C)} Z`
    : "";
  const flapPath = measured
    ? `M ${fmt(A)} Q ${fmt(Hc)} ${fmt(B)} L ${fmt(B2)} Q ${fmt(Hc2)} ${fmt(A2)} Z`
    : "";

  // bottom tear: a jagged horizontal edge rising from the bottom.
  const tearTopY = h - tearY;
  const tearPts: Pt[] = measured
    ? JITTER.map((j, i) => {
        const t = (i + 1) / (JITTER.length + 1);
        return { x: t * w, y: tearTopY + j * Math.min(9, h * 0.012) };
      })
    : [];
  const tearCutoutPath = measured
    ? `M 0,${tearTopY.toFixed(1)} ${tearPts.map((pt) => `L ${fmt(pt)}`).join(" ")} L ${w},${tearTopY.toFixed(1)} L ${w},${h} L 0,${h} Z`
    : "";

  const clipPath = measured
    ? `path(evenodd, "M0,0 H${w} V${h} H0 Z ${cutoutPath} ${tearCutoutPath}")`
    : undefined;

  const ratio = (p.u / (w * MAX_FRACTION) + p.v / (h * MAX_FRACTION)) / 2;
  const tearUnlocked = ratio >= TEAR_UNLOCK || tearY > 0;

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
      className={`peel-host${dragging ? " dragging" : ""}`}
      style={{ position: "absolute", inset: 0 }}
    >
      <div className="peel-page" style={{ clipPath, WebkitClipPath: clipPath }}>
        {children}
      </div>

      {measured && (
        <>
          {/* ── the curled corner ── */}
          <svg
            className="peel-flap-svg"
            width={w}
            height={h}
            viewBox={`0 0 ${w} ${h}`}
            style={{ position: "absolute", inset: 0, overflow: "visible" }}
          >
            <defs>
              <linearGradient
                id="curlTube"
                gradientUnits="userSpaceOnUse"
                x1={mid.x}
                y1={mid.y}
                x2={mid.x + roll.x}
                y2={mid.y + roll.y}
              >
                <stop offset="0%" stopColor="var(--paper-hi)" />
                <stop offset="28%" stopColor="var(--paper-lo)" />
                <stop offset="52%" stopColor="var(--hair-2)" />
                <stop offset="76%" stopColor="var(--paper)" />
                <stop offset="100%" stopColor="var(--paper-hi)" />
              </linearGradient>
              <filter id="peelGrain" x="-30%" y="-30%" width="160%" height="160%">
                <feTurbulence type="fractalNoise" baseFrequency="0.012 0.55" numOctaves="2" seed="7" result="noise" />
                <feColorMatrix
                  in="noise"
                  type="matrix"
                  values="0 0 0 0 0.35  0 0 0 0 0.32  0 0 0 0 0.26  0 0 0 0.45 0"
                  result="grain"
                />
                <feComposite in="grain" in2="SourceGraphic" operator="in" result="grainClip" />
                <feBlend in="grainClip" in2="SourceGraphic" mode="multiply" />
              </filter>
            </defs>
            <g className={resting && !dragging ? "peel-idle-drift" : undefined}>
              <path d={flapPath} fill="url(#curlTube)" className="peel-flap" />
              <path d={flapPath} fill="transparent" filter="url(#peelGrain)" />
              <path d={`M ${fmt(A)} Q ${fmt(Hc)} ${fmt(B)}`} className="peel-hinge-curve" fill="none" />
            </g>
          </svg>

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
              onPointerDown={onCurlDown}
              role="button"
              tabIndex={0}
              aria-label="Curl the front page back to see the site underneath"
            />
          </svg>

          {/* ── the bottom-edge tear ── */}
          {tearY > 1 && (
            <svg
              className="tear-svg"
              width={w}
              height={h}
              viewBox={`0 0 ${w} ${h}`}
              style={{ position: "absolute", inset: 0, overflow: "visible" }}
            >
              <defs>
                <filter id="tearBlur" x="-10%" y="-80%" width="120%" height="260%">
                  <feGaussianBlur stdDeviation="1.6" />
                </filter>
              </defs>
              <polygon
                points={[{ x: 0, y: tearTopY }, ...tearPts, { x: w, y: tearTopY }, { x: w, y: tearTopY + 10 }, { x: 0, y: tearTopY + 10 }]
                  .map((pt) => fmt(pt))
                  .join(" ")}
                className="peel-tear-ribbon"
                filter="url(#tearBlur)"
              />
            </svg>
          )}

          {tearUnlocked && phase === "attached" && (
            <div
              className={`tear-handle${dragMode === "tear" ? " active" : ""}`}
              style={{ top: Math.max(0, tearTopY - 22) }}
              onPointerDown={onTearDown}
              role="button"
              tabIndex={0}
              aria-label="Tear the front page off from the bottom edge"
            />
          )}

          {resting && !dragging && phase === "attached" && p.u < DEFAULT_U * 1.3 && p.v < DEFAULT_V * 1.3 && tearY < 1 && (
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
