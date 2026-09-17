import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Rule } from "@/components/Rule";
import { Kicker } from "@/components/Kicker";
import { PERSON } from "@/lib/site";

export const metadata: Metadata = {
  title: "Letters",
  description: "Get in touch with Ankit Sinha — email, or find him as Haunts on GitHub, LinkedIn, X, Instagram, LeetCode and Codeforces.",
  alternates: { canonical: "/letters" },
};

const DIRECTORY = [
  { label: "GitHub", handle: "AnkitSinha0", href: "https://github.com/AnkitSinha0" },
  { label: "LinkedIn", handle: "ankit0sinha", href: "https://www.linkedin.com/in/ankit0sinha/" },
  { label: "X", handle: "Haunts_01", href: "https://x.com/Haunts_01" },
  { label: "Instagram", handle: "haunts_01", href: "https://www.instagram.com/haunts_01/" },
  { label: "LeetCode", handle: "Haunts_01", href: "https://leetcode.com/u/Haunts_01/" },
  { label: "Codeforces", handle: "Haunts", href: "https://codeforces.com/profile/Haunts" },
];

export default function LettersPage() {
  return (
    <main className="mx-auto max-w-[1180px] w-full px-5 py-7 bg-paper text-ink">
      <PageHeader active="/letters" />

      <div className="mt-5 max-w-[560px] mx-auto text-center">
        <Kicker accent className="text-center">
          Letters
        </Kicker>
        <h1 className="font-display font-bold text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-balance mb-4">
          Get in Touch
        </h1>
        <p className="font-body text-[14px] leading-[1.6] mb-6">
          The fastest way to reach Ankit Sinha is email. For everything else — code, contests,
          the rest of it — he is Haunts.
        </p>

        <a
          href={`mailto:${PERSON.email}`}
          className="font-display font-bold text-[1.25rem] underline decoration-1 underline-offset-4"
        >
          {PERSON.email}
        </a>

        <Rule weight="hairline" className="my-7" />

        <Kicker className="text-center">Directory</Kicker>
        <ul className="list-none p-0 m-0 grid grid-cols-2 gap-x-6 gap-y-2 text-left max-w-[380px] mx-auto">
          {DIRECTORY.map((d) => (
            <li key={d.label} className="font-body text-[13px]">
              <a href={d.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {d.label}
              </a>
              <span className="text-soft"> · {d.handle}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
