import { Rail } from "@/components/times/Rail";
import { Darkroom } from "@/components/times/Darkroom";
import { Projects } from "@/components/times/Projects";
import { Terminal } from "@/components/times/Terminal";
import { Markets } from "@/components/times/Markets";
import { AnkitTimesFront } from "@/components/peel/AnkitTimesFront";
import { CleanFront } from "@/components/peel/CleanFront";

const LAPS: [number, string, number][] = [
  [1, "Learning", 42],
  [2, "Building", 38],
  [3, "Exploring", 27],
  [4, "Overthinking", 21],
  [5, "Sleeping", 12],
];

const POLAROIDS: [string, string][] = [
  ["Mountains", "high ground"],
  ["Desk, 2am", "build hours"],
  ["Camera", "35mm"],
  ["Sketch", "a thought"],
  ["Road", "somewhere"],
];

/**
 * The whole newspaper: Rail nav + all eight sections. This entire
 * thing is what gets fixed to the viewport and peeled — not just its
 * front page. See NewspaperOverlay below.
 */
function TheAnkitTimes() {
  return (
    <div className="shell">
      <Rail />

      <main className="stage">
        <section id="s1">
          <AnkitTimesFront />
        </section>

        {/* ══ 02 ABOUT ══ */}
        <section className="band night" id="s2">
          <p className="scroll-note">
            {"// Scroll"}
            <br />
            to know more
          </p>
          <div className="about">
            <Darkroom />
            <div>
              <h2>
                Hi, I&rsquo;m <b>Ankit Sinha.</b>
              </h2>
              <p className="role">Backend engineer. Builder. Learner.</p>
              <p className="bio">
                Currently interested in distributed systems, cloud infrastructure and making
                software that survives contact with production.
              </p>
              <div className="tags">
                <span>F1</span>
                <span>Photography</span>
                <span>Mountains</span>
                <span>Gaming</span>
                <span>Drawing</span>
              </div>
            </div>
          </div>
          <p className="aside-scribble">
            Same person,
            <br />
            more pixels.
          </p>
        </section>

        {/* ══ 03 PROJECTS ══ */}
        <Projects />

        {/* ══ 04 TERMINAL ══ */}
        <Terminal />

        {/* ══ 05 F1 ══ */}
        <section className="band f1" id="s5">
          <div className="f1-blur" aria-hidden="true" />
          <div className="f1-grid">
            <div>
              <h2>
                Life is
                <br />
                a Race.
              </h2>
              <p className="disc">
                Same discipline.
                <br />
                Different track.
              </p>
              <span className="strat">Strategy &gt; Speed</span>
            </div>

            <table className="laps">
              <caption>2026 Season (Personal)</caption>
              <thead>
                <tr>
                  <th />
                  <th>Discipline</th>
                  <th>Laps</th>
                </tr>
              </thead>
              <tbody>
                {LAPS.map(([pos, name, laps]) => (
                  <tr key={name}>
                    <td>{pos}</td>
                    <td>{name}</td>
                    <td>{laps}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="track">
              <p className="quote">
                “It&rsquo;s not just a sport.
                <br />
                It&rsquo;s a mindset.”
              </p>
              <svg viewBox="0 0 150 110" role="img" aria-label="Circuit outline">
                <path
                  d="M28,96 C14,88 12,70 24,58 C36,46 52,50 58,38 C64,26 56,14 70,10 C86,6 96,18 108,20 C124,22 136,34 132,50 C128,66 108,64 100,74 C92,84 96,98 82,102 C66,106 44,104 28,96 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  opacity=".85"
                />
                <circle cx="28" cy="96" r="3.4" fill="var(--red-hot)" />
              </svg>
              <p className="lap">
                <span>Monaco</span>
                <b>Lap 1 →</b>
              </p>
            </div>
          </div>
        </section>

        {/* ══ 06 MARKETS ══ */}
        <Markets />

        {/* ══ 07 NOTES ══ */}
        <section className="band cream notes tex stain" id="s7">
          <div className="board">
            <div className="pola">
              <div className="photo">
                <span className="lbl">{POLAROIDS[0][0]}</span>
              </div>
              <span className="cap">{POLAROIDS[0][1]}</span>
            </div>
            <div className="pola">
              <div className="photo">
                <span className="lbl">{POLAROIDS[1][0]}</span>
              </div>
              <span className="cap">{POLAROIDS[1][1]}</span>
            </div>
            <p className="note-scrib">
              Mountains
              <br />
              make more sense
              <br />
              than people.
            </p>
            <div className="pola">
              <div className="photo">
                <span className="lbl">{POLAROIDS[2][0]}</span>
              </div>
              <span className="cap">{POLAROIDS[2][1]}</span>
            </div>
            <div className="pola">
              <div className="photo">
                <span className="lbl">{POLAROIDS[3][0]}</span>
              </div>
              <span className="cap">{POLAROIDS[3][1]}</span>
            </div>
            <p className="note-scrib">
              Random shots.
              <br />
              Random thoughts.
              <br />
              Same person.
            </p>
            <div className="pola">
              <div className="photo">
                <span className="lbl">{POLAROIDS[4][0]}</span>
              </div>
              <span className="cap">{POLAROIDS[4][1]}</span>
            </div>
          </div>
        </section>

        {/* ══ 08 CONTACT ══ */}
        <section className="band cream tex stain" id="s8">
          <div className="contact">
            <div>
              <h2>
                Let&rsquo;s Build
                <br />
                Something Interesting.
              </h2>
              <p>Open to opportunities, collaborations, or just a good conversation.</p>
            </div>
            <ul className="links">
              <li>
                <a href="https://github.com/AnkitSinha0" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/ankit0sinha/" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://x.com/Haunts_01" target="_blank" rel="noopener noreferrer">
                  X (Twitter)
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/haunts_01/" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href="mailto:ankits0057@gmail.com">Email</a>
              </li>
            </ul>
            <div className="stamp-wrap">
              <div className="stamp">
                PATNA
                <br />
                INDIA
                <br />
                2026
              </div>
              <span className="sig">Ankit Sinha</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* Layer 1 — the real, independently long-scrollable website.
          Exists from the first render, whether or not the newspaper
          on top of it is ever touched. Delete the block below and
          this alone should stand as a complete site. */}
      <CleanFront />

      {/* Layer 2 — fixed over the viewport, physically on top.
          Interaction (peel / hang / bottom-edge tear) intentionally
          not implemented yet — this is steps 1-4 only: the newspaper
          fully covers the screen, with a purely decorative lifted-
          corner hint (no JS, no drag). The interactive mechanic is
          the next pass, once this composition is confirmed. */}
      <div className="newspaper-overlay">
        <TheAnkitTimes />
        <span className="corner-hint" aria-hidden="true" />
      </div>
    </>
  );
}
