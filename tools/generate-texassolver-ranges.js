#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const {
  buildIpOopRangesForPostflopScenario,
} = require("./range-pack-to-texassolver");

const ROOT = path.resolve(__dirname, "..");

main();

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printUsage();
    process.exit(0);
  }

  const errors = [];
  ["ipSpot", "oopSpot", "ipActions", "oopActions", "out"].forEach((key) => {
    if (!args[key]) {
      errors.push(`Missing required argument --${toKebab(key)}.`);
    }
  });

  if (errors.length) {
    errors.forEach((error) => console.error(`ERROR: ${error}`));
    printUsage();
    process.exit(1);
  }

  const outputPath = path.resolve(ROOT, args.out);
  if (fs.existsSync(outputPath) && !args.force) {
    console.error(`ERROR: Output already exists: ${path.relative(ROOT, outputPath)}. Pass --force to overwrite.`);
    process.exit(1);
  }

  let built;
  try {
    built = buildIpOopRangesForPostflopScenario({
      rootDir: path.resolve(ROOT, args.rootDir || path.join("data", "preflop-ranges")),
      spotId: args.spotId,
      ipSpotId: args.ipSpot,
      oopSpotId: args.oopSpot,
      ipActions: args.ipActions,
      oopActions: args.oopActions,
      allowDemo: Boolean(args.allowDemo),
    });
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  }

  const output = {
    spotId: built.spotId,
    generatedAt: new Date().toISOString(),
    sourcePackIds: built.sourcePackIds,
    sourcePackIsDemo: built.sourcePackIsDemo,
    usableAsRealTrainingData: built.usableAsRealTrainingData,
    ipRange: built.ipRange,
    oopRange: built.oopRange,
    warnings: built.warnings,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");

  built.warnings.forEach((warning) => console.warn(`WARN: ${warning}`));
  console.log(`Generated TexasSolver range JSON: ${path.relative(ROOT, outputPath)}`);
  if (!output.usableAsRealTrainingData) {
    console.log("Output is marked unusable as real training data.");
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

function toCamel(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function toKebab(value) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function printUsage() {
  console.log(`Usage:
  node tools/generate-texassolver-ranges.js --ip-spot <spotId> --oop-spot <spotId> --ip-actions raise --oop-actions call,threeBet --out data/texassolver/generated-ranges/<file>.json

Options:
  --allow-demo   Permit disabled demo/unusable source packs for smoke-test output only
  --force        Overwrite existing output
  --spot-id      Optional output spot id
  --root-dir     Optional range-pack root, default data/preflop-ranges`);
}
