import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { parseFrontmatter } from "../packages/plugin-runtime/src/parsers/frontmatter.ts";

// Specforge spec-tree lint: enforces the screen-ownership invariant declared in
// specs/design/_meta/artifact-schema.md §3 / §7.1 — each screen has exactly one
// owning feature (its shape.md `owns-screens`). This is the cross-feature check
// no OD lint covers, since it reasons over the whole specs/design/ tree at once.
// It skips silently when there is no specs/design/ tree (e.g. upstream OD).

const repoRoot = path.resolve(import.meta.dirname, "..");
const designRoot = path.join(repoRoot, "specs", "design");
const sitemapPath = path.join(designRoot, "_shared", "sitemap.json");
const featuresRoot = path.join(designRoot, "features");

export type OwnershipViolation = { kind: string; message: string };

type FeatureOwnership = {
  feature: string;
  shapePath: string;
  ownsScreens: string[];
  declared: boolean;
};

function rel(p: string): string {
  return path.relative(repoRoot, p);
}

/** All screen ids the sitemap declares, across every page node. Null when there is no sitemap. */
async function collectSitemapScreens(): Promise<Set<string> | null> {
  let raw: string;
  try {
    raw = await readFile(sitemapPath, "utf8");
  } catch {
    return null;
  }
  const sitemap = JSON.parse(raw) as { nodes?: Array<{ screens?: string[] }> };
  const screens = new Set<string>();
  for (const node of sitemap.nodes ?? []) {
    for (const screen of node.screens ?? []) screens.add(screen);
  }
  return screens;
}

/** Every features/<slug>/shape.md and the owns-screens it declares. */
async function collectFeatureOwnership(): Promise<FeatureOwnership[]> {
  let entries;
  try {
    entries = await readdir(featuresRoot, { withFileTypes: true });
  } catch {
    return [];
  }
  const result: FeatureOwnership[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const shapePath = path.join(featuresRoot, entry.name, "shape.md");
    let source: string;
    try {
      source = await readFile(shapePath, "utf8");
    } catch {
      continue; // feature folder without a shape.md yet
    }
    const { data } = parseFrontmatter(source);
    const raw = data["owns-screens"];
    const declared = raw !== undefined;
    const ownsScreens = Array.isArray(raw)
      ? raw.filter((value): value is string => typeof value === "string")
      : [];
    result.push({ feature: entry.name, shapePath, ownsScreens, declared });
  }
  return result;
}

export function findOwnershipViolations(
  sitemapScreens: Set<string>,
  features: FeatureOwnership[],
): OwnershipViolation[] {
  const violations: OwnershipViolation[] = [];
  const owners = new Map<string, string[]>();

  for (const feature of features) {
    if (!feature.declared) {
      violations.push({
        kind: "missing",
        message: `${rel(feature.shapePath)}: no owns-screens field — every feature must declare it (use [] only if it genuinely owns no surface).`,
      });
      continue;
    }
    for (const screen of feature.ownsScreens) {
      const list = owners.get(screen) ?? [];
      list.push(feature.feature);
      owners.set(screen, list);
    }
  }

  for (const [screen, feats] of owners) {
    if (feats.length > 1) {
      violations.push({
        kind: "duplicate-owner",
        message: `${screen} is owned by ${feats.length} features (${feats.join(", ")}) — a screen has exactly one canonical home (§3/§7.1).`,
      });
    }
  }

  for (const screen of owners.keys()) {
    if (!sitemapScreens.has(screen)) {
      violations.push({
        kind: "ghost",
        message: `${screen} is listed in owns-screens but does not exist in sitemap.json — fix the id, or add the page/screen to the sitemap.`,
      });
    }
  }

  const owned = new Set(owners.keys());
  for (const screen of sitemapScreens) {
    if (!owned.has(screen)) {
      violations.push({
        kind: "orphan",
        message: `${screen} exists in sitemap.json but no feature declares it in owns-screens — assign it to its owning feature.`,
      });
    }
  }

  return violations;
}

export async function checkSpecOwnership(): Promise<boolean> {
  const sitemapScreens = await collectSitemapScreens();
  if (sitemapScreens === null) {
    console.log("Spec screen-ownership check skipped: no specs/design/_shared/sitemap.json.");
    return true;
  }

  const features = await collectFeatureOwnership();
  const violations = findOwnershipViolations(sitemapScreens, features);

  if (violations.length > 0) {
    console.error("Spec screen-ownership check failed:");
    for (const violation of violations) {
      console.error(`- [${violation.kind}] ${violation.message}`);
    }
    console.error(
      "Rule: each screen has exactly one owning feature via shape.md owns-screens; see specs/design/_meta/artifact-schema.md §7.1.",
    );
    return false;
  }

  const declarations = features.reduce((total, feature) => total + feature.ownsScreens.length, 0);
  console.log(
    `Spec screen-ownership check passed: ${sitemapScreens.size} sitemap screens each owned by exactly one of ${features.length} features (${declarations} ownership declarations).`,
  );
  return true;
}

const isMain = process.argv[1] ? import.meta.url === pathToFileURL(process.argv[1]).href : false;
if (isMain && !(await checkSpecOwnership())) {
  process.exitCode = 1;
}
