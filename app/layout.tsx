import type { Metadata } from "next";
import "./globals.css";
import "./phase2.css";
import "./phase3.css";

export const metadata: Metadata = {
  title: {
    default: "Waylume Travel | Personalized Travel Planning",
    template: "%s | Waylume Travel",
  },
  description:
    "Discover flights, resorts, cruises, and vacation ideas with personalized support from Waylume Travel, an Independent Agent of Archer.",
  openGraph: {
    title: "Waylume Travel",
    description: "Travel discovery with personal advisor support.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
