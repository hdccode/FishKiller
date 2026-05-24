#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const {
  actionFrequencyToWeight,
  buildTexasSolverRangeString,
  loadRangePacks,
  findSpot,
  normalizeHandClass,
} = require("./range-pack-to-texassolver");

const ROOT = path.resolve(__dirname, "..");
const VALIDATOR = path.join(ROOT, "tools", "validate-preflop-range-packs.js");
const GENERATOR = path.join(ROOT, "tools", "generate-texassolver-ranges.js");
const REAL_RFI_SPOT_IDS = [
  "fk_6max_100bb_lj_rfi_unopened_v1",
  "fk_6max_100bb_hj_rfi_unopened_v1",
  "fk_6max_100bb_co_rfi_unopened_v1",
  "fk_6max_100bb_btn_rfi_unopened_v1",
  "fk_6max_100bb_sb_rfi_unopened_v1",
];
const REAL_BB_DEFENSE_SPOT_IDS = [
  "fk_6max_100bb_bb_vs_lj_open_v1",
  "fk_6max_100bb_bb_vs_hj_open_v1",
  "fk_6max_100bb_bb_vs_co_open_v1",
  "fk_6max_100bb_bb_vs_btn_open_v1",
  "fk_6max_100bb_bb_vs_sb_open_v1",
];
const REAL_THREE_BET_SPOT_IDS = [
  "fk_6max_100bb_btn_vs_co_open_3bet_v1",
  "fk_6max_100bb_co_vs_hj_open_3bet_v1",
  "fk_6max_100bb_hj_vs_lj_open_3bet_v1",
  "fk_6max_100bb_sb_vs_btn_open_3bet_v1",
  "fk_6max_100bb_sb_vs_co_open_3bet_v1",
];
const REAL_FACING_THREE_BET_SPOT_IDS = [
  "fk_6max_100bb_btn_open_vs_bb_3bet_v1",
  "fk_6max_100bb_co_open_vs_btn_3bet_v1",
  "fk_6max_100bb_co_open_vs_sb_3bet_v1",
  "fk_6max_100bb_hj_open_vs_btn_3bet_v1",
  "fk_6max_100bb_lj_open_vs_hj_3bet_v1",
];

main();

function main() {
  const realBefore = listRealRangeFiles();
  runValidator();
  runModuleAssertions();
  runCliAssertions();
  assert.deepEqual(listRealRangeFiles(), realBefore, "Smoke test must not create real range-pack data.");
  console.log("Range-pack to TexasSolver smoke tests passed. No TexasSolver process was started.");
}

function runValidator() {
  const result = spawnSync(process.execPath, [VALIDATOR], {
    cwd: ROOT,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    process.stderr.write(`${result.stdout || ""}${result.stderr || ""}`);
    throw new Error("Range-pack validator should pass the disabled demo pack.");
  }
}

function runModuleAssertions() {
  assert.equal(normalizeHandClass("aa"), "AA");
  assert.equal(normalizeHandClass("5As"), "A5s");

  const packs = loadRangePacks(path.join(ROOT, "data", "preflop-ranges"));
  const ip = findSpot(packs, "demo_6max_btn_rfi_100bb");
  const oop = findSpot(packs, "demo_6max_bb_vs_btn_open_100bb");
  const realBtnRfi = findSpot(packs, "fk_6max_100bb_btn_rfi_unopened_v1");
  assert(ip, "IP demo spot should exist");
  assert(oop, "OOP demo spot should exist");
  assert(realBtnRfi, "Real 6-max BTN RFI spot should exist");
  assert.equal(realBtnRfi.pack.sourceType, "manual");
  assert.equal(realBtnRfi.pack.usableAsRealTrainingData, true);
  assert.equal(Object.keys(realBtnRfi.spot.actionsByHand).length, 169);
  assert.deepEqual(realBtnRfi.spot.legalActions.map((action) => action.id), ["fold", "raise"]);
  REAL_RFI_SPOT_IDS.forEach((spotId) => {
    const realRfi = findSpot(packs, spotId);
    assert(realRfi, `Real 6-max RFI spot should exist: ${spotId}`);
    assert.equal(realRfi.pack.sourceType, "manual");
    assert.equal(Object.keys(realRfi.spot.actionsByHand).length, 169);
    assert.deepEqual(realRfi.spot.legalActions.map((action) => action.id), ["fold", "raise"]);
  });
  REAL_BB_DEFENSE_SPOT_IDS.forEach((spotId) => {
    const realDefense = findSpot(packs, spotId);
    assert(realDefense, `Real 6-max BB defense spot should exist: ${spotId}`);
    assert.equal(realDefense.pack.sourceType, "manual");
    assert.equal(Object.keys(realDefense.spot.actionsByHand).length, 169);
    assert.deepEqual(realDefense.spot.legalActions.map((action) => action.id), ["fold", "call", "threeBet"]);
  });
  REAL_THREE_BET_SPOT_IDS.forEach((spotId) => {
    const realThreeBet = findSpot(packs, spotId);
    assert(realThreeBet, `Real 6-max 3-bet spot should exist: ${spotId}`);
    assert.equal(realThreeBet.pack.sourceType, "manual");
    assert.equal(Object.keys(realThreeBet.spot.actionsByHand).length, 169);
    assert.deepEqual(realThreeBet.spot.legalActions.map((action) => action.id), ["fold", "call", "threeBet"]);
    assert.equal(realThreeBet.spot.spotType, "three-bet-vs-open");
  });
  REAL_FACING_THREE_BET_SPOT_IDS.forEach((spotId) => {
    const realFacingThreeBet = findSpot(packs, spotId);
    assert(realFacingThreeBet, `Real 6-max facing-3bet spot should exist: ${spotId}`);
    assert.equal(realFacingThreeBet.pack.sourceType, "manual");
    assert.equal(Object.keys(realFacingThreeBet.spot.actionsByHand).length, 169);
    assert.deepEqual(realFacingThreeBet.spot.legalActions.map((action) => action.id), ["fold", "call", "fourBet"]);
    assert.equal(realFacingThreeBet.spot.spotType, "facing-3bet");
  });

  assert.equal(actionFrequencyToWeight({ call: 0.4, threeBet: 0.5, fold: 0.1 }, ["call", "threeBet"]), 0.9);
  assert.equal(actionFrequencyToWeight({ call: 0.4, fourBet: 0.5, fold: 0.1 }, ["call", "fourBet"]), 0.9);

  const ipRange = buildTexasSolverRangeString(ip.spot, ["raise"]).range;
  assert.equal(ipRange, "AA,A5s:0.95");
  assert(!ipRange.includes("KQo"), "Zero-frequency KQo should be omitted");

  const oopRange = buildTexasSolverRangeString(oop.spot, ["call", "threeBet"]).range;
  assert.equal(oopRange, "A5s:0.9,T8s:0.9");
}

function runCliAssertions() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "fishkiller-ranges-"));
  try {
    const outPath = path.join(tempDir, "demo-ranges.json");
    const baseArgs = [
      GENERATOR,
      "--ip-spot", "demo_6max_btn_rfi_100bb",
      "--oop-spot", "demo_6max_bb_vs_btn_open_100bb",
      "--ip-actions", "raise",
      "--oop-actions", "call,threeBet",
      "--out", outPath,
    ];

    const refused = spawnSync(process.execPath, baseArgs, {
      cwd: ROOT,
      encoding: "utf8",
    });
    assert.notEqual(refused.status, 0, "Demo generation should require --allow-demo.");
    assert(
      `${refused.stdout || ""}${refused.stderr || ""}`.includes("--allow-demo"),
      "Refusal should mention --allow-demo."
    );
    assert(!fs.existsSync(outPath), "Refused demo generation must not create output.");

    const allowed = spawnSync(process.execPath, [...baseArgs, "--allow-demo"], {
      cwd: ROOT,
      encoding: "utf8",
    });
    if (allowed.status !== 0) {
      process.stderr.write(`${allowed.stdout || ""}${allowed.stderr || ""}`);
      throw new Error("Demo generation with --allow-demo should pass.");
    }

    const generated = JSON.parse(fs.readFileSync(outPath, "utf8"));
    assert.equal(generated.sourcePackIsDemo, true);
    assert.equal(generated.usableAsRealTrainingData, false);
    assert.equal(generated.ipRange, "AA,A5s:0.95");
    assert.equal(generated.oopRange, "A5s:0.9,T8s:0.9");
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function listRealRangeFiles() {
  const realDir = path.join(ROOT, "data", "preflop-ranges", "real");
  if (!fs.existsSync(realDir)) {
    return [];
  }
  return fs.readdirSync(realDir).sort();
}
