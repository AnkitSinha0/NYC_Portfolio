import Link from "next/link";
import { Rule } from "./Rule";

const SECTIONS = [
  { href: "/", label: "Front Page" },
  { href: "/work", label: "Work" },
  { href: "/markets", label: "Markets" },
  { href: "/profile", label: "Profile" },
  { href: "/writing", label: "Writing" },
  { href: "/letters", label: "Letters" },
  { href: "/resume", label: "Archive" },
] as const;

/**
 * Real links to real URLs, always visible, no hamburger on desktop.
 * This is the direct fix for the old Linux-terminal portfolio's
 * navigation problem — see ARCHITECTURE.md §4.
 */
export function SectionBar({ active }: { active: (typeof SECTIONS)[number]["href"] }) {
  return (
    <nav aria-label="Sections">
      <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1 py-2 text-[10.5px] font-semibold tracking-[0.14em] uppercase list-none m-0 p-0">
        {SECTIONS.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              aria-current={active === s.href ? "page" : undefined}
              className={`inline-block pb-[2px] ${
                active === s.href ? "border-b-2 border-ink" : "hover:border-b-2 hover:border-hair"
              }`}
            >
              {s.label}
            </Link>
          </li>
        ))}
      </ul>
      <Rule weight="thick" />
    </nav>
  );
}
