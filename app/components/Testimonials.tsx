"use client";

import { useEffect, useState } from "react";

/**
 * "What it's like to work with me" - a quiet horizontal marquee of reference
 * quotes, placed between About and the closing CTA.
 *
 * Layout: one full-bleed row (edge to edge, breaking out of the content column)
 * of all nine cards, drifting left at a slow linear pace. The card set is
 * duplicated and the track translates -50% for a seamless seam; the duplicate
 * set is aria-hidden so screen readers hear each quote once.
 *
 * Accessibility: pauses on hover and on keyboard focus within the section (see
 * .marquee-scope in globals.css). Under prefers-reduced-motion - or before
 * hydration / with JS off - it renders a static responsive grid in normal
 * document flow, all cards visible once. Only transform is animated.
 *
 * Attribution steps one shade darker than text-mute (to text-body, #4d4d4d) to
 * clear WCAG AA (4.5:1) on the canvas. Two cards are missing source data
 * (Heiko Bayer's title, Filipe Monteiro's company); the missing line is omitted
 * rather than invented - fill `title`/`company` in to restore them.
 */
type Quote = {
  quote: string;
  name: string;
  title?: string;
  company?: string;
};

const QUOTES: Quote[] = [
  {
    quote:
      "She doesn't stop at design execution. She actively engages through development and UAT, proactively identifying gaps and validating her work through real user testing. Her commitment to quality raised the bar for the entire UX team.",
    name: "Justin Cumming",
    title: "Director, User Experience & Industrial Design",
    company: "ChargePoint",
  },
  {
    quote:
      "She consistently prioritized the needs of our end users, creating intuitive solutions that simplified complex workflows. Thanks to her efforts, the ChargePilot Installer was a product we could confidently present to our customers.",
    name: "Carolin Rohleder",
    title: "Product Manager & Product Owner, Smart Charging",
    company: "The Mobility House",
  },
  {
    quote:
      "Seema's creativity and attention to detail elevated our ChargePilot and component library projects. Her thoughtful solutions and smooth collaboration made a significant impact.",
    name: "Radosław Szymański",
    title: "Front-end Developer",
    company: "The Mobility House",
  },
  {
    quote:
      "Seema excels at crafting intuitive designs and collaborating with developers and PMs to deliver high-quality results on time. She contributed actionable insights and embraced feedback with professionalism.",
    name: "Sushma Subramanyam",
    title: "Product Designer",
    company: "The Mobility House",
  },
  {
    quote:
      "Seema's work on the Installer App has been exceptional. Her flexibility, attention to detail, and ability to integrate feedback effectively contributed significantly to the project's success.",
    name: "Lukas Pinieck",
    title: "Teamlead, Commissioning & Rollout",
    company: "The Mobility House",
  },
];

/** "TITLE @ COMPANY", collapsing gracefully when a part is missing. */
function attribution(t: Quote): string {
  return [t.title, t.company].filter(Boolean).join(" @ ");
}

function Card({
  t,
  className = "",
  duplicate = false,
}: {
  t: Quote;
  className?: string;
  duplicate?: boolean;
}) {
  const line2 = attribution(t);
  return (
    <blockquote
      aria-hidden={duplicate || undefined}
      className={
        "flex flex-col rounded-lg border border-hairline bg-elevated p-lg shadow-[0_1px_1px_rgba(0,0,0,0.04)] " +
        className
      }
    >
      <p className="text-[length:clamp(1.0625rem,1.2vw+0.7rem,1.25rem)] font-normal leading-[1.45] tracking-[-0.01em] text-ink [text-wrap:pretty]">
        {t.quote}
      </p>
      <cite className="mt-auto block pt-lg font-mono text-mono-eyebrow uppercase not-italic tracking-normal text-body">
        <span className="block font-medium text-ink">{t.name}</span>
        {line2 && <span className="mt-xxs block">{line2}</span>}
      </cite>
    </blockquote>
  );
}

export default function Testimonials() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setMounted(true);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotion = () => setReduced(motion.matches);
    applyMotion();
    motion.addEventListener("change", applyMotion);
    return () => motion.removeEventListener("change", applyMotion);
  }, []);

  // Marquee only when hydrated and motion is welcome; otherwise a static grid in
  // normal flow (also the server-rendered / no-JS output, so cards never hide).
  const animate = mounted && !reduced;

  // Fixed-width cards (380px ≥768px, 300px below), equal height across the row,
  // static right margin so the -50% seam stays exact.
  const cardClass = "mr-lg w-[300px] shrink-0 md:w-[380px]";

  return (
    <section
      id="testimonials"
      className="overflow-x-clip border-t border-hairline bg-canvas py-section"
    >
      <div className="mx-auto max-w-container px-lg">
        <p className="eyebrow text-mute">What it&apos;s like to work with me</p>
      </div>

      {animate ? (
        <div
          className="marquee-scope mt-xl"
          style={{ "--marquee-duration": "120s" } as React.CSSProperties}
        >
          <div className="marquee-viewport">
            <div className="marquee-track items-stretch">
              {[...QUOTES, ...QUOTES].map((t, i) => (
                <Card
                  key={i}
                  t={t}
                  duplicate={i >= QUOTES.length}
                  className={cardClass}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto mt-xl grid max-w-container gap-lg px-lg sm:grid-cols-2 lg:grid-cols-3">
          {QUOTES.map((t) => (
            <Card key={t.name} t={t} />
          ))}
        </div>
      )}
    </section>
  );
}
