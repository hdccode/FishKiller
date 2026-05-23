#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_RANGE_ROOT = path.join(ROOT, "data", "preflop-ranges");
const RANKS = "AKQJT98765432";
const VALID_SOURCE_TYPES = new Set(["demo", "manual", "generated", "licensed"]);

function normalizeHandClass(hand) {
  if (typeof hand !== "string" || !hand.trim()) {
    throw new Error("Hand class must be a non-empty string.");
  }

  const value = hand.trim().toUpperCase().replace(/S$/, "s").replace(/O$/, "o");
  if (/^([AKQJT98765432])\1$/.test(value)) {
    return value;
  }

  const match = value.match(/^([AKQJT98765432])([AKQJT98765432])([so])$/);
  if (!match) {
    if (/^[AKQJT98765432]{2}$/.test(value)) {
      throw new Error(`Hand class "${hand}" is not explicit. Use suited/offsuit notation like AKs or AKo.`);
    }
    throw new Error(`Invalid hand class "${hand}". Use pairs like AA, suited like A5s, or offsuit like KQo.`);
  }

  const first = match[1];
  const second = match[2];
  const suffix = match[3];
  if (first === second) {
    throw new Error(`Invalid hand class "${hand}". Pairs must not include suited/offsuit suffixes.`);
  }

  return rankIndex(first) <= rankIndex(second)
    ? `${first}${second}${suffix}`
    : `${second}${first}${suffix}`;
}

function validateHandClass(hand) {
  try {
    const normalized = normalizeHandClass(hand);
    return { valid: true, normalized };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

function actionFrequencyToWeight(strategyEntry, actionNames) {
  if (!strategyEntry || typeof strategyEntry !== "object" || Array.isArray(strategyEntry)) {
    throw new Error("Strategy entry must be an object keyed by action name.");
  }

  const names = normalizeActionNames(actionNames);
  let total = 0;

  names.forEach((name) => {
    const raw = strategyEntry[name] ?? 0;
    if (typeof raw !== "number" || !Number.isFinite(raw)) {
      throw new Error(`Action "${name}" frequency must be a finite number.`);
    }
    if (raw < 0 || raw > 1) {
      throw new Error(`Action "${name}" frequency ${raw} is outside 0..1.`);
    }
    total += raw;
  });

  return round(Math.min(1, total));
}

function buildTexasSolverRangeString(rangePackSpot, actionNames) {
  if (!rangePackSpot || typeof rangePackSpot !== "object") {
    throw new Error("Range-pack spot is required.");
  }
  if (!rangePackSpot.actionsByHand || typeof rangePackSpot.actionsByHand !== "object") {
    throw new Error(`Spot ${rangePackSpot.spotId || "(unknown)"} is missing actionsByHand.`);
  }

  const warnings = [];
  const entries = [];

  Object.entries(rangePackSpot.actionsByHand).forEach(([hand, strategyEntry]) => {
    const normalized = normalizeHandClass(hand);
    if (normalized !== hand) {
      warnings.push(`Normalized hand class ${hand} to ${normalized}.`);
    }

    const weight = actionFrequencyToWeight(strategyEntry, actionNames);
    if (weight <= 0) {
      return;
    }

    entries.push(weight === 1 ? normalized : `${normalized}:${formatWeight(weight)}`);
  });

  return {
    range: entries.join(","),
    entries,
    warnings,
  };
}

function loadRangePacks(rootDir = DEFAULT_RANGE_ROOT) {
  const directories = ["demo", "real"];
  const packs = [];

  directories.forEach((directory) => {
    const folder = path.resolve(rootDir, directory);
    if (!fs.existsSync(folder)) {
      return;
    }

    fs.readdirSync(folder)
      .filter((fileName) => fileName.endsWith(".preflop-range.json"))
      .sort()
      .forEach((fileName) => {
        const filePath = path.join(folder, fileName);
        const pack = JSON.parse(fs.readFileSync(filePath, "utf8"));
        packs.push({
          pack,
          filePath,
          folderType: directory,
        });
      });
  });

  return packs;
}

function findSpot(packs, spotId) {
  for (const entry of packs) {
    const spot = (entry.pack.spots || []).find((candidate) => candidate.spotId === spotId);
    if (spot) {
      return { pack: entry.pack, spot, filePath: entry.filePath, folderType: entry.folderType };
    }
  }
  return null;
}

function buildIpOopRangesForPostflopScenario(options = {}) {
  const rootDir = options.rootDir || DEFAULT_RANGE_ROOT;
  const packs = options.packs || loadRangePacks(rootDir);
  const warnings = [];
  const ip = findSpot(packs, options.ipSpotId);
  const oop = findSpot(packs, options.oopSpotId);

  if (!ip) {
    throw new Error(`IP spot not found: ${options.ipSpotId}`);
  }
  if (!oop) {
    throw new Error(`OOP spot not found: ${options.oopSpotId}`);
  }

  const sourceEntries = [ip, oop];
  const unsafeSources = sourceEntries.filter(({ pack }) => isDemoOrUnusable(pack));
  if (unsafeSources.length && !options.allowDemo) {
    const packIds = [...new Set(unsafeSources.map(({ pack }) => pack.packId))].join(", ");
    throw new Error(`Range source is demo or unusable (${packIds}). Pass --allow-demo only for smoke tests.`);
  }

  const ipBuilt = buildTexasSolverRangeString(ip.spot, options.ipActions);
  const oopBuilt = buildTexasSolverRangeString(oop.spot, options.oopActions);
  warnings.push(...ipBuilt.warnings.map((warning) => `IP ${warning}`));
  warnings.push(...oopBuilt.warnings.map((warning) => `OOP ${warning}`));

  if (!ipBuilt.range) {
    throw new Error(`IP spot ${options.ipSpotId} produced an empty TexasSolver range.`);
  }
  if (!oopBuilt.range) {
    throw new Error(`OOP spot ${options.oopSpotId} produced an empty TexasSolver range.`);
  }

  const sourcePackIds = [...new Set(sourceEntries.map(({ pack }) => pack.packId))];
  const sourcePackIsDemo = sourceEntries.some(({ pack }) => pack.sourceType === "demo");
  const usableAsRealTrainingData = sourceEntries.every(
    ({ pack }) => pack.sourceType !== "demo" && pack.enabled === true && pack.usableAsRealTrainingData === true
  );

  return {
    spotId: options.spotId || deriveScenarioId(options.ipSpotId, options.oopSpotId),
    sourcePackIds,
    sourcePackIsDemo,
    usableAsRealTrainingData,
    ipRange: ipBuilt.range,
    oopRange: oopBuilt.range,
    warnings,
  };
}

function validatePackMetadata(pack) {
  const errors = [];
  ["packId", "name", "sourceType", "enabled", "usableAsRealTrainingData", "spots"].forEach((key) => {
    if (!(key in pack)) {
      errors.push(`Pack is missing required field: ${key}`);
    }
  });

  if (pack.sourceType && !VALID_SOURCE_TYPES.has(pack.sourceType)) {
    errors.push(`Pack ${pack.packId || "(unknown)"} has invalid sourceType: ${pack.sourceType}`);
  }

  return errors;
}

function normalizeActionNames(actionNames) {
  if (Array.isArray(actionNames)) {
    return actionNames.map(String).map((item) => item.trim()).filter(Boolean);
  }
  if (typeof actionNames === "string") {
    return actionNames.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function isDemoOrUnusable(pack) {
  return pack.sourceType === "demo" || pack.usableAsRealTrainingData !== true || pack.enabled !== true;
}

function deriveScenarioId(ipSpotId, oopSpotId) {
  return [ipSpotId, oopSpotId]
    .filter(Boolean)
    .join("__")
    .replace(/[^a-zA-Z0-9_]+/g, "_")
    .replace(/_+/g, "_");
}

function rankIndex(rank) {
  return RANKS.indexOf(rank);
}

function round(value) {
  return Math.round(value * 1000000) / 1000000;
}

function formatWeight(value) {
  return String(round(value)).replace(/0+$/, "").replace(/\.$/, "");
}

module.exports = {
  VALID_SOURCE_TYPES,
  actionFrequencyToWeight,
  buildIpOopRangesForPostflopScenario,
  buildTexasSolverRangeString,
  findSpot,
  isDemoOrUnusable,
  loadRangePacks,
  normalizeActionNames,
  normalizeHandClass,
  validateHandClass,
  validatePackMetadata,
};
