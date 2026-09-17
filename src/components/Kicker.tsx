export function Kicker({
  children,
  accent = false,
  className = "",
}: {
  children: React.ReactNode;
  accent?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`m-0 mb-2 text-[9.5px] font-bold tracking-[0.18em] uppercase ${
        accent ? "text-red" : "text-ink"
      } ${className}`}
    >
      {children}
    </p>
  );
}
