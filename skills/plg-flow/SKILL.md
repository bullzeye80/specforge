---
name: plg-flow
description: |
  Shape one already-shaped feature into its flow-scope spec — the
  breadboard as a flow graph (places, affordances, connections, the
  first-strike-place, and the application use-case) plus the happy-path
  straight-line narrative — authored under
  specs/design/features/<feature-slug>/. Reads the feature's shape.md and
  the product-scope inputs (sitemap.json, domain-map.json, journey.md,
  product.md); it never rewrites them. Use when the brief is "flow", "map
  the flow", "breadboard this feature", "draw the flow graph", "plg flow",
  "shape the flow", or "write the straight line".
triggers:
  - "flow"
  - "map the flow"
  - "breadboard"
  - "flow graph"
  - "plg flow"
  - "shape the flow"
  - "straight line"
od:
  mode: prototype
  craft:
    requires: [plg-foundations, plg-shape-up, plg-eureka, plg-bj-fogg, plg-domain, plg-personal-anti-patterns]
  spec:
    produces: [flow-graph.json, straight-line.md]
    consumes: [shape.md, sitemap.json, domain-map.json, journey.md, product.md]
  design_system:
    requires: false
  example_prompt: "Shape the flow for the anchor-shaping feature — breadboard the places and affordances from its shape.md and the sitemap, mark the first-strike place, then write the straight-line to first strike."
---

# plg-flow · the flow-scope artifact set (v0)

Take one **already-shaped feature** and produce its **flow-scope spec** — two
artifacts under `specs/design/features/<feature-slug>/`, authored in order, each
only after its inputs exist:

1. `flow-graph.json` — the breadboard as a graph: places, affordances,
   connections, the entry/exit places, the first-strike-place, and the
   application `use-case` (schema §7.2).
2. `straight-line.md` — the Shape-Up happy-path narrative: the single golden path
   from entry to first strike, plus the steps that *don't* lead there (schema
   §7.3, fields per v0.1 §7.3).

You **consume** the already-authored inputs — you read them, you never rewrite
them: `features/<feature-slug>/shape.md`, `_shared/sitemap.json`,
`_shared/domain-map.json`, `_shared/journey.md`, `_shared/product.md`.

This is a **mode skill**, not a surface generator. Its output is a spec, not a
screen. You do not produce an HTML artifact and you do not emit an `<artifact>`
block; you write structured JSON and Markdown-with-YAML files **directly to disk**
using the file tools. There is no iframe preview and no `index.html`.

## Scope — read before anything else

**In scope (this v0):** exactly two flow-scope artifacts for one feature —
`flow-graph.json` (§7.2) then `straight-line.md` (§7.3). The flow graph is the
breadboard rung of the fidelity ladder; the straight-line is its happy-path
companion.

**Out of scope (do NOT produce here):** every **screen-scope** artifact —
`wireframe.json`, `low-fi.json`, `high-fi.json` / `high-fi.html`. These come in
later plg-flow iterations, not this v0. Keeping the first version to flow-scope
keeps it small and testable and it respects the **fidelity ladder** (CLAUDE.md
Rule 4 / `plg-shape-up`): flow before screens, and never skip a rung. If the user
asks for wireframes or hi-fi, the answer is that the flow must be explicit
first — you don't jump to a wireframe before the flow graph exists.

`critique.md` belongs to `plg-critique`, not here.

## Injected craft — the substance comes from here

The daemon injects these six craft files above this skill. Read them as the
authority; this body only orchestrates them.

- **`plg-shape-up`** — breadboard, fat-marker, and the fidelity ladder. Governs
  `flow-graph.json` **as a breadboard**: places and affordances first, structure
  before screens, one rung at a time. Governs `straight-line.md` as the happy-path
  narrative.
- **`plg-eureka`** — the Straight-Line and First Strike discipline. The
  `first-strike-place` must be the place where `journey.md`'s First Strike lands,
  and the straight-line is the shortest honest path to it — no detours that don't
  move the user toward the aha.
- **`plg-bj-fogg`** — the behaviour model (B=MAP) along the flow: where motivation
  and ability are thin is where friction sits. Use it to reason about which places
  are drop-off risks and where a step earns its place on the path.
- **`plg-domain`** — the command-vs-query discipline. An affordance that triggers a
  domain action carries that action's ID (`triggers-action`) and inherits its
  `kind` (`action-kind` ∈ `command | query`). A `primary-action` affordance that
  triggers a **query** is a smell — flag it, don't normalise it.
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
  this v0 or is deferred.

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
  sitemap; this v0 doesn't).
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

### Step 4 — Unknowns go to open questions, never to a placeholder

Load-bearing across both files (`plg-personal-anti-patterns`, CLAUDE.md Rule 5):
**you guide, you do not author Layer B for the user.** A confident guess in a
required field is worse than an honest open question.

- **`straight-line.md`** is prose — record any owed decision under a
  `## Open questions` section (add it after `## Drop-off candidates`).
- **`flow-graph.json`** is JSON with no prose section — do **not** invent a field
  to hold unknowns, and do **not** fabricate a place, affordance, `page:`,
  `screen:`, or `triggers-action` just to satisfy the schema. Omit what you can't
  justify, record the gap in `straight-line.md`'s open questions, and raise
  anything blocking (an ambiguous entry point, a missing sitemap page) as a
  follow-up `<question-form>` before writing.

## Hard rules

- **Two files, in order, per feature.** `flow-graph.json` (§7.2) →
  `straight-line.md` (§7.3). The straight-line only after the flow graph exists.
- **Consume, never rewrite.** `shape.md`, `sitemap.json`, `domain-map.json`,
  `journey.md`, and `product.md` are inputs you read. This skill writes only the
  two flow-scope files; it does not edit its inputs. (Extending the sitemap for new
  pages is a later plg-flow iteration, not this v0.)
- **Flow-scope only.** Screen-scope artifacts (`wireframe.json` → `low-fi.json` →
  `high-fi.*`) are out of scope for this v0 and arrive later. The fidelity ladder
  forbids jumping to a wireframe before the flow is explicit (Rule 4 /
  `plg-shape-up`).
- **Write to disk; no `<artifact>` block.** These are specs, not HTML surfaces —
  there is no iframe preview and no `index.html`.
- **Discovery before writing when the inputs are ambiguous.** If `shape.md` +
  `sitemap.json` fully determine the flow, proceed autonomously and send unknowns
  to open questions; otherwise gather them with a `<question-form>` and stop first.
- **Every reference resolves.** Each `page:` to a sitemap node, each
  `triggers-action` to a domain-map action with a matching `action-kind`, and
  `first-strike-place` to a flow place that traces to `journey.md`'s First Strike.
  An unresolved reference is a blocker, not a placeholder.
- **No invented Layer B.** Unknowns are open questions in `straight-line.md`, never
  defaults; `flow-graph.json` holds nothing you can't justify.
- **Schema fields verbatim** — §7.2 for the flow graph, §7.3 (fields per v0.1 §7.3)
  for the straight-line, both with `version: "2"`. Don't add, rename, or drop
  fields the schema defines.
