"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Line = ["p" | "t" | "o", string];

const BOOT: Line[] = [
  ["p", "ankit@sinha:~$ "],
  ["t", "whoami\n"],
  ["o", "ankit\n\n"],
  ["p", "ankit@sinha:~$ "],
  ["t", "ls interests/\n"],
  ["o", "F1   photography   distributed-systems   gaming   mountains   drawing\n\n"],
  ["p", "ankit@sinha:~$ "],
  ["t", "cat quote.txt\n"],
  ["o", '"Build what excites you, and the rest will follow."\n\n'],
  ["p", "ankit@sinha:~$ "],
];

const RESPONSES: Record<string, string> = {
  help: "available: help  projects  skills  interests  clear\n\n",
  projects: "hashvault/   konnect/   leetcode-autopush/\n\n",
  skills:
    "go  java  python  typescript  c++  sql\npostgres  redis  rabbitmq  kafka  docker  s3\n\n",
  interests: "F1   photography   distributed-systems   gaming   mountains   drawing\n\n",
};

const CMDS = ["help", "projects", "skills", "interests", "clear"];

export function Terminal() {
  const hostRef = useRef<HTMLElement>(null);
  const outRef = useRef("");
  const busyRef = useRef(false);
  const timers = useRef<number[]>([]);
  const [html, setHtml] = useState("");
  const [booted, setBooted] = useState(false);

  const paint = useCallback((extra = "") => {
    setHtml(outRef.current + extra + '<span class="c"></span>');
  }, []);

  const run = useCallback(
    (lines: Line[]) => {
      if (busyRef.current) return;
      busyRef.current = true;
      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let i = 0;

      const step = () => {
        if (i >= lines.length) {
          busyRef.current = false;
          paint();
          return;
        }
        const [kind, txt] = lines[i];
        if (kind !== "t" || reduce) {
          outRef.current += `<span class="${kind === "p" ? "p" : "o"}">${txt.replace(/\n/g, "<br>")}</span>`;
          i++;
          paint();
          timers.current.push(window.setTimeout(step, kind === "o" ? 170 : 60));
        } else {
          let c = 0;
          const iv = window.setInterval(() => {
            c++;
            paint(`<span>${txt.slice(0, c).replace(/\n/g, "<br>")}</span>`);
            if (c >= txt.length) {
              window.clearInterval(iv);
              outRef.current += `<span>${txt.replace(/\n/g, "<br>")}</span>`;
              i++;
              timers.current.push(window.setTimeout(step, 90));
            }
          }, 22);
          timers.current.push(iv);
        }
      };
      step();
    },
    [paint],
  );

  // Boot the session when the band scrolls into view.
  useEffect(() => {
    const el = hostRef.current;
    if (!el || booted) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !booted) {
            setBooted(true);
            run(BOOT);
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [booted, run]);

  useEffect(() => {
    const t = timers.current;
    return () => {
      t.forEach((id) => {
        window.clearTimeout(id);
        window.clearInterval(id);
      });
    };
  }, []);

  function send(cmd: string) {
    if (busyRef.current) return;
    if (cmd === "clear") {
      outRef.current = "";
      paint();
      run([["p", "ankit@sinha:~$ "]]);
      return;
    }
    run([["t", `${cmd}\n`], ["o", RESPONSES[cmd]], ["p", "ankit@sinha:~$ "]]);
  }

  return (
    <section className="band night" id="s4" ref={hostRef}>
      <div className="term-grid">
        <div
          className="term"
          role="log"
          aria-label="Interactive terminal"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div>
          <div className="try">
            <h5>Try these:</h5>
            {CMDS.map((c) => (
              <button key={c} type="button" onClick={() => send(c)}>
                → {c}
              </button>
            ))}
          </div>
          <div className="photo term-photo">
            <span className="lbl">City at night</span>
          </div>
          <p className="term-cap">Somewhere in between code and chaos.</p>
        </div>
      </div>
    </section>
  );
}
