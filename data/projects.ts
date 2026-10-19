export type CaseImage = {
  src: string;
  width: number; // native px - feeds next/image so ratios stay exact
  height: number;
  caption?: string;
  alt?: string; // accessible description; falls back to caption when omitted
  // how the image sits in the reading flow:
  //  inline - grouped 2–3 across in a grid beside/after the copy (phone screens)
  //  phone  - a single small phone screen, centered, not stretched
  //  wide   - a portrait/composite shot, centered at a medium width
  //  full   - a landscape UI shot spanning the full image column
  //  half   - landscape shots paired two across the image column
  layout?: "inline" | "phone" | "wide" | "full" | "half";
  scale?: number; // inline only: fraction of the shared phone width (e.g. 0.75)
};

export type CaseMetric = { value: string; label: string };

export type CaseSection = {
  heading: string;
  body?: string;
  points?: string[]; // scannable supporting points
  images?: CaseImage[];
  callout?: { label?: string; body: string }; // design-decision aside
  callouts?: { label?: string; body: string }[]; // more asides, rendered after `callout`
  metrics?: CaseMetric[]; // stat band (used in Outcome)
  id?: string; // anchor target (e.g. "ai-concept")
  label?: string; // small mono eyebrow under the heading
  // live prototype embedded after the body, with a caption and closing copy
  embed?: { src: string; title: string; height: number; caption?: string; after?: string };
  // smaller heading + copy after the body, inside the same section
  sub?: { heading: string; body: string };
  // numbered feature rows: image on a mat with its text beside it; several
  // images crossfade like the slides
  features?: {
    heading: string;
    items: {
      title: string;
      body: string;
      caption?: string;
      images: { src: string; width: number; height: number; alt: string }[];
    }[];
  };
  // design-decision aside placed after the feature rows
  decision?: string;
  // more subheadings placed after the slides: copy, an image, and/or
  // title + paragraph items
  subsAfter?: {
    heading?: string;
    body?: string;
    headingLarge?: boolean; // Material headline-md size instead of headline-sm
    bodyLarge?: boolean; // larger paragraph size, for a lead-in
    quote?: string; // pull quote on a mat
    quoteBy?: string; // who said it, shown under the quote
    image?: { src: string; width: number; height: number; alt: string };
    items?: { title: string; body: string; tag?: string }[];
    itemsCols?: 2 | 3; // 3 centres each item under an image above
  }[];
  // auto-advancing crossfade of images on a mat, each paired with a step
  // that highlights while its image shows
  slides?: {
    title: string;
    caption?: string;
    items: { src: string; width: number; height: number; alt: string; step: string }[];
  };
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
  // Case-study page header in the title + client-logo form: a statement
  // headline replaces the eyebrow, title and subtitle, logo sits top-right.
  headline?: string;
  logo?: { src: string; alt: string };
  // Intro block under the hero: summary + key results on the left, project
  // facts on the right. Replaces the meta strip when present.
  intro?: {
    body: string;
    results: { value: string; label: string; badge?: string }[];
    facts: { label: string; value: string; href?: string }[];
    image?: { src: string; width: number; height: number; alt: string };
  };
  // small line under the intro linking to an anchor further down the page
  introNote?: { text: string; linkLabel: string; href: string };
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
            scale: 0.85,
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
    title: "Charging station activation",
    role: "Lead UX/UI Designer",
    discipline: "",
    org: "ChargePoint",
    year: "2025",
    accent: "#0E7C86",
    accentText: "#0E7C86",
    hero: { src: "/projects/activation-hero.png", width: 11402, height: 6646 },
    overlayHero: { src: "/projects/activation/overlay-hero-station-setup.webp", width: 2000, height: 824 },
    overlayHeroFramed: true,
    images: ["/projects/activation.png"],
    subtitle:
      "From a specialist-led flow to a simple self-serve wizard for non-experts.",
    headline:
      "Charger activation: simplifying an enterprise workflow led by a specialist from 3 to 5 days to self-serve in minutes.",
    logo: { src: "/projects/activation/chargepoint-logo.svg", alt: "ChargePoint" },
    meta: [
      { label: "Role", value: "Lead UX/UI Designer" },
      { label: "Duration", value: "1 year · 4 iterations" },
      { label: "Domain", value: "B2B Enterprise SaaS" },
      { label: "Client", value: "ChargePoint" },
    ],
    intro: {
      body:
        "ChargePoint sells EV charging hardware and runs one of the world’s largest charging networks: over **1.3 million charging ports**. Every day a station isn’t activated is a day it’s not earning.\n\nActivation used to take 5 days and a dedicated specialist. I designed a guided wizard any organisation admin can run in 4 minutes.",
      results: [
        { value: "4 minutes", label: "activation time, down from 5 days", badge: "Beta" },
        { value: "4 iterations in 1 year", label: "each tested before the next began" },
        { value: "40+ defects caught", label: "pre-release through embedded design QA on dev builds" },
      ],
      facts: [
        {
          label: "Role",
          value:
            "Lead UX/UI Designer (Sole Designer)\nEnd-to-end design, user research, design QA on dev builds, user testing, prototyping",
        },
        { label: "Team", value: "5 Engineers, 1 PM, 1 Customer Experience Specialist" },
        { label: "Timeline", value: "Apr 25– Apr 26" },
        { label: "Interactive AI Concept", value: "View", href: "#ai-concept" },
      ],
      image: {
        src: "/projects/activation/intro-laptop-stations.jpg",
        width: 1215,
        height: 864,
        alt: "A laptop on a wooden desk showing the Charging Management stations table.",
      },
    },
    sections: [
      {
        heading: "Context",
        body: "",
        sub: {
          heading: "How activation worked before",
          body: "Electricians filled out a 3-page paper form by hand and emailed it to CX.",
        },
        slides: {
          title: "Activation form",
          caption: "The 3-page paper form electricians filled out and emailed to CX.",
          items: [
          {
            src: "/projects/activation/paper-form-1.jpg",
            width: 1545,
            height: 2000,
            alt: "Page 1 of the paper activation form: installer and organization names, primary contact fields, and a checklist of company categories.",
            step: "Welcome page - org details, contact info of station owner, and company category.",
          },
          {
            src: "/projects/activation/paper-form-2.jpg",
            width: 1545,
            height: 2000,
            alt: "Page 2 of the paper activation form: a 20-row table asking for station name, address, location, MAC address or serial, and gateway.",
            step: "Station details - One row per station, same 5 fields repeated up to 20 times or more.",
          },
          {
            src: "/projects/activation/paper-form-3.jpg",
            width: 1545,
            height: 2000,
            alt: "Page 3 of the paper activation form: pricing model checkboxes, access control, waitlist, and a comments box.",
            step: "Configuration: Pricing, access control, and waitlist settings routed through a deployment specialist",
          },
          ],
        },
        subsAfter: [
          {
            heading: "Three legacy platforms, one new suite",
            body: "Activation logic was split across three legacy platforms. Polaris Suite is the new enterprise platform that replaces all three.",
          },
          {
            heading: "The people involved",
            image: {
              src: "/projects/activation/people-involved-illustrations.webp",
              width: 2000,
              height: 118,
              alt: "The handoff chain: a CX agent with the paper form and an envelope, arrow to deployment specialists at three screens, arrow to an org admin at a desk.",
            },
            itemsCols: 3,
            items: [
              {
                title: "1. CX agents (Customer experience)",
                body: "Receives the paper form and coordinates between org admins, field teams and the platform.",
                tag: "(secondary persona)",
              },
              {
                title: "2. Deployment specialists",
                body: "Configures stations across 3 legacy platforms. The only ones who can activate.",
                tag: "(secondary persona)",
              },
              {
                title: "3. Org admin",
                body: "Customer site manager. Wants instant self-serve setup without relying on specialists.",
                tag: "(primary persona)",
              },
            ],
          },
          {
            heading: "Problem",
            headingLarge: true,
            items: [
              {
                title: "Expensive by default",
                body: "Every activation required a specialist, costing an estimated 2,000+ specialist hours per year.",
              },
              { title: "Three systems, one task", body: "No shared flow across the three legacy platforms." },
              { title: "No bulk activation", body: "10 stations meant running the wizard 10 times." },
              { title: "Expert-only settings", body: "Most admins couldn’t choose the right plan or policy alone." },
            ],
          },
          {
            quote:
              "How do you let a non-expert activate charging stations on their own, whether it’s one or a hundred?",
          },
          {
            heading: "What I walked into",
            body: "I joined weeks before the MVP shipped. No time for research. A two-day dev workshop to understand the system, then ship.",
            bodyLarge: true,
          },
        ],
      },
      {
        heading: "01 The Wizard (MVP)",
        body: "A three-step wizard for the simplest case.",
        features: {
          heading: "What I built",
          items: [
            {
              title: "Charger Management banner",
              body: "Notification that stations are ready for activation in the suite.",
              images: [
                {
                  src: "/projects/activation/mvp-banner.png",
                  width: 1258,
                  height: 176,
                  alt: "Activate stations banner: there is 1 charging station ready to be activated, with an Activate stations button.",
                },
              ],
              caption: "The banner surfaces stations ready to activate.",
            },
            {
              title: "Ready-for-Activation",
              body: "List grouped by model family and site.",
              images: [
                {
                  src: "/projects/activation/mvp-ready-list.webp",
                  width: 2000,
                  height: 929,
                  alt: "Site details for Amazon 2 with its address, station model CP6000, group membership tags, and a table of five online stations.",
                },
              ],
            },
            {
              title: "A wizard (Org & Plan → Energy Management → Summary)",
              body: "A three-step wizard with plans, warranties and policies pre-selected. Most admins confirm the defaults and move on.",
              images: [
                {
                  src: "/projects/activation/mvp-step-1.png",
                  width: 1054,
                  height: 760,
                  alt: "Step 1, Org Information, Cloud plan and Policies: org name, usage category, and a pre-selected Commercial plan.",
                },
                {
                  src: "/projects/activation/mvp-step-2.webp",
                  width: 2000,
                  height: 1442,
                  alt: "Step 2, Energy management: a new energy management group with panel capacity settings, or set up later.",
                },
                {
                  src: "/projects/activation/mvp-step-3.webp",
                  width: 2000,
                  height: 1442,
                  alt: "Step 3, Summary: site address, station model, group membership, the stations being activated, and their pins on a satellite map.",
                },
              ],
            },
          ],
        },
      },
      {
        heading: "Real research started after MVP",
        subsAfter: [
          {
            heading: "Insight",
            body: "30+ interviews with org admins, deployment specialists, and CX. The finding that shaped everything after: admins didn’t need a faster wizard. They needed to know when something was wrong and what to do about it.",
          },
          {
            heading: "Two products, one handoff",
            body: "I also designed the Installer App. That meant I could close the gap between field and platform myself: data captured by the technician on site flows into Polaris Suite, so the admin starts with a station that is already pre-filled.",
            image: {
              src: "/projects/activation/field-to-admin.png",
              width: 914,
              height: 311,
              alt: "Data sync from field to admin. In the Installer App, the electrician scans the station, pinpoints GPS, confirms the address, and logs model and ports. In Polaris Suite, the org admin gets the station pre-pinpointed, address pre-filled, name auto-generated, groups assigned, and plans and policies recommended.",
            },
          },
        ],
      },
      {
        heading: "02 Bulk and recovery",
        body: "",
        features: {
          heading: "What I built",
          items: [
            {
              title: "Copy/Import Configuration",
              body: "Large activations repeat the same setup, so admins can reuse an activated station’s settings across new ones.",
              images: [
                {
                  src: "/projects/activation/bulk-copy-config.webp",
                  width: 2000,
                  height: 520,
                  alt: "Station table with three stations selected and an Import configuration settings dropdown listing existing charging stations to copy from.",
                },
              ],
            },
            {
              title: "Token (license) selection",
              body: "Every station needs a token (license) to go online. The right one is now pre-selected. When an admin needs to override, they see which token fits before choosing.",
              images: [
                {
                  src: "/projects/activation/bulk-token-select.webp",
                  width: 2000,
                  height: 1145,
                  alt: "Advanced Token Selection dialog: 2 stations are selected, select 4 tokens, one for each charging port. A table lists tokens with organisation, sales order, dates and purchase order.",
                },
              ],
            },
            {
              title: "Token-mismatch recovery",
              body: "Incase wrong or expired token (license) selected, the system failed activation. The admin had to call support. Now the system tells them what went wrong and how to fix it in place.",
              images: [
                {
                  src: "/projects/activation/bulk-token-mismatch.png",
                  width: 960,
                  height: 627,
                  alt: "Token mismatch error: the number of stations selected and tokens available don't match. Deselect a few stations or verify tokens were purchased and assigned, with Contact Support and View Token Inventory actions.",
                },
              ],
            },
          ],
        },
        decision:
          "**Why recovery before polish:** two of three early customers had silently hit the token mismatch. A generic error that sends them to support, which was exactly what we were replacing.",
      },
      {
        heading: "03 Pre-activation checks",
        body: "Admins could finish the entire wizard and only then discover the station couldn’t activate. Once the backend supported it, the system now checks before they start.",
        features: {
          heading: "What I built",
          items: [
            {
              title: "Blockers caught early",
              body: "(1) pending GPS/ location co-ordinates of the station (pinpoint), (2) missing gateways, (3) unsupported hardware. Surfaced before the wizard.",
              images: [
                {
                  src: "/projects/activation/precheck-blockers.webp",
                  width: 2000,
                  height: 515,
                  alt: "Three warnings: the station pinpoint is missing, the gateway device is missing or inactive, and a DC station is not commissioned, with a ChargePoint support button.",
                },
              ],
            },
            {
              title: "Activation progress",
              body: "**Before:** the admin pressed Activate and waited. No feedback, no way to tell if it worked, failed, or was still running.\n\n**Now:** per-station status with success, failure, and in-progress, a resolve button on failures, and a progress bar that persists across page reloads.",
              images: [
                {
                  src: "/projects/activation/precheck-progress.webp",
                  width: 2000,
                  height: 789,
                  alt: "Charging Management with an Activation progress banner at 70 percent; View opens a panel listing each station as activated, failed with a Resolve button, or in progress, plus an energy management setup error.",
                },
              ],
            },
          ],
        },
        decision:
          "**Why hard blocks, not warnings:** a dismissed warning means the station still fails later. Tested with 30+ users. Most preferred the block once they saw why.",
        subsAfter: [
          {
            quote: "The DC blocker banner alone saves us a support ticket every other day.",
            quoteBy: "CX lead",
          },
        ],
      },
      {
        heading: "04 Clusters",
        body: "A charging station is called a cluster when it has 10+ outlets (dispensers) sharing one charger ID. Instead of listing each separately, the hierarchy groups them under one parent so the admin sees one station.",
        images: [
          {
            src: "/projects/activation/cluster-table.png",
            width: 1108,
            height: 758,
            layout: "half",
            caption: "Ready for activation table with nested outlets/ dispensers expanded",
          },
          {
            src: "/projects/activation/cluster-overview.png",
            width: 1108,
            height: 524,
            layout: "half",
            caption: "Cluster overview",
          },
        ],
      },
      {
        heading: "Staying in the build",
        body:
          "From iteration 3 on, I ran design QA on every dev build myself: clicking every state, breaking the flow on purpose, logging defects in Jira. 20+ defects caught pre-release per iteration, before they reached the users.",
      },
      {
        id: "ai-concept",
        heading: "How AI fits in",
        body: "",
        subsAfter: [
          {
            heading: "In the process",
            body: "Copilot for summarising 30+ interview notes and drafting specs.",
          },
          {
            heading: "As a concept",
            body: "Copy Config only works if you know which station details to copy. The AI concept finds the org’s past setup for matching hardware and suggests plans, warranties and policies. When there’s no history, it shows all options instead of guessing.",
          },
        ],
        embed: {
          src: "/prototypes/activation-ai.html",
          title: "AI-assisted setup prototype",
          height: 820,
          caption: "Try it: switch the usage category, edit a card, then reset it.",
        },
      },
      {
        heading: "What I learned",
        body: "",
        subsAfter: [
          {
            heading: "Stay close to support",
            body: "The most valuable feedback came from CX telling me what annoyed them that week, not from formal UAT.",
            image: {
              src: "/projects/activation/precheck-blockers.webp",
              width: 2000,
              height: 515,
              alt: "Three warnings: the station pinpoint is missing, the gateway device is missing or inactive, and a DC station is not commissioned, with a ChargePoint support button.",
            },
          },
          {
            heading: "The unhappy path is the product",
            body: "Designing failures as first-class moments did more for trust than any polish on the happy path.",
          },
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

/** Resolve any gallery item (case study or the prototype) by slug. */
export const galleryItemBySlug = (slug: string) =>
  galleryOrder.find((p) => p.slug === slug);

/** Previous/next across the whole gallery (prototype included), wrapping. */
export const adjacentGalleryItems = (slug: string) => {
  const i = galleryOrder.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: null, next: null };
  const n = galleryOrder.length;
  return {
    prev: galleryOrder[(i - 1 + n) % n],
    next: galleryOrder[(i + 1) % n],
  };
};

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
