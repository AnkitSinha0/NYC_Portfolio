import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PressBand } from "@/components/markets/PressBand";
import { QuoteTile } from "@/components/markets/QuoteTile";
import { RatingLadder } from "@/components/markets/RatingLadder";
import { SubmissionCalendar } from "@/components/markets/SubmissionCalendar";
import { getMarketsStats } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Markets",
  description:
    "Ankit Sinha's competitive-programming practice — LeetCode submission streak, difficulty split, and Codeforces rating, updated daily.",
  alternates: { canonical: "/markets" },
};

export const revalidate = 86400;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

export default async function MarketsPage() {
  const { leetcode, codeforces, isFallback } = await getMarketsStats();
  const asOf = formatDate(leetcode.updatedAt);

  return (
    <main className="mx-auto max-w-[1180px] w-full px-5 py-7 bg-paper text-ink">
      <PageHeader active="/markets" />

      <PressBand>
        <div className="flex flex-wrap justify-between items-baseline gap-4 border-b border-press-ink pb-2">
          <p className="m-0 text-[9.5px] font-bold tracking-[0.18em] uppercase">Section II · Markets</p>
          <span className="text-[9.5px] tracking-[0.14em] uppercase text-press-soft">
            {isFallback ? `As of ${asOf} (cached)` : `As of ${asOf}`} · updated daily
          </span>
        </div>

        <h1 className="font-condensed font-bold uppercase leading-[0.86] tracking-tight my-3.5 text-[clamp(2.75rem,9.2vw,6.5rem)] [transform:scaleX(0.88)] origin-left">
          Practice
        </h1>
        <p className="font-body text-[13.5px] leading-[1.55] text-[#c6bfb1] max-w-[62ch] mb-6">
          Sixty-four consecutive days is the figure worth leading on. The contest ratings are
          early — one rated round on each platform — and this page states them plainly rather
          than dressing them up. Every panel opens the live profile.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-press-ink border-b border-press-hair">
          <QuoteTile
            href={leetcode.profileUrl}
            label="Longest streak"
            sub="Consecutive days solving"
            value={String(leetcode.maxStreak ?? "—")}
            foot={`${leetcode.activeDays ?? "—"} active days, 1 yr`}
          />
          <QuoteTile
            href={leetcode.profileUrl}
            label="Submissions"
            sub="Past twelve months"
            value={String(leetcode.submissions ?? "—")}
            foot="Java 129 · Python 2"
          />
          <QuoteTile
            href={leetcode.profileUrl}
            label="Problems solved"
            sub="LeetCode, all time"
            value={String(leetcode.solved ?? "—")}
            foot="4 in progress"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] border-b border-press-hair">
          <a
            href={leetcode.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block py-5 md:py-6 md:pr-5 border-t md:border-t-0 border-press-hair"
          >
            <h2 className="text-[9.5px] font-bold tracking-[0.18em] uppercase m-0 mb-0.5">
              The year, day by day
            </h2>
            <p className="text-[9px] tracking-[0.12em] uppercase text-press-soft mb-3.5">
              LeetCode submission calendar
            </p>
            <SubmissionCalendar
              calendar={leetcode.calendar}
              ariaLabel={`Submission calendar: ${leetcode.submissions} submissions across ${leetcode.activeDays} active days, with a ${leetcode.maxStreak}-day streak`}
            />
            <p className="font-body italic text-[11px] leading-[1.4] text-press-soft mt-2.5">
              The shape is the argument: a quiet stretch, then a {leetcode.maxStreak}-day run that
              has not really stopped.
            </p>

            <hr className="border-t border-press-hair my-4" />

            <h2 className="text-[9.5px] font-bold tracking-[0.18em] uppercase m-0 mb-0.5">
              By difficulty
            </h2>
            <p className="text-[9px] tracking-[0.12em] uppercase text-press-soft mb-3.5">
              Bars scaled to his own best count, not to the catalogue
            </p>
            <DifficultyBars byDifficulty={leetcode.byDifficulty} />
          </a>

          <div className="py-5 md:py-6 md:pl-5 border-t md:border-t-0 md:border-l border-press-hair">
            <h2 className="text-[9.5px] font-bold tracking-[0.18em] uppercase m-0 mb-0.5">
              Contest ratings
            </h2>
            <p className="text-[9px] tracking-[0.12em] uppercase text-press-soft mb-3.5">
              One rated round each · stated, not spun
            </p>

            <a href={codeforces.profileUrl} target="_blank" rel="noopener noreferrer" className="block">
              <RatingLadder
                rating={codeforces.rating ?? 0}
                maxRating={codeforces.maxRating ?? 0}
                handle={codeforces.handle}
              />
            </a>

            <hr className="border-t border-press-hair my-4" />

            {leetcode.contest && (
              <a href={leetcode.profileUrl} target="_blank" rel="noopener noreferrer" className="block">
                <h3 className="text-[9.5px] font-bold tracking-[0.18em] uppercase m-0">
                  LeetCode contest
                </h3>
                <div className="font-condensed font-bold text-[2.1rem] leading-none tabular-nums mt-1.5">
                  {Math.round(leetcode.contest.rating).toLocaleString()}
                </div>
                <p className="text-[9px] tracking-[0.12em] uppercase text-press-soft mt-1.5">
                  Top {leetcode.contest.topPercent}% · {leetcode.contest.globalRanking.toLocaleString()}{" "}
                  ranked · {leetcode.contest.attended} contest
                  {leetcode.contest.attended === 1 ? "" : "s"}
                </p>
              </a>
            )}

            <hr className="border-t border-press-hair my-4" />

            <h3 className="text-[9.5px] font-bold tracking-[0.18em] uppercase m-0">Badge</h3>
            <p className="text-[9px] tracking-[0.12em] uppercase text-press-soft mt-1.5">
              50 Days Badge, 2026
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-3 pt-3 text-[9.5px] tracking-[0.16em] uppercase text-press-soft">
          <span>Sources: LeetCode GraphQL · Codeforces API</span>
          <span>AtCoder omitted — no rated contests yet</span>
        </div>
      </PressBand>
    </main>
  );
}

function DifficultyBars({
  byDifficulty,
}: {
  byDifficulty: { easy: number; medium: number; hard: number };
}) {
  const max = Math.max(byDifficulty.easy, byDifficulty.medium, byDifficulty.hard, 1);
  const rows = [
    { label: "Easy", n: byDifficulty.easy, color: "#4FB39B" },
    { label: "Medium", n: byDifficulty.medium, color: "#C99A2E" },
    { label: "Hard", n: byDifficulty.hard, color: "#C2564F" },
  ];
  return (
    <div>
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[8px_1fr_auto] gap-2 items-center mb-2.5">
          <i className="w-2 h-2 block" style={{ background: r.color }} />
          <div className="h-[3px] bg-[#2c2822] relative">
            <div
              className="absolute inset-y-0 left-0"
              style={{ width: `${(r.n / max) * 100}%`, background: r.color }}
            />
          </div>
          <span className="tabular-nums text-[10.5px] text-[#c6bfb1]">{r.n}</span>
        </div>
      ))}
      <p className="text-[9px] tracking-[0.12em] uppercase text-press-soft m-0">
        Easy · Medium · Hard
      </p>
    </div>
  );
}
