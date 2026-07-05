# PLG foundations

This is the spine of every product specforge shapes. The active `DESIGN.md`
decides *how* a product looks and sounds; this file decides *what* the product
must be structured to do — move a user from problem-aware to power user through
five stages, with two design targets (First Strike and KUI) that every flow
ultimately serves. Where `personal-anti-patterns` is the lens for what *not* to
do, this file is the structure for what *to* build. It is the agent-facing
distillation the `plg-shape`, `plg-flow`, and `plg-critique` skills load whole.

> Adapted from `references/prod-led-foundations.md` (Wes Bush, *The Product-Led
> Playbook* / *Product-Led Onboarding*). Adapted, not parroted.

## The 5-stage roadmap

Every user moves through five stages, each with two milestones. This is the
canonical structure for `journey.md`'s `stages` block.

| Stage | Milestone 1 | Milestone 2 | What's happening |
|---|---|---|---|
| **Search** | Problem Aware | Active Research | Realises the problem, starts looking |
| **Select** | Visit | Sign Up | Finds the product, decides to try, creates an account |
| **Setup** | Profile | Onboarding | Configures, gets oriented |
| **Showcase** | **First Strike** | **KUI** | Experiences value, then experiences it repeatedly |
| **Scale** | Upgrade | Advance | Pays, then grows into sophisticated use |

The two **Showcase** milestones are the targets everything else serves. When
it is unclear what a flow is *for*, the answer is almost always "it serves
First Strike or KUI." A flow that serves neither is a deferral candidate.

## First Strike

**The first time the user experiences core value** — not the first time they
see the product, sign up, or finish onboarding. For Slack it is the first
message that gets a reply; for a spec tool, the first spec published and
shareable via URL.

- First Strike must be **measurable as a discrete event.** The agent must
  always be able to point to one moment and say "that's it." If it can't, the
  product hasn't decided what its core value is, and `plg-shape` surfaces that
  as the first open question — it does not guess (see `personal-anti-patterns`).
- **Schema hook:** `journey.md`'s `first-strike.measurable-as` is required and
  must name a specific user action or system event, not a feeling.
  `first-strike.appears-in` references the `screen:` where it lands.

| Rejected (not measurable / wrong stage) | Accepted (event + specificity) |
|---|---|
| "User feels productive" | "First message in a channel receives a reply within 24 h" |
| "User completes onboarding" *(onboarding is upstream of First Strike)* | "First spec is published and shareable via URL" |
| "User makes their first edit" *(only if editing **is** the core value — say so)* | "First report is exported in the user's chosen format" |

## KUI — Key Usage Indicator

**The user has experienced core value enough times for a habit to form.** KUI
is First Strike repeated, with frequency and persistence — the leading
indicator of retention. Wes Bush's examples: Slack at 2,000 messages, Facebook
at 7 friends in 10 days.

- The shape is always **event × count × window.**
- **KUI is the value metric for pricing.** The free tier delivers the
  Beginner-level outcome (gets the user to First Strike); KUI is where pricing
  kicks in. If `product.md`'s value metric and `journey.md`'s KUI are not the
  same thing, flag it.
- The count and window are **v1 hypotheses**, refined by data. The job is a
  defensible starting number, not the right one *(guidance, not auto-checked)*.
- **Schema hook:** `journey.md`'s `kui.measurable-as` is required and must
  carry event, count, and window — e.g. `spec-published × 5 in 7-days`.

## PAI — the leading indicator between the two

`journey.md` also carries a `pai` block (Product Activation Indicator): the
single repeated activity that *predicts* retention, sitting between the
one-time First Strike and the habit-threshold KUI. Its full discipline —
leading-indicator / repetitive / tied-to-outcome / easy-to-understand /
time-bound — lives in the eureka reference; this file only fixes its place in
the roadmap. Keep `pai.measurable-as` (event × frequency, e.g.
`spec-published × 1 in any-day`) consistent with the same event that KUI
counts; a PAI on a different event than KUI is a smell `plg-critique` catches.

## The 5 stages, in detail

What the agent designs *for* at each stage.

- **Search — Problem Aware → Active Research.** Mostly outside the product UI.
  Surfaces: search-reachable marketing, comparison pages, problem-ranking docs.
  Design clarity about *the problem and who it's for* (the Hero → Problem →
  Solution → Risk Reversal → CTA pattern), **not features.**
- **Select — Visit → Sign Up.** Landing, pricing, sign-up. The core tension is
  the friction-vs-information balance of sign-up. Default rule: **collect only
  what's required to reach First Strike.** Profile, team invites, integrations
  — anything off the Straight-Line — are deferral candidates by default.
- **Setup — Profile → Onboarding.** The 7-minute clock is running. Rules:
  **defaults over choices** (every choice must justify being one); the
  **Straight-Line** discipline applies (steps that don't lead to First Strike
  are delete-or-defer, see the eureka reference); **show real work, not
  abstract tours** — a wizard that reaches First Strike via sensible defaults
  is fine, one that teaches concepts in isolation is not.
- **Showcase — First Strike → KUI.** The heart of design; where retention is
  won or lost. Every screen here either gets the user to repeat First Strike or
  removes friction from the repetition. The intervention library — Product
  Bumpers (in-app: empty states, tooltips, checklists, progress) and
  Conversational Bumpers (behaviour-triggered email/push, see the bj-fogg
  reference) — is a **Showcase-stage tool.** It is not deployed in Setup or
  Search.
- **Scale — Upgrade → Advance.** The user hit KUI and is a paid-upgrade
  candidate. Design the upgrade surface (per the moat reference and the
  symmetry rule), power features (Intermediate / Advanced levels), and surfaces
  that make the user's success **visible** — users churn when they can't see
  what they've gotten out of the product.

## The 7-minute rule and the UDE test

**The Beginner-level outcome must be experienceable in under 7 minutes from
first sign-up.** This is the single sharpest tool against scope creep.

Every product has three levels, recorded in `product.md`'s `levels` block:

| Level | Who | Constraint |
|---|---|---|
| **Beginner** | Brand-new user | Must pass the UDE test below |
| **Intermediate** | User who's been around a while | — |
| **Advanced** | Power user | — |

The Beginner outcome must pass all three UDE tests:

| Test | Question | Pass looks like |
|---|---|---|
| **U**nique | Does our core value shine? | User experiences the *differentiator*, not just "uses the product" |
| **D**esirable | Does the ideal user want this? | Cross-checked against `product.md`'s `ideal-user`; if they don't want it, the outcome is wrong, not the user |
| **E**ffective | Under 7 minutes? | Sign-up → First Strike end to end; the agent counts steps, estimates per-step time, totals |

- **Schema hook:** `product.md`'s `ude-test` block is required and needs real
  prose per test, not boilerplate. `levels.beginner` must satisfy it.
- When a product fails UDE, the fix is **almost always to shrink the Beginner
  outcome, not extend the time budget.** The 7 minutes is fixed; what counts as
  "Beginner" is the variable.

## How this maps to the artifact tree

Direct mappings the agent maintains and `plg-critique` checks:

| Artifact / field | This file governs |
|---|---|
| `journey.md` (whole file) | The literal instantiation of the roadmap; every field has a section here |
| `journey.md` `first-strike` / `kui` / `pai` | Measurable milestones above |
| `product.md` `levels.beginner` + `ude-test` | The 7-minute rule and UDE pass |
| `flow-graph.json` `first-strike-place` | References the same First Strike as `journey.md` |
| `straight-line.md` `target-time` | Defaults to "under 7 minutes" for any flow targeting First Strike; other flows get looser budgets |
| `domain-map.json` events | The event a First Strike / KUI / PAI is measurable-as should exist as a domain event |

`plg-critique` runs four foundation checks. Any failure emits a `blocker` —
design cannot proceed to high-fi until the foundation is set:

1. Is First Strike measurable (a named event, not a feeling)?
2. Is KUI measurable as event × count × window?
3. Does the Beginner outcome pass U, D, and E?
4. Does the pricing value metric equal the KUI?

## When this does not apply

This file assumes a PLG product. When the product doesn't fit, the agent says
so explicitly in `product.md`'s narrative — it does not fake the fields.

- **Internal tools** — no Search or Select. Start at Setup. The UDE test still
  applies (a power user shouldn't need 30 minutes to hit the Beginner outcome).
- **One-shot transactional surfaces** (tax filing, checkout) — the "user" is a
  session. First Strike maps to "session goal achieved"; KUI may not apply.
- **Marketing sites without an account** — Search stage only; skip the rest.

## Common mistakes (lint these)

- First Strike stated as a feeling ("feels productive") or as onboarding
  completion, instead of a discrete measurable event.
- First Strike conflated with sign-up or "opens the product" — value not yet
  experienced.
- KUI missing one of event, count, or window (e.g. "sends lots of messages").
- Pricing value metric in `product.md` differs from the KUI in `journey.md`.
- `product.md` `ude-test` filled with boilerplate rather than product-specific
  prose per U, D, and E.
- Beginner outcome that can't be reached in 7 minutes, "fixed" by extending the
  budget instead of shrinking the outcome.
- Sign-up collecting fields not required to reach First Strike (profile, team,
  integrations) with no deferral rationale.
- Product / Conversational Bumpers deployed in Search or Setup instead of
  Showcase.
- PAI counting a different event than KUI, or absent from `journey.md`.
- Framework fields force-fitted onto an internal tool, one-shot surface, or
  account-less marketing site instead of the narrative saying it doesn't apply.
