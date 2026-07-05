# Shape Up — the fidelity ladder

This is the process discipline that stops specforge's most common failure:
jumping straight to a polished, composed mockup. The active `DESIGN.md` decides
*how* a screen looks and sounds; this file decides *what fidelity the agent is
allowed to be at*, and what each rung may and may not decide. Its one rule —
climb the ladder, never skip a rung — is load-bearing enough to also live as
Rule 4 in `CLAUDE.md`. The `plg-flow` skill loads this file whole (it authors
the lower rungs); `plg-critique` enforces the same ladder against any screen.

> Adapted from `references/shape-up.md` (Ryan Singer & Jason Fried, *Shape Up*,
> Basecamp). Compressed, not parroted.

## The ladder

Three rungs, mapped to real artifact files. The ladder is **cumulative**: each
rung adds information and removes none. Composed contains everything fat-marker
had; fat-marker contains everything breadboard had.

| Rung | Shape Up term | Artifact(s) | May decide | Must leave undecided |
|---|---|---|---|---|
| 1 | Breadboard | `flow-graph.json` (flow scope) | Places, affordances, connections | Layout, positioning, content, styling |
| 2 | Fat-marker sketch | `wireframe.json` + `low-fi.json` | Regions, layout, information hierarchy, placeholder content | Real tokens, real components, final copy |
| 3 | Composed | `high-fi.json` + `high-fi.html`/`.svg` | Real tokens, components, content, rendered states | — (final rung) |

- The discipline isn't slowness. It's **making structural decisions explicit
  before stylistic ones.** Structural mistakes happen when "what places exist"
  and "what do they look like" get answered together — the second question wins
  and the first is decided implicitly.
- LLMs are good at composed output because it's what they've seen; they're worse
  at structure because structure is the invisible *thinking* behind that output.
  The ladder forces the thinking to the surface.

## The no-skip rule

**The agent does not produce a rung's artifacts until the prior rung exists.**

- Asked for high-fi with no fat-marker, the response is: *"Let's start at the
  wireframe — the structural decisions need to be explicit first."* The agent
  produces the breadboard and fat-marker, then **stops** and lets the user
  review. Only then does composition happen.
- This is non-negotiable. The agent does **not** silently generate the missing
  rungs to "save time." It surfaces the missing work and produces it explicitly,
  bottom rung up.
- **The exception:** if the user supplies the structural foundation in the prompt
  ("here's the flow-graph and wireframe, produce the high-fi"), the prior rungs
  effectively exist and the agent may compose. The rule is *never compose without
  the structural foundation present*, not *always emit all three files*.
- **Schema hook / critique:** authoring `high-fi.json` or `high-fi.html` when the
  screen's `low-fi.json` does not exist is a rung-skip. `plg-critique` emits a
  `blocker`; design cannot proceed until the lower rung is filled.

## Rung 1 — Breadboard (`flow-graph.json`)

A breadboard shows places, affordances, and connections — nothing else. Rendered
as a node-edge graph. No layout, no copy, no style.

| Term | Meaning |
|---|---|
| **Place** | A state the user can be in (screen, panel, modal) — anything with a URL or unique state → `places[]` |
| **Affordance** | Something the user can do at a place (button, link, form) → `places[].affordances[]` |
| **Connection** | The line from an affordance to the next place → `connections[]` |

- Never include layout at this rung: no "button top-right," no "form centred,"
  no grid, breakpoints, or visual emphasis. Those are fat-marker concerns.
- **Done when:** every place has an entry path (no orphans) and an exit path (no
  dead ends); the chain from `entry` to `exit-success` is continuous; the
  `first-strike-place` is named and reachable; every affordance either leads to a
  place or terminates the flow. Anything else is a fat-marker concern.

## Rung 2 — Fat-marker sketch (`wireframe.json` + `low-fi.json`)

Rough layout with no styling — a marker too thick to be precise: you commit to
*where things go*, not *what they look like*. The split is deliberate:
`wireframe.json` holds regions per screen (what's on the screen, roughly
grouped); `low-fi.json` is the actual fat-marker (where each region sits).

This is the rung that does the most thinking — it commits:

- **Information hierarchy** — primary / secondary / tertiary, above-fold, reading
  order, progressive disclosure. `low-fi.json`'s `information-hierarchy.rationale`
  is **required**: hierarchy is uphill work that must be written down, not left
  implicit.
- **Layout** — `layout.kind` (grid / stack / split / centred-column), columns,
  region placements and sizes.
- **Placeholder content** — `content-placeholders` commits to *length and type*,
  not final copy. Real placeholder prose, never lorem ipsum, never final copy.
- **Density** — `density` (`generous` default per `plg-personal-anti-patterns`).
- **States** — Erik's enumerated `states[]` taxonomy; optional `simplicity-pass`.

Render fat-marker in **paper-prototype style** — visible boxes, clear regions,
monospace/plain placeholder text. Polish at this rung is a smell: it means the
agent has quietly skipped to composing.

- **Done when:** layout is committed (no "this region is somewhere on the page");
  `information-hierarchy.rationale` is written; above-fold and reading-order are
  named; every region has placeholder content of the right length and shape. If a
  user looks at it and says "I don't know what this is for," it isn't done.

## Rung 3 — Composed (`high-fi.json` + `high-fi.html`)

The final rung: real tokens (from `_shared/tokens.json`), real components (from
`components.md`), real content, all fat-marker states rendered, aesthetic per
`aesthetic.md`. `high-fi.json` metadata + the rendered `high-fi.html`/`.svg`.

- Composed **contains** everything fat-marker had, with nothing removed. Where it
  must diverge, the divergence is recorded in `high-fi.json`'s
  `deviations-from-low-fi` with rationale — a silent deviation is a critique
  finding, because deviations are evidence of fat-marker bugs made visible.
- By this rung the structural decisions are already made; composing is *executing*
  the design system on a structure that's already correct. If composing reveals a
  structural problem (heading overpowers the CTA, reading order fights visual
  weight), fix it in `low-fi.json` and re-compose — do not patch around it.
- **Phase 1 outsources composing** (Claude Design, v0, OD's artifact loop, or hand
  authoring); `render-source` records who composed. The agent's Phase-1 job is
  fat-markers good enough that any competent composer fills them in correctly.

## Appetite (not estimates)

Shape Up's second idea: decide how much *time* a problem is worth **before**
designing the solution, so the solution bends to fit the time.

- `shape.md`'s `appetite` (`small | medium | large`) is the team-facing budget;
  `straight-line.md`'s `target-time` is the user-facing version (how long the user
  should take). The agent uses appetite as a constraint — a small appetite gets a
  small design; it does not propose grand solutions to small-appetite problems.
- The 7-minute UDE rule (`plg-foundations`) is appetite applied to the user side:
  the user's appetite for reaching First Strike is 7 minutes; the product's
  appetite for getting them there is whatever fits.

## Hill charts *(guidance, not auto-checked)*

Work is **uphill** (figuring out; uncertainty dominates) then **downhill**
(executing; certainty dominates). Breadboard is uphill; fat-marker is half uphill
(information hierarchy) and half downhill (layout, once hierarchy is set);
composed is downhill. If the agent finds itself doing uphill work at the composed
rung — wrestling with whether a region should exist at all — the fat-marker
wasn't done. The move is to go back a rung, not push through.

## When the ladder doesn't apply

The agent says so explicitly in `shape.md`'s narrative and skips the rungs that
don't fit — it does not pretend to climb a ladder it isn't using.

- **Static pages with no interactive flow** (privacy policy, 404) — breadboard is
  useless; go straight to `wireframe.json`.
- **One-off illustration / marketing imagery** — not product UI in the EUREKA
  sense; the rungs don't apply.
- **Bug fixes or tiny tweaks in existing high-fi** — the ladder doesn't restart
  per change; work at the rung the change actually affects.

## Common mistakes (lint these)

- Producing `high-fi.json` / `high-fi.html` before the screen's `low-fi.json`
  exists — the canonical rung-skip; a `plg-critique` blocker.
- Silently generating missing lower rungs to "save time" instead of surfacing the
  missing work and stopping for user review.
- Composing without any structural foundation — no flow-graph, no wireframe, none
  supplied in the prompt.
- Layout, positioning, or styling leaking into `flow-graph.json` (breadboard) —
  "button top-right," grids, breakpoints, visual emphasis.
- `low-fi.json` missing `information-hierarchy.rationale`, or with a boilerplate
  rationale that doesn't justify the primary/secondary/tertiary split.
- Fat-marker rendered polished (real type, color, finished copy) instead of
  paper-prototype style — a tell that the agent skipped to composing.
- `content-placeholders` filled with lorem ipsum or final copy instead of
  right-length, right-type placeholder prose.
- `high-fi.json` that contradicts `low-fi.json` with no `deviations-from-low-fi`
  entry — a silent deviation.
- Patching a structural problem at the composed rung instead of fixing
  `low-fi.json` and re-composing.
- A grand solution proposed against a `small` appetite / tight `target-time`.
- Climbing a ladder that doesn't apply (breadboarding a static 404) instead of
  saying so in `shape.md`'s narrative and skipping the rung.
