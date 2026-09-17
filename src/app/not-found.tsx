import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-[1180px] w-full px-5 py-7 bg-paper text-ink">
      <PageHeader active="/" />

      <div className="mt-5 max-w-[520px] mx-auto text-center py-14">
        <p className="text-[9.5px] font-bold tracking-[0.18em] uppercase text-red mb-2">
          Correction
        </p>
        <h1 className="font-display font-bold text-[clamp(1.5rem,3.5vw,2rem)] leading-tight text-balance mb-3">
          This Page Was Never Printed
        </h1>
        <p className="font-body text-[14px] leading-[1.6] text-soft mb-5">
          No edition ran the page you&rsquo;re looking for. Try the{" "}
          <Link href="/" className="text-ink underline decoration-1 underline-offset-4">
            front page
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
