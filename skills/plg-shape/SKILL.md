---
name: plg-shape
description: |
  Shape a fuzzy product idea into the full product-scope spec artifact
  set under specs/design/. Elicits the ideal user, the job-to-be-done
  (with push / pull / anxiety / habit forces), the MOAT free-model
  inputs, the usage levels, and the 7-minute UDE test, then authors the
  chain in dependency order: the anchor (product.md) → the journey
  (journey.md, with a measurable First Strike, KUI, and PAI) → the
  OOUX+DDD domain model (domain-map.json) → the page graph (sitemap.json)
  → the navigation model (nav-model.md) → one shape.md per feature. Use
  when the brief is "shape a product", "new product spec", "define the
  product", "map the user journey", "model the domain", "draft the
  sitemap", or "start the PLG spec".
triggers:
  - "shape"
  - "shape a product"
  - "product shape"
  - "plg shape"
  - "new product spec"
  - "define the product"
  - "start the spec"
od:
  mode: prototype
  craft:
    requires: [plg-foundations, plg-moat, plg-eureka, plg-bj-fogg, plg-domain, plg-personal-anti-patterns]
  spec:
    produces: [product.md, journey.md, sitemap.json, nav-model.md, domain-map.json, shape.md]
    consumes: []
  design_system:
    requires: false
  example_prompt: "Shape a PLG product for a spec tool that lets designers publish a shareable design spec — help me define the ideal user, the job, the MOAT, and the 7-minute outcome, then write product.md."
---

# plg-shape · the product-scope artifact set (v1)

Turn a fuzzy product idea into the **full product-scope spec** under
`specs/design/` — six artifacts, authored in dependency order, each only after
its inputs exist:

1. `_shared/product.md` — the one-page anchor (schema §6.1)
2. `_shared/journey.md` — the Search→Scale roadmap (§6.2)
3. `_shared/domain-map.json` — the OOUX+DDD domain model (§6.5)
4. `_shared/sitemap.json` — the page graph (§6.3)
5. `_shared/nav-model.md` — the navigation model (§6.4)
6. `features/<feature-slug>/shape.md` — one per feature (§7.1)

Every other specforge skill (`plg-flow`, `plg-critique`, `plg-build`) reads
these. You do not produce an HTML artifact and you do not emit an `<artifact>`
block; you write structured Markdown-with-YAML and JSON files **directly to
disk** using the file tools.

This is a **mode skill**, not a surface generator. Its output is a spec, not a
screen. Author each file against the injected craft, in the user's own words, and
stop at the fields the user can actually answer.

## Scope — read before anything else

**In scope:** all six product-scope artifacts, authored in dependency order —
each only after its inputs exist:

1. `_shared/product.md` (§6.1) — the anchor. First; nothing precedes it.
2. `_shared/journey.md` (§6.2) — builds on product.md's First Strike / MOAT.
3. `_shared/domain-map.json` (§6.5) — the OOUX+DDD model. Authored **before** the
   sitemap, because pages and screens reference the objects it defines.
4. `_shared/sitemap.json` (§6.3) — the page graph; every page references
   domain-map objects and serves journey stages. Initial cut only.
5. `_shared/nav-model.md` (§6.4) — the navigation model over the sitemap.
6. `features/<feature-slug>/shape.md` (§7.1) — one per feature you identify from
   the journey and sitemap.

**Out of scope (belongs to `plg-flow` / `plg-critique`, do NOT produce here):**
every flow- and screen-scope artifact — `flow-graph.json`, `straight-line.md`,
`wireframe.json`, `low-fi.json`, `high-fi.json`/`.html`, and `critique.md`. The
`sitemap.json` you write here is the *initial* cut; `plg-flow` extends it as
features add pages. If the user asks for screens or flows, say those come in the
`plg-flow` pass.

## Injected craft — the substance comes from here

The daemon injects these six craft files above this skill. Read them as the
authority; this body only orchestrates them.

- **`plg-foundations`** — the five usage levels, the 7-minute UDE test, and the
  First Strike vocabulary. Governs the `levels` and `ude-test` blocks: the
  Beginner outcome must be reachable in under 7 minutes and pass Unique /
  Desirable / Effective with real per-test prose, not boilerplate.
- **`plg-moat`** — the `moat` block. Market / Ocean / Audience / Time-to-value
  combine into one `free-model` (`free-trial | freemium | reverse-trial |
  demo`), justified by `free-model-rationale` with one line per input. `market`
  left as "not sure" is a blocker, not a value.
- **`plg-eureka`** — activation discipline for `journey.md`: the Straight-Line,
  Product vs Conversational Bumpers, and the full PAI (leading-indicator /
  repetitive / tied-to-outcome / easy-to-understand / time-bound). Governs the
  `first-strike`, `kui`, and `pai` blocks.
- **`plg-bj-fogg`** — behaviour model (B=MAP) behind the journey's prompts and
  the events that trigger Conversational Bumpers.
- **`plg-domain`** — the OOUX+DDD discipline for `domain-map.json`: objects vs
  UI-affordances/attributes/verbs, entity vs value-object (`kind`), aggregates
  and roots (`aggregate`), command vs query with Erik's Actions Checklist on
  every command, relationships with `aggregate-internal`, bounded contexts, and
  the events each command fires. Governs every field of the domain model — load
  the whole file when authoring it, and run its nine-step one-pass workflow.
- **`plg-personal-anti-patterns`** — the product-shape lens applied while
  shaping: asymmetry in the user's favour, symmetry on pricing, the free tier as
  a contract, decision-relief. Read the JTBD and MOAT answers through it.

## Workflow

### Step 1 — Discovery FIRST (a `<question-form>`, then stop)

Your **first output** is one short prose line plus a single
`<question-form id="discovery">` tailored to product-shape — nothing else, no
file writes, no tools, no extended thinking (per the RULE 1 discovery contract).
Elicit the inputs `product.md` needs before you write a word of it:

- **Ideal user** — role, the context/situation that creates pull, and the
  one-sentence endgame (their win state).
- **Job-to-be-done** — the "when X, I want Y, so I can Z" statement, and the
  four forces (push away from today, pull toward this, anxiety about switching,
  habit holding them).
- **MOAT inputs** — market strategy, ocean, audience, and rough time-to-value —
  which resolve to the `free-model`.
- **Product name** (for `name` / `slug`).

Example shape (tailor it to the brief, keep it under ~7 questions, and localize
every user-facing string to the user's chat language):

```
<question-form id="discovery" title="Shape the product — the anchor questions">
{
  "description": "I'll write product.md from your answers. Skip anything you're unsure of — I'll record it as an open question rather than guess.",
  "questions": [
    { "id": "name", "label": "Product name (working title is fine)", "type": "text", "required": true },
    { "id": "idealUser", "label": "Who is the ideal user — their role and the situation that makes them look for this?", "type": "textarea", "required": true,
      "placeholder": "e.g. a solo product designer, mid-project, who needs to hand a spec to an engineer" },
    { "id": "endgame", "label": "In one sentence, what's their win state?", "type": "text",
      "placeholder": "e.g. ships a shareable spec their engineer builds from without a meeting" },
    { "id": "jtbd", "label": "The job: when ___, I want ___, so I can ___", "type": "textarea" },
    { "id": "forces", "label": "What pushes them off today's solution, and what makes switching scary or hard?", "type": "textarea",
      "placeholder": "push / pull / anxiety / habit — whatever you know" },
    { "id": "market", "label": "Market stance", "type": "radio",
      "options": ["Dominant — same as rivals, better/cheaper", "Differentiated — better on one dimension a segment cares about", "Disruptive — reframes the category", "Not sure"] },
    { "id": "audience", "label": "Who adopts first?", "type": "radio",
      "options": ["Bottom-up — individuals adopt, org buys later", "Top-down — decision-makers buy then roll out", "Hybrid — both"] },
    { "id": "ttv", "label": "Roughly how long until a new user first feels the core value?", "type": "text",
      "placeholder": "e.g. under 7 minutes, ~30 minutes, a day+" }
  ]
}
</question-form>
```

After `</question-form>`, **stop the turn.** Do not start writing `product.md`.

### Step 2 — Write `specs/design/_shared/product.md`

Once the user answers (their next message starts with `[form answers —
discovery]`), write the file directly. It must match artifact-schema §6.1
exactly — do not invent, rename, or drop fields:

```yaml
---
version: "2"
name: "<product name>"
slug: "<kebab-case slug>"
ideal-user:
  role: "<job title or role>"
  context: "<situation that creates pull>"
  endgame: "<one-sentence win state>"
jtbd:
  job: "<when X, I want Y, so I can Z>"
  forces:
    push: ["<frustration with current solution>"]
    pull: ["<attraction of new solution>"]
    anxiety: ["<fear of switching>"]
    habit: ["<inertia of current>"]
moat:
  market: "dominant | differentiated | disruptive"
  ocean: "red | blue"
  audience: "top-down | bottom-up | hybrid"
  time-to-value: "<estimate, e.g. '< 7 minutes'>"
  free-model: "free-trial | freemium | reverse-trial | demo"
  free-model-rationale: "<one line per input — M, O, A, T>"
levels:
  beginner: "<outcome a brand-new user can achieve>"
  intermediate: "<outcome after some use>"
  advanced: "<outcome for power users>"
ude-test:
  unique: "<does our core value shine? how?>"
  desirable: "<does the ideal user actually want this?>"
  effective: "<can they get it in 7 minutes?>"
---

## Narrative
Free prose describing the product, the user, and the bet. ~300–600 words.

## Open questions
Things this skill couldn't resolve and the product owner needs to decide.
```

Then run the checks the craft names before you consider the file done:

- **Beginner outcome passes UDE** — Unique, Desirable, Effective, with real
  per-test prose. If it can't be reached in under 7 minutes, shrink the Beginner
  outcome; do not extend the time budget (`plg-foundations`).
- **`moat.free-model` is consistent with its four inputs**, and
  `free-model-rationale` has a line per input (`plg-moat`). A `free-model` that
  contradicts its inputs is wrong.
- **The narrative is specific to this product** — the user, the bet, and (when
  it applies) an explicit note if this is not a PLG product and some fields don't
  apply, rather than force-fitting the framework.

### Step 3 — Write `specs/design/_shared/journey.md`

Only after `product.md` exists. journey.md is the Search→Scale roadmap; it turns
the First Strike named in `product.md`'s `levels.beginner` into a *measurable*
event, sets the KUI (which must equal the MOAT pricing value metric), and adds
the PAI. If product.md left the habit-forming repeated action undecided, gather
it with a short follow-up `<question-form>` before writing — don't invent it.

Write the file to match artifact-schema §6.2 exactly:

```yaml
---
version: "2"
first-strike:
  description: "<the first time the user experiences core value>"
  measurable-as: "<the event that fires, e.g. 'event:spec-published fires for the first time'>"
  appears-in: "screen:<feature-slug>/<screen-slug>"
kui:
  description: "<the habit signal — repeated value experience>"
  measurable-as: "<event × count × window, e.g. 'spec-published × 5 in 7-days'>"
pai:
  description: "<the single repeated activity that predicts retention>"
  measurable-as: "<event × frequency, e.g. 'spec-published × 1 in any-day'>"
  characteristics:
    leading-indicator: "<how this leads retention>"
    repetitive: true
    tied-to-outcome: "<the desired outcome it predicts>"
    easy-to-understand: "<one-sentence description>"
    time-bound: "<frequency window>"
stages:
  search:   { problem-aware: "...", active-research: "..." }
  select:   { visit: "...", sign-up: "..." }
  setup:    { profile: "...", onboarding: "..." }
  showcase: { first-strike: "<ref to first-strike above>", kui: "<ref to kui above>" }
  scale:    { upgrade: "...", advance: "..." }
---

## Narrative
The journey at each stage and the failure modes this product must defend against.
```

Then the craft checks before it's done (`plg-eureka`, `plg-foundations`):

- **First Strike is the SAME one product.md named** — now a discrete fired event
  (`measurable-as`) landing on a real `screen:` (`appears-in`), not a feeling.
- **KUI is `event × count × window` AND equals product.md's pricing value metric.**
  If they diverge, that's a `blocker` finding — surface it, don't reconcile silently.
- **PAI is present and distinct** from First Strike (one-time) and KUI (habit
  threshold): the single repeated activity that predicts retention, with all five
  characteristics filled.
- The Straight-Line holds — Setup steps that don't lead to First Strike are
  delete-or-defer candidates worth noting in the Narrative.

### Step 4 — Write `specs/design/_shared/domain-map.json`

The OOUX+DDD model — authored **before** the sitemap, because every page and
screen references the objects it defines. Load `plg-domain` in full and run its
nine-step one-pass workflow (brainstorm nouns → group by context → entity vs
value-object → aggregates → attributes → actions with command/query → relationships
→ events → validate). The nouns come from the user's own product, not from you:
if `product.md`'s narrative and JTBD don't already name the objects, gather them
with a short follow-up `<question-form id="domain">` — the nouns the user thinks
about, what each one *has*, and what can be *done* to it — before writing. Don't
invent objects to fill the model.

Write the file to match artifact-schema §6.5 exactly. The skeleton is
`bounded-contexts[]`, each context carrying its own `objects[]` and `events[]`:

```json
{
  "version": "2",
  "bounded-contexts": [
    {
      "id": "context:collaboration",
      "label": "Collaboration",
      "purpose": "Project-and-task management; the user-facing core.",
      "objects": [
        {
          "id": "object:collaboration.project",
          "label": "Project",
          "purpose": "A unit of work the user owns.",
          "kind": "entity",
          "aggregate": "object:collaboration.project",
          "attributes": [
            { "name": "title",  "type": "string", "required": true,  "shown-on-list": true },
            { "name": "status", "type": "enum",   "values": ["draft", "active", "archived"], "shown-on-list": true },
            { "name": "owner",  "type": "ref",    "to": "object:identity.user" }
          ],
          "actions": [
            {
              "id": "action:collaboration.project.create",
              "label": "Create",
              "kind": "command",
              "actor": "user",
              "result": "creates new object:collaboration.project",
              "destructive": false,
              "confirmation-required": false,
              "cancellable": true,
              "undoable": false,
              "feedback-on-success": "toast",
              "feedback-on-failure": "inline-error",
              "fires-events": ["event:collaboration.project-created"]
            },
            {
              "id": "action:collaboration.project.archive",
              "label": "Archive",
              "kind": "command",
              "actor": "owner",
              "result": "status -> archived",
              "destructive": false,
              "confirmation-required": true,
              "cancellable": true,
              "undoable": true,
              "feedback-on-success": "toast",
              "feedback-on-failure": "inline-error",
              "fires-events": ["event:collaboration.project-archived"]
            },
            {
              "id": "action:collaboration.project.list",
              "label": "List",
              "kind": "query",
              "actor": "user",
              "result": "returns object:collaboration.project[]",
              "destructive": false
            }
          ],
          "relationships": [
            { "to": "object:collaboration.task", "kind": "has-many", "label": "tasks", "aggregate-internal": false },
            { "to": "object:identity.user", "kind": "belongs-to", "label": "owner", "aggregate-internal": false }
          ]
        },
        {
          "id": "object:collaboration.due-date",
          "label": "DueDate",
          "purpose": "A deadline associated with a Task.",
          "kind": "value-object",
          "aggregate": "object:collaboration.task",
          "attributes": [
            { "name": "date", "type": "date", "required": true },
            { "name": "timezone", "type": "string", "required": true },
            { "name": "all-day", "type": "boolean", "required": false }
          ],
          "actions": [],
          "relationships": []
        }
      ],
      "events": [
        {
          "id": "event:collaboration.project-created",
          "name": "ProjectCreated",
          "fired-by": ["action:collaboration.project.create"],
          "consumed-by": ["screen:dashboard/main", "behaviour-trigger:welcome-email"]
        },
        {
          "id": "event:collaboration.project-archived",
          "name": "ProjectArchived",
          "fired-by": ["action:collaboration.project.archive"],
          "consumed-by": ["screen:dashboard/main"]
        }
      ]
    },
    {
      "id": "context:identity",
      "label": "Identity",
      "purpose": "Users, sessions, roles, permissions.",
      "objects": [
        {
          "id": "object:identity.user",
          "label": "User",
          "purpose": "Authenticated person interacting with the product.",
          "kind": "entity",
          "aggregate": "object:identity.user",
          "attributes": [
            { "name": "email", "type": "string", "required": true, "shown-on-list": true },
            { "name": "display-name", "type": "string", "required": true, "shown-on-list": true }
          ],
          "actions": [],
          "relationships": []
        }
      ],
      "events": []
    }
  ]
}
```

Then the field rules the schema and `plg-domain` require — no field invented,
none dropped:

- **Every object** has `kind: entity | value-object`, `aggregate: <root-id>` (the
  root references itself), and a one-sentence `purpose`. A missing `kind`,
  `aggregate`, or `purpose` is a **blocker** — the model is broken; don't ship it.
- **Every attribute** has `name` / `type` / `required` / `shown-on-list`;
  reference attributes (`type: ref`) add `to`.
- **Every action** has `kind: command | query`. Every **command** additionally
  carries the five Erik Actions Checklist fields — `confirmation-required`,
  `cancellable`, `undoable`, `feedback-on-success`, `feedback-on-failure` — plus
  `fires-events` (the events it fires; empty is a `warn`, not a blocker). Queries
  carry none of the checklist.
- **Every relationship** has `to` / `kind` / `label` / `aggregate-internal`, and
  appears on both objects it connects (reciprocity; a one-sided relationship is a
  finding).
- **Events** live in each context's `events[]` with `name` / `fired-by` /
  `consumed-by`. The First Strike / KUI / PAI event that `journey.md` is
  measurable-as (in the worked example, `event:artifact-generated`) must exist
  here as a named domain event.
- **Single-context products use one `context:core`** — do not manufacture
  bounded contexts. For genuinely pre-product or single-object surfaces, say the
  model doesn't apply in `product.md`'s / `shape.md`'s narrative rather than emit
  a stub `domain-map.json` (`plg-domain`).

### Step 5 — Write `specs/design/_shared/sitemap.json`

The page hierarchy as a graph, authored after the domain model so every page can
reference real objects. Pages serve the journey's stages (the anchor-result
screen where First Strike lands, the landing / sign-up pages of Select, the
onboarding page of Setup) and each declares which domain objects it shows. This
is the **initial cut** — `plg-flow` extends it as features add pages; author the
pages the journey and domain model already imply, and don't speculatively invent
deep pages the product hasn't earned yet.

Write the file to match artifact-schema §6.3 exactly:

```json
{
  "version": "2",
  "nodes": [
    {
      "id": "page:dashboard",
      "label": "Dashboard",
      "depth": 0,
      "kind": "primary",
      "url": "/",
      "purpose": "Daily entry point after auth",
      "auth": "required",
      "context": "context:collaboration",
      "objects": ["object:collaboration.project", "object:collaboration.task"],
      "screens": ["screen:dashboard/main"],
      "appears-in-flows": ["flow:onboarding", "flow:daily-use"]
    }
  ],
  "edges": [
    {
      "from": "page:dashboard",
      "to": "page:settings",
      "kind": "navigation",
      "trigger": "user-menu",
      "primary": false
    }
  ]
}
```

Field rules:

- **`nodes[]`** — each node: `id` (`page:<slug>`, nested `page:<parent>.<slug>`),
  `label`, `depth` (0 = top level; more than 3 deep is a smell), `kind`
  (`primary | secondary | utility | deep`), `url`, `purpose`, `auth`
  (`none | required | conditional`), `context` (a `context:` id from
  domain-map; `cross` only for a genuine multi-context page, documented in
  nav-model.md), `objects[]` (object ids from domain-map — pages reference
  objects that exist), `screens[]` (`screen:<feature>/<screen>` ids), and
  `appears-in-flows[]` (`flow:` ids; may be empty at this stage — `plg-flow`
  populates them).
- **`edges[]`** — each edge: `from` / `to` (page ids), `kind`
  (`navigation | redirect | conditional | inline-flow`), `trigger` (what causes
  it, e.g. `user-menu`), `primary` (boolean).
- Every `objects[]` reference must resolve to a domain-map object and every
  `context` to a bounded context. An unresolved reference is a blocker — fix the
  reference or add the element to `domain-map.json`; never invent silently
  (`plg-domain`).

### Step 6 — Write `specs/design/_shared/nav-model.md`

The navigation model over the sitemap: the primary pattern, the per-level
patterns, search, and how any cross-context pages are reached. Author it after
the sitemap exists. Match artifact-schema §6.4 (unchanged from v0.1 except
`version: "2"`):

```yaml
---
version: "2"
model: "hierarchical | faceted | flat | hub-and-spoke"
patterns:
  primary: "top-bar | side-rail | command-palette | bottom-tabs"
  secondary: "contextual-sidebar | sub-tabs | breadcrumb-driven | none"
  deep: "breadcrumb | back-only | tree-view | none"
search:
  presence: "primary | secondary | none"
  scope: "global | scoped-to-page"
---

## Rationale
Why this model fits this product. Reference the product's MOAT, audience, and
the kinds of objects in the domain model. ~150–300 words.

## Patterns rejected and why
What was considered and turned down. Critical for downstream skills — without
this, `plg-flow` and `plg-build` regenerate patterns already turned down.

## Open questions
Navigation decisions the product owner still owes.
```

Then the checks:

- **`model` and `patterns` fit the sitemap** — a hierarchical model over a flat
  three-page sitemap is over-built; a flat model over a deep tree loses the user.
- **"Patterns rejected" is filled** — it is load-bearing; without it downstream
  skills regenerate patterns you already turned down.
- **Cross-context pages** (any sitemap node with `context: "cross"`) are explained
  here — how the user reaches them and why the span is justified (`plg-domain`
  treats a cross-context page as a smell to defend, not a default).

### Step 7 — Write one `specs/design/features/<feature-slug>/shape.md` per feature

The per-feature shaping doc — Shape Up's pitch. First, identify the features:
read the journey (Setup's one real step, Showcase's First Strike, Scale's
upgrade / advance) and the sitemap (pages cluster into features) to name the
features the product scopes. Each becomes one `features/<feature-slug>/shape.md`.
Don't invent features the journey and sitemap don't support; if the feature set
is genuinely unclear, surface it as a follow-up question rather than guessing.

For **each** feature, write the file to match artifact-schema §7.1 (`version: "2"`;
v0.2 adds `owns-screens`):

```yaml
---
version: "2"
feature: "<feature-slug>"
owns-screens: ["screen:<area>/<screen-slug>", ...]  # the surfaces THIS feature owns
appetite: "small | medium | large"   # Shape Up appetites; team-defined in weeks
problem: "<one-paragraph problem statement>"
intended-outcome: "<what changes for the user when this ships>"
target-stage: "search | select | setup | showcase | scale"
target-milestone: "first-strike | kui | upgrade | ..."
no-gos: ["<scope explicitly excluded>", ...]
rabbit-holes: ["<known risk and mitigation>", ...]
---

## Solution sketch
Free prose describing the shape of the solution — the structural concept, not the
screens. ~200–500 words.

## Open questions
What needs to be decided in the flow phase (handed to `plg-flow`).
```

Then the checks (`references/shape-up.md`, and the fidelity ladder — CLAUDE.md
Rule 4):

- **One file per feature**, each tracing to a `target-stage` and
  `target-milestone` that exist in `journey.md`.
- **`appetite` is set deliberately** — it bounds scope; a "large" appetite on a
  Setup-stage feature that must stay under the seven-minute clock is a
  contradiction worth catching.
- **Shape, not screens.** shape.md stops at the structural concept; wireframes,
  low-fi, and high-fi are `plg-flow`'s rungs, authored later. Do not sketch
  screens here — that skips a rung of the fidelity ladder.
- **`owns-screens` declares surface ownership, it does not sketch screens.** Derive
  it from the sitemap: the pages that cluster into this feature, and the `screen:`
  ids their `screens[]` carry. List the surfaces the `## Solution sketch` prose
  already claims as *this feature's own* (e.g. a "single Showcase-stage surface —
  Anchor result" → `screen:shape/anchor-result`). **Exactly one owner per screen**
  across all features — a screen another feature owns (a shared entry, an exit
  destination) is *not* listed here even if this feature's flow will pass through it.
  If which feature owns a surface is genuinely ambiguous, that's an open question,
  not a guess (Rule 5). This list is what gates `plg-flow`'s wireframe pass (§7.1).
- **`no-gos` and `rabbit-holes` are real** — an empty no-gos list usually means
  the scope hasn't been bounded yet; surface that rather than leaving it blank.

### Step 8 — Unknowns go to `## Open questions`, never to a placeholder

This is the load-bearing discipline across **all six** files
(`plg-personal-anti-patterns`, and CLAUDE.md Rule 5): **you guide, you do not
author Layer B for the user.** When the user says "I don't know" or leaves a
field blank, do **not** fill it with a plausible-sounding default. A confident
guess in a required field is worse than an honest open question.

- **Prose artifacts** (`product.md`, `journey.md`, `nav-model.md`, and each
  `shape.md`) carry a `## Open questions` section — record the owed decision
  there (e.g. "MOAT market stance undecided; free-model can't be finalised until
  it's set").
- **JSON artifacts** (`domain-map.json`, `sitemap.json`) have no prose section.
  Do **not** invent a field to hold unknowns. Instead: omit what you can't yet
  justify (`plg-domain`: "when in doubt, don't add the object"; the same holds
  for a speculative page), record the owed decision in the nearest prose
  artifact's `## Open questions`, and raise anything blocking as a follow-up
  `<question-form>` before writing. Never fabricate an object, action, event,
  page, or reference just to satisfy the schema.

## Hard rules

- **Six files, in dependency order.** `product.md` (§6.1) → `journey.md` (§6.2) →
  `domain-map.json` (§6.5) → `sitemap.json` (§6.3) → `nav-model.md` (§6.4) → one
  `shape.md` per feature (§7.1). Each only after its inputs exist: never
  journey.md before product.md, never the sitemap before the domain model (pages
  reference objects), never a shape.md before the journey and sitemap name its
  feature.
- **Domain model before sitemap.** Objects are defined before pages, because
  pages and screens reference them. Author `domain-map.json` first, then the
  sitemap over it.
- **Product-scope only.** Flow- and screen-scope artifacts (`flow-graph.json`,
  `straight-line.md`, `wireframe.json`, `low-fi.json`, `high-fi.*`, `critique.md`)
  belong to `plg-flow` / `plg-critique`, not here. The sitemap you write is the
  initial cut; `plg-flow` extends it.
- **Write to disk; no `<artifact>` block.** These are specs, not HTML surfaces —
  there is no iframe preview.
- **Discovery before writing.** Turn 1 is the product-shape form and a stop,
  every time. When a later artifact needs inputs the prior ones didn't capture,
  gather them with a short follow-up `<question-form>` before writing it — don't
  invent.
- **No invented Layer B.** Unknowns are open questions, not defaults. Prose
  artifacts get a `## Open questions`; JSON artifacts hold nothing you can't
  justify (record the gap in the nearest prose artifact, raise blockers as a
  follow-up form).
- **Schema fields verbatim** — §6.1 / §6.2 / §6.5 / §6.3 / §6.4 / §7.1, every
  block with `version: "2"`. Don't add, rename, or drop fields the schema
  defines; on every `kind: command` action, all five Erik Actions Checklist
  fields are required.
