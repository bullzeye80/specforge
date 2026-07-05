# MOAT — choosing the free model

This file decides *how a new user is let into the product*. The active
`DESIGN.md` decides *how* a product looks and sounds; this file decides
*what shape the offer takes* — signup friction, what's gated, whether a
card is required, where the paywall lands, and whether the homepage is
marketing-shaped or app-shaped. Its four inputs (Market, Ocean,
Audience, Time-to-value) combine into one output — a **free model** —
and that model propagates as a set of constraints into every
screen-scope artifact downstream. `plg-shape` loads this file whole when
authoring `product.md`'s `moat` block and `nav-model.md`; `plg-critique`
does not load it but checks artifacts against the chosen model's
expected shape.

> Adapted from `references/moat.md` (Wes Bush, *Product-Led Growth*).
> Compressed and adapted, not parroted.

## The four inputs

MOAT is named for its inputs. The output is a `free-model` ∈
`free-trial | freemium | reverse-trial | demo`. Each combines into that
choice; no single input decides it alone, but **audience is the biggest
determinant of downstream UI shape**.

### Market strategy — `moat.market`

| Value | Meaning | Free-model pull |
|---|---|---|
| **dominant** | Same as competitors, better or cheaper | Competes on price/access — free trial or generous freemium |
| **differentiated** | Different on a dimension a segment cares about | Free model must showcase the differentiator fast — focused free trial |
| **disruptive** | Reframes the category, solves the job a new way | Free model is critical to demonstrate the new way — freemium often best |

- "We're not sure" is **not** a value. A product without a market
  strategy can't have a coherent free model; `plg-critique` treats an
  absent or hedged `moat.market` as a `blocker`.

### Ocean conditions — `moat.ocean`

| Value | Meaning | Free-model pull |
|---|---|---|
| **red** | Crowded market, undifferentiated competitors | Must overcome category fatigue — freemium or reverse-trial win; demo-led often loses |
| **blue** | New or uncrowded market | Product does the work; free trial or freemium both viable |

### Audience — `moat.audience`

| Value | Meaning | UI consequence |
|---|---|---|
| **top-down** | Decision-makers buy, then roll out | Demo-led works; "talk to sales" CTA acceptable; higher, harder paywall |
| **bottom-up** | Individuals adopt, org buys later | Self-serve only; no card up front; no sales gate before First Strike; freemium or reverse-trial |
| **hybrid** | Both pathways exist | Self-serve is the default surface; sales is an opt-in second path from the homepage |

- Audience sets the friction budget for sign-up. Bottom-up products get
  the lightest signup that still reaches First Strike (per
  `plg-foundations` — collect only what's required); top-down products
  can afford a form that asks more.

### Time-to-value — `moat.time-to-value`

TTV is how long until the user experiences First Strike (defined in
`plg-foundations`). It is the same 7-minute clock the UDE test runs.

| Band | Free-model pull |
|---|---|
| **Under 7 min** | Free trial or freemium — value felt before commitment |
| **7 min – 1 hour** | Reverse-trial — user needs commitment to invest the time |
| **1 hour – 1 day** | Reverse-trial with a longer window, or guided onboarding |
| **Over 1 day** | Demo-led, possibly a paid pilot — too long to convert on a free trial |

- If TTV is over 7 minutes, the fix is **almost always to shrink the
  Beginner outcome** so TTV comes back under 7 — *not* to pick a model
  that hides the long TTV. This is the same rule `plg-foundations` names
  for the UDE test; MOAT must not be used to launder a failed UDE.

## The four free models

The chosen `moat.free-model` must be justified by
`moat.free-model-rationale`, and the rationale must be **consistent with
the four inputs above** — one line per input is enough. A `free-model`
that contradicts its own MOAT inputs (e.g. `demo` on a `bottom-up`
audience with sub-7-minute TTV) is a `plg-critique` finding.

| Model | What it is | Fits when |
|---|---|---|
| **free-trial** | Full product, time-limited (7–30 days) | top-down/hybrid · TTV < 7 min · differentiated/dominant · red or blue |
| **freemium** | Limited product, no time limit | bottom-up · disruptive · blue · TTV < 7 min |
| **reverse-trial** | Full product for a window, then freemium | bottom-up · differentiated/disruptive · Beginner TTV < 7 min but advanced value takes longer |
| **demo** | No self-serve; book a demo, sales-led onboarding | top-down only · TTV > 1 day · red ocean needing buyer education |

- **Freemium is the default expression of "the free tier is a
  contract"** (per `personal-anti-patterns` and `plg-foundations`): the
  free tier delivers the Beginner-level outcome and gates on the **value
  metric tied to KUI**, never on features. Free users do *the thing*,
  just less of it.
- **Demo-led is a fallback, not a default.** If the product *could* be
  self-serve, it should be. Choose `demo` only when the inputs
  (top-down + TTV > 1 day) actively require it, and say so in the
  rationale.
- Free-tier positioning rules — no card up front, no time-bombed trials,
  symmetric escape on cancel, free tier delivers the Beginner outcome —
  live in `personal-anti-patterns` and `plg-foundations`. Reference
  them; do not restate them here.

## How the model propagates into UI

Treat `moat.free-model` as a set of constraints on every screen-scope
artifact `plg-flow` produces. The tables below are the propagation map.

### Sign-up screen

| Model | Fields | CTA | Card |
|---|---|---|---|
| free-trial | email, password/magic-link | "Start free trial" | No |
| freemium | email, password/magic-link | "Get started" | No |
| reverse-trial | email, password/magic-link | "Get started" | No |
| demo | name, email, company, role | "Schedule a demo" | N/A |

- Anything beyond the self-serve row (company size, use case, "how did
  you hear about us") is a **deferral candidate** unless `product.md`
  explicitly justifies it. The agent does not add fields to smooth an
  imagined sales motion on a bottom-up product.

### Homepage shape — feeds `nav-model.md`

| Model | Hero CTA | Secondary surface |
|---|---|---|
| free-trial | "Start free trial" | "See it in action" (tour) |
| freemium | "Get started — free forever" | "See pricing" |
| reverse-trial | "Get started" | "See pricing" |
| demo | "Schedule a demo" | "Watch a 2-min overview" |

- The homepage is marketing-shaped for `demo`, app-shaped (or a fast
  path to the app) for the self-serve three. `nav-model.md`'s rationale
  must reference the `free-model` — the primary nav is a function of it.

### Paywall placement

| Model | Where the paywall appears |
|---|---|
| free-trial | Trial expiry — single, soft; behaviour-triggered email leads in (per `plg-bj-fogg`) |
| freemium | At the value-metric (KUI) threshold — inline: "You've reached your free limit" |
| reverse-trial | At the trial→freemium transition — soft, not blocking |
| demo | N/A — sales handles conversion |

The agent never produces a paywall that:

- Blocks the screen with no escape (violates the symmetric-escape rule
  in `personal-anti-patterns`).
- Pops as a modal on a screen the user came to *act* on.
- Hides the price — the price is on the paywall, in the same view, no
  extra click.

### Reverse-trial downgrade behaviour

The trial→freemium moment is the one most easily mishandled.

- Frame the window's end as a **transition, not a loss**: "You're now on
  the Free plan — here's what you can keep doing," never "Your trial has
  ended" with a wall.
- The post-trial surface offers a **one-click upgrade back** to the full
  experience — symmetric to how the user got in.
- Nothing the user *made* during the trial is destroyed on downgrade;
  advanced features go quiet, work stays. Data hostage-taking is a
  `personal-anti-patterns` violation.

### Upgrade surface design

- One click, symmetric to sign-up — the effort to pay must not exceed
  the effort to join.
- Appears **at the moment the user hits the value metric**, never as a
  standing banner and never as a "feature shadow" (premium controls
  visible-but-disabled with an upgrade nag). Premium features either
  work or aren't rendered.
- Cap `var(--accent)` use on the upgrade surface per `anti-ai-slop`; the
  upgrade CTA earns emphasis by placement and timing, not by a second
  loud color.

### Pricing-page symmetry

| Model | Pricing-page shape |
|---|---|
| free-trial | Often one or two paid tiers — the choice is "how long," not "what" |
| freemium | Always Free + ≥1 Paid; **the gating value metric is the same metric that differentiates tiers** |
| reverse-trial | Looks like freemium — the trial is an onboarding choice, not a pricing tier |
| demo | "Contact us for pricing" accepted **only if justified** in `product.md`; default is to show the price |

- The value metric used to gate the free tier, the KUI in `journey.md`,
  and the axis that differentiates paid tiers must all be **the same
  thing**. Three different metrics across the free tier, the habit
  signal, and the price is the most common incoherence here — see the
  value-metric check in `plg-foundations`.

## Schema hooks

Direct mappings into `product.md`'s `moat` block (v0.2 schema).

| Field | Rule |
|---|---|
| `moat.market` | Required · one of `dominant \| differentiated \| disruptive`; "not sure" is a `blocker`, not a value |
| `moat.ocean` | Required · one of `red \| blue` |
| `moat.audience` | Required · one of `top-down \| bottom-up \| hybrid` |
| `moat.time-to-value` | Required · an estimate against the 7-min clock; over 7 min shrinks the Beginner outcome, not the model |
| `moat.free-model` | Required · one of `free-trial \| freemium \| reverse-trial \| demo` |
| `moat.free-model-rationale` | Required · one line per input (M, O, A, T); must be consistent with the four values above |

- `nav-model.md` references `moat.free-model` in its rationale.
- `flow-graph.json` for the sign-up flow is constrained by the model
  (the sign-up table above).
- Any high-fi pricing page is checked by `plg-critique` against the
  model's expected shape.

## When MOAT doesn't apply

This file assumes a PLG product. Internal tools, single-session
transactional products, and pre-sale marketing sites don't have a MOAT.
For those, the agent **skips this file and notes in `product.md`'s
narrative why MOAT was skipped** — it does not manufacture a freemium
model for an internal admin tool. Better an explicit "not applicable"
than a fabricated offer *(guidance, not auto-checked)*.

## Common mistakes (lint these)

- `moat.market` left as "not sure" / hedged instead of a real strategy —
  a `blocker`; the free model can't be coherent without it.
- `free-model` contradicts its own inputs (e.g. `demo` on `bottom-up` +
  sub-7-min TTV, or `free-trial` on TTV > 1 day).
- `free-model-rationale` missing, boilerplate, or not referencing all
  four inputs (Market, Ocean, Audience, TTV).
- TTV over 7 minutes "solved" by picking a model that hides it, instead
  of shrinking the Beginner outcome (per `plg-foundations`).
- Self-serve sign-up collecting demo-shaped fields (company, role, use
  case) on a `bottom-up`/`freemium` product with no justification.
- Credit card required up front, or a time-bombed trial with no
  symmetric escape — a `personal-anti-patterns` violation surfacing
  through the MOAT choice.
- Paywall that blocks the screen with no escape, pops as a mid-task
  modal, or hides the price behind an extra click.
- Reverse-trial downgrade framed as a loss / a wall, or destroying work
  the user made during the trial, instead of a soft transition with a
  one-click upgrade back.
- Freemium "feature shadows" — premium controls shown disabled with an
  upgrade nag — instead of features that either work or aren't rendered.
- Free-tier value metric, `journey.md`'s KUI, and the paid-tier
  differentiator being three different metrics instead of one.
- `nav-model.md` homepage CTA inconsistent with `moat.free-model` (e.g.
  "Schedule a demo" hero on a freemium product).
- MOAT fields force-fitted onto an internal tool / one-shot surface /
  account-less marketing site instead of the narrative saying it doesn't
  apply.
