# Specforge — Claude Code session guide

> **What this is.** Session-level guidance for Claude Code working on the specforge fork. Append to (or replace) OD's existing `CLAUDE.md` at the repo root. OD's `CLAUDE.md` currently contains only `@AGENTS.md`; we keep that pointer and add specforge-specific context below.

@AGENTS.md

---

## Specforge context

This repository is **specforge**, a fork of `nexu-io/open-design` that adds a PLG-specific multi-mode workflow on top of OD's surface-generation pipeline.

**Read these files before doing anything else** in a fresh session:

1. `SPECFORGE.md` — what specforge is, what we've added/modified, upstream-tracking discipline
2. `docs/specforge-handoff.md` — the architectural decisions made before this codebase existed
3. `references/` — the 10 Layer A framework references (PLG, EUREKA, BJ Fogg, Shape Up, OOUX+DDD, Atomic Design, Nielsen-Norman, Erik Kennedy, Personal Anti-Patterns, MOAT)
4. `specs/design/_meta/artifact-schema.md` — v0.2 schema doc for the artifact tree
5. OD's documentation: `AGENTS.md`, `apps/AGENTS.md`, `packages/AGENTS.md`, `docs/spec.md`, `docs/architecture.md`, `craft/README.md`

After reading, you have both sides — our framework knowledge + OD's architecture. Don't start coding before that pass is done.

---

## Hard rules

These override default behaviour. They exist because the fork is structurally tight and easy to break in subtle ways.

### Rule 1 — Modifications need provenance

Every modification to an OD-owned file (anywhere outside `craft/plg-*`, `skills/plg-*`, `specs/design/`, `references/`, `SPECFORGE.md`, `docs/specforge-*`, or our additive migration files) **must** carry a comment header:

```ts
// SPECFORGE-MOD: <one-line rationale>
```

Or for non-JS:

```yaml
# SPECFORGE-MOD: <one-line rationale>
```

In the same commit, update `SPECFORGE.md`'s **Modified files** table.

### Rule 2 — Additive over modificative

Prefer:

- New files in `craft/plg-*`, `skills/plg-*`, `specs/design/`
- New tables in SQLite (prefixed `spec_` or `plg_`)
- New routes under `/api/*` (prefixed with `/api/specs/*`)
- New components in `apps/web/src/components/`
- New types in `packages/contracts/src/spec-*.ts`

Over:

- Editing existing OD files
- Modifying OD's existing tables
- Changing existing OD routes

The default question: "can I do this without touching their files?" Most of the time, yes.

### Rule 3 — Respect package boundaries

Per OD's strict architecture (see `apps/AGENTS.md` and `packages/AGENTS.md`):

- `apps/web` does not import from `apps/daemon/src/`. Communication is via `/api/*` routes typed by `packages/contracts`.
- `packages/contracts` is pure TypeScript. No imports from Express, Node `fs`, `better-sqlite3`, browser globals.
- `apps/daemon/src/` files don't import sidecar control-plane details.
- Stamp fields are exactly five: `app`, `mode`, `namespace`, `ipc`, `source`. Don't add more.

If a piece of work seems to require crossing a boundary, the answer is "the contract types need extending" or "the route shape needs adjustment", not "import across the boundary."

### Rule 4 — The fidelity ladder is enforced

Per `references/shape-up.md`, the agent does not skip rungs. When the user asks for high-fi without a fat-marker, the response is "let's start at the wireframe — the structural decisions need to be explicit first." Do not silently produce all three rungs to "save time."

This rule applies to *Claude Code's own work* on the fork, not just to the agent the fork hosts. When asked to "build the dashboard UI" without a wireframe-or-low-fi being established, the right move is to think aloud about the structure first.

### Rule 5 — Don't author Layer B for users

Per `references/personal-anti-patterns.md`, when the user is filling in their product context, the agent guides but doesn't author. Plausible-sounding defaults are forbidden. When the user says "I don't know," surface it as an open question, not a placeholder.

This applies to specforge's own dogfooding too: the worked Layer B example for specforge is authored deliberately, with you (Guru) answering the questions, not Claude Code inventing them.

### Rule 6 — Test what you change

For each change:

- Run `pnpm guard` and `pnpm typecheck` before commit (per `AGENTS.md`)
- Run package-scoped tests for what was modified: `pnpm --filter @open-design/daemon test`, `pnpm --filter @open-design/web test`
- For prompt changes, ideally smoke-test with `pnpm tools-dev` and a small generation
- For schema changes, write or extend the migration test in `apps/daemon/tests/`

### Rule 7 — Commit small, commit often

Each PLG craft file → its own commit. Each schema migration → its own commit. Each daemon route → its own commit. Each new UI component → its own commit. Even though this is a one-person project, future-you will need to bisect.

Commit messages: present-tense imperative, scoped:

- `craft: add plg-foundations.md`
- `daemon: add /api/specs route for artifact tree listing`
- `web: add SpecTree left-rail component`
- `db: migration 001 — spec_artifacts and spec_artifact_refs tables`

---

## What this codebase is *not*

So that early sessions don't drift:

- Specforge is **not** a generic UX agent. It's PLG-specific and opinionated.
- Specforge is **not** Figma, v0, Lovable, Stitch. It's a process-disciplined artifact tree producing specs for downstream coding agents.
- Specforge does **not** generate production code. It produces artifacts (breadboards, fat-markers, composed mockups) that downstream agents (or humans) use to write production code in whatever stack.
- Specforge is **not** a standalone tool. It lives inside any project's `specs/design/` and runs the daemon against that project.

---

## Common Claude Code missteps to avoid

A few patterns to watch for:

**Misstep 1 — Reading the entire conversation history as context.** Don't. Read `docs/specforge-handoff.md` for the decisions; read the references and schema for the substance. The conversation has a lot of "what about X" exploration that was rejected, and rebuilding the context from it is wasteful.

**Misstep 2 — Authoring `plg-shape/SKILL.md` first because we've talked about it the most.** Resist. Sample-read OD's existing skills (`skills/dashboard/SKILL.md`, `skills/saas-landing/SKILL.md`, `skills/critique/SKILL.md`) to internalise their conventions. Then author against those conventions.

**Misstep 3 — Editing OD files because it's "easier than figuring out the additive path."** This is how forks decay. The additive path is almost always available; finding it is part of the work.

**Misstep 4 — Adding our schema fields directly to OD's existing tables.** Don't. New tables for our artifact tree. Foreign-key into OD's `projects.id`.

**Misstep 5 — Skipping the schema migration for "I'll do it later".** Don't. Each schema change is its own migration file with a clear name and a test. Cumulative inline edits to `db.ts` ruin upgrades.

**Misstep 6 — Producing all four mode skills in one session.** No. One skill at a time. Test it end-to-end before starting the next. Each skill informs the next.

---

## When stuck

- For OD architecture questions, the first stop is `apps/AGENTS.md`, `packages/AGENTS.md`, then the relevant `docs/*.md`.
- For framework/discipline questions, the first stop is the relevant `references/*.md`.
- For schema questions, the first stop is `specs/design/_meta/artifact-schema.md` (v0.2).
- For "what have we already decided," `docs/specforge-handoff.md`.

If genuinely stuck, surface the question as an open issue in `SPECFORGE.md`'s "Open questions for the fork itself" section rather than guessing.
