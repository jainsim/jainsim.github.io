"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGlowSpring } from "../hooks/useGlowSpring";

/**
 * Scene 1 — dark cinematic Fjord hero.
 * Full-viewport misty-mountains image, three drifting mist layers,
 * spring-driven mouse glow, and a scroll-scrubbed camera push-in.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const mistRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glowRef = useGlowSpring<HTMLDivElement>();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Camera push-in on scroll
      gsap.to(imageRef.current, {
        scale: 1.15,
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Fade content out as we leave
      gsap.to(".hero-content", {
        opacity: 0,
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "60% top",
          scrub: true,
        },
      });

      // Infinite mist drift — different velocity per layer
      const drifts = [
        { x: 40, y: -20, d: 26 },
        { x: -30, y: 18, d: 34 },
        { x: 22, y: 26, d: 42 },
      ];
      mistRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          x: drifts[i].x,
          y: drifts[i].y,
          duration: drifts[i].d,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, sectionRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-fjord-ink"
    >
      <div ref={imageRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/hero/misty-mountains.jpg"
          alt="Misty fjord mountains"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-fjord-ink/40 via-fjord-ink/10 to-fjord-ink/85" />
      </div>

      {/* Mist layers */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          ref={(el) => {
            mistRefs.current[i] = el;
          }}
          className="mist-layer bg-gradient-to-tr from-transparent via-white/5 to-transparent blur-3xl"
        />
      ))}

      {/* Mouse glow */}
      <div ref={glowRef} className="absolute inset-0">
        <div className="mouse-glow" />
      </div>

      {/* Content */}
      <div className="hero-content relative z-10 mx-auto flex h-full max-w-container flex-col justify-between px-lg py-2xl">
        <div className="eyebrow text-fjord-mute">Portfolio — 2026</div>

        <div className="max-w-4xl pb-4xl">
          <h1 className="text-fjord-text text-display-hero">Seema Jain</h1>
          <p className="mt-lg max-w-xl text-body-lg text-fjord-mute">
            Senior Product Designer — turning complex enterprise data into
            clarity.
          </p>
        </div>

        <div className="flex items-center gap-sm text-fjord-mute">
          <span className="eyebrow">Scroll to explore</span>
          <span className="h-px w-16 bg-fjord-mute/50" />
        </div>
      </div>
    </section>
  );
}
