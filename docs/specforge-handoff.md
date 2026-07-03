# Specforge handoff brief

> **What this is.** A summary of the architectural decisions that produced specforge before any code existed. New Claude Code sessions read this once at the start to understand what's settled. Detailed reasoning lives in the chat history that produced these decisions; this brief is the distillation.

---

## The product in one sentence

Specforge is a **PLG-specific multi-mode UI/UX agent system** that produces structured design artifacts (breadboards, fat-marker sketches, composed mockups) at three fidelity rungs, organised in a navigable tree (product → flows → screens), authored by four mode skills, and consumed by downstream coding agents to build production code in whatever stack.

---

## Architecture in one diagram

```
                ┌─────────────────────────────────────┐
                │  Claude Code / Cursor / Codex / …   │
                │  (the agent CLI you already have)   │
                └────────────────┬────────────────────┘
                                 │
                                 │ daemon spawns it
                                 │
┌────────────────────────────────▼──────────────────────────────────┐
│                    specforge daemon (Express + SQLite)            │
│                                                                   │
│   prompt stack: identity + craft (PLG references) + skill body   │
│                                                                   │
│   four mode skills:                                              │
│     plg-shape  →  product.md, journey.md, sitemap, domain-map    │
│     plg-flow   →  flow-graph, straight-line, wireframes, low-fi  │
│     plg-critique  → IA/IH/domain/surface/simplicity/states/funnel │
│     plg-build  →  high-fi (delegated to OD's loop in Phase 1)    │
│                                                                   │
│   artifact tree storage: SQLite + specs/design/ on disk          │
└────────────────────────────────┬──────────────────────────────────┘
                                 │
                                 │ /api/* + SSE
                                 │
┌────────────────────────────────▼──────────────────────────────────┐
│                    specforge web (Next.js 16)                     │
│                                                                   │
│   left-rail tree: product / flows / screens                       │
│   detail view: three fidelity rungs side-by-side                  │
│   inherits from OD: comment mode, inspect mode, iframe preview    │
└───────────────────────────────────────────────────────────────────┘
```

---

## The three layers

| Layer | What | Where | Who authors |
|---|---|---|---|
| **A** — universal framework knowledge | PLG, EUREKA, BJ Fogg, Shape Up, Erik Kennedy, Nielsen-Norman, OOUX+DDD, Personal Anti-Patterns, MOAT, Atomic Design | `craft/plg-*.md` | Already done — see `references/` |
| **B** — per-product context | JTBD, MOAT outputs, journey, domain map, aesthetic, anti-patterns, tokens, components | `specs/design/_shared/` per product | Authored once per product by Guru with agent assistance |
| **C** — the surface | The fork itself: web, daemon, skills, contracts | The codebase | Claude Code in this fork |

---

## Decisions locked

The following were debated and decided during the design phase. **Don't relitigate** unless something fundamental changes.

### Scope decisions

- **PLG-specific, not general-purpose UX.** Internal tools, marketing-only sites, and one-shot transactional surfaces fall outside the framework's strong-form applicability. We say so explicitly when invoked on those.
- **Multi-mode, four mode skills** (not one branching skill). Sharper descriptions, better skill auto-load matching, smaller per-mode context.
- **Phase 1 outsources high-fi composing.** `plg-build` is Phase 2. Phase 1 hands low-fi + design system to OD's existing artifact loop and saves the result back into the tree.
- **Specforge is NOT a separate design tool.** It is the surface. Earlier in the discovery phase we considered building a Figma-like; that was replaced by the fork-OD plan.

### Architectural decisions

- **Fork OD, don't reuse unforked.** Option B over Option D. The integration depth required for our workflow makes "use OD alongside" untenable.
- **Layer A → OD's `craft/` files.** Their `craft/` system is structurally what we needed. We add `craft/plg-*.md` files alongside their existing craft.
- **Layer B → OD's `DESIGN.md` schema (9 sections).** Adopt VoltAgent's schema directly for `_shared/aesthetic.md`. Don't reinvent.
- **Artifact tree is net-new.** No structural equivalent in OD. We add tables (prefixed `spec_` / `plg_`), routes, and UI for it.
- **Standalone dev-server stays the deployment shape.** OD's daemon-plus-web architecture is what we want. No "design tool route mounted in the host app."
- **Stack-agnostic by output.** Specforge produces artifacts; downstream agents implement them in Elixir, Rust, Phoenix, Next.js, anything. The artifacts are stack-neutral specs.

### Schema decisions

- **Three scopes:** product / flow / screen. The schema enforces this hierarchy.
- **Three fidelity rungs:** breadboard / fat-marker / composed. Per `shape-up.md`, the agent and the surface refuse to skip rungs.
- **Object-map.json renamed to domain-map.json.** Top-level structure is bounded contexts, each with its own objects and events. Required fields: `kind: entity | value-object`, `aggregate: <root-id>`, `kind: command | query` on actions.
- **Erik's screen states taxonomy** is the enumerated set for `low-fi.json`'s `states` array.
- **Erik's Actions Checklist fields** (`confirmation-required`, `cancellable`, `undoable`, `feedback-on-success`, `feedback-on-failure`) are required on every command-kind action.
- **Default sizing tokens** ship in `_shared/tokens.json` per Erik's 5 main text sizes; products override.
- **PAI is a required field** on `journey.md`, distinct from First Strike (one-time) and KUI (habit threshold).
- **Schema v0.2 is the baseline.** v0.1 lives at `_meta/artifact-schema-v0.1.md` for diff reference.

### Aesthetic and product-shape decisions (Guru's positions)

- **Privacy-asymmetric.** Inspiration flows in (vetted); user data does not flow out.
- **Auth via OAuth/magic link/passkeys, outsourced** (Auth0, Clerk, etc.). RBAC is non-negotiable.
- **Decision-relief.** Configuration earns its place; defaults are the answer at v1.
- **Whitespace generous, motion only when it conveys state.**
- **Aesthetic is downstream of product context.** Default unstyled; named contemporary aesthetics rejected as defaults.
- **Notification centres, activity feeds, unread badges rejected** with prejudice.
- **Symmetry on pricing surfaces.** Cancel as easy as sign-up.
- **Free tier defaults:** delivers Beginner outcome, gates on KUI-aligned value metric, no time-bombed trials, no card up front, symmetric escape.
- **Inline editing for content; modal editing for entities.**
- **Multi-tenant workspaces only when data isolation is real.** Otherwise separate instances.

Full list and operational form in `references/personal-anti-patterns.md`.

### Process decisions

- **Build order:** finish Layer A → fork OD → set up `SPECFORGE.md` and `CLAUDE.md` → walk the codebase → plan additions → author Layer A as `craft/plg-*` files → first mode skill → schema migrations → UI → next mode skill → repeat.
- **Worked example:** specforge dogfoods itself. Its own `specs/design/_shared/` is the first authored Layer B.
- **Stitch persona prompt and Claude Desktop project starter pack** are Phase 3 deferrables.
- **Anti-patterns Batch 2** (design-tool-specific) was integrated into `personal-anti-patterns.md` as the "Specforge-specific anti-patterns" section. There is no separate Batch 2 to run.

---

## What's done

- 10 Layer A reference files (~2,450 lines), in `references/`
- v0.2 artifact schema doc (~860 lines), in `specs/design/_meta/artifact-schema.md`
- v0.1 archived for diff reference, at `specs/design/_meta/artifact-schema-v0.1.md`
- This handoff brief
- `SPECFORGE.md` template (added/modified files registry)
- `CLAUDE.md` addendum (session-level guidance)

---

## What's next

In order:

1. **Set up the fork.** Fork `nexu-io/open-design` to `<your-org>/specforge`. Clone locally. Add upstream remote. Get `pnpm tools-dev` running. (Manual, ~1–2 hours.)
2. **Drop in the bundle.** Copy the contents of this handoff into the fork: `references/`, `specs/design/_meta/`, `SPECFORGE.md`, `CLAUDE.md` (replacing OD's), this brief at `docs/specforge-handoff.md`.
3. **Walk OD's load-bearing files.** With Claude Code, read and summarise the seven files identified in the chat history:
   - `apps/daemon/src/prompts/system.ts` (the composer)
   - `apps/daemon/src/prompts/discovery.ts` (RULE 1/2/3)
   - `apps/daemon/src/prompts/official-system.ts` (the identity charter)
   - `apps/daemon/src/skills.ts` (skill loader)
   - `apps/daemon/src/db.ts` (SQLite schema)
   - `craft/README.md` plus 2–3 craft files (`anti-ai-slop.md`, `typography.md`, `state-coverage.md`)
   - `apps/daemon/src/lint-artifact.ts` (linter)
4. **Plan the additions concretely.** Locked in `SPECFORGE.md`'s tables; Claude Code fills in the "Status: TBD" entries with concrete deliverables.
5. **Author one PLG craft file** (`plg-foundations.md` first — closest to OD's existing craft conventions). Wire it into the prompt composer (one diff to `system.ts` with `// SPECFORGE-MOD:` marker). Test that a skill requiring `plg-foundations` gets the file injected.
6. **Author `plg-shape` skill.** Smallest possible: produces `product.md` only at first. Test end-to-end. Then extend to `journey.md`, then `sitemap.json`, then `domain-map.json`, then per-feature `shape.md`.
7. **Add the artifact tree schema.** SQLite migration. Daemon routes for tree listing. `packages/contracts` types. Web UI left-rail.
8. **Repeat for `plg-flow`.**
9. **Repeat for `plg-critique`.**
10. **Phase 2:** `plg-build`, full Layer B authoring for specforge itself, anti-pattern critique on shipped output, Stitch / Claude Desktop adapter formats.

Each step is its own commit (or PR if working with collaborators). Each step is testable. The ladder climbs.

---

## A note on respect for OD

OD is a real, well-architected codebase. We're forking it because the integration depth we need can't be achieved through external use. We're not "improving" it — we're extending it for a different use case (process-disciplined PLG product design vs. surface-shaped one-shot generation).

Stay generous with attribution. Their `craft/` architecture is brilliant and we're using it. Their prompt stack is mature and we're extending it. Their critique orchestrator is real engineering and we'll add to it rather than replace it. The `Apache-2.0` license permits all of this; the right *attitude* is gratitude.

If at any point our additions look broadly useful (the artifact tree, the multi-mode skill protocol, the PLG craft files), consider PR-ing back to upstream. The fork doesn't have to stay forever forked.
