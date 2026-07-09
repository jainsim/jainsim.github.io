# Installer App

**Connecting the field to the platform — an end-to-end self-serve installation native mobile app.**

| | |
|---|---|
| **Role** | Lead UX/UI Designer |
| **Duration** | 6 months · 2 iterations |
| **Domain** | B2B SaaS · Native Mobile |
| **Client** | ChargePoint |
| **Year** | 2025 |

![Installer App — three-screen overview](../public/projects/installer/hero-3-screens.png)

---

## Context

ChargePoint runs one of the world's largest commercial EV charging networks. For its first decade it ran a direct-sales model — a tightly managed pipeline where every station activation was choreographed by an in-house team. Four years ago it shifted to a Value-Added Reseller model, and today roughly 90% of sales flow through partners like EATON. The activation process never caught up.

The result was two people living in two separate worlds. The electrician shows up on-site, mounts the hardware, scans serial numbers, confirms connectivity, and leaves — everything through the Installer App. The org admin never touches hardware; they manage policies, pricing, and activation afterward in Polaris Suite. Before this work, those two worlds didn't talk, and a Customer Experience agent had to bridge every single handoff by hand.

---

## The problem

Because the field app and the platform never shared a clean data handoff, every activation stalled at the seam between them.

- Stations arrived on the platform with no owner attached — nothing linked a deployed device to the organization that bought it.
- A CX agent had to step in on every activation to manually identify the owner and connect the stations.
- Installing 10 stations at one location meant running the same standalone flow 10 times.

What should have been a premium, self-serve experience became recurring operational overhead.

---

## Iteration 1 — MVP

I started by mapping the data handoff between field and platform end to end. The first challenge wasn't screens — it was flow: at what point in the physical workflow is org identity even knowable? Mapping the deployment surfaced three gaps the CX agent had been bridging, and the first release closed them.

- **Sites concept** — a physical address becomes the unit of work, so stations installed together stay together.
- **CMS declaration upfront** — ChargePoint cloud or a third-party system (be.ENERGISED, Studio); the two paths diverge immediately.
- **Org pre-assignment** — org identity pushed from Salesforce and shown on the installer's summary as a read-only signal.
- **Email-triggered activation** — a regional link (US/EU/CA, Prod/QA) sent to the org admin the moment the job is marked complete.

> **Design decision · CMS selection screen**
> ChargePoint hardware can be registered with a third-party CMS. If the activation email fires for a non-ChargePoint-managed station, the admin lands in Polaris with a station that can never be activated there. So I added a CMS selection step that forks the flow *before* any data is sent.
>
> **The trade-off:** it costs the installer one redundant tap in the 90%+ ChargePoint-managed case. I considered auto-detecting CMS from the hardware scan and rejected it — API coverage was incomplete, and non-ChargePoint hardware could still be provisioned in ChargePoint's cloud, so a scan couldn't reliably tell the two apart. One deliberate tap was cheaper than the most expensive failure in the old flow: a misrouted activation email.

**Internal stakeholder review — what the MVP got wrong**

Taking the MVP to review surfaced four failures that reshaped the next iteration:

1. **Silent pre-assignment failure** — when the API org link broke, there was no error feedback. The installer saw "Org ✓" while the admin received nothing.
2. **No asset visibility** — the admin had no way to confirm from Polaris what had actually been installed.
3. **Per-station email didn't scale** — a 30-station site fired 30 separate emails. Still manual, just a different shape.
4. **Meaningless default site name** — an auto-generated string like `450haciendacalifornia` meant nothing to the admin; it needed a clear naming convention or a mandatory rename.

**Screens**

- `create-site.png` — Create a site: grouping stations by location up front.
- `station-config.png` — Device configuration captured in the field, step by step.
- `email-activation.png` — Email-triggered activation: the owner receives a regional link and station table that deep-links into Polaris Suite.

---

## Iteration 2 — Refinement

Iteration 1 exposed two problems: a per-station email model that broke at scale, and an org pre-assignment flow that leaned on Salesforce data missing in about 30% of VAR transactions. Iteration 2 fixed both — and removing the dependency entirely turned out to be cleaner than improving the error state around it.

- **Org-agnostic completion** — the install finishes cleanly regardless of Salesforce data. The station queues in Polaris as "Ready for Activation" immediately, and the admin gets a regional link to attach it to their org afterward.
- **Job Summary screen** — all installed devices grouped into one submit event. One activation per site, not per station.
- **Add more stations + cluster devices** — after commissioning the first device, installers can loop back and add each subsequent station to the same job before submitting.
- **Regional self-activation links** — sent to admins once the job is complete.

**Screens**

- `skip-org.png` — Org-agnostic flow: the installer can skip Salesforce-dependent org data.
- `summary-one-station.png` — Setup complete: full system detail sent back to ChargePoint.
- `summary-cluster.png` — Job Summary: multiple stations rolled into one submission.
- `loop-or-submit.png` — Loop back to add another station, or complete the job.
- `summary-drawer.png` — Cluster summary with a node-detail drawer for multi-port stations.
- `station-management.png` — Polaris Suite: stations arrive queued for activation at the org level, with a manual add path as a fallback.

---

## Outcome

The handoff between field deployment and platform management became a single, unified data flow: a station commissioned in the field now shows up in Polaris ready to activate, with no CX involved. Enterprise accounts get their org pre-assigned via API; the VAR channel — 90% of sales — gets a regional activation link by email. Both routes land in the same place, on the admin's own timeline.

| Metric | |
|---|---|
| **0** | CX touches on the self-serve path |
| **1** | activation event per site & org, not per station |
| **2** | clean activation routes: enterprise pre-assign + VAR hyperlink |

White-glove activation stays available — now as a chargeable premium service rather than the default. That shifts agent cost from operational overhead to a revenue line.

**Screens**

- `activation-banner.png` — Polaris Suite: the org-level activation queue.
- `success.png` — Installation confirmed in the field.

---

## What two iterations taught me

Both iterations came down to the same move: letting go of an assumption I'd been designing around. The first version assumed org identity had to be resolved at the moment of install — and that one belief drove the whole flow into fragility. Once I stopped defending it, the design got simpler and sturdier. The pattern that mattered wasn't fixing screens; it was finding the locked assumption underneath them.

1. **Design for the data you have, not the data you need.** Pre-assignment assumed clean Salesforce data at install time. The field didn't have it. Designing from what was reliably present — the station MAC, the site address, the installer's job record — produced a flow that survived contact with reality.
2. **The handoff point is the design.** This was never about screens; it was about who holds responsibility at each point in a multi-party workflow. Designing the installer-to-admin handoff explicitly, instead of routing it through a CX agent, was the single decision that made self-serve viable.
3. **A PRD without engineering input isn't a requirement — it's an assumption.** The "sites" grouping sat in the PRD from day one and shaped two iterations before engineering review found it wasn't buildable as written. Earlier alignment between PM, dev, and design on what's actually shippable would have caught it before it set the direction.
4. **Two users in one flow means two jobs to honour.** The installer's job is physical; the admin's is operational. Demanding org identity at install time coupled them and violated both. Decoupling honoured both.

**What I chose not to do.** I didn't try to rescue the broken org pre-assignment with better error states. The cleaner call was to remove the dependency entirely and let the install complete without it. Designing the absence was more robust than designing the recovery.

---

## The bigger picture

**I didn't just design a field tool — I designed what it feeds.** The Installer App is the upstream half of a two-part system; the activation flow in Polaris Suite only works because this app captures the right data, in the right shape, at the right moment. The decisions that mattered most never show up in the UI — decoupling org identity from the install event, making the job record the unit of work instead of the individual station, letting the install complete cleanly even when Salesforce data wasn't there. That seam, not the app, is what I was designing.
