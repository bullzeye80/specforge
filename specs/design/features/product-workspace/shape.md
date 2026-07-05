---
version: "2"
feature: "product-workspace"
appetite: "large"
problem: "This is where the retention habit forms and the product's endgame lives. Within one product, the founder generates and refines the downstream artifact tree — journey, sitemap, domain-map, flows, feature shapes — and this is the surface where PAI and KUI repeat (generating a spec artifact) and where the Advanced level (a full multi-feature tree a coding agent ships from without a design team) is reached. It must make the anchor→downstream structure legible and keep generating the next artifact the low-friction repeated action, without becoming a heavy IDE a Beginner has to learn."
intended-outcome: "The founder works one product's tree — sees the anchor and every downstream artifact and feature, generates the next artifact, and views / refines / edits / exports any one — repeating the value that forms the retention habit and grows the product toward a buildable spec."
target-stage: "showcase"
target-milestone: "kui"
no-gos:
  - "Producing production code or HTML screens — specforge emits spec artifacts (Markdown/YAML/JSON), never code"
  - "Flattening the tree into a peer list — the anchor→downstream relationship is the structure the whole spec is about"
  - "Modal editing for document-style artifact content — long-form content is edited inline; modals are for discrete entities only"
  - "Skipping fidelity-ladder rungs when generating downstream artifacts (no high-fi before its wireframe/low-fi is set)"
rabbit-holes:
  - "The SpecTree growing into a full IDE — keep it a legible contextual rail (secondary nav), not a power surface Beginners must decode"
  - "Artifact versioning / diffing scope exploding — v1 is view / refine / edit / export, not a VCS"
  - "Command palette creeping in as primary nav — it's a deferred Advanced-level accelerator, not a v1 primary (nav-model.md Open Q 2)"
  - "Export-format sprawl before the generation-vs-handoff event question is settled (journey.md Open Q 2)"
---

## Solution sketch

The **spoke** of the hub-and-spoke model, and itself a small hub over one product's
tree. Three sitemap pages compose it: Product workspace (`/p/:productId`), the deep
Artifact view (`/p/:productId/a/:artifactId`), and the deep Feature detail
(`/p/:productId/f/:featureSlug`). Structurally the workspace is organised by a
**contextual-sidebar SpecTree** (the secondary, product-scoped nav from
`nav-model.md`) that lists the anchor and every downstream `object:shaping.artifact`
and `object:shaping.feature` — making the anchor→downstream relationship, the thing
the whole spec is about, legible rather than flattened. Depth-2 pages get a
**breadcrumb** (Dashboard → Product → Artifact) so the founder climbs back out
without a back-button gamble.

The load-bearing motion is **generating the next artifact** — the single repeated
action that is the PAI and, aggregated, the KUI. Refinement is document-style and
**inline** for long-form artifact content (modal editing is reserved for discrete
entities elsewhere). Any one artifact can be **exported** — the handoff to a
downstream coding agent, which is the product's reason to exist. As the tree fills
out across features, the founder is operating at the **Advanced level**: a full
multi-feature buildable spec.

Two boundaries keep the appetite honest. This feature *is* large, but it stays a
legible workspace, not an IDE: versioning/diffing is out of v1 scope, and the
command palette stays a deferred Advanced accelerator rather than the primary nav a
Beginner must discover. If the artifact meter trips while working here, a soft
`quota-reached` inline-flow points to billing.

The strongest version of this pitch makes 'generate the next artifact' feel cheap
and the tree feel navigable — because the habit is built on the repetition, and the
endgame is the completed tree.

## Open questions

1. **Generation vs. handoff as the tracked event.** `journey.md` (Open Q 2) leaves
   open whether the value event is artifact *generation* or artifact *handoff/export*.
   The workspace instruments generation today; if an export event is chosen, the
   surface and the meter both reference it.
2. **How much refinement is inline generation vs. manual edit.** The split between
   re-generating an artifact and hand-editing it inline is owed to `plg-flow`.
3. **Feature-scope artifacts inside the tree.** Which downstream feature-scope
   artifacts (flow-graph, wireframe, low-fi, high-fi) surface here is defined by the
   later `plg-flow` pass, not this shape.
