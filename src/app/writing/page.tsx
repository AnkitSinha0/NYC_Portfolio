import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Kicker } from "@/components/Kicker";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on backend engineering and distributed systems, by Ankit Sinha.",
  alternates: { canonical: "/writing" },
};

// No posts yet. This stays a real, honest stub rather than lorem
// content — see ARCHITECTURE.md §10 for the open question on whether
// this section ships in nav before there's anything in it.
export default function WritingIndexPage() {
  return (
    <main className="mx-auto max-w-[1180px] w-full px-5 py-7 bg-paper text-ink">
      <PageHeader active="/writing" />

      <div className="mt-5 max-w-[560px] mx-auto text-center py-10">
        <Kicker accent className="text-center">
          Section V · Writing
        </Kicker>
        <h1 className="font-display font-bold text-[clamp(1.5rem,3.5vw,2rem)] leading-tight text-balance mb-3">
          Nothing Filed Yet
        </h1>
        <p className="font-body text-[14px] leading-[1.6] text-soft">
          The first piece runs here once it&rsquo;s written. In the meantime, the work is in{" "}
          <Link href="/work" className="text-ink underline decoration-1 underline-offset-4">
            Work
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
