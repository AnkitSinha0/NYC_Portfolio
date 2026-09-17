import { Rule } from "./Rule";

/**
 * The blackletter wordmark, rules and folio line. This IS the page's
 * <h1> on the home page — never ship it as an image (SEO §7).
 */
export function Nameplate({
  edition,
  dateline,
  tagline,
}: {
  edition: string;
  dateline: string;
  tagline: string[];
}) {
  return (
    <header>
      <div className="flex flex-wrap justify-between gap-3 py-2 text-[9.5px] tracking-[0.16em] uppercase text-soft">
        <span>{edition}</span>
        <span>{dateline}</span>
        <span>ankitsin.in</span>
      </div>
      <Rule weight="hairline" />
      <h1 className="font-nameplate font-normal text-center leading-none my-3 text-[clamp(2.5rem,8.4vw,5.4rem)]">
        Ankit Sinha
      </h1>
      <Rule weight="thick" />
      <div className="flex flex-wrap justify-between gap-3 py-2 text-[9.5px] tracking-[0.16em] uppercase text-soft">
        {tagline.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </header>
  );
}
