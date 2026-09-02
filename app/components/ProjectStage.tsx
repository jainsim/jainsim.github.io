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
 * Card face per project - the approved device-frame design (selected-work/work.html).
 * Keyed by slug because the device-ready screenshots and the "Northbeam" copy are
 * the design's own, distinct from the case-study data model. `--ar` is the image's
 * pixel width/height; swapping a file means updating both `ar` and width/height.
 */
type Face = {
  device: "phone" | "laptop";
  img: string;
  ar: string;
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
    device: "phone",
    img: "/projects/selected-work/northbeam.jpg",
    ar: "720/1558",
    w: 720,
    h: 1558,
    title: "Northbeam",
    kind: "Coded prototype",
    desc: "A working prototype. Handles a failed session, loses connection, recovers. Built in code, not Figma.",
    year: "2026",
    badge: "Live prototype",
    alt: "Northbeam home screen with Install and Service task tiles, a supported-hardware note, and a list of installation guides.",
  },
  installer: {
    device: "phone",
    img: "/projects/selected-work/installer-app.jpg",
    ar: "720/1512",
    w: 720,
    h: 1512,
    title: "Installer App",
    kind: "Native mobile",
    desc: "Designing for one free hand: an app for electricians commissioning hardware in the field",
    year: "2025",
    alt: "Device setup progress screen confirming two stations were set up, each showing MAC address, serial number and model.",
  },
  activation: {
    device: "laptop",
    img: "/projects/selected-work/station-activation.jpg",
    ar: "1560/998",
    w: 1560,
    h: 998,
    title: "Station Activation Flow",
    kind: "Enterprise workflow",
    desc: "Modernising an activation workflow inside a legacy enterprise platform, four times",
    year: "2025",
    alt: "Charging management console with an activate-stations banner, a 70 percent activation progress bar, and a station table showing pending, online and offline states.",
  },
  designgrid: {
    device: "laptop",
    img: "/projects/selected-work/designgrid.jpg",
    ar: "1560/1192",
    w: 1560,
    h: 1192,
    title: "DesignGrid",
    kind: "Design systems",
    desc: "The design system that had to survive a native field app and an enterprise console at once",
    year: "2023-2024",
    alt: "Placeholder: replace with a DesignGrid screen.",
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
  const index = `(0${order + 1})`;

  return (
    <section
      ref={cardRef}
      data-slug={project.slug}
      style={{ "--i": order } as CSSProperties}
      className="stack-card card"
    >
      <div className="card__text">
        <div className="card__meta">
          <span className="card__index">{index}</span>
          {face.badge ? <span className="card__badge">{face.badge}</span> : null}
        </div>
        <h3 className="card__title">{face.title}</h3>
        <div className="card__kind">{face.kind}</div>
        <p className="card__desc">{face.desc}</p>
        {/* Whole card is not a link; this footer link is the only interactive
            target. Case studies open the overlay; the prototype opens its
            full-screen embed. Real href stays crawlable / new-tab friendly. */}
        <div className="card__foot">
          <a
            className="card__link"
            href={
              isPrototype ? project.href : `${BASE_PATH}/work/${project.slug}/`
            }
            {...(isPrototype ? { target: "_blank", rel: "noopener" } : {})}
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
          >
            View project
          </a>
          <span className="card__year">{face.year}</span>
        </div>
      </div>

      <div className="card__visual">
        <div className="stage">
          <div
            className={`device ${
              face.device === "phone" ? "device--phone" : "device--laptop"
            }`}
          >
            <div className="device__screen" style={{ "--ar": face.ar } as CSSProperties}>
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
        </div>
      </div>
    </section>
  );
}
