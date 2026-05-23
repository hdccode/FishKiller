const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const engine = require("../training-engine");

const demoContext = { window: { FISHKILLER_SOLVED_TREES: [] } };
vm.runInNewContext(
  fs.readFileSync(path.join(__dirname, "..", "solver-trees-demo.js"), "utf8"),
  demoContext
);
const demoTrees = demoContext.window.FISHKILLER_SOLVED_TREES;
const tree = demoTrees[0];

function fixedRng(values) {
  let index = 0;
  return () => values[Math.min(index++, values.length - 1)];
}

function run() {
  validatesDemoTree();
  loadsMultipleDemoBoards();
  rejectsUnsupportedActions();
  calculatesEvLoss();
  samplesWeightedVillainActions();
  simulatesPreflopToHero();
  handsOffPreflopAfterHeroOpen();
  rejectsImpossibleHeroRunouts();
  advancesContinuousHand();
  handlesMissingStrategyFallback();
  console.log("training-engine tests passed");
}

function validatesDemoTree() {
  demoTrees.forEach((candidate) => {
    const result = engine.validateSolvedTree(candidate);
    assert.equal(result.valid, true, `${candidate.treeId}: ${result.errors.join("; ")}`);
  });
}

function loadsMultipleDemoBoards() {
  const flops = new Set(demoTrees.map((candidate) => candidate.metadata.flop.join(" ")));
  assert.ok(demoTrees.length >= 5);
  assert.ok(flops.size >= 5);
}

function rejectsUnsupportedActions() {
  const session = engine.createTrainingSession({ tree, heroCombo: "AsQs", rng: fixedRng([0]) });
  const result = engine.applyHeroAction(session, "jam", fixedRng([0]));
  assert.equal(result.ok, false);
  assert.equal(result.error, "unsupported_action");
}

function calculatesEvLoss() {
  const session = engine.createTrainingSession({ tree, heroCombo: "AsQs", rng: fixedRng([0]) });
  const feedback = engine.createDecisionFeedback(engine.getCurrentNode(session), "AsQs", "check");
  assert.equal(feedback.preferredActionId, "bet_33");
  assert.equal(feedback.evLossBb, 0.06);
  assert.equal(feedback.severity, "acceptable");
}

function samplesWeightedVillainActions() {
  const sampled = engine.sampleWeightedAction({
    fold: { frequency: 0.38 },
    call: { frequency: 0.49 },
    raise_3x: { frequency: 0.13 },
  }, fixedRng([0.4]));
  assert.equal(sampled.actionId, "call");
}

function simulatesPreflopToHero() {
  const preflop = engine.createPreflopSimulator({
    tableSize: "six",
    seats: ["UTG", "HJ", "CO", "BTN", "SB", "BB"],
    heroPosition: "BTN",
    villainPosition: "BB",
  });
  engine.advancePreflopUntilUser(preflop);
  assert.equal(preflop.status, "awaiting_hero");
  assert.equal(preflop.currentActorSeat, "BTN");
  assert.deepEqual(
    preflop.history.filter((entry) => entry.actionId === "fold").map((entry) => entry.seat),
    ["UTG", "HJ", "CO"]
  );
}

function handsOffPreflopAfterHeroOpen() {
  const preflop = engine.createPreflopSimulator({
    tableSize: "six",
    seats: ["UTG", "HJ", "CO", "BTN", "SB", "BB"],
    heroPosition: "BTN",
    villainPosition: "BB",
  });
  engine.advancePreflopUntilUser(preflop);
  const result = engine.applyPreflopHeroAction(preflop, "open_2_5bb");
  assert.equal(result.ok, true);
  assert.equal(preflop.status, "complete");
  assert.equal(preflop.potBb, 5.5);
  assert.equal(preflop.history.some((entry) => entry.seat === "SB" && entry.actionId === "fold"), true);
  assert.equal(preflop.history.some((entry) => entry.seat === "BB" && entry.actionId === "call"), true);
}

function rejectsImpossibleHeroRunouts() {
  assert.equal(engine.isComboCompatibleWithTree(tree, "9s8s"), false);
  const session = engine.createTrainingSession({ tree, heroCombo: "9s8s", rng: fixedRng([0]) });
  assert.notEqual(session.heroCombo, "9s8s");
  const heroCardSet = new Set(session.heroCards.map((card) => card.toLowerCase()));
  Object.values(tree.nodes).forEach((node) => {
    (node.board || []).forEach((card) => {
      assert.equal(heroCardSet.has(String(card).toLowerCase()), false, `${session.heroCombo} collides with ${card}`);
    });
  });
}

function advancesContinuousHand() {
  const session = engine.createTrainingSession({ tree, heroCombo: "AsQs", rng: fixedRng([0.4, 0, 0.8, 0]) });
  const result = engine.applyHeroAction(session, "bet_33", fixedRng([0.4, 0, 0.8, 0]));
  assert.equal(result.ok, true);
  assert.equal(session.currentNodeId, "turn_after_bet_call_4h");
  assert.equal(session.board.join(" "), "Ks 7d 2c 4h");
  assert.equal(session.actionHistory.some((entry) => entry.actor === "villain" && entry.actionId === "call"), true);
}

function handlesMissingStrategyFallback() {
  const session = engine.createTrainingSession({ tree, heroCombo: "8c8d", rng: fixedRng([0]) });
  const feedback = engine.createDecisionFeedback(engine.getCurrentNode(session), "8c8d", "check");
  assert.equal(feedback.approximate, true);
  assert.equal(["acceptable", "good"].includes(feedback.severity), true);
}

run();
