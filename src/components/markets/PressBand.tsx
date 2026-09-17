/**
 * The tonal inversion wrapper. Used exactly once, on /markets.
 * A second usage anywhere kills the effect — see CLAUDE.md.
 */
export function PressBand({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-press-bg text-press-ink px-5 py-8 md:px-8 md:py-9 [&_a]:text-inherit [&_a]:no-underline">
      {children}
    </div>
  );
}
