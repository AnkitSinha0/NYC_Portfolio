# ankitsin.in — Architecture

**Ankit Sinha (Haunts) · personal site + brand · New York Times editorial treatment**

> Status: pre-build, brief locked. CV received. Remaining gaps are marked `TODO`.

---

## 1. Decisions already made

| Decision | Choice | Why |
|---|---|---|
| Domain | **This site is the apex `ankitsin.in`** | SEO goal is "search Ankit Sinha → ankitsin.in". Ranking authority accrues to the apex; a subdomain competes with it instead of feeding it. |
| Visual direction | **Variant C — the Hybrid** | Newsprint front page, scannable in ninety seconds; one press-black showpiece section (Markets). Comp: `design/styleframes.html`. |
| CP stats | Live, cached 24h, with static fallback | Fresh numbers without a runtime dependency on flaky third-party APIs. |
| Markets visual language | Each platform's own | Codeforces rank-colour ladder; LeetCode difficulty split and submission calendar. Every panel is a link out to the profile. |
| What Markets leads on | **Consistency, not rating** | The honest hierarchy: 64-day streak / 684 submissions / 131 solved as the headline figures; contest ratings (CF 655 Newbie, LC 1569) stated below at small size. A 655 in display type argues against him; a 64-day streak argues for him. Revisit once CF clears ~1400. |
| Creative/experimental work | Deferred | The Linux/terminal portfolio is out of scope for now. Keep subdomains free; do not link to it. |

## 1a. Subject facts (from CV — the only sanctioned source)

- **Name** Ankit Sinha · handle **Haunts** · `ankits0057@gmail.com` · +91-62873-74144
- **Title** Backend Engineer — Distributed Systems, Cloud Infrastructure
- **GitHub** `https://github.com/AnkitSinha0`
- **Education** MCA, IIT Patna (Jul 2026 – 2028, expected); BCA, Lovely Professional University, CGPA 9.86/10.0 (Aug 2023 – May 2026)
- **Experience** Software Developer Intern, Denthinkers Foundation (Nov 2025 – Apr 2026) — Razorpay donations with server-side HMAC-SHA256 verification, ₹1.5L+ processed; cookie-based JWT admin auth; 15 route handlers / 23 endpoints; 2,500+ monthly visits
- **Projects** HashVault (Go, Gin, Postgres, Redis, RabbitMQ, S3/MinIO — modular monolith, SHA-256 content-addressable dedup, two-token auth, presigned S3); Konnect (6 microservices, Socket.IO, Traefik, RabbitMQ + Kafka, AI moderation with Redis sliding-window)
- **Competitive programming** (as of 17 Sept 2026 — seeds `data/stats-fallback.json`):
  - LeetCode `Haunts_01` — 131 solved (easy 64, medium 63, hard 4), 4 attempting; 684 submissions in the past year; 75 active days; **max streak 64**; contest rating 1,569, top 29.13%, ranked 254,081/883,546 from 1 contest; badge: 50 Days Badge 2026; languages Java 129, Python3 2
  - Codeforces `Haunts` — rating 655, max 655, rank **Newbie**
  - AtCoder `Haunts` — **no rated contests. Omitted from the site entirely**; do not render an empty tile
- **Certification** Developing Back-End Apps with Node.js and Express — IBM/Coursera, Jan 2026
- **Volunteering** Project Intern, Srijan Mahila Vikash Manch, Chaibasa (Jul 2024)

Nothing outside this list may be asserted about him on the site.

## 2. Stack

- **Next.js 15, App Router, TypeScript** — server components render HTML at build time, which is what the SEO goal actually requires. A client-rendered SPA hands Google an empty div.
- **Tailwind CSS v4** with a hand-written token layer. Tailwind is plumbing; the newspaper look lives in CSS custom properties, not in utility soup.
- **MDX** for the writing section — articles are files, versioned in git, not a CMS.
- **Vercel** hosting. ISR for the stats route.
- **No UI component library.** shadcn/Radix would fight the design; every rounded card imported is a rule broken. Build the eight components this site needs.

### Rejected on purpose

Framer Motion as a dependency (CSS handles what's needed), a headless CMS (overhead for one author), a database (nothing is user-generated), three.js (the Linux-portfolio mistake, reprised).

## 3. Type system

NYT's actual faces (Cheltenham, Imperial, Franklin, Chelt Blackletter) are licensed and unavailable. Substitutes, all Google Fonts, self-hosted via `next/font` so there is no third-party request:

| Role | Face | Used for |
|---|---|---|
| Nameplate | **UnifrakturMaguntia** | The wordmark only — once per page, never body |
| Display / headlines | **Playfair Display** | Heds, section openers |
| Body | **Source Serif 4** | Running text, 65ch measure |
| Utility / kickers | **Libre Franklin** | All-caps kickers, bylines, folio, nav, labels |
| Condensed display | **Archivo Narrow** | The Markets section opener and its big figures only |

Scale: 12 / 13 / 15.5 / 19 / 24 / 38 / 84px. Nothing off-scale.

## 4. Information architecture

Newspaper sections, not app tabs. The metaphor has to survive a recruiter who ignores it.

```
/                     Front Page      — nameplate, lead story, portrait, Markets rail, directory
/work                 Work            — project index; the section that gets the most traffic
/work/[slug]          Work → article  — one project as a feature: problem, architecture, what broke
/markets              Markets         — CP ratings, live, with rating-over-time chart
/profile              Profile         — the About page; skills, education, experience as an index
/writing              Writing         — MDX posts; also feeds SEO with long-tail queries
/writing/[slug]       Writing → post
/letters              Letters         — contact; email, form, socials
/resume               Archive         — HTML résumé + PDF download, both crawlable
```

Nav is a real section bar with the current section underlined. No hamburger on desktop. No scroll-jacking. Every destination is a normal link with a real URL — that is the fix for the Linux portfolio's problem.

## 5. Component inventory

Eight shared components, plus three that exist only inside Markets. If a twelfth appears, question it.

**Shared**

1. `Nameplate` — blackletter wordmark + rules + folio line
2. `SectionBar` — nav with active-section underline
3. `Rule` — hairline / standard / thick; the single source of every horizontal line
4. `Kicker` — all-caps label above a hed
5. `Article` — hed + byline + body with optional drop cap, locked to 65ch
6. `ColumnGrid` — 1/2/3-column newspaper grid with hairline gutters, collapsing to one column under 820px
7. `Plate` — image or diagram with italic caption
8. `PressBand` — the tonal inversion wrapper. **Used exactly once, on `/markets`.** A second usage anywhere kills the effect; treat adding one as a design change, not a feature.

**Markets only**

9. `QuoteTile` — platform, handle, headline figure in tabular-nums, footer; the whole tile is an `<a>` to the profile
10. `RatingChart` — SVG line over Codeforces rank-colour bands (grey <1200, green 1200, cyan 1400, blue 1600, violet 1900, orange 2100, red 2400). Bands are the real CF colours at ~34% opacity so the white line stays dominant
11. `SubmissionCalendar` — 53×7 submission heatmap, five-step ink-to-paper ramp, plus the easy/medium/hard split bars and the streak figures. Clicks through to the LeetCode profile

## 6. Live stats pipeline

`lib/stats/` — one adapter per platform, one shared shape.

| Platform | Handle | Source | Fetches | Fragility |
|---|---|---|---|---|
| LeetCode | `Haunts_01` | `leetcode.com/graphql` — unofficial, undocumented | solved total + difficulty split, `userCalendar` → `submissionCalendar`, `streak`, `totalActiveDays`, `userContestRanking`, badges, language stats | Medium |
| Codeforces | `Haunts` | `api.codeforces.com/user.info` — official, documented | current + max rating, rank name | Low |
| AtCoder | — | — | **Not integrated.** No rated contests; revisit only if that changes | — |

LeetCode carries the section, so it gets the richer adapter. `user.rating` (the CF rating-history endpoint) is **not** called — with one contest there is no history to draw, and the rank ladder replaces the line chart until there is.

Shared shape:

```ts
type PlatformStats = {
  handle: string;
  profileUrl: string;
  rating: number | null;
  peak: number | null;
  solved: number | null;
  updatedAt: string;          // ISO
};

type CodeforcesStats = PlatformStats & {
  rank: string | null;        // "newbie" | "pupil" | …  → drives the ladder marker
};

type LeetCodeStats = PlatformStats & {
  byDifficulty: { easy: number; medium: number; hard: number };
  maxStreak: number | null;          // the headline figure
  activeDays: number | null;         // last 12 months
  submissions: number | null;        // last 12 months
  calendar: Record<string, number>;  // yyyy-mm-dd → submissions
  contest: { rating: number; topPercent: number; attended: number } | null;
};
```

Rules:

- A failed fetch **never** breaks the build or the page. It falls back to the last committed snapshot in `data/stats-fallback.json`, and the UI prints "as of &lt;date&gt;" rather than pretending the number is live.
- Revalidate every 86400s. A GitHub Action refreshes the fallback file weekly so the static floor never drifts far.
- LeetCode's GraphQL endpoint is unofficial and rejects requests without a browser-like `Referer`. Isolate that quirk in the adapter; the rest of the app must not know.
- The heatmap and rating chart are **server-rendered SVG / static markup**, not a charting library. No client JS ships for them.
- Every Markets panel is a link out to the live profile, so a stale number is one click from the real one.

## 7. SEO architecture — the second primary goal

The mechanism that makes Google link "Ankit Sinha" / "Haunts" to your profiles is **`sameAs` in a `Person` JSON-LD block**, on every page, identical.

```jsonc
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ankit Sinha",
  "alternateName": "Haunts",
  "url": "https://ankitsin.in",
  "jobTitle": "Backend Engineer",
  "email": "mailto:ankits0057@gmail.com",
  "alumniOf": [
    { "@type": "CollegeOrUniversity", "name": "Indian Institute of Technology Patna" },
    { "@type": "CollegeOrUniversity", "name": "Lovely Professional University" }
  ],
  "knowsAbout": ["Go", "Distributed Systems", "Cloud Infrastructure", "PostgreSQL", "Redis", "RabbitMQ", "Kafka", "AWS S3"],
  "image": "https://ankitsin.in/ankit-sinha.png",
  "sameAs": [
    "https://www.linkedin.com/in/ankit0sinha/",
    "https://x.com/Haunts_01",
    "https://www.instagram.com/haunts_01/",
    "https://leetcode.com/u/Haunts_01/",
    "https://codeforces.com/profile/Haunts",
    "https://atcoder.jp/users/Haunts",
    "https://github.com/AnkitSinha0"
  ]
}
```

Plus:

- `<title>` on home: `Ankit Sinha (Haunts) — Backend Engineer`. Both the name and the handle in the title tag, because both are target queries.
- One `<h1>Ankit Sinha</h1>` on the home page. The blackletter nameplate **is** that h1 — do not ship it as an image.
- The phrase "also known as Haunts" in visible body copy, not only in metadata. Google needs the alias corroborated in text.
- `app/sitemap.ts` and `app/robots.ts` — generated, not hand-written.
- OG + Twitter card images generated per route via `next/og`, so shared links render as a newspaper clipping.
- Per-project `SoftwareSourceCode` JSON-LD; per-post `BlogPosting` with `author` pointing at the same Person.
- Canonical URLs from one `NEXT_PUBLIC_SITE_URL` env var — never hard-coded.

**Off-site, and this matters as much as the code** (a checklist, not a build step): set the website field on GitHub, LinkedIn, LeetCode, Codeforces, AtCoder, X and Instagram to `https://ankitsin.in`. Reciprocal links are what turn `sameAs` from a claim into a verified cluster. Then submit the sitemap in Google Search Console and Bing Webmaster Tools.

**Performance is SEO.** Static HTML, self-hosted fonts, no layout shift from the nameplate, LCP under 1.5s. Budget: under 100KB of JS on the front page.

## 8. Accessibility and quality floor

WCAG AA contrast in both themes; visible focus rings (a hairline box, in keeping); `prefers-reduced-motion` respected; every image with real alt text; keyboard-navigable section bar; no text baked into images. Lighthouse ≥ 95 on all four categories, enforced in CI.

## 9. Build order

1. Tokens, fonts, `Rule`, `ColumnGrid` — the grid before anything sits on it
2. `Nameplate` + `SectionBar` + front page, static content
3. `/work` index and one full project page
4. SEO layer: metadata, JSON-LD, sitemap, OG images
5. `/profile` + `/resume` from the CV
6. Stats pipeline + `/markets`
7. `/writing` MDX + `/letters`
8. Lighthouse and a11y pass, deploy, Search Console

Ship after step 4. Everything after that is additive, and a live site starts accruing SEO age immediately.

## 10. Open items

- [x] ~~CV~~ — received; facts in §1a
- [x] ~~Styleframe choice~~ — variant C
- [x] ~~Portrait~~ — supplied; save to `public/ankit-sinha.png`, duotone to the ink palette for the centre column, keep the colour original for OG cards
- [x] ~~Ratings and solved counts~~ — in §1a
- [x] ~~AtCoder~~ — dropped
- [ ] Whether `/writing` ships at launch or stays hidden until there are two posts
- [ ] `10` and `12` class results — carry them onto `/profile`, or stop the education index at BCA?
