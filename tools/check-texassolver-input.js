#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const REQUIRED_COMMANDS = [
  "set_pot",
  "set_effective_stack",
  "set_board",
  "set_range_oop",
  "set_range_ip",
  "build_tree",
  "start_solve",
  "dump_result",
];
const CARD_RE = /^[2-9TJQKA][cdhs]$/i;
const RANGE_TOKEN_RE = /^([2-9TJQKA]{2}[so]?|[2-9TJQKA][cdhs][2-9TJQKA][cdhs])(?:\:(0(?:\.\d+)?|1(?:\.0+)?))?$/i;

main();

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.input) {
    printUsage();
    process.exit(args.help ? 0 : 1);
  }

  const inputPath = path.resolve(ROOT, args.input);
  const allowExistingOutput = Boolean(args.allowExistingOutput);
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(inputPath)) {
    errors.push(`Input file not found: ${args.input}`);
    finish(errors, warnings);
  }

  const text = fs.readFileSync(inputPath, "utf8");
  const commands = parseCommandFile(text);

  validateRequiredCommands(commands, errors);
  validateDemoSafety(text, commands, errors);
  validateNumericCommand(commands, "set_pot", errors);
  validateNumericCommand(commands, "set_effective_stack", errors);
  validateBoard(commands, errors);
  validateRange(commands, "set_range_ip", warnings, errors);
  validateRange(commands, "set_range_oop", warnings, errors);
  validateOutputPath(commands, allowExistingOutput, warnings, errors);

  finish(errors, warnings, inputPath);
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

function parseCommandFile(text) {
  const commands = new Map();
  text.split(/\r?\n/).forEach((rawLine, lineIndex) => {
    const lineWithoutInlineComment = rawLine.replace(/\s+#.*$/, "").trim();
    if (!lineWithoutInlineComment || lineWithoutInlineComment.startsWith("#")) {
      return;
    }

    const match = lineWithoutInlineComment.match(/^(\S+)(?:\s+(.*))?$/);
    if (!match) {
      return;
    }

    const command = match[1];
    const value = (match[2] || "").trim();
    if (!commands.has(command)) {
      commands.set(command, []);
    }
    commands.get(command).push({ value, line: lineIndex + 1, raw: rawLine });
  });
  return commands;
}

function validateRequiredCommands(commands, errors) {
  REQUIRED_COMMANDS.forEach((command) => {
    if (!commands.has(command)) {
      errors.push(`Missing required command: ${command}`);
      return;
    }

    if (!["build_tree", "start_solve"].includes(command) && !getLastCommandValue(commands, command)) {
      errors.push(`Required command has no value: ${command}`);
    }
  });
}

function validateDemoSafety(text, commands, errors) {
  const lowerLines = text.split(/\r?\n/).map((line) => line.toLowerCase());
  lowerLines.forEach((line, index) => {
    if (/usableasrealtrainingdata\s*[:=]\s*false/.test(line)) {
      errors.push(`Input declares usableAsRealTrainingData false on line ${index + 1}.`);
    }

    if (/\b(mock|unusable)\b/.test(line)) {
      errors.push(`Input appears to be mock/unusable on line ${index + 1}.`);
    }

    if (/\bdemo\b/.test(line) && !/\b(non[-\s]?demo|not\s+demo)\b/.test(line)) {
      errors.push(`Input appears to be demo data on line ${index + 1}.`);
    }
  });

  const dumpPath = getLastCommandValue(commands, "dump_result");
  if (dumpPath && dumpPath.toLowerCase().includes(".demo.")) {
    errors.push(`dump_result path contains ".demo.": ${dumpPath}`);
  }
}

function validateNumericCommand(commands, command, errors) {
  const value = getLastCommandValue(commands, command);
  if (!value) {
    return;
  }

  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    errors.push(`${command} must be a positive number; received "${value}".`);
  }
}

function validateBoard(commands, errors) {
  const boardValue = getLastCommandValue(commands, "set_board");
  if (!boardValue) {
    return;
  }

  const cards = boardValue.split(",").map((card) => card.trim()).filter(Boolean);
  if (cards.length !== 3) {
    errors.push(`set_board must contain exactly 3 flop cards; received ${cards.length}.`);
  }

  const seen = new Set();
  cards.forEach((card) => {
    if (!CARD_RE.test(card)) {
      errors.push(`Invalid board card syntax: "${card}". Use TexasSolver notation like Ks or 7d.`);
      return;
    }

    const key = card.toLowerCase();
    if (seen.has(key)) {
      errors.push(`Duplicate board card: ${card}`);
    }
    seen.add(key);
  });
}

function validateRange(commands, command, warnings, errors) {
  const range = getLastCommandValue(commands, command);
  if (range === undefined) {
    return;
  }

  if (!range.trim()) {
    errors.push(`${command} range is empty.`);
    return;
  }

  const tokens = range.split(",").map((token) => token.trim()).filter(Boolean);
  if (!tokens.length) {
    errors.push(`${command} range is empty.`);
    return;
  }

  const invalidTokens = tokens.filter((token) => !RANGE_TOKEN_RE.test(token));
  if (invalidTokens.length) {
    errors.push(`${command} has unparseable token(s): ${invalidTokens.slice(0, 8).join(", ")}${invalidTokens.length > 8 ? ", ..." : ""}`);
  }

  if (tokens.length < 8) {
    warnings.push(`${command} range is extremely short (${tokens.length} token${tokens.length === 1 ? "" : "s"}).`);
  }
}

function validateOutputPath(commands, allowExistingOutput, warnings, errors) {
  const dumpPath = getLastCommandValue(commands, "dump_result");
  if (!dumpPath) {
    return;
  }

  const resolved = path.resolve(ROOT, dumpPath);
  if (!resolved.startsWith(ROOT)) {
    warnings.push(`dump_result points outside this repo: ${dumpPath}`);
  }

  if (fs.existsSync(resolved) && !allowExistingOutput) {
    warnings.push(`dump_result output already exists: ${path.relative(ROOT, resolved) || resolved}. Pass --allow-existing-output to suppress this warning.`);
  }

  if (!dumpPath.toLowerCase().endsWith(".json")) {
    errors.push(`dump_result should write a .json file; received "${dumpPath}".`);
  }
}

function getLastCommandValue(commands, command) {
  const entries = commands.get(command);
  if (!entries || !entries.length) {
    return undefined;
  }
  return entries[entries.length - 1].value;
}

function finish(errors, warnings, inputPath = null) {
  warnings.forEach((warning) => console.warn(`WARN: ${warning}`));
  if (errors.length) {
    errors.forEach((error) => console.error(`ERROR: ${error}`));
    process.exit(1);
  }

  if (inputPath) {
    console.log(`TexasSolver input readiness check passed: ${path.relative(ROOT, inputPath)}`);
  }
}

function printUsage() {
  console.log(`
Usage:
  node tools/check-texassolver-input.js --input data/texassolver/btn_bb_srp_100bb_k72r_input.generated.txt

Options:
  --input <file>                 TexasSolver command input file to inspect
  --allow-existing-output        Suppress warning when dump_result JSON already exists
`);
}

function toCamel(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}
