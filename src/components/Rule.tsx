type RuleWeight = "hairline" | "standard" | "thick";

const weightClass: Record<RuleWeight, string> = {
  hairline: "border-t border-hair",
  standard: "border-t border-rule",
  thick: "border-t-[3px] border-rule",
};

/**
 * The single source of every horizontal line on the site. Newspaper
 * structure comes from rules, not borders-on-boxes — see CLAUDE.md.
 */
export function Rule({
  weight = "standard",
  className = "",
}: {
  weight?: RuleWeight;
  className?: string;
}) {
  return <hr className={`m-0 ${weightClass[weight]} ${className}`} />;
}
