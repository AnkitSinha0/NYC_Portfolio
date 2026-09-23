import type { Metadata } from "next";
import { HobbyPage } from "@/components/edition/HobbyPage";
import "@/styles/edition.css";

export const metadata: Metadata = {
  title: "Drawing",
  alternates: { canonical: "/drawing" },
};

export const revalidate = 3600;

export default function DrawingPage() {
  return <HobbyPage kind="drawing" />;
}
