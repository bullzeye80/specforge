---
name: plg-flow
description: |
  Shape one already-shaped feature into its flow- and fat-marker spec — the
  breadboard as a flow graph (places, affordances, connections, the
  first-strike-place, and the application use-case), the happy-path
  straight-line narrative, and one structural wireframe per screen this feature
  owns — authored under specs/design/features/<feature-slug>/. Reads the
  feature's shape.md and the product-scope inputs (sitemap.json,
  domain-map.json, journey.md, product.md); it never rewrites them. Use when
  the brief is "flow", "map the flow", "breadboard this feature", "draw the
  flow graph", "plg flow", "shape the flow", "write the straight line",
  "wireframe the screens", or "fat-marker the flow".
triggers:
  - "flow"
  - "map the flow"
  - "breadboard"
  - "flow graph"
  - "plg flow"
  - "shape the flow"
  - "straight line"
  - "wireframe"
  - "wireframe the screens"
  - "fat-marker"
od:
  mode: prototype
  craft:
    requires: [plg-foundations, plg-shape-up, plg-eureka, plg-bj-fogg, plg-domain, plg-personal-anti-patterns]
  spec:
    produces: [flow-graph.json, straight-line.md, wireframe.json]
    consumes: [shape.md, sitemap.json, domain-map.json, journey.md, product.md]
  design_system:
    requires: false
  example_prompt: "Shape the flow for the anchor-shaping feature — breadboard the places and affordances from its shape.md and the sitemap, mark the first-strike place, write the straight-line to first strike, then wireframe each screen this feature owns (its shape.md owns-screens)."
---

# plg-flow · the flow- and fat-marker artifact set (v1)

Take one **already-shaped feature** and produce its **flow-scope spec plus the
first half of the fat-marker rung** — authored under
`specs/design/features/<feature-slug>/`, in order, each only after its inputs
exist:

1. `flow-graph.json` — the breadboard as a graph: places, affordances,
   connections, the entry/exit places, the first-strike-place, and the
   application `use-case` (schema §7.2).
2. `straight-line.md` — the Shape-Up happy-path narrative: the single golden path
   from entry to first strike, plus the steps that *don't* lead there (schema
   §7.3, fields per v0.1 §7.3).
3. `screens/<screen-slug>/wireframe.json` — one per **screen this feature owns**
   (its `shape.md` `owns-screens`, intersected with the screens the flow graph
   touches — schema §7.1), never for screens it only references: the screen's
   regions and what each region contains, structurally — the fat-marker "what",
   with **no layout, no grid, no positioning, and no states** (schema §8.1,
   structure per v0.1 §8.1, bumped to `version: "2"`). Those deferred concerns are
   the `low-fi.json` rung, which comes later.

You **consume** the already-authored inputs — you read them, you never rewrite
them: `features/<feature-slug>/shape.md`, `_shared/sitemap.json`,
`_shared/domain-map.json`, `_shared/journey.md`, `_shared/product.md`.

This is a **mode skill**, not a surface generator. Its output is a spec, not a
screen. You do not produce an HTML artifact and you do not emit an `<artifact>`
block; you write structured JSON and Markdown-with-YAML files **directly to disk**
using the file tools. There is no iframe preview and no `index.html`.

## Scope — read before anything else

**In scope (this v1):** three artifacts for one feature, in order —
`flow-graph.json` (§7.2), then `straight-line.md` (§7.3), then one
`wireframe.json` (§8.1) **per screen this feature owns** (its `shape.md`
`owns-screens`, intersected with the screens the flow graph touches — §7.1; screens
it only references are linked, not authored). The
flow graph is the breadboard rung; the straight-line is its happy-path companion;
the wireframes are the **regions half of the fat-marker rung** (`plg-shape-up`:
`wireframe.json` holds *what's on each screen, roughly grouped*; `low-fi.json`
holds *where each region sits*). This skill produces the first half only.

**Out of scope (do NOT produce here):** the layout half of the fat-marker rung and
everything above it — `low-fi.json` (grid, positioning, information hierarchy,
states, simplicity-pass) and `high-fi.json` / `high-fi.html`. These come in later
plg-flow iterations. This respects the **fidelity ladder** (CLAUDE.md Rule 4 /
`plg-shape-up`): breadboard before fat-marker, regions before layout, and never
skip a rung. If the user asks for layout, states, or hi-fi, the answer is that the
wireframe's regions must be committed first — you don't place a region on a grid
before the region exists, and you don't produce a wireframe before the flow graph
exists.

`critique.md` belongs to `plg-critique`, not here.

## Injected craft — the substance comes from here

The daemon injects these six craft files above this skill. Read them as the
authority; this body only orchestrates them.

- **`plg-shape-up`** — breadboard, fat-marker, and the fidelity ladder. Governs
  `flow-graph.json` **as a breadboard**: places and affordances first, structure
  before screens, one rung at a time. Governs `straight-line.md` as the happy-path
  narrative. Governs each `wireframe.json` as the **regions half of the fat-marker**:
  what's on the screen roughly grouped into regions — never the grid, positioning,
  emphasis, or states (those are `low-fi.json` concerns, deferred).
- **`plg-eureka`** — the Straight-Line and First Strike discipline. The
  `first-strike-place` must be the place where `journey.md`'s First Strike lands,
  and the straight-line is the shortest honest path to it — no detours that don't
  move the user toward the aha.
- **`plg-bj-fogg`** — the behaviour model (B=MAP) along the flow: where motivation
  and ability are thin is where friction sits. Use it to reason about which places
  are drop-off risks and where a step earns its place on the path.
- **`plg-domain`** — the command-vs-query discipline and the object vocabulary. An
  affordance that triggers a domain action carries that action's ID
  (`triggers-action`) and inherits its `kind` (`action-kind` ∈ `command | query`).
  A `primary-action` affordance that triggers a **query** is a smell — flag it,
  don't normalise it. In `wireframe.json` it also governs the reference surface: a
  region's `contains[].action` resolves to the **same** domain-map action the
  originating affordance triggers, and `objects-shown` / `objects-acted-on` resolve
  to domain-map objects.
- **`plg-foundations`** — the seven-minute clock and First Strike vocabulary. The
  straight-line's `target-time` is measured against it.
- **`plg-personal-anti-patterns`** — the anti-fabrication lens. Unknowns are open
  questions, never plausible placeholders.

## Workflow

### Step 1 — Discovery FIRST (only for what the inputs don't carry)

Your inputs already carry most of the flow. Discovery here is narrow: elicit only
what `shape.md` + `sitemap.json` don't already determine.

- **Which feature** (`<feature-slug>`) to flow, if the brief didn't name one.
- Genuinely ambiguous **flow choices**: the entry point, what counts as
  exit-success (which place *is* the first strike), whether a branch belongs in
  this v1 or is deferred.

If `shape.md` + `sitemap.json` fully determine the feature and its happy path, you
may proceed autonomously — send any residual unknowns to the artifact's open
questions rather than fabricating a form. When a form is warranted, emit exactly
one short prose line plus a single `<question-form id="discovery">` and **stop the
turn** — no file writes, no other tools. Localise every user-facing string to the
user's chat language.

Example shape (tailor it; keep it tight):

```
<question-form id="discovery" title="Shape the flow — which feature, and the path">
{
  "description": "I'll read the feature's shape.md, the sitemap, and the domain map, then write flow-graph.json and straight-line.md. Skip anything you're unsure of — I'll record it as an open question rather than guess.",
  "questions": [
    { "id": "feature", "label": "Which feature should I flow? (the <feature-slug> under specs/design/features/)", "type": "text", "required": true,
      "placeholder": "e.g. anchor-shaping" },
    { "id": "entry", "label": "Where does this flow start — the entry place?", "type": "text",
      "placeholder": "e.g. the onboarding 'describe your idea' screen" },
    { "id": "success", "label": "What counts as success — the moment the user 'gets it' (the first strike)?", "type": "textarea",
      "placeholder": "leave blank to use journey.md's First Strike" },
    { "id": "branches", "label": "Any branch you already know should be IN or OUT of this first flow?", "type": "textarea",
      "placeholder": "e.g. quota-reached paywall is out of the happy path" }
  ]
}
</question-form>
```

After `</question-form>`, **stop.** Do not start writing the flow graph.

### Step 2 — Write `specs/design/features/<feature-slug>/flow-graph.json`

Only after confirming the feature's `shape.md`, plus `sitemap.json` and
`domain-map.json`, exist. Read all three (and `journey.md` for the First Strike)
before writing. Match artifact-schema §7.2 exactly — reproduce the skeleton
verbatim, invent no fields:

```json
{
  "version": "2",
  "feature": "<feature-slug>",
  "use-case": "<PascalCaseUseCase>",
  "entry": "place:<entry-slug>",
  "exit-success": "place:<first-strike-slug>",
  "exit-failure": ["place:<abandon-slug>"],
  "first-strike-place": "place:<first-strike-slug>",
  "places": [
    {
      "id": "place:<slug>",
      "label": "<label>",
      "screen": "screen:<feature>/<screen-slug>",
      "page": "page:<slug>",
      "affordances": [
        {
          "id": "aff:<slug>",
          "label": "<label>",
          "kind": "primary-action | secondary-link | ...",
          "leads-to": "place:<slug>",
          "triggers-action": "action:<object>.<verb>",
          "action-kind": "command | query"
        },
        {
          "id": "aff:<slug>",
          "label": "<label>",
          "kind": "secondary-link",
          "leads-to": "place:<slug>",
          "triggers-action": null,
          "action-kind": null
        }
      ]
    }
  ],
  "connections": [
    { "from": "aff:<slug>", "to": "place:<slug>" }
  ]
}
```

Then the reference and field rules the schema and craft require — every one is a
resolvable link, nothing invented:

- **`use-case`** is a named application use case (Explicit Architecture),
  **PascalCase** (e.g. `ShapeAnchor`). The flow implements this one use case.
- **Every `page:` ref must resolve to a `sitemap.json` node.** A `page:` that
  isn't in the sitemap is a blocker — fix the reference, or the missing page is a
  sitemap gap to record in open questions (a later plg-flow pass may extend the
  sitemap; this v1 doesn't).
- **`screen:` ids** are `screen:<feature>/<screen-slug>`. The sitemap's node
  `screens[]` already names the screen a page carries — reference that id. The
  screen-scope layer fleshes these out later; here you only reference them.
- **Every `triggers-action` must resolve to a `domain-map.json` action**, and its
  **`action-kind` must equal that action's `kind`** (`command` or `query`). For a
  pure-navigation affordance, both are `null`.
- **`first-strike-place` must be one of the flow's `places[]`** and must be the
  place where `journey.md`'s First Strike lands (its `appears-in` screen). It is
  normally the same as `exit-success`.
- **The command-vs-query smell (`plg-domain`):** a `kind: "primary-action"`
  affordance whose `action-kind` is `query` is a smell. Don't silently emit it —
  if the shape genuinely forces it, flag it in the straight-line's open questions
  rather than pretending it's fine.

### Step 3 — Write `specs/design/features/<feature-slug>/straight-line.md`

Only after `flow-graph.json` exists — the straight-line builds on the graph you
just wrote. It is the Shape-Up happy-path narrative: the single golden path from
`entry` to the `first-strike-place`. Match artifact-schema §7.3 (fields per v0.1
§7.3), bumping `version` to `"2"`:

```yaml
---
version: "2"
feature: "<feature-slug>"
entry: "place:<entry>"
target: "place:<first-strike-place>"
target-time: "<e.g. 'under 7 minutes'>"
ude-applicable: true
---

## Steps to first strike
1. **Land** at `place:<entry>` — <what the user sees>.
2. **Click** "<label>" → `place:<next>` (`aff:<slug>`).
3. ...
(The ordered golden path — entry → first-strike-place — each step naming the
place and the affordance that advances it.)

## Steps in current flow that don't lead to first strike
List anything in `flow-graph.json` that isn't on the straight line.
For each, decide: **delete | defer | keep with rationale**.

## UDE test
- **Unique:** how does the core value shine in this flow?
- **Desirable:** does the ideal user from `product.md` actually want this?
- **Effective:** can a new user complete this in `target-time`?

## Drop-off candidates
Steps where users are most likely to drop off. Each gets a hypothesis and a
candidate intervention. (`plg-critique` later checks each has a bumper.)
```

Then the checks (`plg-eureka`, `plg-shape-up`, `plg-bj-fogg`):

- **`target` is the flow's `first-strike-place`**, and `entry` is its `entry` —
  both trace to real places in the flow graph.
- **The straight-line is the shortest honest path** to first strike. Every off-path
  step gets a `delete | defer | keep with rationale` verdict — an unexamined branch
  is a Straight-Line violation.
- **The UDE test is answered against this specific flow**, not boilerplate — and if
  `target-time` blows the seven-minute clock, that's a finding, not something to
  paper over (`plg-foundations`).

### Step 4 — Write one `wireframe.json` per screen **this feature owns**

Only after both `flow-graph.json` and `straight-line.md` exist. The screens you
author are **this feature's owned screens**, not every screen the flow references.
Take `shape.md`'s `owns-screens` list (schema §7.1) and **intersect** it with the
distinct `screen:` ids the flow graph's `places[]` actually touch. Author one
wireframe per screen in that intersection. For each, write:

`specs/design/features/<feature-slug>/screens/<screen-slug>/wireframe.json`

where `<screen-slug>` is the part after the `/` in `screen:<feature>/<screen-slug>`.

**Screens the flow references but this feature does not own** — a shared entry you
inherit from an upstream feature, or an exit destination you hand off to (typically
a place with an empty `affordances` array) — are **linked by `screen:` id, never
authored here.** They have exactly one canonical home: their owner's
`features/<owner>/screens/…`, authored by that feature's own plg-flow pass. Writing
their regions here would duplicate a single-owned screen and, with no affordance of
your own behind them, fabricate structure (Rule 5 / `plg-personal-anti-patterns`).

- If `shape.md` has **no `owns-screens`** field (a legacy shape), do not fall back to
  "every screen the flow touches" — surface it: raise a `<question-form>` (or, if
  proceeding autonomously, a `## Open questions` entry in `straight-line.md`) asking
  which screens this feature owns, and author only what's confirmed.
- **Sanity check, not the rule:** every owned screen you author should also have at
  least one affordance in the flow graph. An owned screen with an empty affordance
  array in *this* flow is a smell — either the flow graph is missing an affordance or
  the ownership is misassigned; flag it rather than wireframing an actionless surface.

The wireframe is **structural**: the screen's regions and what each region
contains, roughly grouped — the fat-marker "what". **No layout, no grid, no
positioning, no visual emphasis, and no states** — those are `low-fi.json`
concerns and are out of scope. Match artifact-schema §8.1 (structure per v0.1
§8.1) with `version: "2"` — reproduce the skeleton verbatim, invent no fields:

```json
{
  "version": "2",
  "screen": "screen:<feature>/<screen-slug>",
  "purpose": "<what this screen is for, one line>",
  "kind": "page | modal | panel | sheet | full-screen",
  "auth": "required | none",
  "page": "page:<slug>",
  "objects-shown": ["object:<slug>"],
  "objects-acted-on": ["object:<slug>"],
  "regions": [
    {
      "id": "region:<slug>",
      "label": "<label>",
      "role": "navigation | primary-content | secondary | utility | system",
      "contains": [
        { "kind": "heading", "level": 1, "text-intent": "<what the text is FOR>", "personalised": true },
        { "kind": "primary-cta", "action": "action:<object>.<verb>", "leads-to": "screen:<feature>/<screen-slug>" }
      ]
    }
  ]
}
```

Then the reference and field rules — every ref resolves, nothing invented:

- **Traceability to the flow graph is the point.** Each interactive `contains`
  element (`primary-cta`, `secondary-cta`, `link`, `skip-link`, …) must correspond
  to a `flow-graph.json` affordance on one of **this screen's** places. Its
  `action` is that affordance's `triggers-action` (identical id); its `leads-to`
  is the `screen:` of the place that affordance's `leads-to` points at. A wireframe
  element with no affordance behind it is a smell — either the flow graph is
  missing an affordance (fix it there first) or the element doesn't belong.
- **`action` uses the v0.2 domain-map form** — `action:<object>.<verb>` (e.g.
  `action:shaping.artifact.generate`), resolving to a `domain-map.json` action.
  Do **not** copy the stale v0.1 verb-noun form (`action:start-first-spec`); the
  schema is "unchanged from v0.1" in its *fields*, but reference *values* follow
  v0.2 conventions, exactly as `flow-graph.json`'s `triggers-action` does. For a
  pure-navigation element, omit `action` and keep only `leads-to`.
- **`page` must resolve to a `sitemap.json` node** — the same `page:` the screen's
  places carry in the flow graph. A `page:` not in the sitemap is a blocker, not a
  placeholder (this v1 does not extend the sitemap; record the gap in open
  questions).
- **`objects-shown` / `objects-acted-on` resolve to `domain-map.json` objects.**
  `objects-acted-on` is the objects this screen's commands mutate; leave it `[]`
  for a read-only screen.
- **`role`** is one of `navigation | primary-content | secondary | utility |
  system`. **`contains[].kind`** is drawn from the enumerated vocabulary: `logo`,
  `heading`, `body-text`, `primary-cta`, `secondary-cta`, `link`, `form`, `field`,
  `list`, `card`, `image`, `media`, `data-viz`, `empty-state`, `loader`, `error`,
  `user-menu`, `skip-link`, `disclosure`, `progress`, `tab-set`, `breadcrumb`
  (extensible where the screen genuinely needs it).
- **`text-intent` is what the text is *for*, never the copy itself** — real copy
  lives in `low-fi.json` / `high-fi.*`, not here. `personalised` marks text that
  adapts to the user.
- **The first-strike screen earns its primary content.** On the screen carrying
  the flow's `first-strike-place`, the region hierarchy must make the first-strike
  moment the primary content (`plg-eureka`) — don't bury it under nav or utility.

### Step 5 — Unknowns go to open questions, never to a placeholder

Load-bearing across all three files (`plg-personal-anti-patterns`, CLAUDE.md
Rule 5): **you guide, you do not author Layer B for the user.** A confident guess
in a required field is worse than an honest open question.

- **`straight-line.md`** is prose — record any owed decision under a
  `## Open questions` section (add it after `## Drop-off candidates`). This is the
  feature's prose home for open questions, including ones surfaced while writing the
  wireframes.
- **`flow-graph.json`** and **`wireframe.json`** are JSON with no prose section —
  do **not** invent a field to hold unknowns, and do **not** fabricate a place,
  affordance, region, `page:`, `screen:`, `object:`, or `action:` just to satisfy
  the schema. Omit what you can't justify, record the gap in `straight-line.md`'s
  open questions, and raise anything blocking (an ambiguous entry point, a missing
  sitemap page, a region whose grouping you can't determine) as a follow-up
  `<question-form>` before writing.

## Hard rules

- **Three artifacts, in order, per feature.** `flow-graph.json` (§7.2) →
  `straight-line.md` (§7.3) → one `wireframe.json` (§8.1) per screen this feature
  **owns** (`shape.md` `owns-screens` ∩ screens the flow touches — §7.1), never for
  a screen it only references. The straight-line only after the flow graph exists;
  the wireframes only after both exist.
- **Own before you author.** A screen has exactly one canonical home (§3). Author a
  wireframe only for screens in *this* feature's `owns-screens`. A shared entry you
  inherit or an exit destination you hand off to is linked by `screen:` id and left
  to its owner's pass. If `shape.md` lacks `owns-screens`, surface it as an open
  question — do not fall back to "every screen the flow touches".
- **Consume, never rewrite.** `shape.md`, `sitemap.json`, `domain-map.json`,
  `journey.md`, and `product.md` are inputs you read. This skill writes only the
  flow-scope files and the per-screen `wireframe.json`; it does not edit its inputs.
  (Extending the sitemap for new pages is a later plg-flow iteration, not this v1.)
- **Regions before layout; wireframe only.** `wireframe.json` is the regions half
  of the fat-marker rung. `low-fi.json` (grid, positioning, information hierarchy,
  states, simplicity-pass) and `high-fi.*` are out of scope for this v1 and arrive
  later. The fidelity ladder forbids jumping to layout before the regions are
  explicit, and to a wireframe before the flow is explicit (Rule 4 /
  `plg-shape-up`).
- **Write to disk; no `<artifact>` block.** These are specs, not HTML surfaces —
  there is no iframe preview and no `index.html`.
- **Discovery before writing when the inputs are ambiguous.** If `shape.md` +
  `sitemap.json` fully determine the flow, proceed autonomously and send unknowns
  to open questions; otherwise gather them with a `<question-form>` and stop first.
- **Every reference resolves.** Each `page:` to a sitemap node, each
  `triggers-action` / wireframe `action` to a domain-map action (with a matching
  `action-kind` where the flow graph carries one), each `screen:` / `object:` to a
  real screen or domain-map object, each wireframe interactive element to a
  flow-graph affordance on that screen, and `first-strike-place` to a flow place
  that traces to `journey.md`'s First Strike. An unresolved reference is a blocker,
  not a placeholder.
- **No invented Layer B.** Unknowns are open questions in `straight-line.md`, never
  defaults; `flow-graph.json` and `wireframe.json` hold nothing you can't justify.
- **Schema fields verbatim** — §7.2 for the flow graph, §7.3 (fields per v0.1 §7.3)
  for the straight-line, §8.1 (structure per v0.1 §8.1) for the wireframe, all with
  `version: "2"`. Don't add, rename, or drop fields the schema defines — and in the
  wireframe, use v0.2 reference *values* (`action:<object>.<verb>`) even though the
  *fields* are inherited from v0.1.
