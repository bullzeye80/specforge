---
version: "2"
feature: "acquisition-landing"
owns-screens: ["screen:landing/main", "screen:pricing/main"]
appetite: "medium"
problem: "A problem-aware founder is comparing screen-generators (v0/Lovable/Stitch/Figma-AI) that produce screens, not decisions, while their coding agent keeps flailing on vague prompts. The unauthenticated surface has one job the whole product hangs on: reframe the category from 'generate a screen' to 'produce a disciplined spec', present the freemium offer honestly, and earn a self-serve click to sign-up — with no demo gate and no card ask."
intended-outcome: "A visiting founder understands within roughly one screen that specforge produces a disciplined spec (not another screen), sees the Free + Pro offer plainly, and self-serves straight to sign-up rather than reverting to prompting Claude directly."
target-stage: "select"
target-milestone: "visit"
no-gos:
  - "A demo or 'talk to sales' gate — audience is bottom-up freemium, so the surface is self-serve only"
  - "Credit-card capture or account creation on the landing itself — that belongs to sign-up"
  - "Feature-tour marketing — the Search-stage job is problem/solution clarity (Hero → Problem → Solution → Risk-reversal → CTA), not a feature list"
  - "Hidden, inflated, or fake-discount pricing ('Save 80%') — the price is visible and honest, no card to start Free"
rabbit-holes:
  - "Expanding the marketing site into many sub-pages before the app earns traffic — hold to landing + pricing at v1"
  - "A competitor-comparison matrix that becomes an unmaintained table — reframe the category once, don't itemise every rival"
  - "The pricing page drifting ahead of the actual free-tier meter shape, which is an owed pricing decision (journey.md Open Q 4) — describe the axis (artifact meter), not a hard allowance"
---

## Solution sketch

Two unauthenticated, marketing-shaped pages — Landing (`/`) and Pricing
(`/pricing`) — that do **not** share the authenticated app's hub-and-spoke chrome
(per `nav-model.md`). Their structural spine is the Search-stage pattern the craft
names: **Hero → Problem → Solution → Risk-reversal → CTA.** The hero states the
reframe in the founder's own language — the build stalls because coding agents
flail on vague prompts, and the fix is a disciplined spec, not another screen. The
problem section names the incumbent habit it must beat (prompting Claude directly:
free, instant, and losing). The solution section shows the disciplined intermediate
(anchor → journey → tree) as an *outcome*, not a feature tour. Risk-reversal is the
freemium promise itself: get started free, no card, the free tier delivers a real
skeleton anchor.

The hero CTA is **"Get started — free"** (freemium homepage shape from `plg-moat`),
handing off to sign-up; the secondary surface is "See pricing". Pricing is **Free +
Pro**, differentiated on the *artifact meter* — the value metric tied to the KUI in
`journey.md`, the same metric the paywall and paid tier use — with the price shown
in-view and no card required to start Free.

This feature is the front door for the Search→Select transition: it carries the
problem reframe (problem-aware → active-research) and lands the visitor (Visit),
then gets out of the way. Everything after the CTA belongs to `account-access`.

## Open questions

1. **Free-tier allowance on the pricing page.** The pricing axis is the artifact
   meter, but the exact number (artifacts before the meter trips, reset period) is
   an owed pricing decision (`journey.md` Open Q 4). The pricing page names the axis
   and defers the number until the owner sets it.
2. **How hard to lean on competitor naming.** The reframe is against a category
   (screen-generators), not a named rival; whether to name specific tools is a
   positioning call for the owner, not this shape.
