# SPECFORGE.md

> **What this file is.** The single source of truth for what specforge has added to or modified in its upstream (`nexu-io/open-design`). When upgrading from upstream, this file is the upgrade checklist. When something breaks, this file is the bisection map.

**Upstream:** `https://github.com/nexu-io/open-design.git`
**Last upstream sync:** _(set by Claude Code on first commit)_
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

| File | Purpose | Status |
|---|---|---|
| `craft/plg-foundations.md` | 5-stage roadmap, First Strike, KUI, PAI, 7-minute UDE test | TBD — content from `references/prod-led-foundations.md` |
| `craft/plg-moat.md` | Free-model selection, UI propagation tables | TBD — content from `references/moat.md` |
| `craft/plg-eureka.md` | Activation discipline, Straight-Line, Bumpers | TBD — content from `references/eureka.md` |
| `craft/plg-bj-fogg.md` | Behaviour theory, M-A-P diagnostic | TBD — content from `references/bj-fogg.md` |
| `craft/plg-shape-up.md` | Fidelity ladder discipline | TBD — content from `references/shape-up.md` |
| `craft/plg-domain.md` | OOUX + DDD layers | TBD — content from `references/domain.md` |
| `craft/plg-personal-anti-patterns.md` | Guru's lens (extends `craft/anti-ai-slop.md`) | TBD — content from `references/personal-anti-patterns.md` |

We do **not** re-author these because OD already covers the ground:

- `craft/typography.md` (OD has it)
- `craft/typography-hierarchy.md` (OD has it)
- `craft/color.md` (OD has it)
- `craft/state-coverage.md` (OD has it; aligns with Erik's screen states)
- `craft/laws-of-ux.md` (OD has it; covers Hick/Fitts/Jakob)
- `craft/anti-ai-slop.md` (OD has it; we extend rather than replace)

We may add (TBD after sample-reading OD's existing files):

- `craft/plg-erik-kennedy-extensions.md` if Erik's content not already covered by OD's typography/color/state files
- `craft/plg-atomic-composition.md` if explicit composition vocabulary needed beyond what OD's skill bodies imply

### `skills/plg-*` — mode skills

| Skill | Status |
|---|---|
| `skills/plg-shape/` | TBD |
| `skills/plg-flow/` | TBD |
| `skills/plg-critique/` | TBD (note: OD has a generic `skills/critique/`; ours extends with PLG-specific checks) |
| `skills/plg-build/` | Phase 2 |

### `specs/design/` — artifact tree examples

| Path | Purpose | Status |
|---|---|---|
| `specs/design/_meta/artifact-schema.md` | v0.2 schema doc | Already authored |
| `specs/design/_meta/artifact-schema-v0.1.md` | v0.1 for diff reference | Already authored |
| `specs/design/_shared/` | Worked example for specforge itself (dogfooding) | TBD Phase 1 |

### Documentation additions

| Path | Purpose | Status |
|---|---|---|
| `SPECFORGE.md` | This file | Authored |
| `docs/specforge-handoff.md` | Handoff brief for new sessions | Authored |
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

OD's SQLite schema is in `apps/daemon/src/db.ts`. We extend it with **additive migrations** that don't break upstream tables.

| Migration | Tables added | Status |
|---|---|---|
| `migrations/001-spec-tree.sql` | `spec_artifacts`, `spec_artifact_refs` | TBD |
| `migrations/002-bounded-contexts.sql` | `domain_contexts`, `domain_objects`, `domain_actions`, `domain_events` | TBD (or fold into 001) |

**Discipline:**

- Never modify OD's existing tables or indexes. Add new tables prefixed with `spec_` or `plg_`.
- New indexes on OD's tables are acceptable when they support our queries; document them here.
- Foreign keys into OD's tables (`projects.id`) are fine — OD's cascading deletes work for us.

---

## Contract additions

`packages/contracts` is OD's pure-TS web/daemon contract layer. We add types here for our artifact-tree DTOs.

| File | Adds | Status |
|---|---|---|
| `packages/contracts/src/spec-artifacts.ts` | `SpecArtifact`, `SpecArtifactKind`, `SpecArtifactRef`, etc. | TBD |
| `packages/contracts/src/critique-plg.ts` | Extensions to `CritiqueRoundSummary` for our seven check categories | TBD |

**Discipline:**

- All shared web/daemon DTOs go here, never inlined in apps.
- Pure TS. No imports from `apps/`, `node:fs`, `better-sqlite3`, browser globals.

---

## Skill additions

Listed under "Added directories and files" above. Each skill follows OD's `SKILL.md` convention with the `od:` extended frontmatter, plus our additions:

```yaml
od:
  mode: prototype | deck | template | design-system | plg-shape | plg-flow | plg-critique | plg-build
  craft:
    requires: [plg-foundations, plg-moat, ...]
  spec:
    produces: [product.md, journey.md, sitemap.json, ...]   # NEW: declares the artifact tree files this skill writes
    consumes: [...]                                          # NEW: declares which artifact tree files this skill reads
```

The `od.spec.produces` and `od.spec.consumes` are **specforge additions** to the skill protocol. They let the daemon validate which skills can run when (e.g. `plg-flow` requires that `plg-shape` has produced a `domain-map.json`).

---

## Craft additions

Listed under "Added directories and files" above. Each follows OD's craft convention:

- Markdown file in `craft/<slug>.md`
- Slug matches the `od.craft.requires` reference in skill frontmatter
- "When to require" guidance documented in `craft/README.md` (we extend OD's table)

---

## UI additions

OD's frontend is Next.js 16 App Router (`apps/web`). We add:

| Path | Purpose | Status |
|---|---|---|
| `apps/web/app/projects/[id]/specs/page.tsx` | Artifact tree navigation | TBD |
| `apps/web/app/projects/[id]/specs/[scope]/[slug]/page.tsx` | Artifact detail view | TBD |
| `apps/web/src/components/SpecTree.tsx` | Left-rail tree component | TBD |
| `apps/web/src/components/SpecRenderer/` | Three-fidelity renderers (breadboard / fat-marker / composed) | TBD |
| `apps/web/src/components/PlgShapeWizard.tsx` | UI for invoking `plg-shape` mode | TBD |

**Discipline:**

- Reuse OD's existing components where possible (`Loading`, `Icon`, `ChatPane`, `FileViewer`).
- Don't import from `apps/daemon/src/` — stay behind `packages/contracts` types and `/api/*` routes.

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
