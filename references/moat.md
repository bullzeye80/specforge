---
file: references/moat.md
purpose: Choose the right free model (free trial / freemium / reverse trial / demo) and propagate its UI consequences.
load-when: plg-shape (when authoring product.md). Not loaded by other modes.
last-updated: 2026-04-26
---

# MOAT

MOAT is the framework for choosing **how the product is offered to a new user**. The choice cascades into UI decisions: signup wall behaviour, paywall placement, what's gated, whether a credit card is required, whether onboarding must be fully self-serve, and what the homepage looks like.

It's named after its four inputs:

- **M**arket strategy
- **O**cean conditions
- **A**udience
- **T**ime-to-value

The output is a **free model**: free trial, freemium, reverse trial, or demo-led. Each model implies a specific UI shape.

Use this reference when:

- Authoring `product.md`'s `moat` block — required at v1
- Authoring `nav-model.md` — the model affects whether the homepage is marketing-shaped or app-shaped
- Designing the sign-up flow — friction tolerance is a function of the model
- Designing the paywall and upgrade flow

Source: Wes Bush, *Product-Led Growth*. Compressed and adapted.

---

## The four inputs

### Market strategy

| Strategy | Meaning | Implication |
|---|---|---|
| **Dominant** | Same as competitors but better or cheaper | Free models compete on price/access. Free trial or freemium with generous limits work. |
| **Differentiated** | Different from competitors on a dimension that matters to a segment | Free model showcases the differentiator fast. Free trial with a focused beginner outcome. |
| **Disruptive** | Reframes the category — solves the same job in a new way | Free model is critical to demonstrate the new way. Freemium often best. |

If the answer to "what's our market strategy?" is "we're not sure," the agent treats this as a `blocker` finding in `plg-critique`. A product without a market strategy can't have a coherent free model.

### Ocean conditions

| Condition | Meaning | Implication |
|---|---|---|
| **Red ocean** | Crowded market, undifferentiated competitors | Free model has to overcome category fatigue. Demo-led often loses; freemium or reverse trial wins. |
| **Blue ocean** | New or uncrowded market | Free model doesn't have to fight for attention; the product itself does the work. Free trial or freemium both viable. |

### Audience

| Audience | Meaning | Implication |
|---|---|---|
| **Top-down** | Decision makers buy first, then roll out to users | Demo-led works. Sign-up with sales contact is acceptable. |
| **Bottom-up** | Individual users adopt first, organisation buys later | Self-serve only. No "talk to sales" before First Strike. Often freemium or reverse trial. |
| **Hybrid** | Both pathways exist | Self-serve is the default surface; sales is an opt-in surface. Two paths from the homepage. |

The audience choice is the single biggest determinant of UI shape downstream. Bottom-up products have lightweight signup, no credit card up front, and self-serve to First Strike. Top-down products can afford a signup form that asks more, a "schedule a demo" CTA on the homepage, and a paywall that's higher and harder.

### Time-to-value

How long it takes a user to experience First Strike.

| TTV | Implication |
|---|---|
| **Under 7 minutes** | Free trial or freemium — the user can experience value before any commitment. |
| **7 minutes – 1 hour** | Reverse trial often best (full-featured for a window, then freemium). The user needs commitment to invest the time. |
| **1 hour – 1 day** | Reverse trial with a longer window, or guided onboarding. |
| **More than 1 day** | Demo-led; possibly with a paid pilot. The product's TTV is too long to convert on free trial. |

If a product's TTV is over 7 minutes, the agent flags this in `plg-critique` against the UDE test in `prod-led-foundations.md`. The fix is almost always to shrink the Beginner outcome so TTV comes under 7 minutes — *not* to choose a model that hides the long TTV.

---

## The four free models

### Free trial

**Full product, time-limited.** Typically 7–30 days.

When it fits:
- Top-down or hybrid audience
- TTV under 7 minutes (otherwise the trial expires before value is felt)
- Differentiated or dominant strategy
- Red or blue ocean

UI implications:
- Signup is one screen, minimal fields. No credit card up front (per `personal-anti-patterns.md`).
- Trial countdown is visible but not nag-shaped. Single indicator, not banner-on-every-page.
- Trial expiry is communicated by behaviour-triggered email (per `bj-fogg.md`), not in-product modals.
- Conversion surface (upgrade) is one click; symmetric to sign-up.

### Freemium

**Limited product, no time limit.** Free tier exists indefinitely. Per `personal-anti-patterns.md`, this is the default expression of "the free tier is a contract."

When it fits:
- Bottom-up audience
- Disruptive strategy (showing the new way requires sustained access)
- Blue ocean (no need to grab attention; let the product earn the upgrade)
- TTV under 7 minutes

UI implications:
- Signup is minimal; same as free trial.
- Free tier delivers the **Beginner-level outcome** from the UDE test (per `prod-led-foundations.md`).
- Gating is on a **value metric tied to KUI**, not on features. Free users can do *the thing*, just less of it.
- Upgrade surface appears at the moment the user hits the value metric — never as a banner.
- No "feature shadows" in the UI (premium features visible but disabled with upgrade prompt). Premium features either work or aren't visible.

### Reverse trial

**Full product for a window, then freemium.** Best of both: the user experiences the full product immediately, then settles into a sustainable free tier.

When it fits:
- TTV is under 7 minutes for the *Beginner* outcome but advanced features take longer to discover
- Bottom-up audience
- Differentiated or disruptive strategy
- The product has both a beginner and advanced experience worth showcasing

UI implications:
- Signup same as freemium.
- Window expiry is communicated as a *transition* into freemium, not as a loss. "You're now on the Free plan; here's what you can keep doing."
- The post-trial surface lets the user upgrade *back* to the full experience with one click.

### Demo-led

**No self-serve free product. User books a demo, gets sales-led onboarding.**

When it fits:
- Top-down audience exclusively
- TTV is over a day (the product genuinely can't be tried in a session)
- Red ocean where buyer education is required
- Enterprise contracts where the buying motion is the design constraint

UI implications:
- Homepage primary CTA is "schedule a demo" or "talk to sales," not "sign up."
- No paywall (no public sign-up to gate).
- Documentation and product tours are public, but the product itself isn't.

The agent treats demo-led as a *fallback*, not a default. If the product *could* be self-serve, it should be. Demo-led is chosen only when the inputs (top-down + TTV > 1 day) actively require it.

---

## How MOAT propagates into UI decisions

The agent should treat the MOAT output in `product.md` as a set of **constraints** that propagate into every screen-scope artifact downstream.

### Sign-up screen

| MOAT model | Fields required | CTA | Credit card |
|---|---|---|---|
| Free trial | email, password (or magic link) | Start free trial | No |
| Freemium | email, password (or magic link) | Get started | No |
| Reverse trial | email, password (or magic link) | Get started | No |
| Demo-led | name, email, company, role | Schedule a demo | N/A |

Anything beyond the table is a deferral candidate. The agent never adds "company size," "use case," "how did you hear about us" to a self-serve signup unless the product explicitly justifies it.

### Homepage shape

| MOAT model | Hero CTA | Secondary surface |
|---|---|---|
| Free trial | "Start free trial" | "See it in action" (product tour) |
| Freemium | "Get started — free forever" | "See pricing" |
| Reverse trial | "Get started" | "See pricing" |
| Demo-led | "Schedule a demo" | "Watch a 2-min overview" |

The Hero → Problem → Solution → Risk Reversal → CTA pattern from `personal-anti-patterns.md` applies to all four models; the CTA target is what changes.

### Paywall placement

| MOAT model | Where the paywall appears |
|---|---|
| Free trial | Trial expiry. Single, soft. Behaviour-triggered email leads in. |
| Freemium | At the value-metric threshold. Inline. "You've reached your free limit; upgrade to continue." |
| Reverse trial | At the trial→freemium transition. Soft, not blocking. |
| Demo-led | N/A — sales handles the conversion. |

The agent never produces a paywall that:
- Blocks the screen with no escape (per `personal-anti-patterns.md`'s symmetric escape rule)
- Pops as a modal on a screen the user came to perform an action on
- Hides the price (the price is on the paywall, in the same view, no extra click)

### Pricing page

The pricing page deserves its own treatment in a future reference, but the relevant rule from MOAT here:

- **Free trial** products often have a single paid tier or two — the choice is "how long" not "what."
- **Freemium** products always have at least Free + at least one Paid; the value metric used for gating is the same metric used for tier differentiation.
- **Reverse trial** products look like freemium on the pricing page — the trial is an onboarding choice, not a pricing tier.
- **Demo-led** products often have "Contact us for pricing" — the agent accepts this only if explicitly justified in `product.md`. Default is to show pricing.

---

## What this means for the artifact schema

Direct mappings:

- `product.md`'s `moat.free-model` is required and must be one of `free-trial | freemium | reverse-trial | demo`. The schema currently lists these.
- `product.md`'s `moat.free-model-rationale` is required and must reference the four inputs (Market, Ocean, Audience, TTV). One-line per input is enough.
- `nav-model.md` should reference the `moat.free-model` in its rationale — the homepage's primary nav is a function of the model.
- `flow-graph.json` for the sign-up flow is constrained by the model; the agent uses the table above.
- Any high-fi pricing page is checked by `plg-critique` against the model's expected shape.

---

## When MOAT doesn't apply

This file assumes a PLG product. Internal tools, single-session transactional products, and pre-sale marketing sites don't have a MOAT. For those, the agent skips this file and notes in `product.md`'s narrative why MOAT was skipped.

The agent does not invent a MOAT for products that don't have one. Better to say "not applicable" than to manufacture a freemium model for an internal admin tool.
