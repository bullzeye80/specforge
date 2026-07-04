# Specforge — OD load-bearing file walk

> **What this is.** The integration map produced by walking OD's seven load-bearing
> files (SETUP Step 5) before authoring any code. For each seam it records the
> mechanism, the *exact* extension point, and whether specforge extends / modifies /
> coexists. All `file:line` refs are against OD 0.11.0 (upstream `d5d9a761c`).
> Re-verify line numbers after an upstream sync.

## TL;DR — the four seams and their cost

| Seam | Extension cost | Where |
|---|---|---|
| **Craft (`plg-*.md`)** | **Zero code.** Pure additive. | Drop file in `craft/`, list slug in a skill's `od.craft.requires`. |
| **DB (`spec_*` tables)** | **One import + one call** in `db.ts`. | New `apps/daemon/src/specforge/persistence.ts` → `migrateSpecforge(db)`, called at tail of `migrate()`. |
| **Skill `od.spec.*` fields** | ~4 edits in `skills.ts` (introduces the SPECFORGE-MOD convention). | Type block, `SkillInfo`, a normalizer, both push sites. |
| **Lint JSON artifacts** | New parallel entry point (not an append). | `lintLowFiArtifact(json)` reusing `renderFindingsForAgent`, sibling route. |

No `// SPECFORGE-MOD:` markers exist in the tree yet — we introduce the convention.

---

## 1. Prompt composer — `apps/daemon/src/prompts/system.ts`

- **Role.** `composeSystemPrompt()` (system.ts:508) is a pure string-concat formatter. It
  *consumes* pre-loaded content; it never reads the filesystem. Order: injection-resistance
  → discovery → identity → memory/instructions → design-system (DESIGN.md, tokens) → **craft**
  → skill body → plugins/metadata → framework/media → tail rules. Craft sits between DESIGN.md
  and the skill body on purpose (brand tokens win value conflicts; craft rules cover the rest).
- **Craft injection is a 3-file path, none of it in system.ts:**
  1. Parse: `normalizeCraftRequires(data.od?.craft?.requires)` — `skills.ts:235` (normalizer at :483).
  2. Assemble + load: `server.ts` merges skill `craftRequires` + design-system `craftApplies`,
     minus `craftExemptions`, then `loadCraftSections(CRAFT_DIR, requestedCraft)` — `server.ts:6860`
     (`CRAFT_DIR` resolved at `server.ts:1340` = `PROJECT_ROOT/craft`).
  3. Read + concat: `loadCraftSections` — `craft.ts:20`; reads `craft/<slug>.md`, renders
     `### <slug>\n\n<body>`, joins with `---`. **Missing files are silently skipped** (craft.ts:39-42).
  4. Inject: pushed under `## Active craft references` — `system.ts:708-716`.
- **Specforge verdict: COEXIST.** Adding `craft/plg-foundations.md` + a skill requiring it works
  through the existing slug-driven loader with **no code change** (no daemon-side allowlist —
  skills.ts:477-482, craft.ts:5-6). If a marker is wanted, annotate `system.ts:708`.
- **Hazards.** (a) Typo in a slug → silent no-op, no error. (b) A design system's `craftExemptions`
  can strip a required craft section. (c) `pnpm lint:craft` (`scripts/lint-craft-references.ts`)
  **fails the build** if a referenced slug has no file and isn't in `craft/FUTURE_SECTIONS.md`.

## 2 & 3. Discovery + identity — `prompts/discovery.ts`, `prompts/official-system.ts`

- **discovery.ts** — top-of-stack, overrides the softer base. Exports `DISCOVERY_AND_PHILOSOPHY`
  (:23) and `renderSharedFramesBlock()` (:318). Carries **RULE 1** (turn 1 must emit a single
  `<question-form>` then STOP — :38), **RULE 2** (turn 2 branches on the `brand` answer; Branch A
  extracts a brand-spec, Branch B self-picks — :152), **RULE 3** (TodoWrite the plan, live updates,
  P0 self-check + 5-dim critique — :190). The `<question-form>` mechanism is *defined here*: fenced
  block wrapping JSON `{description, questions[]}`; user reply returns as `[form answers — <id>]`.
  Option `value`s (`pick_direction`, `brand_spec`, `reference_match`) must stay English — branch
  logic string-matches them.
- **official-system.ts** — `OFFICIAL_DESIGNER_PROMPT` (:11), stable identity charter (expert
  designer, filesystem-backed cwd, artifact `<artifact>` HTML format, tech pins, secrecy, one-render
  verification budget). Defers all clarification timing to discovery.ts (:25). No `<question-form>` here.
- **Specforge verdict: COEXIST (preferred).** The four PLG modes attach as active-skill layers the
  way OD skills already stack. **Modify only if** PLG needs to change turn-1 routing — then the single
  likeliest `// SPECFORGE-MOD:` spot is the `od-default` router exception / `taskType` radio options
  in discovery.ts (:43, :55-64). Both files independently restate the conditional-`<artifact>` rule
  (discovery.ts:184, official-system.ts:48-51) — if we ever change artifact behavior, edit **both**.

## 4. Skill loader — `apps/daemon/src/skills.ts`

- **Role.** `listSkills(skillsRoots)` (:145) scans each root dir for `<dir>/SKILL.md`, parses
  frontmatter, re-scans every call. **First root wins on id collision** (:151-180). Errors swallowed
  — "discovery, not validation" (:308).
- **Roots (server.ts:1506-1514).** `SKILL_ROOTS = [USER_SKILLS_DIR, SKILLS_DIR]` (repo-root `skills/`);
  `DESIGN_TEMPLATE_ROOTS` = `design-templates/`; `ALL_SKILL_LIKE_ROOTS` spans both and drives the
  chat-run system prompt. **`skills/plg-*` is a valid mount** — it surfaces in Settings→Skills and in
  chat runs. (Note: OD's own `dashboard`/`critique`/`saas-landing` examples live in `design-templates/`,
  NOT `skills/` — CLAUDE.md "Misstep 2" paths are slightly off; sample-read from `design-templates/`.)
- **Parsing is a hand-rolled YAML subset** (`design-systems/frontmatter.ts:17`), no zod, no schema
  validation anywhere in the daemon. `SkillFrontmatter extends JsonRecord` (:35) — open by design.
  Known `od.*` keys consumed: mode, surface, platform, scenario, category, design_system.{requires,
  sections}, upstream, preview.{type,entry}, example_prompt(+i18n), **craft.requires** (:235),
  default_for, featured, fidelity, speaker_notes, animations, critique.policy.
- **Adding `od.spec.produces` / `od.spec.consumes`: pass-through, not reject** — but also **not
  surfaced** until we read it. Four edits: extend the `od` type (:43-51), add fields to `SkillInfo`
  (:60-103), add a normalizer mirroring `normalizeCraftRequires` (:483-496), wire it at BOTH push
  sites — parent card (:225-257) and derived-card (:272-306, note it zeroes `craftRequires:[]`).
  This is where the `// SPECFORGE-MOD:` convention gets introduced.
- **Hazards.** (a) Unknown-field typos fail *silently* (no log/UI). (b) `buildSkillMarkdown`
  (:741-769) regenerates SKILL.md on import/update and only re-emits name/description/triggers —
  editing a `plg-*` skill through the daemon API would **drop the whole `od:` block**. Keep plg
  skills file-managed, not daemon-editable. (c) Renaming a skill folder without a `SKILL_ID_ALIASES`
  (:24-28) entry silently unlinks pinned projects.

## 5. DB — `apps/daemon/src/db.ts`

- **Role.** `better-sqlite3`, `openDatabase(projectRoot,{dataDir})` (:32) → `<dataDir|projectRoot/.od>/
  app.sqlite`, WAL, `foreign_keys = ON` (:40), then `migrate(db)`. One shared connection per process,
  keyed by file path.
- **No migration ledger.** No migrations table, no version counter, no `.sql` dir. `migrate()`
  (:54-353) is one idempotent function run on **every open**: `CREATE TABLE IF NOT EXISTS` blocks
  (:55-241) + `PRAGMA table_info` "add column if absent" guards (:244-349). `user_version` is
  **never written** despite stale comments claiming otherwise — don't build on it.
- **OD's own extension seam:** delegated `migrateXxx(db)` modules called at the tail (:350-352) —
  `migrateCritique`, `migrateMediaTasks`, `migratePlugins` (each does its own `CREATE TABLE IF NOT
  EXISTS`). **Copy this exactly.**
- **Specforge verdict: additive module + one hook.** Create `apps/daemon/src/specforge/persistence.ts`
  exporting `migrateSpecforge(db)`; add **one import + one call** at the end of `migrate()`, both
  marked `// SPECFORGE-MOD:`. That is the only touch to `db.ts`.
- **FK target.** `projects.id` is `TEXT PRIMARY KEY` (:56), no parent — safe root. Every OD child FKs
  `projects(id) ON DELETE CASCADE`; match that so deleting a project cascades our tree. Timestamps are
  INTEGER epoch-ms. Keep our DDL idempotent (`IF NOT EXISTS` only); wrap any multi-statement reshape in
  `db.transaction`.

## 6. Artifact linter — `apps/daemon/src/lint-artifact.ts`

- **Role.** `lintArtifact(rawHtml)` (:120) — an **HTML-string** anti-slop linter. Deterministic regex
  checks → `LintFinding[]` (P0/P1/P2 with id/message/fix/snippet). No HTML parse; strips comments,
  greps. Invoked from `POST /api/artifacts/save` (lint after write) and `POST /api/artifacts/lint`
  (lint without write, returns `agentMessage`). `renderFindingsForAgent` (:519-537) formats an
  `<artifact-lint>` reminder spliced back to the agent → **self-correction loop**.
- **No registry** — checks are inlined sequential blocks; "append before `return out`" is the stated
  extension model. But several are **order-dependent** via `if (out.find(f=>f.id===...))` suppression
  guards (:172,:197,:369). ~360 lines (:636-1000) are a token-aware CSS resolver serving one P1 rule.
- **Craft↔lint contract is by-hand prose.** Only `anti-ai-slop.md`'s P0 list is enforced;
  `AI_DEFAULT_INDIGO` (:78) must stay in sync with the hex list in `anti-ai-slop.md`. **Gap:**
  `state-coverage.md` promises "lint these" for loading/empty/error/edge states, validation timing,
  toast consistency — **none implemented.** Biggest unmet contract and the natural PLG value-add.
- **Specforge verdict: parallel entry point, not an append.** Specforge artifacts are JSON
  (`low-fi.json` etc.); `lintArtifact` silently no-ops on non-HTML. To enforce the fidelity ladder /
  Erik's screen-states taxonomy, add `lintLowFiArtifact(json): LintFinding[]` reusing the
  content-agnostic `renderFindingsForAgent`, wired as a sibling route next to `/api/artifacts/lint`.
  A check-registry refactor would be the clean way to make PLG checks compose.

---

## Open planning inputs surfaced by the walk

1. **Craft-first is confirmed as the cheapest first deliverable** (zero code) — matches the SETUP plan
   to author `plg-foundations.md` first. Remember to add it to the `craft/README.md` "Files" table and,
   if any skill references a plg slug before its file exists, to `craft/FUTURE_SECTIONS.md`.
2. **`od.spec.*` is the one genuinely new protocol surface** and the first place the SPECFORGE-MOD
   convention lands. Decide inheritance semantics for the derived-card push site.
3. **Lint of structured (JSON) artifacts needs its own entry point** — the existing linter can't be
   extended by appending regexes. Factor this into the artifact-tree phase, not the craft phase.
4. **Doc drift to fix in our templates:** CLAUDE.md "Misstep 2" points at `skills/dashboard` etc.;
   those examples are actually under `design-templates/`.