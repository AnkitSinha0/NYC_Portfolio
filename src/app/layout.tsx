import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { SITE_URL, personJsonLd } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ankit Sinha (Haunts) — Backend Engineer",
    template: "%s · Ankit Sinha",
  },
  description:
    "Ankit Sinha — also known as Haunts — is a backend engineer building distributed systems and cloud infrastructure in Go. HashVault, Konnect, and a daily competitive-programming practice.",
  authors: [{ name: "Ankit Sinha", url: SITE_URL }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Ankit Sinha",
    title: "Ankit Sinha (Haunts) — Backend Engineer",
    description:
      "Backend engineer building distributed systems and cloud infrastructure in Go.",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@Haunts_01",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} h-full`}>
      <body className="min-h-full flex flex-col">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
      </body>
    </html>
  );
}
