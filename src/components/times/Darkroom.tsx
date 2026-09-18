"use client";

import Image from "next/image";
import { useRef, useState } from "react";

/**
 * The cursor is the enlarger lamp. Sweep it across the plate and the
 * portrait develops; find the face and it fixes, permanently.
 */
export function Darkroom() {
  const ref = useRef<HTMLDivElement>(null);
  const [found, setFound] = useState(false);

  function move(clientX: number, clientY: number) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((clientX - r.left) / r.width) * 100;
    const y = ((clientY - r.top) / r.height) * 100;
    el.style.setProperty("--mx", `${x.toFixed(1)}%`);
    el.style.setProperty("--my", `${y.toFixed(1)}%`);
    if (!found && Math.abs(x - 46) < 16 && Math.abs(y - 34) < 16) setFound(true);
  }

  return (
    <div
      ref={ref}
      className={`darkroom${found ? " found" : ""}`}
      onMouseMove={(e) => move(e.clientX, e.clientY)}
      onTouchMove={(e) => {
        const t = e.touches[0];
        if (t) move(t.clientX, t.clientY);
      }}
    >
      <div className="face">
        <Image src="/ankit-sinha.png" alt="Portrait of Ankit Sinha" fill sizes="(max-width: 860px) 100vw, 40vw" />
      </div>
      <p className="coord">
        25.5941° N
        <br />
        85.1376° E
      </p>
      <p className="find">
        move your mouse,
        <br />
        find me.
      </p>
    </div>
  );
}
