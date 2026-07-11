---
version: "2"
feature: "home-dashboard"
owns-screens: ["screen:dashboard/main"]
appetite: "small"
problem: "Users churn when they can't see what they've gotten out of the product — the journey names this as a failure mode this product must defend against. The dashboard is the retention surface: it must make the growing artifact tree visible across the founder's products and be the always-available hub of the daily-use loop, all without becoming a notification centre, activity feed, or a place where things accumulate to be triaged."
intended-outcome: "A returning founder sees their products and each one's depth and status at a glance, re-enters a product's tree in one hop, or starts a new product — the KUI made visible, so the value they've accrued is legible and the habit takes."
target-stage: "showcase"
target-milestone: "kui"
no-gos:
  - "A notification centre, activity feed, or unread badges — attention-triage shapes the product refuses (anti-patterns)"
  - "A multi-tenant workspace switcher — there's no real org-level data isolation at v1; products are listed on the hub, not switched"
  - "Vanity metrics or decorative stats — show real artifact-tree depth and status, not slop"
  - "Global search promoted to primary — it stays secondary and scoped-to-page at v1 until tree size earns more"
rabbit-holes:
  - "Dashboard-analytics creep — resist turning the retention hub into a metrics dashboard"
  - "An empty state that entertains with an illustration instead of pointing to the one next step (start a product)"
  - "Sorting / filtering sprawl before a founder owns enough products to need it"
---

## Solution sketch

The **hub** of the hub-and-spoke model (`nav-model.md`) — Dashboard (`/home`) — the
daily entry point after auth and the product's retention surface. Structurally it
lists the founder's `object:shaping.product` records as cards, each showing the
product's **depth and status** so the growing artifact tree is visible at a glance.
That visibility is the whole point: it is the direct answer to the 'a KUI the
founder can't see' failure mode in `journey.md`.

Navigation is deliberately thin. A **top-bar** carries the handful of global
destinations (brand → dashboard, *New product*, and a user menu holding Settings,
Plan & usage, Sign out); there is no persistent side-rail, because with so few
global destinations it would be empty chrome — decision-relief says don't render it.
The dashboard's own density is just the product list. A **secondary, scoped filter**
lets a founder narrow the list, but global search isn't earned at v1.

The two primary motions are re-entry and creation: a product card opens the
**product workspace** (the spoke), and *New product* returns to `idea-intake` to
shape another idea. This is the daily-use loop — return to the hub, dive into one
product, work its tree, come back — and it is where PAI/KUI activity is surfaced and
re-triggered without any feed or badge.

The strongest version of this feature is a calm, legible hub whose only job is to
make progress visible and re-entry one hop away. Anything that turns it into an
inbox to clear is scope this pitch refuses.

## Open questions

1. **What 'depth/status' shows per product.** The exact per-card signal (which
   artifacts exist, a completeness indicator, last-touched) is a flow decision — it
   must read as real progress, not a vanity metric.
2. **When scoped filter becomes global search.** Promotion is owed to the owner
   once a power user accumulates many products (`nav-model.md` Open Q 1); not fixed
   here.
