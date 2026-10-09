"use client";

import { useEffect, useRef } from "react";

// The art is drawn in a 100 × 142 box (viewBox "0 -12 100 142") and shown W px wide;
// .gopher in edition.css is sized to match.
const W = 48;
const K = W / 100;
const FEET = 140 * K; // art y = 128, measured from the element's top
const GRIP = 4 * K; // art y = -8, where both hands close
const COMY = 78 * K; // art y = 66, the centre of mass
const GH = FEET - COMY; // feet to centre of mass
const ARM = COMY - GRIP; // hands to centre of mass, hanging
const REACH = 52; // how far from the ledge the hands can still catch it

const GRAV = 0.0017; // px/ms²

// Rope: a Verlet chain whose links resist stretching but not slack.
const STEP = 4;
const ITER = 10;
const N = 40; // particles
const UP = 8; // links above the gopher's hands
const HEAVY = 0.03; // the gopher's inverse mass, against 1 for a rope particle

// Skateboard: 46 × 11, wheels touching at its bottom centre, deck top DECK above that.
const BW = 46, BH = 11, DECK = 10;
const BOARD_MASS = 0.25; // relative to the gopher
const V_AIR = 0.14; // the gopher's speed into the bucket, after kicking the board out from under him
const T_AIR = 650; // ms in the air

// Popcorn bucket, in its own frame: origin at the middle of the base, up is -y.
// It rocks on a corner of its base or, tilting right, on the end of the rule,
// which sits `support` px right of its middle: the rest of the base overhangs.
const BK = {
  half: 20, top: 26, h: 50, support: 8,
  mass: 1, com: 22, r2: 342, // bucket: mass, centre-of-mass height, radius of gyration²
  gm: 0.5, gr2: 577, sink: 20, // gopher: mass, radius of gyration², feet depth in the popcorn
  e: 0.85, // angular speed kept when the base slaps back down
};

type Co = Generator<void, void, number>;
type Pn = { x: number; y: number; px: number; py: number; w: number };
type Mat = [number, number, number, number, number, number];
type Kernel = { on: boolean; x: number; y: number; vx: number; vy: number; rot: number; vr: number; age: number; still: boolean };

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const approach = (v: number, to: number, by: number) => (v < to ? Math.min(to, v + by) : Math.max(to, v - by));
const easeOut = (p: number) => 1 - (1 - p) ** 2;
const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2);
const easeOutBack = (p: number) => 1 + 2.4 * (p - 1) ** 3 + 1.4 * (p - 1) ** 2;

// 2-D affine matrices, in CSS matrix() order
const mul = (A: Mat, B: Mat): Mat => [
  A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1],
  A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3],
  A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5],
];
const T = (x: number, y: number): Mat => [1, 0, 0, 1, x, y];
const R = (a: number): Mat => [Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0];
const S = (x: number, y: number): Mat => [x, 0, 0, y, 0, 0];
const chain = (...ms: Mat[]) => ms.reduce(mul);
const css = (m: Mat) => `matrix(${m.join(",")})`;
const apply = (m: Mat, x: number, y: number) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

function* tween(ms: number, fn: (p: number) => void, abort?: () => boolean): Co {
  for (let t = 0; t < ms; t += yield) {
    if (abort?.()) return;
    fn(t / ms);
  }
  fn(1);
}

/**
 * The front page's one bit of play. A Go gopher walks the masthead rule,
 * throws a rope down the right edge of the portrait and rappels down it,
 * photographs the portrait, and runs to the left end of the Technical
 * Desk rule. When the reader scrolls on, it falls, catches the Selected
 * Work rule, skates along it, fluffs a kickflip into a bucket of popcorn
 * balanced on the far end, and goes over the edge with it. Desktop only;
 * prefers-reduced-motion skips it entirely. Purely decorative.
 *
 * The motion is simulated, not keyframed: the rope is a Verlet chain, the
 * falls are ballistic, the catch is a damped pendulum, and the bucket is a
 * rigid body rocking on its corners, pumped by the gopher's munching.
 *
 * The gopher is drawn after the Go mascot by Renée French (CC BY 4.0).
 */
export function GopherRun() {
  const layer = useRef<HTMLDivElement>(null);
  const gopher = useRef<HTMLDivElement>(null);
  const ropeSvg = useRef<SVGSVGElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const boardEl = useRef<HTMLDivElement>(null);
  const bucketBack = useRef<HTMLDivElement>(null);
  const bucketFront = useRef<HTMLDivElement>(null);
  const kernelBox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = layer.current, g = gopher.current, rs = ropeSvg.current, fl = flash.current,
      bd = boardEl.current, bb = bucketBack.current, bf = bucketFront.current, kb = kernelBox.current;
    const edition = box?.parentElement;
    if (!box || !g || !rs || !fl || !bd || !bb || !bf || !kb || !edition) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(min-width: 900px)").matches) return;

    const part = (s: string) => g.querySelector(s) as SVGElement;
    const footA = part(".g-foot-a"), footB = part(".g-foot-b"), body = part(".g-body"),
      armA = part(".g-arm-a"), armB = part(".g-arm-b"), eyes = part(".g-eyes"), pupils = part(".g-pupils"),
      armEat = part(".g-arm-eat"), teeth = part(".g-teeth");
    const ropePaths = rs.querySelectorAll("path"), peg = rs.querySelector("circle")!;
    const kernelEls = Array.from(kb.children) as HTMLElement[];

    let raf = 0;
    let started = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

    const stop = () => {
      cancelAnimationFrame(raf);
      for (const el of [g, rs, bd, bb, bf, ...kernelEls]) el.style.opacity = "0";
    };

    const run = () => {
      const q = (s: string) => edition.querySelector(s)?.getBoundingClientRect();
      const name = q(".nameplate a"), rule = q(".masthead-se .rule-double"), side = q(".lead-side"),
        screen = q(".lead .portrait .screen"), ground = q("#desk .sec-head");
      if (!name || !rule || !side || !screen || !ground || !q("#work .sec-head")) return;
      const o = box.getBoundingClientRect();
      const X = (v: number) => v - o.left, Y = (v: number) => v - o.top;
      const layerRect = () => box.getBoundingClientRect();

      const top = Y(rule.top); // the masthead's double rule
      const floor = Y(ground.top); // the double rule over the Technical Desk
      const deskL = X(ground.left); // where that rule ends on the left
      const wall = X(side.right); // the portrait's right edge
      const anchor = { x: wall, y: top }; // the rope is tied off at the end of the rule
      const bound = wall + 24; // hands this far out puts the braced feet on the wall
      const startX = X(name.right) + 70;
      const edgeX = wall - 20;
      const stopX = X(side.left) - 60; // between the buttons and the facts

      Object.assign(fl.style, {
        left: `${X(screen.left)}px`, top: `${Y(screen.top)}px`, width: `${screen.width}px`, height: `${screen.height}px`,
      });

      const snap = () => {
        g.dataset.snap = "1";
        fl.classList.add("pop");
        later(() => fl.classList.remove("pop"), 700);
        later(() => delete g.dataset.snap, 900);
      };

      const st = {
        mode: "ground" as "ground" | "hang" | "free" | "bucket",
        x: startX, y: top, // ground: between the feet. free: the centre of mass
        px: 0, py: 0, lift: 0, stretch: 1, onRope: false, // hang: from the point (px, py)
        face: 1, faceCur: 1,
        lean: 0, theta: 0, sq: 1, sink: BK.sink,
        phase: 0, gait: 0, speed: 0, moving: false, flail: 0, push: 0,
        arms: "down", armA: 0, armB: 0, eat: 0, chomp: 0,
        kick: 0, look: 0, lookY: 0, alpha: 0, time: 0,
      };

      // ── the rope ──
      const rope = {
        on: false, pinned: false, sliding: false, landed: false,
        pts: [] as Pn[], total: 0, s: 0, rate: 0, lastKick: -1e9, alpha: 1, fadeAt: Infinity,
      };
      const rest = (i: number) => (i < UP ? rope.s / UP : (rope.total - rope.s) / (N - 1 - UP));
      const grip = () => ({ x: st.x, y: st.y - (FEET - GRIP) });

      const throwRope = () => {
        const h = grip();
        rope.total = floor - top + 30;
        rope.s = Math.hypot(h.x - anchor.x, h.y - anchor.y) + 4;
        rope.pts = Array.from({ length: N }, (_, i) => {
          if (i <= UP) {
            const t = i / UP, x = anchor.x + (h.x - anchor.x) * t, y = anchor.y + (h.y - anchor.y) * t;
            return { x, y, px: x, py: y, w: i === 0 || i === UP ? 0 : 1 };
          }
          // the coil leaves the hands fanned out: the far end flies furthest
          const j = (i - UP) / (N - 1 - UP), vx = 0.03 + 0.12 * j, vy = 0.02 - 0.12 * j;
          const x = h.x + j, y = h.y + j;
          return { x, y, px: x - vx * STEP, py: y - vy * STEP, w: 1 };
        });
        rope.on = rope.pinned = true;
      };

      const ropeStep = (h: number) => {
        const P = rope.pts, G = P[UP];
        if (rope.pinned) {
          const p = grip();
          G.x = G.px = p.x;
          G.y = G.py = p.y;
        }
        if (rope.sliding) {
          rope.rate = approach(rope.rate, 0.5, h * 0.0008);
          rope.s = Math.min(rope.s + rope.rate * h, rope.total - 12);
        }
        for (const p of P) {
          if (!p.w) continue;
          const vx = (p.x - p.px) * 0.99, vy = (p.y - p.py) * 0.99;
          p.px = p.x; p.py = p.y;
          p.x += vx; p.y += vy + GRAV * h * h;
        }
        for (let k = 0; k < ITER; k++) {
          for (let i = 0; i < N - 1; i++) {
            const a = P[i], b = P[i + 1], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy), r = rest(i);
            if (d <= r || a.w + b.w === 0) continue; // slack: a rope only pulls
            const c = (d - r) / (d * (a.w + b.w));
            a.x += dx * c * a.w; a.y += dy * c * a.w;
            b.x -= dx * c * b.w; b.y -= dy * c * b.w;
          }
        }
        for (const p of P) {
          if (!p.w) continue;
          if (p.y > floor) { p.y = p.py = floor; p.px = p.x - (p.x - p.px) * 0.6; } // lies on the rule, with friction
          if (p.y > top + 3 && p.x < wall + 1) p.x = wall + 1;
        }
        if (!st.onRope) return;
        // the gopher against the portrait: stop, then kick off it again
        if (G.y > top + 8 && G.x <= bound) {
          G.x = Math.max(G.x, bound);
          G.px = G.x;
          if (rope.sliding && st.time - rope.lastKick > 420) {
            G.px = G.x - 0.24 * h;
            rope.lastKick = st.time;
            st.kick = 1;
          }
        }
        if (G.y + Math.cos(st.theta) * (FEET - GRIP) >= floor) {
          rope.landed = true;
          rope.sliding = false;
        }
      };

      // ── the board, the bucket and the popcorn (placed once the reader scrolls on) ──
      const board = { on: false, free: false, x: 0, y: 0, vx: 0, vy: 0, rot: 0, flip: 0, spin: 0, alpha: 1 };
      const bucket = {
        on: false, live: false, free: false, tipping: false, spilled: false, alpha: 0,
        baseX: 0, rule: 0, th: 0, w: 0, t: 0, lean: 0, peek: 0,
        cx: 0, cy: 0, vx: 0, vy: 0, cl: [0, 0],
      };
      let ledge = { x: 0, y: 0, edge: 0 };
      const kernels: Kernel[] = kernelEls.map(() => ({ on: false, x: 0, y: 0, vx: 0, vy: 0, rot: 0, vr: 0, age: 0, still: false }));

      const bucketMat = (): Mat => {
        if (bucket.free) return chain(T(bucket.cx, bucket.cy), R(bucket.th), T(-bucket.cl[0], -bucket.cl[1]));
        const pl = bucket.th >= 0 ? BK.support : -BK.half;
        return chain(T(bucket.baseX + pl, bucket.rule), R(bucket.th), T(-pl, 0));
      };
      // the gopher's centre of mass in the bucket's frame, leaning L about his feet
      const gopherCom = (L: number) => [Math.sin(L) * GH, -(BK.sink + Math.cos(L) * GH)];
      // velocity of a point (x, y) on the rigid bucket
      const bucketVel = (x: number, y: number) => {
        if (bucket.free) return [bucket.vx - bucket.w * (y - bucket.cy), bucket.vy + bucket.w * (x - bucket.cx)];
        const px = bucket.baseX + (bucket.th >= 0 ? BK.support : -BK.half);
        return [-bucket.w * (y - bucket.rule), bucket.w * (x - px)];
      };

      const spawn = (x: number, y: number, vx: number, vy: number) => {
        const k = kernels.find((k) => !k.on);
        if (!k) return;
        Object.assign(k, { on: true, x, y, vx, vy, rot: Math.random() * 360, vr: (Math.random() - 0.5) * 0.9, age: 0, still: false });
      };

      // 1 ms steps: rocking on a corner (or the rule's end) under gravity,
      // a lossy slap each time the base comes back down, free fall once over
      const bucketStep = () => {
        const b = bucket;
        b.t += 1;
        if (b.free) {
          b.vy += GRAV;
          b.cx += b.vx; b.cy += b.vy; b.th += b.w;
          return;
        }
        // the munching sways him, and he leans into the rock without meaning to
        b.lean = (0.07 * Math.sin(b.t / 170) + 0.2 * Math.tanh(b.w * 3000)) * Math.min(1, b.t / 400) + b.peek;
        const G = gopherCom(b.lean);
        const pl = b.th >= 0 ? BK.support : -BK.half;
        let tau = 0, I = 0;
        for (const [cx, cy, m, r2] of [[0, -BK.com, BK.mass, BK.r2], [G[0], G[1], BK.gm, BK.gr2]]) {
          const dx = cx - pl, dy = cy;
          tau += m * GRAV * (dx * Math.cos(b.th) - dy * Math.sin(b.th));
          I += m * (r2 + dx * dx + dy * dy);
        }
        b.w += tau / I;
        const prev = b.th;
        b.th += b.w;
        if ((prev > 0 && b.th <= 0) || (prev < 0 && b.th >= 0)) {
          b.w *= BK.e;
          if (Math.abs(b.w) < 2e-6) b.w = 0;
          b.th = b.w;
        }
        if (pl === BK.support && b.th > 0 && tau > 0) b.tipping = true; // its weight is past the edge: no coming back
        if (b.th > 0.55 && !b.spilled) {
          b.spilled = true;
          const m = bucketMat();
          for (let i = 0; i < 9; i++) {
            const [x, y] = apply(m, -22 + 5.5 * i, -58);
            const [vx, vy] = bucketVel(x, y);
            spawn(x, y, vx + 0.05 + Math.random() * 0.12, vy - 0.05 - Math.random() * 0.15);
          }
        }
        if (b.th > 1.0) {
          // off the end of the rule: from here it's a falling rigid body
          const M = BK.mass + BK.gm;
          b.cl = [(G[0] * BK.gm) / M, (-BK.com * BK.mass + G[1] * BK.gm) / M];
          const [cx, cy] = apply(bucketMat(), b.cl[0], b.cl[1]);
          [b.vx, b.vy] = bucketVel(cx, cy);
          b.cx = cx; b.cy = cy;
          b.free = true;
        }
      };

      const kernelStep = (h: number) => {
        for (const k of kernels) {
          if (!k.on) continue;
          k.age += h;
          if (k.still) continue;
          const wasAbove = k.y <= ledge.y + 1;
          k.vy += GRAV * h;
          k.x += k.vx * h; k.y += k.vy * h; k.rot += k.vr * h;
          if (wasAbove && k.y >= ledge.y && k.x > ledge.x && k.x < ledge.edge) {
            k.y = ledge.y;
            k.vy *= -0.35; k.vx *= 0.6; k.vr *= 0.5;
            if (Math.abs(k.vy) < 0.04) k.still = true;
          }
          if (k.y > ledge.y + 700) k.on = false;
        }
      };

      const boardStep = (h: number) => {
        if (!board.free) return;
        const wasAbove = board.y <= ledge.y;
        board.vy += GRAV * h;
        board.x += board.vx * h; board.y += board.vy * h; board.flip += board.spin * h;
        if (wasAbove && board.y >= ledge.y) {
          board.y = ledge.y;
          board.vy *= -0.25;
          board.flip = Math.round(board.flip / Math.PI) * Math.PI; // lands flat, whichever side up
          board.spin = 0;
          if (Math.abs(board.vy) < 0.04) board.free = false;
        }
      };

      // ── script helpers ──
      function* walkTo(tx: number, vmax: number, stride: number): Co {
        const ACC = 0.0011;
        st.face = Math.sign(tx - st.x) || st.face;
        let v = 0;
        for (;;) {
          const dt = yield;
          const d = tx - st.x;
          if (Math.abs(d) < 0.5) break;
          // brake in time to stop on the mark
          const want = Math.min(vmax, Math.sqrt(2 * ACC * Math.abs(d)));
          v = v < want ? Math.min(want, v + ACC * dt) : want;
          const step = Math.sign(d) * Math.min(Math.abs(d), v * dt);
          st.x += step;
          st.phase += (Math.abs(step) / stride) * Math.PI * 2; // feet stay planted
          st.speed = v;
          st.moving = true;
        }
        st.x = tx;
        st.speed = 0;
      }
      const pause = (ms: number) => tween(ms, () => {});

      function* part1(): Co {
        // pops up, looks about
        yield* tween(480, (p) => { st.alpha = Math.min(1, p * 2.5); st.y = top + 20 * (1 - easeOutBack(p)); });
        yield* tween(700, (p) => { st.look = p < 0.45 ? -3 : 3; });
        st.look = 0;
        yield* walkTo(edgeX, 0.13, 22);
        // ties off, winds up, throws the rope down
        st.arms = "up";
        yield* tween(220, (p) => { st.sq = 1 - 0.1 * Math.sin(Math.PI * p); st.lean = -6 * p; });
        throwRope();
        yield* tween(180, (p) => { st.lean = -6 + 14 * easeOut(p); });
        st.look = 3;
        yield* tween(650, (p) => { st.lean = 8 * (1 - p); });
        // crouch, then hop off the edge onto the rope
        yield* tween(170, (p) => { st.sq = 1 - 0.16 * easeOut(p); });
        st.sq = 1;
        st.lean = 0;
        st.mode = "hang";
        st.onRope = true;
        st.face = -1;
        st.look = 0;
        const G = rope.pts[UP];
        rope.pinned = false;
        G.w = HEAVY;
        G.px = G.x - 0.08 * STEP;
        G.py = G.y + 0.26 * STEP;
        rope.sliding = true;
        while (!rope.landed) yield;

        // lands: let go of the rope, which springs away and swings
        const th = st.theta;
        st.mode = "ground";
        st.onRope = false;
        st.x = G.x - Math.sin(th) * (FEET - GRIP);
        st.y = floor;
        st.arms = "down";
        G.w = 1;
        for (let i = 1; i <= UP; i++) rope.pts[i].px = rope.pts[i].x - Math.sin((Math.PI * i) / UP) * 0.22 * STEP;
        rope.fadeAt = st.time + 900;
        yield* tween(340, (p) => { st.theta = th * (1 - easeOut(p)); st.sq = 1 - 0.24 * Math.sin(Math.PI * p) * (1 - p * 0.5); });
        st.theta = 0;
        st.sq = 1;
        yield* pause(150);

        // runs to the gap, turns, photographs the portrait
        yield* walkTo(stopX, 0.42, 34);
        yield* tween(140, (p) => { st.lean = -7 * Math.sin(Math.PI * p); }); // skid
        st.face = 1;
        yield* pause(220);
        st.arms = "camera";
        yield* tween(260, (p) => { st.lean = -4 * easeOut(p); st.sq = 1 + 0.03 * easeOut(p); });
        snap();
        yield* tween(180, (p) => { st.lean = -4 - 7 * Math.sin(Math.PI * p); }); // recoil
        yield* pause(800);
        st.arms = "down";
        st.sq = 1;
        yield* tween(160, (p) => { st.lean = -4 * (1 - p); });
        st.face = -1;
        yield* pause(220);

        // runs for the left end of the rule, and only just stops
        yield* walkTo(deskL + 4, 0.42, 34);
        yield* tween(1100, (p) => {
          const d = 1 - p;
          st.lean = 15 * Math.sin(p * 21) * d;
          st.armA = 1100 * p * d; // windmilling
          st.armB = -1100 * p * d;
        });
        st.lean = st.armA = st.armB = 0;
        st.lookY = 3; // and peers down
      }

      const ledgeInView = () => {
        const r = edition.querySelector("#work .sec-head")?.getBoundingClientRect();
        return !!r && r.top < innerHeight * 0.72;
      };

      function* part2(): Co {
        const lr = q("#work .sec-head");
        if (!lr) return;
        const o2 = layerRect(); // the reader has scrolled since run() measured
        ledge = { x: lr.left - o2.left, y: lr.top - o2.top, edge: lr.right - o2.left };
        const P = { x: ledge.x, y: ledge.y };
        bucket.on = true;
        bucket.baseX = ledge.edge - BK.support;
        bucket.rule = ledge.y;

        // leans out to look, and topples over his toes: φ'' = m g d sin φ / I
        let phi = 0.06, om = 0;
        const kTip = (GRAV * GH) / (BK.gr2 + GH * GH);
        while (phi < 0.18) { // the toes slip off at this lean
          const dt = yield;
          for (let i = 0; i < dt; i++) { om += kTip * Math.sin(phi); phi += om; }
          st.theta = -phi; // facing left, so forward is anticlockwise
          st.armA = 160 * phi; st.armB = -160 * phi;
        }

        // falls: a rigid body leaving the edge with the spin it toppled with
        const feetX = st.x, feetY = st.y;
        const rx = -GH * Math.sin(phi), ry = -GH * Math.cos(phi);
        let w = -om;
        let vx = -w * ry, vy = w * rx;
        st.mode = "free";
        st.x = feetX + rx; st.y = feetY + ry;
        st.armA = st.armB = 0;
        st.flail = 1;
        st.lookY = 2;
        let air = 0, caught = false;
        while (!caught) {
          const dt = yield;
          air += dt;
          // checked every step: by now he covers more than the catch window in one frame
          for (let i = 0; i < dt && !caught; i += 2) {
            vy += GRAV * 2;
            st.x += vx * 2; st.y += vy * 2; st.theta += w * 2;
            if (air > 180) w *= 0.97; // windmilling arms cancel the spin, as a cat's do
            const dx = st.x - P.x, dy = st.y - P.y;
            caught = dy > 18 && Math.hypot(dx, dy) < REACH;
          }
          if (air > 220) st.theta += (0.45 - st.theta) * Math.min(1, dt / 240); // and turn it to reach for the ledge
          if (st.y - P.y > 400) return; // missed: should never happen
        }

        // catches the end of the rule: the arms take the jolt, the grip kills most of the swing
        let cx = st.x, cy = st.y;
        {
          const dx = cx - P.x, dy = cy - P.y, d = Math.hypot(dx, dy), nx = dx / d, ny = dy / d;
          const vr = vx * nx + vy * ny, vt = -vx * ny + vy * nx;
          vx = nx * vr - ny * vt * 0.12;
          vy = ny * vr + nx * vt * 0.12;
        }
        const thCatch = st.theta;
        st.face = 1; // turns to the ledge as he grabs it
        st.mode = "hang";
        st.px = P.x; st.py = P.y;
        st.arms = "up";
        st.flail = 0;
        let hung = 0;
        for (;;) {
          const dt = yield;
          hung += dt;
          for (let i = 0; i < dt; i += 2) {
            const dx = cx - P.x, dy = cy - P.y, d = Math.hypot(dx, dy), nx = dx / d, ny = dy / d;
            const f = -(0.016 * (d - ARM) + 0.12 * (vx * nx + vy * ny)); // arms: a stiff, damped spring
            vx = (vx + f * nx * 2) * 0.9986;
            vy = (vy + (f * ny + GRAV) * 2) * 0.9986;
            cx += vx * 2; cy += vy * 2;
          }
          const dx = cx - P.x, dy = cy - P.y, d = Math.hypot(dx, dy);
          const rod = Math.atan2(-dx, dy);
          st.theta = rod + (thCatch - rod) * Math.max(0, 1 - hung / 140);
          st.stretch = clamp(d / ARM, 0.9, 1.2);
          st.lookY = -2;
          if (hung > 1500 && Math.abs(rod) < 0.12) break;
          if (hung > 4000) break;
        }

        // pulls himself up and steps onto the rule
        st.face = 1;
        st.lookY = 0;
        const thUp = st.theta;
        yield* tween(520, (p) => {
          const e = easeInOut(p);
          st.theta = thUp * (1 - e);
          st.lift = (FEET - GRIP) * e;
          st.stretch = 1 + (st.stretch - 1) * (1 - p);
          st.sq = 1 - 0.08 * Math.sin(Math.PI * p);
        });
        st.mode = "ground";
        st.x = P.x; st.y = P.y;
        st.theta = st.lift = 0;
        st.stretch = st.sq = 1;
        st.arms = "down";
        const x0 = st.x;
        yield* tween(260, (p) => { st.x = x0 + 24 * p; st.y = P.y - 9 * Math.sin(Math.PI * p); });
        yield* tween(220, (p) => { st.sq = 1 - 0.12 * Math.sin(Math.PI * p); });
        yield* pause(250);

        // pulls a skateboard out from behind his back, and drops it
        board.on = true;
        yield* tween(420, (p) => {
          const e = easeInOut(p);
          board.x = st.x - 16 + 48 * e;
          board.y = st.y - 34 + 8 * e;
          board.rot = (Math.PI / 2) * (1 - e);
          st.armA = 140 * Math.sin(Math.PI * p);
        });
        st.armA = 0;
        board.vy = 0;
        for (;;) {
          const dt = yield;
          for (let i = 0; i < dt; i++) {
            board.vy += GRAV;
            board.y += board.vy;
            if (board.y >= P.y) { board.y = P.y; board.vy *= -0.32; }
          }
          if (board.y >= P.y - 0.5 && Math.abs(board.vy) < 0.04) break;
        }
        board.y = P.y;
        yield* pause(200);
        const x1 = st.x;
        yield* tween(300, (p) => { st.x = x1 + (board.x - x1) * p; st.y = P.y - DECK * p - 18 * Math.sin(Math.PI * p); });
        yield* tween(160, (p) => { st.sq = 1 - 0.1 * Math.sin(Math.PI * p); });

        // pushes off three times, glides, then drags a foot to come down to the speed he pops at
        let v = 0;
        const ride = (dt: number) => {
          st.x += v * dt;
          board.x = st.x;
          st.y = P.y - DECK;
          st.armA = 25 + 8 * Math.sin(st.time / 260);
          st.armB = -25 + 8 * Math.sin(st.time / 300);
          st.lean = 3 + 2 * Math.sin(st.time / 400);
        };
        for (let i = 0; i < 3; i++) {
          for (let t = 0; t < 440;) {
            const dt = yield;
            t += dt;
            const p = Math.min(1, t / 440);
            st.push = Math.sin(Math.PI * p);
            if (p > 0.3 && p < 0.7) v += (0.11 * dt) / 176;
            ride(dt);
          }
        }
        st.push = 0;
        const mouthX = bucket.baseX; // aim for the middle of the bucket
        const takeoffX = mouthX - V_AIR * T_AIR;
        const vPop = V_AIR / (1 + BOARD_MASS);
        const ROLL = 0.00002, BRAKE = 0.0012; // px/ms²: bearings, and a dragged foot
        while (st.x < takeoffX) {
          const dt = yield;
          // brake as late as v² − vPop² = 2·BRAKE·distance allows
          const braking = v * v - vPop * vPop >= 2 * BRAKE * (takeoffX - st.x);
          v = Math.max(vPop, v - (braking ? BRAKE : ROLL) * dt);
          st.push = braking && v > vPop + 0.005 ? 0.75 : 0;
          ride(dt);
          st.sq = 1 - 0.14 * clamp(1 - (takeoffX - st.x) / 20, 0, 1); // crouch for the pop
        }

        // pops and kicks the board into a flip, which takes its speed: m·v = m·V_AIR + m_b·0
        board.free = true;
        board.vx = 0;
        board.vy = -0.38;
        board.spin = (3 * Math.PI) / ((2 * 0.38) / GRAV); // one and a half turns: it lands upside down
        st.mode = "free";
        st.sq = 1;
        st.lean = 0;
        st.armA = st.armB = 0;
        st.arms = "up";
        const x2 = st.x, y2 = P.y - DECK - GH;
        const tx = mouthX, ty = P.y - BK.h + 10 - GH; // feet ten px inside the rim
        const Ta = (tx - x2) / V_AIR;
        const vy2 = (ty - y2 - (GRAV * Ta * Ta) / 2) / Ta;
        const turn = 2 * Math.PI - 0.5; // goes for a front flip, comes up short
        st.flail = 0.5;
        for (let t = 0; t < Ta;) {
          t = Math.min(Ta, t + (yield));
          st.x = x2 + V_AIR * t;
          st.y = y2 + vy2 * t + (GRAV * t * t) / 2;
          st.theta = (turn * t) / Ta;
        }

        // into the popcorn. The bucket is struck about the end of the rule:
        // angular momentum m·(r × v) about that point sets it rocking
        st.mode = "bucket";
        st.flail = 0;
        st.face = 1;
        st.theta -= 2 * Math.PI;
        st.sink = BK.h - 10;
        {
          const vEnd = vy2 + GRAV * Ta, rX = -BK.support, rY = -(BK.h - 10 + GH);
          const I = BK.mass * (BK.r2 + BK.support ** 2 + BK.com ** 2) + BK.gm * (BK.gr2 + BK.support ** 2 + (BK.sink + GH) ** 2);
          bucket.w = (BK.gm * (rX * vEnd - rY * V_AIR)) / I;
          bucket.live = true;
          const m = bucketMat();
          for (let i = 0; i < 6; i++) {
            const [x, y] = apply(m, -18 + 7 * i, -58);
            spawn(x, y, (i - 2.5) * 0.06 + V_AIR * 0.3, -0.3 - Math.random() * 0.25);
          }
        }
        const th0 = st.theta;
        yield* tween(260, (p) => { st.sink = BK.h - 10 - (BK.h - 10 - BK.sink) * easeOut(p); st.theta = th0 * (1 - easeOut(p)); });
        st.arms = "down";
        st.lookY = -1;
        yield* pause(300);

        // eats a few, head out, while the bucket rocks under him
        const tipping = () => bucket.tipping;
        for (let i = 0; i < 4 && !bucket.tipping; i++) {
          st.arms = "eat";
          st.lookY = 1;
          yield* tween(300, (p) => { st.eat = easeOut(p); }, tipping);
          yield* tween(360, (p) => { st.chomp = Math.abs(Math.sin(p * Math.PI * 3)); }, tipping);
          st.chomp = 0;
          yield* tween(240, (p) => { st.eat = 1 - p; }, tipping);
          st.eat = 0;
          st.arms = "down";
          st.lookY = 0;
          yield* pause(180);
        }
        // still upright: leans out to see over the edge, which is enough on its own
        if (!bucket.tipping) {
          st.look = 3;
          yield* tween(700, (p) => { bucket.peek = 1.25 * easeInOut(p); }, tipping);
        }
        while (!bucket.tipping) yield;

        // over it goes
        st.arms = "up";
        st.lookY = -3;
        st.eat = 0;
        while (!bucket.free) yield;
        yield* pause(700);
        yield* tween(400, (p) => { bucket.alpha = st.alpha = board.alpha = 1 - p; });
        yield* pause(800); // the spilled popcorn fades out on the rule
      }

      function* script(): Co {
        yield* part1();
        while (!ledgeInView()) yield;
        yield* part2();
      }

      const render = (dt: number) => {
        st.faceCur = approach(st.faceCur, st.face, dt / 90); // a turn passes through edge-on
        st.gait = approach(st.gait, st.moving ? (st.speed > 0.3 ? 1.3 : 1) : 0, dt / 120);
        st.kick = Math.max(0, st.kick - dt / 300);
        const a = st.gait, ph = st.phase, t = st.time;

        let fa = { x: Math.sin(ph) * 7 * a, y: -Math.max(0, Math.cos(ph)) * 8 * a };
        let fb = { x: -Math.sin(ph) * 7 * a, y: -Math.max(0, -Math.cos(ph)) * 8 * a };
        let bob = -Math.abs(Math.cos(ph)) * 3.5 * a;
        let swing = Math.sin(ph) * 38 * a;
        let breath = (1 - Math.min(1, a)) * Math.sin(t / 380) * 0.012;

        if (st.mode === "hang" && st.onRope) {
          const P = rope.pts, G = P[UP], U = P[UP - 1];
          const ux = G.x - U.x, uy = G.y - U.y;
          // swing with the rope, but against the portrait the feet brace on it and the body leans out
          const swingA = Math.hypot(ux, uy) > 2 ? Math.atan2(-ux, uy) : 0;
          const brace = G.y > top + 8 ? clamp(1 - (G.x - bound) / 14, 0, 1) : 0;
          const want = swingA * (1 - brace) * 0.6 + 0.4 * brace;
          st.theta += (clamp(want, -0.9, 0.9) - st.theta) * Math.min(1, dt / 70);
          st.px = G.x; st.py = G.y;
          fa = { x: 2 + 10 * st.kick + Math.sin(t / 170) * 1.5, y: -4 * st.kick };
          fb = { x: 1 + 8 * st.kick - Math.sin(t / 170) * 1.5, y: -3 * st.kick };
          bob = swing = breath = 0;
        } else if (st.mode === "hang") {
          fa = { x: Math.sin(t / 160) * 3, y: 0 };
          fb = { x: -Math.sin(t / 160) * 3, y: 0 };
          bob = breath = 0;
        }
        if (st.flail) {
          swing = Math.sin(t / 55) * 75 * st.flail;
          fa = { x: Math.sin(t / 70) * 7 * st.flail, y: -5 + Math.cos(t / 70) * 4 };
          fb = { x: -Math.sin(t / 70) * 7 * st.flail, y: -5 - Math.cos(t / 70) * 4 };
          bob = breath = 0;
        }
        if (st.push) { fa = { x: fa.x - 16 * st.push, y: fa.y + (DECK / K) * st.push }; }

        const sq = st.sq + breath, sx = st.faceCur * (1 + (1 - sq) * 0.7);
        let m: Mat;
        if (st.mode === "ground") {
          const rot = st.theta + ((st.lean + st.speed * 22) * Math.sign(st.faceCur || 1) * Math.PI) / 180;
          m = chain(T(st.x, st.y), R(rot), S(sx, sq), T(-W / 2, -FEET));
        } else if (st.mode === "hang") {
          m = chain(T(st.px, st.py), R(st.theta), T(0, -st.lift), S(sx, sq * st.stretch), T(-W / 2, -GRIP));
        } else if (st.mode === "free") {
          m = chain(T(st.x, st.y), R(st.theta), S(sx, sq), T(-W / 2, -COMY));
        } else {
          m = chain(bucketMat(), T(0, -st.sink), R(st.theta + bucket.lean), S(sx, sq), T(-W / 2, -FEET));
        }
        g.style.transform = css(m);
        g.style.opacity = String(st.alpha);
        g.dataset.arms = st.arms;

        footA.setAttribute("transform", `translate(${fa.x} ${fa.y})`);
        footB.setAttribute("transform", `translate(${fb.x} ${fb.y})`);
        body.setAttribute("transform", `translate(0 ${bob + 3 * st.chomp})`); // chewing nods the head
        armA.setAttribute("transform", `rotate(${swing + st.armA} 14 68)`);
        armB.setAttribute("transform", `rotate(${-swing + st.armB} 86 68)`);
        armEat.setAttribute("transform", `translate(0 ${38 * (1 - st.eat)})`);
        teeth.setAttribute("transform", `translate(0 ${-3.5 * st.chomp})`);
        const blink = t % 3100 < 120 ? 0.12 : 1;
        eyes.setAttribute("transform", `translate(0 30) scale(1 ${blink}) translate(0 -30)`);
        pupils.setAttribute("transform", `translate(${st.moving ? 2.5 : st.look} ${st.mode === "hang" && st.onRope ? 2 : st.lookY})`);

        if (rope.on) {
          const P = rope.pts;
          let d = `M${P[0].x} ${P[0].y}`;
          for (let i = 1; i < N - 1; i++) d += `Q${P[i].x} ${P[i].y} ${(P[i].x + P[i + 1].x) / 2} ${(P[i].y + P[i + 1].y) / 2}`;
          d += `L${P[N - 1].x} ${P[N - 1].y}`;
          ropePaths.forEach((p) => p.setAttribute("d", d));
          rs.style.opacity = String(rope.alpha);
        } else {
          rs.style.opacity = "0";
        }

        if (board.on) {
          bd.style.transform = css(chain(T(board.x, board.y - BH / 2), R(board.rot), S(1, Math.cos(board.flip)), T(-BW / 2, -BH / 2)));
          bd.style.opacity = String(board.alpha);
        }
        if (bucket.on) {
          bucket.alpha = bucket.free ? bucket.alpha : approach(bucket.alpha, 1, dt / 400);
          const bm = css(chain(bucketMat(), T(-30, -74)));
          for (const el of [bb, bf]) {
            el.style.transform = bm;
            el.style.opacity = String(bucket.alpha);
          }
        }
        kernels.forEach((k, i) => {
          const el = kernelEls[i];
          if (!k.on) { el.style.opacity = "0"; return; }
          el.style.transform = `translate(${k.x - 4}px,${k.y - 7}px) rotate(${k.rot}deg)`;
          el.style.opacity = String(clamp(1 - (k.age - 2400) / 500, 0, 1));
        });
      };

      peg.setAttribute("cx", String(anchor.x));
      peg.setAttribute("cy", String(anchor.y));
      const it = script();
      it.next();
      let last = performance.now(), acc = 0;
      const tick = (now: number) => {
        const dt = Math.min(now - last, 34); // a backgrounded tab resumes where it left off
        last = now;
        st.time += dt;
        st.moving = false;
        const done = it.next(dt).done;
        for (acc += dt; acc >= STEP; acc -= STEP) {
          if (rope.on) ropeStep(STEP);
          if (bucket.live) for (let i = 0; i < STEP; i++) bucketStep();
          boardStep(STEP);
          kernelStep(STEP);
        }
        if (rope.on && st.time > rope.fadeAt) {
          rope.alpha = Math.max(0, 1 - (st.time - rope.fadeAt) / 700);
          if (!rope.alpha) rope.on = false;
        }
        render(dt);
        if (done) return stop();
        raf = requestAnimationFrame(tick);
      };
      started = true;
      raf = requestAnimationFrame(tick);
    };

    // wait for the webfonts (they move the nameplate) and the headline's rise
    document.fonts.ready.then(() => later(run, 900));

    const onResize = () => started && stop();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      timers.forEach(clearTimeout);
      stop();
    };
  }, []);

  const stripes = Array.from({ length: 6 }, (_, i) => {
    const t0 = -26 + (52 * i) / 6, t1 = -26 + (52 * (i + 1)) / 6, b0 = -20 + (40 * i) / 6, b1 = -20 + (40 * (i + 1)) / 6;
    return <path key={i} className={i % 2 ? "b-red" : "b-white"} d={`M${t0} -50L${t1} -50L${b1} 0L${b0} 0Z`} />;
  });

  return (
    <div className="gopher-layer" ref={layer} aria-hidden="true">
      <svg className="gopher-rope" ref={ropeSvg}>
        <path className="r-base" />
        <path className="r-twist" />
        <circle r="3" />
      </svg>
      <div className="gopher-flash" ref={flash} />
      <div className="g-board" ref={boardEl}>
        <svg viewBox="0 0 46 11">
          <rect className="sk-truck" x="8" y="4" width="8" height="2" />
          <rect className="sk-truck" x="30" y="4" width="8" height="2" />
          <circle className="sk-wheel" cx="12" cy="8" r="2.8" />
          <circle className="sk-wheel" cx="34" cy="8" r="2.8" />
          <path className="sk-deck" d="M1 0.6Q3 3.2 7 3.2H39Q43 3.2 45 0.6Q44 4.8 40 4.8H6Q2 4.8 1 0.6Z" />
        </svg>
      </div>
      <div className="g-bucket" ref={bucketBack}>
        <svg viewBox="-30 -74 60 76">
          <ellipse className="b-inside" cx="0" cy="-51" rx="25" ry="4" />
          <g className="b-pop">
            <circle cx="-17" cy="-56" r="6" />
            <circle cx="-6" cy="-61" r="7" />
            <circle cx="7" cy="-62" r="7" />
            <circle cx="17" cy="-57" r="6" />
            <circle cx="1" cy="-67" r="5.5" />
            <circle cx="-11" cy="-53" r="5" />
            <circle cx="12" cy="-53" r="5" />
          </g>
        </svg>
      </div>
      <div className="gopher" ref={gopher} data-arms="down">
        <span className="g-click">click</span>
        <svg viewBox="0 -12 100 142" className="g-art">
          <g className="g-foot-a"><ellipse className="g-skin" cx="33" cy="123" rx="10" ry="5.5" transform="rotate(-18 33 123)" /></g>
          <g className="g-foot-b"><ellipse className="g-skin" cx="67" cy="123" rx="10" ry="5.5" transform="rotate(18 67 123)" /></g>
          <g className="g-body">
            <circle className="g-fur" cx="19" cy="15" r="9" />
            <circle className="g-ear" cx="19" cy="15" r="3.6" />
            <circle className="g-fur" cx="81" cy="13" r="9" />
            <circle className="g-ear" cx="81" cy="13" r="3.6" />
            <path className="g-fur" d="M50 2C77 2 89 19 89 47V92C89 116 75 128 50 128S11 116 11 92V47C11 19 23 2 50 2Z" />
            <g className="g-arm-a"><ellipse className="g-skin" cx="8" cy="70" rx="8.5" ry="4.5" transform="rotate(20 8 70)" /></g>
            <g className="g-arm-b"><ellipse className="g-skin" cx="92" cy="70" rx="8.5" ry="4.5" transform="rotate(-20 92 70)" /></g>
            <g className="g-arms-up">
              <ellipse className="g-skin" cx="42" cy="-1" rx="5" ry="11" transform="rotate(24 42 -1)" />
              <ellipse className="g-skin" cx="58" cy="-1" rx="5" ry="11" transform="rotate(-24 58 -1)" />
            </g>
            <g className="g-eyes">
              <ellipse className="g-eye" cx="36" cy="30" rx="16" ry="15" />
              <ellipse className="g-eye" cx="66" cy="28" rx="15" ry="14" />
              <g className="g-pupils">
                <circle cx="44" cy="32" r="6" />
                <circle cx="60" cy="31" r="5.6" />
                <circle className="g-glint" cx="46" cy="30" r="1.7" />
                <circle className="g-glint" cx="62" cy="29" r="1.6" />
              </g>
            </g>
            <ellipse className="g-skin" cx="51" cy="51" rx="12" ry="7.5" />
            <path className="g-teeth" d="M45.5 56h11v8.5a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2z M51 56v10.5" />
            <ellipse className="g-nose" cx="51" cy="46" rx="6.5" ry="4.2" />
            <g className="g-arm-eat">
              <ellipse className="g-skin" cx="63" cy="66" rx="5" ry="11" transform="rotate(-38 63 66)" />
              <circle className="g-kernel" cx="56" cy="57" r="5.5" />
            </g>
            <g className="g-camera">
              <rect x="52" y="16" width="30" height="21" rx="3" />
              <rect x="56" y="11" width="9" height="5" rx="1" />
              <rect x="82" y="20" width="9" height="13" rx="1.5" />
              <ellipse className="g-skin" cx="55" cy="40" rx="5" ry="6" />
              <ellipse className="g-skin" cx="80" cy="39" rx="5" ry="6" />
            </g>
            <path className="g-burst" d="M99 10l3 9 9-3-6 7 8 6-10 0 0 9-6-7-6 6 2-9-9-2 9-4-3-8 7 5z" />
          </g>
        </svg>
      </div>
      <div className="g-bucket" ref={bucketFront}>
        <svg viewBox="-30 -74 60 76">
          {stripes}
          <path className="b-line" d="M-26 -50L26 -50L20 0L-20 0Z" />
          <rect className="b-rim" x="-27.5" y="-54" width="55" height="5" rx="1.5" />
        </svg>
      </div>
      <div ref={kernelBox}>
        {Array.from({ length: 24 }, (_, i) => <span key={i} className="g-pop" />)}
      </div>
    </div>
  );
}
