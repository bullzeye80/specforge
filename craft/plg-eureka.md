# PLG activation (EUREKA)

This is the activation discipline for every setup- and showcase-stage flow
specforge shapes. The active `DESIGN.md` decides *how* a flow looks and sounds;
this file decides *what* a flow must be structured to do — carry a user from
sign-up to First Strike along the shortest path that earns its steps, then keep
them on that path with the right intervention in the right place. Where
`plg-foundations` fixes the *targets* (First Strike, KUI, PAI), this file is the
*discipline* for reaching them. It is the agent-facing distillation the
`plg-flow` skill loads whenever it designs a setup- or showcase-stage flow, and
`plg-critique` loads whenever the flow under review targets First Strike.

> Adapted from `references/eureka.md` (Wes Bush & Ramli John, *Product-Led
> Onboarding*). Adapted, not parroted.

## Before any flow artifact — the outcome gate

A flow is designed *from* a clear target, never from a feature list. Before
producing `flow-graph.json` or `straight-line.md`, the agent confirms three
things exist and are specific:

| Check | Source | If missing |
|---|---|---|
| A clear `jtbd.job` statement | `product.md` `jtbd` | `blocker` finding — no flow |
| A measurable First Strike | `journey.md` `first-strike.measurable-as` | `blocker` — see `plg-foundations` |
| Which milestone this flow targets | `shape.md` narrative | `blocker` — flow has no aim |

- First Strike / KUI / the 5-stage roadmap are defined in `plg-foundations`;
  this file assumes them and does not restate their definitions.
- The Bumpers library below is a **Showcase-stage tool.** It is not deployed in
  Search or Setup. A tour or tooltip introduced before First Strike is a smell.

## The Straight-Line discipline

**Map every step from first touchpoint to First Strike. Then ruthlessly delete
or defer anything that doesn't lead there.** This is the sharpest tool against
onboarding bloat, and the core of what `straight-line.md` records.

`straight-line.md` carries three components — all required:

1. **The canonical success path** — the on-line steps, in order, sign-up →
   First Strike. Its `entry` is `flow-graph.json`'s `entry`; its terminus is
   `flow-graph.json`'s `first-strike-place` (which equals `exit-success` for a
   flow that targets First Strike).
2. **The off-line steps** — every other screen, branch, or decision present in
   the current flow that is *not* on the canonical path. These are visible in
   `flow-graph.json`'s `places` but flagged as deferral candidates.
3. **A disposition for every off-line step** — exactly one of:

| Disposition | Meaning | Frequency |
|---|---|---|
| **Delete** | The step has no purpose before *or* after First Strike; remove it | **Default** |
| **Defer** | Real purpose, wrong place; move to post-First-Strike | Second choice |
| **Keep w/ rationale** | Must stay pre-First-Strike; rationale is real (security, legal, technical) and written down | Rare exception |

- **The default disposition is delete; defer is second; keep is the exception.**
  Expect 30%+ of a wild flow's steps to fall in delete-or-defer, and don't be
  timid about saying so.
- An off-line step with **no explicit disposition fails the flow** — that is a
  hard `plg-critique` check, not a style note.
- Steps to challenge aggressively: "tell us about yourself" forms (defer),
  "invite your team" (defer), "choose your role / use case" (defer or convert
  to post-First-Strike personalisation), email verification before product
  access (keep only for real security/compliance, else defer), sample-data or
  template pickers (defer; ship a sensible default), plan selection on sign-up
  (delete if single-plan, else defer), tutorial videos (delete or convert to
  inline tooltips on the screen they describe).

### The Bowling Alley audit feeds the line

The flow is a lane, the user is the ball, First Strike is the pins, bumpers keep
the ball out of the gutter. The audit asks three questions and writes the answers
into `straight-line.md`'s drop-off candidates:

1. **Where are the gutters?** Steps where users stall, drop, or take the wrong path.
2. **What bumpers already exist,** and are they in the right place?
3. **Where must bumpers be added or removed?**

The output is a list of *gaps* (gutters with no bumper) and *redundancies*
(bumpers with no gutter). Every drop-off candidate names a measurable event so
the design is instrumentable *(guidance, not auto-checked)*.

### The 7-minute clock

- Any flow targeting First Strike gets `straight-line.md`'s `target-time` of
  **under 7 minutes by default** (the UDE rule from `plg-foundations`). Flows
  targeting a later milestone get looser budgets.
- The agent estimates per-step time and totals it. Over budget → shrink the flow
  (delete/defer more) or re-shape the First Strike target explicitly — **never
  silently extend the budget.** The budget is fixed; the flow bends.

## PAI — the leading indicator the flow must produce

`journey.md`'s `pai` block names the **single repeated activity** that predicts
retention — sitting between the one-time First Strike and the habit-threshold
KUI. The Straight-Line's job is to deliver the user to their *first* PAI event;
the Showcase flow's job is to make the *second and third* cheap.

PAI must satisfy all five characteristics, each recorded under
`journey.md`'s `pai.characteristics`:

| Characteristic | Schema field | Test |
|---|---|---|
| **Leading indicator of retention** | `leading-indicator` | Predicts retention *before* retention can be measured |
| **Repetitive — one key activity** | `repetitive: true` | A single activity, not a basket of them |
| **Tied to the desired outcome** | `tied-to-outcome` | Names the outcome; not a vanity metric |
| **Easy to understand** | `easy-to-understand` | The user could describe it in one sentence |
| **Time-bound** | `time-bound` | Has a frequency window, not a lifetime count |

- `pai.measurable-as` is `event × frequency` (e.g. `spec-published × 1 in
  any-day`) and **must count the same event KUI counts.** A PAI on a different
  event than KUI is a smell `plg-critique` catches (see `plg-foundations`).
- PAI is required whenever `journey.md` is authored at all.

## Keep users on the line — Bumpers

Once the Straight-Line is set, the agent places *bumpers* — interventions that
keep users on it. Two categories, both **Showcase-stage tools.**

### Product Bumpers — in-app

| Bumper | When | What it solves |
|---|---|---|
| **Welcome message** | First entry post-signup | Sets expectations; says where you are and what's next |
| **Product tour** | User can't act yet (demo data, tour-mode) | Orients to the surface |
| **Tooltip** | First encounter with a non-obvious affordance | Names a thing; teaches via doing |
| **Hotspot** | One affordance needs attention now | Visual nudge to the next step |
| **Progress bar** | Multi-step flow, finishability matters | Cuts abandonment (Zeigarnik) |
| **Checklist** | Setup has multiple required/optional steps | Externalises "what's left" |
| **Empty state** | A surface has no content yet | Says what *will* be here and how to make it appear |
| **Template / cheat sheet** | User must produce content, doesn't know where to start | Lowers the first attempt's cost |

- **Never** a notification centre, activity feed, or unread badge as a bumper —
  those are passive-triage shapes and are rejected (see
  `plg-personal-anti-patterns`).
- **Bumpers don't fix bad UX.** A bumper compensates for small friction; it
  can't rescue a broken Straight-Line. Reaching for *many* bumpers in one flow
  means redesign the flow, not add bumpers.
- Every bumper-shaped surface (`wireframe.json` modal welcome, tour overlay,
  tooltip, empty state) must **trace back to a drop-off candidate** in
  `straight-line.md`. A bumper with no drop-off candidate is a `warn`.

### Conversational Bumpers — out-of-product

Behaviour-triggered, never time-triggered.

| Channel | When | What it solves |
|---|---|---|
| **Behaviour-triggered email** | User stalled at a known drop-off point | Brings them back to the next step |
| **Push notification** | Time-sensitive milestone (a result is ready, someone acted) | Pulls attention without product re-entry |
| **SMS** | Critical or transactional confirmation only | Sparing; high attention cost |
| **Browser notification** | Web product, opted-in real-time event | Push's role for web |

- Every conversational bumper is **behaviour-triggered.** "Re-engagement email
  after 3 days of inactivity, pointing at the next step" is right. "Weekly
  digest every Friday" is content marketing, not a bumper. The *timing theory*
  (why a trigger fires when it does) lives in `plg-bj-fogg` — reference it,
  don't duplicate it here.

### Gutter → bumper choice

When the Bowling Alley audit finds a gutter, pick the bumper by what's missing
(the bridge to `plg-bj-fogg`'s Motivation × Ability × Prompt):

1. **Doesn't know *what* to do** (ability) → tooltip, hotspot, empty-state CTA.
2. **Doesn't see *why*** (motivation) → welcome message, progress bar, inline social proof.
3. **Gone from the product** (prompt) → behaviour-triggered email tied to that exact drop-off point.

## When EUREKA does not apply

This file assumes a setup- or showcase-stage flow. When the flow doesn't fit,
the agent says so in `shape.md`'s narrative and skips the EUREKA-specific fields
in `straight-line.md` — it does not fake them.

- **Search-stage flows** (marketing, comparison) — own discipline (Hero →
  Problem → Solution → Risk Reversal → CTA, see `plg-personal-anti-patterns`).
- **Scale-stage flows** (upgrade, advance) — own discipline (see `plg-moat`).
- **Internal tools** — activation framework largely doesn't apply, though the
  Straight-Line discipline still does.

## Common mistakes (lint these)

- An off-line step in `flow-graph.json` with no explicit disposition in
  `straight-line.md` (delete / defer / keep-with-rationale).
- Reaching for keep-with-rationale as the default, or a rationale that isn't a
  real security/legal/technical reason.
- A `target-time` over 7 minutes "fixed" by extending the budget instead of
  deleting/deferring steps or re-shaping the First Strike target.
- Sign-up or setup steps (profile, team invite, role picker, plan selection,
  tutorial video) kept pre-First-Strike with no deferral rationale.
- Product or Conversational Bumpers deployed in Search or Setup instead of
  Showcase.
- A bumper-shaped `wireframe.json` surface that traces to no drop-off candidate
  in `straight-line.md` (`warn`), or a drop-off candidate with no proposed bumper.
- A notification centre, activity feed, or unread badge proposed as a bumper.
- A conversational bumper that is time-triggered (weekly digest, N-day
  scheduled blast) rather than tied to a specific drop-off point on the line.
- Push or SMS without an explicit opt-in surface; SMS for anything non-critical.
- `journey.md` `pai` missing a characteristic, or `pai.measurable-as` counting
  a different event than KUI.
- Many bumpers stacked on one flow to paper over a broken Straight-Line instead
  of redesigning the flow.
</content>
</invoke>
