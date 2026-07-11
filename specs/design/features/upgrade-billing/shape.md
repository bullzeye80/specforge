---
version: "2"
feature: "upgrade-billing"
owns-screens: ["screen:billing/plan", "screen:billing/paywall"]
appetite: "medium"
problem: "The Scale stage is where freemium converts. The free tier delivers the Beginner outcome and gates on the artifact meter — the value metric tied to the KUI — so pricing must kick in softly at the exact moment the meter trips, never by fencing off a feature and never as a blocking wall. And because the product's whole stance is symmetry, cancellation and downgrade must be as easy as sign-up, with none of the dark patterns (hidden cancel, are-you-sure loops, retention-discount modals) that erode the trust the discipline is selling."
intended-outcome: "A founder who hits the free artifact meter can upgrade in one click at that moment to keep generating, see plan and usage plainly, and downgrade or cancel just as easily — a soft transition, not a wall, with the price always visible."
target-stage: "scale"
target-milestone: "upgrade"
no-gos:
  - "A feature-gated free tier — meter the KUI event (artifacts generated) and reset it; never fence off a feature (anti-patterns / foundations)"
  - "A credit card required to start Free"
  - "Hidden cancellation, are-you-sure loops, cancel-survey gates, or retention-discount modals on the cancel attempt"
  - "A time-bombed trial of the free tier itself — staying under the free limit forever is a feature"
rabbit-holes:
  - "Building the paywall as a blocking modal on a screen the user came to act on — it is a soft inline surface at the meter, with a visible escape"
  - "Hard-coding the free-tier allowance / reset period before the owner sets it (journey.md Open Q 4)"
  - "Three-metric drift — the free-tier gate, the KUI, and the paid-tier differentiator must all be the same thing (artifacts generated), not three metrics"
---

## Solution sketch

The Scale-stage surface — Plan & usage (`/settings/billing`) — which hosts both the
plan view and the **soft freemium paywall**. Structurally it operates on
`object:billing.subscription` and `object:billing.artifact-quota`, and it is
*reached from* the shaping context two ways (`nav-model.md`): the `quota-reached`
inline-flow edge from the shape and product surfaces (the soft paywall, fired at the
moment the meter trips) and the user menu.

The load-bearing rule is **symmetry**. Upgrade is one click, offered at the moment
the artifact meter is reached — not as a standing banner, not as a mid-task modal
that blocks a screen the user came to act on. Downgrade and cancel are **equally**
one click, with no support-contact detour, no confirmation maze, no survey gating
the cancel button, and no last-minute discount modal. The paywall shows the price
in-view; the free tier needs no card to start.

The metric coherence is the other rule this feature must hold. The meter that gates
the free tier, the KUI in `journey.md`, and the axis that differentiates Free from
Pro are **the same thing** — spec artifacts generated. This feature must not
introduce a second or third metric; if the tracked event shifts from generation to
handoff (`journey.md` Open Q 2), all three shift together.

Downgrade behaviour is framed as a transition, not a loss: nothing the founder made
is destroyed on downgrade, advanced capability goes quiet while their work stays,
and a one-click path back up is offered — symmetric to how they upgraded.

The strongest version of this pitch is one a churning user leaves without
resentment, because leaving was as easy as joining.

## Open questions

1. **Free-tier meter shape.** The allowance (how many artifacts before the meter
   trips) and whether it resets per period is an owed pricing decision
   (`journey.md` Open Q 4) — set by the owner, not this shape.
2. **Pro tier axis beyond the meter.** Whether Pro differs only on the meter or also
   on product count / tree depth is a pricing decision owed to the owner, constrained
   by the single-metric rule.
