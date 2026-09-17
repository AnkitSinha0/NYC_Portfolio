import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Rule } from "@/components/Rule";
import { Kicker } from "@/components/Kicker";
import { PROJECTS, getProject } from "@/lib/projects";
import { PERSON, SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.dek,
    description: project.intro[0],
    alternates: { canonical: `/work/${slug}` },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.dek,
    description: project.intro[0],
    programmingLanguage: project.stack,
    url: `${SITE_URL}/work/${project.slug}`,
    author: { "@type": "Person", name: PERSON.name, url: SITE_URL },
  };

  return (
    <main className="mx-auto max-w-[1180px] w-full px-5 py-7 bg-paper text-ink">
      <PageHeader active="/work" />

      <article className="mt-5 max-w-[700px] mx-auto">
        <Kicker accent>{project.dek}</Kicker>
        <h1 className="font-display font-bold text-[clamp(1.75rem,4vw,2.75rem)] leading-tight text-balance mb-2">
          {project.title}
        </h1>
        <p className="text-[9.5px] tracking-[0.14em] uppercase text-soft mb-6">
          By Ankit Sinha · {project.byline}
        </p>

        <div className="font-body text-[14px] leading-[1.6] text-justify [hyphens:auto] space-y-4 first-of-type:first-letter:float-left first-of-type:first-letter:font-display first-of-type:first-letter:font-black first-of-type:first-letter:text-[3.05em] first-of-type:first-letter:leading-[0.82] first-of-type:first-letter:pr-[0.09em]">
          {[...project.intro, ...project.detail].map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <Rule weight="hairline" className="my-6" />

        <Kicker>Stack</Kicker>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 list-none p-0 m-0 font-utility text-[11px] tracking-[0.06em] uppercase text-soft">
          {project.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
