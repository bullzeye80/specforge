---
file: references/erik-kennedy.md
purpose: Erik Kennedy's design canon — sizing, simplicity, screen states, color, typography. The operational rule library.
load-when: plg-flow (always at low-fi authoring), plg-build (always — this is the rules layer for composition), plg-critique (always at screen scope, especially the Simplicity and Screen States checklists).
last-updated: 2026-04-28
---

# Erik Kennedy — the operational rule library

Where the rest of Layer A is *frameworks* (PLG, EUREKA, DDD, Atomic Design), this file is *rules*. The agent uses it the way a junior designer uses a cheatsheet — to look up "what's the right line length for body text?" or "what's the algorithm for generating a darker variation of a brand color?"

This reference is the canonical, lookup-shaped source for Erik's rules. Many of these rules also appear inline in other files because they're load-bearing in those contexts; this file is what the agent consults when it needs the *exact* form of the rule.

Use this reference when:

- Authoring `low-fi.json` — sizing, density, line length, layout decisions
- Authoring `high-fi.json` — color variation generation, typography pairing, the 20 Things to No
- Authoring `_shared/tokens.json` (Layer B) — default sizing scale, color variation rules
- Running `plg-critique` — the Simplicity Pass and Screen States Pass run against this file
- Verifying any artifact passes the squint test

Source: Erik Kennedy, *Learn UI Design* cheatsheets v1.0–1.4. Compressed into agent-readable rules.

---

## The 6 Strategies of Simplicity

The most useful single page Erik produced. The agent runs these as the **Simplicity Pass** in `plg-critique` and uses them as a generative discipline in `plg-flow` and `plg-build`.

### 1. Alignment

- Every element is aligned or centred with at least one other element. No floaters.
- Body text is left-aligned. Always.
- No centred text over 2–3 lines.
- Icons are aligned by **center of pixel mass**, not bounding box.
- Padded elements are aligned by their **most visually prominent edge**, not their padding edge.
- Different-sized text is aligned by **baseline**, not center or top.

### 2. Spacing

- Whitespace is the default separator. Lines, borders, background changes, cards — all secondary.
- Whitespace highlights focal points.
- **Internal space < external space.** Spacing between elements in a group is less than the spacing around the group. This rule alone fixes 50% of bad layouts.
- Whitespace is generous. **"Double your whitespace"** is Erik's heuristic; the agent applies it as a default unless the product overrides.

### 3. Consistency

- **Consistency first.** Default to previously-used patterns before adding new ones. New components, new sizes, new colours all start by asking "do we have one of these already?"
- Every inconsistency has a documented rationale.
- **Jakob's Law.** Match other apps the user knows. If users expect a settings gear in the top-right, that's where it goes — fighting convention requires justification.
- **The squint test.** Squint at the design. Sister elements (table rows, list items, repeated cards) should be visually identical. Differences should be intentional.

### 4. Lightening

- Repeated elements (dividers, list rules, background tints) are lightened more than first instinct.
- Meta-content (timestamps, "edited by," labels showing relationships) is lightened.
- Color is used judiciously and consistently.
- The squint-test corollary: every element attracts as much attention as its importance warrants. No more, no less.

### 5. Hiding

- Infrequently-used actions go in menus or hover states.
- Essential-but-rarely-used content goes in tabs, popovers, or separate pages.
- **Progressive disclosure.** Conditionally-used elements stay hidden until the user needs them. (Example: don't show "billing address" until the user indicates it's different from shipping.)

### 6. Removing

- Unneeded elements are removed.
- Elements unneeded in this version are removed (you can add them back).
- Elements unneeded on mobile are removed from mobile (not just hidden behind toggles).

The order matters: the agent reaches for *removal* before *hiding*, hiding before *lightening*, lightening before *adding more space*. Most simplicity wins come from the bottom of the list.

**Schema field:** `low-fi.json` carries an optional `simplicity-pass` field per region or screen, mapping concerns to one of the six strategies. Populated when the agent has notable decisions in that dimension.

---

## Sizing — the canonical scale

The agent's default sizing scale (overridable in Layer B's `tokens.json`):

### The 5 main text sizes

| Type | Mobile | Desktop |
|---|---|---|
| Page title (H1) | 28–40px | 35–50px |
| Secondary header (H2) | between H1 and body, closer to body | between H1 and body, closer to body |
| Main / body / paragraph | 16–18px (interaction-heavy); 16–20px (text-heavy) | 14–20px (interaction-heavy); 18–24px (text-heavy) |
| Secondary | 2px smaller than body | 2 sizes smaller than body |
| Label | similar to body/secondary, often styled differently (weight, case) | same |

**Hard floor: never below 15px for forms.** Mobile body text at 14px or below is broken.

The cheatsheet's Typography Checklist makes this stronger: **design uses only 5 font sizes** (body, title, subheader, secondary, label) where possible. Each size needs a documented role.

### UI element size guidelines

| Element | Mobile | Desktop |
|---|---|---|
| Form control height | 44px+ (iOS), 48px+ (Android) | 32–50px |
| Primary CTA height | same as form control | up to 60px |
| Icon (square) | 20–24px | 20–24px |
| Tap target (icon) | 44px iOS / 48px Android | (keyboard/mouse — at agent's discretion) |
| Top nav | enough to contain tap targets | 50–90px |
| Logo | likely not in UI-heavy pages | legible at the size used; max 200px wide |
| Side margins | 16px | at agent's discretion |

### The 3 heuristics of sizing

1. **Consistency first.** Default to consistency until a compelling reason for inconsistency appears.
2. **Large component, large range.** Bigger elements have bigger size ranges (a hero banner can be many heights; a button can't).
3. **Geometric mean.** Once the agent has an acceptable size range, the optimal value is more likely in the *bottom half* of the range. Erik's empirical heuristic: optimal sizes are smaller than they look.

**Schema field:** `_shared/tokens.json` (Layer B) ships with these as defaults. `low-fi.json`'s region heights and `high-fi.json`'s typography-used reference these tokens.

---

## Screen States — the enumerated taxonomy

This is the full list. Every screen-scope artifact's `states` array (in v0.2 of the schema) draws from this taxonomy. The agent treats it as exhaustive — if a state isn't here, it's a sub-variant of one that is.

### Ideal state
- Full of data, perfectly displayed
- Scrolled state (what does the screen look like when scrolled past the fold?)

### Blank state
- **First use** — show preview of content, first step, or tutorial. Per `personal-anti-patterns.md`, must have an actionable CTA, not just an illustration.
- **User cleared all data** — different from first use; the user *had* data and now doesn't. UI should reflect that.
- **No search results** — show fuzzy matches, browsing alternatives, or a contact-us path.

### Partial state
- Creating first item (the user has *started* but hasn't finished)
- Incentivising further interaction (one item exists, encourage more)

### Loading state
- Spinners, skeletons, or repeating animation — for **1–5 second waits**
- Progress bars — for **5–30 second waits**
- "Allow users to cancel, do other tasks" — for **30+ second waits**

The duration thresholds matter. The agent picks the loading pattern based on expected duration, not aesthetic preference.

### Error state
- Missing input
- Invalid input
- Connectivity issue
- Airplane mode
- Server error
- Warnings

Each has a different UX. The agent treats them distinctly, not as one "error" bucket.

### Toggleable states
- Hovered / focused
- Menus / popovers open
- Alerts / notifications shown
- Favourited / starred / liked
- Show all / accordions expanded
- Tabs shown
- In edit or create mode

### Lengthy input state
- Long text (graceful overflow, truncation, reveal)
- Very tall / very wide images (constraint or full-page handling)

### User-based states
- Logged-in user (the default)
- Anonymous user (what's visible without auth?)
- Admin user (what additional surfaces exist?)

**Schema field:** v0.2 of `low-fi.json`'s `states` array uses these as enumerated values. Required sub-fields per state type vary:
- Loading states require a `duration-band` (1–5s / 5–30s / 30+s)
- Error states require an `error-kind` (one of the six above)
- Blank states require a sub-kind (first-use / cleared / no-results)

---

## The Actions Checklist

Per Erik's cheatsheet — every Create / Edit / Delete-shaped action must answer:

| Action | Required questions |
|---|---|
| **Create** | Can you cancel creating? Can you undo changes? Is there success feedback? Is there failure feedback? |
| **Edit** | Is there a way to edit every editable property? Can you cancel editing? Can you undo changes? Is there success feedback? Is there failure feedback? |
| **Delete** | Can you undo deletion? Is there success feedback? Is there failure feedback? |

Per the v0.2 schema, these become required fields on every action with `kind: command` in `domain-map.json`. Missing answers are `plg-critique` `major` findings (or `blocker` if the action is destructive).

---

## Color — the HSB-based variation algorithm

Erik's most generatively useful rule. Given a single brand color, the agent can derive a full token scale (lighter and darker variations for raised controls, inset controls, hovered states, disabled states) using a deterministic algorithm.

### Work in HSB, not RGB

- **Hue** (0–360°): which color
- **Saturation** (0–100%): richness — 0% is gray, 100% is rich (or pure black at low brightness)
- **Brightness** (0–100%): "how on the light bulb is" — 0% is black, 100% is bright (or white at low saturation)

HSB is intuitive for variation work in a way RGB isn't. The agent always converts brand colors to HSB before deriving variations.

### To make a color *lighter*

Three moves, applied together:

1. **Increase brightness**
2. **Decrease saturation**
3. **Hue toward nearest of cyan (180°), magenta (300°), or yellow (60°)**

The hue shift is the non-obvious move. Pure mathematical lightening (just increase brightness) produces washed-out colors. Hue-shifting toward cyan/magenta/yellow during lightening produces colors that *look* lighter — because those hues have higher perceived luminosity.

### To make a color *darker*

Mirror moves:

1. **Decrease brightness**
2. **Increase saturation**
3. **Hue toward nearest of red (0°), green (120°), or blue (240°)**

Red/green/blue have lower perceived luminosity, so hue-shifting toward them during darkening produces colors that look richer-dark rather than muddy-dark.

### How variations get used

| Use case | Variation | Example |
|---|---|---|
| Default button | base color | brand primary |
| Hovered button | darker variation | hover state |
| Disabled button | lighter variation | grayed-out |
| Raised control on background | lighter variation of background | card on page |
| Inset control on background | darker variation of background | input field |
| Text on colored background | white (on dark) or darker variation of the same color (on light) | per "no black text on colored backgrounds" |

**Schema implication:** `_shared/tokens.json` (Layer B) is generated from a single brand color (or a small set of brand colors) using this algorithm. The agent doesn't pick variations by eye; it derives them. The product's `aesthetic.md` may override specific tokens with hand-tuned values, but the default is algorithmic.

---

## Typography — choosing and pairing

### The principles

From the Typography Checklist:

- **Body font is highly legible.** No design goal above legibility for body. Erik suggests checking x-height, counters, and distracting letterforms.
- **Header and accent fonts bring out different aspects of the brand.** They can have personality; body cannot.
- **Each font is as subtle as possible** given the brand's expressiveness. Subtle amplification, not overpowering.
- **All fonts are different enough to be distinguishable.** Two sans-serifs that look almost-the-same are worse than one good sans-serif.
- **Each font has rules** for when and how it's used. The agent documents these in `_shared/aesthetic.md` (Layer B).

### Text styling principles

- **Text styling is information architecture.** The relationship between text elements should be clear from styling alone.
- **Consistency first.** Default to existing text styles; new ones earn their place.
- **Up-pop and down-pop.** Simultaneously apply styles that make text *more* visible (size, weight, color) and *less* visible (lightening). Most styled text is one of these; the best is both, deliberately.
- **The squint test.** A user could describe the page even without reading the words.

### Text styling basics

- Line length of body: **50–75 characters**. Erik's check: paste the alphabet three times; it should fill a line or more of body text.
- Line height grows with line length. Tighter for short lines, looser for long.
- **5 font sizes maximum** (per the sizing scale above).
- Paragraph spacing is enough to feel designed, not so much it reads as a double line break.
- **Body text is not letter-spaced.** Uppercase text *is*. Titles *can* be negatively letter-spaced.
- No centred text over 2–3 lines.
- Numbers comparable digit-for-digit (in tables) are right-aligned.
- **Bold is not used to show active states** if it causes element re-flow.
- Strikethrough and similar effects only when brand-appropriate.
- Non-clickable text is gray. Colored text is sparing, never the sole indicator of state.

### The SLUB pattern

**S**maller, **L**ighter, **U**ppercase, **B**old. Used for labels and subheaders. The combination of all four reads as "this is a label" without any explicit "label" styling.

The agent reaches for SLUB (or partial-SLUB variations) for:

- Form-field labels
- Section subheaders
- Metadata labels ("Created by," "Last edited")
- Table column headers

### Special characters for designed feel

The right special characters add polish without effort:

- Em dash (—) and en dash (–) instead of hyphens for ranges and pauses
- Curly quotes (" " ' ') instead of straight (" ')
- Ellipsis (…) instead of three dots
- Middle dot (·) for separators in metadata strings
- Arrows (← → ↑ ↓) for navigation indication
- Guillemets (« ») where appropriate for the brand voice

### What's banned by default

Per the "20 Things to No" (and aligned with Anthropic's own design guidance):

- **System fonts as defaults** — Arial, Helvetica, system-ui acceptable only as a deliberate performance choice
- **Overused Google Fonts** — Open Sans, Lato, Raleway, Inter, Space Grotesk all out as defaults
- **Thin or light weights** — save them for deliberate contrast within an established system; default to bold/regular
- **"Fun" fonts** unless the brand explicitly requires it
- **Coloured body text** — dark grays with low saturation; color is for state, not decoration

---

## The "20 Things to No" — operational

This list is also in `personal-anti-patterns.md` because it's load-bearing across all design decisions. It's repeated here in operational form (each rule with the cheatsheet section it traces to) for lookup.

1. **No unaligned elements** (Alignment)
2. **No inconsistency without reason** (Consistency)
3. **No system fonts as defaults** (Choosing Fonts)
4. **No overused Google Fonts** (Choosing Fonts)
5. **No thin or light weights** (Styling Text I)
6. **No colored text** as default (Styling Text I)
7. **No "fun" fonts** unless brand demands (Brand & Letterform)
8. **No lines over 75 characters** (Styling Text I)
9. **No centered text over 2–3 lines** (Styling Text I)
10. **No extra colors** (Variations)
11. **No black text on colored backgrounds** (Variations)
12. **No ultra-wide form controls** (Component Libraries)
13. **No form control inconsistency** (Component Libraries)
14. **No Font Awesome** (Icon Design)
15. **No unlabelled icons** (Icon Design)
16. **No mismatched icons & labels** (Icon Design)
17. **No chart junk** (Data Visualisations)
18. **No stock photos** (Photography & Imagery)
19. **No dark borders** (various)
20. **No gray cards on white backgrounds** (Lighting & Shadows)

Per `personal-anti-patterns.md`, these are hard rules unless `_shared/aesthetic.md` for the specific product overrides a specific one with documented reason.

---

## Brand reflection — for the discovery turn

When `plg-shape` does its discovery turn (per Shape Up + the OD-derived question form pattern), Erik's brand reflection questions are the agent's structured prompt set:

1. **Who are you?**
2. **What do you have to say?**
3. **What aren't you?**
4. **Why should people listen to you?**
5. **What do you believe that all your competitors disagree with?**
6. **What values do you hold so strongly you'd be willing to lose money rather than violate them?**

Question 3 ("what aren't you?") is the single most useful input for `_shared/anti-patterns.md`. Question 5 surfaces the differentiated positioning that drives `moat.md`'s strategy choice. Question 6 surfaces the constraints that override defaults.

The agent runs these in `plg-shape` as part of the brand-spec extraction protocol, alongside the OD-derived "locate brand assets, codify, vocalise" workflow.

---

## What this means for the artifact schema

Direct mappings:

- `_shared/tokens.json` ships with Erik's default sizing scale; color variations are derived via the HSB algorithm from base brand colors
- `low-fi.json`'s `density` defaults to `generous` per "double your whitespace"
- `low-fi.json`'s `states` array (v0.2) uses Erik's enumerated taxonomy
- `low-fi.json`'s `simplicity-pass` field maps decisions to one of the six strategies
- `domain-map.json`'s actions with `kind: command` carry Erik's Actions Checklist fields as required
- `high-fi.json` is checked against the "20 Things to No" by `plg-critique`
- The squint test is a `plg-critique` heuristic at screen scope: can the agent describe the page from the visual hierarchy alone?

`plg-critique` runs three Erik-specific passes at screen scope:

1. **Simplicity Pass** — for each of the 6 strategies, are there findings? (Severity: minor by default; aggregate findings into a "simplicity score")
2. **Screen States Pass** — does the screen declare every applicable state from the taxonomy?
3. **20 Things Pass** — checklist run; each violation a finding (severities per `personal-anti-patterns.md`)

---

## Where Erik is silent

Two things this reference deliberately doesn't cover, because Erik's canon doesn't:

1. **Motion design.** Erik's cheatsheets are silent on animation timing, easing curves, and motion choreography. The agent uses `personal-anti-patterns.md`'s motion stance ("animation only when it adds value") as the default. When Layer B's `aesthetic.md` (per the OD-derived `DESIGN.md` schema) needs more, that's where motion specifics live.
2. **Voice and copy.** Erik's typography section is about *styling* text, not *writing* it. Voice is `bj-fogg.md` (motivation copy, ability copy, prompt copy) plus Layer B's `aesthetic.md` (brand voice).

The agent uses Erik for what he's strongest on — sizing, simplicity, color variation, screen states, the rule-of-thumb library — and reaches elsewhere for what his canon doesn't address.
