const assert = require("assert");
const progress = require("../preflop-progress");

const SPOT_ID = "fk_6max_100bb_btn_rfi_unopened_v1";

function run() {
  recordsCorrectAttempt();
  recordsMistakeAttempt();
  samplesRecentMistake();
  ignoresLegacyByConstruction();
  summarizesEmptyProgress();
  summarizesTotals();
  detectsWeakestSpot();
  ordersRecentMistakes();
  countsActionPatterns();
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

function summarizesEmptyProgress() {
  const summary = progress.summarizePreflop6maxProgress(null);

  assert.equal(summary.totalAttempts, 0);
  assert.equal(summary.correctCount, 0);
  assert.equal(summary.mistakeCount, 0);
  assert.equal(summary.accuracy, 0);
  assert.deepEqual(summary.weakestSpots, []);
  assert.deepEqual(summary.recentMistakes, []);
}

function summarizesTotals() {
  let next = progress.createPreflop6maxProgress();
  next = progress.recordPreflop6maxAttempt(next, {
    spotId: SPOT_ID,
    handClass: "AA",
    chosenActionId: "raise",
    preferredActionId: "raise",
    resultKind: "correct",
  }, 500);
  next = progress.recordPreflop6maxAttempt(next, {
    spotId: SPOT_ID,
    handClass: "A5s",
    chosenActionId: "fold",
    preferredActionId: "raise",
    resultKind: "mixed",
  }, 600);
  next = progress.recordPreflop6maxAttempt(next, {
    spotId: SPOT_ID,
    handClass: "72o",
    chosenActionId: "raise",
    preferredActionId: "fold",
    resultKind: "mistake",
  }, 700);

  const summary = progress.summarizePreflop6maxProgress(next);

  assert.equal(summary.totalAttempts, 3);
  assert.equal(summary.correctCount, 1);
  assert.equal(summary.mixedCount, 1);
  assert.equal(summary.mistakeCount, 1);
  assert.equal(summary.accuracy, 1 / 3);
  assert.equal(summary.playableAccuracy, 2 / 3);
}

function detectsWeakestSpot() {
  const bbSpotId = "fk_6max_100bb_bb_vs_btn_open_v1";
  let next = progress.createPreflop6maxProgress();
  next = progress.recordPreflop6maxAttempt(next, {
    spotId: SPOT_ID,
    handClass: "AA",
    chosenActionId: "raise",
    preferredActionId: "raise",
    resultKind: "correct",
  }, 800);
  next = progress.recordPreflop6maxAttempt(next, {
    spotId: SPOT_ID,
    handClass: "KK",
    chosenActionId: "raise",
    preferredActionId: "raise",
    resultKind: "correct",
  }, 900);
  next = progress.recordPreflop6maxAttempt(next, {
    spotId: bbSpotId,
    handClass: "72o",
    chosenActionId: "call",
    preferredActionId: "fold",
    resultKind: "mistake",
  }, 1000);
  next = progress.recordPreflop6maxAttempt(next, {
    spotId: bbSpotId,
    handClass: "83o",
    chosenActionId: "threeBet",
    preferredActionId: "fold",
    resultKind: "mistake",
  }, 1100);

  const summary = progress.summarizePreflop6maxProgress(next, { minimumSpotAttempts: 2 });

  assert.equal(summary.weakestSpots[0].spotId, bbSpotId);
  assert.equal(summary.weakestSpots[0].mistakeRate, 1);
}

function ordersRecentMistakes() {
  let next = progress.createPreflop6maxProgress();
  next = progress.recordPreflop6maxAttempt(next, {
    spotId: SPOT_ID,
    handClass: "K2o",
    chosenActionId: "raise",
    preferredActionId: "fold",
    resultKind: "mistake",
  }, 1200);
  next = progress.recordPreflop6maxAttempt(next, {
    spotId: SPOT_ID,
    handClass: "83o",
    chosenActionId: "raise",
    preferredActionId: "fold",
    resultKind: "mistake",
  }, 1300);

  const summary = progress.summarizePreflop6maxProgress(next, { recentMistakeLimit: 2 });

  assert.equal(summary.recentMistakes[0].handClass, "83o");
  assert.equal(summary.recentMistakes[1].handClass, "K2o");
}

function countsActionPatterns() {
  const bbSpotId = "fk_6max_100bb_bb_vs_co_open_v1";
  let next = progress.createPreflop6maxProgress();
  next = progress.recordPreflop6maxAttempt(next, {
    spotId: SPOT_ID,
    handClass: "A5s",
    chosenActionId: "fold",
    preferredActionId: "raise",
    resultKind: "mistake",
  }, 1400);
  next = progress.recordPreflop6maxAttempt(next, {
    spotId: bbSpotId,
    handClass: "KQo",
    chosenActionId: "call",
    preferredActionId: "threeBet",
    resultKind: "mistake",
  }, 1500);
  next = progress.recordPreflop6maxAttempt(next, {
    spotId: bbSpotId,
    handClass: "72o",
    chosenActionId: "threeBet",
    preferredActionId: "fold",
    resultKind: "illegal",
  }, 1600);

  const patterns = progress.summarizePreflop6maxProgress(next).actionPatterns;

  assert.equal(patterns.overfold, 1);
  assert.equal(patterns.overcall, 1);
  assert.equal(patterns.overraise, 1);
  assert.equal(patterns.missedAggression, 2);
  assert.equal(patterns.illegal, 1);
}

run();
