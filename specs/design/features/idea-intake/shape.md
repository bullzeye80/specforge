---
version: "2"
feature: "idea-intake"
appetite: "small"
problem: "The Setup stage runs the seven-minute clock, and the journey has ruled that there is exactly one on-line step here: getting the founder's fuzzy idea into the product. Anything else on this step — profile, workspace naming, plan selection, a concept-teaching wizard — pushes the clock over budget and loses to the habit of just prompting Claude. The intake must accept a genuinely fuzzy idea in the user's own words and turn it into a product to shape, without authoring the user's Layer B for them."
intended-outcome: "A signed-up founder describes or pastes their fuzzy idea in one step, and a product is created from their own words — moving them directly toward the anchor result where First Strike fires. No profile, no plan, no tour in between."
target-stage: "setup"
target-milestone: "onboarding"
no-gos:
  - "A multi-step wizard that teaches PLG concepts in isolation — show real work, not an abstract tour"
  - "Required profile / workspace / plan fields on this step — all deferred off the Straight-Line to post-First-Strike"
  - "Auto-filling unknowns with plausible-sounding defaults — the agent guides, it does not author Layer B"
  - "A blank canvas with no prompt — the empty state carries one clear CTA and an example of the fuzzy input expected"
rabbit-holes:
  - "Over-structuring the input — forcing the user to pre-classify or template their idea instead of accepting free text and shaping it downstream"
  - "Sample-idea / template pickers becoming a decision point on the clock — ship one sensible default, defer the rest"
  - "Trying to validate or critique the idea at intake — capture first; discipline is applied in anchor-shaping, not here"
---

## Solution sketch

A single Setup-stage surface — Describe your idea (`/start`) — that is the **one
on-line step** between sign-up and First Strike. Structurally it is a low-friction
capture: a free-text intake (typed or pasted) that accepts a genuinely fuzzy idea
in the founder's own words, sensible **defaults over choices** everywhere a choice
could sit, and one clear primary action that creates the product and moves forward.

The domain shape is small and deliberate: the intake produces an
`object:shaping.idea-seed` (the raw fuzzy input) and creates the
`object:shaping.product`, then redirects to `shape/anchor-result` where the skeleton
anchor is generated and First Strike fires. This step **does not generate** the
anchor itself — it captures the seed and hands off; generation and the aha belong to
`anchor-shaping`. Keeping that boundary crisp is what lets this step stay under a
minute of the seven-minute budget.

Two disciplines govern the copy and the empty state. First, the empty state's job is
the *next step*, not entertainment — it shows one CTA and an example of the kind of
fuzzy input specforge expects, so the founder isn't staring at a blank box. Second,
where the idea is genuinely thin, the product records the gap as an open question
downstream rather than inventing a plausible answer — the intake never fabricates
detail the user didn't give.

The strongest version of this feature is almost invisible: paste, submit, see the
anchor. Anything that turns intake into a form or a tutorial is scope this pitch
explicitly refuses.

## Open questions

1. **How much guidance the input offers.** A single prompt vs. a few gentle
   prompts (who's it for / what's the job) is a design decision for `plg-flow` — it
   must guide without tipping into a wizard or authoring the user's answers.
2. **Handling a too-thin idea.** If the seed is so sparse the skeleton can't be
   shaped, whether to prompt for one more sentence inline or generate-with-gaps and
   surface open questions is owed to the flow phase.
