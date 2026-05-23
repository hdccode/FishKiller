#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");

main();

function main() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "fishkiller-solves-smoke-"));
  const rawPath = path.join(tempDir, "texassolver-smoke.json");
  const outputPath = path.join(tempDir, "fishkiller-smoke-tree.json");

  fs.writeFileSync(rawPath, JSON.stringify(createSmokeRawTree(), null, 2), "utf8");

  const converter = path.join(ROOT, "tools", "convert-texassolver.js");
  const result = spawnSync(process.execPath, [
    converter,
    "--input", rawPath,
    "--output", outputPath,
    "--schema", "solved-tree",
    "--format", "json",
    "--tree-id", "smoke_btn_bb_srp_100bb_k72r",
    "--tree-name", "Smoke BTN vs BB SRP 100bb K72r",
    "--formation", "BTN_vs_BB_SRP",
    "--hero-position", "BTN",
    "--villain-position", "BB",
    "--board", "Ks,7d,2c",
    "--pot", "5.5",
    "--stack-depth-bb", "100",
    "--max-action-depth", "2",
    "--source", "Temporary smoke-test fixture; not a real solve.",
  ], {
    cwd: ROOT,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    process.stderr.write(result.stdout || "");
    process.stderr.write(result.stderr || "");
    throw new Error("Smoke conversion failed.");
  }

  const tree = JSON.parse(fs.readFileSync(outputPath, "utf8"));
  assert(tree.treeId === "smoke_btn_bb_srp_100bb_k72r", "treeId was not preserved");
  assert(tree.isDemo === false, "converted tree should be loadable as a non-demo schema object");
  assert(tree.nodes.root, "root node missing");
  assert(tree.nodes.root.actor === "villain", "TexasSolver OOP root should map to villain");
  assert(tree.nodes.root.children.check, "root check child missing");
  assert(Object.values(tree.nodes).some((node) => node.actor === "hero"), "hero node missing");

  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log("Solve smoke test passed. Temporary output was not written to data/solves/real.");
}

function createSmokeRawTree() {
  return {
    actions: ["CHECK", "BET 1.82"],
    player: 1,
    strategy: {
      actions: ["CHECK", "BET 1.82"],
      strategy: {
        AhQh: [0.72, 0.28],
        AsQs: [0.64, 0.36],
        KcQc: [0.18, 0.82],
      },
    },
    childrens: {
      CHECK: {
        actions: ["CHECK", "BET 1.82", "BET 4.12"],
        player: 0,
        strategy: {
          actions: ["CHECK", "BET 1.82", "BET 4.12"],
          strategy: {
            AhQh: [0.25, 0.7, 0.05],
            AsQs: [0.32, 0.62, 0.06],
            KcQc: [0.08, 0.78, 0.14],
          },
        },
        childrens: {
          CHECK: {},
          "BET 1.82": {
            actions: ["FOLD", "CALL 1.82"],
            player: 1,
            strategy: {
              actions: ["FOLD", "CALL 1.82"],
              strategy: {
                AhQh: [0.38, 0.62],
                AsQs: [0.45, 0.55],
                KcQc: [0.1, 0.9],
              },
            },
          },
          "BET 4.12": {},
        },
      },
      "BET 1.82": {
        actions: ["FOLD", "CALL 1.82"],
        player: 0,
        strategy: {
          actions: ["FOLD", "CALL 1.82"],
          strategy: {
            AhQh: [0.2, 0.8],
            AsQs: [0.28, 0.72],
            KcQc: [0.05, 0.95],
          },
        },
      },
    },
    node_type: "action_node",
  };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
