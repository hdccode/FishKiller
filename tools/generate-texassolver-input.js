#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const HAND_WRITTEN_K72_INPUT = path.join(ROOT, "data", "texassolver", "btn_bb_srp_100bb_k72r_input.txt");
const CARD_RE = /^[2-9TJQKA][cdhs]$/i;

main();

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printUsage();
    process.exit(0);
  }

  const errors = validateRequiredArgs(args);
  if (errors.length) {
    finishWithErrors(errors, true);
  }

  const outputPath = path.resolve(ROOT, args.out);
  if (path.normalize(outputPath) === path.normalize(HAND_WRITTEN_K72_INPUT)) {
    finishWithErrors(["Refusing to overwrite the hand-written K72r TexasSolver input file."], false);
  }

  if (fs.existsSync(outputPath) && !args.force) {
    finishWithErrors([`Output already exists: ${formatPath(outputPath)}. Pass --force to overwrite.`], false);
  }

  const rangePath = path.resolve(ROOT, args.ranges);
  if (!fs.existsSync(rangePath)) {
    finishWithErrors([`Range JSON not found: ${args.ranges}`], false);
  }

  let ranges;
  try {
    ranges = JSON.parse(fs.readFileSync(rangePath, "utf8"));
  } catch (error) {
    finishWithErrors([`Could not parse range JSON: ${error.message}`], false);
  }

  const validationErrors = validateInputs(args, ranges);
  if (validationErrors.length) {
    finishWithErrors(validationErrors, false);
  }

  const isUnsafeSource = ranges.sourcePackIsDemo === true || ranges.usableAsRealTrainingData !== true;
  if (isUnsafeSource && !args.allowDemo) {
    finishWithErrors(["Range JSON is demo or unusable as real training data. Pass --allow-demo only for smoke tests."], false);
  }

  const rawOutPath = resolveRawOutputPath(args, isUnsafeSource);
  const namingErrors = validateUnsafeNaming({
    isUnsafeSource,
    outputPath,
    rawOutPath,
    forceRealLookingDemoName: Boolean(args.forceRealLookingDemoName),
  });
  if (namingErrors.length) {
    finishWithErrors(namingErrors, false);
  }

  const text = buildInputFile({
    treeId: args.treeId,
    board: normalizeBoard(args.board),
    pot: Number(args.pot),
    effectiveStack: Number(args.effectiveStack),
    ipRange: ranges.ipRange.trim(),
    oopRange: ranges.oopRange.trim(),
    rawOutPath,
    threads: Number(args.threads || 8),
    accuracy: Number(args.accuracy || 0.5),
    maxIteration: Number(args.maxIteration || 1000),
    printInterval: Number(args.printInterval || 25),
    isUnsafeSource,
    ranges,
    rangePath,
  });

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, text, "utf8");

  console.log(`Generated TexasSolver input: ${formatPath(outputPath)}`);
  console.log(`dump_result: ${formatPath(rawOutPath)}`);
  if (isUnsafeSource) {
    console.log("Generated input is marked demo/unusable and must not be used as real training data.");
  }
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--help" || token === "-h") {
      args.help = true;
      continue;
    }

    if (!token.startsWith("--")) {
      continue;
    }

    const key = toCamel(token.slice(2));
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      index += 1;
    }
  }
  return args;
}

function validateRequiredArgs(args) {
  const errors = [];
  ["treeId", "board", "pot", "effectiveStack", "ranges", "out"].forEach((key) => {
    if (!args[key]) {
      errors.push(`Missing required argument --${toKebab(key)}.`);
    }
  });
  return errors;
}

function validateInputs(args, ranges) {
  const errors = [];
  const boardCards = normalizeBoard(args.board).split(",");

  if (!/^[a-zA-Z0-9_-]+$/.test(args.treeId || "")) {
    errors.push("--tree-id may only contain letters, numbers, underscores, and dashes.");
  }

  if (boardCards.length !== 3) {
    errors.push(`--board must contain exactly 3 flop cards; received ${boardCards.length}.`);
  }

  const seen = new Set();
  boardCards.forEach((card) => {
    if (!CARD_RE.test(card)) {
      errors.push(`Invalid board card "${card}". Use notation like Ks,7d,2c.`);
      return;
    }
    const key = card.toLowerCase();
    if (seen.has(key)) {
      errors.push(`Duplicate board card: ${card}`);
    }
    seen.add(key);
  });

  validatePositiveNumber(args, "pot", errors);
  validatePositiveNumber(args, "effectiveStack", errors);
  validatePositiveNumber(args, "threads", errors, { integer: true, optional: true });
  validatePositiveNumber(args, "accuracy", errors, { optional: true });
  validatePositiveNumber(args, "maxIteration", errors, { integer: true, optional: true });
  validatePositiveNumber(args, "printInterval", errors, { integer: true, optional: true });

  if (!ranges || typeof ranges !== "object" || Array.isArray(ranges)) {
    errors.push("Range JSON must be an object.");
    return errors;
  }

  if (typeof ranges.ipRange !== "string" || !ranges.ipRange.trim()) {
    errors.push("Range JSON must contain a non-empty ipRange string.");
  }
  if (typeof ranges.oopRange !== "string" || !ranges.oopRange.trim()) {
    errors.push("Range JSON must contain a non-empty oopRange string.");
  }

  return errors;
}

function validatePositiveNumber(args, key, errors, options = {}) {
  if (options.optional && args[key] === undefined) {
    return;
  }

  const value = Number(args[key]);
  if (!Number.isFinite(value) || value <= 0) {
    errors.push(`--${toKebab(key)} must be a positive number.`);
    return;
  }

  if (options.integer && !Number.isInteger(value)) {
    errors.push(`--${toKebab(key)} must be an integer.`);
  }
}

function resolveRawOutputPath(args, isUnsafeSource) {
  if (args.rawOut) {
    return path.resolve(ROOT, args.rawOut);
  }

  const suffix = isUnsafeSource ? ".demo.json" : ".json";
  return path.join(ROOT, "data", "texassolver", "raw", `${args.treeId}${suffix}`);
}

function validateUnsafeNaming({ isUnsafeSource, outputPath, rawOutPath, forceRealLookingDemoName }) {
  if (!isUnsafeSource || forceRealLookingDemoName) {
    return [];
  }

  const errors = [];
  if (!pathStringContainsDemoMarker(outputPath)) {
    errors.push('Demo/unusable generated input path must contain ".demo." unless --force-real-looking-demo-name is passed.');
  }
  if (!pathStringContainsDemoMarker(rawOutPath)) {
    errors.push('Demo/unusable dump_result path must contain ".demo." unless --force-real-looking-demo-name is passed.');
  }
  return errors;
}

function pathStringContainsDemoMarker(filePath) {
  return normalizeSlashes(filePath).toLowerCase().includes(".demo.");
}

function buildInputFile({
  treeId,
  board,
  pot,
  effectiveStack,
  ipRange,
  oopRange,
  rawOutPath,
  threads,
  accuracy,
  maxIteration,
  printInterval,
  isUnsafeSource,
  ranges,
  rangePath,
}) {
  const header = isUnsafeSource
    ? [
        "# WARNING: demo/unusable range data only.",
        "# usableAsRealTrainingData false",
        `# sourcePackIsDemo ${ranges.sourcePackIsDemo === true}`,
        "# This generated input is for smoke tests only. Do not run it as a real solve.",
      ]
    : [
        "# FishKiller TexasSolver input",
        "# usableAsRealTrainingData true",
        `# sourcePackIds ${(ranges.sourcePackIds || []).join(",") || "unknown"}`,
      ];

  return [
    ...header,
    `# treeId ${treeId}`,
    `# ranges ${formatPath(rangePath)}`,
    `set_pot ${formatNumber(pot)}`,
    `set_effective_stack ${formatNumber(effectiveStack)}`,
    `set_board ${board}`,
    `set_range_oop ${oopRange}`,
    `set_range_ip ${ipRange}`,
    ...buildCompactMvpBetTree(),
    "set_allin_threshold 0.67",
    "build_tree",
    `set_thread_num ${threads}`,
    `set_accuracy ${formatNumber(accuracy)}`,
    `set_max_iteration ${maxIteration}`,
    `set_print_interval ${printInterval}`,
    "set_use_isomorphism 1",
    "start_solve",
    "set_dump_rounds 1",
    `dump_result ${formatPath(rawOutPath)}`,
    "",
  ].join("\n");
}

function buildCompactMvpBetTree() {
  return [
    "set_bet_sizes oop,flop,bet,33,75",
    "set_bet_sizes oop,flop,raise,50",
    "set_bet_sizes oop,flop,allin",
    "set_bet_sizes ip,flop,bet,33,75",
    "set_bet_sizes ip,flop,raise,50",
    "set_bet_sizes ip,flop,allin",
    "set_bet_sizes oop,turn,bet,66,125",
    "set_bet_sizes oop,turn,donk,66",
    "set_bet_sizes oop,turn,raise,50",
    "set_bet_sizes oop,turn,allin",
    "set_bet_sizes ip,turn,bet,66,125",
    "set_bet_sizes ip,turn,raise,50",
    "set_bet_sizes ip,turn,allin",
    "set_bet_sizes oop,river,bet,75",
    "set_bet_sizes oop,river,donk,75",
    "set_bet_sizes oop,river,raise,50",
    "set_bet_sizes oop,river,allin",
    "set_bet_sizes ip,river,bet,75",
    "set_bet_sizes ip,river,raise,50",
    "set_bet_sizes ip,river,allin",
  ];
}

function normalizeBoard(board) {
  return String(board || "")
    .split(",")
    .map((card) => card.trim())
    .filter(Boolean)
    .join(",");
}

function formatPath(filePath) {
  const resolved = path.resolve(filePath);
  const relative = path.relative(ROOT, resolved);
  if (relative && !relative.startsWith("..") && !path.isAbsolute(relative)) {
    return normalizeSlashes(relative);
  }
  return normalizeSlashes(resolved);
}

function normalizeSlashes(value) {
  return String(value).replace(/\\/g, "/");
}

function formatNumber(value) {
  return String(Number(value)).replace(/\.0+$/, "");
}

function finishWithErrors(errors, showUsage) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  if (showUsage) {
    printUsage();
  }
  process.exit(1);
}

function toCamel(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function toKebab(value) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function printUsage() {
  console.log(`Usage:
  node tools/generate-texassolver-input.js --tree-id btn_bb_srp_100bb_k72r --board Ks,7d,2c --pot 5.5 --effective-stack 97.5 --ranges data/texassolver/generated-ranges/<ranges>.json --out data/texassolver/generated-inputs/<tree>.txt

Options:
  --raw-out <file>                  Optional dump_result override
  --threads <n>                     Default 8
  --accuracy <n>                    Default 0.5
  --max-iteration <n>               Default 1000
  --print-interval <n>              Default 25
  --allow-demo                      Allow demo/unusable range JSON for smoke tests only
  --force                           Overwrite generated input output
  --force-real-looking-demo-name    Permit demo/unusable paths without ".demo." marker`);
}
