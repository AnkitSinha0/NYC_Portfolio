"use client";

import { useEffect } from "react";

/**
 * The Coding Exchange's motion, attached to server-rendered markup:
 * panels rise in, stats count up, difficulty bars fill and the
 * Codeforces chart draws itself the first time each panel is seen.
 * Also drives the heatmap tooltip.
 */
export function ExchangeMotion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.querySelector<HTMLElement>(".cx");
    if (!root) return;

    const frames = new Set<number>();
    function countUp(el: HTMLElement) {
      const target = parseFloat(el.dataset.count ?? "0");
      const dec = parseInt(el.dataset.dec ?? "0", 10);
      const fmt = (n: number) => n.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      if (reduce) {
        el.textContent = fmt(target);
        return;
      }
      const dur = 1400;
      let t0: number | null = null;
      const frame = (ts: number) => {
        if (t0 === null) t0 = ts;
        const p = Math.min((ts - t0) / dur, 1);
        el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) frames.add(requestAnimationFrame(frame));
      };
      frames.add(requestAnimationFrame(frame));
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          e.target.classList.add("in");
          e.target.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
          e.target.querySelectorAll<HTMLElement>(".fill").forEach((f) => {
            f.style.width = `${f.dataset.w}%`;
          });
          if (e.target.querySelector("#spark")) {
            for (const id of ["spark", "area", "peak"]) {
              document.getElementById(id)?.classList.add("draw");
            }
          }
        }
      },
      { threshold: 0.25 },
    );
    root.querySelectorAll(".panel").forEach((p) => io.observe(p));

    const heat = root.querySelector<HTMLElement>("#heat");
    const tip = root.querySelector<HTMLElement>("#tip");
    const onOver = (e: MouseEvent) => {
      const cell = e.target as HTMLElement;
      if (cell.tagName !== "I" || !tip) return;
      const n = cell.dataset.n;
      const label = n === "0" ? "no submissions" : `${n} submission${n === "1" ? "" : "s"}`;
      tip.innerHTML = `<b>${cell.dataset.d}</b>${label}`;
      tip.classList.add("on");
    };
    const onMove = (e: MouseEvent) => {
      if (!tip) return;
      tip.style.left = `${Math.min(e.clientX + 14, window.innerWidth - tip.offsetWidth - 10)}px`;
      tip.style.top = `${e.clientY - tip.offsetHeight - 12}px`;
    };
    const onLeave = () => tip?.classList.remove("on");
    heat?.addEventListener("mouseover", onOver);
    heat?.addEventListener("mousemove", onMove);
    heat?.addEventListener("mouseleave", onLeave);

    return () => {
      io.disconnect();
      frames.forEach(cancelAnimationFrame);
      heat?.removeEventListener("mouseover", onOver);
      heat?.removeEventListener("mousemove", onMove);
      heat?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return null;
}
