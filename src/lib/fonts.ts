import {
  UnifrakturMaguntia,
  Playfair_Display,
  Source_Serif_4,
  Libre_Franklin,
  Archivo_Narrow,
} from "next/font/google";

// Nameplate — the wordmark only. Never body text.
export const nameplate = UnifrakturMaguntia({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-nameplate",
  display: "swap",
});

// Display / headlines
export const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Body copy
export const body = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Kickers, bylines, folio, nav, labels — all-caps utility face
export const utility = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-utility",
  display: "swap",
});

// Condensed display — Markets section opener and its big figures only
export const condensed = Archivo_Narrow({
  weight: ["600", "700"],
  subsets: ["latin"],
  variable: "--font-condensed",
  display: "swap",
});

export const fontVariables = [
  nameplate.variable,
  display.variable,
  body.variable,
  utility.variable,
  condensed.variable,
].join(" ");
