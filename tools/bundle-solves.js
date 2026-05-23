#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const REAL_SOLVES_DIR = path.join(ROOT, "data", "solves", "real");
const INDEX_PATH = path.join(ROOT, "data", "solves", "index.json");
const EXPORTS_DIR = path.join(ROOT, "exports");
const EXPORT_DIR = path.join(EXPORTS_DIR, "fishkiller-solves-export");
const EXPORT_ZIP = path.join(EXPORTS_DIR, "fishkiller-solves-export.zip");

main();

function main() {
  const realSolveFiles = getRealSolveFiles();
  if (!realSolveFiles.length) {
    console.error("No real solved-tree JSON files found in data/solves/real.");
    process.exit(1);
  }

  const index = {
    version: 1,
    generatedAt: new Date().toISOString(),
    trees: realSolveFiles.map((filePath) => {
      const tree = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const fileName = path.basename(filePath);
      return {
        treeId: tree.treeId,
        label: tree.label || tree.treeId,
        path: `data/solves/real/${fileName}`,
        metadata: tree.metadata || {},
      };
    }),
  };

  fs.mkdirSync(path.dirname(INDEX_PATH), { recursive: true });
  fs.writeFileSync(INDEX_PATH, `${JSON.stringify(index, null, 2)}\n`, "utf8");

  fs.rmSync(EXPORT_DIR, { recursive: true, force: true });
  fs.mkdirSync(path.join(EXPORT_DIR, "data", "solves", "real"), { recursive: true });
  fs.copyFileSync(INDEX_PATH, path.join(EXPORT_DIR, "data", "solves", "index.json"));
  realSolveFiles.forEach((filePath) => {
    fs.copyFileSync(filePath, path.join(EXPORT_DIR, "data", "solves", "real", path.basename(filePath)));
  });

  fs.mkdirSync(EXPORTS_DIR, { recursive: true });
  const zipped = writeZipIfPossible();
  console.log(`Bundled ${realSolveFiles.length} solve${realSolveFiles.length === 1 ? "" : "s"} into ${path.relative(ROOT, EXPORT_DIR)}.`);
  if (zipped) {
    console.log(`Wrote ${path.relative(ROOT, EXPORT_ZIP)}.`);
  } else {
    console.warn("Zip export was skipped because PowerShell Compress-Archive was unavailable.");
  }
}

function getRealSolveFiles() {
  if (!fs.existsSync(REAL_SOLVES_DIR)) {
    return [];
  }

  return fs.readdirSync(REAL_SOLVES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".json"))
    .map((entry) => path.join(REAL_SOLVES_DIR, entry.name));
}

function writeZipIfPossible() {
  const powershell = getPowerShellPath();
  if (!powershell) {
    return false;
  }

  const command = [
    `if (Test-Path -LiteralPath '${escapePowerShell(EXPORT_ZIP)}') { Remove-Item -LiteralPath '${escapePowerShell(EXPORT_ZIP)}' -Force }`,
    `Compress-Archive -Path '${escapePowerShell(path.join(EXPORT_DIR, "*"))}' -DestinationPath '${escapePowerShell(EXPORT_ZIP)}' -Force`,
  ].join("; ");
  const result = spawnSync(powershell, ["-NoProfile", "-Command", command], {
    cwd: ROOT,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout || "");
    return false;
  }

  return fs.existsSync(EXPORT_ZIP);
}

function getPowerShellPath() {
  const systemRoot = process.env.SystemRoot || "C:\\Windows";
  const candidate = path.join(systemRoot, "System32", "WindowsPowerShell", "v1.0", "powershell.exe");
  if (fs.existsSync(candidate)) {
    return candidate;
  }

  return process.platform === "win32" ? "powershell.exe" : "";
}

function escapePowerShell(value) {
  return String(value).replace(/'/g, "''");
}
