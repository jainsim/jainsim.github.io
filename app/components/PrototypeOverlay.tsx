"use client";

import { useEffect } from "react";
import { adjacentGalleryItems } from "@/data/projects";
import type { Project } from "@/data/projects";

type Props = {
  open: boolean;
  slug: string;
  url: string;
  title: string;
  onClose: () => void;
  onNavigate: (slug: string) => void;
};

// Root-relative base path; empty at the site root, keeping links domain-agnostic.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * Prev/next pager across the whole gallery (prototype included), mirroring the
 * case-study overlay's footer so the prototype pages between projects too.
 */
function GalleryPager({
  slug,
  onNavigate,
}: {
  slug: string;
  onNavigate: (slug: string) => void;
}) {
  const { prev, next } = adjacentGalleryItems(slug);

  const Link = ({ project: p, dir }: { project: Project; dir: "prev" | "next" }) => (
    <a
      href={`${BASE_PATH}/work/${p.slug}/`}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
          return;
        e.preventDefault();
        onNavigate(p.slug);
      }}
      className={`group flex min-h-[44px] flex-col justify-center gap-xxs rounded-sm py-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
        dir === "next" ? "items-end text-right" : "items-start text-left"
      }`}
    >
      <span className="font-mono text-mono-eyebrow uppercase text-mute transition-colors group-hover:text-ink">
        {dir === "prev" ? "← Previous" : "Next →"}
      </span>
      <span className="text-label-sm text-ink underline-offset-4 group-hover:underline">
        {p.title}
      </span>
    </a>
  );

  return (
    <nav aria-label="More projects" className="border-t border-hairline bg-canvas">
      <div className="mx-auto flex max-w-container items-center justify-between gap-lg px-lg py-md">
        {prev ? <Link project={prev} dir="prev" /> : <span />}
        {next ? <Link project={next} dir="next" /> : <span />}
      </div>
    </nav>
  );
}

/**
 * Full-screen live-prototype embed. Same top-bar language as the case-study
 * overlay (two quiet mono controls over a hairline, no boxes), the deployed app
 * in an iframe, and a matching prev/next pager along the bottom. The prototype
 * is same-origin in production (seema-jain.com/commissioning) and cross-origin
 * but frameable from local dev, so the absolute URL loads in both places.
 */
export default function PrototypeOverlay({
  open,
  slug,
  url,
  title,
  onClose,
  onNavigate,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    // Lock the page behind, matching the case-study overlay.
    window.lenis?.stop();
    document.documentElement.classList.add("lenis-stopped");
    window.addEventListener("keydown", onKey);
    return () => {
      window.lenis?.start();
      document.documentElement.classList.remove("lenis-stopped");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} live prototype`}
      data-lenis-prevent
      className="fixed inset-0 z-50 flex flex-col bg-canvas"
    >
      {/* Top bar - two quiet mono text controls over a hairline, no boxes */}
      <div className="border-b border-hairline bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex max-w-container items-center justify-between px-lg">
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm py-sm font-mono text-mono-eyebrow uppercase text-mute outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            ← Back to portfolio
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm py-sm font-mono text-mono-eyebrow uppercase text-mute outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            Close ✕
          </button>
        </div>
      </div>

      {/* The live app fills the space between the top bar and the pager. */}
      <iframe
        src={url}
        title={`${title} · live prototype`}
        className="min-h-0 w-full flex-1 border-0"
        loading="lazy"
      />

      <GalleryPager slug={slug} onNavigate={onNavigate} />
    </div>
  );
}
