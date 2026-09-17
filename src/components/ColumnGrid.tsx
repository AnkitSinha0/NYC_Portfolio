import { Children, Fragment } from "react";

/**
 * The newspaper's 1/2/3-column grid: hairline gutters, no boxes.
 * Collapses to a single column under 820px, where the gutter rule
 * turns from vertical to horizontal — see CLAUDE.md §non-negotiables.
 */
export function ColumnGrid({
  columns,
  children,
  className = "",
}: {
  columns: 2 | 3;
  children: React.ReactNode;
  className?: string;
}) {
  const templateClass =
    columns === 3
      ? "grid-cols-1 md:grid-cols-[1.3fr_1.45fr_0.95fr]"
      : "grid-cols-1 md:grid-cols-[1.6fr_1fr]";

  const items = Children.toArray(children);

  return (
    <div className={`grid ${templateClass} gap-6 md:gap-0 ${className}`}>
      {items.map((child, i) => (
        <Fragment key={i}>
          <div
            className={
              i === 0
                ? "md:pr-5"
                : "border-t md:border-t-0 md:border-l border-hair pt-6 md:pt-0 md:px-5 md:last:pr-0"
            }
          >
            {child}
          </div>
        </Fragment>
      ))}
    </div>
  );
}
