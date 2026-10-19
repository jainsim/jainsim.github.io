import type { Config } from "tailwindcss";

/**
 * Design tokens sourced 1:1 from DESIGN-vercel.md (the Geist system).
 * Dark hero values are additive — everything else is ink-on-near-white.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171717",
        "on-primary": "#ffffff",
        body: "#4d4d4d",
        mute: "#8f8f8f",
        faint: "#a1a1a1",
        hairline: "#ebebeb",
        "hairline-soft": "#f2f2f2",
        canvas: "#fafafa",
        elevated: "#ffffff",
        link: "#0070f3",
        "link-deep": "#0761d1",
        // dark hero scene
        "fjord-ink": "#0a0a0a",
        "fjord-text": "#eaeaea",
        "fjord-mute": "#a1a1a1",
      },
      fontFamily: {
        sans: ["var(--font-open-sans)", "Arial", "sans-serif"],
        hand: ["var(--font-hand)", "cursive"],
      },
      fontSize: {
        "m3-display-lg": ["57px", { lineHeight: "64px" }],
        "m3-display-sm": ["36px", { lineHeight: "44px" }],
        "m3-headline-lg": ["32px", { lineHeight: "40px" }],
        "m3-headline-md": ["28px", { lineHeight: "36px" }],
        "m3-headline-sm": ["24px", { lineHeight: "32px" }],
        "m3-title-lg": ["22px", { lineHeight: "28px" }],
        "m3-title-sm": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        "m3-body-lg": ["16px", { lineHeight: "24px" }],
        "m3-body-md": ["14px", { lineHeight: "20px" }],
        "m3-body-sm": ["12px", { lineHeight: "16px" }],
      },
      spacing: {
        xxs: "4px",
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "40px",
        "3xl": "64px",
        "4xl": "96px",
        section: "128px",
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "12px",
        lg: "16px",
        "pill-category": "64px",
        pill: "100px",
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
