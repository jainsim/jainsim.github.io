"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Cuberto-style masked reveal, per word. Each word sits inside its own
 * inline-block overflow-hidden mask, so the paragraph wraps naturally at any
 * viewport width (no hard-coded line breaks). On scroll into view the words
 * slide up in a fast stagger. Honors prefers-reduced-motion.
 */

// The merged About statement — one paragraph, wraps responsively.
const STATEMENT =
  "Senior Product Designer turning complex enterprise data into clarity. " +
  "7+ years building B2B SaaS platforms, native mobile apps, design systems, " +
  "and end-to-end flows — most recently across EV infrastructure at " +
  "ChargePoint and The Mobility House.";

const WORDS = STATEMENT.split(" ");

export default function AboutReveal() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const words = root.querySelectorAll<HTMLElement>(".reveal-word");

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return; // copy is already visible in natural flow

    // Bulletproof: the copy is visible by default. Only at the moment the
    // section scrolls into view do we snap it below the mask and slide it up
    // (fromTo). If the trigger never fires, the text simply stays visible —
    // it can never be permanently hidden. IntersectionObserver is used (not
    // ScrollTrigger) so it's immune to page-height shifts from the stack.
    let played = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || played) return;
        played = true;
        io.disconnect();
        gsap.fromTo(
          words,
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 1.1,
            ease: "power4.out",
            stagger: { amount: 0.5 },
            onComplete: () => {
              gsap.set(words, { clearProps: "transform,will-change" });
            },
          }
        );
      },
      { threshold: 0.1 }
    );
    io.observe(root);

    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="mt-lg">
      <h2 className="max-w-4xl text-heading-lg text-ink">
        {WORDS.map((word, i) => (
          <span key={`${word}-${i}`}>
            <span className="inline-block overflow-hidden pb-[0.12em] align-top">
              <span className="reveal-word inline-block will-change-transform">
                {word}
              </span>
            </span>{" "}
          </span>
        ))}
      </h2>
    </div>
  );
}
