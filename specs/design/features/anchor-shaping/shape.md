---
version: "2"
feature: "anchor-shaping"
owns-screens: ["screen:shape/anchor-result"]
appetite: "medium"
problem: "This is where the founder experiences core value for the first time: the fuzzy idea must come back as a disciplined skeleton product.md — name, ideal user, job, first-cut MOAT — visibly more structured than what re-prompting Claude produces, and fast. If the skeleton isn't both faster than re-prompting and visibly more disciplined, the user reverts to the free, instant habit. First Strike is measured on this exact surface: event:shaping.artifact-generated fires here for the first time."
intended-outcome: "The founder sees their vague idea returned as a structured skeleton anchor and recognises the aha — 'this is more disciplined than my prompt gave me' — with the first event:shaping.artifact-generated fired and the anchor viewable, all inside the seven-minute clock."
target-stage: "showcase"
target-milestone: "first-strike"
no-gos:
  - "Full-depth anchor generation on this path — the complete MOAT / UDE / JTBD-forces anchor is an Intermediate outcome kept off the Beginner clock; First Strike is the skeleton only"
  - "Fabricated fields where the user gave nothing — unknowns surface as open questions in the anchor, not confident guesses"
  - "Provenance-free output — the generated anchor carries what generated it and when, so the founder can act on it"
  - "Blocking the aha behind an upgrade prompt — the paywall lands at the meter later, never in front of First Strike"
rabbit-holes:
  - "Generation latency blowing the seven-minute clock — if the skeleton is slow, shrink its depth, never extend the budget"
  - "Heavy editing affordances on this surface competing with the aha — refinement lives in product-workspace, not here"
  - "Trying to make the skeleton comprehensive — it is a deliberate first cut, and completeness is the Intermediate level's job"
---

## Solution sketch

A single Showcase-stage surface — Anchor result (`/p/:productId/shape`) — that is
the product's **First Strike**. Structurally it takes the `object:shaping.idea-seed`
captured in `idea-intake` and renders the generated **skeleton
`object:shaping.artifact`** (a product.md with name, ideal user, job, and a
first-cut MOAT) in an inline, document-style view. The moment the artifact is
generated, `event:shaping.artifact-generated` fires for the first time — the
measurable First Strike named in `journey.md`.

Three shaping decisions carry this feature. First, **scope discipline**: the
Beginner First Strike is the *skeleton*, not the full anchor — that is what keeps
it inside the seven-minute clock, and the fix for any latency or depth pressure is
to shrink the outcome, not the budget. Second, **honesty over fabrication**: where
the fuzzy idea gave nothing to work with, the anchor shows an open question rather
than a plausible-sounding default — the discipline the product is selling is exactly
the trust that fabrication would erode. Third, **provenance**: the generated anchor
is stamped with what produced it and when, so the founder treats it as a spec they
can act on, not magic.

From this surface the founder moves forward, not sideways: the primary path is
**"view full tree" → product workspace** (where refinement and downstream generation
happen); a secondary path returns to the dashboard. If the artifact meter has
already tripped, a soft `quota-reached` inline-flow points to billing — but never in
front of the first aha.

The strongest version of this pitch makes the aha land in seconds and makes the
skeleton *visibly* more structured than a raw prompt's output — speed and discipline
together, because either alone loses to the habit.

## Open questions

1. **Regenerate vs. refine on First Strike.** Whether the founder can re-run the
   skeleton generation from this surface, or only refine it downstream in the
   product workspace, is owed to `plg-flow` — it must not turn the aha screen into
   an editing surface.
2. **How gaps are shown in the skeleton.** The visual treatment of an
   'open question' inside the anchor (inline marker vs. a gathered list) is a flow
   decision, constrained by the no-fabrication rule.
