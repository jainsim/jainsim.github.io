"use client";

import { useEffect } from "react";

type Props = {
  open: boolean;
  url: string;
  title: string;
  onClose: () => void;
};

/**
 * Full-screen live-prototype embed. Same top-bar language as the case-study
 * overlay (two quiet mono controls over a hairline, no boxes), but the body is
 * an iframe of the deployed app rather than a reading column. The prototype is
 * same-origin in production (seema-jain.com/commissioning) and cross-origin but
 * frameable from local dev, so the absolute URL loads in both places.
 */
export default function PrototypeOverlay({ open, url, title, onClose }: Props) {
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

      {/* The live app fills the remaining viewport height. */}
      <iframe
        src={url}
        title={`${title} · live prototype`}
        className="min-h-0 w-full flex-1 border-0"
        loading="lazy"
      />
    </div>
  );
}
