"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { mockEvent, mockFeed } from "@/lib/activity/mock";
import type { ActivityEvent, ActivityFeed } from "@/lib/activity/types";
import { dayKey, formatDay, timeIST } from "@/lib/stats/days";

const POLL_MS = 45_000;
const ARRIVAL_MS = 2400; // how long a new row keeps its highlight

/** "JUST NOW", "14s AGO", "12m AGO", "3h AGO" */
function ago(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 5) return "JUST NOW";
  if (s < 60) return `${s}s AGO`;
  if (s < 3600) return `${Math.floor(s / 60)}m AGO`;
  return `${Math.floor(s / 3600)}h AGO`;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** The 7-day chart: a small printed line, not an analytics widget. */
function WeekChart({ week }: { week: ActivityFeed["week"] }) {
  const max = Math.max(1, ...week.map((d) => d.count));
  const x = (i: number) => 12 + i * 32;
  const y = (v: number) => 50 - (v / max) * 38;
  const line = week.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.count).toFixed(1)}`).join(" ");
  return (
    <svg viewBox="0 0 216 68" role="img" aria-label={`Activity over the last seven days: ${week.map((d) => `${d.label} ${d.count}`).join(", ")}`}>
      <line x1="4" y1="50" x2="212" y2="50" stroke="var(--hair)" strokeWidth="1" />
      <path d={`${line} L${x(6)},50 L${x(0)},50 Z`} fill="rgba(26,23,18,.06)" />
      <path d={line} fill="none" stroke="var(--ink)" strokeWidth="1.2" strokeLinejoin="round" />
      {week.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.count)} r={i === 6 ? 2.6 : 1.6} fill={i === 6 ? "var(--red)" : "var(--ink)"} />
          <text x={x(i)} y="63" textAnchor="middle">{d.label}</text>
        </g>
      ))}
    </svg>
  );
}

export function ActivityFloor({ initial }: { initial: ActivityFeed }) {
  const [feed, setFeed] = useState(initial);
  const [fresh, setFresh] = useState<Set<string>>(new Set());
  const [lastUpdate, setLastUpdate] = useState(() => Date.parse(initial.generatedAt));
  const [now, setNow] = useState<number | null>(null); // null until mounted: no clock during SSR
  const [flag, setFlag] = useState(false);
  const known = useRef(new Set(initial.events.map((e) => e.id)));

  /** Merge incoming events; anything not seen before arrives with the animation. */
  const land = (next: ActivityFeed) => {
    const arrived = next.events.filter((e) => !known.current.has(e.id)).map((e) => e.id);
    next.events.forEach((e) => known.current.add(e.id));
    setFeed(next);
    if (arrived.length) {
      setFresh(new Set(arrived));
      setFlag(true);
      setLastUpdate(Date.now());
      window.setTimeout(() => {
        setFresh(new Set());
        setFlag(false);
      }, ARRIVAL_MS);
    } else {
      setLastUpdate(Date.parse(next.generatedAt));
    }
  };
  const landRef = useRef(land);
  useEffect(() => {
    landRef.current = land;
  });

  // The update source. Live: poll GET /api/activity (swap for SSE here
  // later — only `landRef.current(feed)` needs calling). Demo: a sample
  // event every 20–40 s, clearly labelled on the page.
  useEffect(() => {
    const demo = new URLSearchParams(window.location.search).get("feed") === "demo";
    let timer = 0;
    let cancelled = false;

    if (demo) {
      let current = mockFeed(Date.now());
      known.current = new Set(current.events.map((e) => e.id));
      timer = window.setTimeout(() => {
        setFeed(current);
        setLastUpdate(Date.now());
        tick();
      }, 0);
      const tick = () => {
        timer = window.setTimeout(() => {
          const e = mockEvent(Date.now());
          const s = current.summary;
          current = {
            ...current,
            generatedAt: new Date().toISOString(),
            events: [e, ...current.events].slice(0, 40),
            summary: {
              ...s,
              pushes: s.pushes + (e.source === "github" || e.source === "project" ? 1 : 0),
              solved: s.solved + (e.signal === "✓" && e.source !== "project" ? 1 : 0),
            },
          };
          landRef.current(current);
          tick();
        }, 20_000 + Math.random() * 20_000);
      };
    } else {
      const poll = async () => {
        try {
          const res = await fetch("/api/activity", { cache: "no-store" });
          if (res.ok && !cancelled) landRef.current((await res.json()) as ActivityFeed);
        } catch {
          /* keep the last tape; the next poll retries */
        }
        if (!cancelled) timer = window.setTimeout(poll, POLL_MS);
      };
      poll();
    }

    const clock = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.clearInterval(clock);
    };
  }, []);

  const demo = feed.mode === "demo";
  const { summary } = feed;
  const today = now ? dayKey(now) : feed.events[0]?.day;

  // Rows with a dated rule wherever the day turns over, as a printed tape does.
  const rows = useMemo(() => {
    const out: ({ kind: "day"; day: string } | { kind: "event"; e: ActivityEvent })[] = [];
    let day = "";
    for (const e of feed.events) {
      if (e.day !== day) {
        out.push({ kind: "day", day: e.day });
        day = e.day;
      }
      out.push({ kind: "event", e });
    }
    return out;
  }, [feed.events]);

  const ticker: [string, string, "up" | "dn" | "fl"][] = [
    ["GitHub", `▲ ${pad(summary.pushes)}`, summary.pushes ? "up" : "fl"],
    ["LeetCode · CF solved", `▲ ${pad(summary.solved)}`, summary.solved ? "up" : "fl"],
    ...(summary.topRepo ? ([[summary.topRepo, "● ACTIVE", "fl"]] as [string, string, "fl"][]) : []),
    [
      "Codeforces",
      summary.cfLastChange === null ? "—" : `${summary.cfLastChange >= 0 ? "▲ +" : "▼ "}${summary.cfLastChange}`,
      summary.cfLastChange === null ? "fl" : summary.cfLastChange >= 0 ? "up" : "dn",
    ],
    ["PRs", `▲ ${pad(summary.prs)}`, summary.prs ? "up" : "fl"],
    ["Repos", `● ${pad(summary.repos)}`, "fl"],
    ["7-day volume", `▲ ${summary.week}`, summary.week ? "up" : "fl"],
  ];
  const tickerRow = ticker.map(([k, v, cls]) => (
    <span className="ft-item" key={k}>
      {k} <b className={cls}>{v}</b>
    </span>
  ));

  return (
    <section className="floor" aria-labelledby="floor-title">
      <header className="floor-head">
        <div>
          <p className="floor-kicker">Market Activity</p>
          <h3 id="floor-title">Developer Exchange</h3>
        </div>
        <div className="floor-status">
          {demo ? (
            <p className="live demo">● Demo feed · sample data</p>
          ) : (
            <p className="live">
              <i aria-hidden="true" /> Market open · Live
            </p>
          )}
          <p className="stamp">
            {formatDay(dayKey(lastUpdate)).toUpperCase()} · LAST UPDATED {timeIST(lastUpdate).slice(0, 5)} IST
          </p>
          <p className="stamp ago" aria-live="polite">
            {now ? `UPDATED ${ago(now - lastUpdate)}` : " "}
          </p>
        </div>
      </header>

      <div className="floor-body">
        <aside className="floor-side">
          <figure className="plate-photo">
            <div className="screen">
              <Image src="/ankit-sinha.png" alt="Ankit Sinha" fill sizes="(max-width: 860px) 90vw, 320px" />
            </div>
            <figcaption>Ankit Sinha, on the floor. Screened at 85 lines per inch.</figcaption>
          </figure>

          <div className="floor-stats">
            <h5>Last 24 Hours</h5>
            <dl>
              <div><dt>Pushes</dt><dd>{pad(summary.pushes)}</dd></div>
              <div><dt>Solved</dt><dd>{pad(summary.solved)}</dd></div>
              <div><dt>PRs</dt><dd>{pad(summary.prs)}</dd></div>
              <div><dt>Repos</dt><dd>{pad(summary.repos)}</dd></div>
            </dl>
          </div>

          <div className="floor-chart">
            <h5>Activity / 7 Days <span>{summary.week} total</span></h5>
            <WeekChart week={feed.week} />
          </div>
        </aside>

        <div className="tape-wrap">
          <div className="tape-head">
            <span>Time IST</span>
            <span>Sym</span>
            <span>Transaction</span>
            <span className={flag ? "tape-flag on" : "tape-flag"}>New activity</span>
          </div>
          {feed.events.length === 0 ? (
            <p className="tape-empty">The tape is quiet — no feed reached the floor this hour.</p>
          ) : (
            <ol className="tape">
              {rows.map((r) =>
                r.kind === "day" ? (
                  <li className="tape-day" key={`d-${r.day}`}>
                    <span>{r.day === today ? "Today" : formatDay(r.day)}</span>
                  </li>
                ) : (
                  <li
                    key={r.e.id}
                    className={`row sym-${r.e.symbol}${fresh.has(r.e.id) ? " arrive" : ""}`}
                    tabIndex={0}
                  >
                    <span className="t">{r.e.timestamp}</span>
                    <span className="sym">{r.e.symbol}</span>
                    <span className="what">
                      <b>{r.e.title}</b>
                      <span>{r.e.description}</span>
                    </span>
                    <span className={`sig ${r.e.signalType ?? "neutral"}`}>{r.e.signal ?? "●"}</span>
                    {r.e.detail && (
                      <div className="more">
                        <div>
                          {r.e.detail.lines.map((l, i) => (
                            <p key={i}>{l}</p>
                          ))}
                          <p className="when">{r.e.detail.when}</p>
                          {r.e.detail.url && (
                            <a href={r.e.detail.url} target="_blank" rel="noopener noreferrer">
                              {r.e.detail.linkLabel ?? "View →"}
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                ),
              )}
            </ol>
          )}
          {feed.down.length > 0 && (
            <p className="tape-note">{feed.down.join(" · ")} feed delayed — showing what reached the floor.</p>
          )}
        </div>
      </div>

      <div className="floor-ticker" aria-label="Activity ticker">
        <div className="ft-track">
          {tickerRow}
          <span style={{ display: "contents" }} aria-hidden="true">{tickerRow}</span>
        </div>
      </div>
    </section>
  );
}
