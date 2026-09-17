/**
 * Platform, headline figure in tabular-nums, footer. The whole tile
 * is a link out to the live profile.
 */
export function QuoteTile({
  href,
  label,
  sub,
  value,
  foot,
}: {
  href: string;
  label: string;
  sub: string;
  value: string;
  foot: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 border-l border-press-hair first:border-l-0 first:pl-0 hover:bg-black/20 focus-visible:bg-black/20 transition-colors"
    >
      <div className="text-[9px] font-bold tracking-[0.18em] uppercase text-press-soft">
        {label}
      </div>
      <div className="font-body text-[12px] text-[#c6bfb1] mt-0.5">{sub}</div>
      <div className="font-condensed font-bold text-[2.6rem] leading-none tabular-nums mt-2.5">
        {value}
      </div>
      <div className="flex justify-between gap-2.5 mt-2 text-[9.5px] tracking-[0.1em] uppercase text-press-soft">
        <span>{foot}</span>
        <span className="text-press-ink">Open ↗</span>
      </div>
    </a>
  );
}
