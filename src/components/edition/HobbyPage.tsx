import Image from "next/image";
import Link from "next/link";
import { Colophon } from "@/components/edition/Colophon";
import { HobbyArt } from "@/components/edition/HobbyArt";
import { Masthead } from "@/components/edition/Masthead";
import { HOBBIES } from "@/lib/content";

const INTRO = {
  photography: {
    hed: "Frames, Places & Observations",
    dek: "A photo essay in progress. Large images, captions, locations and dates — printed as they come off the roll.",
    empty: "The first roll is still in the darkroom.",
  },
  drawing: {
    hed: "The Sketchbook",
    dek: "Visual studies, numbered as they are drawn. Graphite, ink and whatever was nearby.",
    empty: "Sketch No. 01 is on the desk, not yet scanned.",
  },
  gaming: {
    hed: "The Game Room",
    dek: "Behind the newsroom, a smaller room with the lights down. Now playing, all-time favourites and the occasional high score.",
    empty: "The machines are warming up.",
  },
} as const;

/** A hobby desk: a gallery when there is work to show, an honest notice when there isn't. */
export function HobbyPage({ kind }: { kind: keyof typeof HOBBIES }) {
  const h = HOBBIES[kind];
  const intro = INTRO[kind];
  const plates = h.plates;

  return (
    <div className={`se hobby-page ${kind}`}>
      <div className="edition">
        <Masthead active="/" desk={`Beyond the Stack · ${h.title}`} />
        <section className="pad page-open">
          <p className="kicker red">Beyond the Stack · {h.title}</p>
          <h1 className="page-hed">{intro.hed}</h1>
          <p className="lead-dek">{intro.dek}</p>
        </section>

        <section className="pad">
          {plates.length > 0 ? (
            <div className="gallery">
              {plates.map((p, i) => (
                <figure key={p.src} className={i === 0 ? "plate wide" : "plate"}>
                  <div className="plate-img">
                    <Image src={p.src} alt={p.title} fill sizes="(max-width: 880px) 100vw, 50vw" />
                  </div>
                  <figcaption>
                    <b>{String(i + 1).padStart(2, "0")} · {p.title}</b> {p.caption}
                    <span className="meta-mono">{p.meta}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="awaiting">
              <HobbyArt kind={kind} />
              <div>
                <p className="kicker">Notice to readers</p>
                <h2 className="hed">{intro.empty}</h2>
                <p className="body">
                  This desk opens with the next edition. The first plates will be printed here with
                  captions, places and dates.
                </p>
                <Link className="more" href="/#beyond-hed">← Back to the front page</Link>
              </div>
            </div>
          )}
        </section>

        <Colophon />
      </div>
    </div>
  );
}
