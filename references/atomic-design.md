---
file: references/atomic-design.md
purpose: The composition vocabulary — atoms, molecules, organisms, templates, pages — and how it maps to the host project's component library.
load-when: plg-flow (when authoring wireframe.json's regions), plg-build (always — composition is the build layer's primary vocabulary), plg-critique (at screen scope, when checking component reuse vs invention).
last-updated: 2026-04-28
---

# Atomic Design

This file is the **composition vocabulary**. When the agent talks about "this is a button" vs "this is a card with a button in it" vs "this is a settings panel containing several cards," Atomic Design is the framework that names those layers.

It's the most well-known framework in the Layer A stack, so this reference is shorter than most. The agent already knows what atoms and molecules are. What it needs explicitly is (1) the boundaries between layers, (2) where the framework is silent, and (3) how the layers map to the host project's component library — because that's the part that matters when generating composed UI.

Use this reference when:

- Authoring `wireframe.json` — `contains[].kind` values map to atomic levels
- Authoring `low-fi.json` — region composition is decided in atomic terms
- Authoring `high-fi.json` — `components-used` references components from `_shared/components.md`, which is itself organised atomically
- Running `plg-critique` — composition consistency is one of the screen-scope checks

Source: Brad Frost, *Atomic Design*. Compressed; the parts the agent actually uses.

---

## The five layers

| Layer | Definition | Example | Lives in schema as |
|---|---|---|---|
| **Atom** | Smallest unit of UI; a single element | Button, label, input field, icon, badge | `contains[].kind` of a basic primitive |
| **Molecule** | Group of atoms working together | Form field (label + input + error), search bar (input + button), nav item (icon + label) | `contains[].kind` of a composite primitive |
| **Organism** | Group of molecules forming a section | Header, sidebar, card, project list, comment thread | `regions[]` typically; sometimes a single rich `contains[]` entry |
| **Template** | Layout structure with regions, no real content | "Two-column layout with sidebar," "centred content layout" | `low-fi.json`'s `layout.kind` + `layout.regions` |
| **Page** | A template populated with real content | The actual onboarding welcome screen with copy and components | `high-fi.json` |

The five layers are *progressively composable*. An atom is part of a molecule. A molecule is part of an organism. An organism sits in a template. A page is a template populated.

---

## The boundaries — where designers (and agents) get this wrong

The framework's value isn't in the names; it's in the discipline of *not blurring the boundaries*. Three common errors:

**1. Treating molecules as one-off compositions instead of named, reusable patterns.** A "form field" (label + input + error) is a molecule because it appears across many forms with consistent shape. If a designer recreates the label-input-error pattern with slight variations on every form, they've blurred molecule into atom-soup. The discipline: when the agent finds the same pattern of atoms appearing twice, that pattern *is* a molecule and it gets a name in `_shared/components.md`.

**2. Treating organisms as templates.** A header is an organism — it's a reusable section. The page that contains the header is the template/page. Designers often conflate "the header on the homepage" with "the homepage." The discipline: organisms are *content-bearing sections*; templates are *layout containers* that arrange organisms.

**3. Treating pages as templates.** Each unique page is *not* a new template. Templates are reusable layout structures; many pages share a template. If every page has its own template, the system has no templates — just pages. The discipline: identify the 3–5 templates that cover most pages of the product, and exception-handle the rest.

---

## The host-project mapping

Atomic Design is most useful when the framework's layers map cleanly onto the host project's component library. For our system, the relevant artefact is `_shared/components.md` — it documents the component library at all five layers.

The agent's discipline:

- `_shared/components.md` is organised by atomic level (atoms first, then molecules, organisms, templates, pages).
- Each component entry includes its name, its layer, its props/variants, and one or two example uses.
- Every `high-fi.json` references components from this file, by name. Components that aren't in `components.md` aren't allowed in `high-fi.json` unless `_shared/components.md` is updated as part of the same change.
- This rule prevents the agent from inventing one-off components in high-fi that nobody knows about and nobody can implement.

When the host project uses a known library (shadcn/ui, Material, Chakra, Radix, etc.), `_shared/components.md` references the library's component names directly. The agent doesn't reinvent component names that already exist.

---

## Where Atomic Design is silent

Brad Frost's framework deliberately doesn't model:

1. **What connects pages.** Atomic Design is a *composition* hierarchy, not a *navigation* hierarchy. Pages don't link to other pages in Atomic Design's vocabulary. That's `sitemap.json` and `flow-graph.json` territory (per `shape-up.md` and the schema).
2. **State.** A button is an atom; a button in its hover state is the same atom. State variants live in `low-fi.json`'s `states` array (per Erik Kennedy's screen states taxonomy in `erik-kennedy.md`), not in the atomic hierarchy.
3. **Behaviour.** Atomic Design says nothing about *what a button does when clicked*. That's `flow-graph.json` (the connections between affordances and places).
4. **Domain.** Atomic Design doesn't know about Projects, Tasks, or Users. It knows about cards, lists, and detail panels. Domain-to-composition mapping is the agent's job: a Project becomes a Card (organism) in list view, a DetailPanel (organism) in detail view. The domain model (per `domain.md`) feeds Atomic Design, not the reverse.

The agent doesn't try to make Atomic Design answer these questions. It uses the framework for what it's good at — naming composition layers — and relies on the domain model (`domain.md`), the schema, and Erik's taxonomies for the rest.

---

## How atoms and molecules show up in the schema

In `wireframe.json`, the `contains[].kind` field uses a small enumerated vocabulary that maps to atomic levels:

| `kind` value | Atomic level | Notes |
|---|---|---|
| `logo`, `heading`, `body-text`, `link`, `field`, `image`, `loader`, `error`, `badge` | Atom | Single-element primitives |
| `primary-cta`, `secondary-cta` | Atom (a styled button) | The variant is the atom's prop, not a different atom |
| `form`, `tab-set`, `breadcrumb`, `progress`, `disclosure`, `user-menu`, `skip-link` | Molecule | Multi-atom composites with a recognised name |
| `card`, `list`, `media`, `data-viz`, `empty-state`, `media` | Organism (sometimes molecule) | Depends on richness; a simple list is a molecule, a list with filtering and pagination is an organism |

The agent uses these `kind` values in wireframes and trusts that they'll map onto specific components from `_shared/components.md` at high-fi time. It doesn't pre-commit to which Card variant or which List component at the wireframe rung — that's a composition decision that belongs at high-fi.

---

## Composition consistency — the agent's critique check

Per `plg-critique`'s screen-scope pass, the agent runs three composition consistency checks against any `high-fi.json`:

1. **No invented components.** Every component referenced in `components-used` exists in `_shared/components.md`. New components require updating `components.md` in the same PR/commit.
2. **No spelling drift.** Components are referenced by exact name from `components.md`. "Button" and "BTN" and "PrimaryButton" aren't the same thing. If three exist, only one is canonical.
3. **No layer skipping.** A high-fi shouldn't reach for an atom directly when a molecule exists. Example: if `FormField` (label + input + error) exists as a molecule, the high-fi uses `FormField` rather than three separate atoms. Skipping molecules to use raw atoms produces inconsistency at scale.

These are `warn` findings by default, not `blocker` — sometimes a one-off variation is right. But they should be flagged so the team can choose deliberately.

---

## What this means for the artifact schema

Direct mappings:

- `_shared/components.md` (Layer B) is organised atomically and is the source of truth for what components exist.
- `wireframe.json`'s `contains[].kind` enumeration includes atom-, molecule-, and organism-level values; the agent picks the level the wireframe deserves.
- `low-fi.json`'s `layout.kind` declares the template (`grid | stack | split | centred-column`).
- `high-fi.json`'s `components-used` references components from `components.md` by exact name.
- `plg-critique` runs the three composition consistency checks above.

---

## Open question we'll deal with at Layer B

`_shared/components.md` is itself a Layer B artefact whose schema is open. When we author Layer B, we'll decide:

- Whether components are documented in Markdown (human-readable) or JSON (machine-parseable) or both
- Whether prop variants are enumerated (e.g. Button: `primary | secondary | tertiary | destructive`)
- Whether component usage examples are inline or in a separate `examples/` directory
- How components from external libraries (shadcn/ui, etc.) are referenced — by import path, by docs URL, by both

These are downstream decisions; for now, the agent assumes `components.md` exists and uses component names from it as opaque identifiers.

---

## When Atomic Design doesn't apply

Two cases:

- **Single-component artefacts** (a standalone illustration, an animated hero, a bespoke landing page). Atomic Design's overhead isn't worth it for a one-off. The agent skips component references in high-fi and uses inline structure.
- **Pre-component-library work.** When the host project doesn't yet have a component library, `components.md` is empty. The agent generates high-fi anyway, but flags every component used as "candidate for components.md" — those become the seed for the actual library.
