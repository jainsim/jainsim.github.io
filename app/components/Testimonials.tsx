/**
 * "What it's like to work with me" - three short reference quotes in a static
 * grid, placed between About and the closing CTA. Stacks on mobile, three
 * across from md up.
 *
 * Attribution steps one shade darker than text-mute (to text-body, #4d4d4d) to
 * clear WCAG AA (4.5:1) on the canvas.
 */
type Quote = {
  quote: string;
  name: string;
  title: string;
  company: string;
};

const QUOTES: Quote[] = [
  {
    quote: "She doesn't stop at design execution.",
    name: "Justin Cummings",
    title: "Director, User Experience",
    company: "ChargePoint",
  },
  {
    quote: "She consistently prioritized the needs of our end users.",
    name: "Carolin Rohleder",
    title: "Product Owner",
    company: "The Mobility House",
  },
  {
    quote: "Seema's work on the Installer App has been exceptional.",
    name: "Lukas Pinieck",
    title: "Teamlead, Commissioning and Rollout",
    company: "The Mobility House",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="border-t border-hairline bg-canvas py-section">
      <div className="mx-auto max-w-container px-lg">
        <p className="eyebrow text-mute">What it&apos;s like to work with me</p>
        <div className="mt-xl grid gap-lg md:grid-cols-3">
          {QUOTES.map((t) => (
            <blockquote
              key={t.name}
              className="flex flex-col rounded-lg border border-hairline bg-elevated p-lg shadow-[0_1px_1px_rgba(0,0,0,0.04)]"
            >
              <p className="para-header !text-m3-headline-sm [text-wrap:pretty]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <cite className="mt-auto block pt-lg font-sans not-italic">
                <span className="block text-m3-title-sm font-semibold text-ink">{t.name}</span>
                <span className="mt-xxs block text-m3-body-md text-body">{t.title}, {t.company}</span>
              </cite>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
