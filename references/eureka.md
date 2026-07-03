---
file: references/eureka.md
purpose: The onboarding framework — Straight-Line discipline, Bowling Alley diagnostic, Product/Conversational Bumpers.
load-when: plg-flow (always when designing setup-stage or showcase-stage flows), plg-critique (always when target is a flow whose target is First Strike).
last-updated: 2026-04-27
---

# EUREKA

EUREKA is the activation framework. It governs the user's path from sign-up to First Strike, and from First Strike to KUI. Where `prod-led-foundations.md` defines the *targets* (First Strike and KUI), this file defines the *discipline* for getting users to them.

The acronym is a process: **E**stablish team → **U**nderstand outcomes → **R**efine success criteria → **E**valuate path → **K**eep users engaged → **A**pply and iterate. The agent uses the second through fifth steps directly; the first and sixth are organisational concerns outside the framework's design surface.

Use this reference when:

- Authoring `straight-line.md` (entire content of this file applies)
- Authoring `flow-graph.json` for any setup or showcase flow
- Choosing interventions (this file specifies *which* bumpers; `bj-fogg.md` specifies *why*)
- Running `plg-critique` on a setup or showcase flow

Source: Wes Bush and Ramli John, *Product-Led Onboarding*. Adapted, not parroted.

---

## Understand outcomes (U)

Before designing a flow, the agent must know what outcome the flow delivers. This is the JTBD layer — `product.md`'s `jtbd` block plus `journey.md`'s First Strike definition.

The agent's check before producing any flow artifacts:

1. Does `product.md` have a clear `jtbd.job` statement?
2. Does `journey.md` have a measurable First Strike?
3. Does the flow's `shape.md` declare which milestone it targets?

If any of these is missing or vague, the agent stops and surfaces a `blocker` finding. Flow design proceeds from clear targets, never from feature lists.

---

## Refine success criteria (R) — PAI

The Product Adoption Indicator is the leading indicator that the flow is working. PAI is *not* the same as KUI:

- **First Strike** = the *first* time core value is experienced. A discrete, one-time event.
- **KUI** = the user has experienced value enough times to form a habit. Event × count × window.
- **PAI** = the *single repeated activity* that, if a user does it, is the leading indicator they will reach KUI.

For a Slack-shaped product where KUI is `message-sent × 2000 in 30-days`, the PAI might be `message-sent × 1 in any-day` — repeated daily activity is the leading indicator.

PAI must satisfy five characteristics:

1. **Leading indicator of retention** — predicts retention before retention can be measured
2. **Focuses on repetition of one key activity** — single activity, not a basket
3. **Tied to desired outcomes** — not a vanity metric
4. **Easy to understand** — the user could describe it in a sentence
5. **Time-bound** — has a frequency component, not a lifetime count

**Schema field:** `journey.md` should declare PAI alongside First Strike and KUI. (This is a v0.2 addition to the schema.)

---

## Evaluate the path (E) — Bowling Alley + Straight-Line

The agent uses two diagnostic tools to evaluate the activation path: the Bowling Alley audit and the Straight-Line discipline.

### The Bowling Alley audit

The flow is a bowling lane. The user is the ball. First Strike is the pins. Bumpers are the things on either side that keep the ball from going in the gutter.

The audit asks three questions of any flow:

1. **Where are the gutters?** Steps where users drop off, stall, or take the wrong path.
2. **What bumpers exist?** Existing interventions (tooltips, emails, empty states, etc.).
3. **Where do bumpers need to be added or removed?**

The output of the audit is a list of *gaps* (gutters with no bumpers) and *redundancies* (bumpers in the wrong place). The agent surfaces both in `straight-line.md`'s drop-off candidates section.

### The Straight-Line discipline

**Map every step from first touchpoint to First Strike. Then ruthlessly delete or defer anything that doesn't lead there.**

This is the most operationally useful part of EUREKA. It's the discipline that prevents onboarding bloat.

The Straight-Line for any flow has three components:

1. **The straight line itself** — the canonical success path, step by step.
2. **Steps not on the line** — every other path, decision branch, or screen present in the current flow that is *not* on the straight line.
3. **Disposition for each off-line step** — for every off-line step, the agent assigns one of three:
   - **Delete** — the step has no purpose; remove it.
   - **Defer** — the step has a purpose but it doesn't belong before First Strike. Move it to post-First-Strike.
   - **Keep with rationale** — the step must stay before First Strike. The rationale must be a real reason (security, legal, technical) and must be documented in `straight-line.md`.

**The default disposition is delete.** Defer is second. Keep-with-rationale is the rare exception.

Most onboarding flows the agent encounters in the wild have 30%+ of their steps in the delete or defer buckets. The agent should expect to find this and not be timid about it.

Common steps the agent should aggressively challenge:

- **"Tell us about yourself" forms** — almost always defer
- **"Invite your team" steps** — almost always defer
- **"Choose your role" or "What's your use case"** — defer or convert to post-First-Strike personalisation
- **Email verification before product access** — keep only if security or compliance requires; otherwise defer
- **Sample data or template selection** — defer; provide a sensible default
- **Plan selection on signup** — delete (single plan) or defer (post-First-Strike)
- **Tutorial videos** — delete or convert to inline tooltips on the relevant screens

**Schema field:** `straight-line.md` requires both the canonical success path and the off-line steps with dispositions. The `plg-critique` check fails the flow if off-line steps exist without explicit dispositions.

### The 7-minute discipline

The Straight-Line for any flow whose target is First Strike has a `target-time` of `under 7 minutes` by default (per `prod-led-foundations.md`'s UDE test).

The agent estimates per-step time and totals. If the total exceeds 7 minutes, the agent must shrink the flow — either by deleting/deferring more, or by changing the First Strike target (but only via a re-shape, not silently).

The agent never extends the time budget to fit the flow. The budget is fixed; the flow bends.

---

## Keep users engaged (K) — Bumpers

Once the Straight-Line is set, the agent decides where to place *bumpers* — the interventions that keep users on the line.

There are two categories.

### Product Bumpers — in-app interventions

Bumpers that live inside the product surface itself. The full library:

| Bumper | When to use | What it solves |
|---|---|---|
| **Welcome message** | First entry to the product post-signup | Sets expectations; tells the user where they are and what's next |
| **Product tour** | When the user can't act yet (e.g. demo data, tour-mode entry) | Orients the user to the surface |
| **Tooltip** | The first time a user encounters a non-obvious affordance | Names a thing; teaches via doing, not telling |
| **Hotspot** | A specific affordance needs attention now | Visual nudge to the next step |
| **Progress bar** | Multi-step flow where the user benefits from knowing where they are | Reduces abandonment by showing finishability (Zeigarnik effect) |
| **Checklist** | Setup or onboarding has multiple optional/required steps | Externalises the "what's left" question |
| **Empty state** | A surface has no content yet | Tells the user what *will* be here and how to make it appear |
| **Template / cheat sheet** | The user has to produce content but doesn't know where to start | Lowers the activation cost of the first attempt |

**Critical constraint, per `personal-anti-patterns.md`:** the agent never produces a notification centre, activity feed, or unread badge as a bumper. These are passive-message-triage shapes and are rejected.

**Critical constraint, per the framework itself:** bumpers don't fix bad UX. A bumper can compensate for a small friction point, but it can't rescue a flow that has a fundamentally broken Straight-Line. If the agent finds itself reaching for many bumpers in one flow, the answer is to redesign the flow, not add more bumpers.

### Conversational Bumpers — out-of-product interventions

Bumpers that live outside the product surface. Behaviour-triggered, not time-triggered.

| Channel | When to use | What it solves |
|---|---|---|
| **Behaviour-triggered email** | User has stalled on the Straight-Line at a known drop-off point | Brings them back to the next step |
| **Push notification** | Time-sensitive milestone (an action others took, a result is ready) | Pulls attention without requiring product re-entry |
| **SMS** | Critical confirmation or transactional moment only | Use sparingly; high attention cost |
| **Browser notification** | Web product, real-time event the user opted in to | Same role as push for native apps |

**The discipline (per `bj-fogg.md`):** every conversational bumper is *behaviour-triggered*, not time-triggered. "Send re-engagement email after 3 days of inactivity" is the right shape. "Send weekly digest every Friday" is the wrong shape — that's a content marketing pattern, not a bumper.

The agent never produces:

- Time-based scheduled emails as bumpers (these are content marketing, not activation)
- Re-engagement emails that don't tie to a specific drop-off point on the Straight-Line
- Push notifications without an explicit opt-in surface
- SMS for anything that isn't transactional or critical

---

## Apply and iterate (A)

Out of scope for the agent's design surface. This is the org/data layer — instrumenting the flow, observing drop-off, refining bumpers. The agent's contribution is to make the design *instrumentable*: every step in the Straight-Line should map to a measurable event, and `straight-line.md`'s drop-off candidates should name the events.

---

## Bowling Alley → Bumper mapping

When the agent identifies a gutter (drop-off point) in the Bowling Alley audit, it picks a bumper using a simple rule:

1. **Is the user stalling because they don't know what to do?** → Tooltip, hotspot, or empty state with CTA. (Ability problem.)
2. **Is the user stalling because they don't see why to do it?** → Welcome message, progress bar, or social proof inline. (Motivation problem.)
3. **Is the user gone from the product entirely?** → Behaviour-triggered email tied to the specific drop-off point. (Prompt problem.)

This rule is the bridge to `bj-fogg.md` — the underlying theory is that behaviour requires Motivation × Ability × Prompt, and the bumper choice depends on which of those is missing.

---

## What this means for the artifact schema

Direct mappings:

- `straight-line.md` is the literal instantiation of the Straight-Line discipline. Required fields: canonical path, off-line steps with dispositions, target-time, drop-off candidates with hypotheses and proposed bumpers.
- `flow-graph.json`'s `places` should include all places, on-line and off-line. Off-line places are visible in the graph but flagged as deferral candidates.
- `wireframe.json`'s `kind` includes bumper-shaped surfaces (modal welcome, tour overlay, tooltip, empty state). Each must trace back to a drop-off candidate in `straight-line.md`.
- `plg-critique` runs three checks against this file:
  1. Does the flow have an explicit Straight-Line with disposition for off-line steps?
  2. Does total estimated time meet the target-time?
  3. Does each drop-off candidate have a proposed bumper, and does each bumper trace to a drop-off candidate?

A bumper without a drop-off candidate is a `warn` finding — it might be there for a reason, but the agent flags it.

---

## When EUREKA does not apply

This file assumes a setup-stage or showcase-stage flow. It does not apply to:

- **Search-stage flows** (marketing, comparison) — those have their own discipline (Hero → Problem → Solution → Risk Reversal → CTA, per `personal-anti-patterns.md`)
- **Scale-stage flows** (upgrade, advance) — those have their own discipline (per `moat.md`'s symmetric escape rule and the upgrade surface placement table)
- **Internal tools** — the user has no choice about using the product; activation framework largely doesn't apply, though Straight-Line discipline still does

When the flow doesn't fit, the agent says so explicitly in `shape.md`'s narrative, and skips the EUREKA-specific fields in `straight-line.md`.
