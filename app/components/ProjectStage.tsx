"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { Project } from "@/data/projects";

type Props = {
  project: Project;
  onOpen: (slug: string) => void;
  onOpenPrototype: () => void;
  onActive: (index: number) => void;
  order: number;
};

// Root-relative base path; empty at the site root, keeping links domain-agnostic.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * Card face per project - a hand-drawn illustration set flat on the card.
 * Keyed by slug because the illustrations and the "Northbeam" copy are the
 * design's own, distinct from the case-study data model. width/height are the
 * SVG's native size; swapping a file means updating both.
 */
type Face = {
  img: string;
  w: number;
  h: number;
  title: string;
  kind: string;
  desc: string;
  year: string;
  badge?: string;
  alt: string;
};

const FACE: Record<string, Face> = {
  "field-commissioning": {
    img: "/projects/selected-work/northbeam-illustration.svg",
    w: 291,
    h: 155,
    title: "Northbeam",
    kind: "Prototype, built in code",
    desc: "Offline-first field job flow. Queues, recovers, and shows what has not synced",
    year: "2026",
    badge: "Live prototype",
    alt: "Sketch of a robot writing code, sparkles, and a phone screen built from the result.",
  },
  installer: {
    img: "/projects/selected-work/installer-illustration.svg",
    w: 289,
    h: 120,
    title: "Installer App",
    kind: "Native mobile",
    desc: "Field commissioning without a deployment specialist",
    year: "2025",
    alt: "Sketch of three chargers with the same config, each checked off, leading to a Setup complete phone screen and an email.",
  },
  activation: {
    img: "/projects/selected-work/activation-illustration.svg",
    w: 289,
    h: 145,
    title: "Charging station activation",
    kind: "",
    desc: "From a specialist-led flow to a simple self-serve wizard for non-experts",
    year: "2025",
    alt: "Sketch of a team juggling three legacy systems, leading to a single numbered wizard with an Activate button.",
  },
  designgrid: {
    img: "/projects/selected-work/designgrid-illustration.svg",
    w: 289,
    h: 137,
    title: "DesignGrid",
    kind: "Design systems",
    desc: "One component library across web and mobile, 80% faster feature development",
    year: "2023-2024",
    alt: "Sketch of a phone setup wizard and a sites dropdown component reused in a desktop dashboard.",
  },
};

/**
 * One project in the sticky overlap-stack. Each card is pinned near the top
 * (position: sticky); as you scroll, the next card rises up and covers the
 * previous one while the pinned card zooms out and fades back (GSAP-scrubbed
 * - single scroll system). Every screenshot sits on the same fixed 16/10
 * tinted mat (object-contain, never cropped).
 */
export default function ProjectStage({
  project,
  onOpen,
  onOpenPrototype,
  onActive,
  order,
}: Props) {
  const isPrototype = project.kind === "prototype";
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Fuel-style zoom-out: covered cards keep receding as every later
      // card arrives - deeper cards end smaller, so strips read as depth.
      const nextCard = cardRef.current?.nextElementSibling;
      if (!prefersReduced && nextCard?.classList.contains("stack-card")) {
        // querySelectorAll, not a selector string - gsap.context(scope) would
        // scope ".stack-card" to this card's subtree and match nothing.
        const cards = Array.from(
          document.querySelectorAll<HTMLElement>(".stack-card")
        );
        const n = cards.length;
        const lastCard = cards[n - 1];
        const rootStyles = getComputedStyle(document.documentElement);
        const stackTop =
          parseFloat(rootStyles.getPropertyValue("--stack-top")) || 80;
        const peek =
          parseFloat(rootStyles.getPropertyValue("--stack-peek")) || 14;
        const lastPin = stackTop + (n - 1) * peek;
        const finalScale = 1 - 0.04 * (n - 1 - order);

        gsap.fromTo(
          cardRef.current,
          { scale: 1 },
          {
            scale: finalScale,
            transformOrigin: "center top",
            ease: "none",
            scrollTrigger: {
              trigger: nextCard,
              start: "top bottom",
              endTrigger: lastCard,
              end: "top " + lastPin,
              scrub: true,
            },
          }
        );
      }

      // Live "where am I" tracking for the sticky counter.
      ScrollTrigger.create({
        trigger: cardRef.current,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) onActive(order);
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, [onActive, order]);

  const face = FACE[project.slug];

  return (
    <section
      ref={cardRef}
      data-slug={project.slug}
      style={{ "--i": order } as CSSProperties}
      className="stack-card card"
    >
      {/* Stretched link: covers the whole card, so the card is one click target
          while the anchor keeps keyboard focus and crawlable href. */}
      <a
        className="card__link"
        href={`${BASE_PATH}/work/${project.slug}/`}
        onClick={(e) => {
          if (
            e.metaKey ||
            e.ctrlKey ||
            e.shiftKey ||
            e.altKey ||
            e.button !== 0
          )
            return;
          e.preventDefault();
          if (isPrototype) onOpenPrototype();
          else onOpen(project.slug);
        }}
        aria-label={
          isPrototype
            ? `Launch ${face.title} live prototype`
            : `Open ${face.title} case study`
        }
      />
      <div className="card__text">
        <div className="card__meta">
          {face.badge ? <span className="card__badge">{face.badge}</span> : null}
        </div>
        <h3 className="card__title">{face.title}</h3>
        {face.kind ? <div className="card__kind">{face.kind}</div> : null}
        <p className="card__desc">{face.desc}</p>
        <div className="card__foot">
          <span className="card__year">{face.year}</span>
        </div>
      </div>

      <div className="card__visual">
        <div className="illus">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={face.img}
            alt={face.alt}
            loading="lazy"
            width={face.w}
            height={face.h}
          />
        </div>
      </div>
    </section>
  );
}
