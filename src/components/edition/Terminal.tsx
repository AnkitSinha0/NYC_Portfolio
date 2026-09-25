"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { LINKS, PROJECTS, REPORTS, STACK } from "@/lib/content";

export type TerminalStats = {
  solved: number;
  lcRating: number | null;
  cfRating: number;
  cfRank: string;
  streak: number;
};

const PROMPT = "ankit@ankitsin:~$";

const HELP: [string, string][] = [
  ["about", "who I am"],
  ["stack", "what I build with"],
  ["work", "selected projects"],
  ["hashvault", "current build"],
  ["coding", "coding statistics"],
  ["writing", "engineering notes"],
  ["contact", "get in touch"],
  ["resume", "download résumé"],
  ["github", "GitHub"],
  ["clear", "clear terminal"],
];
const COMMANDS = ["help", ...HELP.map(([c]) => c), "konnect", "linkedin", "open", "whoami", "ls", "date", "sudo"];
const TRY = ["hashvault", "coding", "writing", "contact"];

type Line = { id: number; node: ReactNode };

/** "████████░░░░" at `width` cells. */
const bar = (ratio: number, width = 20) => {
  const on = Math.round(ratio * width);
  return (
    <>
      <span className="t-on">{"█".repeat(on)}</span>
      <span className="t-off">{"░".repeat(width - on)}</span>
    </>
  );
};

export function Terminal({ stats }: { stats: TerminalStats }) {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const history = useRef<string[]>([]);
  const cursor = useRef(0);
  const nextId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const print = (...nodes: ReactNode[]) =>
    setLines((l) => [...l, ...nodes.map((node) => ({ id: nextId.current++, node }))]);

  /** A command name that runs itself when clicked. */
  const cmdLink = (c: string, label?: string) => (
    <button type="button" className="t-cmd" onClick={() => run(c)}>
      {label ?? c}
    </button>
  );

  function project(slug: "hashvault" | "konnect") {
    const p = PROJECTS.find((x) => x.slug === slug)!;
    const done = p.roadmap?.filter((r) => r.done).length ?? 0;
    const total = p.roadmap?.length ?? 0;
    const next = p.roadmap?.find((r) => !r.done);
    return (
      <div className="t-sheet">
        <p className="t-title">{p.name.toUpperCase()}</p>
        <p className="t-rule">{"─".repeat(34)}</p>
        <p>{p.dek.replace(/\.$/, "")} — {p.stack.slice(0, 3).join(", ")}.</p>
        {p.planes?.map(([k, v]) => (
          <div className="t-kv" key={k}>
            <span>{k.toUpperCase()}</span>
            <span>{v}</span>
          </div>
        ))}
        <div className="t-kv">
          <span>STATUS</span>
          {total ? (
            <span>
              {bar(done / total)} {Math.round((done / total) * 100)}%
              <span className="dim"> · {done} of {total} phases</span>
            </span>
          ) : (
            <span>{p.status}</span>
          )}
        </div>
        {next && (
          <div className="t-kv">
            <span>NEXT</span>
            <span>{next.phase}</span>
          </div>
        )}
        <p className="t-open">
          &gt; {cmdLink(`open ${p.slug}`, "open project")}
        </p>
      </div>
    );
  }

  function run(raw: string) {
    const cmd = raw.trim().toLowerCase();
    print(
      <p className="echo">
        <span className="ps">{PROMPT}</span> {raw}
      </p>,
    );
    if (!cmd) return;
    history.current.push(raw);
    cursor.current = history.current.length;
    const [verb, arg] = cmd.split(/\s+/);

    switch (verb) {
      case "help":
        print(
          <dl className="help">
            {HELP.map(([c, d]) => (
              <div key={c}>
                <dt>{cmdLink(c)}</dt>
                <dd>→ {d}</dd>
              </div>
            ))}
          </dl>,
        );
        break;
      case "about":
      case "whoami":
        print(
          <p>
            Ankit Sinha — backend engineer. Distributed systems, cloud infrastructure, storage and messaging.
            MCA at IIT Patna; BCA from LPU (CGPA 9.86). Also known as Haunts.
          </p>,
        );
        break;
      case "stack":
        print(
          <dl className="help">
            {STACK.map((d) => (
              <div key={d.desk}><dt>{d.desk.toLowerCase()}</dt><dd>{d.items.map((i) => i.name).join(" · ")}</dd></div>
            ))}
          </dl>,
        );
        break;
      case "work":
      case "ls":
        print(
          <dl className="help">
            {PROJECTS.map((p) => (
              <div key={p.slug}>
                <dt>{cmdLink(p.slug)}</dt>
                <dd>{p.dek}</dd>
              </div>
            ))}
          </dl>,
        );
        break;
      case "hashvault":
      case "konnect":
        print(project(verb));
        break;
      case "open": {
        const target = arg === "project" || !arg ? "hashvault" : arg;
        const p = PROJECTS.find((x) => x.slug === target);
        if (!p) {
          print(<p>open: no such project: {arg}. Try {cmdLink("work")}.</p>);
          break;
        }
        print(<p>Opening {p.name} case study …</p>);
        router.push(`/work/${p.slug}`);
        break;
      }
      case "coding":
        print(
          <dl className="help">
            <div><dt>leetcode</dt><dd>{stats.solved} solved{stats.lcRating ? ` · contest ${stats.lcRating}` : ""}</dd></div>
            <div><dt>codeforces</dt><dd>{stats.cfRating} · {stats.cfRank}</dd></div>
            <div><dt>streak</dt><dd>{stats.streak} days</dd></div>
            <div><dt>full</dt><dd><a href="/markets">open the coding exchange →</a></dd></div>
          </dl>,
        );
        break;
      case "writing":
        print(
          <dl className="help">
            {REPORTS.map((r) => (
              <div key={r.slug}>
                <dt>report {r.no}</dt>
                <dd><a href={`/engineering/${r.slug}`}>{r.title}</a></dd>
              </div>
            ))}
          </dl>,
        );
        break;
      case "resume":
        print(
          <p>
            Résumé ready.{" "}
            <a href={LINKS.resume} download className="term-btn">[ DOWNLOAD PDF ]</a>
          </p>,
        );
        break;
      case "contact":
        print(
          <dl className="help">
            <div><dt>email</dt><dd><a href={`mailto:${LINKS.email}`}>{LINKS.email}</a></dd></div>
            <div><dt>github</dt><dd>{cmdLink("github", "AnkitSinha0")}</dd></div>
            <div><dt>linkedin</dt><dd>{cmdLink("linkedin", "ankit0sinha")}</dd></div>
          </dl>,
        );
        break;
      case "github":
      case "linkedin": {
        const url = verb === "github" ? LINKS.github : LINKS.linkedin;
        window.open(url, "_blank", "noopener,noreferrer");
        print(<p>Opening <a href={url} target="_blank" rel="noopener noreferrer">{url.replace("https://", "")}</a> …</p>);
        break;
      }
      case "date":
        print(<p>{new Date().toLocaleString("en-GB", { timeZone: "Asia/Kolkata" })} IST</p>);
        break;
      case "sudo":
        print(<p>Permission denied. Nice try — this incident will be reported to the editor.</p>);
        break;
      case "clear":
        setLines([]);
        break;
      default:
        print(<p>command not found: {cmd}. Type {cmdLink("help")}.</p>);
    }
  }

  const runRef = useRef(run);
  useEffect(() => {
    runRef.current = run;
  });

  // The first time the terminal scrolls into view, someone types `help`.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        if (reduce) {
          timers.push(window.setTimeout(() => runRef.current("help"), 0));
          return;
        }
        setTyping(true);
        "help".split("").forEach((_, i) => {
          timers.push(window.setTimeout(() => setInput("help".slice(0, i + 1)), 350 + i * 110));
        });
        timers.push(
          window.setTimeout(() => {
            setInput("");
            setTyping(false);
            runRef.current("help");
          }, 350 + 4 * 110 + 260),
        );
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(window.clearTimeout);
    };
  }, []);

  useEffect(() => {
    const el = screenRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (typing) {
      e.preventDefault();
      return;
    }
    if (e.key === "Enter") {
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const h = history.current;
      cursor.current = Math.max(0, Math.min(h.length, cursor.current + (e.key === "ArrowUp" ? -1 : 1)));
      setInput(h[cursor.current] ?? "");
    } else if (e.key === "Tab") {
      const typed = input.trim().toLowerCase();
      if (!typed) return;
      e.preventDefault();
      const match = COMMANDS.filter((c) => c.startsWith(typed));
      if (match.length === 1) setInput(match[0]);
      else if (match.length > 1)
        print(
          <p className="echo"><span className="ps">{PROMPT}</span> {input}</p>,
          <p className="dim">{match.join("   ")}</p>,
        );
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }

  return (
    <div className="term-wrap" ref={rootRef}>
      <div className="term" onClick={(e) => {
        if (!(e.target as HTMLElement).closest("a,button")) inputRef.current?.focus();
      }}>
        <p className="term-bar">
          <span><i className="dot" /> ankit@ankitsin — zsh</span>
          <span>80×24</span>
        </p>
        <div className="term-screen" ref={screenRef} aria-live="polite">
          {lines.map((l) => (
            <div key={l.id}>{l.node}</div>
          ))}
          <label className="term-input">
            <span className="ps">{PROMPT}</span>
            <span className="term-field">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => !typing && setInput(e.target.value)}
                onKeyDown={onKey}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                aria-label="Terminal command"
                style={{ width: `${Math.max(0.2, input.length)}ch` }}
              />
              <span className="term-cursor" aria-hidden="true" />
            </span>
          </label>
        </div>
      </div>
      <p className="term-try">
        Try{" "}
        {TRY.map((c) => (
          <button key={c} type="button" onClick={() => { run(c); inputRef.current?.focus({ preventScroll: true }); }}>
            {c}
          </button>
        ))}
      </p>
    </div>
  );
}
