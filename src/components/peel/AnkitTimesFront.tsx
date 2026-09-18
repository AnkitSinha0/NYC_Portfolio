import Image from "next/image";

/**
 * The Ankit Times front page — unchanged content from the original
 * design, extracted so it can sit inside the peelable newspaper
 * layer. Fills its container; the peel stage owns the sizing.
 */
export function AnkitTimesFront() {
  return (
    <div className="band cream tex stain" style={{ height: "100%", overflow: "hidden" }}>
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
    </div>
  );
}
