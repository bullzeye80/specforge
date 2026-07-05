# SPECFORGE.md

> **What this file is.** The single source of truth for what specforge has added to or modified in its upstream (`nexu-io/open-design`). When upgrading from upstream, this file is the upgrade checklist. When something breaks, this file is the bisection map.

**Upstream:** `https://github.com/nexu-io/open-design.git`
**Last upstream sync:** `d5d9a761c` (OD 0.11.0) — fork baseline, 2026-07-04
**Specforge version:** 0.1.0 (pre-release)

---

## Quick index

- [What specforge is](#what-specforge-is)
- [Added directories and files](#added-directories-and-files)
- [Modified files](#modified-files-comment-marker-specforge-mod)
- [Database migrations](#database-migrations)
- [Contract additions](#contract-additions)
- [Skill additions](#skill-additions)
- [Craft additions](#craft-additions)
- [UI additions](#ui-additions)
- [Upstream-tracking discipline](#upstream-tracking-discipline)

---

## What specforge is

Specforge is a fork of Open Design that adds a **PLG-specific multi-mode workflow** on top of OD's surface-generation pipeline.

The architecture has three layers:

- **Layer A** — universal framework knowledge (PLG, EUREKA, BJ Fogg, Shape Up, Erik Kennedy, Nielsen-Norman, OOUX + DDD). Lives in `craft/plg-*.md` files. Loaded progressively via skill `od.craft.requires`.
- **Layer B** — per-product context (`product.md`, `journey.md`, `domain-map.json`, etc.). Authored once per product. Lives in `specs/design/_shared/`.
- **Layer C** — the surface, which is OD itself plus our extensions. Lives in `apps/web` and `apps/daemon`.

We add four mode skills:

- `plg-shape` — fuzzy idea → product, journey, sitemap, MOAT, domain map, feature shape
- `plg-flow` — shape → flow-graph (breadboard), straight-line, wireframes, low-fi
- `plg-critique` — any artifact → IA / IH / domain / surface / simplicity / states / funnel critique
- `plg-build` — low-fi → composed high-fi (Phase 2; in Phase 1 we delegate to OD's existing artifact loop)

The artifact tree (product → flows → screens, three fidelity rungs at the screen level) is the navigable spine.

---

## Added directories and files

These are **net-new** to the codebase. Pure additions; no upstream conflicts possible unless upstream chooses the same path.

### `craft/plg-*.md` — Layer A references

**Seam:** zero-code additive (confirmed by the file walk — `docs/specforge-file-walk.md` §1). Drop
the file in `craft/`, name its slug in a skill's `od.craft.requires`, add a row to
`craft/README.md`'s "Files" table. No daemon change. `pnpm lint:craft` will fail the build if a
skill references a plg slug whose file doesn't exist yet — so author the craft file before/with the
skill that requires it, or stage the slug in `craft/FUTURE_SECTIONS.md`.

**Anatomy each file must follow** (from OD's `anti-ai-slop.md`/`typography.md`/`state-coverage.md`):
no frontmatter; H1 title → 1-para intro stating the *how (DESIGN.md) vs what (this file)* split →
`> Adapted from …` attribution blockquote → `##` rule-group sections with tables → closing
`## Common mistakes (lint these)`. Target 3–8 KB. Tag guidance-only rules `*(guidance, not auto-checked)*`.

| File | Source reference | OD overlap → inherit vs author fresh | Status |
|---|---|---|---|
| `craft/plg-foundations.md` | `references/prod-led-foundations.md` | None — net-new PLG. Author fresh. | **Authored** (specbox task 01; lint:craft + guard green) |
| `craft/plg-moat.md` | `references/moat.md` | None. Author fresh. | **Authored** (specbox task 02) |
| `craft/plg-eureka.md` | `references/eureka.md` | None. Author fresh. | **Authored** (specbox task 03) |
| `craft/plg-bj-fogg.md` | `references/bj-fogg.md` | None. Author fresh. | **Authored** (specbox task 04) |
| `craft/plg-shape-up.md` | `references/shape-up.md` | None (fidelity-ladder discipline is net-new). Author fresh. | **Authored** (specbox task 05) |
| `craft/plg-domain.md` | `references/domain.md` | None (OOUX+DDD is net-new). Author fresh. | **Authored** (specbox task 06) |
| `craft/plg-personal-anti-patterns.md` | `references/personal-anti-patterns.md` | **Overlaps** OD `anti-ai-slop.md` — author fresh but cross-reference it ("extends, does not replace"); keep any shared hex/rule list in sync per the `AI_DEFAULT_INDIGO` precedent. | **Authored** (specbox task 07; extends anti-ai-slop, no hex dup) |

We do **not** re-author these — OD already ships them (confirmed inventory, walk §5): `typography.md`,
`typography-hierarchy.md`, `typography-hierarchy-editorial.md`, `color.md`, `state-coverage.md`,
`laws-of-ux.md`, `anti-ai-slop.md`, `accessibility-baseline.md`, `animation-discipline.md`,
`rtl-and-bidi.md`, `form-validation.md`.

**Erik Kennedy content — resolved, no separate craft file:** Erik's screen-states taxonomy and 6
simplicity strategies live in the *schema* (`low-fi.json.states` enum + `simplicity-pass` field) and
are enforced by `plg-critique`, not injected as craft. Erik's sizing defaults ship in Layer B's
`_shared/tokens.json`. So `plg-erik-kennedy-extensions.md` and `plg-atomic-composition.md` are
**dropped** unless a concrete gap surfaces while authoring skills.

### `skills/plg-*` — mode skills

**Mount confirmed:** repo-root `skills/` is a valid loader root — `SKILL_ROOTS = [USER_SKILLS_DIR,
SKILLS_DIR]` (`server.ts:1506`), and `ALL_SKILL_LIKE_ROOTS` feeds skills into the chat-run system
prompt (walk §4). So `skills/plg-*/SKILL.md` surfaces in Settings→Skills and in runs with no wiring.
(OD's own `dashboard`/`critique` examples actually live in `design-templates/`, not `skills/` —
sample-read them from there.)

Frontmatter uses OD's `od:` block plus the two specforge-new fields `od.spec.produces` /
`od.spec.consumes` (see "Skill additions" below for the parser wiring). Concrete sketches — filenames
come straight from the v0.2 schema §11:

> **`od.mode` correction (learned running plg-shape end-to-end).** OD's `SkillMode` is a **closed
> enum** — `image | video | audio | deck | design-system | template | prototype` (`skills.ts:30`) —
> and it is the *surface/media* axis, NOT specforge's "mode-skill" identity. An unknown value like
> `plg-shape` is silently ignored and the mode is **inferred from body text**, which mis-derived
> `surface: audio` and injected a media-generation contract that skipped the discovery layer. So all
> four specforge skills set **`od.mode: prototype`** (web surface, no media handling); their identity
> as plg-shape/flow/critique/build lives in `triggers` + `od.spec.produces`. No `skills.ts` change is
> needed for modes. (If we later want first-class mode tags, that's a separate `// SPECFORGE-MOD:`
> extending the `SkillMode` enum + `normalizeMode` + surface mapping — not required for function.)

**`skills/plg-shape/`** — fuzzy idea → product structure. Build smallest-first: `product.md` only,
then add `journey.md` → `sitemap.json` → `nav-model.md` → `domain-map.json` → per-feature `shape.md`.
```yaml
od:
  mode: prototype   # see note below — od.mode is OD's SURFACE enum, not our mode-skill identity
  craft:
    requires: [plg-foundations, plg-moat, plg-eureka, plg-bj-fogg, plg-domain, plg-personal-anti-patterns]
  spec:
    produces: [product.md, journey.md, sitemap.json, nav-model.md, domain-map.json, shape.md]
    consumes: []
```
**`skills/plg-flow/`** — shape → flow + wireframes.
```yaml
od:
  mode: prototype   # OD surface enum; identity is via triggers + od.spec
  craft:
    requires: [plg-shape-up, plg-eureka, plg-domain, plg-bj-fogg]
  spec:
    produces: [flow-graph.json, straight-line.md, wireframe.json, low-fi.json, sitemap.json]  # updates sitemap
    consumes: [product.md, journey.md, sitemap.json, domain-map.json, shape.md]
```
**`skills/plg-critique/`** — any artifact → 7-category critique. Reads everything, writes only
`critique.md`. Requires OD's own `state-coverage` + `laws-of-ux` alongside ours (states/surface checks).
```yaml
od:
  mode: prototype   # OD surface enum; identity is via triggers + od.spec
  craft:
    requires: [plg-domain, plg-foundations, plg-personal-anti-patterns, state-coverage, laws-of-ux]
  spec:
    produces: [critique.md]
    consumes: [product.md, journey.md, sitemap.json, nav-model.md, domain-map.json, shape.md, flow-graph.json, straight-line.md, wireframe.json, low-fi.json, high-fi.json]
```
**`skills/plg-build/`** (Phase 2) — low-fi → composed high-fi. Phase 1 delegates to OD's artifact loop.
```yaml
od:
  mode: prototype   # OD surface enum; identity is via triggers + od.spec
  craft:
    requires: [plg-personal-anti-patterns]
  spec:
    produces: [high-fi.json, high-fi.html]
    consumes: [low-fi.json, wireframe.json, aesthetic.md, tokens.json, components.md]
```

| Skill | Status |
|---|---|
| `skills/plg-shape/` | **Complete (v2)** — produces the full product-scope set in dependency order: `product.md` (§6.1) → `journey.md` (§6.2) → `domain-map.json` (§6.5) → `sitemap.json` (§6.3) → `nav-model.md` (§6.4) → per-feature `shape.md` (§7.1). Discovery via `<question-form>`, no HTML preview. product.md + journey.md dogfooded ✓; domain-map/sitemap/nav-model/shape steps not yet run end-to-end. |
| `skills/plg-flow/` | **v1 authored** — v0 breadboard rung (`flow-graph.json` §7.2 → `straight-line.md` §7.3) shipped + dogfooded on anchor-shaping (First-Strike anchored on `event:shaping.artifact-generated`). **v1 adds the fat-marker "what" rung:** one `wireframe.json` (§8.1, `version: "2"`) per distinct screen the flow touches — regions + contents, structural only (no layout/grid/states/copy), each interactive element traced back to a flow-graph affordance and using v0.2 `action:<object>.<verb>` refs. Not yet dogfooded end-to-end. Next rung — `low-fi.json` (layout half of the fat-marker). |
| `skills/plg-critique/` | TBD (OD's generic `design-templates/critique/` is the model; ours adds the 7 PLG checks) |
| `skills/plg-build/` | Phase 2 |

### `specs/design/` — artifact tree examples

| Path | Purpose | Status |
|---|---|---|
| `specs/design/_meta/artifact-schema.md` | v0.2 schema doc | Already authored |
| `specs/design/_meta/artifact-schema-v0.1.md` | v0.1 for diff reference | Already authored |
| `specs/design/_shared/product.md` | specforge's own — dogfooded via plg-shape (interactive) | **Authored** |
| `specs/design/_shared/journey.md` | specforge's own — dogfooded via plg-shape (First Strike/KUI/PAI) | **Authored** |
| `specs/design/_shared/domain-map.json` | specforge's own — dogfooded via plg-shape (3 contexts, §6.5-clean) | **Authored** |
| `specs/design/_shared/sitemap.json` | specforge's own — 12 nodes, all refs resolve to domain-map | **Authored** |
| `specs/design/_shared/nav-model.md` | specforge's own — nav model over the sitemap | **Authored** |
| `specs/design/features/*/shape.md` | specforge's own — 8 feature shapes (§7.1), stages trace to journey | **Authored** |

**plg-shape's full artifact chain is dogfooded end-to-end on specforge itself** — the complete
product-scope spec (`_shared/` + 8 `features/*/shape.md`) exists and is cross-referentially valid.

### Documentation additions

| Path | Purpose | Status |
|---|---|---|
| `SPECFORGE.md` | This file | Authored |
| `docs/specforge-handoff.md` | Handoff brief for new sessions | Authored |
| `docs/specforge-file-walk.md` | OD load-bearing file walk — the integration map (4 seams) | Authored |
| `docs/specforge-architecture.md` | Architecture additions (artifact tree on top of OD's data model) | TBD |
| `docs/specforge-skills-protocol.md` | The four mode skills' contracts | TBD |

---

## Modified files (comment marker `// SPECFORGE-MOD:`)

These are files in OD's source tree we've changed. Every modification carries a `// SPECFORGE-MOD: <rationale>` comment header (or `# SPECFORGE-MOD:` for non-JS files) to make upstream merges navigable.

When upstream merges conflict on these files, the `SPECFORGE-MOD:` markers are the resolution map.

| File | What we changed | Why |
|---|---|---|
| _(none yet — populated as we go)_ | | |

**Discipline:**

1. Prefer additive changes (new files, new tables, new skills, new craft files) over modifications.
2. When modification is unavoidable, add the `SPECFORGE-MOD:` comment header *with rationale*.
3. Update this table in the same commit as the modification.
4. On upstream sync, resolve conflicts file-by-file using this table as guidance.

---

## Database migrations

**Correction from the walk (§5):** OD has **no `.sql` files, no migrations dir, no version ledger**.
`apps/daemon/src/db.ts`'s `migrate(db)` runs on every open — idempotent `CREATE TABLE IF NOT EXISTS`
blocks + `PRAGMA table_info` column guards — and delegates whole feature-areas to per-module migrators
called at its tail (`migrateCritique`, `migrateMediaTasks`, `migratePlugins`). **We copy that seam**,
so there is no `migrations/00x.sql`.

**Deliverable:** new module `apps/daemon/src/specforge/persistence.ts` exporting `migrateSpecforge(db)`
(all our DDL lives here), plus the **one and only** `db.ts` touch: a `// SPECFORGE-MOD:` import + a
`migrateSpecforge(db)` call at the end of `migrate()`. Log both in the Modified-files table.

| Deliverable | Tables | Status |
|---|---|---|
| `specforge/persistence.ts` → `migrateSpecforge(db)` | `spec_artifacts`, `spec_artifact_refs` | TBD |
| `db.ts` hook (import + tail call, `// SPECFORGE-MOD:`) | — | TBD |

Domain shredding (`domain_*` tables) is **dropped for v1**: `domain-map.json` stays a single on-disk
artifact; the artifact tree indexes the file, we don't relationally explode objects/actions/events
until a query actually needs it. Revisit only if cross-object querying becomes real.

Sketch DDL (idempotent; `projects.id` is `TEXT PRIMARY KEY`, FK + cascade per OD convention):
```sql
CREATE TABLE IF NOT EXISTS spec_artifacts (
  id           TEXT PRIMARY KEY,                 -- e.g. 'spec:<project>/<feature>/<screen>/low-fi.json'
  project_id   TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  scope        TEXT NOT NULL,                    -- 'product' | 'flow' | 'screen'
  feature_slug TEXT,                             -- null at product scope
  screen_slug  TEXT,                             -- null at product/flow scope
  kind         TEXT NOT NULL,                    -- schema filename: 'product.md' … 'high-fi.html'
  fidelity     TEXT,                             -- null | 'breadboard' | 'fat-marker' | 'composed'
  rel_path     TEXT NOT NULL,                    -- path under specs/design/
  format       TEXT NOT NULL,                    -- 'markdown' | 'json' | 'html'
  version      TEXT NOT NULL DEFAULT '2',
  produced_by  TEXT,                             -- skill id, e.g. 'plg-shape'
  created_at   INTEGER NOT NULL,                 -- epoch ms, matching OD
  updated_at   INTEGER NOT NULL,
  UNIQUE(project_id, rel_path)
);
CREATE TABLE IF NOT EXISTS spec_artifact_refs (
  id               TEXT PRIMARY KEY,
  from_artifact_id TEXT NOT NULL REFERENCES spec_artifacts(id) ON DELETE CASCADE,
  to_ref           TEXT NOT NULL,                -- an ID string (screen:… object:… event:…) or filename
  ref_kind         TEXT NOT NULL,                -- 'wireframe-ref' | 'low-fi-ref' | 'consumes' | 'fires-event' | …
  created_at       INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_spec_artifacts_project ON spec_artifacts(project_id, scope);
CREATE INDEX IF NOT EXISTS idx_spec_artifact_refs_from ON spec_artifact_refs(from_artifact_id);
```

**Discipline:**

- Never modify OD's existing tables or indexes. New tables prefixed `spec_` / `plg_`.
- `migrateSpecforge` must stay idempotent — `IF NOT EXISTS` only; wrap any multi-statement reshape in
  `db.transaction` (OD's `migrate()` has no outer transaction).
- FK into `projects(id) ON DELETE CASCADE` so deleting a project cascade-cleans the artifact tree.

---

## Contract additions

`packages/contracts` is OD's pure-TS web/daemon contract layer. We add types here for our artifact-tree DTOs.

| File | Adds | Status |
|---|---|---|
| `packages/contracts/src/spec-artifacts.ts` | Core types + list DTOs (below) | TBD |
| `packages/contracts/src/critique-plg.ts` | `PlgCritiqueLevel`, `PlgCritiqueLevels`, `PlgCritiqueSummary` | TBD |

Concrete shapes (mirror the schema + the `spec_artifacts` table 1:1):
```ts
// spec-artifacts.ts
export type SpecScope = 'product' | 'flow' | 'screen';
export type SpecFidelity = 'breadboard' | 'fat-marker' | 'composed';
export type SpecArtifactKind =            // schema §11 filenames
  | 'product.md' | 'journey.md' | 'sitemap.json' | 'nav-model.md' | 'domain-map.json'
  | 'shape.md' | 'flow-graph.json' | 'straight-line.md'
  | 'wireframe.json' | 'low-fi.json' | 'high-fi.json' | 'high-fi.html'
  | 'critique.md';
export interface SpecArtifact {
  id: string; projectId: string; scope: SpecScope;
  featureSlug: string | null; screenSlug: string | null;
  kind: SpecArtifactKind; fidelity: SpecFidelity | null;
  relPath: string; format: 'markdown' | 'json' | 'html';
  version: string; producedBy: string | null;
  createdAt: number; updatedAt: number;
}
export interface SpecArtifactRef { id: string; fromArtifactId: string; toRef: string; refKind: string; }
export interface SpecArtifactTree {   // product → flows → screens, for the left-rail
  product: SpecArtifact[];
  flows: Array<{ featureSlug: string; artifacts: SpecArtifact[];
    screens: Array<{ screenSlug: string; rungs: Record<SpecFidelity, SpecArtifact | null>; artifacts: SpecArtifact[] }> }>;
}
export interface ListSpecArtifactsResponse { tree: SpecArtifactTree; }

// critique-plg.ts
export type PlgCritiqueLevel = 'ia' | 'ih' | 'domain' | 'surface' | 'simplicity' | 'states' | 'funnel';
export type PlgCritiqueVerdict = 'pass' | 'warn' | 'fail';
export type PlgCritiqueLevels = Record<PlgCritiqueLevel, PlgCritiqueVerdict>;
export interface PlgCritiqueSummary {
  scope: SpecScope; target: string; levels: PlgCritiqueLevels;
  findings: { blocker: number; major: number; minor: number };
}
```

**Discipline:**

- All shared web/daemon DTOs go here, never inlined in apps.
- Pure TS. No imports from `apps/`, `node:fs`, `better-sqlite3`, browser globals.
- Check whether OD exports a `CritiqueRoundSummary` we should compose with rather than shadow; if the
  PLG levels genuinely differ, keep `PlgCritiqueSummary` separate and note it here.

---

## Skill additions

Listed under "Added directories and files" above. Each skill follows OD's `SKILL.md` convention with the `od:` extended frontmatter, plus our additions:

```yaml
od:
  mode: prototype | deck | template | design-system | image | video | audio   # OD SkillMode enum (closed) — NOT a specforge axis
  craft:
    requires: [plg-foundations, plg-moat, ...]
  spec:
    produces: [product.md, journey.md, sitemap.json, ...]   # NEW: declares the artifact tree files this skill writes
    consumes: [...]                                          # NEW: declares which artifact tree files this skill reads
```

The `od.spec.produces` and `od.spec.consumes` are **specforge additions** to the skill protocol. They let the daemon validate which skills can run when (e.g. `plg-flow` requires that `plg-shape` has produced a `domain-map.json`).

**Wiring (walk §4) — this is where the `// SPECFORGE-MOD:` convention is born.** OD's parser is a
hand-rolled YAML subset with no validation, and `SkillFrontmatter extends JsonRecord`, so `od.spec.*`
is **parsed but silently dropped** until we read it explicitly. Four edits in `apps/daemon/src/skills.ts`,
all `// SPECFORGE-MOD:`:
1. Extend the `od` type block (~:43-51): add `spec?: { produces?: string[]; consumes?: string[] }`.
2. Add `produces: string[]; consumes: string[]` to `interface SkillInfo` (~:60-103).
3. Add `normalizeSpecFiles()` mirroring `normalizeCraftRequires` (~:483-496) — trim/dedupe, validate
   against `SpecArtifactKind` from contracts.
4. Wire it at **both** push sites — parent card (~:225-257) and derived-card (~:272-306). Decide
   inheritance: the derived-card branch zeroes `craftRequires: []`; likely `produces`/`consumes`
   should reset to `[]` for synthetic example cards too.

Gate enforcement (a skill can't run until its `consumes` exist) is a **server-side** check, added where
runs are dispatched — not in the loader. Keep it a warning first (silent-drop culture, walk §4), harden
to a block once the tree is populated.

---

## Craft additions

Listed under "Added directories and files" above. Each follows OD's craft convention:

- Markdown file in `craft/<slug>.md`
- Slug matches the `od.craft.requires` reference in skill frontmatter
- "When to require" guidance documented in `craft/README.md` (we extend OD's table)

---

## API routes + CLI (the capability triad)

Per OD's dual-track rule (root `AGENTS.md` → "Capability exposure"), **every capability ships HTTP +
CLI + UI in the same PR**, all hitting the same `/api/*` endpoints typed by `packages/contracts`. The
artifact tree is a capability, so it needs all three — not just the UI.

**HTTP (walk: routes register in `apps/daemon/src/*-routes.ts`; artifact routes already live in
`project-routes.ts` via `registerProjectArtifactRoutes`).** Deliverable: a new
`apps/daemon/src/specforge/spec-routes.ts` exporting `registerSpecRoutes(ctx)`, wired in `server.ts`
with a `// SPECFORGE-MOD:` one-liner next to the other `register*Routes` calls.

| Route | Purpose | Status |
|---|---|---|
| `GET /api/specs/:projectId/tree` | `ListSpecArtifactsResponse` (product→flows→screens) | TBD |
| `GET /api/specs/:projectId/artifact?path=` | One artifact's parsed content | TBD |
| `POST /api/specs/:projectId/lint` | Lint a structured (JSON) artifact — see lint note below | TBD |

**CLI (walk: `SUBCOMMAND_MAP` in `apps/daemon/src/cli.ts`).** Deliverable: an `od spec` subcommand
registered in `SUBCOMMAND_MAP` (`// SPECFORGE-MOD:`), mirroring `od project …`. Must support `--json`
and `--prompt-file <path|->` per the rule.

| Command | Purpose | Status |
|---|---|---|
| `od spec tree <projectId> [--json]` | Print the artifact tree | TBD |
| `od spec show <projectId> <path> [--json]` | Print one artifact | TBD |
| `od spec lint <projectId> <path> [--json]` | Lint a structured artifact | TBD |

**Structured-artifact lint (walk §6):** OD's `lintArtifact()` is HTML-string-only and no-ops on JSON.
Deliverable: `lintLowFiArtifact(json): LintFinding[]` (fidelity-ladder + Erik screen-states checks)
reusing the content-agnostic `renderFindingsForAgent`, exposed via the `POST /api/specs/:id/lint`
route above. This is a **parallel entry point**, not an append to `lint-artifact.ts`.

## UI additions

OD's web (`apps/web`) is a **client SPA behind one Next.js catch-all** `app/[[...slug]]/page.tsx` →
`client-app.tsx`, routed by `apps/web/src/router.ts` + `App.tsx`. So specforge UI is **not** new
`app/**/page.tsx` files — it's a new view registered in the client router plus components under
`apps/web/src/`.

| Path | Purpose | Status |
|---|---|---|
| `apps/web/src/router.ts` (`// SPECFORGE-MOD:`) | Register the `specs` route/view | TBD |
| `apps/web/src/specs/SpecsView.tsx` | Artifact-tree page (left-rail tree + detail) | TBD |
| `apps/web/src/specs/SpecTree.tsx` | Left-rail tree (product / flows / screens) | TBD |
| `apps/web/src/specs/SpecRenderer/` | Three-fidelity renderers (breadboard / fat-marker / composed) | TBD |

**Discipline:**

- Reuse OD's existing components/primitives (`@open-design/components` `Button`, `FileViewer`, etc.).
- Don't import from `apps/daemon/src/` — stay behind `packages/contracts` types and `/api/*` routes.
- New component styles as CSS Modules colocated with the component (root `AGENTS.md` → "Web CSS ownership").

---

## Upstream-tracking discipline

OD ships ~weekly per their CHANGELOG.md. Maintaining the fork without drift requires habit.

**Cadence:** sync every 1–2 weeks at minimum.

**Process:**

```bash
# Fetch upstream
git fetch upstream

# See what's new
git log specforge-main..upstream/main --oneline

# For each commit, decide:
# - Cherry-pick: small, contained, useful for us
# - Merge later: large refactors, conflicts likely, defer
# - Skip: features we deliberately diverge on (e.g. their UI changes that conflict with our spec tree)

# Cherry-pick example:
git cherry-pick <sha>

# After conflict resolution, update SPECFORGE.md if any of our files were touched.
```

**Conflict resolution checklist:**

1. Conflict in a `// SPECFORGE-MOD:` file? Use the comment to understand intent; merge carefully.
2. Conflict in a non-marked OD file? Probably we accidentally modified it without marking — add the marker post-merge and update this table.
3. Conflict in a `craft/plg-*.md`, `skills/plg-*`, or `specs/design/` file? Shouldn't happen — those are net-new. If it does, OD has added something with a colliding name; rename ours.

**Schema migrations and upstream:** OD may add their own SQLite migrations. Our migrations are namespace-prefixed (`spec_*` / `plg_*` tables) so they shouldn't conflict, but always check.

---

## Open questions for the fork itself

1. **Renaming the bin from `od` to `spec`.** Currently the binary is `od`. Renaming propagates through `apps/packaged`, the stamp/IPC system, install scripts, docs. Decision: keep `od` for v0; revisit after first usable release.
2. **Workspace package names.** OD uses `@open-design/*`. Renaming these propagates through hundreds of imports. Decision: keep for v0.
3. **Upstream PR-back.** Some of our additions (PLG craft files, the artifact tree concept) might be valuable upstream too. Decide later whether to PR back or stay forked. Default: stay forked; revisit at v1.0.

---

## Maintenance

Update this file in the same commit as the change it describes. If the file gets stale, the upgrade-from-upstream process breaks. Treat staleness here as a P0.
