/** Drawn plates for the Beyond the Stack teasers — each desk in its own ink. */
export function HobbyArt({ kind }: { kind: "photography" | "drawing" | "gaming" }) {
  if (kind === "photography") {
    return (
      <svg viewBox="0 0 240 150" className="hobby-art photo" aria-hidden="true">
        <rect x="0" y="0" width="240" height="150" className="ground" />
        {/* contact-sheet frames */}
        {[0, 1, 2].map((i) => (
          <rect key={i} x={18 + i * 72} y="112" width="60" height="26" className="frame" />
        ))}
        {/* camera */}
        <g className="ink">
          <rect x="70" y="34" width="100" height="62" rx="5" />
          <rect x="82" y="26" width="26" height="10" rx="2" />
          <circle cx="120" cy="65" r="21" />
          <circle cx="120" cy="65" r="12" />
          <circle cx="155" cy="45" r="3" />
        </g>
      </svg>
    );
  }
  if (kind === "drawing") {
    return (
      <svg viewBox="0 0 240 150" className="hobby-art sketch" aria-hidden="true">
        <rect x="0" y="0" width="240" height="150" className="ground" />
        <g className="graphite">
          {/* a mountain study, as the old site's notes promised */}
          <path d="M14,122 L64,56 L90,86 L128,34 L176,98 L198,76 L228,122" />
          <path d="M122,42 L128,34 L136,46 L130,44 Z" />
          <path d="M20,128 C70,120 150,132 224,126" />
          <path d="M40,134 C90,130 140,138 210,134" className="light" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M${142 + i * 6},${60 + i * 7} l6,-8`} className="light" />
          ))}
        </g>
        <text x="226" y="20" textAnchor="end" className="sketch-no">No. 01</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 240 150" className="hobby-art game" aria-hidden="true">
      <rect x="0" y="0" width="240" height="150" className="ground" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={12 + i * 19} y="18" width="11" height="4" className="pix" style={{ opacity: 0.25 + ((i * 37) % 10) / 14 }} />
      ))}
      <g className="pad">
        <path d="M72,62 C58,62 50,80 48,100 C46,118 60,124 70,112 L84,96 L156,96 L170,112 C180,124 194,118 192,100 C190,80 182,62 168,62 Z" />
        <path d="M78,76 v16 M70,84 h16" className="btn-line" />
        <circle cx="160" cy="78" r="4" className="btn-dot" />
        <circle cx="170" cy="88" r="4" className="btn-dot alt" />
      </g>
      <text x="120" y="138" textAnchor="middle" className="press">PRESS START</text>
    </svg>
  );
}
