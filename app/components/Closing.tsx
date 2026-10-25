import Testimonials from "./Testimonials";

/**
 * About band → Contact/CTA band → footer. Static server component -
 * quiet, ink-on-white, generous vertical rhythm per the Geist system.
 */
export default function Closing() {
  return (
    <>
      {/* About */}
      <section
        id="about"
        className="border-t border-hairline bg-canvas"
      >
        <div className="mx-auto max-w-container px-lg py-section">
          <h2 className="para-header !text-m3-headline-sm md:!text-m3-headline-lg">About me</h2>
          <div className="mt-2xl max-w-3xl">
            {[
              [
                "Where it started",
                "Before UX, I was a fashion consultant at Tommy Hilfiger, Kenneth Cole and Emporio Armani. The clothes were the easy part. The real work was asking the right questions until I understood someone\u2019s personality. Swap the wardrobe for a product workflow, and that\u2019s still my process.",
              ],
              [
                "What I\u2019ve built",
                "Most recently at ChargePoint, I turned a 5-day specialist process into a 4-minute self-serve activation flow. Before that, I co-led DesignGrid at The Mobility House, one design system behind four products. It started in Bengaluru, designing for 30,000+ women artisans and building a virtual try-on app with ML engineers.",
              ],
              [
                "How I work",
                "I\u2019m comfortable owning everything or bringing everyone in. Solo, I\u2019ve led 30+ interviews, run usability tests, and QA\u2019d every dev build myself. With a team, I facilitate the workshops where product, engineering, and business make the big calls.",
              ],
              [
                "Outside of work",
                "I\u2019m usually somewhere in the Alps, chasing a new trail or a quiet spot for yoga. I\u2019ve also just started learning German.",
              ],
            ].map(([heading, body], i) => (
              <div key={heading} className={i ? "mt-xl" : undefined}>
                <h3 className="para-header !text-m3-headline-sm">{heading}</h3>
                <p className="mt-sm text-m3-body-lg text-body">{body}</p>
              </div>
            ))}
          </div>

          {/* Photo wall - polaroids, faces other than mine blurred */}
          <ul className="photo-wall mt-3xl">
            {[
              ["stylist-years", "the stylist years", "Seema with a colleague outside a luxury store during her fashion styling years", "50% 30%"],
              ["field-testing", "field testing", "Seema and colleagues testing at a ChargePoint fast charger", "50% 45%"],
              ["workshop-day", "workshop day", "Seema facilitating a workshop with the product team", "50% 60%"],
              ["site-visit", "site visit", "Seema on a site visit at a wall charger in a parking garage", "50% 40%"],
            ].map(([file, caption, alt, pos]) => (
              <li key={file} className="photo-wall__card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/about/wall/${file}.jpg`}
                  alt={alt}
                  loading="lazy"
                  decoding="async"
                  className="photo-wall__img"
                  style={{ objectPosition: pos }}
                />
                <p className="photo-wall__caption">{caption}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What it's like to work with me */}
      <Testimonials />

      {/* CTA / Contact */}
      <section id="contact" className="border-t border-hairline bg-canvas">
        <div className="mx-auto max-w-container px-lg py-3xl text-center">
          <h2 className="mx-auto max-w-3xl para-header !text-m3-headline-lg md:!text-m3-display-sm">
            Got a gnarly problem worth solving?
          </h2>
          <p className="mx-auto mt-md max-w-xl text-m3-body-lg text-body">
            Senior Product Designer, open to IC roles.
            <br />
            Based in Salzburg, EU Blue Card holder, open to relocation.
          </p>
          <div className="mt-2xl flex flex-wrap items-center justify-center gap-md">
            <a
              href="mailto:seemasam2113@gmail.com"
              className="rounded-pill border border-transparent bg-ink px-lg py-sm text-m3-body-lg font-medium text-on-primary transition-colors hover:bg-black"
            >
              Get in touch
            </a>
            <a
              href="/seema-jain-resume.pdf"
              target="_blank"
              rel="noopener"
              className="rounded-pill border border-hairline bg-elevated px-lg py-sm text-m3-body-lg font-medium text-ink transition-colors hover:bg-hairline-soft"
            >
              Resume
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-hairline bg-canvas">
        <div className="mx-auto flex max-w-container flex-col items-start justify-between gap-md px-lg py-lg md:flex-row md:items-center">
          <div className="flex flex-col items-start gap-xs sm:flex-row sm:items-center sm:gap-md">
            <span className="text-m3-title-sm font-semibold text-ink">
              Seema Jain
            </span>
            <span className="font-sans text-m3-body-sm text-mute">
              <span className="hidden sm:inline">· </span>© 2026 · Salzburg, AT
            </span>
            <span className="font-sans text-m3-body-sm text-mute/70">
              V1.0
            </span>
          </div>
          <a
            href="https://www.linkedin.com/in/seema-sampathraj/"
            target="_blank"
            rel="noopener"
            className="font-sans text-m3-body-sm text-mute transition-colors hover:text-ink"
          >
            LinkedIn ↗
          </a>
        </div>
      </footer>
    </>
  );
}
