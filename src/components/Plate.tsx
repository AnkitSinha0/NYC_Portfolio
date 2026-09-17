import Image from "next/image";

// Ink/paper as 0–1 RGB, for the duotone table below.
// --ink #15120e -> 0.082 0.071 0.055 · --paper #fbfaf6 -> 0.984 0.980 0.965
const DUOTONE_TABLE = {
  r: "0.082 0.984",
  g: "0.071 0.980",
  b: "0.055 0.965",
};

/**
 * An image or diagram with an italic caption — the only place a
 * photograph belongs on the site. Never stock imagery (CLAUDE.md).
 *
 * `duotone` maps the photo's shadows to --ink and highlights to
 * --paper via an SVG filter, so it reads as newsprint rather than a
 * LinkedIn headshot. Only one duotone Plate should exist per page —
 * the filter id isn't scoped for more than one instance.
 */
export function Plate({
  src,
  alt,
  caption,
  duotone = false,
}: {
  src?: string;
  alt: string;
  caption: string;
  duotone?: boolean;
}) {
  return (
    <figure className="m-0">
      {src ? (
        <div className="relative aspect-[4/3] w-full">
          {duotone && (
            <svg width="0" height="0" className="absolute" aria-hidden="true">
              <filter id="plate-duotone" colorInterpolationFilters="sRGB">
                <feColorMatrix
                  type="matrix"
                  values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0"
                />
                <feComponentTransfer>
                  <feFuncR type="table" tableValues={DUOTONE_TABLE.r} />
                  <feFuncG type="table" tableValues={DUOTONE_TABLE.g} />
                  <feFuncB type="table" tableValues={DUOTONE_TABLE.b} />
                </feComponentTransfer>
              </filter>
            </svg>
          )}
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            style={duotone ? { filter: "url(#plate-duotone) contrast(1.05)" } : undefined}
            priority
          />
        </div>
      ) : (
        <div className="aspect-[4/3] w-full bg-gradient-to-br from-[#2a2621] via-[#4a443a] to-[#1c1915] flex items-end p-3">
          <span className="text-[9px] tracking-[0.14em] uppercase text-[#efe9dc] bg-black/45 px-2 py-1">
            {alt}
          </span>
        </div>
      )}
      <figcaption className="font-body italic text-[11px] leading-[1.4] text-soft mt-2">
        {caption}
      </figcaption>
    </figure>
  );
}
