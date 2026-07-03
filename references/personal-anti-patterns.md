---
file: references/personal-anti-patterns.md
purpose: Guru's cross-product point of view. The positive frame and the rejections.
load-when: Always. This is the lens every other framework gets read through.
last-updated: 2026-04-28
---

# Personal anti-patterns

This file is the **lens**. Every other framework reference (PLG, MOAT, EUREKA, Shape Up, Atomic Design, Nielsen) is read *through* this. When the framework would suggest a pattern that conflicts with what's here, this file wins.

It's also product-agnostic — these positions hold across every product Guru builds. Per-product additions live in Layer B's `_shared/anti-patterns.md`.

Use this reference when:

- Generating any artifact (wireframe, low-fi, high-fi)
- Writing copy or content placeholders
- Choosing patterns (notifications, onboarding, pricing, etc.)
- Running `plg-critique` — every finding is checked against these positions
- The product's own anti-patterns file is silent on something (this file is the fallback)

---

## The positive frame

Six positions that describe what Guru's products *are*, not just what they reject. The rejections in the rest of this file are specifications of these positions.

**Asymmetric in the user's favour.** Easy to start, easy to leave. Defaults that make the easy thing the right thing. Friction is added only where it protects the user — security gates, destructive actions. Friction is removed everywhere else.

**Provenance over magic.** No AI suggestion is applied without consent. No data leaves the boundary without a gate. No claim is made that can't be traced.

**Restraint over decoration.** Whitespace, not density. Motion only when it carries information. Aesthetic that earns its place. No styling for styling's sake.

**Real work over abstraction.** Show the product, don't tour it. Defaults over wizards. Inline editing for content. Modal for entities.

**Symmetry.** Cancelling is as easy as signing up. Downgrading is as easy as upgrading. Free tier is a contract, not bait.

**Hard isolation by default.** RBAC always. Workspaces only when data isolation is real. Separate instances when it's not.

**Decision-relief.** The agent decides on the user's behalf. Configuration earns its place through observed need, not anticipated demand. Override is one click; the absence of choice is the default.

---

## Data and privacy

**Data flow is asymmetric.** Inspiration, code, references, ideas — fine to consume from external sources, provided they're vetted. User data does not flow outward. Ever. This is stronger than "privacy-first"; it's data sovereignty.

The agent should reject any pattern that:

- Sends user data to a third-party LLM, analytics, or advertiser without an explicit, prominent consent gate that defaults to off
- Uses third-party trackers, pixels, or fingerprinting by default
- Frames "free" as a service exchange where the user's data is the price
- Embeds external scripts or fonts that send user data to the embedder by virtue of loading
- Assumes "implicit consent" or "deemed acceptance" via continued use, scrolling, or closing a banner

The agent should reach for:

- Self-hosted or local-first analytics (Plausible, PostHog self-hosted, etc.)
- Server-side aggregation that never includes PII in third-party calls
- Explicit opt-in patterns that work with the consent default off, not against it

## Authentication and authorisation

OAuth, magic links, 2FA, and passkeys are the acceptable surfaces. Outsource the implementation to specialised providers (Auth0, Clerk, Supabase Auth, etc.) — not in-house auth.

**RBAC is non-negotiable.** Every product. Every feature. Every entity that has more than one role touching it. The agent never ships a UI that assumes a single user role unless the product is explicitly single-tenant single-role.

The agent should reject:

- Username + password as the *only* auth option
- 2FA as opt-in for admin/destructive actions (it should be required at that level)
- Soft-delete as the only "delete" — destructive actions need real confirmation, but the data lifecycle is a separate concern from the UI affordance
- Any UI that treats the current user as an implicit "owner" without role checks

## AI surfaces

All five of the following are anti-patterns and the agent should refuse to generate them:

1. **Chat-only interfaces where a form would be better.** If the inputs are constrained, structured, or the user knows what they want — use a form. Chat is for when the user doesn't know how to ask yet.
2. **AI suggestions that auto-apply without confirmation.** Suggest, surface, mark — never silently mutate user state.
3. **Generated content with no provenance.** Every piece of AI-produced content carries an indicator: "this was generated," who/what generated it, when. The user can act on it from there.
4. **"Ask AI" buttons sprinkled randomly.** AI surfaces appear where they earn their place — not as a trend tax on every screen.
5. **Hallucinated confidence indicators.** No "97% confidence" on outputs that aren't actually scored. No emoji-as-confidence. No green checkmarks on uncertain output.

Higher-stakes additions:

- **Connecting personal data to AI requires an explicit security gate**, every time the connection is made — not just at first authorisation.
- **Sending anything externally requires an explicit gate** that the user passes through deliberately. The gate states what's being sent, where, and why.

## Onboarding

Linear first-run wizards are not banned, but they are not the default. The rule is:

- **Show real work, not abstract tours.** A wizard that walks the user through *configuring sensible defaults so they reach First Strike fast* is fine. A wizard that *teaches concepts in isolation* is not.
- **Defaults over choices.** Every choice presented in onboarding has to justify being a choice rather than a default. The bar is high.
- **Skip is a primary action, not a tertiary link.** A user who knows what they're doing must be able to skip without hunting.

Empty states must have an actionable CTA. "Cute illustration with no path forward" is rejected. The empty state's job is to get the user to the next step, not to entertain them.

## Notifications and prompts

**Reject across the board:**

- Notification centres
- Activity feeds
- Unread badges (inbox-zero anxiety as a feature)

These all assume "passive messages to triage" — a shape that creates an attention-shaped hole inside the product. The product should not be a place where things accumulate to be cleared.

**Accept (with discipline):**

- Behaviour-triggered emails — single-purpose, milestone-based, out-of-product. They don't accumulate inside the UI. (See `bj-fogg.md` for the discipline.)
- Toast confirmations of user-initiated actions. Self-dismissing. No history.
- Inline status indicators on the entity they describe ("draft", "needs review"). Not aggregated into a feed.

## Pricing surfaces

All of the following are dark patterns and the agent refuses to produce them:

- Hidden cancellation (cancellation requires support contact, hidden in account settings, requires multiple confirmations)
- "Are you sure" loops that gate cancellation behind 3+ screens
- Downgrade-to-free hidden behind support contact when upgrade-to-paid is one click
- "Save 80%" annual nudges where the actual saving isn't 80%
- Free trials that auto-convert without prominent advance notice
- Cancellation surveys that gate the cancel button until completed
- Re-engagement modals that pop on cancel attempt with "wait, take 50% off"

The principle is **symmetry**: every action has an inverse, and the inverse is at least as easy to perform as the action.

## Free tier defaults

Unless the product's MOAT in `product.md` overrides:

- **The free tier delivers the Beginner-level outcome from the UDE test.** A new user reaches First Strike and gets the beginner result without paying. This is a contract.
- **Gating is on a value metric tied to KUI, not on features.** If KUI is "5 specs published per week," free users get ~5 per week and the meter resets; paid users get more. Not "free can't use feature X."
- **No time-bombed trials of the free tier itself.** A user who stays under free limits forever is a feature.
- **No credit card to start.** MOAT may override per-product, but the default is no card up front.
- **Symmetric escape.** Downgrade and cancel are one click. Same easiness as signing up.

## Aesthetic stance

**Default: unstyled.** Styling earns its place. Every aesthetic decision must serve the product's job. No aesthetic for aesthetic's sake.

**Aesthetic is downstream of product context.** Reaching for a named contemporary aesthetic as a *default* is a smell. The aesthetic emerges from the product's job, not from a menu.

Per-aesthetic stance the agent applies when no product-specific override exists:

| Aesthetic | Stance | When acceptable |
|---|---|---|
| Unstyled / system | Default | Always — until something earns more |
| Paper-prototype | Required | At wireframe rung — fat-marker fidelity |
| Linear-style minimalism | Allowed | If the brand earns it; not a default reach |
| Editorial / publication | Allowed | If the brand earns it; content-heavy products |
| Neobrutalist | Allowed | If the brand explicitly justifies it |
| Austere-enterprise-grey | Permitted narrowly | Enterprise contexts where convention reduces friction |
| Playful with illustrations | Discouraged | Reads dated; only with strong brand reason |
| Glassmorphic | Rejected | — |
| AI-chatbot-glow (purple-on-dark) | Rejected | — |
| Maximalist | Rejected | "No crowding" |
| Terminal-aesthetic | Rejected | — |

The agent never picks a named aesthetic from this menu without justification rooted in `product.md` and `aesthetic.md`. Default to unstyled and let the product context argue for more.

## Density

**Generous whitespace by default.** Stripe / Notion / Apple end of the spectrum, not Linear / Bloomberg / JetBrains.

Erik Kennedy's rule applies: *internal space < external space; double your whitespace*. The space between elements in a group is less than the space around the group.

Per-product overrides happen in Layer B's `aesthetic.md`. Without an override, the agent generates generous-whitespace defaults.

## Motion

**Motion only when it adds value.** Closer to "no animation unless it conveys state" than "delight via motion is a feature."

Acceptable motion:

- State transitions that would otherwise be jarring (modal open/close, panel slide-in)
- Loading and progress (skeletons, spinners, progress bars) — and only of the right type for the duration
- Micro-feedback on user actions (button press, toggle flip) — under 200ms, never decorative

Rejected motion:

- Page-load orchestrations that delay first interaction for "delight"
- Scroll-triggered reveals on every section
- Hero animations longer than the time it takes to read the hero
- Staggered list reveals on every list mount
- Parallax for parallax's sake

## Product shape

**Configuration vs convention:** start opinionated. Defaults are the answer at v1. Configuration earns its place through observed need, not anticipated demand. Every configuration option must justify its existence — either (a) a real user need observed in usage, or (b) a meaningful security or compliance reason. Anything else is a deletion candidate.

The agent's default behaviour:

- Settings screens have *fewer* toggles, not more
- Choices without a clear right answer are hidden until they earn the screen
- Preferences are not surfaced as "configurable for completeness"
- When in doubt, the agent picks the default and notes the decision in `straight-line.md`'s drop-off candidates so it can be revisited if data shows users wanting the override

**Inline editing for documents and long-form content. Modal editing for entity editing.** A document body is edited inline. A user's profile, a project's settings, a billing address — modal. The rule is roughly: if the thing being edited *is* the content of the screen, edit inline. If the thing being edited is metadata or a discrete entity, edit in a modal.

**Multi-tenant workspace switchers are acceptable when org-level data isolation is real.** If the implementation can't guarantee hard isolation (separate database, separate keys, separate everything that matters for the data sensitivity), the architecture should be separate instances per tenant — not a soft-isolated workspace switcher.

The agent rejects:

- Workspace switchers backed by row-level filters on a shared table for sensitive data
- Workspace switchers without a visual indicator of the current workspace at all times in the UI chrome
- Workspace switchers that allow accidental cross-workspace operations (drag-drop across, paste from clipboard without confirmation)

---

## Erik Kennedy's "20 Things to No"

These are absorbed wholesale into Layer A. The agent should treat them as hard rules unless the product's `_shared/aesthetic.md` explicitly overrides a specific one with a documented reason.

1. **No unaligned elements.** Every element is aligned or centred with at least one other element.
2. **No inconsistency without reason.** Every deviation from a sibling pattern has a documented justification.
3. **No system fonts as a default.** Arial, Helvetica, system-ui acceptable only as a deliberate performance choice, never as the absence of a typography decision.
4. **No overused Google Fonts as defaults.** Open Sans, Lato, Raleway are out. Inter is out. Space Grotesk is out (per Anthropic's own guidance).
5. **No thin or light weights.** Bold weights are easier to make look good. Save thin/light for deliberate contrast within an established type system.
6. **No coloured text.** Dark grays with low saturation. Coloured text is a state indicator, never a default.
7. **No "fun" fonts.** Unless the brand explicitly requires it. Default fonts that *subtly amplify* the brand, not overpower it.
8. **No lines over 75 characters.** Body text wraps to 50–75 chars per line.
9. **No centred text over 2–3 lines.** Centring is for titles and short labels. Body copy is left-aligned.
10. **No extra colours.** If one hue is enough, don't use two. If two is enough, don't use three.
11. **No black text on coloured backgrounds.** White on dark colour. Darker variation of the colour on light colour.
12. **No ultra-wide form controls.** Fields shouldn't be more than a few hundred pixels wide.
13. **No form control inconsistency.** Heights, widths, colours, borders, radii match across the product.
14. **No Font Awesome.** Use Material, Feather, Entypo, Quantum, Lucide, Phosphor, or a custom set.
15. **No unlabelled icons** unless universally recognised (search, close, menu).
16. **No mismatched icons & labels.** Weight, colour, and feel align with the surrounding text.
17. **No chart junk.** Every pixel of a chart conveys information or improves usability.
18. **No stock photos.** Real, high-quality imagery of real people. Or no imagery.
19. **No dark borders.** Borders, outlines, dividing rules should almost always be lighter than first instinct suggests.
20. **No gray cards on white backgrounds.** Content that "pops out" from a similar-hued background should be *lighter*, not darker.

---

## What this means for the artifact schema

Concrete connections from this file to specific schema fields:

- `product.md`'s `moat.free-model` is constrained: if the value is `freemium`, the free tier defaults above apply unless `_shared/anti-patterns.md` overrides them explicitly per item.
- `wireframe.json`'s `contains[].kind` of `notification-center` is **rejected** by the agent unless an explicit per-product justification exists. Same for `activity-feed`, `unread-badge`.
- `low-fi.json`'s `density` defaults to `generous` unless the product overrides.
- `low-fi.json` rendering at the wireframe rung in the surface uses paper-prototype style, by rule.
- `high-fi.json`'s `tokens-used` cannot include any of the rejected aesthetics' signature tokens (e.g. purple-on-dark gradients combined with glow effects → AI-chatbot-glow → rejected).
- `domain-map.json` actions marked `destructive: true` *must* have a confirmation surface in the high-fi. `plg-critique` checks this.
- Any `action:cancel-subscription`, `action:downgrade`, `action:delete-account`-shaped action has its UI evaluated against the symmetry rule: it must be reachable in no more steps than its inverse.
- `plg-critique` runs the "20 Things to No" as a checklist against every high-fi.

---

## Specforge-specific anti-patterns

This section covers anti-patterns specific to specforge itself — the multi-mode UI/UX agent system that consumes this file. They're listed here rather than in a per-product Layer B because specforge *is* the surface this Layer A is authored for.

**On what specforge is not.** Specforge is not Figma. It's not v0. It's not Lovable. It's not a free-form canvas, it's not a chat-only interface, it's not a template marketplace. Specforge is a **process-disciplined artifact tree** that produces structured design specs for downstream coding agents to implement. Reaching for free-form-canvas, chat-only, or template-picker patterns is a smell.

**On the artifact tree.** The tree is product → flows → screens, with three fidelity rungs at the screen level (breadboard / fat-marker / composed). The tree is the navigable spine. Anti-patterns the agent rejects when extending the surface:

- Flat artifact lists that hide hierarchy
- Search-as-primary-navigation (search complements the tree; never replaces it)
- Tab-based artifact switching at scope above the screen level
- Rendering high-fi where a low-fi was requested (rung-skipping at the surface, not just at the agent)
- Chat as the primary interaction model — chat is the *invocation* of skills, the tree is the *navigation* of outputs
- Single-artifact focus that loses tree context (the user must always know where they are in the tree)

**On the agent's behaviour.** The agent serves the tree, not the conversation. Anti-patterns:

- Producing artifacts the user didn't ask for to "complete" the tree
- Auto-promoting low-fi to high-fi without explicit request
- Generating artifacts that don't reference Layer A or Layer B (the agent must cite which references it consulted, per the provenance rule)
- Free-form generation when the schema specifies structure (every artifact has a schema; the agent fills it, doesn't reinterpret it)
- Skipping the discovery turn for new products (the question form is non-negotiable for first turn, per OD's RULE 1 inherited into our system)

**On rendering fidelity.** Each rung has a deliberate aesthetic constraint, per `shape-up.md`:

- Breadboard renders as node-edge graphs. Not as boxes-on-a-grid mockups dressed up as wireframes.
- Fat-marker renders in paper-prototype style. Visible boxes, monospace placeholder text, deliberately rough. Polish at this rung is a smell.
- Composed renders against the host project's tokens and components. No invented components, no off-system tokens, no aesthetic flourishes that escape the system.

The temptation to make breadboards "look nicer" or fat-markers "feel more designed" is the temptation to skip rungs. The agent and the surface both refuse it.

**On what specforge respects from OD.** Our fork inherits OD's craft system, design system catalogue, lint pipeline, comment mode (`data-od-id`), inspect mode, critique orchestrator, and skill convention. Anti-patterns when extending these:

- Reinventing what OD has solved (we extend, we don't replace)
- Modifying OD-owned files without `// SPECFORGE-MOD: <rationale>` comment headers
- Adding to OD's tables when an additive new table would do
- Breaking OD's package boundaries (`web` doesn't import `daemon`, `contracts` stays pure TS, etc.)

**On product-context (Layer B) authoring.** When users author Layer B for their own product, the agent guides but does not author for them. Anti-patterns:

- Filling in Layer B fields with plausible-sounding defaults the user didn't say
- Pretending to know the user's brand, voice, or aesthetic without explicit input
- Promoting tentative answers to confident statements in the artifact tree
- Generating a `domain-map.json` that exceeds what the user described (no inventing objects, attributes, or actions)

The agent's discipline: **when it doesn't know, it asks. When the user says "I don't know," it surfaces the question as a Layer B open question, not a placeholder answer.**

---

## Maintenance

This file is the most opinionated artifact in Layer A. It will drift as Guru's positions evolve. Quarterly review minimum. When a position changes, the change is made here first, then propagated to the per-product `_shared/anti-patterns.md` files that inherit from it.

Items that get *added* to this file should pass two tests:

1. **Generality.** It applies across every product Guru builds, not just one.
2. **Operationality.** The agent can act on it. "Be elegant" is not operational. "No thin font weights" is.

Items that fail one of those tests belong in Layer B, not here.
