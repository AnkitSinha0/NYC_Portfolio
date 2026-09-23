import type { Metadata } from "next";
import { HobbyPage } from "@/components/edition/HobbyPage";
import "@/styles/edition.css";

export const metadata: Metadata = {
  title: "Gaming",
  alternates: { canonical: "/gaming" },
};

export const revalidate = 3600;

export default function GamingPage() {
  return <HobbyPage kind="gaming" />;
}
