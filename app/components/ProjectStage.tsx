"use client";

import Image from "next/image";
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

  return (
    <section
      ref={cardRef}
      data-slug={project.slug}
      style={
        {
          "--i": order,
          "--accent": project.accent,
          "--accent-text": project.accentText,
        } as React.CSSProperties
      }
      className="stack-card group mt-2xl flex flex-col overflow-hidden rounded-lg border border-hairline bg-canvas px-lg pb-md pt-lg shadow-[0_1px_1px_rgba(0,0,0,0.04)]"
    >
      {/* Tinted mat. Case studies show a screenshot and open the overlay; the
          prototype block shows a live, non-interactive embed and opens the
          full-screen prototype. Both are real links (crawlable / new-tab
          friendly) whose plain click is intercepted. */}
      <div className="flex flex-1 items-center justify-center">
        <a
          href={isPrototype ? project.href : `${BASE_PATH}/work/${project.slug}/`}
          {...(isPrototype ? { target: "_blank", rel: "noopener" } : {})}
          onClick={(e) => {
            // Let modified clicks / new-tab behave natively.
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
              return;
            e.preventDefault();
            if (isPrototype) onOpenPrototype();
            else onOpen(project.slug);
          }}
          aria-label={
            isPrototype
              ? `Launch ${project.title} live prototype`
              : `Open ${project.title} case study`
          }
          className="project-stage group/mat relative flex items-center justify-center overflow-hidden rounded-md border border-hairline outline-none transition-transform duration-200 focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-elevated active:scale-[0.99]"
        >
          <span className="project-shot absolute flex items-center justify-center">
            <Image
              src={project.hero.src}
              alt={project.title}
              width={project.hero.width}
              height={project.hero.height}
              sizes="(max-width: 768px) 90vw, 736px"
              loading="lazy"
              className="h-auto max-h-full w-auto max-w-full rounded-sm object-contain"
            />
          </span>
          {isPrototype ? (
            <>
              <span
                className="absolute left-md top-md inline-flex items-center gap-xs rounded-full border border-hairline bg-canvas/90 px-sm py-xxs font-mono text-mono-eyebrow uppercase backdrop-blur"
                style={{ color: "var(--accent-text)" }}
              >
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: "var(--accent)" }}
                />
                {project.label}
              </span>
              <span className="absolute bottom-md right-md rounded-full border border-hairline bg-canvas/90 px-sm py-xxs font-mono text-mono-eyebrow uppercase text-mute backdrop-blur transition-colors group-hover/mat:text-ink">
                Launch ↗
              </span>
            </>
          ) : null}
        </a>
      </div>

      {/* Caption row - index / title·(discipline|blurb) / year|Live */}
      <div className="mt-md flex w-full items-baseline justify-between gap-md pt-sm">
        <span
          className="shrink-0 font-mono text-mono-eyebrow"
          style={{ color: "var(--accent-text)" }}
        >
          {project.index}
        </span>
        <div className="text-center">
          <p className="text-label-sm text-ink">{project.title}</p>
          <p className="text-body-sm text-faint">
            {isPrototype ? project.blurb : project.discipline}
          </p>
        </div>
        {isPrototype ? (
          <span
            className="shrink-0 font-mono text-mono-eyebrow"
            style={{ color: "var(--accent-text)" }}
          >
            Live ↗
          </span>
        ) : (
          <span className="shrink-0 font-mono text-mono-eyebrow text-mute">
            {project.inProgress ? "In Progress" : `© ${project.year}`}
          </span>
        )}
      </div>
    </section>
  );
}
