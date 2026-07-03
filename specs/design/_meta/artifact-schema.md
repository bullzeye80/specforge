# Specforge Artifact Schema (v0.2)

> **Status.** Working baseline for the fork. Supersedes v0.1.
>
> **Changes from v0.1.** Five Erik-derived schema changes (enumerated states, Actions Checklist fields, simplicity-pass field, default sizing tokens) plus six DDD-derived changes (`object-map.json` → `domain-map.json`, bounded contexts, entities vs value objects, aggregates, events, command/query classification). Plus PAI as a `journey.md` field. v0.1 lives alongside as `artifact-schema-v0.1.md` for diff reference.
>
> **Out of scope.** Skill prompts, surface implementation, full Layer B template, aesthetic decisions. Those come during the build phase.

---

## 1. Purpose and shape

The `specs/design/` directory is a **structured, version-controlled, human-readable specification of a product's design at progressive levels of fidelity**. Skills produce its files. The surface (specforge, our fork of OD) renders them. Downstream coding agents consume them as build specs.

Three principles:

1. **Stack-agnostic.** Nothing here assumes Next.js, React, Phoenix, or any specific stack. Artifacts describe *what* and *why*, never *how-to-implement*.
2. **Composable by reference, not by inlining.** Lower-fidelity artifacts are referenced by higher-fidelity ones, not duplicated.
3. **Two formats, picked by content type.** JSON for graph- and tree-shaped artifacts the surface needs to render or traverse. Markdown with YAML frontmatter for prose-dominated artifacts where humans are the primary reader.

---

## 2. The three scopes

| Scope   | What it describes                                  | Lifetime            | Cardinality                  |
|---------|----------------------------------------------------|---------------------|------------------------------|
| Product | The whole product's structure and shared decisions | Stable; evolves slowly | One per project              |
| Flow    | One feature or end-to-end journey through the product | Per feature         | Many per project             |
| Screen  | One destination (page, panel, modal) inside a flow | Per screen          | Many per flow, may be shared |

Scopes nest: product contains flows, flows contain screens. A screen can appear in multiple flows. The sitemap is the source of truth for which screens exist.

---

## 3. Folder structure

```
specs/design/
  _shared/                       # product-scope artifacts
    product.md
    journey.md
    sitemap.json
    nav-model.md
    domain-map.json              # was object-map.json in v0.1
    aesthetic.md                 # Layer B; OD-derived DESIGN.md schema
    anti-patterns.md             # Layer B
    tokens.json                  # Layer B; auto-generated where possible
    components.md                # Layer B
  features/
    <feature-slug>/              # flow-scope artifacts
      shape.md
      flow-graph.json
      straight-line.md
      screens/
        <screen-slug>/           # screen-scope artifacts
          wireframe.json
          low-fi.json
          high-fi.json
          high-fi.html           # or .svg; the rendered representation
      critique.md
  _meta/
    artifact-schema.md           # this document
```

Conventions:

- `<feature-slug>` and `<screen-slug>` are kebab-case, ASCII, no slashes.
- Multiple flows that share screens reference them via the sitemap; they aren't duplicated. The screen folder's canonical home is `features/<owning-feature>/screens/<screen-slug>/`.
- Branching is git-native. Feature branches in the host repo carry `specs/design/` with them.

---

## 4. ID and reference conventions

IDs are namespaced strings, lowercase ASCII, kebab-case within segments, colon between type and value, slash for hierarchy.

| Kind                | Format                                              | Example                              |
|---------------------|------------------------------------------------------|--------------------------------------|
| Sitemap page node   | `page:<slug>`                                        | `page:dashboard`                     |
| Sitemap nested page | `page:<parent>.<slug>`                               | `page:settings.profile`              |
| Flow                | `flow:<feature-slug>`                                | `flow:onboarding`                    |
| Place (in a flow)   | `place:<slug>`                                       | `place:landing`                      |
| Screen              | `screen:<feature-slug>/<screen-slug>`                | `screen:onboarding/welcome`          |
| **Bounded context** | `context:<slug>`                                     | `context:collaboration`              |
| Object              | `object:<context>.<noun>` or `object:<noun>` if single-context | `object:collaboration.project`, `object:project` |
| Action              | `action:<object>.<verb>`                             | `action:project.archive`             |
| Event               | `event:<context>.<past-tense>` or `event:<past-tense>` | `event:collaboration.project-archived`, `event:project-archived` |
| Region              | `region:<slug>` (scoped within a screen)             | `region:main`                        |
| Affordance          | `aff:<slug>` (scoped within a flow)                  | `aff:cta-signup`                     |

References between artifacts use these IDs. The surface resolves them to folder paths via the sitemap and domain map.

---

## 5. Versioning

Every artifact carries a `version` string at the top level. This v0.2 schema sets every artifact's `version` to `"2"`. Schema changes that break consumers bump this. v0.1 artifacts are forward-compatible only where this doc says so explicitly; otherwise they need migration.

---

## 6. Product-scope artifacts

### 6.1 `product.md`

Purpose: the one-page anchor for the product. JTBD, ideal user, endgame, MOAT outputs.

Format: markdown with YAML frontmatter.

```yaml
---
version: "2"
name: "<product name>"
slug: "<kebab-case slug>"
ideal-user:
  role: "<job title or role>"
  context: "<situation that creates pull>"
  endgame: "<one-sentence statement of the user's win state>"
jtbd:
  job: "<when X, I want Y, so I can Z>"
  forces:
    push: ["<frustration with current solution>", ...]
    pull: ["<attraction of new solution>", ...]
    anxiety: ["<fear of switching>", ...]
    habit: ["<inertia of current>", ...]
moat:
  market: "dominant | differentiated | disruptive"
  ocean: "red | blue"
  audience: "top-down | bottom-up | hybrid"
  time-to-value: "<estimate, e.g. '< 7 minutes'>"
  free-model: "free-trial | freemium | reverse-trial | demo"
  free-model-rationale: "<why this model fits MOAT>"
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
Free prose describing the product, the user, the bet. ~300–600 words.

## Open questions
Things this skill couldn't resolve and the product owner needs to decide.
```

Authored by: `plg-shape`. Read by: every other skill.

### 6.2 `journey.md`

Purpose: the user roadmap. Search → Select → Setup → Showcase → Scale, with First Strike, KUI, **and PAI** explicitly marked.

Format: markdown with YAML frontmatter.

```yaml
---
version: "2"
first-strike:
  description: "<the first time the user experiences core value>"
  measurable-as: "<the event that fires when this happens, e.g. 'event:spec-published fires for the first time'>"
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
  search:
    problem-aware: "<what the user is doing here>"
    active-research: "<what the user is doing here>"
  select:
    visit: "..."
    sign-up: "..."
  setup:
    profile: "..."
    onboarding: "..."
  showcase:
    first-strike: "<reference to first-strike above>"
    kui: "<reference to kui above>"
  scale:
    upgrade: "..."
    advance: "..."
---

## Narrative
Free prose describing the journey at each stage and the failure modes
this product specifically needs to defend against.
```

**v0.2 change:** PAI is a new top-level field. Required when `journey.md` is authored at all. Per `eureka.md`, PAI is the leading indicator distinct from First Strike (one-time) and KUI (habit threshold).

Authored by: `plg-shape`. Read by: `plg-flow` (uses First Strike to anchor Straight-Line targets), `plg-critique`.

### 6.3 `sitemap.json`

Purpose: the page hierarchy as a graph.

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

**v0.2 change:** `nodes[].context` is new (optional). When the product has multiple bounded contexts, each page declares which context it primarily lives in. Pages spanning contexts (rare; usually a smell per `domain.md`) declare `context: "cross"` and document why in `nav-model.md`.

Field semantics unchanged from v0.1 except:

- `objects` references now use the bounded-context-namespaced form when applicable.

Authored by: `plg-shape` (initial cut), updated by `plg-flow` as features add pages. Read by: surface (left-rail navigation), every flow-scope artifact.

### 6.4 `nav-model.md`

Unchanged from v0.1. Bumps `version` to `"2"`.

### 6.5 `domain-map.json` (was `object-map.json` in v0.1)

Purpose: the OOUX + DDD output. Bounded contexts, objects, attributes, actions, relationships, events.

**v0.2: this is a substantial restructure.** Top-level structure is now `bounded-contexts[]`, each with its own `objects[]` and `events[]`.

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

**v0.2 changes:**

- `bounded-contexts[]` is the new top-level structure. v0.1 single-context products map to a single context — usually called `context:core`.
- Each object has `kind: entity | value-object` (required).
- Each object has `aggregate: <root-object-id>` (required). The root references itself.
- Each action has `kind: command | query` (required).
- Each action has Erik's Actions Checklist fields: `confirmation-required`, `cancellable`, `undoable`, `feedback-on-success`, `feedback-on-failure`. Required for all `kind: command` actions.
- Each action has `fires-events: [event-id, ...]` (optional; populated for state-changing commands).
- Each relationship has `aggregate-internal: true | false`.
- Each context has an `events[]` array.

Authored by: `plg-shape`. Read by: `plg-flow` (every flow operates on objects/actions), `plg-critique` (all the v0.2 fields are checkable).

---

## 7. Flow-scope artifacts

### 7.1 `shape.md`

Unchanged from v0.1. Bumps `version` to `"2"`.

### 7.2 `flow-graph.json`

**v0.2 change:** flows gain a `use-case` field; affordances inherit the action's `kind` (command or query) when they trigger a domain action.

```json
{
  "version": "2",
  "feature": "onboarding",
  "use-case": "OnboardNewUser",
  "entry": "place:landing",
  "exit-success": "place:first-spec-published",
  "exit-failure": ["place:abandoned-signup"],
  "first-strike-place": "place:first-spec-published",
  "places": [
    {
      "id": "place:landing",
      "label": "Landing",
      "screen": "screen:onboarding/landing",
      "page": "page:home",
      "affordances": [
        {
          "id": "aff:cta-signup",
          "label": "Sign up CTA",
          "kind": "primary-action",
          "leads-to": "place:signup",
          "triggers-action": null,
          "action-kind": null
        },
        {
          "id": "aff:learn-more",
          "label": "Learn more",
          "kind": "secondary-link",
          "leads-to": "place:about",
          "triggers-action": null,
          "action-kind": null
        }
      ]
    }
  ],
  "connections": [
    { "from": "aff:cta-signup", "to": "place:signup" }
  ]
}
```

Field semantics:

- `use-case`: a named application use case (per Explicit Architecture). PascalCase. The flow implements this use case.
- `affordances[].triggers-action`: optional. When the affordance triggers a domain action (per `domain-map.json`), this is the action ID. Null for pure-navigation affordances.
- `affordances[].action-kind`: inherited from the triggered action's `kind`. Null when `triggers-action` is null. Drives `plg-critique`'s command-vs-query check (a "primary-action" affordance triggering a query is a smell).

### 7.3 `straight-line.md`

Unchanged from v0.1. Bumps `version` to `"2"`.

---

## 8. Screen-scope artifacts

### 8.1 `wireframe.json`

Unchanged from v0.1. Bumps `version` to `"2"`.

### 8.2 `low-fi.json`

**v0.2 changes:** the `states` array now uses Erik's enumerated taxonomy with required sub-fields per state type. Optional `simplicity-pass` field added. `behaviour-notes` retained as in v0.1 (we parked the `responsive-behavior` field).

```json
{
  "version": "2",
  "screen": "screen:onboarding/welcome",
  "wireframe-ref": "wireframe.json",
  "viewport": {
    "primary": "desktop",
    "supported": ["desktop", "tablet", "mobile"],
    "breakpoints": [
      { "name": "desktop", "min-width": 1024 },
      { "name": "tablet", "min-width": 640 },
      { "name": "mobile", "min-width": 0 }
    ]
  },
  "layout": {
    "kind": "grid",
    "columns": 12,
    "regions": [
      { "region-id": "region:header", "row": 1, "col": "1-12", "height": "64px",  "sticky": true },
      { "region-id": "region:main",   "row": 2, "col": "3-10", "height": "auto",  "vertical-align": "centre" },
      { "region-id": "region:footer", "row": 3, "col": "1-12", "height": "auto",  "sticky": "bottom" }
    ]
  },
  "information-hierarchy": {
    "primary":     ["region:main > heading", "region:main > primary-cta"],
    "secondary":   ["region:main > body-text"],
    "tertiary":    ["region:header > user-menu", "region:footer > skip-link"],
    "above-fold":  ["region:main > heading", "region:main > primary-cta"],
    "reading-order": [
      "region:main > heading",
      "region:main > body-text",
      "region:main > primary-cta",
      "region:footer > skip-link"
    ],
    "progressive-disclosure": [],
    "rationale": "Heading + CTA must dominate; body-text supports; nav and skip are tertiary because this is a focused first-action screen."
  },
  "density": "generous",
  "content-placeholders": {
    "region:main > heading":      "Welcome to <product>",
    "region:main > body-text":    "Specs are how we capture what to build before we build it. Let's create your first one. (~25 words placeholder)",
    "region:main > primary-cta":  "Start your first spec",
    "region:footer > skip-link":  "Skip for now"
  },
  "states": [
    { "kind": "ideal", "name": "default" },
    { "kind": "ideal", "name": "scrolled" },
    { "kind": "loading", "name": "loading-user", "duration-band": "1-5s", "regions-affected": ["region:header"] },
    { "kind": "blank", "name": "first-use", "sub-kind": "first-use" },
    { "kind": "error", "name": "server-error", "error-kind": "server-error" }
  ],
  "simplicity-pass": {
    "alignment": "All elements aligned to the 12-col grid; CTA centered with heading.",
    "spacing": "Internal space < external space verified at desktop and tablet.",
    "consistency": "Header reuses AppHeader from components.md; CTA reuses Button primary variant.",
    "lightening": "Footer skip-link at 60% opacity; user-menu icon-only without label per existing pattern.",
    "hiding": "Onboarding stepper hidden until step 2; rationale: step 1 is the welcome moment, no progress needed yet.",
    "removing": "Original wireframe had a 'learn more' link in main region — removed; users clicked once, contributing zero conversions in earlier flows."
  },
  "behaviour-notes": [
    "Primary CTA should be focused on screen mount.",
    "Skip link should not appear in the first viewport on mobile."
  ]
}
```

**v0.2 state taxonomy** (per `erik-kennedy.md`):

Each state has a `kind` from this enumeration:

| `kind` | Required sub-fields |
|---|---|
| `ideal` | `name` (e.g. `default`, `scrolled`) |
| `blank` | `name`, `sub-kind` ∈ {`first-use`, `cleared`, `no-results`} |
| `partial` | `name` (e.g. `creating-first-item`, `incentivising-further`) |
| `loading` | `name`, `duration-band` ∈ {`1-5s`, `5-30s`, `30-plus-s`} |
| `error` | `name`, `error-kind` ∈ {`missing-input`, `invalid-input`, `connectivity`, `airplane-mode`, `server-error`, `warning`} |
| `toggleable` | `name` (e.g. `hovered`, `menus-open`, `tabs-shown`) |
| `lengthy-input` | `name` (e.g. `long-text`, `wide-image`) |
| `user-based` | `name` ∈ {`logged-in`, `anonymous`, `admin`, `<role>`} |

`regions-affected` is optional on any state and lists region IDs that change.

**v0.2 simplicity-pass** (per Erik's 6 Strategies of Simplicity, in `erik-kennedy.md`):

Optional field. When populated, each of the six strategies has a one-sentence note documenting decisions made in that dimension. The agent populates this when the screen has notable decisions worth capturing. Empty notes are preferable to absent fields when the screen genuinely has nothing notable in a strategy.

`plg-critique`'s simplicity pass uses this field as input when present, generates findings against the strategies otherwise.

### 8.3 `high-fi.json` and `high-fi.html`

`high-fi.json` v0.2 changes: `tokens-used` references Layer B's `tokens.json` (which now has Erik's default sizing scale baked in unless overridden). `components-used` continues to reference `components.md`. `data-od-id` attributes (per OD's comment-mode convention, inherited via the fork) on every region in the rendered HTML.

```json
{
  "version": "2",
  "screen": "screen:onboarding/welcome",
  "low-fi-ref": "low-fi.json",
  "render-target": "high-fi.html",
  "render-source": "claude-design | v0 | open-design | hand-authored | plg-build",
  "render-source-notes": "Composed via OD's existing artifact loop; iterated x2.",
  "components-used": [
    { "region-id": "region:header", "component": "AppHeader",                "props": { "variant": "post-auth" } },
    { "region-id": "region:main",   "component": "OnboardingWelcomePanel",   "props": { "step": 1, "totalSteps": 3 } }
  ],
  "tokens-used": [
    "color.surface.primary",
    "color.text.primary",
    "color.accent.primary",
    "space.lg",
    "typography.display.lg",
    "typography.body.md"
  ],
  "content": {
    "region:main > heading":     "Welcome, {firstName}",
    "region:main > body-text":   "Specs are how we capture what to build before we build it. Let's create your first one.",
    "region:main > primary-cta": "Start your first spec",
    "region:footer > skip-link": "Skip for now"
  },
  "states-rendered": [
    { "name": "default",       "render-target": "high-fi.html" },
    { "name": "loading-user",  "render-target": "high-fi.loading-user.html" }
  ],
  "deviations-from-low-fi": [
    "Reduced heading from display.xl to display.lg after composing — display.xl overpowered the CTA at desktop."
  ],
  "od-comment-tags": ["region-header", "region-main", "region-footer", "primary-cta"]
}
```

**v0.2 changes:**

- `render-source` enum extended to include `open-design` (composed via our fork's existing skill loop) and `plg-build` (eventually our in-house composer).
- `od-comment-tags` is a new array listing the `data-od-id` values present in the rendered HTML, so the surface can resolve comment-mode targets back to regions.

`high-fi.html` (or `.svg`): the rendered representation. Inline CSS or `<style>` block. No external scripts. Standalone-renderable in OD's existing iframe sandbox. Every top-level region carries a `data-od-id="<region-slug>"` attribute (per OD's comment-mode convention, inherited via the fork).

---

## 9. Layer B handoff (DESIGN.md schema)

**v0.2 confirms:** Layer B's `aesthetic.md` (renamed) adopts VoltAgent / OD's 9-section `DESIGN.md` schema directly. The nine sections:

1. Visual theme & atmosphere
2. Color palette & roles
3. Typography rules
4. Spacing scale
5. Layout principles
6. Components
7. Motion
8. Voice
9. Brand & anti-patterns

Plus our additions to section 9 (anti-patterns) carrying the per-product specifics, while inheriting from the Layer A `personal-anti-patterns.md` lens.

`_shared/tokens.json` ships with Erik's default sizing scale unless explicitly overridden by the product:

```json
{
  "version": "2",
  "typography": {
    "h1": { "mobile": "32px", "desktop": "40px", "weight": 600 },
    "h2": { "mobile": "24px", "desktop": "30px", "weight": 600 },
    "body": { "mobile": "16px", "desktop": "16px", "weight": 400 },
    "secondary": { "mobile": "14px", "desktop": "14px", "weight": 400 },
    "label": { "mobile": "14px", "desktop": "14px", "weight": 500, "tracking": "0.06em", "case": "uppercase" }
  },
  "spacing": {
    "xs": "4px", "sm": "8px", "md": "16px", "lg": "24px", "xl": "40px", "2xl": "64px"
  },
  "ui-elements": {
    "form-control-height": { "mobile": "44px", "desktop": "40px" },
    "primary-cta-height": { "mobile": "44px", "desktop": "48px" },
    "icon-square": "20px",
    "tap-target": { "ios": "44px", "android": "48px" },
    "side-margins": { "mobile": "16px", "desktop": "32px" }
  }
}
```

These are *defaults*. Per-product `tokens.json` overrides any subset.

---

## 10. Cross-cutting and meta artifacts

### 10.1 `critique.md`

Unchanged from v0.1 in shape. v0.2 changes the `levels` to reflect new check categories:

```yaml
---
version: "2"
date: "<ISO-date>"
scope: "product | feature | screen"
target: "<path or ID>"
critic: "plg-critique"
levels:
  ia:          "pass | warn | fail"   # information architecture (sitemap, nav model, page depth)
  ih:          "pass | warn | fail"   # information hierarchy (per screen)
  domain:      "pass | warn | fail"   # OOUX + DDD (NEW in v0.2)
  surface:     "pass | warn | fail"   # Nielsen-Norman heuristics
  simplicity:  "pass | warn | fail"   # Erik's 6 strategies (NEW in v0.2)
  states:      "pass | warn | fail"   # Erik's screen states coverage (NEW in v0.2)
  funnel:      "pass | warn | fail"   # PLG funnel impact
findings-count:
  blocker: 0
  major:   0
  minor:   0
---

## Information architecture
...

## Information hierarchy
...

## Domain
...

## Surface (Nielsen / Norman)
...

## Simplicity (Erik's 6 strategies)
...

## States (Erik's taxonomy)
...

## Funnel (PLG)
...
```

### 10.2 `_meta/artifact-schema.md`

This document.

---

## 11. What this commits the skills to

Updated for v0.2:

- **`plg-shape`** produces: `product.md`, `journey.md` (with PAI), `sitemap.json` (with `context` field), `nav-model.md`, **`domain-map.json`** (bounded contexts, entities/value objects, aggregates, commands/queries, events), and one `shape.md` per feature it scopes.
- **`plg-flow`** produces: per feature, `flow-graph.json` (with `use-case` and `action-kind` inheritance), `straight-line.md`, and per screen, `wireframe.json` and `low-fi.json` (with Erik's enumerated states and optional simplicity-pass). May update `sitemap.json` to add new pages.
- **`plg-critique`** produces: `critique.md` at any scope. Reads everything; writes only critiques. Runs seven check categories: ia, ih, domain, surface, simplicity, states, funnel.
- **`plg-build`** (Phase 2): produces `high-fi.json` and `high-fi.html` with `od-comment-tags`. In Phase 1 these are composed via OD's existing artifact loop or hand-authored.

The surface (specforge, our OD fork) reads all of the above and renders them at three navigation levels: product (sitemap, nav-model, domain-map, journey), flow (flow-graph, straight-line, list of screens), screen (the three fidelity rungs side by side).

---

## 12. Migration from v0.1

Mostly mechanical:

1. `object-map.json` → `domain-map.json` — file rename. Wrap existing `objects[]` in a single `bounded-contexts[]` entry called `context:core`. Add `kind: entity` to every object. Add `aggregate: <self-id>` to every object root. Add `kind: command | query` to every action.
2. `low-fi.json` `states` arrays — each state needs a `kind` field and the corresponding sub-field (`duration-band`, `error-kind`, `sub-kind`) where applicable.
3. `journey.md` — add `pai` block.
4. `sitemap.json` — add `context` field to nodes (or `context: "core"` for single-context products).
5. `flow-graph.json` — add `use-case` field; add `triggers-action` and `action-kind` to affordances that trigger domain actions.
6. `high-fi.json` — add `od-comment-tags` array; ensure rendered HTML carries `data-od-id` per region.
7. `critique.md` — extend `levels` block with `domain`, `simplicity`, `states`.

For greenfield products (specforge's first worked example will be), no migration — author against v0.2 directly.

---

## 13. Open questions and intentional gaps

Carried over from v0.1 (still open in v0.2):

1. **Variants beyond states.** Light/dark, role-based view differences, A/B tests. Future `variants` field.
2. **Responsive breakpoint deltas.** Still in `behaviour-notes` rather than a structured field. Known weakness.
3. **Content as a separate artifact.** Voice/tone/CTA vocabulary live in Layer B's `aesthetic.md` section 8. Per-screen content stays inline in low-fi/high-fi.
4. **Component variants** — captured in `components.md`, not constrained at the schema level.
5. **Animation and motion** — Layer B's `aesthetic.md` section 7. No artifact-level capture beyond `behaviour-notes`.
6. **Accessibility annotations** — partially captured in `regions[].role` and Erik's states. A dedicated accessibility pass is Phase 2 critique work.
7. **Screen sharing across flows** — first feature owns the screen. Fragile if features reorganise. May need `_shared/screens/` later.
8. **Internationalisation** — single-language by default. No i18n schema.

New in v0.2:

9. **Junction objects in many-to-many with attributes.** `domain.md` says these auto-promote to their own entity (a `ProjectMembership` entity). The schema doesn't enforce this — `plg-critique` checks for it and surfaces a finding. Open whether this should harden into a schema-level rule.
10. **Cross-context references.** Currently by ID only, no schema for "this read-only view of an Identity user appears in the Collaboration context." Probably needs a `cross-context-views` field on contexts, deferred until we hit a real product that needs it.

---

*End of v0.2. v0.1 lives at `artifact-schema-v0.1.md` for diff reference.*
