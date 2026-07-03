---
file: references/bj-fogg.md
purpose: BJ Fogg's behaviour model. The theoretical layer under EUREKA's bumper choices and any other intervention.
load-when: plg-flow (always when designing interventions), plg-critique (always when checking interventions exist for friction points).
last-updated: 2026-04-27
---

# BJ Fogg's behaviour model

This file is the **why** behind every intervention. EUREKA tells you *which* bumpers exist; this file tells you *why* one bumper is right and another is wrong for a given problem.

The model is a single equation: **B = MAP**.

Behaviour happens when **M**otivation, **A**bility, and a **P**rompt are simultaneously above the action threshold. If any one is missing, behaviour doesn't happen.

This is the operative theory the agent uses to diagnose friction points in any flow.

Use this reference when:

- Authoring `straight-line.md`'s drop-off candidates (each drop-off is diagnosed as M, A, or P)
- Choosing bumpers from the EUREKA library (the diagnosis dictates the bumper)
- Running `plg-critique` on flows (every friction point is checked against M, A, P)
- Authoring copy and microcopy (the model also governs how words motivate or demotivate)

Source: BJ Fogg, *Tiny Habits* and the Stanford Behavior Design lab. Compressed and applied to PLG product design.

---

## The model

For any behaviour to happen, three things must be true at the same moment:

| Element | Question | What's missing if low |
|---|---|---|
| **Motivation** | Does the user *want* to do this? | The user doesn't see the value, doesn't trust the product, doesn't believe it'll work, or has competing motivations |
| **Ability** | *Can* the user do this easily? | The user doesn't know how, the action takes too long, requires too much thought, or hits a hard barrier |
| **Prompt** | Is the user being told *now* is the time? | The user has motivation and ability but no trigger fires |

The action line is a curve. Higher motivation makes harder actions doable. Higher ability makes lower-motivation actions doable. The prompt is the trigger that *fires* the action — but only if the M × A point is above the line at that moment.

**The agent's diagnostic question for any drop-off point: which one of M, A, or P is missing?**

That single question determines the intervention.

---

## When ability is missing

Ability problems are the most common cause of drop-off. The user *wants* to do the thing; they just can't, or it's too hard.

Six dimensions of ability (from Fogg, simplified):

1. **Time** — does the user have time to do this now?
2. **Money** — does it cost them anything?
3. **Physical effort** — how much physical action is required?
4. **Mental effort** — how much do they have to think?
5. **Social deviance** — does this go against social norms or expectations?
6. **Routine** — does this fit into their existing flow, or interrupt it?

For software, the dominant axes are usually **time** and **mental effort**. The agent's job is to reduce both.

### Interventions that increase ability

When the diagnosis is "ability is low," the agent reaches for:

- **Reduce form fields.** Every field has to justify its existence. Optional fields are removed by default.
- **Provide sensible defaults** so the user doesn't have to decide. (Per `personal-anti-patterns.md`'s decision-relief frame.)
- **Empty states with clear CTAs.** Don't show a blank canvas; show the next action.
- **Templates and cheat sheets.** The user shouldn't have to start from scratch.
- **Visual cues** — arrows, hotspots, contrast — to direct attention to the next step.
- **Progressive disclosure.** Hide what isn't needed yet.
- **Pre-filled data** where possible. (Subject to privacy rules — never pre-fill across users or sessions in ways that surprise.)
- **Fewer decisions.** Per the decision-relief frame, the agent removes choices that don't have to be choices.

### What *not* to do for ability problems

- **Don't add more text explaining how to do it.** Text is mental effort. The right answer is to make the action easier, not to explain the harder version.
- **Don't add a video tutorial.** Same reason. Tutorials are a sign of an ability problem the agent failed to solve.
- **Don't add a chatbot or "need help?" widget as a primary fix.** These are escape valves for unsolvable ability problems. If the agent reaches for one, it should also redesign the underlying step.

---

## When motivation is missing

Motivation problems are usually mistaken for ability problems. The user *can* do the thing; they don't *want* to. Designing a simpler version of an unmotivating action doesn't help.

Three sub-types:

1. **The user doesn't see the value** — they don't know why this matters
2. **The user doesn't trust the product** — they're not sure the action will produce the result
3. **The user has competing motivations** — something else is more important right now

### Interventions that increase motivation

When the diagnosis is "motivation is low," the agent reaches for:

- **Speak to desires, not features.** "Get your taxes filed in 10 minutes" beats "Tax filing software with 15 forms supported." (Always check copy against the JTBD in `product.md`.)
- **Show progress.** The Zeigarnik effect: people are motivated to complete what they've started. Progress bars, partial completion indicators, "you're almost there" copy.
- **Welcome new users.** Acknowledgment is motivation. A welcome message that names the user and the product is small but real.
- **Celebrate wins.** When the user does something that moves them toward First Strike, mark it. Toast, animation, copy. (Constrained by `personal-anti-patterns.md`'s motion rules — celebration is not a multi-second hero animation.)
- **Social proof, used carefully.** "Join 10,000 teams" works when true and relevant. It's a smell when it's vague or fabricated.
- **Outcome previews.** Show the user what they'll get *before* they have to do the work. Demo data, sample reports, preview modes.

### What *not* to do for motivation problems

- **Don't add reassurance text everywhere.** "Don't worry, this will only take a minute" is not motivating. It's an admission the action isn't motivating on its own.
- **Don't use fake urgency or scarcity.** "Only 3 spots left!" when there isn't a real cap. (Per `personal-anti-patterns.md`'s dark patterns rules.)
- **Don't bribe with rewards extrinsic to the product.** Discount codes, "complete your profile to unlock 100 credits" — these create transactional motivation that doesn't sustain.

---

## When the prompt is missing

The user has motivation and ability. They just aren't being told *now* is the time.

This is where most behaviour-triggered emails and notifications belong. The user has signed up, signed in, gotten partway through a task, and then... nothing. They left the screen. Their attention is elsewhere. They need a *prompt* to come back.

### Two kinds of prompts

1. **Internal prompts** — something the user already does triggers them to come back to the product. (A user who checks their inbox every morning has an internal prompt that includes the email from your product.)
2. **External prompts** — your product sends them a message that pulls them back.

Internal prompts are stronger but slower to develop. External prompts are immediate but burn attention.

### The discipline for prompts

Every prompt the agent specifies must be:

- **Behaviour-triggered, not time-triggered.** "User stalled at step 4 for 24 hours" is the right shape. "Friday morning" is the wrong shape.
- **Tied to a specific drop-off point.** The prompt brings the user back to the *next step on the Straight-Line*, not to a generic "come back to the product."
- **Personalised to the user's progress.** A user who got 80% through onboarding gets a different prompt than one who never returned after sign-up.
- **Single-purpose.** One prompt, one action. The email or notification has one CTA.
- **Reiterates value.** Why is the user supposed to come back? The prompt names the outcome.

### Interventions when the prompt is missing

- **Behaviour-triggered emails** tied to specific drop-off points (per `eureka.md`'s Conversational Bumpers)
- **Push notifications** for time-sensitive moments (a result is ready, someone took an action that requires response)
- **In-product prompts on next entry** — the next time the user opens the product, a contextual prompt picks up where they left off
- **Calendar invites** for genuinely time-bound events the user opted into

### What *not* to do for prompt problems

- **Don't send time-based scheduled emails.** Weekly digests, monthly newsletters — these aren't prompts, they're content marketing.
- **Don't aggregate prompts into a notification centre.** (Per `personal-anti-patterns.md`'s rejection of notification centres.)
- **Don't use prompts to compensate for motivation or ability problems.** A user who didn't understand step 4 doesn't need a reminder; they need a redesign of step 4.

---

## The diagnostic flow

When the agent finds a drop-off point in any flow, it runs through the diagnostic in this order:

1. **Could a competent, motivated user complete this step in under 10 seconds?**
   - No → it's an ability problem
   - Yes → continue

2. **Does the user know why they should do this step?**
   - No → it's a motivation problem
   - Yes → continue

3. **Does the user even know they should be doing this step right now?**
   - No → it's a prompt problem
   - Yes → re-examine; the drop-off may be intentional (the user genuinely doesn't want this) and the right answer is to delete the step

The order matters. Ability is the cheapest to fix; the agent always checks ability first. Motivation is harder. Prompt is last because it presupposes M and A are already in place.

---

## How this applies to copy

The B = MAP model is also a copy framework.

**For ability:** copy reduces mental effort. Short sentences, plain language, concrete nouns and verbs. No hedging. No corporate voice. Per `personal-anti-patterns.md`, the agent never produces copy that:

- Uses passive voice when active would do
- Says "simply" or "just" (these are signals the action isn't simple)
- Apologises for the product
- Explains how to use the action instead of describing what it does

**For motivation:** copy speaks to outcomes. The user's outcomes, not the product's features. Per `personal-anti-patterns.md`, the agent never produces copy that:

- Leads with the product name as the subject
- Uses the word "powerful" without specifying what power
- Promises "everything you need" (specifies what)
- Describes capabilities the user can't experience until later

**For prompts:** copy is single-purpose and specific. The CTA names the action and the outcome. Per `personal-anti-patterns.md`, the agent never produces copy that:

- Uses generic CTAs ("Submit," "Continue," "Click here")
- Asks the user to "learn more" without specifying what they'll learn
- Buries the action in supporting text

---

## What this means for the artifact schema

Direct mappings:

- `straight-line.md`'s drop-off candidates section requires each drop-off to be diagnosed as one of M, A, or P. The proposed bumper must address that specific element.
- `wireframe.json`'s `contains[].text-intent` should reflect whether the text is solving M (motivation copy), A (instructional copy), or P (prompt copy). Different text intents have different rules.
- `low-fi.json`'s `behaviour-notes` includes any motivation or ability concerns specific to that screen.
- `plg-critique` runs the M-A-P diagnostic on every drop-off candidate and flags ones with mismatched bumpers. Example: "drop-off candidate names this as a motivation problem but the proposed bumper is a tooltip — tooltips are an ability intervention." Becomes a `warn` finding.

---

## Limits of the model

A few honest acknowledgments about where B = MAP is incomplete:

- **It doesn't account for emotional state.** A user who's angry at the product won't be moved by a better prompt.
- **It assumes the user is at a moment where any of these matter.** A user whose problem isn't actually the one your product solves won't reach the action threshold no matter what.
- **It's individual-scale, not group-scale.** Behaviour-change in teams, organisations, or networks has additional dynamics the model doesn't capture.

The agent uses B = MAP as the *first* lens for diagnosing friction. When it doesn't yield a clear answer, the right move is to question whether the underlying flow is solving the right problem — not to apply B = MAP harder.
