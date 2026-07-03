---
file: references/prod-led-foundations.md
purpose: The PLG user roadmap, First Strike, KUI, and the 7-minute UDE test from Wes Bush's Product-Led Playbook.
load-when: plg-shape (always), plg-flow (always), plg-critique (always)
last-updated: 2026-04-26
---

# PLG foundations

This is the spine. Every product the agent designs is structured around the user's journey from problem-aware to power user, with two specific design targets — First Strike and KUI — that everything else serves.

If `personal-anti-patterns.md` is the lens, this file is the **structure**. The lens tells you what *not* to do; this file tells you what *to* do.

Use this reference when:

- Authoring `journey.md` (entire content of this file applies)
- Authoring `product.md`'s `levels` and `ude-test` blocks
- Designing any flow — every flow has to land somewhere on this roadmap, and the agent should know where
- Running `plg-critique` — every screen is checked against where it sits on the roadmap

Source: Wes Bush, *The Product-Led Playbook* and *Product-Led Onboarding*. Adapted, not parroted.

---

## The 5-stage user roadmap

Every user moves through five stages, each with two milestones. The 5-stage roadmap is the canonical structure for `journey.md`.

| Stage | Milestone 1 | Milestone 2 | What's happening |
|---|---|---|---|
| **Search** | Problem Aware | Active Research | User realises they have a problem, starts looking for solutions |
| **Select** | Visit | Sign Up | User finds the product, decides to try it, creates an account |
| **Setup** | Profile | Onboarding | User configures, gets oriented |
| **Showcase** | **First Strike** | **KUI** | User experiences value, then experiences it repeatedly |
| **Scale** | Upgrade | Advance | User pays, then grows into more sophisticated use |

The two milestones in **Showcase** are the design targets everything else serves. If the agent is unclear about what a flow is for, the answer is almost always "it serves First Strike or KUI."

---

## First Strike

**The first time the user experiences core value.**

Not the first time they see the product. Not the first time they sign up. The first time they get the *thing* the product promises.

For Slack, First Strike isn't "create a workspace" — it's the first message that gets a response. For Figma, it's not "open a file" — it's the first time someone else sees what you're working on. For Spotify, it's the first song that plays end-to-end. For a tax product, it's "I see what my refund will be."

First Strike is **measurable as a discrete event**. The agent must always be able to point to a specific moment and say "that's First Strike." If it can't, the product hasn't decided what its core value is, and `plg-shape` should surface that as the first open question.

**Schema field:** `journey.md`'s `first-strike.measurable-as` is required and must name a specific user action or system event, not a feeling.

**Bad First Strike statements** (the agent rejects these):
- "User feels productive" — not measurable
- "User completes onboarding" — onboarding is upstream of First Strike, not First Strike itself
- "User makes their first edit" — closer, but only First Strike if editing *is* the core value (it might be, but say so)

**Good First Strike statements:**
- "First message in a channel receives a reply within 24 hours" (Slack)
- "First spec is published and shareable via URL" (a spec tool)
- "First report is exported in the user's preferred format" (a reporting tool)

---

## KUI — Key Usage Indicator

**The user has experienced core value enough times for a habit to form.**

KUI is the leading indicator of retention. It's First Strike repeated, with frequency and persistence. Wes Bush's examples: Slack at 2,000 messages, Facebook at 7 friends in 10 days. The numbers are product-specific; the shape is always *event + frequency + window*.

**KUI is the value metric for pricing.** Per `personal-anti-patterns.md`, the free tier delivers Beginner-level outcome (gets the user to First Strike). KUI is where pricing kicks in. If the value metric in `product.md` and the KUI in `journey.md` aren't the same thing, the agent should flag it.

**Schema field:** `journey.md`'s `kui.measurable-as` is required and must include event, frequency, and window. Format: `<event> × <count> in <window>`.

**Examples:**
- `message-sent × 2000 in 30-days` (Slack-shaped product)
- `spec-published × 5 in 7-days` (a spec tool)
- `dashboard-viewed × 5 in 7-days` (a reporting tool)

Note that the *value* of the count and window are guesses at v1 of any product — they get refined by data. The agent's job is to set a defensible starting hypothesis, not to find the right number.

---

## The 5 stages, in detail

What the agent is designing for at each stage.

### Search — Problem Aware → Active Research

This stage is mostly outside the product's UI. The user is on Google, Reddit, in conversations with peers. The product surfaces here are usually:

- Marketing pages, but only those reachable from search
- Comparison pages
- Documentation that ranks for problem-aware queries

What the agent is designing: clarity about what problem the product solves and who it's for. Per `personal-anti-patterns.md`, this is the surface for the Hero → Problem → Solution → Risk Reversal → CTA pattern.

What the agent is *not* designing here: features. Features come later. Search-stage surfaces explain a *problem* and offer a *direction*.

### Select — Visit → Sign Up

The user has decided this is the kind of solution they want; now they're choosing which one. The product surfaces are:

- Landing page (the home page proper)
- Pricing page
- Sign-up flow

The hardest design challenge in this stage is the **friction-vs-information balance** of sign-up. Too little information up front and you over-promise; too much and you never get the user to First Strike.

The agent's default rule: **collect only what's required to reach First Strike**. Email + password (or magic link) is usually enough. Profile completion, team invites, integrations — those are deferral candidates. Anything not on the Straight-Line to First Strike is a deferral candidate by default.

### Setup — Profile → Onboarding

The user has signed up; the clock is now running on the 7-minute UDE test (see below). Setup is what happens between sign-up and First Strike.

The agent's rules for this stage:

1. **Defaults over choices.** Every choice presented in setup must justify being a choice, per `personal-anti-patterns.md`.
2. **The Straight-Line discipline applies.** Every step that doesn't lead to First Strike is delete-or-defer (see `eureka.md`).
3. **Show real work, not abstract tours.** A wizard that gets the user to First Strike via sensible defaults is fine. A wizard that teaches concepts in isolation is not.

### Showcase — First Strike → KUI

This is the heart of product design. From First Strike to KUI is where retention is won or lost. Every screen in this range serves one of two purposes: get the user to repeat First Strike, or remove friction from the repetition.

The interventions library (see `bj-fogg.md`) lives in this stage — Product Bumpers (in-app: tooltips, empty states, checklists, progress bars) and Conversational Bumpers (out-of-app: behaviour-triggered emails, push notifications) are *Showcase-stage tools*. They're not deployed in Setup or Search.

### Scale — Upgrade → Advance

The user has hit KUI; they're now a candidate for paid upgrade. After upgrade, they grow into more sophisticated use of the product.

What the agent designs at this stage:

- The upgrade surface (per `moat.md` and `personal-anti-patterns.md`'s symmetry rule)
- Power features (Intermediate and Advanced levels from the UDE test)
- Surfaces that make the user's success visible (often the most important thing in retention — users churn when they can't see what they've gotten out of the product)

---

## The 7-minute rule and the UDE test

**The Beginner-level outcome must be experienceable in under 7 minutes from first sign-up.**

This is the most operationally useful constraint in the entire framework. It's the single sharpest tool the agent has against scope creep.

Every product has three levels:

- **Beginner.** What a brand-new user can achieve. Must pass the 7-minute test.
- **Intermediate.** What a user who's been around a while achieves.
- **Advanced.** What power users do.

The Beginner outcome must pass three tests, the **UDE test**:

| Test | Question | What pass looks like |
|---|---|---|
| **U**nique | Does our core value shine? | The user experiences something they couldn't have got from a generic alternative. Not "uses the product" — *experiences the differentiator*. |
| **D**esirable | Does the ideal user actually want this? | Cross-checked against `product.md`'s `ideal-user`. If the ideal user doesn't want the Beginner outcome, the outcome is wrong, not the user. |
| **E**ffective | Can they get it in under 7 minutes? | Sign-up to First Strike, end to end, under 7 minutes. The agent counts steps, estimates per-step time, and totals. |

**Schema field:** `product.md`'s `ude-test` block is required and must have prose for each of the three tests, not boilerplate.

If a product fails the UDE test, the fix is *almost always* to shrink the Beginner outcome, not to extend the time budget. The 7 minutes is fixed; what counts as "Beginner" is the variable.

---

## How this connects to the schema

Direct mappings:

- `journey.md` is the literal instantiation of this file. Every field in its frontmatter has a section here.
- `product.md`'s `levels.beginner` must satisfy the UDE test.
- `product.md`'s `ude-test` block enforces the three tests.
- `flow-graph.json`'s `first-strike-place` references the same First Strike from `journey.md`.
- `straight-line.md`'s `target-time` defaults to `under 7 minutes` for any flow whose target is First Strike. Other flows have looser budgets.
- `plg-critique` runs four checks against this file:
  1. Is First Strike measurable?
  2. Is KUI measurable as event × count × window?
  3. Does the Beginner outcome pass U, D, E?
  4. Does the value metric in pricing equal the KUI?

If any of those four fail, the critique findings include a `blocker` — design can't proceed to high-fi until the foundation is set.

---

## When this file does not apply

This file assumes a PLG product. Some surfaces don't fit cleanly:

- **Internal tools.** No Search or Select stages. Skip those; start at Setup. UDE test still applies (a power user shouldn't take 30 minutes to hit Beginner outcome on an internal tool either).
- **One-shot transactional surfaces** (a tax-filing app, a checkout flow). The "user" is more like a "session." First Strike maps to "session goal achieved." KUI may not apply at all — the product expects single-session use.
- **Marketing sites without an account.** Search stage applies; nothing else does. Skip the rest.

When the product doesn't fit, the agent says so explicitly in `product.md`'s narrative section. It doesn't pretend the framework applies and produce nonsense fields.
