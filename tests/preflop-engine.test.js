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
  "fk_6max_100bb_lj_open_vs_hj_3bet_v1",
  "fk_6max_100bb_lj_open_vs_co_3bet_v1",
  "fk_6max_100bb_lj_open_vs_btn_3bet_v1",
  "fk_6max_100bb_lj_open_vs_sb_3bet_v1",
  "fk_6max_100bb_lj_open_vs_bb_3bet_v1",
  "fk_6max_100bb_hj_open_vs_co_3bet_v1",
  "fk_6max_100bb_hj_open_vs_btn_3bet_v1",
  "fk_6max_100bb_hj_open_vs_sb_3bet_v1",
  "fk_6max_100bb_hj_open_vs_bb_3bet_v1",
  "fk_6max_100bb_co_open_vs_btn_3bet_v1",
  "fk_6max_100bb_co_open_vs_sb_3bet_v1",
  "fk_6max_100bb_co_open_vs_bb_3bet_v1",
  "fk_6max_100bb_btn_open_vs_sb_3bet_v1",
  "fk_6max_100bb_btn_open_vs_bb_3bet_v1",
  "fk_6max_100bb_sb_open_vs_bb_3bet_v1",
];
const FACING_FOUR_BET_SPOT_IDS = [
  "fk_6max_100bb_hj_3bet_vs_lj_open_lj_4bet_v1",
  "fk_6max_100bb_co_3bet_vs_hj_open_hj_4bet_v1",
  "fk_6max_100bb_btn_3bet_vs_co_open_co_4bet_v1",
  "fk_6max_100bb_sb_3bet_vs_btn_open_btn_4bet_v1",
  "fk_6max_100bb_bb_3bet_vs_btn_open_btn_4bet_v1",
];
const BVB_LIMP_SPOT_IDS = [
  "fk_6max_100bb_sb_first_in_limp_or_raise_v1",
  "fk_6max_100bb_bb_vs_sb_limp_v1",
  "fk_6max_100bb_sb_limp_vs_bb_raise_v1",
];
const ISO_VS_LIMP_SPOT_IDS = [
  "fk_6max_100bb_hj_vs_lj_limp_v1",
  "fk_6max_100bb_co_vs_lj_limp_v1",
  "fk_6max_100bb_btn_vs_lj_limp_v1",
  "fk_6max_100bb_btn_vs_co_limp_v1",
  "fk_6max_100bb_sb_vs_btn_limp_v1",
  "fk_6max_100bb_bb_vs_btn_limp_v1",
];
const SQUEEZE_SPOT_IDS = [
  "fk_6max_100bb_co_vs_lj_open_hj_call_squeeze_v1",
  "fk_6max_100bb_btn_vs_lj_open_co_call_squeeze_v1",
  "fk_6max_100bb_btn_vs_hj_open_co_call_squeeze_v1",
  "fk_6max_100bb_sb_vs_co_open_btn_call_squeeze_v1",
  "fk_6max_100bb_bb_vs_co_open_btn_call_squeeze_v1",
  "fk_6max_100bb_bb_vs_btn_open_sb_call_squeeze_v1",
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
const LIVE_SPOT_IDS = [
  ...new Set([
    ...RFI_SPOT_IDS,
    ...FACING_OPEN_COVERAGE_SPOT_IDS,
    ...BB_DEFENSE_SPOT_IDS,
    ...THREE_BET_SPOT_IDS,
    ...FACING_THREE_BET_SPOT_IDS,
    ...FACING_FOUR_BET_SPOT_IDS,
    ...BVB_LIMP_SPOT_IDS,
    ...ISO_VS_LIMP_SPOT_IDS,
    ...SQUEEZE_SPOT_IDS,
  ]),
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
  loadsAllFacingFourBetSpots(normalized);
  loadsAllBvbLimpSpots(normalized);
  loadsAllIsoVsLimpSpots(normalized);
  loadsAllSqueezeSpots(normalized);
  classifiesCurrentSpotFamilies(normalized);
  prefersRaiseWithAces(spot);
  prefersFoldWithTrash(spot);
  checksPositionSpecificRfiStrategy(normalized);
  gradesMixedAction(spot);
  rejectsIllegalAction(spot);
  buildsFullMatrix(spot);
  samplesDeterministicQuestion(normalized);
  samplesFacingThreeBetQuestionsFromPriorOpenRange(normalized);
  samplesFacingFourBetQuestionsFromPriorThreeBetRange(normalized);
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

function loadsAllFacingFourBetSpots(pack) {
  FACING_FOUR_BET_SPOT_IDS.forEach((spotId) => {
    const spot = preflop.getPreflopSpot(pack, spotId);
    assert(spot, `${spotId} should exist`);
    assert.equal(spot.family, "facingFourBet");
    assert.equal(spot.spotType, "facing-4bet");
    assert(spot.heroPosition, `${spotId} should define 3-bettor position`);
    assert(spot.villainPosition, `${spotId} should define 4-bettor position`);
    assert.equal(spot.openerPosition, spot.villainPosition);
    assert.equal(spot.aggressorPosition, spot.villainPosition);
    assert.equal(spot.defenderPosition, spot.heroPosition);
    assert.equal(spot.threeBettorPosition, spot.heroPosition);
    assert.equal(spot.fourBettorPosition, spot.villainPosition);
    assert(Array.isArray(spot.priorActions));
    assert.equal(spot.actionContext, "facing-4bet");
    assert.equal(Object.keys(spot.actionsByHand).length, 169);
    assert.deepEqual(spot.legalActions.map((action) => action.id), ["fold", "call", "fiveBetJam"]);
  });
}

function loadsAllBvbLimpSpots(pack) {
  const expectedActionsBySpotId = {
    fk_6max_100bb_sb_first_in_limp_or_raise_v1: ["fold", "limp", "raise"],
    fk_6max_100bb_bb_vs_sb_limp_v1: ["check", "raise"],
    fk_6max_100bb_sb_limp_vs_bb_raise_v1: ["fold", "call", "threeBet"],
  };

  BVB_LIMP_SPOT_IDS.forEach((spotId) => {
    const spot = preflop.getPreflopSpot(pack, spotId);
    assert(spot, `${spotId} should exist`);
    assert.equal(spot.family, "limpedPot");
    assert.equal(spot.actionContext, "limped-pot");
    assert(spot.heroPosition, `${spotId} should define hero position`);
    assert(Array.isArray(spot.priorActions));
    assert.equal(Object.keys(spot.actionsByHand).length, 169);
    assert.deepEqual(spot.legalActions.map((action) => action.id), expectedActionsBySpotId[spotId]);
  });
}

function loadsAllIsoVsLimpSpots(pack) {
  ISO_VS_LIMP_SPOT_IDS.forEach((spotId) => {
    const spot = preflop.getPreflopSpot(pack, spotId);
    assert(spot, `${spotId} should exist`);
    assert.equal(spot.family, "isoVsLimper");
    assert.equal(spot.spotType, "iso-vs-limper");
    assert.equal(spot.actionContext, "iso-vs-limper");
    assert(spot.heroPosition, `${spotId} should define hero position`);
    assert(spot.limperPosition, `${spotId} should define limper position`);
    assert.equal(spot.villainPosition, spot.limperPosition);
    assert.equal(spot.openerPosition, spot.limperPosition);
    assert.equal(spot.aggressorPosition, spot.limperPosition);
    assert.equal(spot.defenderPosition, spot.heroPosition);
    assert(Array.isArray(spot.priorActions));
    assert.equal(Object.keys(spot.actionsByHand).length, 169);
    assert.deepEqual(spot.legalActions.map((action) => action.id), ["fold", "call", "isoRaise"]);
  });
}

function loadsAllSqueezeSpots(pack) {
  SQUEEZE_SPOT_IDS.forEach((spotId) => {
    const spot = preflop.getPreflopSpot(pack, spotId);
    assert(spot, `${spotId} should exist`);
    assert.equal(spot.family, "squeeze");
    assert.equal(spot.spotType, "squeeze");
    assert.equal(spot.actionContext, "squeeze");
    assert(spot.heroPosition, `${spotId} should define hero position`);
    assert(spot.openerPosition, `${spotId} should define opener position`);
    assert(spot.callerPosition, `${spotId} should define caller position`);
    assert.equal(spot.villainPosition, spot.openerPosition);
    assert.equal(spot.aggressorPosition, spot.openerPosition);
    assert.equal(spot.defenderPosition, spot.heroPosition);
    assert(Array.isArray(spot.priorActions));
    assert.equal(Object.keys(spot.actionsByHand).length, 169);
    assert.deepEqual(spot.legalActions.map((action) => action.id), ["fold", "call", "squeeze"]);
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
  FACING_FOUR_BET_SPOT_IDS.forEach((spotId) => {
    assert.equal(preflop.getPreflopSpotFamily(preflop.getPreflopSpot(pack, spotId)), "facingFourBet");
  });
  BVB_LIMP_SPOT_IDS.forEach((spotId) => {
    assert.equal(preflop.getPreflopSpotFamily(preflop.getPreflopSpot(pack, spotId)), "limpedPot");
  });
  ISO_VS_LIMP_SPOT_IDS.forEach((spotId) => {
    assert.equal(preflop.getPreflopSpotFamily(preflop.getPreflopSpot(pack, spotId)), "isoVsLimper");
  });
  SQUEEZE_SPOT_IDS.forEach((spotId) => {
    assert.equal(preflop.getPreflopSpotFamily(preflop.getPreflopSpot(pack, spotId)), "squeeze");
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

function samplesFacingThreeBetQuestionsFromPriorOpenRange(pack) {
  FACING_THREE_BET_SPOT_IDS.forEach((spotId) => {
    const spot = preflop.getPreflopSpot(pack, spotId);
    const priorSpot = findPriorOpenSpot(pack, spot);
    assert(priorSpot, `${spotId} should have a matching prior open decision spot`);

    const sampleHands = preflop.getPreflopSampleHandClasses(pack, spot);
    assert(sampleHands.length > 0, `${spotId} should have sampleable hands`);
    assert(sampleHands.length < 169, `${spotId} should not sample the full 169 after Hero has already opened`);
    assert(sampleHands.includes("AA"), `${spotId} should include premium prior opens`);
    assert(!sampleHands.includes("72o"), `${spotId} should exclude trash prior opens`);
    if (spot.heroPosition === "LJ") {
      assert(!sampleHands.includes("J9s"), `${spotId} should not auto-open marginal LJ J9s before facing a 3-bet`);
    }

    sampleHands.forEach((handClass) => {
      const priorStrategy = preflop.getPreflopHandStrategy(priorSpot, handClass);
      assert(
        (priorStrategy?.actions?.raise || 0) >= preflop.PRIOR_OPEN_MIN_FREQUENCY,
        `${spotId} sampled ${handClass}, but prior open frequency was too low`
      );
    });

    const sampled = preflop.samplePreflopQuestion({
      packOrNormalizedPack: pack,
      spotId,
      rng: fixedRng(0.999),
    });
    assert(sampleHands.includes(sampled.handClass), `${spotId} sampled outside the prior open range`);
  });
}

function findPriorOpenSpot(pack, facingThreeBetSpot) {
  const openerPosition = facingThreeBetSpot.openerPosition || facingThreeBetSpot.heroPosition;
  return pack.spots.find((candidate) => {
    const actionIds = new Set(candidate.legalActions.map((action) => action.id));
    return candidate.heroPosition === openerPosition
      && candidate.actionContext === "rfi"
      && candidate.priorAction === "folded-to-hero"
      && actionIds.has("raise");
  }) || null;
}

function samplesFacingFourBetQuestionsFromPriorThreeBetRange(pack) {
  FACING_FOUR_BET_SPOT_IDS.forEach((spotId) => {
    const spot = preflop.getPreflopSpot(pack, spotId);
    const priorSpot = findPriorThreeBetSpot(pack, spot);
    assert(priorSpot, `${spotId} should have a matching prior 3-bet decision spot`);

    const sampleHands = preflop.getPreflopSampleHandClasses(pack, spot);
    assert(sampleHands.length > 0, `${spotId} should have sampleable hands`);
    assert(sampleHands.length < 169, `${spotId} should not sample the full 169 after Hero has already 3-bet`);
    assert(sampleHands.includes("AA"), `${spotId} should include premium prior 3-bets`);
    assert(!sampleHands.includes("72o"), `${spotId} should exclude trash prior 3-bets`);
    sampleHands.forEach((handClass) => {
      const priorStrategy = preflop.getPreflopHandStrategy(priorSpot, handClass);
      assert(
        (priorStrategy?.actions?.threeBet || 0) >= preflop.PRIOR_AGGRESSION_MIN_FREQUENCY,
        `${spotId} sampled ${handClass}, but prior 3-bet frequency was too low`
      );
    });

    const sampled = preflop.samplePreflopQuestion({
      packOrNormalizedPack: pack,
      spotId,
      rng: fixedRng(0.999),
    });
    assert(sampleHands.includes(sampled.handClass), `${spotId} sampled outside the prior 3-bet range`);
  });
}

function findPriorThreeBetSpot(pack, facingFourBetSpot) {
  const heroPosition = facingFourBetSpot.threeBettorPosition || facingFourBetSpot.heroPosition;
  const openerPosition = facingFourBetSpot.openerPosition || facingFourBetSpot.villainPosition;
  return pack.spots
    .filter((candidate) => {
      const actionIds = new Set(candidate.legalActions.map((action) => action.id));
      const candidateOpener = candidate.openerPosition || candidate.villainPosition;
      return candidate.heroPosition === heroPosition
        && candidateOpener === openerPosition
        && candidate.actionContext === "facing-open"
        && actionIds.has("threeBet");
    })
    .sort((left, right) => priorThreeBetPriority(left) - priorThreeBetPriority(right))[0] || null;
}

function priorThreeBetPriority(spot) {
  const family = preflop.getPreflopSpotFamily(spot);
  if (family === "threeBetVsOpen") return 0;
  if (family === "facingOpen") return 1;
  if (family === "bbDefense") return 2;
  return 3;
}

function resolvesDrillSpotIds() {
  const options = [
    { id: "all-preflop", default: true, spotIds: LIVE_SPOT_IDS },
    { id: "all-rfi", spotIds: RFI_SPOT_IDS },
    { id: "co-rfi", spotIds: ["fk_6max_100bb_co_rfi_unopened_v1"] },
    { id: "all-facing-open", spotIds: FACING_OPEN_COVERAGE_SPOT_IDS },
    { id: "fo-btn-vs-hj", spotIds: ["fk_6max_100bb_btn_vs_hj_open_v1"] },
    { id: "all-bb-defense", spotIds: BB_DEFENSE_SPOT_IDS },
    { id: "bb-vs-btn", spotIds: ["fk_6max_100bb_bb_vs_btn_open_v1"] },
    { id: "all-three-bet", spotIds: THREE_BET_SPOT_IDS },
    { id: "btn-vs-co-3bet", spotIds: ["fk_6max_100bb_btn_vs_co_open_3bet_v1"] },
    { id: "all-facing-3bet", spotIds: FACING_THREE_BET_SPOT_IDS },
    { id: "lj-open-vs-bb-3bet", spotIds: ["fk_6max_100bb_lj_open_vs_bb_3bet_v1"] },
    { id: "btn-open-vs-bb-3bet", spotIds: ["fk_6max_100bb_btn_open_vs_bb_3bet_v1"] },
    { id: "sb-open-vs-bb-3bet", spotIds: ["fk_6max_100bb_sb_open_vs_bb_3bet_v1"] },
    { id: "all-facing-4bet", spotIds: FACING_FOUR_BET_SPOT_IDS },
    { id: "btn-3bet-vs-co-open-co-4bet", spotIds: ["fk_6max_100bb_btn_3bet_vs_co_open_co_4bet_v1"] },
    { id: "bb-3bet-vs-btn-open-btn-4bet", spotIds: ["fk_6max_100bb_bb_3bet_vs_btn_open_btn_4bet_v1"] },
    { id: "all-bvb-limp", spotIds: BVB_LIMP_SPOT_IDS },
    { id: "sb-first-limp-or-raise", spotIds: ["fk_6max_100bb_sb_first_in_limp_or_raise_v1"] },
    { id: "bb-vs-sb-limp", spotIds: ["fk_6max_100bb_bb_vs_sb_limp_v1"] },
    { id: "sb-limp-vs-bb-raise", spotIds: ["fk_6max_100bb_sb_limp_vs_bb_raise_v1"] },
    { id: "all-iso-vs-limp", spotIds: ISO_VS_LIMP_SPOT_IDS },
    { id: "iso-hj-vs-lj-limp", spotIds: ["fk_6max_100bb_hj_vs_lj_limp_v1"] },
    { id: "iso-btn-vs-lj-limp", spotIds: ["fk_6max_100bb_btn_vs_lj_limp_v1"] },
    { id: "iso-bb-vs-btn-limp", spotIds: ["fk_6max_100bb_bb_vs_btn_limp_v1"] },
    { id: "all-squeeze", spotIds: SQUEEZE_SPOT_IDS },
    { id: "sqz-btn-vs-lj-open-co-call", spotIds: ["fk_6max_100bb_btn_vs_lj_open_co_call_squeeze_v1"] },
    { id: "sqz-bb-vs-btn-open-sb-call", spotIds: ["fk_6max_100bb_bb_vs_btn_open_sb_call_squeeze_v1"] },
    { id: "review-mistakes", reviewMode: true, spotIds: [] },
  ];

  assert.equal(LIVE_SPOT_IDS.length, 56);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("all-preflop", options), LIVE_SPOT_IDS);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("co-rfi", options), ["fk_6max_100bb_co_rfi_unopened_v1"]);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("all-facing-open", options), FACING_OPEN_COVERAGE_SPOT_IDS);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("fo-btn-vs-hj", options), ["fk_6max_100bb_btn_vs_hj_open_v1"]);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("all-bb-defense", options), BB_DEFENSE_SPOT_IDS);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("bb-vs-btn", options), ["fk_6max_100bb_bb_vs_btn_open_v1"]);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("all-three-bet", options), THREE_BET_SPOT_IDS);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("btn-vs-co-3bet", options), ["fk_6max_100bb_btn_vs_co_open_3bet_v1"]);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("all-facing-3bet", options), FACING_THREE_BET_SPOT_IDS);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("lj-open-vs-bb-3bet", options), ["fk_6max_100bb_lj_open_vs_bb_3bet_v1"]);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("btn-open-vs-bb-3bet", options), ["fk_6max_100bb_btn_open_vs_bb_3bet_v1"]);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("sb-open-vs-bb-3bet", options), ["fk_6max_100bb_sb_open_vs_bb_3bet_v1"]);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("all-facing-4bet", options), FACING_FOUR_BET_SPOT_IDS);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("btn-3bet-vs-co-open-co-4bet", options), ["fk_6max_100bb_btn_3bet_vs_co_open_co_4bet_v1"]);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("bb-3bet-vs-btn-open-btn-4bet", options), ["fk_6max_100bb_bb_3bet_vs_btn_open_btn_4bet_v1"]);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("all-bvb-limp", options), BVB_LIMP_SPOT_IDS);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("sb-first-limp-or-raise", options), ["fk_6max_100bb_sb_first_in_limp_or_raise_v1"]);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("bb-vs-sb-limp", options), ["fk_6max_100bb_bb_vs_sb_limp_v1"]);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("sb-limp-vs-bb-raise", options), ["fk_6max_100bb_sb_limp_vs_bb_raise_v1"]);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("all-iso-vs-limp", options), ISO_VS_LIMP_SPOT_IDS);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("iso-hj-vs-lj-limp", options), ["fk_6max_100bb_hj_vs_lj_limp_v1"]);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("iso-btn-vs-lj-limp", options), ["fk_6max_100bb_btn_vs_lj_limp_v1"]);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("iso-bb-vs-btn-limp", options), ["fk_6max_100bb_bb_vs_btn_limp_v1"]);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("all-squeeze", options), SQUEEZE_SPOT_IDS);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("sqz-btn-vs-lj-open-co-call", options), ["fk_6max_100bb_btn_vs_lj_open_co_call_squeeze_v1"]);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("sqz-bb-vs-btn-open-sb-call", options), ["fk_6max_100bb_bb_vs_btn_open_sb_call_squeeze_v1"]);
  assert.deepEqual(preflop.resolvePreflopDrillSpotIds("missing", options), LIVE_SPOT_IDS);
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
  const btnThreeBetVsCoFourBet = preflop.getPreflopSpot(pack, "fk_6max_100bb_btn_3bet_vs_co_open_co_4bet_v1");
  const sbFirstLimp = preflop.getPreflopSpot(pack, "fk_6max_100bb_sb_first_in_limp_or_raise_v1");
  const bbVsSbLimp = preflop.getPreflopSpot(pack, "fk_6max_100bb_bb_vs_sb_limp_v1");
  const sbLimpVsBbRaise = preflop.getPreflopSpot(pack, "fk_6max_100bb_sb_limp_vs_bb_raise_v1");
  const btnVsLjLimp = preflop.getPreflopSpot(pack, "fk_6max_100bb_btn_vs_lj_limp_v1");
  const sbVsBtnLimp = preflop.getPreflopSpot(pack, "fk_6max_100bb_sb_vs_btn_limp_v1");
  const btnSqueezeLjCo = preflop.getPreflopSpot(pack, "fk_6max_100bb_btn_vs_lj_open_co_call_squeeze_v1");

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
  assert.equal(preflop.formatPreflopActionLabel("call", btnVsLjLimp), "Overlimp");
  assert.equal(preflop.formatPreflopActionLabel("call", sbVsBtnLimp), "Complete");
  assert.equal(preflop.formatPreflopSpotLabel(btn), "BTN first in");
  assert.equal(preflop.formatPreflopSpotLabel(bbVsBtn), "BB vs BTN open");
  assert.equal(preflop.formatPreflopSpotLabel(btnVsHj), "BTN vs HJ open");
  assert.equal(preflop.formatPreflopSpotLabel(btnVsCo), "BTN vs CO open");
  assert.equal(preflop.formatPreflopSpotLabel(btnOpenVsBb), "BTN open vs BB 3-bet");
  assert.equal(preflop.formatPreflopSpotLabel(btnThreeBetVsCoFourBet), "BTN 3-bet vs CO open, CO 4-bet");
  assert.equal(preflop.formatPreflopSpotLabel(sbFirstLimp), "SB first in: limp or raise");
  assert.equal(preflop.formatPreflopSpotLabel(bbVsSbLimp), "BB vs SB limp");
  assert.equal(preflop.formatPreflopSpotLabel(sbLimpVsBbRaise), "SB limp vs BB raise");
  assert.equal(preflop.formatPreflopSpotLabel(btnVsLjLimp), "BTN vs LJ limp");
  assert.equal(preflop.formatPreflopSpotLabel(sbVsBtnLimp), "SB vs BTN limp");
  assert.equal(preflop.formatPreflopSpotLabel(btnSqueezeLjCo), "BTN vs LJ open + CO call");
  assert.equal(preflop.formatPreflopSpotLabel({
    family: "facingFourBet",
    heroPosition: "BTN",
    openerPosition: "CO",
    aggressorPosition: "CO",
  }), "BTN 3-bet vs CO open, CO 4-bet");
  assert.equal(preflop.formatPreflopSpotLabel({
    family: "limpedPot",
    heroPosition: "BB",
  }), "BB in limped pot");
  assert.equal(preflop.formatPreflopSpotLabel({
    family: "isoVsLimper",
    heroPosition: "CO",
    limperPosition: "LJ",
  }), "CO vs LJ limp");
  assert.equal(preflop.formatPreflopSpotLabel({
    family: "squeeze",
    heroPosition: "SB",
    openerPosition: "CO",
    callerPosition: "BTN",
  }), "SB vs CO open + BTN call");
  assert.equal(preflop.formatPreflopSizeLabel(btn), "Open 2.3bb");
  assert.equal(preflop.formatPreflopSizeLabel(sb), "Open 3bb");
  assert.equal(preflop.formatPreflopSizeLabel(bbVsBtn), "BTN opens 2.3bb");
  assert.equal(preflop.formatPreflopSizeLabel(bbVsSb), "SB opens 3bb");
  assert.equal(preflop.formatPreflopSizeLabel(btnVsHj), "HJ opens 2.3bb");
  assert.equal(preflop.formatPreflopSizeLabel(btnVsCo), "CO opens 2.3bb");
  assert.equal(preflop.formatPreflopSizeLabel(btnOpenVsBb), "BB 3-bets 9.5bb");
  assert.equal(preflop.formatPreflopSizeLabel(btnThreeBetVsCoFourBet), "CO 4-bets 21bb");
  assert.equal(preflop.formatPreflopSizeLabel(sbFirstLimp), "Limp 1bb / Raise 3bb");
  assert.equal(preflop.formatPreflopSizeLabel(bbVsSbLimp), "SB limps 1bb");
  assert.equal(preflop.formatPreflopSizeLabel(sbLimpVsBbRaise), "BB raises 4.5bb");
  assert.equal(preflop.formatPreflopSizeLabel(btnVsLjLimp), "Iso 4.5bb");
  assert.equal(preflop.formatPreflopSizeLabel(sbVsBtnLimp), "Iso 5bb");
  assert.equal(preflop.formatPreflopSizeLabel(btnSqueezeLjCo), "Squeeze 10.5bb");
}

run();
