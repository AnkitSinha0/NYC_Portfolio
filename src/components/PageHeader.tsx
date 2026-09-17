import { Nameplate } from "./Nameplate";
import { SectionBar } from "./SectionBar";
import { Rule } from "./Rule";

type Section = "/" | "/work" | "/markets" | "/profile" | "/writing" | "/letters" | "/resume";

/**
 * The masthead every page repeats: nameplate, rules, section bar.
 * Newspaper convention — the front-page furniture runs on every page.
 */
export function PageHeader({ active }: { active: Section }) {
  return (
    <>
      <Nameplate
        edition="Vol. I · No. 1"
        dateline="Patna · Phagwara · Chaibasa"
        tagline={["Backend Engineer", "Distributed Systems & Cloud Infrastructure", "Also known as Haunts"]}
      />
      <Rule />
      <SectionBar active={active} />
    </>
  );
}
