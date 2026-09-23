import type { Metadata } from "next";
import { HobbyPage } from "@/components/edition/HobbyPage";
import "@/styles/edition.css";

export const metadata: Metadata = {
  title: "Photography",
  alternates: { canonical: "/photography" },
};

export const revalidate = 3600;

export default function PhotographyPage() {
  return <HobbyPage kind="photography" />;
}
