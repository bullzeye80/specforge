# Domain modeling

Before any screen is drawn, specforge fixes *what the product is made of*. The
active `DESIGN.md` decides *how* the nouns of a product look and sound; this
file decides *what* those nouns are, which of them the system must keep
consistent, and what happens when one changes. It does two jobs in one pass:
**OOUX is the user's view of the domain** — the nouns a user thinks about, what
they can do with them, how they connect — and **DDD is the system's view of the
same nouns** — which are entities, which are values, where the consistency
boundaries sit, what events fire. Skip OOUX and the UI misses the user's mental
model; skip DDD and it breaks at the first non-trivial scale. `plg-shape` loads
this whole file when it authors `domain-map.json`; `plg-flow` and `plg-critique`
load it to verify every flow and screen operates on objects that actually exist.

> Adapted from `references/domain.md` (Sophia Prater, *A Team's Guide to
> OOUX*; Eric Evans / Vaughn Vernon, *Domain-Driven Design*; Herberto Graça,
> *Explicit Architecture*). Adapted, not parroted.

## Two views, one model

The two views are not two models — they are one model seen twice. The agent
runs both passes in a single workflow and speaks both vocabularies: the design
artifact talks to designers in OOUX terms, the schema captures the DDD layer
for downstream consumption.

| Designer says (OOUX) | System calls it (DDD) | `domain-map.json` field |
|---|---|---|
| "A Project has Tasks inside it" | Aggregate-internal, or Task is its own aggregate root | `relationships[].aggregate-internal` |
| "Archiving hides it from the active list" | `ProjectArchived` fires; a query filters by status | `events[]`, `actions[].kind: query` |
| "Money is a number plus a currency" | `Money` value object | `objects[].kind: value-object` |
| "Click here to delete the project" | `project.delete` command fires `ProjectDeleted` | `actions[].kind: command`, `fires-events` |

The discipline: when a user-facing concept maps to a DDD construct, record
both. Silent invention on either side is the failure mode.

## The user's view (OOUX)

The OOUX pass answers: *what does the user think about, and what can they do?*
Four ingredients, each a `domain-map.json` field.

| Ingredient | Question | Schema home |
|---|---|---|
| **Objects** | What nouns does the user think about? | `objects[]` (per context) |
| **Attributes** | What does each object have? | `objects[].attributes[]` |
| **Actions** | What can be done to it? | `objects[].actions[]` |
| **Relationships** | How do objects connect? | `objects[].relationships[]` |

### Is it an object?

Two tests for **yes**: the user thinks about it as a *thing*; it has its own
identity, persistence, and actions. Three tests for **no**: it's a UI affordance
(button, modal, tab); it's an attribute of another object ("status"); it's a
verb ("searching"). Edge cases — search results are a transient view, not an
object; notifications are almost always an object (but their *surfacing* is
constrained, per `plg-personal-anti-patterns`); settings default to attributes
of the user unless they have their own lifecycle.

- **When in doubt, don't add the object.** Promoting an attribute to an object
  later is cheap; demoting is expensive.
- Every object carries a one-sentence `purpose`. Missing `purpose` is a
  `blocker` in `plg-critique`.

### Attributes — three categories

Recorded in `attributes[]`; each entry has `name`, `type`, `required`, and
`shown-on-list`. Reference-type attributes add a `to` field naming the object
they point at.

| Category | Role | `shown-on-list` default |
|---|---|---|
| **Identity** | Distinguishes the object — title, name, slug | usually `true` |
| **State** | Current condition — status, %-complete, last-modified | often `true` |
| **Reference** | Points at another object — owner, parent | `type: ref`, needs `to` |

### Actions — three categories, plus command/query

Recorded in `actions[]`. Three shapes: **CRUD** (create/read/update/delete),
**state-transition** (archive/publish/restore/complete → a change in a state
attribute), **lifecycle** (share/duplicate/export/import). For each action the
agent records `actor`, `result`, `destructive`, its **`kind: command | query`**
(see the system's view), and — for commands — the Erik Actions Checklist.

### Relationships — four kinds

Recorded in `relationships[]`; each has `to`, `kind`, `label`, and
`aggregate-internal`.

| `kind` | Meaning | Example |
|---|---|---|
| `has-many` | One contains many of another | Project has-many Tasks |
| `belongs-to` | One owned by exactly one | Task belongs-to Project |
| `many-to-many` | Many relate, no ownership | Tag ↔ Task |
| `has-one` | Strict 1:1 ownership | User has-one Settings |

- **Both sides appear.** Reciprocity is intentional redundancy — it makes the
  model navigable from either object. `plg-critique` flags a relationship whose
  reverse side is missing.
- **A many-to-many with its own attributes promotes to a junction object** — a
  ProjectMembership entity carrying `role`, `joined-at`, `permissions`. The
  schema does **not** enforce this; `plg-critique` checks for it and surfaces a
  finding *(guidance, not auto-checked — schema is silent here by design)*.

### The nested-object matrix *(guidance, not auto-checked)*

Before drawing screens, run the user's-view check: for each object, list what
nests *inside* its surface (attributes shown, child objects surfaced, actions
offered) versus what is only *referenced* by a link. This is the OOUX Nested
Object Matrix, and it prefigures the aggregate boundaries below — things that
nest inside an object's surface are usually aggregate-internal; things reached
by a link usually live in another aggregate. There is no matrix field in the
schema; it is a reasoning tool whose output lands in `relationships[]` (via
`aggregate-internal`) and downstream in each screen's `objects-shown` /
`objects-acted-on`.

## The system's view (DDD)

The DDD pass answers: *where do the consistency boundaries sit, and what fires
when state changes?* This is what a flat OOUX model omits — it works at small
scale and breaks at the first real product.

### Bounded contexts

A bounded context is a region within which one model is valid. **The same noun
means different things in different contexts** — a Collaboration "User", a
Billing "User", and an Identity "User" are three different objects. `domain-map.json`
is structured top-level by **`bounded-contexts[]`**; each context has its own
`objects[]` and `events[]`.

- **Cross-context references are by ID only** — a Project's `owner` attribute is
  a `ref` with `to: object:identity.user`, not an inline copy of the User's
  fields. Such references are **read-only by default**: the Collaboration UI does
  not edit a Billing-context email.
- **Don't manufacture contexts.** A genuinely simple product has one context,
  usually `context:core`. The discipline is to *consider* whether multiple exist,
  not to invent them.

### Entities vs value objects

Every object declares **`kind: entity | value-object`** (required).

| | Entity | Value object |
|---|---|---|
| Defined by | Its identity (ID) | Its values |
| Mutable? | Edited in place | Replaced whole, never partially edited |
| Own ID? | Yes | No |
| UI pattern | List / detail / edit-in-place / navigate-by-ID | Form capturing all values together, replace-on-save, no detail page, often inline in an entity |

- Recognise value-object candidates: money/currency, addresses, date & time
  ranges, coordinates, colors, sometimes phone/email (only when they lack
  lifecycle). The test: *own identity that persists, or defined by its values?*
- A `DueDate` value object on a Task renders as a picker, not a page. Getting
  `kind` wrong pushes the UI toward the wrong pattern family — a missing `kind`
  is a `blocker`.

### Aggregates and aggregate roots

An aggregate is a cluster of objects changed as one unit; the **aggregate root**
is the only member outside code may reference — everything else is reached
through it. Every object declares **`aggregate: <root-object-id>`** (required):
the root references itself; other members reference the root. Every relationship
declares **`aggregate-internal: true | false`**.

- **Edit, confirmation, and save boundaries follow aggregate boundaries.** A
  save persists one aggregate; deleting a Project cascades to its internal
  ProjectMemberships and the confirmation says so; a Task referenced from many
  Projects needs different language.
- **Internal members nest; external members link.** Comments inside a Task
  aggregate are nested-edited within the Task's surface (`aggregate-internal:
  true`); a Task referenced from a Project is a link, not an inline form
  (`aggregate-internal: false`). Per `plg-personal-anti-patterns`' decision-relief
  frame, aggregate internals do **not** get their own top-level navigation.

### Commands vs queries

Every action declares **`kind: command | query`** (required). A command changes
state; a query returns state without changing it.

| | Command | Query |
|---|---|---|
| Changes state? | Yes | No |
| UI | Button, form, confirmation, undo | List, detail, search, filter, sort |
| Failure question | "Did the change happen?" → needs feedback | "Is this the right data?" → needs sort/filter clarity |

Every **command** additionally carries the **Erik Actions Checklist** — five
required fields the agent decides deliberately, not by default:

| Field | Decides |
|---|---|
| `confirmation-required` | Is a confirm step warranted (usually for destructive)? |
| `cancellable` | Can the user back out mid-action? |
| `undoable` | Can it be reversed after the fact? |
| `feedback-on-success` | e.g. `toast`, inline, state-change |
| `feedback-on-failure` | e.g. `inline-error`, banner |

- **Mixing command and query is a smell.** Search results that auto-execute on
  click blur a query into a command; a list whose data changes with a hidden
  filter blurs command-shaped invisible state into a query. `plg-flow` inherits
  each affordance's `action-kind` from the triggered action, and a
  `primary-action` affordance triggering a query is a finding.

### Domain events

A domain event is *something that happened the rest of the system cares about* —
past tense, immutable, named in domain language (`ProjectArchived`, not
`UserClickedArchiveButton`). Each context has an **`events[]`** array; each event
has `name`, **`fired-by`** (the actions that fire it), and **`consumed-by`**
(optional — screens or contexts that react). Each state-changing command lists
its events in **`fires-events`**.

- Events are what audit trails / activity histories reconstruct (accepted, where
  notification *centres* are rejected — see `plg-personal-anti-patterns`), what
  behaviour-triggered email/push fire on (per `plg-bj-fogg`), and what real-time
  UI subscribes to. The First Strike / KUI / PAI a `journey.md` is measurable-as
  should exist here as a named event (per `plg-foundations`).
- **Prompts fire on events, not clocks.** A drop-off prompt references an event
  ("signed up but did not fire `FirstSpecPublished` within 24 h"), not a timer.
- Don't enumerate every consumer at design time; the point is to make events
  first-class so downstream artifacts can reference them. A command with an empty
  `fires-events` is a `warn`, not a `blocker` — some genuinely fire nothing worth
  naming.

## The one-pass workflow

Compressed, a 60–90 minute exercise inside `plg-shape`; larger products iterate.

| # | Step | View | Lands in |
|---|---|---|---|
| 1 | Brainstorm the nouns | OOUX | `objects[]` |
| 2 | Group nouns by context (same noun twice = two objects) | DDD | `bounded-contexts[]` |
| 3 | Decide entity vs value object | DDD | `objects[].kind` |
| 4 | Group into aggregates with named roots | DDD | `objects[].aggregate` |
| 5 | List attributes | OOUX | `attributes[]` |
| 6 | List actions; classify command/query (+ checklist on commands) | both | `actions[]` |
| 7 | List relationships; mark aggregate-internal | both | `relationships[]` |
| 8 | Name the events each command fires | DDD | `events[]`, `fires-events` |
| 9 | Walk the roadmap — every user action references a real action | both | validation |

`domain-map.json` is **authored by `plg-shape`**, **read by `plg-flow`** (every
flow's affordance references a real `action:` ID and inherits its `kind`), and
**checked by `plg-critique`** at product scope. When a downstream artifact
references an object, action, or event that isn't in the map, exactly one of two
fixes is valid: correct the artifact, or add the missing element to the map.
Silent invention is not.

## What this file does not cover

By design, out of scope: implementation patterns (repositories, factories,
sagas), database schema (an aggregate may map to one table or many), and API
contracts (REST/GraphQL/RPC is the host's choice). The agent generates UI
artifacts that *respect* domain boundaries; it does not implement them.

## When this doesn't apply

- **Single-object products** (a calculator, a converter, a one-field form) — a
  minimal `domain-map.json`: one context (`context:core`), one entity, no events
  worth naming. Note the scope-down in `product.md`.
- **Pre-product surfaces** (marketing, comparison, docs pages) — they don't
  operate on user-owned domain objects; skip `domain-map.json` and say so in
  `shape.md`.

When the model is skipped, the agent says so explicitly. It does **not** emit a
stub `domain-map.json` to satisfy the schema.

## Common mistakes (lint these)

- An object with no one-sentence `purpose`, or missing `kind: entity |
  value-object`, or missing `aggregate` — each is a `blocker`; the model is
  broken.
- Treating a UI affordance, an attribute, or a verb as an object (a "filter"
  object, a "status" object, a "searching" object).
- A value object modelled as an entity (money, address, date-range given an ID
  and a detail page) or an entity flattened into a value object.
- A many-to-many carrying attributes (role, joined-at) left un-promoted instead
  of a junction object — caught by `plg-critique`, not the schema.
- A relationship present on only one side; `aggregate-internal` set
  inconsistently across the two sides.
- An action with no `kind`, or a command missing any of the five Erik Actions
  Checklist fields (`confirmation-required`, `cancellable`, `undoable`,
  `feedback-on-success`, `feedback-on-failure`).
- A `primary-action` affordance that triggers a query, or a query surfaced with
  command UI (auto-executing search results, hidden-filter lists).
- A domain event named for a UI gesture (`UserClickedArchive`) instead of a
  domain fact (`ProjectArchived`); a state-changing command with no
  `fires-events` where an event clearly belongs.
- The same noun assumed to be one object across Billing / Identity /
  Collaboration; a cross-context reference inlining another context's attributes
  instead of holding an ID.
- Manufactured bounded contexts on a genuinely single-context product — or its
  inverse, everything crammed into one context when the nouns clearly split.
- A stub `domain-map.json` emitted for a marketing or single-object surface
  instead of the narrative saying the model doesn't apply.
