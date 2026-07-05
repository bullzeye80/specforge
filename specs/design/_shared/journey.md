---
version: "2"
first-strike:
  description: "The first time a fuzzy idea becomes a structured spec — a skeleton product.md (name, ideal user, job, first-cut MOAT) is generated and viewable. The aha is seeing the vague idea come back as a disciplined anchor, not signing up or finishing onboarding."
  measurable-as: "event:shaping.artifact-generated fires for the first time (the artifact being the skeleton product.md)"
  appears-in: "screen:shape/anchor-result"
kui:
  description: "The habit signal — the founder keeps turning ideas and features into structured spec artifacts: advancing one product's tree (journey, sitemap, flows) and/or shaping new products. First Strike repeated with frequency and persistence."
  measurable-as: "event:shaping.artifact-generated × 5 in 7-days"
pai:
  description: "The single repeated activity that predicts retention: generating a spec artifact (an anchor, a journey, a feature shape, a flow) at least once on a given day."
  measurable-as: "event:shaping.artifact-generated × 1 in any-day"
  characteristics:
    leading-indicator: "A founder who generates a spec artifact on a given day is actively investing in a buildable tree; daily artifact generation precedes and predicts week-4 retention before retention itself can be measured."
    repetitive: true
    tied-to-outcome: "Predicts the endgame — a buildable artifact tree a coding agent ships from without a design team. Each generated artifact is a concrete step toward that spec, not a vanity action."
    easy-to-understand: "You turned something into a spec artifact today."
    time-bound: "Measured per day (any-day window); the KUI aggregates it to 5 within a rolling 7 days."
stages:
  search:
    problem-aware: "Founder realises their build is stalling because the coding agent flails on their vague prompts — the idea is real but under-specified, and re-prompting isn't closing the gap."
    active-research: "Starts looking for a way to structure the idea before handing it off — searching for spec frameworks, PLG/onboarding discipline, and comparing against screen-generators (v0/Lovable/Stitch/Figma-AI) that produce screens, not decisions."
  select:
    visit: "Lands on specforge positioned as 'turn a fuzzy idea into a buildable spec' — app-shaped, freemium hero ('Get started — free'), no demo gate."
    sign-up: "Creates an account with email / magic-link only. No card, no sales gate. Collect nothing beyond what's required to reach First Strike (per the Straight-Line)."
  setup:
    profile: "Deferred by default. Any workspace/profile detail that isn't required to shape the first anchor is a delete-or-defer candidate, moved to post-First-Strike personalisation."
    onboarding: "One real step: describe or paste the fuzzy idea. Sensible defaults over choices; specforge shapes the skeleton anchor from the user's own words rather than teaching concepts in isolation."
  showcase:
    first-strike: "see first-strike above — event:shaping.artifact-generated fires for the first time (skeleton product.md)"
    kui: "see kui above — event:shaping.artifact-generated × 5 in 7-days"
  scale:
    upgrade: "User hits the free-tier artifact meter (the value metric tied to KUI) and upgrades to keep generating — the full anchor depth, the downstream tree, and more products. Upgrade is one click, soft, at the moment the meter is reached (freemium paywall placement)."
    advance: "Grows into the Advanced level — authoring and maintaining the full multi-feature artifact tree (journey, flows, domain-map, critique): a buildable spec a coding agent runs with end to end."
---

## Narrative

The journey specforge is designed to carry is a founder moving from "my coding
agent keeps flailing on my vague idea" to "I hand it a disciplined spec and it
builds." The two Showcase milestones are the targets everything else serves, and
they are deliberately placed at the *anchor*, not deferred to the whole tree.

**Search** happens mostly outside the product. The founder becomes problem-aware
the moment they notice the build is stalling on under-specification — not on
their coding ability, but on the fuzziness of what they're asking for. Active
research pushes them toward structure; specforge's job in this stage is clarity
about the problem ("coding agents flail on vague prompts") and the reframe
("produce a disciplined spec, not another screen"), not a feature tour.

**Select** is landing → sign-up. Because the audience is bottom-up and the model
is freemium, sign-up is the lightest that still reaches First Strike: email or
magic-link, no card, no company/role/use-case fields. Every field beyond
credentials is a deferral candidate.

**Setup** runs the seven-minute clock. There is exactly one on-line step:
describe the fuzzy idea. Profile, workspace naming, team invites, and plan
selection are all off the Straight-Line and are delete-or-defer by default —
they can't be allowed to sit between sign-up and the aha. specforge shapes the
skeleton from the user's own words and guides where it's unsure; it does not
author Layer B on their behalf or fill gaps with plausible defaults.

**Showcase** is the heart. **First Strike** is the first time the fuzzy idea
comes back as a structured skeleton `product.md` — modelled as the first firing
of `event:shaping.artifact-generated`, landing on the anchor-result screen. It is the
*same* First Strike `product.md` names (skeleton anchor in under seven minutes),
now expressed as a discrete measurable event rather than a feeling or a
sign-up. The **PAI** — the leading indicator between the one-time First Strike
and the habit threshold — is generating any spec artifact on a given day
(`event:shaping.artifact-generated × 1 in any-day`). The **KUI** is that same event repeated to
a habit: `event:shaping.artifact-generated × 5 in 7-days`. All three ride the one core domain
event, so PAI and KUI never drift apart.

The KUI is also the **freemium value metric** — the meter the free tier gates on.
This closes the foundation check `product.md` deferred here: the pricing value
metric and the KUI are the *same thing* (spec artifacts generated), not two
different metrics. The free tier delivers the Beginner outcome (a founder reaches
First Strike and generates real artifacts without paying); pricing kicks in at
the artifact meter tied to KUI, never by fencing off a feature.

**Scale** is Upgrade → Advance. The upgrade surface appears at the moment the
user hits the artifact meter — soft, single-click, symmetric to how they signed
up — and carries them into the full-depth anchor, the downstream tree, and more
products. Advance is the stated endgame: the full multi-feature artifact tree a
coding agent ships from without a design team.

### Failure modes this journey must defend against

- **First Strike measured as sign-up or "feels productive."** It is neither: it
  is the first firing of `event:shaping.artifact-generated`. If the skeleton anchor never fires,
  the user has not experienced core value regardless of how far they got.
- **Setup friction before the aha.** Asking for profile / team / plan before the
  idea is shaped pushes the seven-minute clock over budget and loses to the
  habit (prompting Claude directly). The Straight-Line stays down to one step.
- **Losing to the incumbent habit.** The alternative is free and instant. If the
  first skeleton isn't both faster than re-prompting *and* visibly more
  disciplined, the user reverts. Speed and discipline are the wedge, together.
- **Authoring the user's Layer B.** Filling unknowns with plausible-sounding
  defaults produces a confident-but-wrong anchor that erodes the exact trust the
  discipline is selling. Unknowns surface as open questions, not placeholders.
- **A KUI the founder can't see.** Users churn when they can't see what they've
  gotten out of the product; the Showcase and Scale surfaces must make the
  growing artifact tree visible, or the habit doesn't take.

## Open questions

The First Strike, KUI, PAI, and the KUI == value-metric check are all set. The
residual decisions below are v1 hypotheses or genuinely open — they belong to the
product owner and to later skills, and are recorded here rather than guessed at.

1. **KUI count and window are a v1 hypothesis.** `× 5 in 7-days` is a defensible
   starting number, not a measured one (per `plg-foundations`). It should be
   refined against real activation/retention data once instrumented.
2. **Is the core event artifact *generation* or artifact *handoff*?** The chosen
   KUI/PAI event is `event:shaping.artifact-generated` — the instrumentable leading indicator.
   The truer outcome is a spec that a coding agent actually builds from, which is
   lagging and partly external. If a handoff/export event can be instrumented,
   the owner should decide whether the value metric shifts to it.
3. **First Strike screen ref is forward-looking.** `screen:shape/anchor-result`
   names where First Strike lands, but the sitemap and per-feature screens are a
   later plg-shape pass; the exact screen slug is confirmed when the sitemap is
   authored.
4. **Free-tier meter shape.** The KUI is the value metric, but the exact free
   allowance (how many artifacts before the meter trips, and whether it resets
   per period) is a pricing decision owed by the owner when the pricing surface
   is designed.
