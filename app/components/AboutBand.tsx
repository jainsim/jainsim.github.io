"use client";

import { useEffect, useRef } from "react";

/**
 * Full-width photo band closing the About section, spanning the whole content
 * width below both columns. Pre-treated file (slight desaturation baked in to
 * match the hero). One 2:1 master; CSS shows it as 3:1 on desktop and 2:1 on
 * narrow screens (object-fit: cover). Fades in with a 12px upward translate on
 * scroll into view; honors prefers-reduced-motion. See .about-band in
 * globals.css.
 */
export default function AboutBand() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.shown = "true";
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.dataset.shown = "true";
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure ref={ref} className="about-band" data-shown="false">
      <picture>
        <source
          type="image/webp"
          srcSet="/about/seema-installer-band.webp 1x, /about/seema-installer-band@2x.webp 2x"
        />
        <img
          src="/about/seema-installer-band.jpg"
          srcSet="/about/seema-installer-band@2x.jpg 2x"
          width={1160}
          height={580}
          alt="Seema Jain testing the installer app at a charging station on site"
          loading="lazy"
          decoding="async"
          className="about-band__img"
        />
      </picture>
      <figcaption className="eyebrow mt-sm text-mute">
        On site, testing the installer flow
      </figcaption>
    </figure>
  );
}
