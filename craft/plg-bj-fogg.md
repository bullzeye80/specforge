# BJ Fogg's behaviour model

This is the *why* under every intervention specforge specifies. The active
`DESIGN.md` decides *how* an intervention looks and sounds; this file decides
*what* has to be true for a target behaviour to happen at all — and, when it
doesn't, *which* of three factors is missing. Where `plg-eureka` supplies the
library of bumpers and `plg-foundations` fixes the milestones those bumpers
serve, this file is the diagnostic that picks the right bumper for a given
drop-off. It is the agent-facing distillation the `plg-shape` and `plg-flow`
skills load whole; `plg-critique` runs its M-A-P diagnostic on every drop-off
candidate.

> Adapted from `references/bj-fogg.md` (BJ Fogg, *Tiny Habits* / the Stanford
> Behavior Design lab). Compressed and tied to specforge's artifact schema.

## The model — B = MAP

A behaviour happens only when three factors clear the action threshold **at the
same moment**. Miss one and the behaviour doesn't fire.

**B = M × A × P** — Behaviour = Motivation × Ability × Prompt. It's a product,
not a sum: a zero on any factor zeroes the behaviour.

| Factor | Question | Missing when |
|---|---|---|
| **Motivation** | Does the user *want* to? | No perceived value, no trust, competing pull |
| **Ability** | *Can* they do it easily, now? | Doesn't know how, takes too long, too much thought, hard barrier |
| **Prompt** | Are they told *now* is the time? | M and A are present but no trigger fires |

The action line is a curve: higher motivation makes harder actions doable;
higher ability makes lower-motivation actions doable. The prompt only *fires*
the action if the M × A point already sits above the line.

## The M-A-P diagnostic

For any drop-off point on the Straight-Line, the agent runs one question —
**which of M, A, or P is the missing factor?** — in this fixed order. The order
is the discipline: ability is cheapest to fix, prompt presupposes the other two.

1. **Could a competent, motivated user finish this step in under ~10 seconds?**
   No → **ability problem.** Yes → continue.
2. **Does the user know *why* they should do this step?**
   No → **motivation problem.** Yes → continue.
3. **Does the user even know *now* is the moment?**
   No → **prompt problem.** Yes → re-examine — the drop-off may be intentional,
   and the fix is to **delete the step**, not intervene.

**Raising ability usually beats pumping motivation.** Motivation is expensive,
fickle, and decays; friction removed stays removed. When a step is hard *and*
unmotivating, cut the friction first and re-measure before touching copy. The
most common failure is diagnosing an ability problem as a motivation problem and
answering a hard step with more persuasive words.

- **Schema hook:** every `straight-line.md` drop-off candidate is diagnosed as
  exactly one of M / A / P, and the proposed bumper must address *that* factor.
  A motivation-diagnosed drop-off answered with a tooltip (an ability
  intervention) is a mismatch `plg-critique` flags as a `warn`.

## When ability is missing (most common)

The user wants it; they just can't, or it's too hard. The dominant axes in
software are **time** and **mental effort** (the full six — time, money,
physical effort, mental effort, social deviance, routine — are in the source).

Reach for, in order of preference:

- **Remove the step or field.** Every field justifies its existence; optional
  fields are gone by default.
- **Sensible defaults over choices**, so the user decides nothing they don't
  have to.
- **Empty states with one clear CTA**, not a blank canvas.
- **Templates, pre-filled data, progressive disclosure, visual cues** to the
  next action.

Ability *is* friction. The concrete friction rules — the Straight-Line
discipline, step-counting, the 7-minute budget — live in `plg-eureka`; this file
supplies the diagnosis, `plg-eureka` supplies the reduction technique. Don't
duplicate them here.

**Do not**, for an ability problem:

- Add explaining text — text is mental effort; make the action easier instead.
- Add a video tutorial — a tutorial is an unsolved ability problem, admitted.
- Bolt on a "need help?" chatbot as the primary fix — an escape valve for a step
  that should have been redesigned.

## When motivation is missing

The user *can* do it; they don't *want* to. A simpler version of an
unmotivating action doesn't help. Three sub-types: doesn't see the value,
doesn't trust the result, has a competing priority.

Reach for:

- **Speak to outcomes, not features** — checked against `product.md`'s JTBD.
- **Show progress** (Zeigarnik): partial-completion indicators, "almost there".
- **Preview the outcome** before the work — demo data, sample output, preview
  modes.
- **Celebrate the win** when a user nears First Strike (see `plg-foundations`) —
  constrained by the motion rules, not a multi-second hero animation.
- **Social proof only when true and specific.**

**Do not:** paper over it with reassurance text ("this only takes a minute" — an
admission it isn't motivating), fake urgency/scarcity, or extrinsic bribes
(unlock-credits, discount-for-profile) that build transactional motivation which
doesn't sustain.

## When a prompt is warranted — and when it's nagging

The user has M and A but isn't being told *now* is the time. This is where
behaviour-triggered nudges belong — and where nagging is born. A prompt is only
legitimate once M and A are established; a prompt aimed at a motivation or
ability gap is nagging by construction.

A specified prompt must be **all five**:

| Discipline | Right shape | Wrong shape (nagging) |
|---|---|---|
| Behaviour-triggered, not time-triggered | "stalled at step 4 for 24 h" | "Friday 9am", weekly digest |
| Tied to a specific drop-off | brings user to the *next* Straight-Line step | "come back to the product" |
| Personalised to progress | 80%-done ≠ never-returned | one blast for everyone |
| Single-purpose | one CTA, one action | multiple asks stacked |
| Reiterates value | names the outcome | "you have updates" |

The **feedback** the user gets *after* performing the prompted behaviour is what
reinforces it — and it lives in the schema, not just in copy.

- **Schema hook — the prompt itself:** an external behaviour-triggered nudge is
  a domain `event` in `domain-map.json` whose `consumed-by` names a
  `behaviour-trigger:*` consumer (e.g. `event:collaboration.project-created`
  consumed by `behaviour-trigger:welcome-email`). A prompt with no originating
  event, or one wired to a clock rather than an event, is the smell.
- **Schema hook — the reinforcement:** the action's `feedback-on-success` /
  `feedback-on-failure` in `domain-map.json` is the product's response to the
  prompted behaviour. Every `kind: command` action that a prompt drives toward
  should have both populated (`toast`, `inline-error`, …); a silent success is a
  behaviour left un-reinforced.
- **Schema hook — where it lands:** an in-product prompt is placed via
  `low-fi.json` — as a `partial` state (`creating-first-item`,
  `incentivising-further`), a `blank` state's CTA, or a `behaviour-notes` entry
  fixing where and when it appears. The prompt is not free-floating; it has a
  screen state.
- **Cross-ref:** the delivery split — Conversational Bumpers (email/push) vs
  Product Bumpers (in-app) — and the rule that both are **Showcase-stage** tools
  (never Search or Setup) live in `plg-eureka`. Reference, don't restate.

**Do not:** send time-scheduled emails (that's content marketing, not a prompt),
aggregate prompts into a notification centre, or use a prompt to compensate for
an M or A gap.

## How this maps to the artifact tree

| Artifact / field | This file governs |
|---|---|
| `straight-line.md` drop-off candidates | Each diagnosed as exactly one of M / A / P; bumper must match |
| `domain-map.json` `events[].consumed-by` | A `behaviour-trigger:*` consumer *is* an external prompt |
| `domain-map.json` action `feedback-on-success` / `-on-failure` | The reinforcement response to a prompted behaviour |
| `low-fi.json` `states` (`partial`, `blank`) + `behaviour-notes` | Where/when an in-UI prompt appears |
| `wireframe.json` `contains[].text-intent` | Whether copy is solving M (value), A (instruction), or P (prompt) — different rules apply |

`plg-critique` runs the M-A-P diagnostic on every drop-off and emits a `warn`
when the bumper's factor doesn't match the diagnosed factor.

## Limits of the model *(guidance, not auto-checked)*

B = MAP is the *first* lens, not the only one. It doesn't model emotional state
(an angry user isn't moved by a better prompt), it assumes the user is at a
moment where any of the three matter, and it's individual-scale, not
team/network-scale. When it doesn't yield a clear answer, question whether the
flow solves the right problem — don't apply B = MAP harder.

## Common mistakes (lint these)

- A drop-off candidate not diagnosed as M, A, or P — or diagnosed as one and
  answered with a bumper for another (motivation problem "fixed" with a tooltip;
  ability problem "fixed" with persuasive copy).
- Answering an ability problem with explaining text, a video tutorial, or a
  help-widget instead of removing the friction.
- Pumping motivation on a step whose real problem is friction — copy where a cut
  field was the fix.
- A prompt aimed at an M or A gap (nagging) rather than a genuine
  present-M-and-A-but-no-trigger gap.
- A prompt that is time-triggered, generic ("come back"), multi-CTA, or omits
  the outcome — failing one of the five prompt disciplines.
- An external prompt with no originating `event` in `domain-map.json`, or wired
  to a clock instead of a `behaviour-trigger:*` `consumed-by`.
- A `kind: command` action a prompt drives toward with empty
  `feedback-on-success` / `feedback-on-failure` — behaviour left un-reinforced.
- An in-product prompt with no home state in `low-fi.json` (no `partial`/`blank`
  state or `behaviour-notes` placement).
- Bumpers placed in Search or Setup rather than Showcase (owned by
  `plg-eureka`, caught here when the diagnosis pretends the stage is right).
