#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const GENERATOR = path.join(ROOT, "tools", "generate-texassolver-input.js");
const CHECKER = path.join(ROOT, "tools", "check-texassolver-input.js");

main();

function main() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "fishkiller-generate-input-"));
  try {
    testDemoSafety(tempDir);
    testRealLikeInputPassesReadinessCheck(tempDir);
    console.log("TexasSolver input generator smoke tests passed. No TexasSolver process was started.");
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function testDemoSafety(tempDir) {
  const rangesPath = path.join(tempDir, "ranges.demo.json");
  const outPath = path.join(tempDir, "tree.demo.txt");
  const rawOutPath = path.join(tempDir, "tree.demo.json");
  fs.writeFileSync(rangesPath, JSON.stringify(createRangeJson({ demo: true }), null, 2), "utf8");

  const baseArgs = [
    GENERATOR,
    "--tree-id", "demo_btn_bb_srp_100bb_k72r",
    "--board", "Ks,7d,2c",
    "--pot", "5.5",
    "--effective-stack", "97.5",
    "--ranges", rangesPath,
    "--out", outPath,
    "--raw-out", rawOutPath,
  ];

  const refused = runNode(baseArgs);
  assert.notEqual(refused.status, 0, "Demo/unusable ranges must be refused without --allow-demo.");
  assert(!fs.existsSync(outPath), "Refused demo generation must not create output.");
  assert(combinedOutput(refused).includes("--allow-demo"), "Refusal should mention --allow-demo.");

  const generated = runNode([...baseArgs, "--allow-demo"]);
  assert.equal(generated.status, 0, combinedOutput(generated));
  const text = fs.readFileSync(outPath, "utf8");
  assert(text.includes("WARNING: demo/unusable range data only"), "Generated demo input needs warning header.");
  assert(text.includes("usableAsRealTrainingData false"), "Generated demo input needs unusable marker.");
  assertRequiredCommands(text);
  assert(text.includes("dump_result"), "Generated demo input should include dump_result.");
  assert(text.includes(".demo."), "Demo input/dump paths should contain .demo.");

  const demoCheck = runNode([CHECKER, "--input", outPath]);
  assert.notEqual(demoCheck.status, 0, "Readiness checker should reject generated demo input.");
  assert(/demo|usableAsRealTrainingData false/i.test(combinedOutput(demoCheck)), "Demo rejection should be explicit.");

  const overwriteRefused = runNode([...baseArgs, "--allow-demo"]);
  assert.notEqual(overwriteRefused.status, 0, "Existing generated input must not be overwritten without --force.");
  assert(/already exists/i.test(combinedOutput(overwriteRefused)), "Overwrite refusal should mention existing output.");
}

function testRealLikeInputPassesReadinessCheck(tempDir) {
  const rangesPath = path.join(tempDir, "ranges-real.json");
  const outPath = path.join(tempDir, "tree-real.txt");
  const rawOutPath = path.join(tempDir, "tree-real.json");
  fs.writeFileSync(rangesPath, JSON.stringify(createRangeJson({ demo: false }), null, 2), "utf8");

  const generated = runNode([
    GENERATOR,
    "--tree-id", "btn_bb_srp_100bb_k72r_smoke",
    "--board", "Ks,7d,2c",
    "--pot", "5.5",
    "--effective-stack", "97.5",
    "--ranges", rangesPath,
    "--out", outPath,
    "--raw-out", rawOutPath,
  ]);
  assert.equal(generated.status, 0, combinedOutput(generated));

  const text = fs.readFileSync(outPath, "utf8");
  assert(!/\bdemo\b/i.test(text), "Real-like smoke fixture should not contain demo markers.");
  assertRequiredCommands(text);
  assert(text.includes("set_thread_num 8"), "Default thread count should be written.");
  assert(text.includes("set_accuracy 0.5"), "Default accuracy should be written.");
  assert(text.includes("set_max_iteration 1000"), "Default max iteration should be written.");
  assert(text.includes("set_print_interval 25"), "Default print interval should be written.");
  assert(text.includes("set_bet_sizes oop,flop,bet,33,75"), "Compact MVP flop bet sizes should be written.");
  assert(text.includes("set_bet_sizes ip,river,allin"), "Compact MVP river all-in should be written.");

  const check = runNode([CHECKER, "--input", outPath]);
  assert.equal(check.status, 0, combinedOutput(check));
}

function assertRequiredCommands(text) {
  [
    "set_pot 5.5",
    "set_effective_stack 97.5",
    "set_board Ks,7d,2c",
    "set_range_oop",
    "set_range_ip",
    "build_tree",
    "start_solve",
    "dump_result",
  ].forEach((required) => {
    assert(text.includes(required), `Generated input missing ${required}`);
  });
}

function createRangeJson({ demo }) {
  return {
    spotId: demo ? "demo_btn_bb_srp_100bb" : "btn_bb_srp_100bb",
    generatedAt: "2026-05-23T00:00:00.000Z",
    sourcePackIds: [demo ? "demo-rule-baseline" : "licensed-smoke-fixture"],
    sourcePackIsDemo: demo,
    usableAsRealTrainingData: !demo,
    ipRange: "AA,KK,QQ,JJ,TT,AKs,AKo,AQs,AQo",
    oopRange: "QQ,JJ,TT,99,88,AQs,AQo,AJs,ATs",
    warnings: [],
  };
}

function runNode(args) {
  return spawnSync(process.execPath, args, {
    cwd: ROOT,
    encoding: "utf8",
  });
}

function combinedOutput(result) {
  return `${result.stdout || ""}${result.stderr || ""}`;
}
