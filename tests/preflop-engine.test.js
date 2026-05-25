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
const FACING_OPEN_RESPONSE_SPOT_IDS = [
  "fk_6max_100bb_hj_vs_lj_open_v1",
  "fk_6max_100bb_co_vs_lj_open_v1",
  "fk_6max_100bb_btn_vs_lj_open_v1",
  "fk_6max_100bb_btn_vs_hj_open_v1",
  "fk_6max_100bb_sb_vs_lj_open_v1",
  "fk_6max_100bb_sb_vs_hj_open_v1",
];
const THREE_BET_SPOT_IDS = [
  "fk_6max_100bb_btn_vs_co_open_3bet_v1",
  "fk_6max_100bb_co_vs_hj_open_3bet_v1",
  "fk_6max_100bb_hj_vs_lj_open_3bet_v1",
  "fk_6max_100bb_sb_vs_btn_open_3bet_v1",
  "fk_6max_100bb_sb_vs_co_open_3bet_v1",
];
const FACING_THREE_BET_SPOT_IDS = [
  "fk_6max_100bb_btn_open_vs_bb_3bet_v1",
  "fk_6max_100bb_co_open_vs_btn_3bet_v1",
  "fk_6max_100bb_co_open_vs_sb_3bet_v1",
  "fk_6max_100bb_hj_open_vs_btn_3bet_v1",
  "fk_6max_100bb_lj_open_vs_hj_3bet_v1",
];
const FACING_OPEN_COVERAGE_SPOT_IDS = [
  "fk_6max_100bb_hj_vs_lj_open_v1",
  "fk_6max_100bb_co_vs_lj_open_v1",
  "fk_6max_100bb_co_vs_hj_open_3bet_v1",
  "fk_6max_100bb_btn_vs_lj_open_v1",
  "fk_6max_100bb_btn_vs_hj_open_v1",
  "fk_6max_100bb_btn_vs_co_open_3bet_v1",
  "fk_6max_100bb_sb_vs_lj_open_v1",
  "fk_6max_100bb_sb_vs_hj_open_v1",
  "fk_6max_100bb_sb_vs_co_open_3bet_v1",
  "fk_6max_100bb_sb_vs_btn_open_3bet_v1",
  ...BB_DEFENSE_SPOT_IDS,
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
  loadsAllFacingOpenResponseSpots(normalized);
  loadsFacingOpenCoverage(normalized);
  loadsAllBbDefenseSpots(normalized);
  loadsAllThreeBetSpots(normalized);
  loadsAllFacingThreeBetSpots(normalized);
  classifiesCurrentSpotFamilies(normalized);
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
    assert.equal(spot.family, "rfi");
    assert.equal(spot.spotType, "rfi");
    assert.equal(spot.openerPosition, spot.heroPosition);
    assert.equal(spot.aggressorPosition, spot.heroPosition);
    assert(Array.isArray(spot.priorActions));
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
    assert.equal(spot.family, "bbDefense");
    assert.equal(spot.spotType, "bb-defense-vs-open");
    assert.equal(spot.heroPosition, "BB");
    assert.equal(spot.defenderPosition, "BB");
    assert.equal(spot.openerPosition, spot.villainPosition);
    assert.equal(spot.aggressorPosition, spot.villainPosition);
    assert(Array.isArray(spot.priorActions));
    assert.equal(spot.actionContext, "facing-open");
    assert.equal(Object.keys(spot.actionsByHand).length, 169);
    assert.deepEqual(spot.legalActions.map((action) => action.id), ["fold", "call", "threeBet"]);
  });
}

function loadsAllFacingOpenResponseSpots(pack) {
  FACING_OPEN_RESPONSE_SPOT_IDS.forEach((spotId) => {
    const spot = preflop.getPreflopSpot(pack, spotId);
    assert(spot, `${spotId} should exist`);
    assert.equal(spot.family, "facingOpen");
    assert.equal(spot.spotType, "facing-open-response");
    assert.notEqual(spot.heroPosition, "BB");
    assert(spot.openerPosition, `${spotId} should define opener position`);
    assert.equal(spot.villainPosition, spot.openerPosition);
    assert.equal(spot.aggressorPosition, spot.openerPosition);
    assert.equal(spot.defenderPosition, spot.heroPosition);
    assert.equal(spot.actionContext, "facing-open");
    assert(Array.isArray(spot.priorActions));
    assert.equal(Object.keys(spot.actionsByHand).length, 169);
    assert.deepEqual(spot.legalActions.map((action) => action.id), ["fold", "call", "threeBet"]);
  });
}

function loadsFacingOpenCoverage(pack) {
  FACING_OPEN_COVERAGE_SPOT_IDS.forEach((spotId) => {
    const spot = preflop.getPreflopSpot(pack, spotId);
    assert(spot, `${spotId} should exist in Facing Open coverage`);
    assert.equal(spot.actionContext, "facing-open");
    assert.equal(Object.keys(spot.actionsByHand).length, 169);
    assert.deepEqual(spot.legalActions.map((action) => action.id), ["fold", "call", "threeBet"]);
  });
}

function loadsAllThreeBetSpots(pack) {
  THREE_BET_SPOT_IDS.forEach((spotId) => {
    const spot = preflop.getPreflopSpot(pack, spotId);
    assert(spot, `${spotId} should exist`);
    assert.equal(spot.family, "threeBetVsOpen");
    assert.notEqual(spot.heroPosition, "BB");
    assert(spot.villainPosition, `${spotId} should define opener position`);
    assert.equal(spot.openerPosition, spot.villainPosition);
    assert.equal(spot.aggressorPosition, spot.villainPosition);
    assert.equal(spot.defenderPosition, spot.heroPosition);
    assert(Array.isArray(spot.priorActions));
    assert.equal(spot.actionContext, "facing-open");
    assert.equal(spot.spotType, "three-bet-vs-open");
    assert.equal(Object.keys(spot.actionsByHand).length, 169);
    assert.deepEqual(spot.legalActions.map((action) => action.id), ["fold", "call", "threeBet"]);
  });
}

function loadsAllFacingThreeBetSpots(pack) {
  FACING_THREE_BET_SPOT_IDS.forEach((spotId) => {
    const spot = preflop.getPreflopSpot(pack, spotId);
    assert(spot, `${spotId} should exist`);
    assert.equal(spot.family, "facingThreeBet");
    assert.notEqual(spot.heroPosition, "BB");
    assert(spot.villainPosition, `${spotId} should define 3-bettor position`);
    assert.equal(spot.openerPosition, spot.heroPosition);
    assert.equal(spot.aggressorPosition, spot.villainPosition);
    assert.equal(spot.defenderPosition, spot.heroPosition);
    assert(Array.isArray(spot.priorActions));
    assert.equal(spot.actionContext, "facing-3bet");
    assert.equal(spot.spotType, "facing-3bet");
    assert.equal(Object.keys(spot.actionsByHand).length, 169);
    assert.deepEqual(spot.legalActions.map((action) => action.id), ["fold", "call", "fourBet"]);
  });
}

function classifiesCurrentSpotFamilies(pack) {
  RFI_SPOT_IDS.forEach((spotId) => {
    assert.equal(preflop.getPreflopSpotFamily(preflop.getPreflopSpot(pack, spotId)), "rfi");
  });
  FACING_OPEN_RESPONSE_SPOT_IDS.forEach((spotId) => {
    assert.equal(preflop.getPreflopSpotFamily(preflop.getPreflopSpot(pack, spotId)), "facingOpen");
  });
  BB_DEFENSE_SPOT_IDS.forEach((spotId) => {
    assert.equal(preflop.getPreflopSpotFamily(preflop.getPreflopSpot(pack, spotId)), "bbDefense");
  });
  THREE_BET_SPOT_IDS.forEach((spotId) => {
    assert.equal(preflop.getPreflopSpotFamily(preflop.getPreflopSpot(pack, spotId)), "threeBetVsOpen");
  });
  FACING_THREE_BET_SPOT_IDS.forEach((spotId) => {
    assert.equal(preflop.getPreflopSpotFamily(preflop.getPreflopSpot(pack, spotId)), "facingThreeBet");
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
    { id: "all-facing-open", spotIds: FACING_OPEN_COVERAGE_SPOT_IDS },
    { id: "fo-btn-vs-hj", spotIds: ["fk_6max_100bb_btn_vs_hj_open_v1"] },
    { id: "all-bb-defense", spotIds: BB_DEFENSE_SPOT_IDS },
    { id: "bb-vs-btn", spotIds: ["fk_6max_100bb_bb_vs_btn_open_v1"] },
    { id: "all-three-bet", spotIds: THREE_BET_SPOT_IDS },
    { id: "btn-vs-co-3bet", spotIds: ["fk_6max_100bb_btn_vs_co_open_3bet_v1"] },
    { id: "all-facing-3bet", spotIds: FACING_THREE_BET_SPOT_IDS },
    { id: "btn-open-vs-bb-3bet", spotIds: ["fk_6max_100bb_btn_open_vs_bb_3bet_v1"] },
    { id: "review-mistakes", reviewMode: true, spotIds: [] },
  ];

  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("co-rfi", options), ["fk_6max_100bb_co_rfi_unopened_v1"]);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("all-facing-open", options), FACING_OPEN_COVERAGE_SPOT_IDS);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("fo-btn-vs-hj", options), ["fk_6max_100bb_btn_vs_hj_open_v1"]);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("all-bb-defense", options), BB_DEFENSE_SPOT_IDS);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("bb-vs-btn", options), ["fk_6max_100bb_bb_vs_btn_open_v1"]);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("all-three-bet", options), THREE_BET_SPOT_IDS);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("btn-vs-co-3bet", options), ["fk_6max_100bb_btn_vs_co_open_3bet_v1"]);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("all-facing-3bet", options), FACING_THREE_BET_SPOT_IDS);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("btn-open-vs-bb-3bet", options), ["fk_6max_100bb_btn_open_vs_bb_3bet_v1"]);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("missing", options), RFI_SPOT_IDS);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("review-mistakes", options), []);
}

function formatsPreflopLabels(pack) {
  const btn = preflop.getPreflopSpot(pack, "fk_6max_100bb_btn_rfi_unopened_v1");
  const sb = preflop.getPreflopSpot(pack, "fk_6max_100bb_sb_rfi_unopened_v1");
  const bbVsBtn = preflop.getPreflopSpot(pack, "fk_6max_100bb_bb_vs_btn_open_v1");
  const bbVsSb = preflop.getPreflopSpot(pack, "fk_6max_100bb_bb_vs_sb_open_v1");
  const btnVsCo = preflop.getPreflopSpot(pack, "fk_6max_100bb_btn_vs_co_open_3bet_v1");
  const btnVsHj = preflop.getPreflopSpot(pack, "fk_6max_100bb_btn_vs_hj_open_v1");
  const btnOpenVsBb = preflop.getPreflopSpot(pack, "fk_6max_100bb_btn_open_vs_bb_3bet_v1");

  assert.equal(preflop.formatPreflopActionLabel("fold"), "Fold");
  assert.equal(preflop.formatPreflopActionLabel("call"), "Call");
  assert.equal(preflop.formatPreflopActionLabel("raise"), "Raise");
  assert.equal(preflop.formatPreflopActionLabel("threeBet"), "3-bet");
  assert.equal(preflop.formatPreflopActionLabel("fourBet"), "4-bet");
  assert.equal(preflop.formatPreflopActionLabel("limp"), "Limp");
  assert.equal(preflop.formatPreflopActionLabel("check"), "Check");
  assert.equal(preflop.formatPreflopActionLabel("isoRaise"), "Iso-raise");
  assert.equal(preflop.formatPreflopActionLabel("threeBet", { family: "squeeze" }), "Squeeze");
  assert.equal(preflop.formatPreflopActionLabel("squeeze"), "Squeeze");
  assert.equal(preflop.formatPreflopActionLabel("fiveBetJam"), "5-bet jam");
  assert.equal(preflop.formatPreflopSpotLabel(btn), "BTN first in");
  assert.equal(preflop.formatPreflopSpotLabel(bbVsBtn), "BB vs BTN open");
  assert.equal(preflop.formatPreflopSpotLabel(btnVsHj), "BTN vs HJ open");
  assert.equal(preflop.formatPreflopSpotLabel(btnVsCo), "BTN vs CO open");
  assert.equal(preflop.formatPreflopSpotLabel(btnOpenVsBb), "BTN open vs BB 3-bet");
  assert.equal(preflop.formatPreflopSpotLabel({
    family: "facingFourBet",
    heroPosition: "BTN",
    aggressorPosition: "CO",
  }), "BTN vs CO 4-bet");
  assert.equal(preflop.formatPreflopSpotLabel({
    family: "limpedPot",
    heroPosition: "BB",
  }), "BB in limped pot");
  assert.equal(preflop.formatPreflopSpotLabel({
    family: "isoVsLimper",
    heroPosition: "CO",
    limperPosition: "LJ",
  }), "CO iso vs LJ");
  assert.equal(preflop.formatPreflopSpotLabel({
    family: "squeeze",
    heroPosition: "SB",
    openerPosition: "CO",
    callerPosition: "BTN",
  }), "SB squeeze vs CO + BTN");
  assert.equal(preflop.formatPreflopSizeLabel(btn), "Open 2.3bb");
  assert.equal(preflop.formatPreflopSizeLabel(sb), "Open 3bb");
  assert.equal(preflop.formatPreflopSizeLabel(bbVsBtn), "BTN opens 2.3bb");
  assert.equal(preflop.formatPreflopSizeLabel(bbVsSb), "SB opens 3bb");
  assert.equal(preflop.formatPreflopSizeLabel(btnVsHj), "HJ opens 2.3bb");
  assert.equal(preflop.formatPreflopSizeLabel(btnVsCo), "CO opens 2.3bb");
  assert.equal(preflop.formatPreflopSizeLabel(btnOpenVsBb), "BB 3-bets 9.5bb");
}

run();
