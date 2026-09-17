import { Kicker } from "./Kicker";

type HedSize = "lead" | "sub" | "small";

const hedClass: Record<HedSize, string> = {
  lead: "text-[clamp(1.5625rem,3.3vw,2.3125rem)]",
  sub: "text-[1.25rem]",
  small: "text-[0.96875rem] leading-tight",
};

/**
 * Kicker + hed + byline + body, locked to ~65ch. Optional drop cap —
 * use on at most one lead paragraph per page (CLAUDE.md).
 */
export function Article({
  kicker,
  kickerAccent,
  hed,
  hedSize = "sub",
  byline,
  children,
  drop = false,
}: {
  kicker?: string;
  kickerAccent?: boolean;
  hed: string;
  hedSize?: HedSize;
  byline?: string;
  children: React.ReactNode;
  drop?: boolean;
}) {
  return (
    <article className="max-w-[65ch]">
      {kicker && <Kicker accent={kickerAccent}>{kicker}</Kicker>}
      <h2 className={`font-display font-bold leading-[1.07] text-balance mb-2 ${hedClass[hedSize]}`}>
        {hed}
      </h2>
      {byline && (
        <p className="text-[9.5px] tracking-[0.14em] uppercase text-soft mb-2">{byline}</p>
      )}
      <div
        className={`font-body text-[13px] leading-[1.5] text-justify [hyphens:auto] [&>p]:mb-2 [&>p:last-child]:mb-0 ${
          drop ? "[&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:font-display [&>p:first-child]:first-letter:font-black [&>p:first-child]:first-letter:text-[3.05em] [&>p:first-child]:first-letter:leading-[0.82] [&>p:first-child]:first-letter:pr-[0.09em]" : ""
        }`}
      >
        {children}
      </div>
    </article>
  );
}
