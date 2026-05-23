const assert = require("assert");
const progress = require("../preflop-progress");

const SPOT_ID = "fk_6max_100bb_btn_rfi_unopened_v1";

function run() {
  recordsCorrectAttempt();
  recordsMistakeAttempt();
  samplesRecentMistake();
  ignoresLegacyByConstruction();
  console.log("preflop-progress tests passed");
}

function recordsCorrectAttempt() {
  const next = progress.recordPreflop6maxAttempt(progress.createPreflop6maxProgress(), {
    spotId: SPOT_ID,
    handClass: "AA",
    chosenActionId: "raise",
    preferredActionId: "raise",
    chosenFrequency: 1,
    preferredFrequency: 1,
    resultKind: "correct",
  }, 100);

  assert.equal(next.totals.attempts, 1);
  assert.equal(next.totals.correct, 1);
  assert.equal(next.totals.mistakes, 0);
  assert.equal(next.attemptsBySpotHand[`${SPOT_ID}|AA`].lastResult, "correct");
  assert.equal(next.mistakes.length, 0);
}

function recordsMistakeAttempt() {
  const next = progress.recordPreflop6maxAttempt(progress.createPreflop6maxProgress(), {
    spotId: SPOT_ID,
    handClass: "72o",
    chosenActionId: "raise",
    preferredActionId: "fold",
    chosenFrequency: 0,
    preferredFrequency: 1,
    resultKind: "mistake",
  }, 200);

  assert.equal(next.totals.attempts, 1);
  assert.equal(next.totals.correct, 0);
  assert.equal(next.totals.mistakes, 1);
  assert.equal(next.attemptsBySpotHand[`${SPOT_ID}|72o`].mistakes, 1);
  assert.equal(next.mistakes.length, 1);
  assert.equal(next.mistakes[0].handClass, "72o");
}

function samplesRecentMistake() {
  const first = progress.recordPreflop6maxAttempt(progress.createPreflop6maxProgress(), {
    spotId: SPOT_ID,
    handClass: "K2o",
    chosenActionId: "raise",
    preferredActionId: "fold",
    resultKind: "mistake",
  }, 300);
  const second = progress.recordPreflop6maxAttempt(first, {
    spotId: SPOT_ID,
    handClass: "83o",
    chosenActionId: "raise",
    preferredActionId: "fold",
    resultKind: "illegal",
  }, 400);

  assert.equal(progress.samplePreflop6maxMistake(second, { rng: () => 0 }).handClass, "83o");
  assert.equal(progress.samplePreflop6maxMistake(second, { rng: () => 0.99 }).handClass, "K2o");
}

function ignoresLegacyByConstruction() {
  const next = progress.normalizePreflop6maxProgress({
    attemptsBySpotHand: {},
    mistakes: [],
    totals: {},
    legacyScenarioIds: ["six-btn-open"],
  });

  assert.equal(next.totals.attempts, 0);
  assert.equal(next.mistakes.length, 0);
  assert.equal(next.legacyScenarioIds, undefined);
}

run();
