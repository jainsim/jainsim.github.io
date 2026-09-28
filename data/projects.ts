export type CaseImage = {
  src: string;
  width: number; // native px - feeds next/image so ratios stay exact
  height: number;
  caption?: string;
  // how the image sits in the reading flow:
  //  inline - grouped 2–3 across in a grid beside/after the copy (phone screens)
  //  phone  - a single small phone screen, centered, not stretched
  //  wide   - a portrait/composite shot, centered at a medium width
  //  full   - a landscape UI shot spanning the full image column
  layout?: "inline" | "phone" | "wide" | "full";
};

export type CaseMetric = { value: string; label: string };

export type CaseSection = {
  heading: string;
  body: string;
  points?: string[]; // scannable supporting points
  images?: CaseImage[];
  callout?: { label?: string; body: string }; // design-decision aside
  callouts?: { label?: string; body: string }[]; // more asides, rendered after `callout`
  metrics?: CaseMetric[]; // stat band (used in Outcome)
};

export type HeroImage = {
  src: string;
  width: number; // native px - feeds next/image so nothing shifts or clips
  height: number;
};

export type Project = {
  slug: string;
  index: string; // "(01)"
  title: string;
  role: string;
  discipline: string;
  org: string;
  year: string;
  inProgress?: boolean;
  kind?: "prototype"; // gallery item that opens a live embed, not a case study
  href?: string; // live prototype URL (when kind === "prototype")
  label?: string; // small mono eyebrow on the card (e.g. "Live prototype")
  blurb?: string; // one-line description shown on the prototype card
  accent: string; // brand hex - 8% tint on the mat
  accentText: string; // brand hex tuned for legible index text (deeper where needed)
  hero: HeroImage; // the home-page stage screenshot (device mockup, native ratio)
  overlayHero?: HeroImage; // wider hero shown at the top of the case-study overlay
  // When set, the overlay opens with a row of device-framed phones (same frame
  // chrome as the home-page stack) instead of a single flat hero image.
  overlayHeroPhones?: { src: string; width: number; height: number; alt: string }[];
  // When true, the overlay hero (a laptop/desktop shot) renders inside the
  // dark bezel stroke instead of flat on the mat.
  overlayHeroFramed?: boolean;
  images: string[]; // first is the hero/panel image
  subtitle: string;
  meta: { label: string; value: string }[];
  sections: CaseSection[];
};

export const projects: Project[] = [
  {
    slug: "installer",
    index: "(04)",
    title: "Installer App",
    role: "Lead UX/UI Designer",
    discipline: "Native mobile",
    org: "ChargePoint",
    year: "2025",
    accent: "#F06800",
    accentText: "#D65A00",
    hero: { src: "/projects/installer-hero.png", width: 4234, height: 8655 },
    overlayHero: { src: "/projects/installer/hero-3-screens.png", width: 7009, height: 4152 },
    overlayHeroPhones: [
      {
        src: "/projects/installer/header-home.png",
        width: 750,
        height: 1478,
        alt: "Home: the installer's task list, supported hardware, and install guides.",
      },
      {
        src: "/projects/installer/header-config.png",
        width: 750,
        height: 1478,
        alt: "Config: device configuration captured in the field, step by step.",
      },
      {
        src: "/projects/installer/header-success.png",
        width: 750,
        height: 1478,
        alt: "Success: both stations set up, confirmed in the field.",
      },
    ],
    images: ["/projects/installer/hero-3-screens.png"],
    subtitle:
      "Connecting the field to the platform: an end-to-end self-serve installation native mobile app.",
    meta: [
      { label: "Role", value: "Lead UX/UI Designer" },
      { label: "Duration", value: "6 months · 2 iterations" },
      { label: "Domain", value: "B2B SaaS · Native Mobile" },
      { label: "Client", value: "ChargePoint" },
    ],
    sections: [
      {
        heading: "Outcome",
        body:
          "A station commissioned in the field now shows up in Polaris ready to activate, with no CX involved. White-glove activation stays available as a chargeable premium service rather than the default, which turns agent cost from overhead into a revenue line.",
        metrics: [
          { value: "0", label: "CX touches on the self-serve path" },
          { value: "1", label: "activation event per site & org, not per station" },
          { value: "2", label: "clean activation routes: enterprise pre-assign + VAR hyperlink" },
        ],
      },
      {
        heading: "Context",
        body:
          "ChargePoint runs one of the world’s largest commercial EV charging networks. Four years ago it moved from direct sales to a Value-Added Reseller model, and today roughly 90% of sales flow through partners like EATON. The activation process never caught up.\n\nTwo people live in two separate worlds. The electrician mounts the hardware, scans serial numbers, confirms connectivity, and leaves, all through the Installer App. The org admin never touches hardware; they manage policies, pricing, and activation afterward in Polaris Suite. Before this work, a Customer Experience agent had to bridge every handoff between them by hand.",
      },
      {
        heading: "The problem",
        body:
          "The field app and the platform never shared a clean data handoff, so every activation stalled at the seam between them.",
        points: [
          "No owner: stations arrived on the platform with nothing linking them to the organization that bought them.",
          "Manual bridging: a CX agent stepped in on every activation to find the owner and connect the stations.",
          "No grouping: installing 10 stations at one site meant running the same flow 10 times.",
        ],
      },
      {
        heading: "Research & Discovery",
        body:
          "I interviewed the CX agents who had been bridging every handoff, then mapped the data flow between field and platform end to end.\n\n**The critical insight:** the first challenge wasn’t screens, it was timing. At what point in the physical workflow is org identity even knowable? Mapping the deployment showed three gaps the CX agents had been covering by hand, and those became the first release.",
      },
      {
        heading: "Iteration 1: MVP",
        body:
          "**What I built:**\n\n- Sites: a physical address becomes the unit of work, so stations installed together stay together.\n- CMS declaration upfront: ChargePoint cloud or a third-party system (be.ENERGISED, Studio); the two paths split immediately.\n- Org pre-assignment: org identity pushed from Salesforce and shown on the installer’s summary as a read-only signal.\n- Email-triggered activation: a regional link sent to the org admin the moment the job is complete.\n\n**What worked:** the release closed the three gaps CX had been bridging by hand.\n\n**What didn’t:** stakeholder review surfaced four failures.\n\n- Silent pre-assignment failure: when the API org link broke, the installer saw “Org ✓” while the admin received nothing.\n- No asset visibility: admins couldn’t confirm from Polaris what had been installed.\n- Per-station email didn’t scale: a 30-station site fired 30 separate emails.\n- Meaningless site names: an auto-generated string like 450haciendacalifornia meant nothing to the admin.",
        callout: {
          label: "Design decision · CMS selection screen",
          body:
            "**Decision:** Add a CMS selection step that forks the flow before any data is sent.\n\n**Alternative:** Auto-detect the CMS from the hardware scan.\n\n**Why:** API coverage was incomplete, and non-ChargePoint hardware could still be provisioned in ChargePoint’s cloud, so a scan couldn’t reliably tell the two apart. The cost is one redundant tap in the 90%+ ChargePoint case, which is cheaper than the most expensive failure in the old flow: a misrouted activation email.",
        },
        images: [
          {
            src: "/projects/installer/create-site.png",
            width: 375,
            height: 1022,
            layout: "inline",
            caption:
              "Create a site: grouping stations by location up front.",
          },
          {
            src: "/projects/installer/station-config.png",
            width: 750,
            height: 2058,
            layout: "inline",
            caption:
              "Device configuration captured in the field, step by step.",
          },
          {
            src: "/projects/installer/email-activation.png",
            width: 2060,
            height: 4602,
            layout: "wide",
            caption:
              "Email-triggered activation: the owner receives a regional link and station table that deep-links into Polaris Suite.",
          },
        ],
      },
      {
        heading: "Iteration 2: Refinement",
        body:
          "Pre-assignment leaned on Salesforce data that was missing in about 30% of VAR transactions, and per-station emails broke at scale. Iteration 2 fixed both.\n\n**What I built:**\n\n- Org-agnostic completion: the install finishes cleanly without Salesforce data. The station queues in Polaris as “Ready for Activation”, and the admin gets a regional link to attach it to their org.\n- Job Summary: all installed devices grouped into one submit event.\n- Add more stations + cluster devices: installers loop back and add each station to the same job before submitting.\n\n**What worked:** stations now arrive in Polaris ready to activate, with no CX touch and no dependency on Salesforce data.",
        callouts: [
          {
            label: "Design decision",
            body:
              "**Decision:** Remove the org dependency and let the install complete without it.\n\n**Alternative:** Keep pre-assignment and design better error states around it.\n\n**Why:** Salesforce data was missing in about 30% of VAR transactions. Better errors would still leave a third of installs stuck. Designing the absence was more robust than designing the recovery.",
          },
          {
            label: "Design decision",
            body:
              "**Decision:** One activation email per site.\n\n**Alternative:** One email per station.\n\n**Why:** A 30-station site fired 30 emails. That was still manual work, just in a different shape.",
          },
        ],
        images: [
          {
            src: "/projects/installer/skip-org.png",
            width: 662,
            height: 1178,
            layout: "inline",
            caption:
              "Org-agnostic flow: the installer can skip Salesforce-dependent org data.",
          },
          {
            src: "/projects/installer/summary-one-station.png",
            width: 375,
            height: 1652,
            layout: "inline",
            caption:
              "Setup complete: full system detail sent back to ChargePoint.",
          },
          {
            src: "/projects/installer/summary-cluster.png",
            width: 750,
            height: 2822,
            layout: "inline",
            caption:
              "Job Summary: multiple stations rolled into one submission.",
          },
          {
            src: "/projects/installer/loop-or-submit.png",
            width: 2668,
            height: 3166,
            layout: "wide",
            caption:
              "Loop back to add another station, or complete the job.",
          },
          {
            src: "/projects/installer/summary-drawer.png",
            width: 1858,
            height: 2886,
            layout: "wide",
            caption:
              "Cluster summary with a node-detail drawer for multi-port stations.",
          },
          {
            src: "/projects/installer/station-management.png",
            width: 3448,
            height: 2212,
            layout: "full",
            caption:
              "Polaris Suite: stations arrive queued for activation at the org level, with a manual add path as a fallback.",
          },
        ],
      },
      {
        heading: "How AI fit in",
        body:
          "**Microsoft Copilot (company-approved):** summarising interview notes, drafting specs and Jira tickets, and first drafts of UX copy.\n\n**Figma Make:** prototyping installer screens to test flow variations quickly. It was new to the team, so the first weeks went into learning what it could and couldn’t do.",
      },
      {
        heading: "What I learned",
        body:
          "Both iterations came down to letting go of an assumption. The first version assumed org identity had to be resolved at the moment of install, and that one belief made the whole flow fragile. Once I stopped defending it, the design got simpler and sturdier.\n\nThis app is the upstream half of a two-part system. The activation flow in Polaris only works because this app captures the right data, in the right shape, at the right moment. That seam, not the app, is what I was designing.",
        points: [
          "Design for the data you have, not the data you need. Designing from what was reliably present (the station MAC, the site address, the installer’s job record) produced a flow that survived reality.",
          "The handoff point is the design. Designing the installer-to-admin handoff explicitly, instead of routing it through a CX agent, is what made self-serve viable.",
          "If I did it again: I’d get engineering into the PRD earlier. The “sites” grouping shaped two iterations before engineering review found it wasn’t buildable as written.",
        ],
        images: [
          {
            src: "/projects/installer/success.png",
            width: 375,
            height: 635,
            layout: "phone",
            caption:
              "Installation confirmed in the field.",
          },
        ],
      },
    ],
  },
  {
    slug: "activation",
    index: "(01)",
    title: "Station Activation Flow",
    role: "Lead UX/UI Designer",
    discipline: "Enterprise workflow",
    org: "ChargePoint",
    year: "2025",
    accent: "#0E7C86",
    accentText: "#0E7C86",
    hero: { src: "/projects/activation-hero.png", width: 11402, height: 6646 },
    overlayHero: { src: "/projects/activation/overlay-hero.png", width: 3410, height: 2212 },
    overlayHeroFramed: true,
    images: ["/projects/activation.png"],
    subtitle:
      "Replacing an expert-only, support-dependent activation with a self-serve workflow any admin can run, designed embedded with engineering through build and design QA.",
    meta: [
      { label: "Role", value: "Lead UX/UI Designer" },
      { label: "Duration", value: "1 year · 4 iterations" },
      { label: "Domain", value: "B2B Enterprise SaaS" },
      { label: "Client", value: "ChargePoint" },
    ],
    sections: [
      {
        heading: "Outcome",
        body: "",
        metrics: [
          { value: "3 to 5 days → same-day", label: "activation for the simplest flows (measured)" },
          { value: "~1 ticket every other day", label: "saved through pre-activation checks" },
          { value: "~40%", label: "of CX activation tickets projected to be eliminated (estimate)" },
        ],
        points: [
          "Defects caught pre-release through embedded design QA",
          "4 iterations in 1 year, each tested before the next began. Iteration 4 is rolling out.",
        ],
      },
      {
        heading: "Context",
        body:
          "ChargePoint runs one of the world’s largest EV charging networks: over 1.3 million ports. Polaris Suite gave Org Admins their first self-serve activation flow, for everything from a single station to a rollout of hundreds.\n\nThree people use it: the Org Admin (the customer’s ops person, who this is built for), the Deployment Specialist (ChargePoint staff, who did most activations until now), and the NOC operator (activation at fleet scale). Behind them sit three legacy platforms: NOS, be.ENERGISED, and Viriciti.",
      },
      {
        heading: "The problem",
        body:
          "Every problem landed in the same place: customers waited days for stations they’d already paid for and installed.",
        points: [
          "Three systems: activation logic split across NOS, be.ENERGISED, and Viriciti.",
          "No bulk: 10 stations meant running the same flow 10 times.",
          "Disconnected from the field: installation data never reached activation.",
          "Expert-only: plan and policy choices needed knowledge most admins didn’t have.",
        ],
      },
      {
        heading: "How I shaped the work",
        body:
          "I joined a few weeks before the MVP shipped. The project was scoped as one large workstream with a single handoff at the end. Fine for one MVP, wrong for a problem that would change its own assumptions every round.\n\nI pushed to split it into four topic-scoped iterations, each with its own handoff and testing. That structure is why every iteration below could respond to what the last one taught us.",
        images: [
          {
            src: "/projects/activation/walked-into.png",
            width: 1750,
            height: 434,
            layout: "full",
            caption:
              "Reshaping the work: one MVP workstream split into four topic-scoped phases, each with its own handoff, UAT, and CX testing across the year.",
          },
        ],
      },
      {
        heading: "Research & Discovery",
        body:
          "30+ interviews (Org Admins, Deployment Specialists, NOC and CX), three UAT rounds, and journey mapping across the admin platform, Installer App, and field install.\n\n**The critical insight:** admins didn’t need a faster wizard. They needed to know when something was wrong, and what to do about it. The old process hid failures until a specialist flagged them, often days later.\n\n**What surprised me:** experienced Deployment Specialists rated the MVP 4.5/5. That was misleading. They finished fast because they already knew the data model. UAT measured expert efficiency, not whether a first-time admin could get through. I stopped designing for the score and started watching where new admins got stuck.",
        images: [
          {
            src: "/projects/activation/data-sync.png",
            width: 3240,
            height: 957,
            layout: "full",
            caption:
              "Field-to-platform data sync: the admin’s queue, the pre-assigned org, and the regional activation link all depend on data captured in the Installer App.",
          },
        ],
      },
      {
        heading: "Iteration 1: MVP",
        body:
          "A three-step wizard for the simplest case: single stations, one site, default everything.\n\n**What I built:** a Charger Management banner, a Ready-for-Activation list grouped by model family and site, and a wizard (Org & Plan → Energy Management → Summary). For the first time, an admin could activate without a Deployment Specialist.\n\n**What worked:** activation took 3 to 4 minutes in later UAT.\n\n**What didn’t:** there was no bulk activation, and token validity timing (sales-order date vs. activation date) was opaque.",
        callout: {
          label: "Design decision",
          body:
            "**Decision:** A step-by-step wizard.\n\n**Alternative:** A single long form.\n\n**Why:** Activation is a technical task, and most admins had never done it before. A long form puts every field in front of them at once, including settings they may never need to touch. A wizard breaks it into steps and shows only what matters at each point.",
        },
        images: [
          {
            src: "/projects/activation/entry-point.png",
            width: 10486,
            height: 3978,
            layout: "full",
            caption:
              "The entry point: a Charger Management banner surfaces stations ready to activate. The list groups them by model family and common address, so twenty identical chargers read as one card, the foundation bulk activation would later be built on.",
          },
          {
            src: "/projects/activation/wizard-steps.png",
            width: 5864,
            height: 3048,
            layout: "full",
            caption:
              "Step 1, Org & Plan: recommended policies and warranties prefilled, so the reader’s first real choice is whether to accept defaults, not whether to learn the data model. Step 2, Energy Management: the user can email the installer to fill in this deeply technical section.",
          },
        ],
      },
      {
        heading: "Iteration 2: Bulk & recovery",
        body:
          "From single stations to fleets.\n\n**What I built:** Copy / Import Configuration to reuse an activated station’s settings, Advanced Token selection to see the sales order and dates behind each token, and a token-mismatch recovery dialog.\n\n**What worked:** bulk and copy-config landed strongly. Copy-config was the round’s biggest time-saver.\n\n**What didn’t:** editing a station mid-wizard reset the user’s progress. And the flow still treated activation as setup, when for NOS stations it’s fleet management with prerequisites the UI was hiding.",
        callout: {
          label: "Design decision",
          body:
            "**Decision:** Design the token-mismatch recovery dialog before polishing the happy path.\n\n**Alternative:** Ship bulk with a generic error and fix recovery later.\n\n**Why:** Two of three Phase 1 customers had silently hit the token-mismatch path. A generic error sends users to support, which was the exact behaviour we were trying to remove.",
        },
        images: [
          {
            src: "/projects/activation/copy-config.png",
            width: 5264,
            height: 4726,
            layout: "full",
            caption:
              "Copy / Import Configuration reuses an activated station’s plan, policy, and group settings.",
          },
          {
            src: "/projects/activation/advanced-token.png",
            width: 10552,
            height: 3494,
            layout: "full",
            caption:
              "Advanced Token Selection: the sales order, token start date, end date, and purchase order behind each token. The token-mismatch dialog turns a dead end into a fixable state.",
          },
        ],
      },
      {
        heading: "Iteration 3: NOS & the silent failure modes",
        body:
          "Support kept seeing the same three tickets. Porting into NOS made them impossible to ignore.\n\n**What I built:** pre-activation checks for uncommissioned stations, missing or offline gateways, and pending GPS pinpointing. Before this, an operator could finish the whole wizard and only then learn activation would never work. I added per-station status that survives page reloads, with clear success, in-progress, and failure states.\n\n**What worked:** CX, support engineers, enterprise users, and deployment supervisors gave strongly positive feedback.\n\n**What didn’t:** multi-port stations still showed as a flat list. A 13-port DC station was 13 rows, with no way to trace a fault to its dispenser.",
        callout: {
          label: "Internal review · CX lead",
          body:
            "“The DC blocker banner alone saves us a support ticket every other day.”",
        },
        callouts: [
          {
            label: "Design decision",
            body:
              "**Decision:** Surface pre-activation failures as hard blocks with a recovery path.\n\n**Alternative:** A warning banner users could dismiss and continue past.\n\n**Why:** A dismissed warning means the station still fails later, and the user loses trust. We tested both with 12 Deployment Specialists. Most preferred the hard block once they saw why.",
          },
        ],
        images: [
          {
            src: "/projects/activation/failure-states.png",
            width: 5160,
            height: 4798,
            layout: "full",
            caption:
              "Pre-activation blockers surfaced early: (1) incomplete pinpointing, (2) a warning for a missing gateway, and (3) a hard block for uncommissioned DC stations.",
          },
          {
            src: "/projects/activation/async-progress.png",
            width: 6968,
            height: 3670,
            layout: "full",
            caption:
              "Per-station status that persists across page reloads, so operators stop wondering if the system is stuck. The modal gives explicit success, in-progress, and failure states, with retry on the failures that need it.",
          },
        ],
      },
      {
        heading: "Iteration 4: Cluster hierarchy (rolling out)",
        body:
          "Each child port now nests under its parent Chargebox, so a 13-port cluster reads as one row instead of thirteen. Impact is still being measured.",
        images: [
          {
            src: "/projects/activation/dc-cluster.png",
            width: 5160,
            height: 5686,
            layout: "full",
            caption:
              "A 13-port DC cluster collapsed under one parent Chargebox. What used to be thirteen rows is now one.",
          },
        ],
      },
      {
        heading: "Staying in the build",
        body:
          "From Iteration 3 on, I ran design QA on dev builds myself: clicking every state, breaking the flow on purpose, logging defects in Jira, and driving fixes with engineering before release. Defects were caught pre-release, and it saved a full round of CX escalations.",
      },
      {
        heading: "How AI fit in",
        body:
          "**Microsoft Copilot (company-approved):** summarising 30+ interview notes into themes, drafting specs and Jira tickets, and first drafts of UX copy for error and recovery states.\n\n**Figma Make:** prototyping activation screens for fast testing. It was new to the team, so the first weeks went into learning what it could and couldn’t do. Once that clicked, testing variations of a flow got much quicker.",
      },
      {
        heading: "What I learned",
        body:
          "Because I owned the upstream Installer App too, I could close gaps that stay invisible when two products are designed apart: the admin’s queue, the pre-assigned org, and the regional activation link all depend on data captured in the field. Owning both sides is what made same-day activation possible.\n\n**If I did it again:** I’d bring CX in from Iteration 1, not 2. I’d split the work before the MVP, not after. And I’d test with first-time admins in round 1, not only experts.",
        points: [
          "Stay close to support. The most valuable feedback came from CX and Deployment Specialists telling me what annoyed them that week, not from formal UAT.",
          "The unhappy path is the product. Designing failures as first-class moments, caught early and explained in place, did more for trust than any polish on the happy path.",
        ],
      },
    ],
  },
  {
    slug: "designgrid",
    index: "(03)",
    title: "DesignGrid",
    role: "UX/UI Designer",
    discipline: "Design systems",
    org: "The Mobility House",
    year: "2023–2024",
    accent: "#0066FF",
    accentText: "#0066FF",
    hero: { src: "/projects/designgrid-hero.png", width: 11529, height: 6680 },
    overlayHero: { src: "/projects/designgrid/hero.png", width: 6960, height: 3914 },
    images: ["/projects/designgrid.png"],
    subtitle:
      "The infrastructure behind a three-product enterprise SaaS suite: a design system built with engineering, tested before code, and adopted across the suite.",
    meta: [
      { label: "Role", value: "UX/UI Designer, design system owner" },
      { label: "Duration", value: "9 months" },
      { label: "Domain", value: "B2B · Enterprise SaaS · Design Systems" },
      { label: "Client", value: "The Mobility House" },
    ],
    sections: [
      {
        heading: "Context",
        body:
          "When I joined The Mobility House, the product suite had grown across multiple applications, each with its own interface language, its own component patterns, and its own definition of what a button looked like. Teams rebuilt the same UI elements repeatedly. Every new feature started from scratch instead of building on decisions the team had already made.\n\nThe cost was time. Design handoffs were slow because there was nothing to hand off to. Development was slow because engineers were rebuilding components across three codebases. And scaling was impossible: each new product inherited the same inconsistency.\n\nI rebuilt DesignGrid from the ground up: a single source of truth for UI decisions, tested before code, adopted across the suite.",
      },
      {
        heading: "The problem",
        // synthesized lead - the section is pure bullets in the source doc
        body: "The fragmentation wasn’t cosmetic: it showed up in three ways.",
        points: [
          "Inconsistent UI meant inconsistent workflows: one product used modals for configuration, another used panels. A toggle meant one thing in the dashboard and something else in the installer app. This wasn’t a polish problem: it was cognitive load. Every new user and every new engineer had to learn the language from scratch.",
          "The work was repetitive: designing a new feature meant gathering screenshots from old features, tracing the patterns, rebuilding the components, then waiting to find out whether dev had already built something similar. No single source of truth meant constant duplicated effort.",
          "Brand identity was diluting: TMH’s new brand guidelines existed but applied unevenly. Some products followed them closely; others had adapted them so far that users couldn’t tell they belonged to the same suite. White-labeling was painful: reusing components across customers meant reworking layouts every time.",
        ],
        images: [
          {
            src: "/projects/designgrid/before-site-setup.png",
            width: 6408,
            height: 1974,
            layout: "full",
            caption:
              "Site setup, before: configuration hidden inside extended settings. A non-responsive UI that also compromised scalability across the different apps.",
          },
        ],
      },
      {
        heading: "Approach",
        body:
          "Why Atomic Design: I studied how other companies were building design systems: the patterns they used, where they struggled, what actually stuck. Brad Frost’s Atomic Design methodology organizes components by complexity: atoms (the smallest elements), molecules (simple combinations), organisms (complex, multi-part systems). That hierarchy forces a discipline: you can’t build an organism without first deciding what the atoms are. Consistency by design rather than by process.",
        callout: {
          label: "Design decision · Ant Design as the base library",
          body:
            "Engineering didn’t want a design system. Not because they disagreed with the goal, but because building one from scratch meant months of component work with no user-facing feature at the end of it, and that was a cost they couldn’t justify.\n\nAnt Design was how I got to yes. Our engineers already knew it, so adopting it meant the team spent its effort on adaptation rather than invention. I took what Ant provided (buttons, form patterns, the layout grid) and shaped it into DesignGrid’s atoms and molecules.\n\nThe trade-off: inheriting Ant’s opinions meant inheriting constraints I didn’t choose. But a design system that engineering agrees to build is worth more than a better one they don’t. Building from scratch would have produced a purer system and no adoption.",
        },
      },
      {
        heading: "The three pillars",
        body: "",
        points: [
          "Accessibility as a foundation, not an afterthought: colour contrast, touch targets, and OS conventions were entry requirements, not polish. I audited the existing suite with Stark and found core table text failing WCAG on every threshold (normal and large text, AA and AAA). The DesignGrid palette was built to clear all four. Contrast on primary table content went from 2.55:1 to 18.92:1.",
          "Communication with developers, from day one: I didn’t design the system and hand it off. I built it with the engineering team, listening to their edge cases, understanding what they needed to implement quickly, and designing components developers would actually want to reach for.",
          "A single source of truth in Figma, tested in code. Components live in two places: the design file, where decisions are made, and the code repository, where they ship. Chromatic kept the two in sync, catching visual drift before it became debt.",
        ],
        images: [
          {
            src: "/projects/designgrid/accessibility-before-after.png",
            width: 3276,
            height: 1239,
            layout: "full",
            caption: "Contrast audit: before and after.",
          },
        ],
      },
      {
        heading: "The architecture",
        body:
          "Atoms. The base layer: buttons, inputs, labels, icons, avatars. Once you define what a button is, every component that needs a button inherits that decision.\n\nMolecules. Simple combinations: form groups (label + input + helper text), navigation items (icon + label), action cards. This is where you start to see how atoms cooperate.\n\nOrganisms. Complex, multi-part systems: modals, tables, dashboards, data forms. This is where the leverage shows: you’re not starting from scratch, you’re assembling tested pieces.\n\nTemplates. Page-level skeletons: the arrangement of organisms into a working view. A template decides where the navigation sits, where the primary table lands, how a configuration panel relates to the content behind it.",
        images: [
          { src: "/projects/designgrid/atoms.png", width: 3960, height: 304, layout: "full", caption: "Atoms" },
          { src: "/projects/designgrid/molecules.png", width: 5372, height: 1240, layout: "full", caption: "Molecules" },
          { src: "/projects/designgrid/organisms.png", width: 3348, height: 2496, layout: "full", caption: "Organisms" },
          { src: "/projects/designgrid/templates.png", width: 5760, height: 3792, layout: "full", caption: "Templates" },
        ],
      },
      {
        heading: "The real challenge: designing for adoption",
        body:
          "Building the system was the easy part. Getting teams to use it was the hard part.\n\nShipping a component didn’t make anyone use it. Adoption meant sitting with teams, walking through the component, explaining why this shape and not that one, and answering the inevitable “but what if we need to…”. The system was never about restriction. It was about making the right choice the easy choice.\n\nThe resistance was real, and it was reasonable. Engineering pushed back twice: first on building a design system at all, and later on the data-heavy tables, the most expensive components in the library to build and maintain. Both objections came from the same place: a large upfront cost against no immediate user-facing feature.\n\nNeither objection was wrong on its own terms. The design system got built because Ant Design made the first step cheap enough to take. The tables got built because I stopped arguing and went to look.\n\nThe same instinct drove the site setup redesign. The old flow moved you through five separate views to configure a single site, with no overview anywhere. I pushed for a stepwise structure with the full data model visible in one place, so dependencies were legible at a glance instead of discovered by clicking forward.",
        callout: {
          label: "How the table argument actually ended",
          body:
            "I ran Hotjar on the existing charging-point tables. The session recordings showed users tracking back and forth across the full width of the row, hunting for the column they needed, with clicks landing on targets that weren’t clickable and clickable targets going untouched. It wasn’t a preference problem. Users couldn’t parse the row.\n\nThat recording ended the debate faster than any argument I’d made. The rebuilt table replaced the flat wide grid with a nested hierarchy (accounts expanding into sites, sites into stations) so a row could be scanned rather than traversed. The cost engineering was worried about was real. It just wasn’t the biggest cost on the table.",
        },
        images: [
          {
            src: "/projects/designgrid/tables-before.png",
            width: 1586,
            height: 466,
            layout: "full",
            caption: "The old table: before DesignGrid.",
          },
          {
            src: "/projects/designgrid/hotjar-old-tables.png",
            width: 1824,
            height: 802,
            layout: "full",
            caption: "Hotjar session tracking on the original table.",
          },
          {
            src: "/projects/designgrid/tables-after.png",
            width: 2880,
            height: 2048,
            layout: "full",
            caption: "The rebuilt table component in DesignGrid.",
          },
          {
            src: "/projects/designgrid/after-site-setup.png",
            width: 6006,
            height: 2572,
            layout: "full",
            caption:
              "Site setup, after: the full data model in one view. (1) Main distribution with power consumption, power production, and meter connection, (2) sub distribution, and (3) charging station.",
          },
        ],
      },
      {
        heading: "Testing & validation",
        body:
          "Chromatic became the QA layer that kept the system honest. Every component change was tested across viewport sizes, interaction states, and edge cases before it reached code, catching the inconsistencies that otherwise surface only when three engineers implement the same button three different ways.\n\nThe sharpest feedback came from real use. Redesigning the Dashboard on the new components made teams surface gaps: “we need a variant for this”, “this doesn’t support that state”. Those requests fed straight back into the library, so the system grew from what the products actually needed rather than from what I’d anticipated.",
      },
      {
        heading: "Outcome",
        body:
          "Before DesignGrid there was no front-end component library and no design source of truth. Designers copy-pasted screens from old features; engineers rebuilt the same table, the same dropdown, the same modal across three codebases. Every new feature paid the full cost of every decision that had already been made once.\n\nThat’s where the time went, and that’s what the system took back. The first product is slower, because you’re building the system and the product. The second is faster. By the third, the recurring decisions are already made and the saving compounds. Engineering’s internal estimate put the reduction in development time for new features at roughly 80%.",
        metrics: [
          { value: "2.55:1 → 18.92:1", label: "contrast on primary table content, now clearing WCAG AA and AAA" },
          { value: "3", label: "products consuming a shared component library" },
          { value: "1", label: "source of truth, synced between Figma and code, tested in Chromatic" },
        ],
      },
      {
        heading: "What one system taught me",
        body: "",
        points: [
          "Consistency isn’t about control: it’s about clarity. The worst design systems say “you must use this”. The best make it obvious why you’d want to. When an engineer reaches for a tested button instead of relitigating button sizes in code review, that isn’t restriction: it’s a gift.",
          "A design system is only as strong as its adoption. I could have built something thorough and beautiful and shipped it into silence. What made DesignGrid work was sitting with teams, answering why this decision, and treating their edge cases as system insights rather than exceptions.",
          "Stop arguing, go get the recording. I spent weeks making the case for rebuilding the tables and got nowhere. Twenty minutes of Hotjar sessions did it. When a decision is stuck between two reasonable positions, the fastest way out is usually evidence neither side has seen yet, and I should have reached for it sooner than I did.",
          "Infrastructure is design work. I arrived thinking I’d design components. What I actually did was reshape how the team makes decisions. That’s design: it just isn’t visible in the final product.",
        ],
      },
      {
        heading: "The bigger picture",
        body:
          "I built the system that let teams ship fast.\n\nThis is the work that doesn’t appear in a user-facing feature but changes how fast a team can move. One investment in getting the system right multiplies across every product that uses it. I came in expecting to design components; what I designed was the decision-making layer underneath them.",
      },
    ],
  },
];

/**
 * Live coded prototype shown as the lead gallery block. Not a case study: it
 * opens a full-screen embed of the deployed app rather than the overlay, so it
 * is kept out of `projects` (and therefore out of /work routing and the pager).
 */
export const prototypeItem: Project = {
  slug: "field-commissioning",
  kind: "prototype",
  index: "(02)",
  label: "Live prototype",
  title: "Northbeam",
  blurb:
    "A working prototype. Handles a failed session, loses connection, recovers. Built in code, not Figma.",
  href: "https://seema-jain.com/commissioning/",
  role: "Design & build",
  discipline: "Coded prototype",
  org: "Independent",
  year: "2026",
  accent: "#2B5BFF",
  accentText: "#1E42C4",
  hero: { src: "/projects/field-commissioning-hero.png", width: 778, height: 1600 },
  images: [],
  subtitle:
    "A working prototype. Handles a failed session, loses connection, recovers. Built in code, not Figma.",
  meta: [],
  sections: [],
};

export const projectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);

// Display order is driven entirely by each item's `index` ("(0N)"), so the
// numbering, the gallery sequence, and the pager can never drift apart.
const byIndex = (a: { index: string }, b: { index: string }) =>
  a.index.localeCompare(b.index);

/**
 * The full home-gallery sequence in index order: the live prototype interleaved
 * among the case studies at its numbered slot, not hardwired to the front.
 */
export const galleryOrder: Project[] = [...projects, prototypeItem].sort(byIndex);

/** Case studies alone, in index order (the prototype isn't a case study). */
const caseStudyOrder: Project[] = [...projects].sort(byIndex);

/** Previous/next case studies in gallery order, wrapping around the ends. */
export const adjacentProjects = (slug: string) => {
  const i = caseStudyOrder.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: null, next: null };
  const n = caseStudyOrder.length;
  const prev = caseStudyOrder[(i - 1 + n) % n];
  const next = caseStudyOrder[(i + 1) % n];
  return { prev, next };
};
