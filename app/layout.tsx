import type { Metadata } from "next";
import { Open_Sans, Shadows_Into_Light_Two } from "next/font/google";
import SmoothScroll from "./components/SmoothScroll";
import "../styles/globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const handwritten = Shadows_Into_Light_Two({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: "400",
});

// Absolute-URL base for OG/Twitter tags. Domain-agnostic: set
// NEXT_PUBLIC_SITE_URL to override; defaults to the custom domain.
// All internal links stay root-relative.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://seema-jain.com";

const description =
  "Senior Product Designer turning complex enterprise data into clarity. B2B SaaS, native mobile, and design systems.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Seema Jain, Senior Product Designer",
  description,
  openGraph: {
    type: "website",
    title: "Seema Jain, Senior Product Designer",
    description,
    url: "/",
    images: ["/hero/misty-mountains.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Seema Jain, Senior Product Designer",
    description,
    images: ["/hero/misty-mountains.jpg"],
  },
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
      className={`${openSans.variable} ${handwritten.variable}`}
    >
      <body suppressHydrationWarning className="bg-canvas text-ink antialiased">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
