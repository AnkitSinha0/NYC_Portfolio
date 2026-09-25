import Link from "next/link";
import { DeskMargins } from "@/components/edition/DeskMargins";
import { NAV } from "@/lib/content";
import { formatDay, todayIST } from "@/lib/stats/days";

/**
 * The publication's masthead, shared by every newspaper page.
 * `active` is the nav href of the current section.
 */
export function Masthead({ active, desk }: { active: string; desk?: string }) {
  const today = formatDay(todayIST()).toUpperCase();

  return (
    <>
      <DeskMargins />
      <header className="pad masthead-se">
        <div className="folio">
          <span>Ankit Sinha · Backend Engineer</span>
          <span className="folio-mid">{desk ?? "Distributed Systems & Cloud Infrastructure"}</span>
          <span>Issue No. 01 · {today}</span>
        </div>
        <hr className="rule-hair" />
        <p className="nameplate">
          <Link href="/">Ankit Sinha</Link>
        </p>
        <hr className="rule-double" />
        <nav className="secnav" aria-label="Sections">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={n.href === active ? "on" : undefined} aria-current={n.href === active ? "page" : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>
        <hr className="rule-thick" />
      </header>
    </>
  );
}
