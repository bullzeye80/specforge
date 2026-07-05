---
version: "2"
model: "hub-and-spoke"
patterns:
  primary: "top-bar"
  secondary: "contextual-sidebar"
  deep: "breadcrumb"
search:
  presence: "secondary"
  scope: "scoped-to-page"
---

## Rationale

The authenticated product is a **hub-and-spoke** graph, and the sitemap already
draws it: the **Dashboard** (`/home`) is the hub — it lists the founder's
products and makes the growing artifact tree visible (the retention surface the
journey names). Each **Product workspace** (`/p/:productId`) is a spoke, and it
is itself a small hub over that product's tree, from which artifacts
(`/p/:productId/a/:artifactId`) and features (`/p/:productId/f/:featureSlug`)
hang at depth 2. A founder returns to the hub, dives into one product, works its
tree, and comes back — that is the daily-use loop, not a flat set of peers and
not a deep drill the user gets lost in.

The pattern choices follow the **MOAT**. Audience is **bottom-up** and the model
is **freemium**: adoption is a single self-serve founder with no design team, so
navigation must be self-evident, not a power surface to be learned — the anxiety
force this product fights is "yet another tool to learn." That argues for a thin
**top-bar** as the primary global nav (brand → dashboard, *New product*, and a
user menu holding Settings, Plan & usage, Sign out): there are only a handful of
global destinations, so a persistent side-rail would be mostly empty chrome —
decision-relief says don't render it. The density that *does* exist lives inside
a product, so the **contextual-sidebar** (the SpecTree) is a secondary,
product-scoped rail listing the anchor and every downstream artifact and
feature. Depth-2 pages get a **breadcrumb** (Dashboard → Product → Artifact) so a
founder can climb back out without a back-button gamble.

The market is **disruptive** in a **red** ocean of screen-generators; the
unauthenticated surface (Landing, Pricing) is marketing-shaped with the freemium
hero CTA ("Get started — free", no demo gate) and hands off to sign-up — it does
not share the app's hub-and-spoke chrome. **Billing** is single-context but
reached *from* the shaping context two ways: the `quota-reached` inline-flow edge
(the soft freemium paywall, at the moment the meter trips) and the user menu.
Search is **secondary** and **scoped-to-page** (filter the dashboard product list
or the product's tree) — at v1 a founder owns a small handful of products and a
modest tree, so a global index isn't earned yet.

## Patterns rejected and why

- **Flat model** — rejected. There is real depth (product → artifact/feature
  tree); a flat set of peers would flatten the tree that *is* the product's
  structure and hide the anchor→downstream relationship the whole spec is about.
- **Faceted navigation** — rejected. The domain is not a large searchable catalog
  with many orthogonal filter dimensions; a founder's products are a small owned
  list, and their artifacts are a shaped tree, not facets to slice.
- **Purely hierarchical (drill-down) model** — considered and folded into
  hub-and-spoke rather than adopted alone. The nesting is real (depth 0→1→2), but
  the daily motion is hub-return, not linear drill; modelling it as strict
  hierarchy would under-serve the dashboard's role as the always-available hub
  and retention surface.
- **Command palette as the *primary* nav** — rejected for v1, tempting though it
  is for a dev-adjacent audience. A bottom-up self-serve founder at the Beginner
  level needs discoverable, visible affordances, not a hidden accelerator. It is
  a strong candidate to *add* as a secondary accelerator at the Advanced level
  (see Open questions) — not to lead with.
- **Persistent global side-rail as primary** — rejected. Too few global
  destinations to fill it; it would be empty chrome and violate the
  decision-relief / restraint stance. The one place a rail earns its keep is the
  product-scoped SpecTree, which is why that rail is *secondary and contextual*,
  not global.
- **Bottom-tabs** — rejected. This is a desktop-primary tool for a founder
  mid-build at a workstation, not a thumb-first consumer app; bottom-tabs would
  misread the platform and cap the tree's usable width.
- **Workspace / tenant switcher** — rejected. There is no real org-level data
  isolation at v1 (single-founder, bottom-up); products are *listed on the
  dashboard*, not switched through a multi-tenant switcher. A switcher backed by
  row-level filters on a shared table would be the exact anti-pattern
  `plg-personal-anti-patterns` names.
- **Notification centre / activity feed as a nav element** — rejected. The
  dashboard surfaces each product's depth/status inline, and confirmations are
  toasts; the product is not a place where items accumulate to be triaged.

## Open questions

1. **When does search get promoted?** `secondary / scoped-to-page` is a v1 call
   sized to a founder with few products and a modest tree. If a power user (the
   Advanced level) accumulates many products and large trees, global search — and
   possibly the command palette below — should be promoted. Owed to the owner
   once real tree-size data exists.
2. **Command palette as an Advanced-level accelerator.** Worth prototyping as a
   secondary jump-to-artifact / jump-to-product surface for power users, without
   making it the primary nav that Beginner users must discover. Decision deferred
   to the flow phase / a later fidelity rung.
3. **Responsive / mobile nav collapse.** The tool is desktop-primary; the
   pattern for narrow viewports (top-bar → drawer, contextual SpecTree → sheet or
   collapsible panel) is owed when responsive states are designed in `plg-flow`,
   not fixed here.
4. **No cross-context pages at this cut.** Every sitemap node is single-context
   (`context: shaping | identity | billing`), so there is no `context: "cross"`
   span to justify. Billing is *reached from* the shaping context via the
   `quota-reached` inline flow and the user menu; if a future page genuinely spans
   contexts, it must be documented here per `plg-domain`.
