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

const META = [
  { label: "Role", value: "Design & build" },
  { label: "Year", value: "2026" },
  { label: "Domain", value: "EV charging · Field tool" },
  { label: "Built with", value: "React · TypeScript · Vite" },
];

const FLOW = [
  ["Scan and pair", "scan the charger barcode to pair it with the app."],
  ["Required steps", "wiring, network and location must be added. Everything else is optional."],
  ["Failure and recovery", "one station fails to upload. Remove it and finish setup with the rest."],
  ["Owner details", "add the charger owner’s details now, or skip."],
];

const NEXT_STEPS = [
  ["Progress bar", "shows how many steps exist, how many are done and how many are left."],
  ["Offline sync", "stations commission without signal and sync to ChargePoint when the network returns."],
];

/** Prev/next pager - identical to the case-study overlay's. */
function ProjectPager({
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
      <span className="font-sans text-m3-body-sm uppercase text-mute transition-colors group-hover:text-ink">
        {dir === "prev" ? "← Previous" : "Next →"}
      </span>
      <span className="text-m3-title-sm text-ink underline-offset-4 group-hover:underline">
        {p.title}
      </span>
    </a>
  );

  return (
    <nav aria-label="More projects" className="mt-3xl border-t border-hairline pt-2xl">
      <div className="flex items-center justify-between gap-lg">
        {prev ? <Link project={prev} dir="prev" /> : <span />}
        {next ? <Link project={next} dir="next" /> : <span />}
      </div>
    </nav>
  );
}

function BulletList({ items }: { items: string[][] }) {
  return (
    <ul className="mt-lg flex flex-col gap-sm">
      {items.map(([label, body]) => (
        <li key={label} className="flex gap-sm text-m3-body-lg text-body">
          <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-mute" />
          <span>
            <strong className="font-medium text-ink">{label}:</strong> {body}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Northbeam presents as a real case-study page - same structure and styling as
 * the written case studies (scroll container, sticky top bar, header + meta,
 * hero, sections, prev/next) - but the hero is the live app embedded in
 * ?embed=1 "bare" mode, so the portfolio carries the write-up and the embed is
 * just the running prototype.
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
    window.lenis?.stop();
    document.documentElement.classList.add("lenis-stopped");
    document.querySelector('[data-proto-dialog]')?.scrollTo(0, 0);
    window.addEventListener("keydown", onKey);
    return () => {
      window.lenis?.start();
      document.documentElement.classList.remove("lenis-stopped");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const embedUrl = `${url}${url.includes("?") ? "&" : "?"}embed=1`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} case study`}
      data-proto-dialog
      data-lenis-prevent
      className="fixed inset-0 z-50 overflow-y-auto bg-canvas"
    >
      {/* Top bar - two quiet mono text controls over a hairline, no boxes */}
      <div className="sticky top-0 z-10 border-b border-hairline bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex max-w-container items-center justify-between px-lg">
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm py-sm font-sans text-m3-body-sm uppercase text-mute outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            ← Back to portfolio
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm py-sm font-sans text-m3-body-sm uppercase text-mute outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            Close ✕
          </button>
        </div>
      </div>

      <article className="mx-auto max-w-container px-lg pb-section pt-2xl">
        <header className="max-w-3xl">
          <p className="eyebrow text-mute">Coded prototype · Independent · 2026</p>
          <h1 className="mt-md text-m3-headline-lg text-ink md:text-m3-display-sm">
            Northbeam
          </h1>
          <p className="mt-lg text-m3-body-lg text-body">
            A coded prototype of an app for installing a charging station.
          </p>
          <p className="mt-sm text-m3-body-sm text-mute">
            Northbeam is a fictional brand and all station data is invented. Not shipped work.
          </p>
        </header>

        {/* Meta strip */}
        <dl className="mt-2xl grid grid-cols-2 gap-lg border-y border-hairline py-lg md:grid-cols-4">
          {META.map((m) => (
            <div key={m.label}>
              <dt className="font-sans text-m3-body-sm uppercase text-mute">{m.label}</dt>
              <dd className="mt-xxs text-m3-title-sm text-ink">{m.value}</dd>
            </div>
          ))}
        </dl>

        {/* Hero - the live app, embedded bare, in a phone frame. */}
        <div className="mt-2xl overflow-hidden rounded-xs border border-hairline bg-hairline-soft p-lg">
          <div className="flex flex-col items-center py-xl">
            <div className="w-[340px] max-w-full overflow-hidden rounded-[34px] bg-[#1f242b] p-[10px] shadow-[0_30px_60px_-24px_rgba(11,15,20,0.45)]">
              <iframe
                src={embedUrl}
                title="Northbeam live prototype"
                className="block h-[680px] w-full rounded-[26px] border-0 bg-white"
                loading="lazy"
              />
            </div>
            <p className="mt-lg font-sans text-m3-body-sm text-mute">
              Live prototype - tap Install to walk the flow.
            </p>
          </div>
        </div>

        {/* Sections - portfolio reading column */}
        <div className="mt-3xl flex flex-col gap-3xl">
          <section className="mx-auto w-full max-w-3xl">
            <h2 className="para-header">Built for the field</h2>
            <p className="mt-md text-m3-body-lg text-body">
              Electricians work with gloves, glare and weak signal. I used big UI: large buttons
              and text, so it is easier to touch and read.
            </p>
          </section>

          <section className="mx-auto w-full max-w-3xl">
            <h2 className="para-header">Why I built it</h2>
            <p className="mt-md text-m3-body-lg text-body">
              I wanted to know what AI prototyping can do for a flow like that: it built the screens
              fast, but waiting and failure states still needed my design judgment.
            </p>
          </section>

          <section className="mx-auto w-full max-w-3xl">
            <h2 className="para-header">The flow</h2>
            <BulletList items={FLOW} />
          </section>

          <section className="mx-auto w-full max-w-3xl">
            <h2 className="para-header">Next steps</h2>
            <BulletList items={NEXT_STEPS} />
          </section>

          <section className="mx-auto w-full max-w-3xl">
            <h2 className="para-header">What I learned</h2>
            <p className="mt-md text-m3-body-lg text-body">
              A coded prototype exposes gaps a clickable flow hides, like the failed station and the
              offline case.
            </p>
          </section>
        </div>

        <ProjectPager slug={slug} onNavigate={onNavigate} />
      </article>
    </div>
  );
}
