# PLG Design Artifact Schema (v0.1 draft)

> **Status.** Draft for review. This is the contract between the four `plg-*` skills, the `specforge` surface, and any downstream coding agent. Everything else in Phase 1 builds against this document, so it has to be right before we proceed.
>
> **Out of scope for this doc.** Skill prompts, surface implementation, product-context Layer B, aesthetic decisions. Those come after.

---

## 1. Purpose and shape of the system

The `specs/design/` directory is a **structured, version-controlled, human-readable specification of a product's design at progressive levels of fidelity**. Skills produce its files. The surface renders them. Downstream coding agents consume them as build specs.

The schema has three principles it tries to honour throughout:

1. **Stack-agnostic.** Nothing in here assumes Next.js, React, Phoenix, or any specific stack. Artifacts describe *what* and *why*, never *how-to-implement*.
2. **Composable by reference, not by inlining.** Lower-fidelity artifacts are referenced by higher-fidelity ones, not duplicated into them. A change to the wireframe doesn't require rewriting the high-fi.
3. **Two formats, picked by content type.** JSON for graph- and tree-shaped artifacts the surface needs to render or traverse. Markdown with YAML frontmatter for prose-dominated artifacts where humans are the primary reader.

---

## 2. The three scopes

Every artifact lives at one of three scopes. The scopes nest: product contains flows, flows contain screens.

| Scope   | What it describes                                  | Lifetime            | Cardinality                  |
|---------|----------------------------------------------------|---------------------|------------------------------|
| Product | The whole product's structure and shared decisions | Stable; evolves slowly | One per project              |
| Flow    | One feature or end-to-end journey through the product | Per feature         | Many per project             |
| Screen  | One destination (page, panel, modal) inside a flow | Per screen          | Many per flow, may be shared |

A screen can appear in multiple flows. A flow can span screens that already exist for other flows. The sitemap is the source of truth for which screens exist.

---

## 3. Folder structure

```
specs/design/
  _shared/                       # product-scope artifacts
    product.md
    journey.md
    sitemap.json
    nav-model.md
    object-map.json
    aesthetic.md                 # part of Layer B; see product-context spec
    anti-patterns.md             # part of Layer B
    tokens.json                  # part of Layer B; auto-generated where possible
    components.md                # part of Layer B
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
- Multiple flows that share screens reference them via the sitemap; they aren't duplicated. (The screen folder's canonical home is `features/<owning-feature>/screens/<screen-slug>/`. Other features link by sitemap node ID.)
- Branching is git-native. Feature branches in the host repo carry `specs/design/` with them. No artifact-level branching metadata.

---

## 4. ID and reference conventions

IDs are namespaced strings. Always lowercase, ASCII, kebab-case within segments. Colon separates the type, slash separates hierarchy.

| Kind                | Format                                  | Example                              |
|---------------------|------------------------------------------|--------------------------------------|
| Sitemap page node   | `page:<slug>`                            | `page:dashboard`                     |
| Sitemap nested page | `page:<parent>.<slug>`                   | `page:settings.profile`              |
| Flow                | `flow:<feature-slug>`                    | `flow:onboarding`                    |
| Place (in a flow)   | `place:<slug>`                           | `place:landing`                      |
| Screen              | `screen:<feature-slug>/<screen-slug>`    | `screen:onboarding/welcome`          |
| Object (OOUX)       | `object:<noun>`                          | `object:project`                     |
| Action              | `action:<verb>` or scoped `action:<object>.<verb>` | `action:archive`, `action:project.archive` |
| Region              | `region:<slug>` (scoped within a screen) | `region:main`                        |
| Affordance          | `aff:<slug>` (scoped within a flow)      | `aff:cta-signup`                     |

References between artifacts use these IDs. Example: a flow's `flow-graph.json` references screens by their `screen:` ID, and the surface resolves that to a folder path via the sitemap.

---

## 5. Versioning

Every artifact carries a `version` string at the top level. v0.1 of the schema sets every artifact's `version` to `"1"`. Schema changes that break consumers bump this. The schema doc itself versions separately (this is v0.1 of the schema doc).

---

## 6. Product-scope artifacts

### 6.1 `product.md`

Purpose: the one-page anchor for the product. JTBD, ideal user, endgame, MOAT outputs. Read first by every skill.

Format: markdown with YAML frontmatter.

```yaml
---
version: "1"
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

Authored by: `plg-shape`. Edited by: humans. Read by: every other skill.

### 6.2 `journey.md`

Purpose: the user roadmap. Search → Select → Setup → Showcase → Scale, with First Strike and KUI explicitly marked.

Format: markdown with YAML frontmatter.

```yaml
---
version: "1"
first-strike:
  description: "<the first time the user experiences core value>"
  measurable-as: "<the event that fires when this happens>"
  appears-in: "screen:<feature-slug>/<screen-slug>"
kui:
  description: "<the habit signal — repeated value experience>"
  measurable-as: "<event + frequency, e.g. '5 specs published in 7 days'>"
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

Authored by: `plg-shape`. Read by: `plg-flow` (uses First Strike to anchor Straight-Line targets), `plg-critique` (checks every screen against where it sits in the journey).

### 6.3 `sitemap.json`

Purpose: the page hierarchy as a graph. Source of truth for which screens exist.

Format: JSON.

```json
{
  "version": "1",
  "nodes": [
    {
      "id": "page:dashboard",
      "label": "Dashboard",
      "depth": 0,
      "kind": "primary",
      "url": "/",
      "purpose": "Daily entry point after auth",
      "auth": "required",
      "objects": ["object:project", "object:task"],
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

Field semantics:

- `depth`: the page's depth in the primary navigation hierarchy. `0` = top level. Used to detect orphans and excessive depth (more than 3 is a smell).
- `kind`: `primary | secondary | utility | deep`. Drives nav model decisions and visual emphasis.
- `auth`: `none | required | conditional`. Conditional is for pages that change shape based on auth state.
- `objects`: which OOUX objects appear on this page. Lets `plg-critique` check that pages and objects align.
- `screens`: which screen-scope artifacts realise this page. A page can have multiple screens (e.g. empty state, populated state, error state) — those are separate screen artifacts.
- `appears-in-flows`: cross-reference; populated by flows declaring they touch this page.
- `edges.kind`: `navigation | redirect | conditional | inline-flow`. Inline-flow is when a page launches a flow without changing URL (a modal-driven flow, for instance).

Authored by: `plg-shape` (initial cut), updated by `plg-flow` as features add pages. Read by: surface (left-rail navigation), every flow-scope artifact.

### 6.4 `nav-model.md`

Purpose: declares the navigation model the product commits to and the patterns chosen at each level.

Format: markdown with YAML frontmatter.

```yaml
---
version: "1"
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
Why this model fits this product. Reference the product's MOAT, audience,
and the kinds of objects in the OOUX. ~150–300 words.

## Patterns rejected and why
What we considered and turned down. Critical for the agent — without
this, it'll regenerate rejected patterns.
```

Authored by: `plg-shape`. Read by: every screen-scope artifact (header/nav region must conform).

### 6.5 `object-map.json`

Purpose: OOUX output. Nouns of the system, their attributes, actions, and relationships.

Format: JSON.

```json
{
  "version": "1",
  "objects": [
    {
      "id": "object:project",
      "label": "Project",
      "purpose": "A unit of work the user owns",
      "attributes": [
        { "name": "title",  "type": "string", "required": true,  "shown-on-list": true },
        { "name": "status", "type": "enum",   "values": ["draft","active","archived"] },
        { "name": "owner",  "type": "ref",    "to": "object:user" }
      ],
      "actions": [
        { "id": "action:project.create",  "label": "Create",  "actor": "user",          "result": "creates new object:project" },
        { "id": "action:project.archive", "label": "Archive", "actor": "owner",         "result": "status -> archived" },
        { "id": "action:project.delete",  "label": "Delete",  "actor": "owner",         "result": "destroys object", "destructive": true }
      ],
      "relationships": [
        { "to": "object:task", "kind": "has-many", "label": "tasks" },
        { "to": "object:user", "kind": "belongs-to", "label": "owner" }
      ]
    }
  ]
}
```

Field semantics:

- `attributes.shown-on-list`: hints to the agent which attributes appear in list views vs detail views.
- `actions.actor`: who can perform this action. `user | owner | admin | system | <role>`. Drives auth checks and UI visibility.
- `actions.destructive`: marks actions that need confirmation. Drives `plg-critique` to check confirmation flows exist.
- `relationships.kind`: `has-many | belongs-to | many-to-many | has-one`.

Authored by: `plg-shape`. Read by: `plg-flow` (every flow operates on objects), `plg-critique` (checks every action has a UI surface and every confirmation gate is present).

---

## 7. Flow-scope artifacts

### 7.1 `shape.md`

Purpose: the Shape Up pitch for one feature. Appetite, problem, solution sketch, rabbit holes, no-gos. Per feature, lives at `features/<feature-slug>/shape.md`.

Format: markdown with YAML frontmatter.

```yaml
---
version: "1"
feature: "<feature-slug>"
appetite: "small | medium | large"   # Shape Up appetites; team-defined in weeks
problem: "<one-paragraph problem statement>"
intended-outcome: "<what changes for the user when this ships>"
target-stage: "search | select | setup | showcase | scale"
target-milestone: "first-strike | kui | upgrade | ..."
no-gos: ["<scope explicitly excluded>", ...]
rabbit-holes: ["<known risk and mitigation>", ...]
---

## Solution sketch
Free prose describing the shape of the solution. Not the screens —
the structural concept. ~200–500 words.

## Open questions
What needs to be decided in the flow phase.
```

Authored by: `plg-shape`. Read by: `plg-flow` (every screen-scope artifact must trace to this), `plg-critique` (checks the feature delivers the intended outcome).

### 7.2 `flow-graph.json`

Purpose: the Shape Up breadboard for this feature. Places, affordances, connections. **This is the wireframe at flow scope.** There is no separate flow-level wireframe artifact.

Format: JSON.

```json
{
  "version": "1",
  "feature": "onboarding",
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
        { "id": "aff:cta-signup", "label": "Sign up CTA", "kind": "primary-action", "leads-to": "place:signup" },
        { "id": "aff:learn-more", "label": "Learn more",  "kind": "secondary-link", "leads-to": "place:about" }
      ]
    },
    {
      "id": "place:signup",
      "label": "Sign up",
      "screen": "screen:onboarding/signup",
      "page": "page:signup",
      "affordances": [
        { "id": "aff:submit-signup", "label": "Submit",  "kind": "primary-action",  "leads-to": "place:welcome" },
        { "id": "aff:abandon",       "label": "Abandon", "kind": "implicit-exit",   "leads-to": "place:abandoned-signup" }
      ]
    }
  ],
  "connections": [
    { "from": "aff:cta-signup",   "to": "place:signup" },
    { "from": "aff:submit-signup","to": "place:welcome" }
  ]
}
```

Field semantics:

- `entry`: the place a new user enters at.
- `exit-success` / `exit-failure`: terminal places.
- `first-strike-place`: marks where in the flow the user crosses the First Strike line. Must reference a place defined here. `plg-critique` checks this matches `journey.md`.
- `places.screen`: the screen that realises this place. Source of truth links flow → screen folder.
- `places.page`: which sitemap page this place lives on. (Multiple places can share a page if the place transitions are inline-flow, e.g. modal-driven.)
- `affordances.kind`: `primary-action | secondary-action | secondary-link | implicit-exit | dismiss`. Used by surface for visual emphasis when rendering the breadboard.

Authored by: `plg-flow`. Read by: surface (renders as a node-edge graph), `plg-critique` (checks for orphan places, missing affordances, dead-ends without exits).

### 7.3 `straight-line.md`

Purpose: the linear narrative of the flow's success path, with explicit steps. The companion to `flow-graph.json` — the graph shows possibilities, the straight line shows the canonical path.

Format: markdown with YAML frontmatter.

```yaml
---
version: "1"
feature: "<feature-slug>"
entry: "place:<entry>"
target: "place:<first-strike-place>"
target-time: "<e.g. 'under 7 minutes'>"
ude-applicable: true   # is the 7-minute test applicable to this flow?
---

## Steps to first strike
1. **Land** at `place:landing` — see hero and primary CTA.
2. **Click** "Sign up" → `place:signup` (`aff:cta-signup`).
3. **Enter** email + password.
4. **Submit** → `place:welcome` (`aff:submit-signup`).
5. ...

## Steps in current flow that don't lead to first strike
List anything in `flow-graph.json` that isn't on the straight line.
For each, decide: **delete | defer | keep with rationale**.

## UDE test
- **Unique:** how does our core value shine in this flow?
- **Desirable:** does the ideal user from `product.md` actually want this?
- **Effective:** can a new user complete this in `target-time`?

## Drop-off candidates
Steps where users are most likely to drop off. Each gets a hypothesis
and a candidate intervention. `plg-flow` produces these; `plg-critique`
checks each has a corresponding bumper.
```

Authored by: `plg-flow`. Read by: `plg-critique`, downstream coding agent (this is often the most useful single document for an implementer).

---

## 8. Screen-scope artifacts

The fidelity ladder lives here. Three artifacts per screen.

### 8.1 `wireframe.json`

Purpose: the screen's regions and what's in each region, structurally. **No layout, no positioning.** Equivalent to a "fat marker" sketch with regions but not yet a grid.

Format: JSON. Tree of regions; each region is a labelled bag of content placeholders.

```json
{
  "version": "1",
  "screen": "screen:onboarding/welcome",
  "purpose": "Greet user post-signup; orient to first action",
  "kind": "page | modal | panel | sheet | full-screen",
  "auth": "required",
  "page": "page:onboarding",
  "objects-shown": ["object:user"],
  "objects-acted-on": [],
  "regions": [
    {
      "id": "region:header",
      "label": "Header",
      "role": "navigation",
      "contains": [
        { "kind": "logo" },
        { "kind": "user-menu", "object": "object:user" }
      ]
    },
    {
      "id": "region:main",
      "label": "Main",
      "role": "primary-content",
      "contains": [
        { "kind": "heading",      "level": 1, "text-intent": "welcome message", "personalised": true },
        { "kind": "body-text",    "text-intent": "explain the first action", "length": "short" },
        { "kind": "primary-cta",  "action": "action:start-first-spec", "leads-to": "screen:onboarding/first-spec" }
      ]
    },
    {
      "id": "region:footer",
      "label": "Footer",
      "role": "secondary",
      "contains": [
        { "kind": "skip-link", "leads-to": "screen:dashboard/main" }
      ]
    }
  ]
}
```

Field semantics:

- `kind`: declares the surface type. Drives layout assumptions in low-fi.
- `regions.role`: `navigation | primary-content | secondary | utility | system`. Drives information-hierarchy defaults.
- `contains.kind`: a small enumerated vocabulary of content placeholders. Reserved values include: `logo`, `heading`, `body-text`, `primary-cta`, `secondary-cta`, `link`, `form`, `field`, `list`, `card`, `image`, `media`, `data-viz`, `empty-state`, `loader`, `error`, `user-menu`, `skip-link`, `disclosure`, `progress`, `tab-set`, `breadcrumb`. Extensible. Each kind has implied properties (a `field` has a label, a `data-viz` has a metric).
- `text-intent`: free-form description of what the text is *for*; never the actual copy. Real copy lives in low-fi or high-fi.
- `personalised`: whether the text adapts to the user.

Authored by: `plg-flow`. Read by: surface (renders as a labelled region tree), low-fi artifact (references this), `plg-critique`.

### 8.2 `low-fi.json`

Purpose: layout + information hierarchy + placeholder content. **This is the rung that does the most thinking.** Wireframes are cheap, high-fi is composition; low-fi is where structure meets meaning.

Format: JSON. References the wireframe; adds layout, information hierarchy declaration, and placeholder content.

```json
{
  "version": "1",
  "screen": "screen:onboarding/welcome",
  "wireframe-ref": "wireframe.json",
  "viewport": {
    "primary": "desktop",
    "supported": ["desktop", "tablet", "mobile"],
    "breakpoints": [{ "name": "desktop", "min-width": 1024 }, { "name": "tablet", "min-width": 640 }, { "name": "mobile", "min-width": 0 }]
  },
  "layout": {
    "kind": "grid | stack | split | centred-column",
    "columns": 12,
    "regions": [
      { "region-id": "region:header", "row": 1,    "col": "1-12", "height": "64px",  "sticky": true },
      { "region-id": "region:main",   "row": 2,    "col": "3-10", "height": "auto",  "vertical-align": "centre" },
      { "region-id": "region:footer", "row": 3,    "col": "1-12", "height": "auto",  "sticky": "bottom" }
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
  "density": "generous | balanced | dense",
  "content-placeholders": {
    "region:main > heading":      "Welcome to <product>",
    "region:main > body-text":    "Specs are how we capture what to build before we build it. Let's create your first one. (~25 words placeholder)",
    "region:main > primary-cta":  "Start your first spec",
    "region:footer > skip-link":  "Skip for now"
  },
  "states": [
    { "name": "default" },
    { "name": "loading-user", "regions-affected": ["region:header"] }
  ],
  "behaviour-notes": [
    "Primary CTA should be focused on screen mount.",
    "Skip link should not appear in the first viewport on mobile."
  ]
}
```

Field semantics:

- `viewport.primary`: which device shape this screen is designed for first. Sets defaults for the layout grid.
- `layout.kind`: a small enumerated set. Most screens are `grid`, `stack`, `split`, or `centred-column`. Anything else is custom and should be flagged.
- `layout.regions`: the spatial placement of regions defined in the wireframe. Uses a 12-column grid by default; `col: "3-10"` means columns 3 through 10 inclusive.
- `information-hierarchy`: the load-bearing field of this artifact.
  - `primary | secondary | tertiary`: arrays of region/content references in order of visual emphasis.
  - `above-fold`: what must be visible without scrolling at the primary viewport.
  - `reading-order`: the intended eye path through the screen.
  - `progressive-disclosure`: items hidden until a user action reveals them; each entry references the trigger.
  - `rationale`: free-form prose; required, not optional. Without it the agent can't be checked.
- `density`: governs spacing token selection in high-fi. Per-screen override of the product-level default in `aesthetic.md`.
- `content-placeholders`: real *placeholder* copy. Not final copy. Final copy lives in high-fi.
- `states`: each state is a variant of this screen. High-fi may have separate render targets per state.
- `behaviour-notes`: free-form notes the agent surfaces but doesn't formally model. Captured here so they don't get lost.

Authored by: `plg-flow`. Read by: surface (renders as a layout sketch), high-fi artifact, `plg-critique`.

### 8.3 `high-fi.json` and `high-fi.html` (or `.svg`)

Purpose: the composed representation. Real tokens, real components, real content. In **v1 of the build**, high-fi is *outsourced* — the user pastes output from Claude Design / v0 / a designer into `high-fi.html` and the metadata into `high-fi.json`. In a later phase, `plg-build` will produce both.

Format: `high-fi.json` is structured metadata; `high-fi.html` (or `.svg`) is the actual rendered representation.

`high-fi.json`:

```json
{
  "version": "1",
  "screen": "screen:onboarding/welcome",
  "low-fi-ref": "low-fi.json",
  "render-target": "high-fi.html",
  "render-source": "claude-design | v0 | hand-authored | plg-build",
  "render-source-notes": "Pasted from Claude Design 2026-04-23; iterated x3.",
  "components-used": [
    { "region-id": "region:header", "component": "AppHeader",                "props": { "variant": "post-auth" } },
    { "region-id": "region:main",   "component": "OnboardingWelcomePanel",    "props": { "step": 1, "totalSteps": 3 } }
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
  ]
}
```

`high-fi.html` (or `.svg`): the actual rendered representation. Inline CSS or a `<style>` block. No external scripts. Must be standalone-renderable in an iframe by the surface.

Field semantics:

- `render-source`: provenance. `plg-critique` and the surface display this so the user knows whether output is generated, hand-authored, or pasted in.
- `components-used`: references components from the host project's library (`_shared/components.md`). Lets `plg-critique` check no invented components leaked in.
- `tokens-used`: references tokens from `_shared/tokens.json`. Same role.
- `content`: the *real* copy. This is where final voice work happens.
- `states-rendered`: each state declared in low-fi must have either a render target or an explicit "skipped" entry with reason. Forces the agent not to silently drop states.
- `deviations-from-low-fi`: required field if any aspect of the high-fi diverges from the low-fi. Forces honesty about why composition needed structural change.

Authored by: `plg-build` (later phase) or human paste-and-annotate (Phase 1). Read by: surface (renders the html/svg in an iframe), `plg-critique`, downstream coding agent.

---

## 9. Cross-cutting and meta artifacts

### 9.1 `critique.md`

Purpose: structured critique output at any scope. One file per critique pass; named by date and scope.

Format: markdown with YAML frontmatter.

```yaml
---
version: "1"
date: "2026-04-25"
scope: "product | feature | screen"
target: "<path or ID of what was critiqued>"
critic: "plg-critique"
levels:
  ia:       "pass | warn | fail"
  ih:       "pass | warn | fail"
  surface:  "pass | warn | fail"
  funnel:   "pass | warn | fail"
findings-count:
  blocker: 0
  major:   2
  minor:   5
---

## Information architecture (product/flow scope)
- [major] page:settings.profile is depth 4 — nav model is hierarchical
  but this exceeds the 3-deep guidance. Recommend flattening or
  promoting to a tab on page:settings.

## Information hierarchy (screen scope)
- [minor] screen:onboarding/welcome — secondary content
  (region:main > body-text) is visually larger than primary CTA at mobile
  breakpoint. Reading order suggests CTA dominance but layout doesn't
  support it.

## Surface (Nielsen / Norman pass)
- [major] action:project.delete has no confirmation surface in current
  high-fi. object-map.json marks it destructive.

## Funnel (PLG)
- [warn] flow:onboarding has 9 steps to First Strike, current
  Straight-Line target was 7 minutes. Step 4 (organisation profile)
  may be a deferral candidate.
```

Authored by: `plg-critique`. Read by: humans, surface (badge counts in the left rail).

### 9.2 `_meta/artifact-schema.md`

This document. Lives at `specs/design/_meta/artifact-schema.md` so each project can pin a schema version.

---

## 10. Layer B handoff points

Three artifacts in `_shared/` are owned by Layer B (the product-context template) and are out of scope for this schema doc, but their *names and locations* are fixed here so other artifacts can reference them:

- `_shared/aesthetic.md` — composition principles, color philosophy, typography feel, signature details, anti-patterns. Per Muryn-Mukha.
- `_shared/anti-patterns.md` — the explicit "we are NOT" list, both cross-product and product-specific.
- `_shared/tokens.json` — design tokens. Auto-generated from Figma where possible (per the design-tokens plugin discussion).
- `_shared/components.md` — the component library inventory with prop/variant documentation.

The full schemas for these come later, when we author Layer B.

---

## 11. Open questions and intentional gaps

The following are flagged as decide-by-default for now. Each is a candidate to revisit before Phase 1 ships, or in Phase 2.

1. **Variants beyond states.** Light/dark, role-based view differences, A/B tests. Currently not modelled. Probably a future `variants` field on screen artifacts.
2. **Responsive breakpoint deltas.** Low-fi declares `viewport.supported` but doesn't currently express *how* layout differs per breakpoint. Today the surface assumes the primary viewport's layout is the canonical one and breakpoint adaptations are described in `behaviour-notes`. This is a known weakness.
3. **Content as a separate artifact.** Voice, tone, CTA vocabulary, empty-state and notification triplets currently live in Layer B's `content.md`. Per-screen content lives inline in low-fi/high-fi. Some teams may want a separate `content/` directory of reusable copy snippets. Out of scope for v1.
4. **Component variants.** The high-fi artifact references components by name with props but doesn't constrain *which* prop combinations are valid. That belongs in `_shared/components.md`. The schema assumes that file is the source of truth.
5. **Animation and motion.** No artifact currently captures motion intent. Probably a `motion.md` in `_shared/` and inline `motion-notes` on screens. Out of scope for v1.
6. **Accessibility annotations.** Screen artifacts don't currently carry explicit ARIA, semantic role, or contrast metadata. Some of this can be inferred from `regions[].role` and `contains[].kind`, but a deliberate accessibility pass should produce a separate artifact or add fields. Out of scope for v1; flagged for Phase 2 critique-time check.
7. **Screen sharing across flows.** When two flows touch the same screen, who "owns" the screen folder? Currently the *first* feature to introduce a screen is the canonical home. This is fragile if features are reorganised. May need a `_shared/screens/` for cross-feature screens.
8. **Internationalisation.** Content is single-language by default. No i18n schema. Out of scope for v1.

---

## 12. What this commits the skills to

A consequence-check, so we know what we're locking in:

- `plg-shape` produces: `product.md`, `journey.md`, `sitemap.json` (initial), `nav-model.md`, `object-map.json`, and one `shape.md` per feature it scopes.
- `plg-flow` produces: per feature, `flow-graph.json`, `straight-line.md`, and per screen, `wireframe.json` and `low-fi.json`. May update `sitemap.json` to add new pages.
- `plg-critique` produces: `critique.md` at any scope. Reads everything; writes only critiques.
- `plg-build` (Phase 2): produces `high-fi.json` and `high-fi.html`/`.svg`. In Phase 1 these are human-authored from external tools.

The surface (Phase 1, Stage 6) reads all of the above and renders them at three navigation levels: product (sitemap, nav-model, object-map, journey), flow (flow-graph, straight-line, list of screens), screen (the three fidelity rungs side by side).

---

*End of v0.1 draft. Comments and red lines welcome.*
