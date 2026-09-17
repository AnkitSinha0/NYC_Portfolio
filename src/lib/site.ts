export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ankitsin.in";

export const PERSON = {
  name: "Ankit Sinha",
  alternateName: "Haunts",
  jobTitle: "Backend Engineer",
  email: "ankits0057@gmail.com",
  sameAs: [
    "https://www.linkedin.com/in/ankit0sinha/",
    "https://github.com/AnkitSinha0",
    "https://x.com/Haunts_01",
    "https://www.instagram.com/haunts_01/",
    "https://leetcode.com/u/Haunts_01/",
    "https://codeforces.com/profile/Haunts",
  ],
} as const;

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PERSON.name,
    alternateName: PERSON.alternateName,
    url: SITE_URL,
    jobTitle: PERSON.jobTitle,
    email: `mailto:${PERSON.email}`,
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Indian Institute of Technology Patna" },
      { "@type": "CollegeOrUniversity", name: "Lovely Professional University" },
    ],
    knowsAbout: [
      "Go",
      "Distributed Systems",
      "Cloud Infrastructure",
      "PostgreSQL",
      "Redis",
      "RabbitMQ",
      "Apache Kafka",
      "AWS S3",
    ],
    sameAs: PERSON.sameAs,
  };
}
