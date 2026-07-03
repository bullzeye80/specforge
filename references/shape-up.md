---
file: references/shape-up.md
purpose: Shape Up's fidelity ladder discipline — breadboard, fat-marker, composed. Refusing to skip rungs.
load-when: plg-flow (always), plg-build (always), plg-critique (when target is a screen at any fidelity).
last-updated: 2026-04-27
---

# Shape Up

This file is the **process discipline** that prevents the agent's most common failure mode: jumping straight to high-fidelity output. LLMs default to producing composed, polished mockups. That's the wrong rung in almost every situation.

The fidelity ladder is three rungs: **breadboard → fat-marker → composed**. The agent climbs the ladder; it does not skip rungs. The discipline isn't about slowness; it's about *making structural decisions explicit before stylistic ones*.

This file is also the source for *appetite-driven scoping* — the idea that the time budget is fixed and the design bends to fit, not the other way around.

Use this reference when:

- Authoring `flow-graph.json` (the breadboard rung)
- Authoring `wireframe.json` and `low-fi.json` (the fat-marker rung)
- Authoring `high-fi.json` (the composed rung)
- Running `plg-critique` on any artifact (the rung must be appropriate for the decisions being made)

Source: Ryan Singer and Jason Fried, *Shape Up* (Basecamp). Compressed and adapted.

---

## The ladder

| Rung | Shape Up term | Schema artifact | What it shows | What it deliberately omits |
|---|---|---|---|---|
| 1 | Breadboard | `flow-graph.json` | Places, affordances, connections | Layout, positioning, content, styling |
| 2 | Fat-marker sketch | `wireframe.json` + `low-fi.json` | Layout, regions, information hierarchy, placeholder content | Real tokens, real components, finished copy |
| 3 | Composed | `high-fi.json` + `high-fi.html` | Real tokens, real components, real content, real states | (Nothing — this is the final rung) |

The ladder is *cumulative*. Each rung adds information; nothing is removed. Composed contains everything fat-marker had, plus real tokens and content. Fat-marker contains everything breadboard had, plus layout and information hierarchy.

---

## The discipline of staying at the right rung

The hardest thing the agent does is *not* generate composed output when asked. The user prompts "make me a dashboard for X" and the agent's instinct is to produce a polished mockup. This is wrong unless the breadboard and fat-marker already exist.

### The rule

**The agent does not produce a rung's artifacts until the prior rung exists.**

If a user asks for high-fi without a fat-marker, the agent says: "Let's start at the wireframe — the structural decisions need to be explicit first." Then it produces the breadboard and fat-marker, and *stops* before composing. The user reviews. Only then does composition happen.

This is non-negotiable. The agent does not silently generate the missing rungs to "save time." It surfaces the missing work and produces it explicitly.

### Why this matters

LLMs are good at composed output because composed output is what they've seen. They're worse at structural decisions because structural decisions are usually invisible in the training data — they're the *thinking* that produced the composed output, not the output itself.

When the agent skips to composed, it makes structural decisions implicitly. The user sees the result and either accepts the implicit decisions (often bad ones) or has to reverse-engineer them to argue. Both are worse than making the structural decisions explicit at the right rung.

### The exception

If the user provides explicit structural context — "here's the existing flow-graph and wireframe; produce the high-fi" — the prior-rung artifacts effectively exist (in the user's prompt), and the agent can compose. The discipline isn't "always produce all three artifacts"; it's "never compose without the structural foundation being present."

---

## Rung 1 — Breadboard

A breadboard shows places, affordances, and connections. Nothing else.

- **Place** = a state the user can be in (a screen, a panel, a modal — anything with a URL or a unique state)
- **Affordance** = something the user can do at a place (button, link, form, swipe, etc.)
- **Connection** = the line from an affordance to the next place

The breadboard is rendered as a node-edge diagram. No layout. No copy. No style.

### Why breadboards work

They force the question "what places exist and what do they do?" before the question "what do they look like?" Most of the structural mistakes in product design happen when these two questions are answered together — usually the second question dominates and the first is decided implicitly.

### What goes in `flow-graph.json` (the breadboard artifact)

Per the schema:

- `places` array with `id`, `label`, `screen` reference, `page` reference
- `affordances` per place with `id`, `label`, `kind`, `leads-to`
- `connections` array making the graph explicit

The agent never includes layout information at this rung. No "the button is in the top-right." No "the form is centred." No grid, no breakpoints, no visual emphasis. Those are fat-marker concerns.

### When breadboards are done

A breadboard is done when:

- Every place has an entry path (no orphan places)
- Every place has an exit path (no dead-end places)
- The success path from `entry` to `exit-success` is a continuous chain
- The First Strike place is named and reachable
- All affordances on places either lead to other places or terminate the flow

Anything else is a fat-marker concern.

---

## Rung 2 — Fat-marker sketch

A fat-marker sketch is rough layout with no styling. The hand-drawn equivalent is a marker too thick to be precise — you commit to *where things go* but not *what they look like*.

In our schema, fat-marker is split across two artifacts:

- **`wireframe.json`** — regions per screen with structural content (no layout)
- **`low-fi.json`** — layout + information hierarchy + placeholder content (the actual fat-marker)

The split exists because regions and layout are different decisions. Regions are "what's on this screen and roughly grouped how"; layout is "where does each region sit."

### Why fat-marker works

Fat-marker is the rung that does the most thinking. It's where:

- Information hierarchy is committed (primary vs secondary vs tertiary, above-fold, reading order)
- Layout type is chosen (grid, stack, split, centred-column)
- Region sizes and placements are decided
- Placeholder content commits to *length and type* without committing to final copy

Per `personal-anti-patterns.md`, the agent renders fat-marker in **paper-prototype style** — visible boxes, clear regions, monospace or simple sans-serif placeholder text. Not pretty, deliberately. Polish at this rung is a smell — it suggests the agent has skipped to composing.

### What goes in `low-fi.json`

Per the schema:

- `viewport` — primary device shape and supported breakpoints
- `layout` — kind, columns, region placements
- `information-hierarchy` — primary/secondary/tertiary, above-fold, reading order, progressive disclosure, **rationale** (required)
- `density` — generous/balanced/dense (default generous per `personal-anti-patterns.md`)
- `content-placeholders` — real placeholder copy (not lorem ipsum, not final copy)
- `states` — variants of the screen (will become Erik's enumerated taxonomy in v0.2)
- `behaviour-notes` — anything not formally modelled

### When fat-marker is done

Fat-marker is done when:

- Layout is committed (no "this region is somewhere on the page")
- Information hierarchy is declared with a written rationale
- Above-fold content is named
- Reading order is named
- Every region has placeholder content of the right length and shape
- The user could click through the screens and understand the flow without any visual styling

If the user looks at the fat-marker and says "I don't know what this is for," it isn't done.

---

## Rung 3 — Composed

Composed is the final rung. Real tokens, real components from the host project's library, real content (or realistic content), real states.

In our schema, this is `high-fi.json` (metadata) + `high-fi.html` or `.svg` (the rendered representation).

### What composed adds over fat-marker

- Real design tokens (from `_shared/tokens.json`)
- Real components (from `_shared/components.md`)
- Real content (final copy, not placeholder)
- All states declared in the fat-marker, rendered
- Aesthetic decisions per `_shared/aesthetic.md`

Composed should *contain* everything fat-marker had, with no information removed. If composed contradicts fat-marker, the contradiction is recorded in `high-fi.json`'s `deviations-from-low-fi` field with rationale.

### Why composed is last

By the time the agent reaches composed, the structural decisions are already made. Composing is now a question of *executing* the design system on a structure that's already correct. If composed reveals a structural problem (the heading overpowers the CTA, the reading order doesn't match visual weight), that's evidence of fat-marker bugs the agent should fix in fat-marker, then re-compose — not patch around.

### The Phase 1 outsourcing of composing

Per the build plan, in Phase 1 of this system, composing is outsourced — to Claude Design, v0, or hand-authoring. The agent's responsibility is to produce strong fat-markers and let the composer fill them in. `high-fi.json`'s `render-source` field records who composed.

When `plg-build` is built (Phase 2), composing moves in-house. Until then, the agent's discipline is to produce fat-markers good enough that any competent composer can fill them in correctly.

---

## Appetite

A second Shape Up concept that matters for the agent: **appetite**, not estimates.

The team decides how much *time* a problem is worth before designing the solution. This forces the solution to bend to fit the time, not the other way around.

For our purposes, appetite shows up in:

- `shape.md`'s `appetite` field (`small | medium | large`, with team-defined definitions)
- `straight-line.md`'s `target-time` (the user-facing version of appetite — how long the user should take, not the team)

The agent uses appetite as a constraint when shaping. Given a small appetite, the design has to be smaller. The agent doesn't propose grand solutions to small-appetite problems.

The 7-minute UDE rule (from `prod-led-foundations.md`) is a special case of appetite applied to the user side: the user's appetite for getting to First Strike is 7 minutes. The product's appetite for getting them there is whatever's needed to fit.

---

## Hill charts

A third Shape Up concept, briefly. Work has two phases:

1. **Uphill** — figuring out. Uncertainty dominates. You don't yet know what's possible.
2. **Downhill** — executing. Certainty dominates. You know what to do; you're doing it.

For the agent's purposes:

- Breadboard work is uphill (deciding what places exist)
- Fat-marker work is half uphill (information hierarchy is uphill), half downhill (layout, once hierarchy is set, is downhill)
- Composed work is downhill (executing decisions made earlier)

If the agent finds itself doing uphill work at the composed rung — wrestling with whether a region should exist at all — that's evidence the fat-marker wasn't done. The right move is to go back, not push through.

---

## What this means for the artifact schema

Direct mappings:

- The three artifact rungs (`flow-graph.json`, `wireframe.json` + `low-fi.json`, `high-fi.json`) correspond exactly to the three Shape Up rungs.
- `low-fi.json`'s `information-hierarchy.rationale` is required because hierarchy is uphill work that must be made explicit.
- `high-fi.json`'s `deviations-from-low-fi` is required because deviations from fat-marker are evidence of fat-marker bugs that need to be made visible.
- The surface (specforge) renders the three rungs distinctly:
  - Breadboard as node-edge graph
  - Fat-marker in paper-prototype style
  - Composed as the actual rendered HTML/SVG
- `plg-critique` runs three rung-discipline checks:
  1. Does each rung's artifact exist before the next rung's?
  2. Does fat-marker contain explicit information hierarchy with rationale?
  3. Does composed declare deviations from fat-marker, or are deviations silent?

---

## When the ladder doesn't apply

A few cases where strict ladder climbing isn't the right discipline:

- **Static pages without interactive flow** (a privacy policy, a 404 page) — breadboard isn't useful; the agent goes straight to wireframe.
- **One-off illustrations or marketing imagery** — these aren't product UI in the EUREKA sense; the rungs don't apply.
- **Bug fixes or tiny UI tweaks** in an existing high-fi — the ladder doesn't restart for every change. The agent works at the rung the change actually affects.

When the ladder doesn't apply, the agent says so explicitly in `shape.md`'s narrative and skips the rungs that don't fit. It does not pretend to climb a ladder it isn't using.
