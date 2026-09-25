/**
 * Which desk each page sits on. The front page keeps the dark grain;
 * every other page is dealt one of three desks from its path, so the
 * publication varies page to page but a page never changes under you.
 */
export type Desk = "" | "desk-navy" | "desk-print";

const DECK: Desk[] = ["desk-navy", "desk-print", ""];

// Pinned: the Coding Exchange's aged sheet belongs on aged newsprint.
const PINNED: Record<string, Desk> = { "/": "", "/markets": "desk-print" };

export function deskFor(path: string): Desk {
  if (path in PINNED) return PINNED[path];
  let h = 0;
  for (const c of path) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return DECK[h % DECK.length];
}
