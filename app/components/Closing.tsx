import AboutReveal from "./AboutReveal";
import AboutBand from "./AboutBand";
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
          <p className="eyebrow text-mute">About</p>
          <AboutReveal />
          <div className="mt-2xl max-w-2xl">
            <p className="text-body-lg text-body">
              On one side, apps used by electricians and technicians standing in
              front of a machine with bad signal and no patience. On the other,
              the operator console where someone in an office has to trust what
              the field just did.
            </p>
            <p className="mt-lg text-body-lg text-body">
              For five years that was EV charging: a native installer app, a
              station activation workflow inside a legacy enterprise platform,
              and the design system that had to hold both together. Most of it
              was modernisation rather than greenfield. Existing workflows, real
              users, real consequences, rebuilt without breaking for the people
              who depend on them.
            </p>
          </div>
        </div>

        {/* Origin story + facts, then a full-width photo band */}
        <div className="border-t border-hairline">
          <div className="mx-auto max-w-container px-lg py-4xl">
            <div className="grid gap-3xl md:grid-cols-2 md:gap-2xl">
              {/* Left - origin story */}
              <div>
                <p className="eyebrow text-mute">Before UX</p>
                <p className="mt-lg max-w-lg text-body-lg text-body">
                  Before UX, I was at Tommy Hilfiger, Kenneth Cole, Emporio
                  Armani, years on the floor as a fashion consultant, reading
                  what someone felt about a garment in the two seconds before
                  they said anything.
                </p>
                <p className="mt-md max-w-lg text-body-lg text-body">
                  Nobody on a shop floor tells you what&apos;s wrong. You watch
                  what they pick up and what they put back. That&apos;s still how
                  I work: I trust what I watch people do over what they say they
                  want.
                </p>
              </div>

              {/* Right - facts */}
              <div>
                <p className="eyebrow text-mute">At a glance</p>
                <dl className="mt-lg divide-y divide-hairline border-y border-hairline">
                  {[
                    ["Role", "Senior Product Designer, IC"],
                    ["Experience", "7+ years design, 5 in enterprise B2B SaaS"],
                    [
                      "Domains",
                      "EV charging and energy infrastructure, field service, regulated and safety-critical",
                    ],
                    [
                      "Products",
                      "Native iOS and Android, enterprise admin and back-office platforms, design systems",
                    ],
                    [
                      "Strengths",
                      "Legacy system modernisation, complex workflow design, two-sided systems, design tokens and component libraries",
                    ],
                    ["Builds", "Prototypes in code"],
                    ["Based", "Salzburg, Austria"],
                    ["Authorisation", "EU Blue Card, open to relocation"],
                    ["Looking for", "Senior IC role in complex enterprise software"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex flex-col gap-xxs py-sm sm:flex-row sm:gap-lg"
                    >
                      <dt className="font-mono text-mono-eyebrow uppercase text-mute sm:w-32 sm:shrink-0 sm:pt-[3px]">
                        {label}
                      </dt>
                      <dd className="text-body-md text-ink sm:flex-1">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Full-width band across both columns, above the closing rule */}
            <AboutBand />
          </div>
        </div>
      </section>

      {/* What it's like to work with me */}
      <Testimonials />

      {/* CTA / Contact */}
      <section id="contact" className="border-t border-hairline bg-canvas">
        <div className="mx-auto max-w-container px-lg py-4xl text-center">
          <h2 className="mx-auto max-w-3xl text-[length:clamp(1.75rem,4vw+0.5rem,3rem)] font-semibold leading-none tracking-[-0.05em] text-ink">
            Got a gnarly problem worth solving?
          </h2>
          <div className="mt-2xl flex flex-wrap items-center justify-center gap-md">
            <a
              href="mailto:seemasam2113@gmail.com"
              className="rounded-pill border border-transparent bg-ink px-lg py-sm text-body-lg font-medium text-on-primary transition-colors hover:bg-black"
            >
              Get in touch
            </a>
            <a
              href="/seema-jain-resume.pdf"
              target="_blank"
              rel="noopener"
              className="rounded-pill border border-hairline bg-elevated px-lg py-sm text-body-lg font-medium text-ink transition-colors hover:bg-hairline-soft"
            >
              Resume
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-hairline bg-canvas">
        <div className="mx-auto flex max-w-container flex-col items-start justify-between gap-md px-lg py-3xl md:flex-row md:items-center">
          <div className="flex flex-col items-start gap-xs sm:flex-row sm:items-center sm:gap-md">
            <span className="text-label-sm font-semibold text-ink">
              Seema Jain
            </span>
            <span className="font-mono text-mono-eyebrow text-mute">
              · © 2026 · Salzburg, AT
            </span>
            <span className="font-mono text-mono-eyebrow text-mute/70">
              V1.0
            </span>
          </div>
          <a
            href="https://www.linkedin.com/in/seema-sampathraj/"
            target="_blank"
            rel="noopener"
            className="font-mono text-mono-eyebrow text-mute transition-colors hover:text-ink"
          >
            LinkedIn ↗
          </a>
        </div>
      </footer>
    </>
  );
}
