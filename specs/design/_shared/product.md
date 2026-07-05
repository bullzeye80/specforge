---
version: "2"
name: "specforge"
slug: "specforge"
ideal-user:
  role: "Solopreneur or small-team founder, hands-on in the build"
  context: "Mid-build with a fuzzy product idea and no design team — needs a spec a downstream coding agent can build from"
  endgame: "Produces a structured spec artifact that a coding agent builds a product from, without a design team"
jtbd:
  job: "When I have a fuzzy product idea, I want a structured spec, so I can build the product without a design team"
  forces:
    push: ["Coding agents flail on vague prompts"]
    pull: ["A disciplined, structured spec to build from"]
    anxiety: ["It's yet another tool to learn"]
    habit: ["Prompting a coding agent (Claude) directly with the fuzzy idea"]
moat:
  market: "disruptive"
  ocean: "red"
  audience: "bottom-up"
  time-to-value: "< 7 minutes (skeleton product.md; the full-depth anchor is an Intermediate outcome)"
  free-model: "freemium"
  free-model-rationale: "Market: disruptive — reframes building around spec-discipline; freemium best demonstrates the new way to a self-serve user. Ocean: red (v0/Lovable/Stitch/Figma AI) — freemium/reverse-trial win, demo-led loses. Audience: bottom-up — self-serve only, no card up front, no sales gate before First Strike. TTV: < 7 minutes (Beginner First Strike shrunk to a skeleton product.md) — value felt before commitment, so freemium fits. Net: freemium — the free tier delivers the skeleton product.md, gated on a value metric tied to KUI (set in journey.md), never on features."
levels:
  beginner: "Generates a skeleton product.md — name, ideal user, job, and a first-cut MOAT — from a fuzzy idea, in under 7 minutes. This is the First Strike."
  intermediate: "Refines that into a complete, disciplined product.md anchor (deep MOAT, UDE test, JTBD forces) and produces the first downstream artifacts (journey.md, sitemap)."
  advanced: "Authors and maintains the full multi-feature artifact tree — journey, flows, domain-map, critique — a buildable spec a coding agent runs with end to end. This is the stated endgame: building a product without a design team."
ude-test:
  unique: "Yes — the first product.md is itself the differentiator. It is a process-disciplined PLG anchor (JTBD, MOAT, measurable First Strike, the UDE test), not a generated screen. The user experiences the discipline, which is exactly what a generic screen-generator (v0/Lovable/Stitch) does not give them."
  desirable: "Confirmed — the ideal user (a founder mid-build, no design team) wants a disciplined spec to build from. The skeleton product.md is the first, fast taste of that discipline; the full buildable artifact tree is the endgame they grow into (Intermediate → Advanced). Value is felt at the anchor, not deferred to the whole tree."
  effective: "Passes — the Beginner First Strike is a skeleton product.md (name, ideal user, job, first-cut MOAT) reachable in under 7 minutes. The full-depth anchor and the downstream artifact tree are deliberately kept off the Beginner clock as Intermediate/Advanced outcomes."
---

## Narrative

specforge turns a fuzzy product idea into a structured spec-artifact tree that a
downstream coding agent — or a human — builds a product from. It is not a screen
generator, not v0/Lovable/Stitch/Figma-AI, and it does not emit production code.
It produces the disciplined intermediate that has been missing: an anchor
(`product.md`), then breadboards, journeys, fat-markers, and composed mockups
that carry enough product decision to hand off cleanly.

The user is a solopreneur or small-team founder, mid-build, holding an idea that
is real but under-specified. They don't have a design team and don't want one.
Their pain is downstream of that gap, and they named it precisely: coding agents
flail on vague prompts. What pulls them is a disciplined, structured spec. What
holds them back is the fear of learning yet another tool, and the habit of just
prompting Claude directly and hoping. specforge has to be faster and more
disciplined than that habit, or it loses to it — which is exactly why the first
taste of value has to land inside seven minutes.

specforge competes as a **disruptive** play in a **red** ocean: the category is
crowded with screen-generators, and specforge reframes the job from "generate a
screen" to "produce a disciplined spec." Adoption is **bottom-up** — individual
founders pick it up before any org does. With the Beginner outcome shrunk to fit
the seven-minute clock, the free model resolves to **freemium**: self-serve, no
card, the free tier delivering a real skeleton product.md, and pricing gated
later on a value metric tied to the KUI rather than on features.

The load-bearing decision this anchor makes is the **fidelity ladder inside the
product itself.** The earlier draft caught its own UDE violation — a full-depth
product.md takes an hour or more, which fails the seven-minute rule — and the fix
was the disciplined one: shrink the Beginner outcome, don't extend the budget. So
the three levels now form a clean ladder. **Beginner** is a *skeleton*
product.md — name, ideal user, job, a first-cut MOAT — from a fuzzy idea in under
seven minutes; that is the First Strike, the fast aha. **Intermediate** is the
complete, refined anchor (the depth of this very file) plus the first downstream
artifacts. **Advanced** is the full multi-feature artifact tree — journey, flows,
domain-map, critique — the buildable spec that delivers the stated endgame of
shipping a product without a design team.

That laddering also settles the earlier tension about First Strike scope. Value
is deliberately placed at the *anchor*, not deferred to the whole tree: a founder
feels the discipline the moment the fuzzy idea becomes a structured skeleton, and
grows into the full buildable spec over Intermediate and Advanced use. The MOAT
block is coherent, the UDE test passes on all three axes, and the product-shape
foundation is green. What remains is downstream: `journey.md` must formalise the
same First Strike as a measurable event and set the KUI (and therefore the
freemium value metric) — that is the next skill's job, not this one's.

## Open questions

The product-shape foundation is complete. The remaining items are handed to the
next skill (`journey.md`), not decisions owed here.

1. **KUI + value metric (belongs in `journey.md`).** The freemium free tier gates
   on a value metric tied to the KUI. Both are set when `journey.md` is authored;
   the foundation check that "pricing value metric == KUI" is verified there, not
   in `product.md`.
2. **First Strike as a measurable event (belongs in `journey.md`).** This file
   names the First Strike (skeleton product.md in < 7 min); `journey.md` must
   express it as a concrete fired event and reference the screen it lands on.
