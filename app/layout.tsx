import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import SmoothScroll from "./components/SmoothScroll";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Seema Jain, Senior Product Designer",
  description:
    "Senior Product Designer turning complex enterprise data into clarity. B2B SaaS, native mobile, and design systems.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body suppressHydrationWarning className="bg-canvas text-ink antialiased">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
