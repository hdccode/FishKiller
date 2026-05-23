#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const INDEX_PATH = path.join(ROOT, "data", "solves", "index.json");
const REAL_SOLVES_DIR = path.join(ROOT, "data", "solves", "real");
const CARD_RE = /^[2-9TJQKA][cdhs]$/;
const VALID_ACTORS = new Set(["hero", "villain", "chance", "terminal", "dealer"]);

main();

function main() {
  const args = new Set(process.argv.slice(2));
  const allowEmpty = args.has("--allow-empty");
  const errors = [];
  const warnings = [];
  const treeFiles = new Map();
  const inlineTrees = [];

  if (fs.existsSync(INDEX_PATH)) {
    readJson(INDEX_PATH, errors, "solve index", (index) => {
      collectIndexTrees(index, treeFiles, inlineTrees, errors, warnings);
    });
  } else {
    warnings.push("data/solves/index.json is not present.");
  }

  if (fs.existsSync(REAL_SOLVES_DIR)) {
    fs.readdirSync(REAL_SOLVES_DIR, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".json"))
      .forEach((entry) => {
        const filePath = path.join(REAL_SOLVES_DIR, entry.name);
        treeFiles.set(path.resolve(filePath), filePath);
      });
  } else {
    warnings.push("data/solves/real/ is not present.");
  }

  if (!treeFiles.size && !inlineTrees.length && !allowEmpty) {
    errors.push("No real solved-tree JSON files found. Use --allow-empty for a laptop with no imported bundle yet.");
  }

  inlineTrees.forEach(({ tree, label }) => validateSolvedTree(tree, label, errors, warnings));
  treeFiles.forEach((filePath) => {
    readJson(filePath, errors, path.relative(ROOT, filePath), (tree) => {
      validateSolvedTree(tree, path.relative(ROOT, filePath), errors, warnings);
    });
  });

  warnings.forEach((warning) => console.warn(`WARN: ${warning}`));

  if (errors.length) {
    errors.forEach((error) => console.error(`ERROR: ${error}`));
    process.exit(1);
  }

  console.log(`Solve validation passed (${treeFiles.size + inlineTrees.length} tree${treeFiles.size + inlineTrees.length === 1 ? "" : "s"} checked).`);
}

function collectIndexTrees(index, treeFiles, inlineTrees, errors, warnings) {
  if (!index || typeof index !== "object") {
    errors.push("data/solves/index.json must be an object or an array.");
    return;
  }

  const entries = Array.isArray(index)
    ? index.map((entry) => typeof entry === "string" ? { path: entry } : entry)
    : index.trees || index.files || index.treeFiles || [];

  if (!Array.isArray(entries)) {
    errors.push("data/solves/index.json must contain a trees, files, or treeFiles array.");
    return;
  }

  if (!entries.length) {
    warnings.push("data/solves/index.json contains no tree entries.");
  }

  entries.forEach((entry, indexNumber) => {
    const normalized = typeof entry === "string" ? { path: entry } : entry;
    if (!normalized || typeof normalized !== "object") {
      errors.push(`Index entry ${indexNumber} is not an object or path string.`);
      return;
    }

    if (normalized.nodes) {
      inlineTrees.push({ tree: normalized, label: `data/solves/index.json entry ${indexNumber}` });
      return;
    }

    const solvePath = normalized.path || normalized.file || normalized.href || normalized.url;
    if (!solvePath) {
      errors.push(`Index entry ${indexNumber} has no path/file and is not an inline solved tree.`);
      return;
    }

    if (/^https?:\/\//i.test(String(solvePath))) {
      errors.push(`Index entry ${indexNumber} points at a remote URL. FishKiller laptop imports must be local files.`);
      return;
    }

    const absolutePath = path.resolve(ROOT, String(solvePath).replace(/^[/\\]+/, ""));
    if (!absolutePath.startsWith(ROOT)) {
      errors.push(`Index entry ${indexNumber} escapes the repo: ${solvePath}`);
      return;
    }

    if (!fs.existsSync(absolutePath)) {
      errors.push(`Index entry ${indexNumber} points to a missing file: ${solvePath}`);
      return;
    }

    treeFiles.set(absolutePath, absolutePath);
  });
}

function validateSolvedTree(tree, label, errors, warnings) {
  if (!tree || typeof tree !== "object") {
    errors.push(`${label}: solved tree must be an object.`);
    return;
  }

  if (!tree.treeId) errors.push(`${label}: missing treeId.`);
  if (tree.isDemo) errors.push(`${label}: real solve file is marked isDemo=true.`);
  if (!tree.nodes || typeof tree.nodes !== "object") {
    errors.push(`${label}: missing nodes object.`);
    return;
  }
  if (!tree.nodes.root) errors.push(`${label}: missing root node.`);

  Object.entries(tree.nodes).forEach(([nodeKey, node]) => {
    const nodeLabel = `${label}:${node.nodeId || nodeKey}`;
    if (!node || typeof node !== "object") {
      errors.push(`${nodeLabel}: node must be an object.`);
      return;
    }

    if (!node.nodeId) errors.push(`${nodeLabel}: missing nodeId.`);
    if (!VALID_ACTORS.has(node.actor)) errors.push(`${nodeLabel}: invalid actor "${node.actor}".`);
    if (!Array.isArray(node.board)) errors.push(`${nodeLabel}: board must be an array.`);
    (node.board || []).forEach((card) => {
      if (!CARD_RE.test(String(card))) errors.push(`${nodeLabel}: invalid board card "${card}".`);
    });

    if (!Array.isArray(node.legalActions)) errors.push(`${nodeLabel}: legalActions must be an array.`);
    (node.legalActions || []).forEach((action) => {
      if (!action.id || !action.type) errors.push(`${nodeLabel}: action is missing id/type.`);
    });

    Object.entries(node.children || {}).forEach(([actionId, childId]) => {
      if (!tree.nodes[childId]) errors.push(`${nodeLabel}: child for "${actionId}" points to missing node "${childId}".`);
    });

    if (node.actor === "chance" && !Array.isArray(node.cardOptions)) {
      warnings.push(`${nodeLabel}: chance node has no cardOptions array.`);
    }
  });
}

function readJson(filePath, errors, label, onJson) {
  try {
    onJson(JSON.parse(fs.readFileSync(filePath, "utf8")));
  } catch (error) {
    errors.push(`${label}: ${error.message}`);
  }
}
