"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { LINKS, PROJECTS, STACK } from "@/lib/content";

export type TerminalStats = {
  solved: number;
  lcRating: number | null;
  cfRating: number;
  cfRank: string;
  streak: number;
};

const PROMPT = "ankit@ankitsin:~$";

const HELP: [string, string][] = [
  ["about", "about Ankit"],
  ["stack", "technical stack"],
  ["work", "selected projects"],
  ["hashvault", "the current build"],
  ["coding", "coding statistics"],
  ["resume", "download résumé"],
  ["contact", "contact information"],
  ["github", "GitHub profile"],
  ["linkedin", "LinkedIn profile"],
  ["clear", "clear terminal"],
];
const COMMANDS = [...HELP.map(([c]) => c), "konnect", "whoami", "ls", "date", "sudo"];

type Line = { id: number; node: ReactNode };

export function Terminal({ stats }: { stats: TerminalStats }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const history = useRef<string[]>([]);
  const cursor = useRef(0);
  const nextId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  const print = (...nodes: ReactNode[]) =>
    setLines((l) => [...l, ...nodes.map((node) => ({ id: nextId.current++, node }))]);

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

    switch (cmd.split(/\s+/)[0]) {
      case "help":
        print(
          <dl className="help">
            {HELP.map(([c, d]) => (
              <div key={c}><dt>{c}</dt><dd>→ {d}</dd></div>
            ))}
          </dl>,
        );
        break;
      case "about":
      case "whoami":
        print(
          <p>
            Ankit Sinha — backend engineer. Distributed systems, cloud infrastructure, storage and
            messaging. MCA at IIT Patna; BCA from LPU (CGPA 9.86). Also known as Haunts.
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
                <dt>{p.slug}</dt>
                <dd>
                  {p.dek} <a href={`/work/${p.slug}`}>case study →</a>
                </dd>
              </div>
            ))}
          </dl>,
        );
        break;
      case "hashvault":
      case "konnect": {
        const p = PROJECTS.find((x) => x.slug === cmd)!;
        print(
          <p>
            <b>{p.name}</b> — {p.teaser}
            <br />
            <span className="dim">{p.stack.join(" · ")}</span> <a href={`/work/${p.slug}`}>read case study →</a>
          </p>,
        );
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
      case "resume":
        print(
          <p>
            Résumé ready.{" "}
            <a href={LINKS.resume} download className="term-btn">
              [ DOWNLOAD PDF ]
            </a>
          </p>,
        );
        break;
      case "contact":
        print(
          <dl className="help">
            <div><dt>email</dt><dd><a href={`mailto:${LINKS.email}`}>{LINKS.email}</a></dd></div>
            <div><dt>github</dt><dd>AnkitSinha0</dd></div>
            <div><dt>linkedin</dt><dd>ankit0sinha</dd></div>
          </dl>,
        );
        break;
      case "github":
      case "linkedin": {
        const url = cmd === "github" ? LINKS.github : LINKS.linkedin;
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
        print(<p>command not found: {cmd}. Type <b>help</b>.</p>);
    }
  }

  // Greeting, then `help`, as if someone just typed it. Deferred so
  // the effect doesn't set state synchronously.
  const runRef = useRef(run);
  useEffect(() => {
    runRef.current = run;
  });
  useEffect(() => {
    const t = window.setTimeout(() => runRef.current("help"), 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = screenRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const h = history.current;
      cursor.current = Math.max(0, Math.min(h.length, cursor.current + (e.key === "ArrowUp" ? -1 : 1)));
      setInput(h[cursor.current] ?? "");
    } else if (e.key === "Tab") {
      const match = COMMANDS.filter((c) => c.startsWith(input.trim().toLowerCase()));
      if (input.trim() && match.length === 1) {
        e.preventDefault();
        setInput(match[0]);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }

  return (
    <div className="term" onClick={() => inputRef.current?.focus()}>
      <p className="term-bar">
        <span>ankit@ankitsin — zsh</span>
        <span>80×24</span>
      </p>
      <div className="term-screen" ref={screenRef} aria-live="polite">
        {lines.map((l) => (
          <div key={l.id}>{l.node}</div>
        ))}
        <label className="term-input">
          <span className="ps">{PROMPT}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Terminal command"
          />
        </label>
      </div>
    </div>
  );
}
