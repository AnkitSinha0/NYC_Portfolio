/**
 * Which desk each page sits on. Five desks over fifteen pages, dealt
 * by hand so each desk appears three times and neighbouring pages
 * (a section and its articles) rarely share one. The front page keeps
 * the dark grain.
 */
export type Desk = "" | "desk-navy" | "desk-bigben" | "desk-collage" | "desk-wall";

const DESKS: Record<string, Desk> = {
  "/": "",
  "/markets": "desk-collage",
  "/work": "desk-wall",
  "/work/hashvault": "desk-bigben",
  "/work/konnect": "desk-navy",
  "/engineering": "desk-navy",
  "/engineering/content-addressable-storage": "",
  "/engineering/message-driven-chat": "desk-collage",
  "/engineering/token-rotation": "desk-wall",
  "/engineering/payment-verification": "desk-bigben",
  "/writing": "desk-bigben",
  "/profile": "",
  "/photography": "desk-navy",
  "/drawing": "desk-collage",
  "/gaming": "desk-wall",
  "/404": "",
};

// Pages added later without an entry get dealt one from their path.
const DECK: Desk[] = ["desk-navy", "desk-bigben", "desk-collage", "desk-wall", ""];

export function deskFor(path: string): Desk {
  if (path in DESKS) return DESKS[path];
  let h = 0;
  for (const c of path) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return DECK[h % DECK.length];
}
