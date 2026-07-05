---
name: plg-shape
description: |
  Shape a fuzzy product idea into the one-page product anchor —
  specs/design/_shared/product.md. Elicits the ideal user, the
  job-to-be-done (with push / pull / anxiety / habit forces), the MOAT
  free-model inputs, the three usage levels, and the 7-minute UDE test,
  then writes a schema-conformant product.md — and, building on it, a
  journey.md (Search→Scale roadmap with a measurable First Strike, KUI,
  and PAI). Use when the brief is "shape a product", "new product spec",
  "define the product", "map the user journey", or "start the PLG spec".
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
    requires: [plg-foundations, plg-moat, plg-eureka, plg-bj-fogg, plg-personal-anti-patterns]
  spec:
    produces: [product.md, journey.md]
    consumes: []
  design_system:
    requires: false
  example_prompt: "Shape a PLG product for a spec tool that lets designers publish a shareable design spec — help me define the ideal user, the job, the MOAT, and the 7-minute outcome, then write product.md."
---

# plg-shape · the product anchor (v0)

Turn a fuzzy product idea into **one file**: `specs/design/_shared/product.md`
— the one-page anchor every other specforge skill reads. You do not produce an
HTML artifact and you do not emit an `<artifact>` block; you write a structured
Markdown-with-YAML file **directly to disk** using the file tools.

This is a **mode skill**, not a surface generator. Its output is a spec, not a
screen. Author it against the injected craft, in the user's own words, and stop
at the fields the user can actually answer.

## Scope — read before anything else

**In scope:** two files, authored in order — `specs/design/_shared/product.md`
(artifact-schema §6.1), then `specs/design/_shared/journey.md` (§6.2). journey.md
builds on product.md and is authored second, never before it exists.

**Out of scope (later plg-shape iterations, do NOT produce here):**
`sitemap.json`, `nav-model.md`, `domain-map.json`, and per-feature `shape.md`. If
the user asks for those, say they come in a later pass. Keeping the surface to
product.md + journey.md is deliberate — it stays small and testable.

## Injected craft — the substance comes from here

The daemon injects these three craft files above this skill. Read them as the
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

### Step 4 — Unknowns go to `## Open questions`, never to a placeholder

This is the load-bearing discipline (`plg-personal-anti-patterns`, and CLAUDE.md
Rule 5): **you guide, you do not author Layer B for the user.** When the user
says "I don't know" or leaves a field blank, do **not** fill it with a
plausible-sounding default. Record it under `## Open questions` as a decision the
product owner still owes — e.g. "MOAT market stance undecided; free-model can't
be finalised until it's set." A confident guess in a required field is worse than
an honest open question.

## Hard rules

- **Two files, in order.** `product.md` (§6.1) first, then `journey.md` (§6.2).
  Never journey.md before product.md exists. Nothing else this iteration.
- **Write to disk; no `<artifact>` block.** This is a spec, not an HTML surface —
  there is no iframe preview.
- **Discovery before writing.** Turn 1 is the form and a stop, every time.
- **No invented Layer B.** Unknowns are open questions, not defaults — each file
  gets its own `## Open questions`.
- **Schema §6.1 / §6.2 fields verbatim** — `version: "2"` and every block above.
  Don't add fields the schema doesn't define.
