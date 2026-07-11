---
version: "2"
feature: "idea-intake"
entry: "place:describe-idea"
target: "place:anchor-result"
target-time: "under 1 minute (this flow's share of the 7-minute First Strike budget)"
ude-applicable: true
---

## Steps to first strike
1. **Land** at `place:describe-idea` (`screen:onboarding/describe-idea`) — a single
   Setup-stage capture: one instruction ("describe your idea"), one line saying a
   rough, fuzzy idea is exactly what's expected, one free-text intake pre-loaded
   with a worked example of the kind of input specforge shapes, and one primary
   action. No profile, no plan, no tour.
2. **Type or paste** the fuzzy idea into the free-text intake (`object:shaping.idea-seed`).
3. **Click** "Shape this idea" (`aff:submit-idea`) → `action:shaping.product.create`
   creates `object:shaping.product` from the seed and **redirects** to
   `place:anchor-result` (`screen:shape/anchor-result`).

First Strike (`event:shaping.artifact-generated` — the skeleton `product.md`) then
fires **at** `place:anchor-result`, which is owned by `anchor-shaping`. This flow's
job ends the instant the user lands there with a product created from their own
words; generation and the aha are the next feature's.

## Steps in current flow that don't lead to first strike
The flow graph is deliberately a single golden path — there are no off-path steps
*in* it. The Straight-Line value here is in what was cut **off** the step so it
stays under a minute of the clock. Each below is a step a naive intake would place
between sign-up and the aha, with its disposition:

- **Profile fields** (name / role / company) — **defer.** Not required to shape the
  first anchor; moved to post-First-Strike personalisation (`screen:settings/profile`).
- **Workspace naming / creation** — **defer.** No org-level data isolation is real
  at intake; the product is the container. Named later if ever.
- **Plan selection** — **delete.** Single freemium free tier reaches First Strike
  with no card (per `product.md` `moat.free-model`); the paywall is a Scale-stage
  surface (`screen:billing/paywall`), not a Setup step.
- **Sample-idea / template picker** — **delete as a decision point.** A picker on
  the clock is a choice where a default belongs; ship **one** worked example as
  static guidance in the empty state, not a chooser.
- **Concept-teaching wizard / product tour** — **delete.** Show real work, not an
  abstract tour (`plg-eureka`, `plg-personal-anti-patterns`); the intake *is* the
  real work.
- **Idea validation / critique at intake** — **delete.** Capture first; discipline
  is applied downstream in `anchor-shaping`, not here. Validating at intake would
  turn a one-minute capture into a gate.

That is five deletes and two defers off a step a wild onboarding would have
stacked — well past the 30% delete-or-defer the discipline expects.

## UDE test
- **Unique:** the capture takes a genuinely *fuzzy* idea in the founder's own words
  and shapes it — no pre-classification, no template form, no fields to fill. A
  screen-generator (v0/Lovable/Stitch) would make the user pick a template first;
  here the differentiator — discipline applied to *your* vague idea — begins the
  instant you submit.
- **Desirable:** the ideal user (`product.md`: a solopreneur/small-team founder
  mid-build, no design team) wants exactly this — dump the fuzzy idea and get it
  shaped, without a form standing between them and the aha. It directly answers the
  JTBD push ("coding agents flail on vague prompts").
- **Effective:** one screen, one field, one action → comfortably under a minute,
  well inside the 7-minute First Strike clock. The generation wait that follows is
  `anchor-shaping`'s share of the budget, not this flow's.

## Drop-off candidates
Each gets a hypothesis, a B=MAP diagnosis, and a candidate bumper (`plg-critique`
later checks each has one).

1. **Blank-box paralysis** — founder lands and doesn't know *what* to type.
   *Diagnosis:* **ability** (doesn't know what to do). *Bumper:* the empty state's
   worked example of an expected fuzzy idea + a clear field placeholder — the
   in-product Product Bumper the `shape.md` mandates. Not entertainment; the next
   step made obvious.
2. **"Is my idea good enough?" hesitation** — founder fears the idea is too vague to
   submit. *Diagnosis:* **motivation** (anxiety / doesn't see it'll work). *Bumper:*
   inline value-framing microcopy in the intake header ("rough and half-formed is
   exactly what this expects — we shape it") — copy, not a screen. Speaks to the
   outcome, not a feature.
3. **Empty / whitespace-only submit attempt** — *Diagnosis:* **ability.**
   *Handling:* `object:shaping.idea-seed.text` is required — the primary action
   guides an empty submit with an inline error rather than creating an empty
   product. This is the *only* hard block at intake; a non-empty but thin idea is
   **not** blocked here (see Open questions).
4. **Abandon before submit** — founder signs up, lands on the intake, and leaves
   without creating a product. *Diagnosis:* **prompt** (gone from the product).
   *Bumper:* a behaviour-triggered Conversational Bumper — an email fired on
   *signed-up-without-a-product* (`event:identity.user-registered` present,
   `event:shaping.product-created` absent within the window), pointing back to the
   one next step. Behaviour-triggered, single-purpose, tied to this exact drop-off
   — the existing `behaviour-trigger:welcome-email` is the natural home. Never a
   time-scheduled digest.

## Open questions
Recorded rather than guessed (`plg-personal-anti-patterns`, CLAUDE.md Rule 5). The
two `shape.md` open questions are resolved the disciplined way below, with residuals
flagged where a later rung genuinely owns the call.

1. **How much guidance the input offers** (`shape.md` Q1). *Decision for this
   flow:* a **single free-text intake** with one worked example and value-framing
   microcopy — **not** separate "who is it for / what's the job" sub-fields, which
   would tip a one-minute capture into a wizard and start authoring the user's
   Layer B. *Residual (owed to `low-fi.json` / copy):* whether **one** optional,
   skippable gentle sub-prompt earns its place is a low-fi and copy decision, not a
   structural one — flagged, not fabricated here.
2. **Handling a too-thin idea** (`shape.md` Q2). *Decision for this flow:* the
   intake **captures and hands off** — it does not validate or critique thinness.
   The only hard block is an *empty* seed (required field, drop-off #3). A
   non-empty-but-thin idea is passed through; **generate-with-gaps and surfacing
   open questions belongs to `anchor-shaping`**, not an intake re-prompt (which
   would violate the pitch's "capture first" rabbit-hole). *Residual (owed to the
   `anchor-shaping` owner):* confirm that generate-with-gaps lives at
   `screen:shape/anchor-result` so no thin-idea handling leaks back onto this step.
3. **Abandonment has no dedicated surface.** `exit-failure` references
   `place:describe-idea` itself — abandonment is leaving the intake screen, not a
   distinct "abandoned" place. Modelling a separate abandon screen would fabricate
   a surface that does not exist; the behaviour-triggered bumper (drop-off #4) is
   the honest recovery path.
