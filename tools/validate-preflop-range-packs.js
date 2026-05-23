#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const {
  VALID_SOURCE_TYPES,
  loadRangePacks,
  validateHandClass,
  validatePackMetadata,
} = require("./range-pack-to-texassolver");

const ROOT = path.resolve(__dirname, "..");
const RANGE_ROOT = path.join(ROOT, "data", "preflop-ranges");
const REPORT_PATH = path.join(RANGE_ROOT, "validation-report.json");
const FREQUENCY_TOLERANCE = 0.001;
const CANONICAL_HAND_CLASSES = buildCanonicalHandClasses();

main();

function main() {
  ensureRangeFolders();

  const errors = [];
  const warnings = [];
  let packs = [];
  const summary = {
    packs: packs.length,
    spots: 0,
    demoPacks: 0,
    realPacks: 0,
    completeSpots: 0,
  };
  const seenSpotIds = new Map();

  try {
    packs = loadRangePacks(RANGE_ROOT);
    summary.packs = packs.length;
  } catch (error) {
    errors.push(`Could not load preflop range packs. Check JSON syntax. ${error.message}`);
  }

  packs.forEach((entry) => validatePackEntry(entry, summary, errors, warnings, seenSpotIds));

  if (!packs.length) {
    warnings.push("No preflop range packs found.");
  }

  const report = {
    generatedAt: new Date().toISOString(),
    summary,
    errors,
    warnings,
    packs: packs.map((entry) => ({
      packId: entry.pack.packId || null,
      sourceType: entry.pack.sourceType || null,
      enabled: entry.pack.enabled,
      usableAsRealTrainingData: entry.pack.usableAsRealTrainingData,
      file: path.relative(ROOT, entry.filePath),
      spotCount: Array.isArray(entry.pack.spots) ? entry.pack.spots.length : 0,
    })),
  };

  fs.mkdirSync(RANGE_ROOT, { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  warnings.forEach((warning) => console.warn(`WARN: ${warning}`));
  if (errors.length) {
    errors.forEach((error) => console.error(`ERROR: ${error}`));
    console.error(`Preflop range-pack validation failed (${errors.length} error${errors.length === 1 ? "" : "s"}).`);
    process.exit(1);
  }

  console.log(
    `Preflop range-pack validation passed: ${summary.packs} pack${summary.packs === 1 ? "" : "s"}, ` +
      `${summary.spots} spot${summary.spots === 1 ? "" : "s"}, ${warnings.length} warning${warnings.length === 1 ? "" : "s"}.`
  );
  console.log(`Report written to ${path.relative(ROOT, REPORT_PATH)}`);
}

function ensureRangeFolders() {
  fs.mkdirSync(path.join(RANGE_ROOT, "demo"), { recursive: true });
  fs.mkdirSync(path.join(RANGE_ROOT, "real"), { recursive: true });
}

function validatePackEntry(entry, summary, errors, warnings, seenSpotIds) {
  const { pack, filePath, folderType } = entry;
  const label = pack.packId || path.relative(ROOT, filePath);

  validatePackMetadata(pack).forEach((error) => errors.push(`${label}: ${error}`));

  if (pack.sourceType === "demo") {
    summary.demoPacks += 1;
    if (pack.enabled !== false) {
      errors.push(`${label}: demo packs must have enabled false.`);
    }
    if (pack.usableAsRealTrainingData !== false) {
      errors.push(`${label}: demo packs must have usableAsRealTrainingData false.`);
    }
  } else {
    summary.realPacks += 1;
    if (folderType === "demo") {
      warnings.push(`${label}: non-demo pack is stored under the demo folder.`);
    }
  }

  if (folderType === "real" && pack.sourceType === "demo") {
    errors.push(`${label}: demo sourceType is not allowed in data/preflop-ranges/real.`);
  }

  if (pack.sourceType && !VALID_SOURCE_TYPES.has(pack.sourceType)) {
    errors.push(`${label}: sourceType must be one of ${Array.from(VALID_SOURCE_TYPES).join(", ")}.`);
  }

  if (!Array.isArray(pack.spots)) {
    errors.push(`${label}: spots must be an array.`);
    return;
  }

  summary.spots += pack.spots.length;
  pack.spots.forEach((spot, index) => {
    validateUniqueSpotId(spot, label, entry.filePath, seenSpotIds, errors);
    validateSpot(spot, `${label}.spots[${index}]`, errors, warnings, summary);
  });
}

function validateUniqueSpotId(spot, packLabel, filePath, seenSpotIds, errors) {
  if (!spot?.spotId) {
    return;
  }

  const previous = seenSpotIds.get(spot.spotId);
  const current = `${packLabel} (${path.relative(ROOT, filePath)})`;
  if (previous) {
    errors.push(`Duplicate spotId "${spot.spotId}" found in ${current}; already used in ${previous}.`);
    return;
  }

  seenSpotIds.set(spot.spotId, current);
}

function validateSpot(spot, label, errors, warnings, summary) {
  if (!spot || typeof spot !== "object" || Array.isArray(spot)) {
    errors.push(`${label}: spot must be an object.`);
    return;
  }

  ["spotId", "tableSize", "stackDepthBb", "heroPosition", "actionContext", "legalActions", "actionsByHand"].forEach((key) => {
    if (!(key in spot)) {
      errors.push(`${label}: missing required field ${key}.`);
    }
  });

  if ("tableSize" in spot && (!Number.isFinite(spot.tableSize) || spot.tableSize <= 0)) {
    errors.push(`${label}: tableSize must be a positive number.`);
  }
  if ("stackDepthBb" in spot && (!Number.isFinite(spot.stackDepthBb) || spot.stackDepthBb <= 0)) {
    errors.push(`${label}: stackDepthBb must be a positive number.`);
  }

  const legalActionIds = validateLegalActions(spot.legalActions, label, errors);

  if (!spot.actionsByHand || typeof spot.actionsByHand !== "object" || Array.isArray(spot.actionsByHand)) {
    errors.push(`${label}: actionsByHand must be an object.`);
    return;
  }

  const normalizedHands = new Set();
  Object.entries(spot.actionsByHand).forEach(([handClass, strategyEntry]) => {
    const handLabel = `${label}.actionsByHand.${handClass}`;
    const handResult = validateHandClass(handClass);
    if (!handResult.valid) {
      errors.push(`${handLabel}: ${handResult.error}`);
    } else {
      if (normalizedHands.has(handResult.normalized)) {
        errors.push(`${handLabel}: duplicate canonical hand class ${handResult.normalized}.`);
      }
      normalizedHands.add(handResult.normalized);
    }

    validateStrategyEntry(strategyEntry, handLabel, errors, warnings, legalActionIds);
  });

  if (spot.complete === true || spot.isCompleteRange === true) {
    summary.completeSpots += 1;
    validateCompleteHandCoverage(normalizedHands, label, errors);
  }
}

function validateLegalActions(legalActions, label, errors) {
  const ids = new Set();
  if (!Array.isArray(legalActions) || !legalActions.length) {
    errors.push(`${label}: legalActions must be a non-empty array.`);
    return ids;
  }

  legalActions.forEach((action, index) => {
    const actionLabel = `${label}.legalActions[${index}]`;
    if (!action || typeof action !== "object" || Array.isArray(action)) {
      errors.push(`${actionLabel}: legal action must be an object.`);
      return;
    }

    if (!action.id || typeof action.id !== "string") {
      errors.push(`${actionLabel}: legal action is missing string id.`);
      return;
    }

    if (ids.has(action.id)) {
      errors.push(`${actionLabel}: duplicate legal action id "${action.id}".`);
    }
    ids.add(action.id);
  });

  return ids;
}

function validateCompleteHandCoverage(normalizedHands, label, errors) {
  const expected = new Set(CANONICAL_HAND_CLASSES);
  CANONICAL_HAND_CLASSES.forEach((handClass) => {
    if (!normalizedHands.has(handClass)) {
      errors.push(`${label}: complete spot is missing hand class ${handClass}.`);
    }
  });

  normalizedHands.forEach((handClass) => {
    if (!expected.has(handClass)) {
      errors.push(`${label}: complete spot has unknown hand class ${handClass}.`);
    }
  });
}

function validateStrategyEntry(strategyEntry, label, errors, warnings, legalActionIds) {
  if (!strategyEntry || typeof strategyEntry !== "object" || Array.isArray(strategyEntry)) {
    errors.push(`${label}: strategy entry must be an object keyed by action.`);
    return;
  }

  const entries = Object.entries(strategyEntry);
  if (!entries.length) {
    errors.push(`${label}: strategy entry has no actions.`);
    return;
  }

  let total = 0;
  entries.forEach(([actionName, frequency]) => {
    if (!actionName.trim()) {
      errors.push(`${label}: action names must be non-empty.`);
    }
    if (legalActionIds.size && !legalActionIds.has(actionName)) {
      errors.push(`${label}.${actionName}: action is not listed in legalActions.`);
    }
    if (typeof frequency !== "number" || !Number.isFinite(frequency)) {
      errors.push(`${label}.${actionName}: frequency must be a finite number.`);
      return;
    }
    if (frequency < 0 || frequency > 1) {
      errors.push(`${label}.${actionName}: frequency ${frequency} is outside 0..1.`);
    }
    total += frequency;
  });

  if (Math.abs(total - 1) > FREQUENCY_TOLERANCE) {
    errors.push(`${label}: action frequencies sum to ${round(total)}, expected 1.`);
  } else if (Math.abs(total - 1) > 0) {
    warnings.push(`${label}: action frequencies sum to ${round(total)} within tolerance.`);
  }
}

function round(value) {
  return Math.round(value * 1000000) / 1000000;
}

function buildCanonicalHandClasses() {
  const ranks = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
  const hands = [];
  ranks.forEach((rank) => hands.push(`${rank}${rank}`));

  for (let first = 0; first < ranks.length; first += 1) {
    for (let second = first + 1; second < ranks.length; second += 1) {
      hands.push(`${ranks[first]}${ranks[second]}s`);
    }
  }

  for (let first = 0; first < ranks.length; first += 1) {
    for (let second = first + 1; second < ranks.length; second += 1) {
      hands.push(`${ranks[first]}${ranks[second]}o`);
    }
  }

  return hands;
}
