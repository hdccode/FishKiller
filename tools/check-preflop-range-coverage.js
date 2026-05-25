#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const preflop = require("../preflop-engine");

const ROOT = path.resolve(__dirname, "..");
const PACK_PATH = path.join(ROOT, "data", "preflop-ranges", "real", "fishkiller-6max-100bb-v1.preflop-range.json");
const EXPECTED_HAND_COUNT = 169;
const EXPECTED_REAL_SPOT_COUNT = 26;

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

const FUTURE_TARGET_FAMILIES = [
  "facing 4-bet",
  "blind-vs-blind limp",
  "iso vs limper",
  "squeeze",
];

const DRILL_OPTIONS = [
  { id: "all-rfi", default: true, spotIds: RFI_SPOT_IDS },
  { id: "lj-rfi", spotIds: ["fk_6max_100bb_lj_rfi_unopened_v1"] },
  { id: "hj-rfi", spotIds: ["fk_6max_100bb_hj_rfi_unopened_v1"] },
  { id: "co-rfi", spotIds: ["fk_6max_100bb_co_rfi_unopened_v1"] },
  { id: "btn-rfi", spotIds: ["fk_6max_100bb_btn_rfi_unopened_v1"] },
  { id: "sb-rfi", spotIds: ["fk_6max_100bb_sb_rfi_unopened_v1"] },
  { id: "all-facing-open", spotIds: FACING_OPEN_COVERAGE_SPOT_IDS },
  { id: "fo-hj-vs-lj", spotIds: ["fk_6max_100bb_hj_vs_lj_open_v1"] },
  { id: "fo-co-vs-lj", spotIds: ["fk_6max_100bb_co_vs_lj_open_v1"] },
  { id: "fo-co-vs-hj", spotIds: ["fk_6max_100bb_co_vs_hj_open_3bet_v1"] },
  { id: "fo-btn-vs-lj", spotIds: ["fk_6max_100bb_btn_vs_lj_open_v1"] },
  { id: "fo-btn-vs-hj", spotIds: ["fk_6max_100bb_btn_vs_hj_open_v1"] },
  { id: "fo-btn-vs-co", spotIds: ["fk_6max_100bb_btn_vs_co_open_3bet_v1"] },
  { id: "fo-sb-vs-lj", spotIds: ["fk_6max_100bb_sb_vs_lj_open_v1"] },
  { id: "fo-sb-vs-hj", spotIds: ["fk_6max_100bb_sb_vs_hj_open_v1"] },
  { id: "fo-sb-vs-co", spotIds: ["fk_6max_100bb_sb_vs_co_open_3bet_v1"] },
  { id: "fo-sb-vs-btn", spotIds: ["fk_6max_100bb_sb_vs_btn_open_3bet_v1"] },
  { id: "fo-bb-vs-lj", spotIds: ["fk_6max_100bb_bb_vs_lj_open_v1"] },
  { id: "fo-bb-vs-hj", spotIds: ["fk_6max_100bb_bb_vs_hj_open_v1"] },
  { id: "fo-bb-vs-co", spotIds: ["fk_6max_100bb_bb_vs_co_open_v1"] },
  { id: "fo-bb-vs-btn", spotIds: ["fk_6max_100bb_bb_vs_btn_open_v1"] },
  { id: "fo-bb-vs-sb", spotIds: ["fk_6max_100bb_bb_vs_sb_open_v1"] },
  { id: "all-bb-defense", spotIds: BB_DEFENSE_SPOT_IDS },
  { id: "bb-vs-lj", spotIds: ["fk_6max_100bb_bb_vs_lj_open_v1"] },
  { id: "bb-vs-hj", spotIds: ["fk_6max_100bb_bb_vs_hj_open_v1"] },
  { id: "bb-vs-co", spotIds: ["fk_6max_100bb_bb_vs_co_open_v1"] },
  { id: "bb-vs-btn", spotIds: ["fk_6max_100bb_bb_vs_btn_open_v1"] },
  { id: "bb-vs-sb", spotIds: ["fk_6max_100bb_bb_vs_sb_open_v1"] },
  { id: "all-three-bet", spotIds: THREE_BET_SPOT_IDS },
  { id: "btn-vs-co-3bet", spotIds: ["fk_6max_100bb_btn_vs_co_open_3bet_v1"] },
  { id: "co-vs-hj-3bet", spotIds: ["fk_6max_100bb_co_vs_hj_open_3bet_v1"] },
  { id: "hj-vs-lj-3bet", spotIds: ["fk_6max_100bb_hj_vs_lj_open_3bet_v1"] },
  { id: "sb-vs-btn-3bet", spotIds: ["fk_6max_100bb_sb_vs_btn_open_3bet_v1"] },
  { id: "sb-vs-co-3bet", spotIds: ["fk_6max_100bb_sb_vs_co_open_3bet_v1"] },
  { id: "all-facing-3bet", spotIds: FACING_THREE_BET_SPOT_IDS },
  { id: "btn-open-vs-bb-3bet", spotIds: ["fk_6max_100bb_btn_open_vs_bb_3bet_v1"] },
  { id: "co-open-vs-btn-3bet", spotIds: ["fk_6max_100bb_co_open_vs_btn_3bet_v1"] },
  { id: "co-open-vs-sb-3bet", spotIds: ["fk_6max_100bb_co_open_vs_sb_3bet_v1"] },
  { id: "hj-open-vs-btn-3bet", spotIds: ["fk_6max_100bb_hj_open_vs_btn_3bet_v1"] },
  { id: "lj-open-vs-hj-3bet", spotIds: ["fk_6max_100bb_lj_open_vs_hj_3bet_v1"] },
  { id: "review-mistakes", reviewMode: true, spotIds: [] },
];

const FAMILY_DEFINITIONS = [
  {
    name: "RFI",
    spotIds: RFI_SPOT_IDS,
    legalActions: ["fold", "raise"],
    family: "rfi",
    matches: (spot) => preflop.getPreflopSpotFamily(spot) === "rfi" && spot.priorAction === "folded-to-hero",
  },
  {
    name: "facing open response",
    spotIds: FACING_OPEN_RESPONSE_SPOT_IDS,
    legalActions: ["fold", "call", "threeBet"],
    family: "facingOpen",
    matches: (spot) => preflop.getPreflopSpotFamily(spot) === "facingOpen" && spot.spotType === "facing-open-response",
  },
  {
    name: "BB defense",
    spotIds: BB_DEFENSE_SPOT_IDS,
    legalActions: ["fold", "call", "threeBet"],
    family: "bbDefense",
    matches: (spot) => preflop.getPreflopSpotFamily(spot) === "bbDefense" && spot.heroPosition === "BB",
  },
  {
    name: "3-bet vs open",
    spotIds: THREE_BET_SPOT_IDS,
    legalActions: ["fold", "call", "threeBet"],
    family: "threeBetVsOpen",
    matches: (spot) => preflop.getPreflopSpotFamily(spot) === "threeBetVsOpen" && spot.spotType === "three-bet-vs-open",
  },
  {
    name: "facing 3-bet",
    spotIds: FACING_THREE_BET_SPOT_IDS,
    legalActions: ["fold", "call", "fourBet"],
    family: "facingThreeBet",
    matches: (spot) => preflop.getPreflopSpotFamily(spot) === "facingThreeBet" && spot.spotType === "facing-3bet",
  },
];

main();

function main() {
  const errors = [];
  const pack = loadRealPack(errors);
  if (!pack) {
    report(errors);
    return;
  }

  if ((pack.spots || []).length !== EXPECTED_REAL_SPOT_COUNT) {
    errors.push(`Expected ${EXPECTED_REAL_SPOT_COUNT} real 6-max preflop spots, found ${(pack.spots || []).length}.`);
  }

  validateFamilyCounts(pack, errors);
  validateFacingOpenCoverage(pack, errors);
  validateCompleteSpots(pack, errors);
  validateDrillMappings(pack, errors);

  report(errors, pack);
}

function loadRealPack(errors) {
  if (!fs.existsSync(PACK_PATH)) {
    errors.push(`Real preflop range pack is missing: ${path.relative(ROOT, PACK_PATH)}`);
    return null;
  }

  try {
    return preflop.normalizePreflopRangePack(JSON.parse(fs.readFileSync(PACK_PATH, "utf8")));
  } catch (error) {
    errors.push(`Could not load real preflop range pack: ${error.message}`);
    return null;
  }
}

function validateFamilyCounts(pack, errors) {
  FAMILY_DEFINITIONS.forEach((family) => {
    const found = family.spotIds.map((spotId) => preflop.getPreflopSpot(pack, spotId)).filter(Boolean);
    if (found.length !== family.spotIds.length) {
      errors.push(`${family.name}: expected ${family.spotIds.length} supported spots, found ${found.length}.`);
    }

    family.spotIds.forEach((spotId) => {
      const spot = preflop.getPreflopSpot(pack, spotId);
      if (!spot) {
        errors.push(`${family.name}: missing spot ${spotId}.`);
        return;
      }
      if (!family.matches(spot)) {
        errors.push(`${spotId}: metadata does not match ${family.name}.`);
      }
      assertFamilyMetadata(spot, family, errors);
      assertLegalActions(spot, family.legalActions, errors);
    });
  });
}

function validateFacingOpenCoverage(pack, errors) {
  FACING_OPEN_COVERAGE_SPOT_IDS.forEach((spotId) => {
    const spot = preflop.getPreflopSpot(pack, spotId);
    if (!spot) {
      errors.push(`Facing open coverage: missing spot ${spotId}.`);
      return;
    }
    if (spot.actionContext !== "facing-open") {
      errors.push(`${spotId}: expected actionContext facing-open for Facing Open coverage.`);
    }
    assertLegalActions(spot, ["fold", "call", "threeBet"], errors);
  });
}

function assertFamilyMetadata(spot, family, errors) {
  if (spot.family !== family.family) {
    errors.push(`${spot.spotId}: expected family "${family.family}", got "${spot.family || ""}".`);
  }
  if (!spot.spotType) {
    errors.push(`${spot.spotId}: missing spotType metadata.`);
  }
  if (!Array.isArray(spot.priorActions)) {
    errors.push(`${spot.spotId}: priorActions must be an array.`);
  }
  if (!spot.openerPosition) {
    errors.push(`${spot.spotId}: missing openerPosition metadata.`);
  }
  if (family.family !== "rfi" && !spot.defenderPosition) {
    errors.push(`${spot.spotId}: missing defenderPosition metadata.`);
  }
  if (family.family !== "rfi" && !spot.aggressorPosition) {
    errors.push(`${spot.spotId}: missing aggressorPosition metadata.`);
  }
}

function validateCompleteSpots(pack, errors) {
  pack.spots
    .filter((spot) => spot.complete === true)
    .forEach((spot) => {
      const handCount = Object.keys(spot.actionsByHand || {}).length;
      if (handCount !== EXPECTED_HAND_COUNT) {
        errors.push(`${spot.spotId}: expected ${EXPECTED_HAND_COUNT} hands, found ${handCount}.`);
      }

      const family = FAMILY_DEFINITIONS.find((candidate) => candidate.matches(spot));
      if (!family) {
        errors.push(`${spot.spotId}: complete spot does not match a supported launch family.`);
        return;
      }
      assertLegalActions(spot, family.legalActions, errors);
    });
}

function validateDrillMappings(pack, errors) {
  DRILL_OPTIONS.forEach((drill) => {
    const spotIds = preflop.resolvePreflopDrillSpotIds(drill.id, DRILL_OPTIONS);
    if (drill.reviewMode) {
      if (spotIds.length) {
        errors.push(`${drill.id}: review drill should not map directly to range spots.`);
      }
      return;
    }
    if (!spotIds.length) {
      errors.push(`${drill.id}: drill maps to zero spots.`);
      return;
    }

    spotIds.forEach((spotId) => validateMappedSpot(pack, drill.id, spotId, errors));
  });
}

function validateMappedSpot(pack, drillId, spotId, errors) {
  const spot = preflop.getPreflopSpot(pack, spotId);
  if (!spot) {
    errors.push(`${drillId}: mapped spot does not exist: ${spotId}.`);
    return;
  }

  const matrix = preflop.buildPreflopRangeMatrix(spot);
  if (!matrix || matrix.cells.length !== EXPECTED_HAND_COUNT) {
    errors.push(`${drillId}/${spotId}: expected a ${EXPECTED_HAND_COUNT}-cell matrix.`);
  }

  let sample;
  try {
    sample = preflop.samplePreflopQuestion({
      packOrNormalizedPack: pack,
      spotId,
      rng: () => 0.42,
    });
  } catch (error) {
    errors.push(`${drillId}/${spotId}: sampling failed: ${error.message}`);
    return;
  }

  if (!sample || sample.spotId !== spotId) {
    errors.push(`${drillId}/${spotId}: sampled question has the wrong spot id.`);
  }
  if (!sample.strategy?.actions) {
    errors.push(`${drillId}/${spotId}: sampled question is missing strategy actions.`);
  }
  const spotActions = getLegalActionIds(spot);
  const sampleActions = (sample.legalActions || []).map((action) => action.id);
  if (spotActions.join(",") !== sampleActions.join(",")) {
    errors.push(`${drillId}/${spotId}: sampled legal actions do not match spot legal actions.`);
  }
}

function assertLegalActions(spot, expected, errors) {
  const actual = getLegalActionIds(spot);
  if (actual.join(",") !== expected.join(",")) {
    errors.push(`${spot.spotId}: expected legal actions ${expected.join("/")}, got ${actual.join("/")}.`);
  }
}

function getLegalActionIds(spot) {
  return (spot.legalActions || []).map((action) => action.id);
}

function report(errors, pack = null) {
  if (errors.length) {
    errors.forEach((error) => console.error(`ERROR: ${error}`));
    console.error(`Preflop range coverage check failed (${errors.length} error${errors.length === 1 ? "" : "s"}).`);
    process.exit(1);
  }

  const spotCount = pack?.spots?.length || 0;
  console.log(
    `Preflop range coverage passed: ${spotCount} real spots, ` +
      `${RFI_SPOT_IDS.length} RFI, ${BB_DEFENSE_SPOT_IDS.length} BB defense, ` +
      `${FACING_OPEN_COVERAGE_SPOT_IDS.length} facing-open coverage spots, ` +
      `${THREE_BET_SPOT_IDS.length} 3-bet-vs-open, ` +
      `${FACING_THREE_BET_SPOT_IDS.length} facing-3bet.`
  );
  console.log(`Future complete-preflop targets are documented but not required yet: ${FUTURE_TARGET_FAMILIES.join(", ")}.`);
}
