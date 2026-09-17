import Image from "next/image";
import { Rail } from "@/components/times/Rail";
import { Darkroom } from "@/components/times/Darkroom";
import { Projects } from "@/components/times/Projects";
import { Terminal } from "@/components/times/Terminal";
import { Markets } from "@/components/times/Markets";

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

export default function Home() {
  return (
    <div className="shell">
      <Rail />

      <main className="stage">
        {/* ══ 01 FRONT PAGE ══ */}
        <section className="band cream tex stain" id="s1">
          <div className="topbar">
            <span>A Developer&rsquo;s Log</span>
            <nav>
              <a href="#s3">Work</a>
              <a href="#s7">Notes</a>
              <a href="#s7">Photos</a>
              <a href="#s2">About</a>
              <a href="#s8">Contact</a>
            </nav>
            <span>Patna, India</span>
          </div>
          <hr className="rule-hair" />
          <h1 className="plate-name">The Ankit Times</h1>
          <div className="plate-meta">
            Vol. I, No. 1
            <br />
            Sep 18, 2026
          </div>
          <hr className="rule-thick" />

          <div className="front">
            <div>
              <p className="kick">Technology / People / Ideas</p>
              <h1>Building Things for a More Open Internet.</h1>
              <p className="by">By Ankit Sinha · Software Engineer</p>
              <p className="lede">
                From distributed systems to random side projects, I like understanding how things
                work and then building them slightly differently.
              </p>
            </div>

            <div className="portrait-wrap">
              <div className="photo">
                <Image
                  src="/ankit-sinha.png"
                  alt="Ankit Sinha"
                  fill
                  sizes="(max-width: 860px) 100vw, 40vw"
                  priority
                />
              </div>
              <p className="scribble">
                Just a guy
                <br />
                who likes
                <br />
                building things
                <br />— Ankit
              </p>
            </div>

            <div className="edition-col">
              <div className="edition">
                <h4>In This Edition</h4>
                <ol>
                  <li>
                    <b>01</b>About
                  </li>
                  <li>
                    <b>02</b>Projects
                  </li>
                  <li>
                    <b>03</b>Terminal
                  </li>
                  <li>
                    <b>04</b>F1
                  </li>
                  <li>
                    <b>05</b>Markets
                  </li>
                  <li>
                    <b>06</b>Contact
                  </li>
                </ol>
              </div>
              <p className="pullquote">
                “Same Bytes,
                <br />
                Stored Once.”
              </p>
            </div>
          </div>
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
