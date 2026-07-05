# PLG personal anti-patterns

This is the **lens** — the cross-product point of view every other framework
gets read through. The active `DESIGN.md` decides *how* a given product looks
and sounds; this file decides *what a product must refuse to become*, regardless
of brand. Where `plg-foundations` is the structure for what *to* build, this
file is the specification of what *not* to. It **extends**
[`anti-ai-slop.md`](anti-ai-slop.md) — that file is the lens for *visual* slop
(hex tells, gradients, emoji icons); this one is the lens for *product-shape*
slop (dark patterns, config bloat, attention traps). It does **not** replace
anti-ai-slop; the two are read together. `plg-shape`, `plg-critique`, and
`plg-build` load this whole, and every `plg-critique` finding is checked against
the positions below.

> Adapted from `references/personal-anti-patterns.md` (Guru's cross-product
> point of view — the positive frame and the rejections). Adapted, not parroted.

## The positive frame

Seven positions describe what these products *are*. Every rejection below is a
specification of one of them; when a framework suggests a pattern that conflicts,
these win.

| Position | In one line |
|---|---|
| **Asymmetric in the user's favour** | Easy to start, easy to leave; friction only where it protects the user |
| **Provenance over magic** | No AI applied without consent, no data out without a gate, no untraceable claim |
| **Restraint over decoration** | Whitespace not density; motion only when it carries information |
| **Real work over abstraction** | Show the product, don't tour it; defaults over wizards |
| **Symmetry** | Cancelling is as easy as signing up; free tier is a contract, not bait |
| **Hard isolation by default** | RBAC always; workspaces only when data isolation is real |
| **Decision-relief** | The default is the answer; every configuration option earns its screen |

## Data and privacy

**Data flow is asymmetric.** Inspiration, references, and vetted external ideas
flow *in*; user data does not flow *out*. This is data sovereignty, stronger
than "privacy-first."

Reject:

- User data sent to a third-party LLM, analytics, or advertiser without an
  explicit, prominent consent gate that **defaults to off**
- Third-party trackers, pixels, or fingerprinting by default
- "Free" framed as a service exchange where the user's data is the price
- External scripts/fonts that leak user data by virtue of loading
- "Implicit consent" via continued use, scrolling, or closing a banner

Reach for: self-hosted / local-first analytics (Plausible, PostHog self-hosted);
server-side aggregation that never puts PII in third-party calls; opt-in that
works *with* the off default, not against it.

## Authentication and authorisation

OAuth, magic links, 2FA, and passkeys are the acceptable surfaces; **outsource**
the implementation (Auth0, Clerk, Supabase Auth) — never in-house auth.

**RBAC is non-negotiable** on every product, feature, and multi-role entity. The
agent never ships a single-role UI unless the product is explicitly
single-tenant single-role.

| Reject | Why |
|---|---|
| Username + password as the *only* auth option | No outsourced strong-auth surface |
| 2FA opt-in for admin / destructive actions | Must be *required* at that level |
| Soft-delete as the only "delete" affordance | Destructive actions need real confirmation; lifecycle ≠ UI affordance |
| Current user treated as implicit "owner" with no role check | Violates RBAC-always |

## AI surfaces

All five are anti-patterns the agent refuses to generate:

1. **Chat where a form would be better** — constrained/structured/known inputs
   belong in a form. Chat is for when the user doesn't know how to ask yet.
2. **AI suggestions that auto-apply** — suggest, surface, mark; never silently
   mutate user state.
3. **Generated content with no provenance** — every AI output carries *what*
   generated it and *when*, so the user can act on it.
4. **"Ask AI" buttons sprinkled as a trend tax** — AI appears where it earns its
   place, not on every screen.
5. **Hallucinated confidence** — no "97% confidence", emoji-as-confidence, or
   green checkmarks on unscored output.

Higher-stakes: **connecting personal data to AI needs an explicit security gate
every time** the connection is made (not just first authorisation); **sending
anything externally needs an explicit gate** stating what, where, and why.

## Onboarding and empty states

Linear first-run wizards are not banned, but not the default.

- **Show real work, not abstract tours.** A wizard that configures sensible
  defaults to reach First Strike fast is fine; one that teaches concepts in
  isolation is not.
- **Defaults over choices.** Every onboarding choice must justify not being a
  default. High bar.
- **Skip is a primary action**, not a tertiary link a user must hunt for.
- **Empty states carry an actionable CTA.** A cute illustration with no path
  forward is rejected — the empty state's job is the next step, not entertainment.

## Notifications and prompts

**Rejected with prejudice** — these all assume "passive messages to triage,"
carving an attention-shaped hole inside the product:

| Rejected | Accepted (with discipline) |
|---|---|
| Notification centres | Behaviour-triggered emails — single-purpose, milestone-based, out-of-product (see `plg-bj-fogg`) |
| Activity feeds | Toast confirmations of user-initiated actions — self-dismissing, no history |
| Unread badges (inbox-zero anxiety as a feature) | Inline status on the entity it describes ("draft", "needs review") — not aggregated |

The product should not be a place where things accumulate to be cleared.

## Pricing surfaces

The principle is **symmetry**: every action has an inverse, and the inverse is
at least as easy as the action. These are dark patterns the agent refuses:

- Hidden cancellation (support contact, buried in settings, multiple confirms)
- "Are you sure" loops gating cancellation behind 3+ screens
- Downgrade-to-free hidden behind support when upgrade is one click
- "Save 80%" annual nudges where the real saving isn't 80%
- Free trials that auto-convert without prominent advance notice
- Cancellation surveys that gate the cancel button until completed
- Re-engagement "wait, take 50% off" modals on the cancel attempt

## Free tier defaults

Unless `product.md`'s `moat.free-model` overrides per item:

- **The free tier delivers the Beginner-level UDE outcome** — a new user reaches
  First Strike without paying. A contract, not bait (see `plg-foundations`).
- **Gating is on a value metric tied to KUI, not on features.** Meter the KUI
  event and reset it; don't fence off feature X.
- **No time-bombed trial of the free tier itself** — staying under free limits
  forever is a feature.
- **No credit card to start** (MOAT may override per-product).
- **Symmetric escape** — downgrade and cancel are one click, as easy as sign-up.

## Aesthetic stance

**Default: unstyled.** Styling earns its place; every aesthetic decision serves
the product's job. Reaching for a *named contemporary aesthetic as a default* is
a smell — aesthetic is downstream of product context, emerging from the job, not
picked from a menu. The agent never picks a named aesthetic without a
justification rooted in `product.md` and `aesthetic.md`.

| Aesthetic | Stance | When acceptable |
|---|---|---|
| Unstyled / system | Default | Always — until something earns more |
| Paper-prototype | Required | At the wireframe / fat-marker rung (see `plg-shape-up`) |
| Linear-style minimalism | Allowed | If the brand earns it; not a default reach |
| Editorial / publication | Allowed | Content-heavy products, if the brand earns it |
| Neobrutalist | Allowed | Only with explicit brand justification |
| Austere-enterprise-grey | Narrow | Enterprise contexts where convention cuts friction |
| Playful with illustrations | Discouraged | Reads dated; only with strong brand reason |
| Glassmorphic | Rejected | — |
| AI-chatbot-glow (purple-on-dark) | Rejected | Overlaps anti-ai-slop's indigo/gradient P0 tells — keep in sync |
| Maximalist | Rejected | "No crowding" |
| Terminal-aesthetic | Rejected | — |

## Density and motion

- **Generous whitespace by default** — the Stripe / Notion / Apple end, not
  Linear / Bloomberg / JetBrains. Erik Kennedy's rule: *internal space < external
  space; double your whitespace.* Per-product overrides live in `aesthetic.md`.
- **Motion only when it conveys state** — closer to "no animation unless it
  carries information" than "delight via motion."

| Acceptable motion | Rejected motion |
|---|---|
| State transitions that would otherwise jar (modal, panel slide-in) | Page-load orchestrations that delay first interaction for "delight" |
| Loading / progress of the right type for the duration | Scroll-triggered reveals on every section |
| Micro-feedback under 200ms (button press, toggle) | Hero animations longer than the hero takes to read; staggered list reveals; parallax for its own sake |

## Product shape

- **Configuration vs convention: start opinionated.** Defaults are the v1
  answer. Every config option must justify its existence via (a) a real observed
  user need or (b) a security/compliance reason. Everything else is a deletion
  candidate. Settings screens have *fewer* toggles, not more; choices without a
  clear right answer stay hidden until they earn the screen. When in doubt, pick
  the default and note it in `straight-line.md`'s drop-off candidates.
- **Inline editing for documents / long-form content; modal editing for
  entities.** If the thing being edited *is* the content of the screen, edit
  inline; if it's metadata or a discrete entity (profile, settings, billing
  address), edit in a modal.
- **Multi-tenant workspace switchers only when org-level data isolation is
  real** — separate DB, keys, everything that matters for the data's
  sensitivity. If isolation can't be guaranteed, the architecture is separate
  instances per tenant, not a soft-isolated switcher. Reject: switchers backed
  by row-level filters on a shared table for sensitive data; switchers with no
  always-visible current-workspace indicator; switchers that allow accidental
  cross-workspace operations.

## Erik Kennedy's "20 things to say no to"

Absorbed wholesale as hard rules unless `aesthetic.md` overrides a specific one
with a documented reason. `plg-critique` runs these as a checklist against every
high-fi. Rows 3–20 are largely *visual* — where they touch hex/font tells they
overlap `anti-ai-slop.md`; keep the overlap in sync rather than restating it.

| # | Say no to | # | Say no to |
|---|---|---|---|
| 1 | Unaligned elements | 11 | Black text on coloured backgrounds |
| 2 | Inconsistency without a documented reason | 12 | Ultra-wide form controls |
| 3 | System fonts as a *default* (perf choice only) | 13 | Form-control inconsistency (height/width/radius) |
| 4 | Overused Google Fonts (Open Sans, Lato, Inter, Space Grotesk) | 14 | Font Awesome (use Lucide, Phosphor, Feather, Material…) |
| 5 | Thin / light weights as a default | 15 | Unlabelled icons (except search, close, menu) |
| 6 | Coloured text (state indicator only) | 16 | Mismatched icons & labels |
| 7 | "Fun" fonts without an explicit brand reason | 17 | Chart junk |
| 8 | Lines over 75 characters | 18 | Stock photos (real imagery, or none) |
| 9 | Centred text over 2–3 lines | 19 | Dark borders (lighter than first instinct) |
| 10 | Extra colours (if one hue is enough, stop) | 20 | Gray cards on white (pop *lighter*, not darker) |

## Relationship to `anti-ai-slop.md`

This file is the **product-shape** lens; `anti-ai-slop.md` is the **visual-slop**
lens. They are complementary, not redundant.

- Do **not** duplicate anti-ai-slop's P0 hex/gradient/emoji list here. The
  authoritative list is `anti-ai-slop.md` (mirrored to `AI_DEFAULT_INDIGO` in
  `apps/daemon/src/lint-artifact.ts`).
- Where they overlap — "AI-chatbot-glow (purple-on-dark)" above ≡ anti-ai-slop's
  indigo accent + trust-gradient P0 sins — the two must stay in sync. Change one,
  change the other.
- A high-fi is checked against **both**: anti-ai-slop for the visual tells, this
  file for the shape decisions (notifications, symmetry, config bloat, isolation).

## What this means for the artifact schema

Concrete connections — tie rules to real fields; do not invent new ones:

| Schema field | This file governs |
|---|---|
| `product.md` `moat.free-model` | If `freemium`, the free-tier defaults apply unless Layer B `anti-patterns.md` overrides per item |
| `aesthetic.md` section 9 (Brand & anti-patterns) | Carries the per-product specifics; inherits this lens |
| `anti-patterns.md` (Layer B) | The per-product `_shared` file; this Layer A file is its fallback when it is silent |
| `wireframe.json` `contains[].kind` = `notification-center` / `activity-feed` / `unread-badge` | Rejected unless an explicit per-product justification exists |
| `low-fi.json` `density` | Defaults to `generous` unless the product overrides |
| `high-fi.json` `tokens-used` | May not include a rejected aesthetic's signature tokens (e.g. purple-on-dark gradient + glow → AI-chatbot-glow) |
| `domain-map.json` actions with `destructive: true` | Must have `confirmation-required` and a confirmation surface in the high-fi; `plg-critique` checks it |
| `action:cancel-subscription` / `downgrade` / `delete-account` | Evaluated against the symmetry rule — reachable in no more steps than its inverse |

## Common mistakes (lint these)

- User data sent to a third-party (LLM, analytics, advertiser) without a
  consent gate that defaults to *off*.
- A single-role UI on a multi-role entity — RBAC assumed rather than enforced.
- 2FA left opt-in for admin or destructive actions.
- AI output that auto-applies to user state, or ships with no provenance
  indicator.
- Hallucinated confidence ("97% confidence", emoji-as-confidence) on unscored
  output.
- A `notification-center`, `activity-feed`, or `unread-badge` in `wireframe.json`
  with no per-product justification.
- Cancellation or downgrade reachable in more steps than sign-up or upgrade
  (symmetry violation).
- Free tier gated on a *feature* rather than metered on the KUI value event, or
  requiring a card to start with no MOAT override.
- A named contemporary aesthetic (glassmorphic, AI-chatbot-glow, terminal)
  reached for as a default instead of unstyled.
- `high-fi.json` `tokens-used` carrying a rejected aesthetic's signature tokens
  *(overlaps `anti-ai-slop.md` — flag once, in sync)*.
- Motion that delays first interaction for "delight", or scroll/stagger reveals
  on every section.
- A settings screen padded with toggles that have a clear right answer — config
  surfaced "for completeness" instead of earning its place.
- Inline editing used for a discrete entity (profile, billing) or a modal used
  for long-form document content — the inline-vs-modal rule inverted.
- A multi-tenant workspace switcher backed by row-level filters on a shared table
  for sensitive data, or with no always-visible current-workspace indicator.
- Layer B fields filled with plausible-sounding defaults the user never stated;
  a user's "I don't know" promoted to a confident answer rather than surfaced as
  an open question *(guidance, not auto-checked)*.
