import {
  Old_Standard_TT,
  UnifrakturMaguntia,
  Playfair_Display,
  Source_Serif_4,
  Libre_Franklin,
  Archivo_Narrow,
  JetBrains_Mono,
  Caveat,
} from "next/font/google";

// Nameplates — the wordmark only. Never body text.
// Blackletter on every inner page and /markets…
export const blackletter = UnifrakturMaguntia({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-blackletter",
  display: "swap",
});

// …and a 19th-century newspaper face on the front page, where the
// name has to read at a glance.
export const nameplate = Old_Standard_TT({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-nameplate",
  display: "swap",
});

// Display / headlines
export const display = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// Body copy
export const body = Source_Serif_4({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

// Kickers, bylines, folio, nav, labels
export const utility = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-utility",
  display: "swap",
});

// Condensed display — section openers, big figures, the F1 headline
export const condensed = Archivo_Narrow({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-condensed",
  display: "swap",
});

// Terminal, technical labels, coordinates, blueprint annotations
export const mono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// Margin notes and signatures — the handwriting in the margins
export const hand = Caveat({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
});

export const fontVariables = [
  blackletter.variable,
  nameplate.variable,
  display.variable,
  body.variable,
  utility.variable,
  condensed.variable,
  mono.variable,
  hand.variable,
].join(" ");
