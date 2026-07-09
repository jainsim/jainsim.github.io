# Activation Flow

**Replacing an expert-only, support-dependent activation with a self-serve workflow any admin can run — designed embedded with engineering through build and design QA.**

| | |
|---|---|
| **Role** | Lead UX/UI Designer |
| **Duration** | 1 year · 4 iterations |
| **Domain** | B2B · Enterprise SaaS |
| **Client** | ChargePoint |
| **Year** | 2025 |

![Activation Flow — hero](../public/projects/activation/hero.png)

---

## Context

ChargePoint runs one of the world's largest EV charging networks — over 1.3 million ports across enterprise customers, property managers, and fleet operators. Polaris Suite gave Org Admins their first self-serve activation flow: a way to get stations live without leaning on a support team for every deployment.

The flow had to hold up across three very different B2B realities — a first-time site setup, a single-station expansion, and a multi-site rollout of hundreds of stations at once. I led it through four iterations over the course of a year.

Three people move through this story. The **Org Admin** is the customer's own operations person — the user this flow is built for. The **Deployment Specialist** is ChargePoint internal staff, doing most activations today on the customer's behalf. The **NOC operator** handles activation at fleet scale across many customers at once. Behind them sit three legacy platforms — NOS, be.ENERGISED, and Viriciti — each built for a different hardware generation, which Polaris Suite is meant to eventually replace.

---

## The problem

- **Fragmented across three systems.** Activation logic lived across NOS, be.ENERGISED, and Viriciti, each built for a different hardware generation. There was no single place to activate, and the flow had to behave consistently across all three.
- **No bulk workflow.** Activating 10 stations meant repeating the same flow 10 times. There was no way to apply a shared configuration across a site deployment.
- **Disconnected from the installer ecosystem.** The Installer Mobile App, Pinpoint Portal, and Salesforce operated in silos. Field data captured during installation wasn't connected to the activation flow.
- **Plan selection required expert knowledge.** Cloud plan and policy selection took domain expertise most Org Admins didn't have — with no recommendations based on their use case or customer segment.

The cost of all four landed in the same place: a customer waited days for stations they'd already paid for and already had bolted to the ground.

| Metric | |
|---|---|
| **3–5 days** | average time from hardware install to station live, before self-serve |
| **same day** | target time-to-live with self-serve activation via Polaris Suite |
| **< 40%** | of CX activation tickets estimated to be eliminated through self-serve |

---

## What I walked into

I joined ChargePoint a few weeks before the MVP shipped. The activation project had been scoped as a single large workstream with one big handoff at the end, tied to a hard deadline around a stakeholder workshop. That shape was workable for shipping one MVP — but it left no room for what I knew would actually happen: multiple iterations, each one reshaping the assumptions of the last.

Over the next few quarters I pushed to split the work into smaller, topic-scoped workflows, each with its own dev handoff. The four iterations below are the result of that restructuring — each small enough to be designed, tested, and shipped without losing the thread between them.

---

## Iteration 1 — MVP

**A three-step wizard for the simplest case: single stations, one site, default everything.**

Before Polaris Suite, every activation ran through a ChargePoint Deployment Specialist — activation form, email, wait, confirm. The MVP compressed that into something an Org Admin could do themselves: a Charger Management view with an "Activate Stations" banner, a Ready-for-Activation list grouped by model family and site address, and a three-step wizard (Org & Plan → Energy Management → Summary).

> **Design decision · wizard over flat form**
> Activation involves choices most Org Admins have never made before — cloud plans, warranties, energy-management groups. A single flat form would have surfaced all of them at once. I chose a three-step wizard with sensible defaults so a first-time user could finish by mostly clicking "Next," while the structure left room to explain each choice in place.

**UAT · round 1.** The round validated speed but not experience. The 4.5/5 score was misleading me: experienced specialists could finish fast because they already knew the data model — so what UAT actually measured was efficiency for experts, not learnability for new users. It also surfaced two gaps that went straight into Iteration 2: bulk activation didn't exist yet (everyone asked "now how do I do fifty?"), and token validity timing — sales-order date vs. activation date — was opaque from the UI.

- Overall rating: **4.5 / 5**
- Avg. activation time: **< 5 min**

**Screens**

- `entry-point.png` — Charger Management view with the "Activate Stations" banner and Ready-for-Activation list.

---

## Iteration 2 — Bulk & recovery

**From single-station to fleet-scale: bulk activation, and recovery as a first-class state.**

The MVP handled single stations cleanly but broke down at scale — and the first three customer rollouts confirmed it: real deployments are fleets, not stations. This iteration made the wizard fluent in bulk.

- **Copy / Import Configuration** — reuse the plan, policy, and group settings from an already-activated station. The round's biggest time-saver.
- **Advanced Token selection** — see and edit the sales order, start date, end date, and purchase order behind each token, resolving the Iteration 1 ambiguity.
- **Token-mismatch recovery dialog** — a clear surface for the most common bulk-activation failure.

> **The call I'd most want to defend.**
> Two of three Phase 1 customers had silently hit the token-mismatch path and assumed the product was broken — they didn't know they'd hit a *recoverable* error, because the system was treating failure as a dead end. Designing recovery as a first-class state — "here's what went wrong, here's how to fix it" — was a small UI change but a real mental-model shift for the flow.

**UAT · round 2.** Bulk activation and copy-config landed strongly. Two sharper, more operational gaps surfaced for Iteration 3: editing a station mid-wizard blew away the user's progress, forcing a restart; and the flow was still treating activation as a *setup* task, when for NOS-style technical stations — DC clusters, gateways, pinpointing dependencies — it's really a *fleet-management* task with prerequisites the UI was hiding.

**Screens**

- `copy-config.png` — Copy / Import Configuration from an activated station.
- `advanced-token.png` — Advanced Token view with sales-order and date detail.

---

## Iteration 3 — NOS & the silent failure modes

**Porting the flow into NOS, and meeting the failure modes Polaris had been quietly ignoring.**

Porting into NOS forced a reckoning. The NOS hardware ecosystem — DC fast chargers, gateway devices, larger commissioning dependencies — had three failure modes Polaris's lighter hardware never really exposed: a station could be physically installed but not yet commissioned by an engineer, the gateway it relied on could be missing or offline, or its GPS pinpointing could still be pending. In all three cases, an operator could run the wizard end to end and only discover at the very end that activation was never going to work.

So I moved those checks upstream — pre-activation signals and an async progress state that surface a blocker *before* the operator invests in the flow, explained in place rather than as a terminal error.

**UAT · round 3.** Internal feedback from CX, support engineers, enterprise users, and deployment supervisors was strongly positive.

> "The DC blocker banner alone saves us a support ticket every other day." — CX lead, internal review

One structural gap remained: multi-port and cluster stations still rendered as a flat list. A 13-port DC station was technically activatable, but operators couldn't see parent–child structure or trace a fault back to the dispenser it came from. That fed Iteration 4.

**Screens**

- `failure-states.png` — Pre-activation blockers surfaced early (uncommissioned, gateway offline, GPS pending).
- `async-progress.png` — Async activation progress state.

---

## Iteration 4 — Cluster hierarchy *(rolling out)*

Iteration 4 extends the same row-level visibility into cluster hardware — nesting each child port under its parent Chargebox so a fleet of clusters reads as a glanceable hierarchy instead of a hundred-row scroll. Currently rolling out; full impact is being measured.

**Screens**

- `dc-cluster.png` — Cluster stations nested under their parent Chargebox.

---

## Design QA & defect resolution

Once the build started, I ran design QA against the dev builds — reviewing implementations against spec, logging defects in Jira, and driving resolution with engineering before release. This wasn't handoff-and-leave: I stayed embedded through build and triaged design defects as a first-class engineering workstream, not a polish pass at the end. Defects were caught and resolved pre-release rather than post-launch, cutting the design debt that usually accumulates between handoff and ship.

---

## What four iterations taught me

The biggest design decision on this project never appeared in a Figma file — it was the shape of the work itself. I inherited the activation flow as one large workstream with a single handoff at the end: workable for shipping one MVP, wrong for a problem that would reshape its own assumptions four times over. Splitting it into four topic-scoped iterations, each with its own handoff and its own testing, is what let the design respond to what every round of UAT actually surfaced.

1. **Handoff doesn't end at the Figma file.** From Phase 3 on, I ran QA on the dev builds myself — clicking every state, breaking the flow on purpose, logging tickets straight to engineering. It saved a full round of CX escalations and sharpened my instinct for which edge cases actually mattered.
2. **Stay close to support.** The most valuable feedback never came from formal UAT — it came from CX and deployment specialists telling me what was annoying them that week. Iteration 3's pre-activation signals existed because someone in support was tired of the same three failure tickets. That insight doesn't show up in a research plan.
3. **The unhappy path is the product.** Real deployments fail quietly — uncommissioned hardware, a missing gateway, GPS still pending — and the original flow only surfaced those at the very end, after the user thought they were done. Designing the failure states as first-class moments, caught early and explained in place, did more for trust than any polish on the happy path.

---

## The bigger picture

**The shape of the work was the design.** This project changed how I think about scope. The original single-stream structure would have produced one big handoff and no room to respond to what each round of testing taught us. Splitting it into topic-scoped workflows — bulk activation, the NOS port, clusters — each with its own deadline and its own QA, was as much a design decision as any screen I shipped.

And because I owned the upstream Installer App too, I could close the gaps that stay invisible when two products are designed apart: the station appearing in the admin's queue, the pre-assigned org, the regional activation link — all depend on data captured in the field. Owning both sides is what made same-day, self-serve activation possible at all.

![Data sync between field and platform](../public/projects/activation/data-sync.png)
