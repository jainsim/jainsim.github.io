"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { adjacentGalleryItems } from "@/data/projects";
import type { CaseImage, CaseSection, Project } from "@/data/projects";

type Props = {
  project: Project | null;
  onClose: () => void;
  onNavigate: (slug: string) => void;
};

// Root-relative base path; empty at the site root, keeping links domain-agnostic.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Prev/next pager linking to the adjacent case studies. */
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
    <nav aria-label="More projects" className="border-t border-hairline">
      <div className="mx-auto flex max-w-container items-center justify-between gap-lg px-lg py-lg">
        {prev ? <Link project={prev} dir="prev" /> : <span />}
        {next ? <Link project={next} dir="next" /> : <span />}
      </div>
    </nav>
  );
}

/** One screenshot in a bordered card with a quiet decision-caption below. */
function Figure({ image }: { image: CaseImage }) {
  // Landscape UI shots fill the column width; tall portrait/phone screens are
  // capped to the viewport height so they never overflow a laptop screen, and
  // the matte card hugs the image instead of stretching it. Phone screens in a
  // grid row share one width so long scroll captures keep the same scale.
  const isFull = image.layout === "full" || image.layout === "half";
  const isInline = (image.layout ?? "inline") === "inline";
  return (
    <figure className={`m-0 ${isFull ? "" : "flex flex-col items-center"}`}>
      <span
        className={`overflow-hidden rounded-xs border border-hairline bg-hairline-soft p-lg ${
          isFull ? "block" : isInline ? "block w-full" : "inline-block"
        }`}
        style={isInline && image.scale ? { width: `${image.scale * 100}%` } : undefined}
      >
        <Image
          src={image.src}
          alt={image.alt ?? image.caption ?? ""}
          width={image.width}
          height={image.height}
          sizes="(max-width: 768px) 100vw, 900px"
          className={`block ${
            isFull || isInline ? "h-auto w-full" : "h-auto w-auto max-h-[70vh] max-w-full"
          }`}
        />
      </span>
      {image.caption ? (
        <figcaption
          className={`mt-sm font-sans text-m3-body-sm leading-5 text-mute ${
            isFull ? "" : "max-w-sm text-center"
          }`}
        >
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/**
 * Renders a section's images in reading order. Consecutive "inline" phone
 * screens batch into a responsive grid; "wide"/"phone"/"full" images each get
 * their own centered row so the rhythm alternates group → single → group.
 */
function SectionImages({ images }: { images: CaseImage[] }) {
  const blocks: React.ReactNode[] = [];
  let run: CaseImage[] = [];

  const flushRun = (key: string) => {
    if (run.length === 0) return;
    // Six-column track, two per screen: every phone screen gets a third of the
    // row, and shorter runs are centred instead of stretching wider.
    const start = run.length === 1 ? "sm:col-start-3" : run.length === 2 ? "sm:col-start-2" : "";
    blocks.push(
      <div key={key} className="grid grid-cols-1 items-start gap-lg sm:grid-cols-6">
        {run.map((img, i) => (
          <div key={img.src} className={`sm:col-span-2 ${i === 0 ? start : ""}`}>
            <Figure image={img} />
          </div>
        ))}
      </div>,
    );
    run = [];
  };

  let pair: CaseImage[] = [];
  const flushPair = (key: string) => {
    if (pair.length === 0) return;
    // Landscape shots two across, each half the image column.
    blocks.push(
      <div key={key} className="grid grid-cols-1 items-start gap-lg sm:grid-cols-2">
        {pair.map((img) => (
          <Figure key={img.src} image={img} />
        ))}
      </div>,
    );
    pair = [];
  };

  images.forEach((img, i) => {
    if (img.layout === "half") {
      flushRun(`run-${i}`);
      pair.push(img);
      return;
    }
    flushPair(`pair-${i}`);
    if ((img.layout ?? "inline") === "inline") {
      run.push(img);
      return;
    }
    flushRun(`run-${i}`);
    const maxW =
      img.layout === "full" ? "max-w-none" : img.layout === "phone" ? "max-w-[300px]" : "max-w-md";
    blocks.push(
      <div key={img.src} className={`mx-auto w-full ${maxW}`}>
        <Figure image={img} />
      </div>,
    );
  });
  flushRun("run-final");
  flushPair("pair-final");

  return <div className="mt-xl flex flex-col gap-xl">{blocks}</div>;
}

function BulletList({ items, className }: { items: string[]; className: string }) {
  return (
    <ul className={`${className} flex flex-col gap-sm`}>
      {items.map((p) => (
        <li key={p} className="flex gap-sm text-m3-body-lg text-body">
          <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-mute" />
          <span>{p}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Renders body copy, splitting blank-line-separated text into paragraphs.
 * The first paragraph can take a distinct `leadClassName` so a section opens
 * with a darkened lead before settling into body-coloured copy.
 * A paragraph opening with `**Label:**` renders that label as an ink run-in,
 * and a paragraph made only of `- ` lines renders as a bullet list.
 */
function Prose({
  text,
  className,
  leadClassName,
}: {
  text: string;
  className: string;
  leadClassName?: string;
}) {
  const paragraphs = text.split(/\n\n+/);
  return (
    <>
      {paragraphs.map((p, i) => {
        const lines = p.split("\n");
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <BulletList key={i} items={lines.map((l) => l.slice(2))} className="mt-md" />
          );
        }
        const base = i === 0 ? leadClassName ?? className : className;
        const runIn = p.match(/^\*\*(.+?)\*\*\s*/);
        return (
          // later paragraphs swap the caller's top margin for the paragraph gap
          <p key={i} className={i === 0 ? base : `mt-md ${base.replace(/(^|\s)mt-\S+/g, "")}`}>
            {runIn ? (
              <>
                <span className="font-medium text-ink">{runIn[1]}</span>{" "}
                {p.slice(runIn[0].length)}
              </>
            ) : (
              p
            )}
          </p>
        );
      })}
    </>
  );
}

/**
 * Same-origin live prototype. Its own page background, intro line, padding and
 * drop shadow are stripped, and the frame fills the iframe so it sits flat on
 * the mat like the screenshots.
 */
const EMBED_CSS =
  "html,body{background:transparent!important}.concept{display:none!important}.stage,.stage>:not(.concept){height:100%;max-width:none!important;padding:0!important}.frame{height:100%!important;min-height:0!important;box-shadow:none!important}";

function EmbedFrame({ src, title, height }: { src: string; title: string; height: number }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const flatten = () => {
    const doc = ref.current?.contentDocument;
    if (!doc?.head || doc.getElementById("embed-flat")) return;
    const style = doc.createElement("style");
    style.id = "embed-flat";
    style.textContent = EMBED_CSS;
    doc.head.appendChild(style);
  };
  // The iframe can finish loading before hydration attaches onLoad.
  useEffect(() => {
    if (ref.current?.contentDocument?.readyState === "complete") flatten();
  });
  return (
    <iframe
      ref={ref}
      src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}`}
      title={title}
      // 600px tall on narrow screens, the configured height from 640px up
      className="block h-[600px] w-full bg-transparent sm:h-[min(var(--embed-h),70vh)]"
      style={{ "--embed-h": `${height}px` } as CSSProperties}
      onLoad={flatten}
    />
  );
}

/** Intro under the hero: summary + key results left, project facts right. */
function IntroBlock({ intro }: { intro: NonNullable<Project["intro"]> }) {
  return (
    // Columns stretch to one height; result rows share the left column's
    // spare height so its last row lands level with the facts column.
    <section className="mt-2xl grid gap-2xl md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-3xl">
      <div className="flex flex-col">
        {intro.body.split(/\n\n+/).map((para, i) => (
          <p key={i} className={`text-m3-body-lg text-ink${i ? " mt-md" : ""}`}>
            {para.split(/\*\*(.+?)\*\*/).map((s, j) =>
              j % 2 ? (
                <strong key={j} className="font-semibold">
                  {s}
                </strong>
              ) : (
                s
              ),
            )}
          </p>
        ))}
        <dl className="mt-md flex flex-1 flex-col">
          {intro.results.map((r) => (
            <div
              key={r.value}
              className="flex flex-1 items-center justify-between gap-lg border-b border-hairline py-lg last:border-b-0 last:pb-0"
            >
              <dt className="flex items-center gap-sm !text-m3-title-lg font-semibold text-ink">
                {r.value}
                {r.badge ? (
                  <span className="rounded-xs border border-hairline px-xs py-xxs text-m3-title-sm text-mute">
                    {r.badge}
                  </span>
                ) : null}
              </dt>
              <dd className="max-w-[50%] text-right text-m3-body-md text-body">{r.label}</dd>
            </div>
          ))}
        </dl>
      </div>
      <dl className="flex flex-col gap-lg border-t border-hairline pt-lg md:border-t-0 md:pt-0">
        {intro.facts.map((f) => (
          <div key={f.label}>
            <dt className="text-m3-title-sm text-ink">{f.label}</dt>
            <dd className="mt-xxs whitespace-pre-line text-m3-body-md text-body">
              {f.href ? (
                <a
                  href={f.href}
                  onClick={(e) => {
                    // Scroll inside the overlay; skip the hash so routing stays put.
                    e.preventDefault();
                    document
                      .querySelector(f.href!)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="border-b border-ink pb-px font-medium text-ink transition-opacity hover:opacity-70"
                >
                  {f.value}
                </a>
              ) : (
                f.value
              )}
            </dd>
          </div>
        ))}
      </dl>
      {intro.image ? (
        <figure className="col-span-full mt-2xl overflow-hidden rounded-xs border border-hairline bg-hairline-soft p-lg md:p-xl md:col-span-full">
          <Image
            src={intro.image.src}
            alt={intro.image.alt}
            width={intro.image.width}
            height={intro.image.height}
            sizes="(max-width: 768px) 100vw, 1000px"
            className="h-auto w-full"
          />
        </figure>
      ) : null}
    </section>
  );
}

// Each slide holds, then dissolves into the next (ease-out).
const SLIDE_HOLD_MS = 2500;
const SLIDE_FADE_MS = 500;

/** Index that advances every hold + fade while autoplay is on. Reduced
    motion starts it off; a single image never cycles. */
function useSlideCycle(count: number) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(count > 1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAuto(false);
  }, []);

  useEffect(() => {
    if (!auto) return;
    const t = window.setTimeout(
      () => setActive((i) => (i + 1) % count),
      SLIDE_HOLD_MS + SLIDE_FADE_MS,
    );
    return () => window.clearTimeout(t);
  }, [active, auto, count]);

  return { active, setActive, setAuto };
}

/** Stack of same-ratio images; only the active one is visible. */
function CrossfadeImages({
  images,
  active,
  sizes,
}: {
  images: { src: string; width: number; height: number; alt: string }[];
  active: number;
  sizes: string;
}) {
  const first = images[0];
  return (
    <div className="relative w-full" style={{ aspectRatio: `${first.width}/${first.height}` }}>
      {images.map((im, i) => (
        <Image
          key={im.src}
          src={im.src}
          alt={im.alt}
          width={im.width}
          height={im.height}
          sizes={sizes}
          aria-hidden={i !== active}
          className="absolute inset-0 h-full w-full object-contain ease-out"
          style={{ opacity: i === active ? 1 : 0, transition: `opacity ${SLIDE_FADE_MS}ms` }}
        />
      ))}
    </div>
  );
}

/** Numbered rows: the screen on a mat, its title and copy beside it. */
function FeatureRows({ features }: { features: NonNullable<CaseSection["features"]> }) {
  return (
    // Same outer width as the other section blocks, so the heading lines up with them.
    <div className="mx-auto max-w-5xl">
      <h3 className="mt-xl max-w-3xl para-header !text-m3-headline-sm">
        {features.heading}
      </h3>
      <ol className="mt-md flex flex-col gap-2xl">
        {features.items.map((it, i) => (
          <FeatureRow key={it.title} item={it} n={i + 1} />
        ))}
      </ol>
    </div>
  );
}

function FeatureRow({
  item,
  n,
}: {
  item: NonNullable<CaseSection["features"]>["items"][number];
  n: number;
}) {
  const { active } = useSlideCycle(item.images.length);
  return (
    <li className="grid items-center gap-lg md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-2xl">
      <figure>
        <div className="flex items-center overflow-hidden md:min-h-[200px] rounded-xs border border-hairline bg-hairline-soft p-lg md:p-xl">
          <CrossfadeImages
            images={item.images}
            active={active}
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>
        {item.caption ? (
          <figcaption className="mt-sm font-sans text-m3-body-sm leading-5 text-body">
            {item.caption}
          </figcaption>
        ) : null}
      </figure>
      <div className="flex gap-xs">
        <span className="text-m3-body-lg font-semibold text-ink">{n}.</span>
        <div>
          <p className="text-m3-body-lg font-semibold text-ink">{item.title}</p>
          <Prose text={item.body} className="mt-xxs text-m3-body-lg text-body" />
        </div>
      </div>
    </li>
  );
}

/** Crossfading image sequence on a mat, with its steps listed beside it;
    the step for the showing image is highlighted. Steps are buttons, so the
    sequence can be stepped by hand; reduced motion turns autoplay off. */
function SlideSequence({ slides }: { slides: NonNullable<CaseSection["slides"]> }) {
  const { items } = slides;
  const { active, setActive, setAuto } = useSlideCycle(items.length);

  const first = items[0];
  return (
    <div className="grid items-center gap-xl overflow-hidden rounded-xs border border-hairline bg-hairline-soft p-lg md:grid-cols-2 md:gap-2xl md:p-2xl">
      <div
        className="relative mx-auto w-full max-w-[400px] overflow-hidden rounded-xs border border-hairline"
        style={{ aspectRatio: `${first.width}/${first.height}` }}
      >
        {items.map((sl, i) => (
          <Image
            key={sl.src}
            src={sl.src}
            alt={sl.alt}
            width={sl.width}
            height={sl.height}
            sizes="400px"
            aria-hidden={i !== active}
            className="absolute inset-0 h-full w-full ease-out"
            style={{
              opacity: i === active ? 1 : 0,
              transition: `opacity ${SLIDE_FADE_MS}ms`,
            }}
          />
        ))}
      </div>
      <div>
        <h3 className="para-header !text-m3-headline-sm">{slides.title}</h3>
        {slides.caption ? (
          <p className="mt-xs text-m3-body-md italic text-body">{slides.caption}</p>
        ) : null}
        <ol className="mt-lg flex flex-col gap-sm">
          {items.map((sl, i) => (
            <li key={sl.src} className="flex gap-xs text-m3-body-lg">
              <span className={i === active ? "font-semibold text-ink" : "text-body"}>{i + 1}.</span>
              <button
                type="button"
                aria-current={i === active ? "step" : undefined}
                onClick={() => {
                  setAuto(false);
                  setActive(i);
                }}
                className={`rounded-sm text-left outline-none transition-colors duration-300 ease-out focus-visible:ring-2 focus-visible:ring-link ${
                  i === active ? "font-semibold text-ink" : "text-body hover:text-ink"
                }`}
              >
                {sl.step}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** Line drawing of a charging station with its cable and plug, used as
    quiet corner marks on the question mat. */
function ChargerDoodle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="40" y="6" width="34" height="60" rx="6" />
      <path d="M60 18l-8 14h9l-8 14" />
      <path d="M57 66v14c0 8-6 12-14 12H30c-6 0-9-4-9-10v-16" />
      <rect x="13" y="50" width="16" height="16" rx="3" />
      <path d="M13 55H5M13 61H5" />
    </svg>
  );
}

/** One case-study section: reading column of copy + wider image column. */
function SectionBlock({ section: s }: { section: CaseSection }) {
  const callouts = [...(s.callout ? [s.callout] : []), ...(s.callouts ?? [])];
  return (
    <section id={s.id} className={s.id ? "scroll-mt-3xl" : undefined}>
      <div className="mx-auto max-w-5xl">
        <h2 className="max-w-3xl para-header !text-m3-headline-sm md:!text-m3-headline-lg">{s.heading}</h2>
        {s.label ? (
          <p className="mt-xs font-sans text-m3-body-sm uppercase text-mute">{s.label}</p>
        ) : null}
        {s.body ? (
          <Prose
            text={s.body}
            leadClassName="mt-md max-w-3xl text-m3-body-lg text-ink"
            className="mt-md max-w-3xl text-m3-body-lg text-body"
          />
        ) : null}

        {s.sub ? (
          <>
            <h3 className={`${s.body ? "mt-xl" : "mt-md"} max-w-3xl para-header !text-m3-headline-sm`}>{s.sub.heading}</h3>
            <Prose text={s.sub.body} className="mt-sm max-w-3xl text-m3-body-lg text-body" />
          </>
        ) : null}

        {s.metrics ? (
          <dl className="mt-xl grid grid-cols-1 gap-lg border-y border-hairline py-lg sm:grid-cols-3">
            {s.metrics.map((m) => (
              <div key={m.label}>
                <dt className="para-header !text-m3-headline-sm">{m.value}</dt>
                <dd className="mt-xxs text-m3-body-md text-mute">{m.label}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {s.points ? <BulletList items={s.points} className="mt-lg max-w-3xl" /> : null}

        {callouts.map((c, i) => (
          <aside key={i} className="mt-xl rounded-md border border-hairline bg-elevated p-lg">
            {c.label ? (
              <p className="font-sans text-m3-body-sm uppercase text-mute">{c.label}</p>
            ) : null}
            <Prose text={c.body} className="mt-sm text-m3-body-lg text-body" />
          </aside>
        ))}
      </div>

      {s.slides ? (
        <div className="mx-auto mt-xl max-w-5xl">
          <SlideSequence slides={s.slides} />
        </div>
      ) : null}

      {s.features ? <FeatureRows features={s.features} /> : null}

      {s.decision ? (
        <aside className="mx-auto mt-2xl max-w-5xl rounded-md border border-hairline bg-elevated p-lg">
          <p className="font-sans text-m3-body-sm uppercase text-mute">Design decision</p>
          <Prose text={s.decision} className="mt-sm text-m3-body-lg text-body" />
        </aside>
      ) : null}

      {s.subsAfter?.map((sub, i) =>
        sub.quote ? (
          <blockquote
            key={i}
            className="relative mx-auto mt-2xl max-w-5xl overflow-hidden rounded-xs border border-hairline bg-hairline-soft px-lg py-3xl md:py-4xl"
          >
            <ChargerDoodle className="absolute -right-xs top-md hidden w-20 text-mute opacity-50 sm:block" />
            <ChargerDoodle className="absolute -left-xs bottom-md hidden w-20 text-mute opacity-50 sm:block" />
            <p className="para-header relative mx-auto max-w-2xl !text-m3-headline-sm md:!text-m3-headline-md">
              {sub.quote}
            </p>
            {sub.quoteBy ? (
              <footer className="relative mx-auto mt-md max-w-2xl text-m3-body-md text-body">
                {sub.quoteBy}
              </footer>
            ) : null}
          </blockquote>
        ) : (
        <div key={i} className={`mx-auto ${sub.tight ? "mt-xs" : "mt-xl"} max-w-5xl`}>
          {sub.heading ? (
            <h3
              className={`max-w-3xl para-header ${sub.headingLarge ? "!text-m3-headline-md" : "!text-m3-headline-sm"}`}
            >
              {sub.heading}
            </h3>
          ) : null}
          {sub.body ? (
            <Prose
              text={sub.body}
              className={`mt-sm max-w-3xl text-body text-m3-body-lg${sub.bodyLarge ? " !text-m3-title-lg" : ""}`}
            />
          ) : null}
          {(() => {
            const list = sub.items ? (
              <dl
                className={
                  sub.itemsCols === 3
                    ? "mt-lg grid gap-x-2xl gap-y-lg text-center sm:grid-cols-3"
                    : "mt-md grid gap-x-2xl gap-y-lg sm:grid-cols-2"
                }
              >
                {sub.items.map((it) => (
                  <div key={it.title}>
                    <dt className="text-m3-body-lg font-semibold text-ink">{it.title}</dt>
                    <dd className="mt-xxs text-m3-body-lg text-body">{it.body}</dd>
                    {it.tag ? (
                      <dd className="mt-xs text-m3-title-sm text-mute">{it.tag}</dd>
                    ) : null}
                  </div>
                ))}
              </dl>
            ) : null;
            // Three-up items sit inside the image mat so the whole group shares one background.
            const inMat = sub.itemsCols === 3;
            return (
              <>
                {sub.image ? (
                  <div className="mt-md overflow-hidden rounded-xs border border-hairline bg-hairline-soft p-lg md:p-xl">
                    <Image
                      src={sub.image.src}
                      alt={sub.image.alt}
                      width={sub.image.width}
                      height={sub.image.height}
                      sizes="(max-width: 768px) 100vw, 768px"
                      className="h-auto w-full"
                    />
                    {inMat ? list : null}
                  </div>
                ) : null}
                {sub.video ? (
                  <div className="mt-md overflow-hidden rounded-xs border border-hairline bg-hairline-soft p-lg md:p-xl">
                    <video
                      src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${sub.video.src}`}
                      width={sub.video.width}
                      height={sub.video.height}
                      aria-label={sub.video.label}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="h-auto w-full"
                    />
                  </div>
                ) : null}
                {inMat ? null : list}
              </>
            );
          })()}
        </div>
        ),
      )}


      {s.images ? (
        <div className="mx-auto max-w-5xl">
          <SectionImages images={s.images} />
        </div>
      ) : null}

      {s.embed ? (
        <>
          <figure className="mx-auto mt-xl max-w-5xl">
            {/* Same bordered mat as the screenshots */}
            <span className="block overflow-hidden rounded-xs border border-hairline bg-hairline-soft p-lg">
              <EmbedFrame src={s.embed.src} title={s.embed.title} height={s.embed.height} />
            </span>
            {s.embed.caption ? (
              <figcaption className="mt-sm font-sans text-m3-body-sm leading-5 text-mute">
                {s.embed.caption}
              </figcaption>
            ) : null}
          </figure>
          {s.embed.after ? (
            <div className="mx-auto mt-xl max-w-3xl">
              <Prose text={s.embed.after} className="text-m3-body-lg text-body" />
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  );
}

/**
 * Full-screen cinematic case-study overlay. Opened by URL (?project=slug) so
 * every project is deep-linkable. Text-rich, single hero image; the data model
 * accepts an image array for richer galleries later.
 */
export default function CaseStudyOverlay({ project, onClose, onNavigate }: Props) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    // Pause Lenis so the page behind can't scroll (avoids a second scrollbar);
    // Lenis.stop() adds the .lenis-stopped class that locks overflow.
    window.lenis?.stop();
    document.documentElement.classList.add("lenis-stopped");
    // Jump to the top when opening or switching between case studies.
    document.querySelector('[role="dialog"]')?.scrollTo(0, 0);
    window.addEventListener("keydown", onKey);
    return () => {
      window.lenis?.start();
      document.documentElement.classList.remove("lenis-stopped");
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} case study`}
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
            ← All work
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

      <article className="mx-auto max-w-container px-lg pb-4xl pt-2xl">
        {project.headline ? (
        <header className="flex items-start justify-between gap-lg">
          <h1 className="max-w-3xl para-header !text-m3-headline-md md:!text-m3-display-sm">{project.headline}</h1>
          {project.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.logo.src}
              alt={project.logo.alt}
              width={40}
              height={40}
              className="h-10 w-10 shrink-0"
            />
          ) : null}
        </header>
        ) : (
        <header className="max-w-3xl">
          <p className="eyebrow text-mute">
            {project.discipline ? `${project.discipline} · ` : ""}{project.org}
            {project.inProgress ? " · In Progress" : ` · ${project.year}`}
          </p>
          <h1 className="mt-md para-header !text-m3-headline-md md:!text-m3-display-sm">
            {project.title}
          </h1>
          <p className="mt-lg text-m3-body-lg text-body">{project.subtitle}</p>
          {project.introNote ? (
            <p className="mt-sm text-m3-body-sm text-mute">
              {project.introNote.text}{" "}
              <a
                href={project.introNote.href}
                onClick={(e) => {
                  // Scroll inside the overlay; skip the hash so routing stays put.
                  e.preventDefault();
                  document
                    .querySelector(project.introNote!.href)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="border-b border-ink pb-px font-medium text-ink transition-opacity hover:opacity-70"
              >
                {project.introNote.linkLabel}
              </a>
            </p>
          ) : null}
        </header>
        )}

        {/* Meta strip */}
        {project.intro ? null : (
        <dl className="mt-2xl grid grid-cols-2 gap-lg border-y border-hairline py-lg md:grid-cols-4">
          {project.meta.map((m) => (
            <div key={m.label}>
              <dt className="font-sans text-m3-body-sm uppercase text-mute">
                {m.label}
              </dt>
              <dd className="mt-xxs text-m3-title-sm text-ink">{m.value}</dd>
            </div>
          ))}
        </dl>
        )}

        {/* Hero image - rendered at its true ratio so nothing crops.
            Portrait heroes (phone screenshots) sit centered on the mat at a
            phone-scale width instead of stretching the full column. */}
        {project.overlayHeroPhones ? (
          <div className="mt-2xl overflow-hidden rounded-xs border border-hairline bg-hairline-soft p-lg">
            <div className="hero-phones py-xl">
              {project.overlayHeroPhones.map((p) => (
                <div key={p.src} className="device device--full">
                  <div
                    className="device__screen"
                    style={{ "--ar": `${p.width}/${p.height}` } as CSSProperties}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.src} alt={p.alt} width={p.width} height={p.height} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : project.overlayHeroFramed ? (
          <div className="mt-2xl overflow-hidden rounded-xs border border-hairline bg-hairline-soft p-lg">
            <span className="framed-shot mx-auto !w-[65%]">
              <Image
                src={(project.overlayHero ?? project.hero).src}
                alt={project.title}
                width={(project.overlayHero ?? project.hero).width}
                height={(project.overlayHero ?? project.hero).height}
                priority
                sizes="(max-width: 1200px) 100vw, 1000px"
              />
            </span>
          </div>
        ) : (
          (() => {
            const hero = project.overlayHero ?? project.hero;
            const isPortrait = hero.height > hero.width;
            return (
              <div className="mt-2xl overflow-hidden rounded-xs border border-hairline bg-hairline-soft p-lg">
                <Image
                  src={hero.src}
                  alt={project.title}
                  width={hero.width}
                  height={hero.height}
                  priority
                  sizes={isPortrait ? "(max-width: 768px) 60vw, 360px" : "(max-width: 1200px) 100vw, 1200px"}
                  className={
                    isPortrait
                      ? "mx-auto h-auto w-[60%] max-w-[360px] py-2xl"
                      : "h-auto w-full"
                  }
                />
              </div>
            );
          })()
        )}

        {project.intro ? <IntroBlock intro={project.intro} /> : null}

        {/* Sections - copy in a narrow reading column, images breathe wider */}
        <div className="mt-3xl flex flex-col gap-3xl">
          {project.sections.map((s) => (
            <SectionBlock key={s.heading} section={s} />
          ))}
        </div>

      </article>

      <ProjectPager slug={project.slug} onNavigate={onNavigate} />
    </div>
  );
}
