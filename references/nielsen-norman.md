---
file: references/nielsen-norman.md
purpose: Nielsen's 10 usability heuristics and Norman's 7 stages of action — the critique pass.
load-when: plg-critique (always at screen scope), plg-build (advisory — to avoid producing high-fi that will fail critique).
last-updated: 2026-04-28
---

# Nielsen-Norman — the critique pass

This file is the **standardised UX critique layer**. Where the rest of Layer A defines *what to design*, this file defines *what to check*. Nielsen's 10 usability heuristics give us a shared vocabulary for usability findings; Norman's 7 stages of action give us a diagnostic frame for *why* a usability finding is a finding.

The agent uses both. Nielsen for the *what*; Norman for the *why*.

Use this reference when:

- Running `plg-critique`'s surface-pass on any high-fi artifact
- Authoring `plg-build` output (advisory — the agent's own work should pass these heuristics before being emitted)
- Diagnosing why a flow has unexpected drop-off when `bj-fogg.md`'s M-A-P diagnostic doesn't yield a clear answer (Norman's stages give a finer-grained diagnostic)

Source: Jakob Nielsen, "10 Usability Heuristics for User Interface Design" (1994, refined since); Donald Norman, *The Design of Everyday Things*. Compressed and adapted.

---

## Nielsen's 10 heuristics, applied

The heuristics in their original form are 30 years old; the wording has aged but the substance hasn't. The agent applies each one as a *check question* against any high-fi artifact.

### 1. Visibility of system status

**Check:** Does the user always know what's happening?

What this means in practice:
- Loading states are visible (per Erik's screen states taxonomy in `erik-kennedy.md`)
- The user's progress through multi-step flows is shown
- Background processes communicate completion or failure
- The current state of toggles, filters, and modes is unambiguous

Failures the agent looks for:
- Buttons that initiate long operations without loading states
- Forms that submit without success/failure feedback
- Filtered or sorted views without indication of the active filter/sort
- "Saved" indicators that don't actually confirm the save

### 2. Match between system and the real world

**Check:** Does the UI use words and concepts the user already knows?

What this means in practice:
- Domain language matches the user's mental model from `product.md`'s `ideal-user`
- Affordances behave the way real-world conventions suggest
- Information is presented in a natural order
- Numbers, dates, and units use locale-appropriate formats

Failures the agent looks for:
- System-internal jargon ("entity," "instance," "record") instead of domain terms
- Date formats that don't match the user's locale
- Counterintuitive ordering (newest-first vs oldest-first inconsistently)
- Icons whose meaning is internal to the product (per Erik's "no unlabelled icons" rule)

### 3. User control and freedom

**Check:** Can the user undo or escape from any state?

What this means in practice:
- Destructive actions are reversible or have explicit confirmation (per `personal-anti-patterns.md` and the domain model's `destructive` flag)
- Multi-step flows allow back-navigation
- Modals can be dismissed
- The user is never trapped in a state with no exit

Failures the agent looks for:
- "Are you sure?" loops with no way out other than completing the action (per `personal-anti-patterns.md`)
- Forms that lose data on accidental navigation
- Modals without a close button or escape key
- Cancellation flows that require support contact (per `personal-anti-patterns.md`)

### 4. Consistency and standards

**Check:** Are similar things handled similarly across the product?

What this means in practice:
- Component reuse from `_shared/components.md` (per `atomic-design.md`)
- Consistent placement of primary actions
- Consistent terminology across screens
- Consistency with platform conventions (Jakob's Law)

Failures the agent looks for:
- Two screens that do the same thing with different UI patterns
- Save/cancel button order varying between forms
- Different terminology for the same concept ("project" vs "workspace" vs "team" interchangeably)
- Per Erik's "no inconsistency without reason" — every deviation needs a documented justification

### 5. Error prevention

**Check:** Is the design preventing errors before they happen?

What this means in practice:
- Confirmation for destructive actions
- Constrained inputs (date pickers, dropdowns) where free-text would invite errors
- Validation as the user types, not after submit
- Clear visual distinction between primary and destructive actions

Failures the agent looks for:
- Free-text inputs where a controlled vocabulary exists
- Validation only at submit time
- Destructive actions with the same visual treatment as primary actions
- Missing confirmations on irreversible operations

### 6. Recognition rather than recall

**Check:** Is the user looking at options, or remembering them?

What this means in practice:
- Available actions are visible, not hidden behind unlabelled icons
- Field labels are persistent, not ghost-text-only
- Recently used items are surfaced
- Search is supported alongside hierarchical navigation

Failures the agent looks for:
- Critical actions hidden in three-dot menus on default view
- Form fields with placeholder-only labels (label disappears on focus)
- Required information the user has to remember from a previous step
- Per Erik's "no unlabelled icons" — same heuristic, different angle

### 7. Flexibility and efficiency of use

**Check:** Can power users move faster than novices?

What this means in practice:
- Keyboard shortcuts for common actions
- Bulk operations on lists
- Saved views, filters, or templates
- Command palettes or quick-actions

What the agent should *not* over-apply: per `personal-anti-patterns.md`'s decision-relief frame and the configuration-vs-convention rule, the agent doesn't add advanced options pre-emptively. Power features earn their place through observed use.

Failures the agent looks for:
- Multi-item operations requiring per-item action
- No keyboard support for primary actions
- Power users forced through novice flows

### 8. Aesthetic and minimalist design

**Check:** Does every element earn its place?

What this means in practice:
- Per `personal-anti-patterns.md`: no decoration for decoration's sake
- Per Erik's "no extra colours," "no chart junk": every element conveys information
- Per the decision-relief frame: every choice is justified
- Visual weight matches functional importance (per `low-fi.json`'s information hierarchy)

Failures the agent looks for:
- Decorative imagery without informational role
- Tooltips that explain what the visible label already says
- Multiple competing primary actions on one screen
- Visual emphasis on tertiary content

### 9. Help users recognise, diagnose, and recover from errors

**Check:** When things go wrong, does the UI help?

What this means in practice:
- Error messages are specific (not "an error occurred")
- Errors point to the field or action that failed
- Recovery paths are surfaced inline ("retry," "edit and resubmit," "contact support if this persists")
- Per Erik's screen states taxonomy: error states are designed, not afterthoughts

Failures the agent looks for:
- Generic error messages
- Errors shown out of context (a banner at the top of the page about a field at the bottom)
- Errors with no recovery path
- Validation errors that disappear before the user can read them

### 10. Help and documentation

**Check:** Is help available where it's needed?

What this means in practice:
- Contextual help inline at the moment it's needed
- Documentation searchable and findable from anywhere
- Help is concise and goal-directed (the user wants to do X)
- The product is usable without help for the common path

What the agent should *not* over-apply: a product that requires extensive help to do basic things has a design problem, not a documentation problem. Per `bj-fogg.md`, adding documentation is the wrong fix for an ability problem — fix the ability problem in the design instead.

---

## Norman's 7 stages of action — the diagnostic frame

When the agent finds a usability finding, *why* is the user struggling? Norman's stages give a finer-grained diagnostic than B = MAP.

The seven stages:

| Stage | Question the user is implicitly asking | Failure mode |
|---|---|---|
| 1. **Goal** | What do I want to happen? | The user doesn't know what's possible — the product hasn't shown its capabilities |
| 2. **Plan** | What should I do? | The user has a goal but doesn't see a path to it |
| 3. **Specify** | How exactly do I do it? | The user has a plan but can't translate it into actions on this UI |
| 4. **Perform** | Do the action | The action itself is hard to perform (target too small, gesture too complex) |
| 5. **Perceive** | What happened? | The system's response isn't visible (visibility-of-system-status failure) |
| 6. **Interpret** | What does that mean? | The user sees a result but can't tell whether it succeeded |
| 7. **Compare** | Did that match what I wanted? | The user can tell what happened but can't tell if it served their goal |

The cycle: stages 1–4 are the *gulf of execution* (going from goal to action). Stages 5–7 are the *gulf of evaluation* (going from outcome back to goal).

**Why the agent uses this:** B = MAP from `bj-fogg.md` diagnoses friction at one of three layers. Norman's stages diagnose friction at one of seven layers. When B = MAP says "ability problem," Norman's stages can tell you *which kind* — Plan-stage (the user can't see how), Specify-stage (the user can't see exactly what to click), Perform-stage (the click target is wrong size).

The agent uses Norman's stages when M-A-P doesn't yield a clear intervention. It's the second-pass diagnostic, not the first.

---

## How the heuristics map to schema critique

Per `plg-critique`'s surface-pass at screen scope, the agent runs the 10 heuristics as a checklist. Each finding has:

- The heuristic violated
- The element/region where the violation occurs (referenced by ID from the screen artifact)
- Severity (`blocker | major | minor`)
- Recommended fix

The mapping:

| Heuristic | Severity if violated |
|---|---|
| 1. System status | Major (loading states or blocker (no feedback on destructive action) |
| 2. Real-world match | Minor unless jargon is in primary CTA (then major) |
| 3. User control | Blocker if destructive action is irreversible without confirmation; major otherwise |
| 4. Consistency | Major (most consistency findings) |
| 5. Error prevention | Blocker for destructive actions; major otherwise |
| 6. Recognition over recall | Minor unless critical actions are hidden (then major) |
| 7. Flexibility | Minor (rare blocker) |
| 8. Minimalist design | Minor (informational; aggregate findings into a "simplicity pass") |
| 9. Error recovery | Major if recovery is impossible; minor if just unclear |
| 10. Help and docs | Minor; if violated heavily, may indicate underlying design problem (escalate) |

These severities are defaults; the agent can override with rationale.

---

## What this means for the artifact schema

Direct mappings:

- `critique.md` is structured to surface findings against these heuristics. The `findings` array's `levels.surface` field aggregates Nielsen-violation findings.
- Every finding cites the specific heuristic violated by name.
- `low-fi.json`'s `states` array (with Erik's taxonomy) directly enables the Visibility of System Status check (heuristic 1).
- `domain-map.json`'s `destructive` and Erik's checklist fields enable the User Control + Error Prevention checks (heuristics 3 and 5).
- `_shared/components.md` consistency directly enables the Consistency check (heuristic 4).

---

## What Nielsen-Norman doesn't cover

Three things this reference deliberately doesn't address. The agent covers them from elsewhere:

1. **Strategic correctness.** The heuristics check whether a UI is *usable*, not whether the right thing is being designed. That's `prod-led-foundations.md` (does the design serve First Strike?), `eureka.md` (is the Straight-Line discipline applied?), `moat.md` (is the model right?).
2. **Aesthetic correctness.** The heuristics check whether the UI *works*, not whether it looks right. That's `personal-anti-patterns.md` and (when authored) `_shared/aesthetic.md` per the OD-derived `DESIGN.md` schema.
3. **Domain correctness.** The heuristics don't check whether the right objects, actions, or relationships exist. That's `domain.md`.

The agent runs Nielsen-Norman as one of three critique passes (`plg-critique` runs IA, IH, surface, and funnel checks per the schema). Nielsen-Norman is the surface check.

---

## A note on the limitations

The 10 heuristics are useful but blunt. Some honest acknowledgments:

- They're consensus-based, not measured. A heuristic violation is a *candidate* finding, not necessarily a real problem.
- They're written for traditional GUIs. Conversational, voice, and AR/VR surfaces stress them in ways the original framing doesn't anticipate.
- They can't substitute for actual user testing. The agent's findings are predictions; they should be verified against real users when possible.

The agent treats the heuristics as a useful first-pass critique, not as ground truth. When findings disagree with observed user behaviour, observed user behaviour wins.
