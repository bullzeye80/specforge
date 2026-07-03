---
file: references/domain.md
purpose: Domain modeling — OOUX as the user's view, DDD as the system's view. Both, in one pass.
load-when: plg-shape (always, when authoring domain-map.json), plg-flow (always, when verifying flows operate on real domain elements), plg-critique (always at product-scope critique).
last-updated: 2026-04-28
supersedes: references/ooux.md
---

# Domain modeling

This is the **domain layer** of the framework. It does two jobs at once:

- **OOUX is the user's view of the domain** — what nouns the user thinks about, what they can do with them, how they relate. Designers think in this vocabulary.
- **DDD is the system's view of the same domain** — what enforces consistency, where the boundaries are, what's an entity vs a value, what events fire. Architects think in this vocabulary.

The agent does both in one pass. Skipping either produces predictable failures: skip OOUX and the UI doesn't match the user's mental model; skip DDD and the UI breaks at the first non-trivial scale or the first cross-context inconsistency.

The framing: identify the nouns the user thinks about, then identify which are entities, which are value objects, which contexts they live in, what aggregates they belong to, and what events they fire — all before drawing screens.

Use this reference when:

- Authoring `domain-map.json` (entire content of this file applies)
- Verifying `flow-graph.json` — every action in a flow must operate on a domain element that exists, and must be classifiable as a command or query
- Verifying `wireframe.json` — every region's `objects-shown` and `objects-acted-on` must reference objects that exist
- Running `plg-critique` at product-scope (does the domain model cover the full product? are aggregates intact? are events named?)

Sources: Sophia Prater, *A Team's Guide to OOUX* (the user's view); Eric Evans, *Domain-Driven Design* and Vaughn Vernon, *Implementing Domain-Driven Design* (the system's view); Herberto Graça, *Explicit Architecture* (the use-case framing). Compressed and adapted for agent use.

---

## The user's view (OOUX)

The OOUX layer answers: *what does the user think about, and what can they do?*

### The four ingredients

Every domain model has four kinds of user-visible entries:

| Ingredient | Question | Example (a project-management product) |
|---|---|---|
| **Objects** | What are the nouns of the system? | Project, Task, User, Comment, Tag, Workspace |
| **Attributes** | What does each object have? | Project: title, status, owner, created-at, due-date |
| **Actions** | What can be done with each object? | Project: create, archive, delete, share, duplicate |
| **Relationships** | How do objects connect? | Project has-many Tasks; Task belongs-to Project; Project belongs-to Workspace |

Every screen, every flow, every UI surface is downstream of these four lists.

### How to identify objects

Two tests for whether something is an object:

1. **Does the user think about it as a thing?** A user thinks about "my project" as a thing. They don't think about "the project's metadata" as a thing — that's the project's attributes.
2. **Does it have its own identity, persistence, and actions?** A project has an ID, persists across sessions, and has things you can do *to it*. A "filter" usually doesn't (it's a UI affordance).

Three tests for whether something is *not* an object:

1. **Is it a UI affordance?** Buttons, modals, tabs, tooltips — these are surface elements, not objects.
2. **Is it an attribute of another object?** "Status" isn't an object; it's an attribute of (probably) several objects.
3. **Is it a verb?** "Searching" isn't an object; the thing being searched for is.

Edge cases:

- **Search results** — not an object; a transient view.
- **Reports / dashboards** — sometimes objects (saved report has identity), sometimes views (default dashboard is just a view).
- **Notifications** — almost always an object. But per `personal-anti-patterns.md`, notification *centres* are rejected; the object exists, its surfacing is constrained.
- **Settings** — sometimes an object, sometimes attributes of the user. Default to attributes unless settings have their own lifecycle.

When in doubt, don't add an object. Easier to promote an attribute to an object later than to demote.

### Attributes — three categories

1. **Identity attributes** — make the object distinguishable. Title, name, ID, slug. Almost always shown in list views.
2. **State attributes** — describe the current condition. Status, completion percentage, last-modified-at.
3. **Reference attributes** — point to other objects. Owner (→ User), parent (→ Project).

Schema field: `domain-map.json`'s `attributes` array. Each entry has `name`, `type`, `required`, `shown-on-list`. Reference-type attributes have a `to` field naming the referenced object.

### Actions — three categories, plus command/query

CRUD, state-transition, and lifecycle:

1. **CRUD** — Create, Read, Update, Delete. Most objects have most.
2. **State-transition** — Archive, publish, restore, complete. Map to changes in a state attribute.
3. **Lifecycle** — Share, duplicate, export, import. Don't fit CRUD cleanly but are common.

Per the system's view (next section), every action is *also* either a command or a query. This dual classification is required.

For each action, the agent records:

- **Who can do it?** (`actor`: user / owner / admin / system / explicit role)
- **What does it produce?** (`result`: a new object, a state change, a side effect)
- **Is it destructive?** (`destructive: true | false`)
- **Erik's Action Checklist fields**: `confirmation-required`, `cancellable`, `undoable`, `feedback-on-success`, `feedback-on-failure`
- **Command or query?** (per the next section)

### Relationships — four kinds

| Kind | Meaning | Example |
|---|---|---|
| **has-many** | One object contains many of another | Project has-many Tasks |
| **belongs-to** | One object owned by exactly one of another | Task belongs-to Project |
| **many-to-many** | Many relate to many, no ownership | Tag has-many Tasks; Task has-many Tags |
| **has-one** | Strict 1:1 ownership | User has-one Settings (often) |

Every relationship has two sides; both should appear in the model. Reciprocity is intentional redundancy — it makes the model navigable from either object.

When a many-to-many has its own attributes (role, joined-at, permissions), promote it to its own object — usually called a junction object (e.g. ProjectMembership).

---

## The system's view (DDD)

The DDD layer answers: *where do the consistency boundaries sit, and what fires when state changes?*

This is what's missing from a flat OOUX model. Skipping it works at small scale and breaks at the first non-trivial product.

### Bounded contexts

A bounded context is **a region of the system within which a particular model is valid**. The same noun means different things in different contexts.

For our project-management example, the same product might have:

- A **Collaboration** context — Projects, Tasks, Comments, Mentions, Notifications. The user-facing core.
- A **Billing** context — Subscriptions, Invoices, PaymentMethods, plus a *different* concept of "User" (the billing entity, possibly with different attributes).
- An **Identity** context — Users, Sessions, AuthTokens, Roles, Permissions. Yet another "User" model.

Each context has its own object map. Objects with the same name in different contexts are *different objects*. The agent does not assume "User" is one thing across the whole product.

When a context references an object from another context, it does so by **ID only**, not by attribute access. The Collaboration context's Project has an `owner-id` that references the Identity context's User; it doesn't have an inline copy of the User's attributes.

**Why bounded contexts matter for UI:**

- Settings UIs that span contexts (account / billing / collaboration preferences) need to be designed knowing they're spanning contexts. The information hierarchy reflects the boundary.
- An admin UI for the Identity context (user management, role assignment) is fundamentally different from an admin UI for the Collaboration context (project management). Different UI patterns, different actions, different audiences.
- Cross-context references are read-only by default. The Collaboration context's UI doesn't let you edit the User's billing email — that's a Billing-context concern.

**Schema field:** `domain-map.json` is structured by `bounded-contexts[]` at the top level. Each context has its own `objects[]`, `events[]`, and so on.

**The single-context exception.** Small products may genuinely have one bounded context. The agent doesn't invent contexts where they don't belong. A simple internal tool might have one context called `core` and that's it. The discipline is to *consider* whether multiple contexts exist, not to manufacture them.

### Entities vs value objects

DDD distinguishes two kinds of objects:

| Kind | Defined by | Mutable? | Has its own ID? | Example |
|---|---|---|---|---|
| **Entity** | Identity (its ID) | Yes | Yes | Project, User, Task |
| **Value object** | Its values | No (replaced, not edited) | No | Money, Address, DateRange, Color |

A value object is *defined by what it contains*. Two `Money($100, USD)` values are the same Money. There's no "this $100 vs that $100." When you change a value object, you don't *edit* it — you *replace* it.

This matters for UI. Value object UI patterns are different from entity UI patterns:

- **Entity UI**: list views, detail views, edit-in-place where appropriate, navigate-by-ID
- **Value object UI**: form fields that capture all values together, replace-on-save (no partial edits), no detail view (the value is its own representation), often inline within an entity's UI

A `DateRange` value object on a Project entity is rendered as a date-range picker, not as a separate entity with its own detail page. An `Address` value object on a User entity is rendered as an address form, not as a list of address lines you edit individually.

**Schema field:** Each object in `domain-map.json` has a `kind: entity | value-object` field. Required.

**Common value-object candidates the agent should recognise:**

- Money / currency amounts
- Addresses
- Date ranges, time ranges
- Geographic coordinates
- Color values
- Phone numbers, email addresses (sometimes — depends on whether they have lifecycle)
- Status / state (when implemented as a tagged union with associated data)

When in doubt, the agent asks: *does this thing have its own identity that persists, or is it defined by its values?* If the latter, value object.

### Aggregates and aggregate roots

An **aggregate** is a cluster of objects treated as a single unit for data changes. The **aggregate root** is the only object outside the aggregate is allowed to reference; everything else inside the aggregate is reached through the root.

For our project-management example:

- A `Project` aggregate might contain `Project` (root), `ProjectMembership` (junction), `ProjectSettings` (value object). To change membership, you go through the Project root.
- A `Task` aggregate might contain `Task` (root), `Comment`, `Attachment`. Comments don't exist independently of their Task; you reach them through the Task.

Cross-aggregate references are by ID only. You don't nest a Task inside a Project's edit form for editing — you navigate to the Task aggregate and edit it there.

**Why aggregates matter for UI:**

- **Edit boundaries follow aggregate boundaries.** A "save" button saves an aggregate as a unit. The UI doesn't let you edit fields across two aggregates in one transaction without making the cross-aggregate save explicit (and often async, eventually consistent).
- **List vs nested editing decisions.** Items inside an aggregate can be nested-edited within the root's UI (Comments in a Task). Items in separate aggregates appear as references with navigation, not as nested editors (a Task referenced from a Project's UI is a link, not an inline form).
- **Confirmation surfaces follow aggregate boundaries.** Deleting a Project deletes the aggregate (cascades to ProjectMemberships). The confirmation dialog says so. Deleting a Task that has Comments inside its aggregate — same thing. Deleting a Task that's referenced from many Projects — different thing; needs different language.
- **Per `personal-anti-patterns.md`'s decision-relief frame**, the agent doesn't expose aggregate internals as separate top-level objects in navigation. Comments don't get their own page; they live in the Task aggregate's surface.

**Schema fields:**

- Each object in `domain-map.json` has `aggregate: <root-object-id>`. The root references itself. Other objects in the aggregate reference the root.
- Each relationship has `aggregate-internal: true | false`. Internal relationships are within an aggregate (Task has-many Comments). External relationships cross aggregates (Project has-many Tasks, where Task is its own aggregate root).

### Domain events

A domain event is **something that happened in the domain that other parts of the system care about**. Past tense, immutable, named in the domain's language.

For our example:

- `ProjectCreated`, `ProjectArchived`, `ProjectDeleted`
- `TaskAssigned`, `TaskCompleted`, `TaskMoved`
- `MembershipGranted`, `MembershipRevoked`

Every state-changing action *fires* one or more events. The events name what happened in domain terms — not in technical terms. `UserClickedArchiveButton` is not a domain event; `ProjectArchived` is.

**Why events matter for UI:**

- **Audit trails and activity histories** are reconstructions of past events. (Per `personal-anti-patterns.md`, we reject notification centres but accept activity histories — they're domain-event-shaped, not message-triage-shaped.)
- **Behaviour-triggered emails** (per `eureka.md` and `bj-fogg.md`) fire on events, not on time. "When `MembershipGranted` fires, send a welcome email" — the event is the trigger.
- **Real-time UI updates** subscribe to events. When `TaskAssigned` fires, the assignee's task list updates without polling.
- **The agent's prompts in flows** should be event-triggered, not time-triggered. Per `bj-fogg.md`, prompts targeting drop-off points should reference an event ("user signed up but did not fire `FirstSpecPublished` within 24 hours").

**Schema field:** Each bounded context in `domain-map.json` has an `events[]` array. Each event has `name`, `fired-by` (which actions fire this event), and `consumed-by` (optional — which UI surfaces or other contexts react).

The agent doesn't have to enumerate every possible consumer at design time. The point is to make events first-class so they're available to reference.

### Commands vs queries

Every action is either a **command** (changes state) or a **query** (returns state without changing it).

| | Command | Query |
|---|---|---|
| Changes state? | Yes | No |
| UI patterns | Form, button, confirmation, undo consideration | List, detail view, search, filter, sort |
| Action examples | `action:project.archive`, `action:task.assign` | `action:project.list`, `action:task.search` |
| Failure modes | "Did the change happen?" needs feedback (heuristic 1, visibility of system status) | "Is this the right data?" needs sort/filter clarity (heuristic 2, real-world match) |

Mixing them is a smell. A "search results that auto-execute on click" pattern blurs query (the search) into command (the action). A "list that shows different data depending on a hidden filter" blurs query state into command-shaped invisible state.

**Schema field:** Each action in `domain-map.json` has `kind: command | query`. Required.

The agent uses this classification to pick UI patterns. A command-action gets a button surface with confirmation as appropriate. A query-action gets a list/search/filter surface. Mixing is flagged in `plg-critique`.

---

## How the user's view and the system's view connect

The two views are not separate models — they're the same model viewed differently. The agent does both passes in one workflow:

1. **Object brainstorm** (OOUX) — list the nouns the user thinks about
2. **Bounded context grouping** (DDD) — group nouns by context. Same noun in two contexts is two objects.
3. **Entity vs value object** (DDD) — for each object, decide its kind
4. **Aggregate identification** (DDD) — group objects into aggregates with named roots
5. **Attribute pass** (OOUX) — for each object, list attributes
6. **Action pass** (OOUX + DDD) — for each object, list actions; classify each as command or query
7. **Relationship pass** (OOUX + DDD) — list relationships; mark each as aggregate-internal or external
8. **Event pass** (DDD) — for each command, name the events fired
9. **Validation** — walk the user's roadmap; every user action references a real action in the model

Compressed, this is a 60–90 minute exercise for the agent inside `plg-shape`. Larger products may need iteration.

### The translation layer

Designers think in OOUX vocabulary; architects think in DDD vocabulary. The agent translates:

| Designer says | DDD calls it |
|---|---|
| "A Project has Tasks inside it" | Project aggregate may contain Tasks; or Task is its own aggregate referenced by Project — the model decides |
| "When you archive a project, it disappears from the active list" | `ProjectArchived` event; query for active projects filters by status |
| "Money should be entered as a number plus a currency" | `Money` value object with amount + currency-code |
| "Settings are part of the user" | `UserSettings` value object (or aggregate-internal entity) on the User aggregate |
| "Click here to delete the project" | `action:project.delete` command, fires `ProjectDeleted` event |

The agent's discipline: when a user-facing concept maps to a DDD construct, the agent uses both terms. The design artifact talks to designers in OOUX terms; the schema captures the DDD layer for downstream consumption.

---

## How domain modeling feeds the rest of the system

Every downstream artifact pulls from the domain model:

| Downstream artifact | What it pulls from `domain-map.json` |
|---|---|
| `sitemap.json` | Each page's `objects` references objects from a specific bounded context |
| `flow-graph.json` | Every affordance triggering an action references an `action:` ID; the flow gets a `use-case` field naming the application use case |
| `wireframe.json` | Each region's `objects-shown` and `objects-acted-on` reference object IDs; value-object regions render as forms, entity regions as detail/list |
| `low-fi.json` | Information hierarchy reflects aggregate boundaries (root visible, internals nested; cross-aggregate references as links) |
| `high-fi.json` | Components used reflect entity vs value-object distinction (Detail Panel vs Form Field) |

When any downstream artifact references an object, action, or event that isn't in `domain-map.json`, the agent has two choices:

1. The downstream artifact is wrong — fix the artifact
2. The domain model is incomplete — add the missing element to `domain-map.json`

Either is valid. Silent invention is not.

---

## What this means for the artifact schema

Direct mappings:

- `domain-map.json` (formerly `object-map.json`) is the literal instantiation of this work.
- Top-level structure: `bounded-contexts[]`, each with `objects[]` and `events[]`.
- Each object: `kind: entity | value-object`, `aggregate: <root-object-id>`, plus attributes, actions, relationships as before.
- Each action: `kind: command | query` (required), plus `actor`, `destructive`, Erik's Actions Checklist fields.
- Each relationship: `aggregate-internal: true | false`.
- Each event: `name`, `fired-by[]`, `consumed-by[]`.
- `flow-graph.json` gains `use-case` field naming the application use case the flow implements.
- `flow-graph.json` affordances that trigger actions inherit the action's `kind` (command or query).

`plg-critique` runs these checks at product scope:

1. Does every object have a one-sentence `purpose`?
2. Does every object declare `kind: entity | value-object`?
3. Does every object declare its `aggregate`?
4. Does every action declare `actor` and `kind: command | query`?
5. Are relationships reciprocal where they should be?
6. Are aggregate-internal relationships consistent (both sides agree)?
7. Does every action referenced in flows or screens exist in the domain map?
8. Does every command have at least one event in `events[]`?

Failures 1–4 are `blocker`-level (the model is broken). Failures 5–6 are `major`. Failures 7–8 are `major` if missing, `warn` if event lists are empty (some commands genuinely don't fire events worth naming).

---

## Where the model is silent — by design

Three things this reference deliberately doesn't cover:

1. **Implementation patterns.** Repositories, factories, anti-corruption layers, sagas, process managers — these are implementation concerns the UI agent doesn't see. They live in the host project's code, not in `domain-map.json`.
2. **Database schema.** The domain model doesn't dictate database structure. An aggregate may map to one table or many. The agent doesn't generate database schema.
3. **API contracts.** Whether the host product exposes commands as REST endpoints, GraphQL mutations, RPC calls, or local function invocations is an implementation choice. The agent's flows assume *some* API exists; the shape of it is not the agent's concern.

The agent generates UI artifacts that respect domain boundaries. It doesn't generate or recommend the implementation of those boundaries.

---

## When this doesn't apply

Two cases:

- **Single-object products.** A standalone tool with one core entity (a calculator, a converter, a single-purpose form). The agent produces a minimal `domain-map.json` with one bounded context, one entity, no events worth naming. Notes in `product.md` that the model was scoped down.
- **Pre-product surfaces.** Marketing pages, comparison pages, documentation. These don't operate on user-owned domain objects. The agent skips `domain-map.json` for these features and notes it in `shape.md`.

When the model is skipped, the agent says so explicitly. It doesn't produce a stub `domain-map.json` to satisfy the schema; it omits it and documents why.
