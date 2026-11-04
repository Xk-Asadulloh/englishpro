import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EnglishPro — Ingliz tilini ishonch bilan o'rganing",
  description: "Video darslar va bosqichma-bosqich ingliz tili platformasi."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="uz"><body>{children}</body></html>;
}
