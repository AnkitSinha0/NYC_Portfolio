import Image from "next/image";

/**
 * An image or diagram with an italic caption — the only place a
 * photograph belongs on the site. Never stock imagery (CLAUDE.md).
 */
export function Plate({
  src,
  alt,
  caption,
}: {
  src?: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="m-0">
      {src ? (
        <div className="relative aspect-[4/3] w-full">
          <Image src={src} alt={alt} fill className="object-cover" priority />
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
