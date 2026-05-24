const assert = require("assert");
const fs = require("fs");
const path = require("path");
const preflop = require("../preflop-engine");

const PACK_PATH = path.join(__dirname, "..", "data", "preflop-ranges", "real", "fishkiller-6max-100bb-v1.preflop-range.json");
const SPOT_ID = "fk_6max_100bb_btn_rfi_unopened_v1";
const RFI_SPOT_IDS = [
  "fk_6max_100bb_lj_rfi_unopened_v1",
  "fk_6max_100bb_hj_rfi_unopened_v1",
  "fk_6max_100bb_co_rfi_unopened_v1",
  "fk_6max_100bb_btn_rfi_unopened_v1",
  "fk_6max_100bb_sb_rfi_unopened_v1",
];
const BB_DEFENSE_SPOT_IDS = [
  "fk_6max_100bb_bb_vs_lj_open_v1",
  "fk_6max_100bb_bb_vs_hj_open_v1",
  "fk_6max_100bb_bb_vs_co_open_v1",
  "fk_6max_100bb_bb_vs_btn_open_v1",
  "fk_6max_100bb_bb_vs_sb_open_v1",
];

function fixedRng(value) {
  return () => value;
}

function run() {
  const pack = JSON.parse(fs.readFileSync(PACK_PATH, "utf8"));
  const normalized = preflop.normalizePreflopRangePack(pack);
  const spot = preflop.getPreflopSpot(normalized, SPOT_ID);

  loadsAndFindsRealPack(normalized, spot);
  loadsAllCoreRfiSpots(normalized);
  loadsAllBbDefenseSpots(normalized);
  prefersRaiseWithAces(spot);
  prefersFoldWithTrash(spot);
  checksPositionSpecificRfiStrategy(normalized);
  gradesMixedAction(spot);
  rejectsIllegalAction(spot);
  buildsFullMatrix(spot);
  samplesDeterministicQuestion(normalized);
  resolvesDrillSpotIds();
  formatsPreflopLabels(normalized);
  console.log("preflop-engine tests passed");
}

function loadsAndFindsRealPack(pack, spot) {
  assert.equal(pack.packId, "fishkiller-6max-100bb-v1");
  assert(spot, "BTN RFI spot should exist");
  assert.equal(spot.spotId, SPOT_ID);
  assert.equal(Object.keys(spot.actionsByHand).length, 169);
  assert.deepEqual(spot.legalActions.map((action) => action.id), ["fold", "raise"]);
}

function loadsAllCoreRfiSpots(pack) {
  RFI_SPOT_IDS.forEach((spotId) => {
    const spot = preflop.getPreflopSpot(pack, spotId);
    assert(spot, `${spotId} should exist`);
    assert.equal(Object.keys(spot.actionsByHand).length, 169);
    assert.deepEqual(spot.legalActions.map((action) => action.id), ["fold", "raise"]);
    assert.equal(spot.actionContext, "rfi");
    assert.equal(spot.priorAction, "folded-to-hero");
  });
}

function loadsAllBbDefenseSpots(pack) {
  BB_DEFENSE_SPOT_IDS.forEach((spotId) => {
    const spot = preflop.getPreflopSpot(pack, spotId);
    assert(spot, `${spotId} should exist`);
    assert.equal(spot.heroPosition, "BB");
    assert.equal(spot.actionContext, "facing-open");
    assert.equal(Object.keys(spot.actionsByHand).length, 169);
    assert.deepEqual(spot.legalActions.map((action) => action.id), ["fold", "call", "threeBet"]);
  });
}

function prefersRaiseWithAces(spot) {
  const strategy = preflop.getPreflopHandStrategy(spot, "AA");
  const preferred = preflop.getPreferredPreflopAction(strategy);
  assert.equal(preferred.actionId, "raise");
  assert.equal(preferred.frequency, 1);

  const grade = preflop.gradePreflopAnswer({ spot, handClass: "AA", actionId: "raise" });
  assert.equal(grade.kind, "correct");
  assert.equal(grade.preferredActionId, "raise");
}

function prefersFoldWithTrash(spot) {
  const strategy = preflop.getPreflopHandStrategy(spot, "72o");
  const preferred = preflop.getPreferredPreflopAction(strategy);
  assert.equal(preferred.actionId, "fold");
  assert.equal(preferred.frequency, 1);

  const grade = preflop.gradePreflopAnswer({ spot, handClass: "72o", actionId: "fold" });
  assert.equal(grade.kind, "correct");
}

function checksPositionSpecificRfiStrategy(pack) {
  const lj = preflop.getPreflopSpot(pack, "fk_6max_100bb_lj_rfi_unopened_v1");
  const co = preflop.getPreflopSpot(pack, "fk_6max_100bb_co_rfi_unopened_v1");
  const sb = preflop.getPreflopSpot(pack, "fk_6max_100bb_sb_rfi_unopened_v1");

  assert.equal(preflop.getPreferredPreflopAction(preflop.getPreflopHandStrategy(lj, "AJo")).actionId, "raise");
  assert.equal(preflop.getPreferredPreflopAction(preflop.getPreflopHandStrategy(lj, "A9o")).actionId, "fold");
  assert.equal(preflop.getPreferredPreflopAction(preflop.getPreflopHandStrategy(co, "22")).actionId, "raise");
  assert.equal(preflop.getPreferredPreflopAction(preflop.getPreflopHandStrategy(co, "K9o")).actionId, "fold");
  assert.equal(preflop.getPreferredPreflopAction(preflop.getPreflopHandStrategy(sb, "A2o")).actionId, "raise");
  assert.equal(preflop.getPreferredPreflopAction(preflop.getPreflopHandStrategy(sb, "72o")).actionId, "fold");
}

function gradesMixedAction(spot) {
  const grade = preflop.gradePreflopAnswer({ spot, handClass: "T6s", actionId: "fold" });
  assert.equal(grade.kind, "mixed");
  assert.equal(grade.chosenFrequency, 0.25);
  assert.equal(grade.preferredActionId, "raise");
  assert.equal(grade.preferredFrequency, 0.75);
}

function rejectsIllegalAction(spot) {
  const grade = preflop.gradePreflopAnswer({ spot, handClass: "AA", actionId: "call" });
  assert.equal(grade.kind, "illegal");
  assert.equal(grade.isIllegal, true);
  assert.equal(grade.chosenFrequency, 0);
}

function buildsFullMatrix(spot) {
  const matrix = preflop.buildPreflopRangeMatrix(spot);
  assert.equal(matrix.rows.length, 13);
  assert.equal(matrix.cells.length, 169);

  const aces = matrix.cells.find((cell) => cell.handClass === "AA");
  assert.equal(aces.row, 0);
  assert.equal(aces.column, 0);
  assert.equal(aces.dominantAction, "raise");
  assert.equal(aces.pure, true);

  const mixed = matrix.cells.find((cell) => cell.handClass === "T6s");
  assert.equal(mixed.dominantAction, "raise");
  assert.equal(mixed.mixed, true);
}

function samplesDeterministicQuestion(pack) {
  const question = preflop.samplePreflopQuestion({
    packOrNormalizedPack: pack,
    spotId: SPOT_ID,
    rng: fixedRng(0),
  });
  assert.equal(question.spotId, SPOT_ID);
  assert.equal(question.handClass, "AA");
  assert.deepEqual(question.legalActions.map((action) => action.id), ["fold", "raise"]);
  assert(question.strategy.actions);
}

function resolvesDrillSpotIds() {
  const options = [
    { id: "all-rfi", default: true, spotIds: RFI_SPOT_IDS },
    { id: "co-rfi", spotIds: ["fk_6max_100bb_co_rfi_unopened_v1"] },
    { id: "all-bb-defense", spotIds: BB_DEFENSE_SPOT_IDS },
    { id: "bb-vs-btn", spotIds: ["fk_6max_100bb_bb_vs_btn_open_v1"] },
    { id: "review-mistakes", reviewMode: true, spotIds: [] },
  ];

  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("co-rfi", options), ["fk_6max_100bb_co_rfi_unopened_v1"]);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("all-bb-defense", options), BB_DEFENSE_SPOT_IDS);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("bb-vs-btn", options), ["fk_6max_100bb_bb_vs_btn_open_v1"]);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("missing", options), RFI_SPOT_IDS);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("review-mistakes", options), []);
}

function formatsPreflopLabels(pack) {
  const btn = preflop.getPreflopSpot(pack, "fk_6max_100bb_btn_rfi_unopened_v1");
  const sb = preflop.getPreflopSpot(pack, "fk_6max_100bb_sb_rfi_unopened_v1");
  const bbVsBtn = preflop.getPreflopSpot(pack, "fk_6max_100bb_bb_vs_btn_open_v1");
  const bbVsSb = preflop.getPreflopSpot(pack, "fk_6max_100bb_bb_vs_sb_open_v1");

  assert.equal(preflop.formatPreflopActionLabel("fold"), "Fold");
  assert.equal(preflop.formatPreflopActionLabel("call"), "Call");
  assert.equal(preflop.formatPreflopActionLabel("raise"), "Raise");
  assert.equal(preflop.formatPreflopActionLabel("threeBet"), "3-bet");
  assert.equal(preflop.formatPreflopSpotLabel(btn), "BTN first in");
  assert.equal(preflop.formatPreflopSpotLabel(bbVsBtn), "BB vs BTN open");
  assert.equal(preflop.formatPreflopSizeLabel(btn), "Open 2.3bb");
  assert.equal(preflop.formatPreflopSizeLabel(sb), "Open 3bb");
  assert.equal(preflop.formatPreflopSizeLabel(bbVsBtn), "BTN opens 2.3bb");
  assert.equal(preflop.formatPreflopSizeLabel(bbVsSb), "SB opens 3bb");
}

run();
