"use client";

import { useEffect, useState } from "react";

/**
 * Thin top nav. Transparent over the dark hero, hairline light bar once
 * scrolled into the white body. Links stay inline at every breakpoint.
 */
// Root-relative base path; empty at the site root, keeping the link domain-agnostic.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        scrolled
          ? "border-b border-hairline bg-canvas/85 text-ink backdrop-blur"
          : "border-b border-transparent bg-transparent text-fjord-text"
      }`}
    >
      <nav className="mx-auto flex max-w-container items-center justify-between px-lg py-sm">
        <a
          href={`${BASE_PATH}/`}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
              return;
            e.preventDefault();
            // Clean root URL (no #top), close any open case study, scroll up.
            window.history.pushState({}, "", `${BASE_PATH}/`);
            window.dispatchEvent(new PopStateEvent("popstate"));
            if (window.lenis?.scrollTo) window.lenis.scrollTo(0);
            else window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-label-sm font-semibold"
        >
          Seema Jain
        </a>
        <div className="flex items-center gap-xs text-body-md">
          <a href="#work" className="rounded-pill px-sm py-xs hover:opacity-70">
            Work
          </a>
          <a href="#about" className="rounded-pill px-sm py-xs hover:opacity-70">
            About
          </a>
          <a
            href="mailto:seemasam2113@gmail.com"
            className="rounded-pill px-sm py-xs hover:opacity-70"
          >
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}
