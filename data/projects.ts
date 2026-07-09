export type CaseImage = {
  src: string;
  width: number; // native px — feeds next/image so ratios stay exact
  height: number;
  caption?: string;
  // how the image sits in the reading flow:
  //  inline — grouped 2–3 across in a grid beside/after the copy (phone screens)
  //  phone  — a single small phone screen, centered, not stretched
  //  wide   — a portrait/composite shot, centered at a medium width
  //  full   — a landscape UI shot spanning the full image column
  layout?: "inline" | "phone" | "wide" | "full";
};

export type CaseMetric = { value: string; label: string };

export type CaseSection = {
  heading: string;
  body: string;
  points?: string[]; // scannable supporting points
  images?: CaseImage[];
  callout?: { label?: string; body: string }; // design-decision aside
  metrics?: CaseMetric[]; // stat band (used in Outcome)
};

export type HeroImage = {
  src: string;
  width: number; // native px — feeds next/image so nothing shifts or clips
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
  hero: HeroImage; // the home-page stage screenshot (device mockup, native ratio)
  overlayHero?: HeroImage; // wider hero shown at the top of the case-study overlay
  images: string[]; // first is the hero/panel image
  subtitle: string;
  meta: { label: string; value: string }[];
  sections: CaseSection[];
};

export const projects: Project[] = [
  {
    slug: "installer",
    index: "(01)",
    title: "Installer App",
    role: "Lead UX/UI Designer",
    discipline: "Native Mobile App",
    org: "ChargePoint",
    year: "2025",
    hero: { src: "/projects/installer-hero.png", width: 2117, height: 4328 },
    overlayHero: { src: "/projects/installer/hero-3-screens.png", width: 7009, height: 4152 },
    images: ["/projects/installer/hero-3-screens.png"],
    subtitle:
      "Connecting the field to the platform — an end-to-end self-serve installation native mobile app.",
    meta: [
      { label: "Role", value: "Lead UX/UI Designer" },
      { label: "Duration", value: "6 months · 2 iterations" },
      { label: "Domain", value: "B2B SaaS · Native Mobile" },
      { label: "Client", value: "ChargePoint" },
    ],
    sections: [
      {
        heading: "Context",
        body:
          "ChargePoint runs one of the world's largest commercial EV charging networks. For its first decade it ran a direct-sales model — a tightly managed pipeline where every station activation was choreographed by an in-house team. Four years ago it shifted to a Value-Added Reseller model, and today roughly 90% of sales flow through partners like EATON. The activation process never caught up.\n\nThe result was two people living in two separate worlds. The electrician shows up on-site, mounts the hardware, scans serial numbers, confirms connectivity, and leaves — everything through the Installer App. The org admin never touches hardware; they manage policies, pricing, and activation afterward in Polaris Suite. Before this work, those two worlds didn't talk, and a Customer Experience agent had to bridge every single handoff by hand.",
      },
      {
        heading: "The problem",
        body:
          "Because the field app and the platform never shared a clean data handoff, every activation stalled at the seam between them. What should have been a premium, self-serve experience became recurring operational overhead.",
        points: [
          "Stations arrived on the platform with no owner attached — nothing linked a deployed device to the organization that bought it.",
          "A CX agent had to step in on every activation to manually identify the owner and connect the stations.",
          "Installing 10 stations at one location meant running the same standalone flow 10 times.",
        ],
      },
      {
        heading: "Iteration 1 — MVP",
        body:
          "I started by mapping the data handoff between field and platform end to end. The first challenge wasn't screens — it was flow: at what point in the physical workflow is org identity even knowable? Mapping the deployment surfaced three gaps the CX agent had been bridging, and the first release closed them.",
        points: [
          "Sites concept — a physical address becomes the unit of work, so stations installed together stay together.",
          "CMS declaration upfront — ChargePoint cloud or a third-party system (be.ENERGISED, Studio); the two paths diverge immediately.",
          "Org pre-assignment — org identity pushed from Salesforce and shown on the installer's summary as a read-only signal.",
          "Email-triggered activation — a regional link (US/EU/CA, Prod/QA) sent to the org admin the moment the job is marked complete.",
        ],
        callout: {
          label: "Design decision · CMS selection screen",
          body:
            "ChargePoint hardware can be registered with a third-party CMS. If the activation email fires for a non-ChargePoint-managed station, the admin lands in Polaris with a station that can never be activated there. So I added a CMS selection step that forks the flow before any data is sent.\n\nThe trade-off: it costs the installer one redundant tap in the 90%+ ChargePoint-managed case. I considered auto-detecting CMS from the hardware scan and rejected it — API coverage was incomplete, and non-ChargePoint hardware could still be provisioned in ChargePoint's cloud, so a scan couldn't reliably tell the two apart. One deliberate tap was cheaper than the most expensive failure in the old flow: a misrouted activation email.",
        },
        images: [
          {
            src: "/projects/installer/create-site.png",
            width: 375,
            height: 1054,
            layout: "inline",
            caption: "Create a site — grouping stations by location up front.",
          },
          {
            src: "/projects/installer/station-config.png",
            width: 750,
            height: 2122,
            layout: "inline",
            caption: "Device configuration captured in the field, step by step.",
          },
          {
            src: "/projects/installer/email-activation.png",
            width: 2984,
            height: 4744,
            layout: "wide",
            caption:
              "Email-triggered activation — the owner receives a regional link and station table that deep-links into Polaris Suite.",
          },
        ],
      },
      {
        heading: "Stakeholder review — what the MVP got wrong",
        body: "Taking the MVP to review surfaced four failures that reshaped the next iteration:",
        points: [
          'Silent pre-assignment failure — when the API org link broke, there was no error feedback. The installer saw "Org ✓" while the admin received nothing.',
          "No asset visibility — the admin had no way to confirm from Polaris what had actually been installed.",
          "Per-station email didn't scale — a 30-station site fired 30 separate emails. Still manual, just a different shape.",
          "Meaningless default site name — an auto-generated string like 450haciendacalifornia meant nothing to the admin; it needed a clear naming convention or a mandatory rename.",
        ],
      },
      {
        heading: "Iteration 2 — Refinement",
        body:
          "Iteration 1 exposed two problems: a per-station email model that broke at scale, and an org pre-assignment flow that leaned on Salesforce data missing in about 30% of VAR transactions. Iteration 2 fixed both — and removing the dependency entirely turned out to be cleaner than improving the error state around it.",
        points: [
          'Org-agnostic completion — the install finishes cleanly regardless of Salesforce data. The station queues in Polaris as "Ready for Activation" immediately, and the admin gets a regional link to attach it to their org afterward.',
          "Job Summary screen — all installed devices grouped into one submit event. One activation per site, not per station.",
          "Add more stations + cluster devices — after commissioning the first device, installers can loop back and add each subsequent station to the same job before submitting.",
          "Regional self-activation links — sent to admins once the job is complete.",
        ],
        images: [
          {
            src: "/projects/installer/skip-org.png",
            width: 662,
            height: 1474,
            layout: "inline",
            caption: "Org-agnostic flow — the installer can skip Salesforce-dependent org data.",
          },
          {
            src: "/projects/installer/summary-one-station.png",
            width: 375,
            height: 1684,
            layout: "inline",
            caption: "Setup complete — full system detail sent back to ChargePoint.",
          },
          {
            src: "/projects/installer/summary-cluster.png",
            width: 750,
            height: 2886,
            layout: "inline",
            caption: "Job Summary — multiple stations rolled into one submission.",
          },
          {
            src: "/projects/installer/loop-or-submit.png",
            width: 2668,
            height: 3309,
            layout: "wide",
            caption: "Loop back to add another station, or complete the job.",
          },
          {
            src: "/projects/installer/summary-drawer.png",
            width: 1858,
            height: 2886,
            layout: "wide",
            caption: "Cluster summary with a node-detail drawer for multi-port stations.",
          },
          {
            src: "/projects/installer/station-management.png",
            width: 4222,
            height: 2212,
            layout: "full",
            caption:
              "Polaris Suite — stations arrive queued for activation at the org level, with a manual add path as a fallback.",
          },
        ],
      },
      {
        heading: "Outcome",
        body:
          "The handoff between field deployment and platform management became a single, unified data flow: a station commissioned in the field now shows up in Polaris ready to activate, with no CX involved. Enterprise accounts get their org pre-assigned via API; the VAR channel — 90% of sales — gets a regional activation link by email. Both routes land in the same place, on the admin's own timeline.\n\nWhite-glove activation stays available — now as a chargeable premium service rather than the default. That shifts agent cost from operational overhead to a revenue line.",
        metrics: [
          { value: "0", label: "CX touches on the self-serve path" },
          { value: "1", label: "activation event per site & org, not per station" },
          { value: "2", label: "clean activation routes: enterprise pre-assign + VAR hyperlink" },
        ],
        images: [
          {
            src: "/projects/installer/success.png",
            width: 375,
            height: 667,
            layout: "phone",
            caption: "Installation confirmed in the field.",
          },
        ],
      },
      {
        heading: "What two iterations taught me",
        body:
          "Both iterations came down to the same move: letting go of an assumption I'd been designing around. The first version assumed org identity had to be resolved at the moment of install — and that one belief drove the whole flow into fragility. Once I stopped defending it, the design got simpler and sturdier. The pattern that mattered wasn't fixing screens; it was finding the locked assumption underneath them.",
        points: [
          "Design for the data you have, not the data you need. Pre-assignment assumed clean Salesforce data at install time. The field didn't have it. Designing from what was reliably present — the station MAC, the site address, the installer's job record — produced a flow that survived contact with reality.",
          "The handoff point is the design. This was never about screens; it was about who holds responsibility at each point in a multi-party workflow. Designing the installer-to-admin handoff explicitly, instead of routing it through a CX agent, was the single decision that made self-serve viable.",
          'A PRD without engineering input isn\'t a requirement — it\'s an assumption. The "sites" grouping sat in the PRD from day one and shaped two iterations before engineering review found it wasn\'t buildable as written. Earlier alignment between PM, dev, and design on what\'s actually shippable would have caught it before it set the direction.',
          "Two users in one flow means two jobs to honour. The installer's job is physical; the admin's is operational. Demanding org identity at install time coupled them and violated both. Decoupling honoured both.",
        ],
        callout: {
          label: "What I chose not to do",
          body:
            "I didn't try to rescue the broken org pre-assignment with better error states. The cleaner call was to remove the dependency entirely and let the install complete without it. Designing the absence was more robust than designing the recovery.",
        },
      },
      {
        heading: "The bigger picture",
        body:
          "I didn't just design a field tool — I designed what it feeds. The Installer App is the upstream half of a two-part system; the activation flow in Polaris Suite only works because this app captures the right data, in the right shape, at the right moment. The decisions that mattered most never show up in the UI — decoupling org identity from the install event, making the job record the unit of work instead of the individual station, letting the install complete cleanly even when Salesforce data wasn't there. That seam, not the app, is what I was designing.",
      },
    ],
  },
  {
    slug: "activation",
    index: "(02)",
    title: "Station Activation Flow",
    role: "Lead UX/UI Designer",
    discipline: "Enterprise Workflow",
    org: "ChargePoint",
    year: "2025",
    hero: { src: "/projects/activation-hero.png", width: 5701, height: 3323 },
    images: ["/projects/activation.png"],
    subtitle:
      "Replacing an expert-only, support-dependent activation with a self-serve workflow any admin can run — designed embedded with engineering through build and design QA.",
    meta: [
      { label: "Role", value: "Lead UX/UI Designer" },
      { label: "Duration", value: "1 year · 4 iterations" },
      { label: "Domain", value: "B2B Enterprise SaaS" },
      { label: "Client", value: "ChargePoint" },
    ],
    sections: [
      {
        heading: "Context",
        body:
          "ChargePoint runs one of the world's largest EV charging networks — over 1.3 million ports across enterprise customers, property managers, and fleet operators. Polaris Suite gave Org Admins their first self-serve activation flow: a way to get stations live without leaning on a support team for every deployment.\n\nThe flow had to hold up across three very different B2B realities — a first-time site setup, a single-station expansion, and a multi-site rollout of hundreds of stations at once. I led it through four iterations over the course of a year.\n\nThree people move through this story. The Org Admin is the customer's own operations person — the user this flow is built for. The Deployment Specialist is ChargePoint internal staff, doing most activations today on the customer's behalf. The NOC operator handles activation at fleet scale across many customers at once. Behind them sit three legacy platforms — NOS, be.ENERGISED, and Viriciti — each built for a different hardware generation, which Polaris Suite is meant to eventually replace.",
      },
      {
        heading: "The problem",
        body:
          "The cost of all four problems below landed in the same place: a customer waited days for stations they'd already paid for and already had bolted to the ground.",
        points: [
          "Fragmented across three systems — activation logic lived across NOS, be.ENERGISED, and Viriciti, each built for a different hardware generation. There was no single place to activate, and the flow had to behave consistently across all three.",
          "No bulk workflow — activating 10 stations meant repeating the same flow 10 times. There was no way to apply a shared configuration across a site deployment.",
          "Disconnected from the installer ecosystem — the Installer Mobile App, Pinpoint Portal, and Salesforce operated in silos. Field data captured during installation wasn't connected to the activation flow.",
          "Plan selection required expert knowledge — cloud plan and policy selection took domain expertise most Org Admins didn't have, with no recommendations based on their use case or customer segment.",
        ],
        metrics: [
          { value: "3–5 days", label: "average time from hardware install to station live, before self-serve" },
          { value: "same day", label: "target time-to-live with self-serve activation via Polaris Suite" },
          { value: "< 40%", label: "of CX activation tickets estimated to be eliminated through self-serve" },
        ],
      },
      {
        heading: "What I walked into",
        body:
          "I joined ChargePoint a few weeks before the MVP shipped. The activation project had been scoped as a single large workstream with one big handoff at the end, tied to a hard deadline around a stakeholder workshop. That shape was workable for shipping one MVP — but it left no room for what I knew would actually happen: multiple iterations, each one reshaping the assumptions of the last.\n\nOver the next few quarters I pushed to split the work into smaller, topic-scoped workflows, each with its own dev handoff. The four iterations below are the result of that restructuring — each small enough to be designed, tested, and shipped without losing the thread between them.",
        images: [
          {
            src: "/projects/activation/walked-into.png",
            width: 2625,
            height: 651,
            layout: "full",
            caption:
              "Reshaping the work: one MVP workstream split into four topic-scoped phases, each with its own handoff, UAT, and CX testing across the year.",
          },
        ],
      },
      {
        heading: "Iteration 1 — MVP",
        body:
          "A three-step wizard for the simplest case: single stations, one site, default everything.\n\nBefore Polaris Suite, every activation ran through a ChargePoint Deployment Specialist — activation form, email, wait, confirm. The MVP compressed that into something an Org Admin could do themselves: a Charger Management view with an \"Activate Stations\" banner, a Ready-for-Activation list grouped by model family and site address, and a three-step wizard (Org & Plan → Energy Management → Summary).\n\nUAT · round 1. The round validated speed but not experience. The 4.5/5 score was misleading me: experienced specialists could finish fast because they already knew the data model — so what UAT actually measured was efficiency for experts, not learnability for new users. It also surfaced two gaps that went straight into Iteration 2: bulk activation didn't exist yet (everyone asked \"now how do I do fifty?\"), and token validity timing — sales-order date vs. activation date — was opaque from the UI.",
        points: ["Overall rating — 4.5 / 5", "Average activation time — under 5 minutes"],
        callout: {
          label: "Design decision · wizard over flat form",
          body:
            "Activation involves choices most Org Admins have never made before — cloud plans, warranties, energy-management groups. A single flat form would have surfaced all of them at once. I chose a three-step wizard with sensible defaults so a first-time user could finish by mostly clicking \"Next,\" while the structure left room to explain each choice in place.",
        },
        images: [
          {
            src: "/projects/activation/entry-point.png",
            width: 13482,
            height: 4164,
            layout: "full",
            caption:
              "The entry point — a Charger Management banner surfaces stations ready to activate; the list groups them by model family and site address.",
          },
          {
            src: "/projects/activation/wizard-steps.png",
            width: 7352,
            height: 3244,
            layout: "full",
            caption:
              "The three-step wizard — Org & Plan, then Energy Management — with recommended defaults prefilled.",
          },
        ],
      },
      {
        heading: "Iteration 2 — Bulk & recovery",
        body:
          "From single-station to fleet-scale: bulk activation, and recovery as a first-class state.\n\nThe MVP handled single stations cleanly but broke down at scale — and the first three customer rollouts confirmed it: real deployments are fleets, not stations. This iteration made the wizard fluent in bulk.\n\nUAT · round 2. Bulk activation and copy-config landed strongly. Two sharper, more operational gaps surfaced for Iteration 3: editing a station mid-wizard blew away the user's progress, forcing a restart; and the flow was still treating activation as a setup task, when for NOS-style technical stations — DC clusters, gateways, pinpointing dependencies — it's really a fleet-management task with prerequisites the UI was hiding.",
        points: [
          "Copy / Import Configuration — reuse the plan, policy, and group settings from an already-activated station. The round's biggest time-saver.",
          "Advanced Token selection — see and edit the sales order, start date, end date, and purchase order behind each token, resolving the Iteration 1 ambiguity.",
          "Token-mismatch recovery dialog — a clear surface for the most common bulk-activation failure.",
        ],
        callout: {
          label: "The call I'd most want to defend",
          body:
            "Two of three Phase 1 customers had silently hit the token-mismatch path and assumed the product was broken — they didn't know they'd hit a recoverable error, because the system was treating failure as a dead end. Designing recovery as a first-class state — \"here's what went wrong, here's how to fix it\" — was a small UI change but a real mental-model shift for the flow.",
        },
        images: [
          {
            src: "/projects/activation/copy-config.png",
            width: 6454,
            height: 4872,
            layout: "full",
            caption: "Copy / Import Configuration reuses an activated station's plan, policy, and group settings.",
          },
          {
            src: "/projects/activation/advanced-token.png",
            width: 5182,
            height: 6376,
            layout: "wide",
            caption:
              "Advanced Token Selection with sales-order and date detail — and the token-mismatch recovery dialog that turns a dead end into a fixable state.",
          },
        ],
      },
      {
        heading: "Iteration 3 — NOS & the silent failure modes",
        body:
          "Porting the flow into NOS, and meeting the failure modes Polaris had been quietly ignoring.\n\nPorting into NOS forced a reckoning. The NOS hardware ecosystem — DC fast chargers, gateway devices, larger commissioning dependencies — had three failure modes Polaris's lighter hardware never really exposed: a station could be physically installed but not yet commissioned by an engineer, the gateway it relied on could be missing or offline, or its GPS pinpointing could still be pending. In all three cases, an operator could run the wizard end to end and only discover at the very end that activation was never going to work.\n\nSo I moved those checks upstream — pre-activation signals and an async progress state that surface a blocker before the operator invests in the flow, explained in place rather than as a terminal error.\n\nUAT · round 3. Internal feedback from CX, support engineers, enterprise users, and deployment supervisors was strongly positive. One structural gap remained: multi-port and cluster stations still rendered as a flat list. A 13-port DC station was technically activatable, but operators couldn't see parent–child structure or trace a fault back to the dispenser it came from. That fed Iteration 4.",
        callout: {
          label: "Internal review · CX lead",
          body: "\"The DC blocker banner alone saves us a support ticket every other day.\"",
        },
        images: [
          {
            src: "/projects/activation/failure-states.png",
            width: 3982,
            height: 2874,
            layout: "full",
            caption: "Pre-activation blockers surfaced early — uncommissioned hardware, gateway offline, GPS pending.",
          },
          {
            src: "/projects/activation/async-progress.png",
            width: 5274,
            height: 2244,
            layout: "full",
            caption: "Async activation progress, so a long-running activation reads as progress, not a frozen screen.",
          },
        ],
      },
      {
        heading: "Iteration 4 — Cluster hierarchy (rolling out)",
        body:
          "Iteration 4 extends the same row-level visibility into cluster hardware — nesting each child port under its parent Chargebox so a fleet of clusters reads as a glanceable hierarchy instead of a hundred-row scroll. Currently rolling out; full impact is being measured.",
        images: [
          {
            src: "/projects/activation/dc-cluster.png",
            width: 3800,
            height: 3370,
            layout: "full",
            caption: "Cluster ports nested under their parent Chargebox.",
          },
        ],
      },
      {
        heading: "Design QA & defect resolution",
        body:
          "Once the build started, I ran design QA against the dev builds — reviewing implementations against spec, logging defects in Jira, and driving resolution with engineering before release. This wasn't handoff-and-leave: I stayed embedded through build and triaged design defects as a first-class engineering workstream, not a polish pass at the end. Defects were caught and resolved pre-release rather than post-launch, cutting the design debt that usually accumulates between handoff and ship.",
      },
      {
        heading: "What four iterations taught me",
        body:
          "The biggest design decision on this project never appeared in a Figma file — it was the shape of the work itself. I inherited the activation flow as one large workstream with a single handoff at the end: workable for shipping one MVP, wrong for a problem that would reshape its own assumptions four times over. Splitting it into four topic-scoped iterations, each with its own handoff and its own testing, is what let the design respond to what every round of UAT actually surfaced.",
        points: [
          "Handoff doesn't end at the Figma file. From Phase 3 on, I ran QA on the dev builds myself — clicking every state, breaking the flow on purpose, logging tickets straight to engineering. It saved a full round of CX escalations and sharpened my instinct for which edge cases actually mattered.",
          "Stay close to support. The most valuable feedback never came from formal UAT — it came from CX and deployment specialists telling me what was annoying them that week. Iteration 3's pre-activation signals existed because someone in support was tired of the same three failure tickets.",
          "The unhappy path is the product. Real deployments fail quietly — uncommissioned hardware, a missing gateway, GPS still pending — and the original flow only surfaced those at the very end, after the user thought they were done. Designing the failure states as first-class moments, caught early and explained in place, did more for trust than any polish on the happy path.",
        ],
      },
      {
        heading: "The bigger picture",
        body:
          "The shape of the work was the design. This project changed how I think about scope. The original single-stream structure would have produced one big handoff and no room to respond to what each round of testing taught us. Splitting it into topic-scoped workflows — bulk activation, the NOS port, clusters — each with its own deadline and its own QA, was as much a design decision as any screen I shipped.\n\nAnd because I owned the upstream Installer App too, I could close the gaps that stay invisible when two products are designed apart: the station appearing in the admin's queue, the pre-assigned org, the regional activation link — all depend on data captured in the field. Owning both sides is what made same-day, self-serve activation possible at all.",
        images: [
          {
            src: "/projects/activation/data-sync.png",
            width: 3240,
            height: 957,
            layout: "full",
            caption:
              "Field-to-platform data sync — the admin's queue, the pre-assigned org, and the regional activation link all depend on data captured in the Installer App.",
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
    discipline: "Design Systems",
    org: "The Mobility House",
    year: "2024",
    hero: { src: "/projects/designgrid-hero.png", width: 5765, height: 3340 },
    images: ["/projects/designgrid.png"],
    subtitle: "The infrastructure behind a three-product enterprise SaaS suite.",
    meta: [
      { label: "Role", value: "UX/UI Designer" },
      { label: "Duration", value: "9 months" },
      { label: "Domain", value: "B2B Enterprise SaaS" },
      { label: "Client", value: "The Mobility House" },
    ],
    sections: [
      {
        heading: "Context & Problem",
        body: "The product ecosystem was fragmented — each application spoke its own interface language, with inconsistent components and competing definitions of basic UI elements. Teams rebuilt identical components across three codebases, slowing engineering velocity and making new products nearly impossible to scale.",
      },
      {
        heading: "Approach",
        body: "Adopted Brad Frost's Atomic Design hierarchy to enforce consistency through structure, on an Ant Design foundation customized for brand alignment. Three pillars: accessibility built in from the start (WCAG before shipping), collaborative development with engineering, and a dual source of truth — Figma for decisions, code for implementation, validated with Chromatic.",
      },
      {
        heading: "System & Adoption",
        body: "Structured the system from atoms to templates and treated adoption as the real work — pairing with product teams, demonstrating component rationale, and treating edge cases as system insights rather than exceptions. Chromatic visual regression testing held quality across viewports and states.",
      },
      {
        heading: "Outcome",
        body: "An 80% reduction in development time for new products and features, recurring design/engineering duplication eliminated, and a coherent experience across the entire suite — infrastructure-level design that changed how teams make decisions.",
      },
    ],
  },
  {
    slug: "cocreate",
    index: "(04)",
    title: "CoCreate",
    role: "Product Designer",
    discipline: "Product Design",
    org: "In Progress",
    year: "2026",
    inProgress: true,
    hero: { src: "/projects/cocreate-hero.png", width: 2117, height: 4452 },
    images: ["/projects/cocreate.png"],
    subtitle: "A collaborative design initiative — case study in progress.",
    meta: [
      { label: "Role", value: "Product Designer" },
      { label: "Status", value: "In Progress" },
      { label: "Domain", value: "Product Design" },
    ],
    sections: [
      {
        heading: "In Progress",
        body: "This case study is being written. CoCreate explores collaborative, multiplayer workflows for enterprise teams — check back soon for the full story, or reach out and I'll walk you through it.",
      },
    ],
  },
];

export const projectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);

/** Previous/next projects in gallery order, wrapping around the ends. */
export const adjacentProjects = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: null, next: null };
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  return { prev, next };
};
