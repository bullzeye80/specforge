---
version: "2"
feature: "anchor-shaping"
entry: "place:describe-idea"
target: "place:anchor-result"
target-time: "under 7 minutes"
ude-applicable: true
---

## Steps to first strike

1. **Land** at `place:describe-idea` (`screen:onboarding/describe-idea`) — the single
   on-line Setup step. The founder sees one field: describe or paste the fuzzy idea in
   their own words. No profile, workspace, or plan step sits in front of it (all
   deferred off the line per `journey.md`).
2. **Type or paste** the idea into the `object:shaping.idea-seed` field.
3. **Click** "Shape my anchor" (`aff:submit-idea`) → `place:anchor-result`. This
   triggers `action:shaping.artifact.generate` (a `command`) — the action whose event
   *is* the First Strike. (A product shell — `action:shaping.product.create` — is
   created in the same submit transaction to hold the artifact; it is bundled behind
   this one gesture, not a separate on-line step.)
4. **Arrive** at `place:anchor-result` (`screen:shape/anchor-result`). The generated
   skeleton `product.md` (name, ideal user, job, first-cut MOAT) renders inline,
   document-style, stamped with what produced it and when.
   **⇢ First Strike.** `event:shaping.artifact-generated` fires for the first time —
   the measurable First Strike named in `journey.md` (`first-strike.appears-in:
   screen:shape/anchor-result`). The aha: the fuzzy idea came back visibly more
   disciplined than a raw prompt, and fast.

The golden path is two user gestures — describe, then generate — landing on the aha.
That is the whole line; nothing else earns a place on it before First Strike.

## Steps in current flow that don't lead to first strike

Everything below sits **after** the First Strike (which is reached at step 4). None
is a pre-first-strike detour — the line above has no branches before the aha.

- **`aff:view-full-tree` → `place:product-workspace`** (primary) — **Keep.** This is
  the intended *forward* move after the aha: into the artifact tree where PAI/KUI
  repeat (`event:shaping.artifact-generated` again and again, per `journey.md`). It moves the user
  forward, not sideways, exactly as `shape.md` requires. Pure navigation
  (`triggers-action: null`), so no command-vs-query smell.
- **`aff:go-home` → `place:dashboard`** (secondary) — **Keep.** A low-friction,
  symmetric escape back to the retention surface. Secondary link, not competing with
  the forward path.
- **`quota-reached` → billing paywall** (sitemap edge `page:shape →
  page:settings.billing`) — **Defer / out of this flow.** Deliberately **not** a place
  in this flow-graph. For a first-time anchor-shaping the meter cannot be reached (it
  is the user's *first* artifact), and `shape.md` is explicit: the paywall "lands at
  the meter later, never in front of First Strike." It belongs to the Scale-stage
  `flow:upgrade`, not to the First-Strike line here.

## UDE test

- **Unique:** Yes — the skeleton `product.md` is itself the differentiator. The founder
  experiences *process discipline* (a named ideal-user, JTBD job, first-cut MOAT) — not
  a generated screen. That is precisely what re-prompting Claude, or a
  screen-generator (v0/Lovable/Stitch), does not return. The value shines in the
  artifact, not the chrome.
- **Desirable:** Confirmed against `product.md`'s ideal user — a solopreneur/small-team
  founder, mid-build, no design team, who wants a disciplined spec to build from. The
  skeleton anchor is the first fast taste of that discipline; they grow into the full
  tree over Intermediate/Advanced. They want this.
- **Effective:** Passes. Two user gestures — describe/paste, then one generate — land
  the aha well inside the budget. If generation latency threatens the clock, the fix is
  to **shrink the skeleton's depth, never extend the budget** (`shape.md` rabbit-hole;
  `plg-foundations` seven-minute rule).

## Drop-off candidates

Each names the likeliest gutter, a B=MAP diagnosis (`plg-bj-fogg`), and a candidate
bumper. `plg-critique` later checks each has a bumper tied to it.

1. **Blank-field paralysis at `place:describe-idea`.** The founder faces an empty box
   and doesn't know how much or what to write.
   - *Diagnosis:* **Ability** (blank-canvas cost), not motivation — they arrived, so
     they want it.
   - *Bumper (Product):* an **empty state** with a concrete example prompt as
     placeholder text and first-class paste support — lower the cost of the first
     attempt rather than adding explanatory copy. Measurable on `idea-submitted`.

2. **Generation wait at the `place:anchor-result` transition.** The skeleton takes long
   enough to generate that the founder doubts it and bails before the render.
   - *Diagnosis:* **Ability** (time cost), tied to the seven-minute clock.
   - *Bumper (Product):* a **progress indicator** sized to the real generation
     duration; and upstream, if the wait is structural, shrink skeleton depth per the
     `shape.md` rabbit-hole. Measurable on the gap between `idea-submitted` and
     `event:shaping.artifact-generated`.

## Open questions

Owed decisions, recorded rather than guessed (`plg-personal-anti-patterns`,
CLAUDE.md Rule 5 — guide, don't author Layer B):

1. **Regenerate vs. refine on `place:anchor-result`** (from `shape.md` OQ1). Whether the
   founder can re-run skeleton generation from this surface, or only refine downstream
   in `place:product-workspace`, is unresolved. It is deliberately **not** modelled as
   an affordance here — adding a regenerate/edit control would risk turning the aha
   screen into an editing surface, which `shape.md` forbids. Owed before screen-scope.
2. **How gaps are shown inside the skeleton** (from `shape.md` OQ2). The visual
   treatment of an "open question" in the anchor (inline marker vs. a gathered list) is
   a screen-scope decision, constrained by the no-fabrication rule — not settled at
   flow scope.
3. **Create-vs-generate binding on `aff:submit-idea`.** This flow binds the submit
   affordance to `action:shaping.artifact.generate` (the First-Strike command), with
   `action:shaping.product.create` bundled into the same submit. If the product owner
   wants product-creation surfaced as its own explicit step (e.g. a naming gate), that
   is a flow change owed here — but note it would add friction to the seven-minute line.
