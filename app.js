const STORAGE_KEY = "fishkiller-trainer-state-v1";
const LEGACY_STORAGE_KEY = "riverrise-trainer-state-v1";
const MAX_HEARTS = 5;
const HEART_REGEN_MS = (12 * 60 * 60 * 1000) / MAX_HEARTS;
const MAIN_SESSION_LENGTH = 10;
const SMALL_BLIND = 1;
const BIG_BLIND = 2;
const HAND_RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const FULL_HAND_STREETS = ["preflop", "flop", "turn", "river"];
const SOLVER_EQUITY_SAMPLES = 42;
const SOLVER_RANGE_SAMPLE_SIZE = 72;
const POSTFLOP_SOLVER_ENABLED = false;
const ENABLE_PIXI_TABLE = false;
const TABLE_ACTION_ANIMATION_MS = 850;
const TABLE_ACTION_ANIMATION_STAGGER_MS = 820;

const PRACTICE_MODES = {
  preflop: {
    id: "preflop",
    label: "Preflop Action",
    description: "One decision per hand: open, limp, call, squeeze, 3-bet, 4-bet, jam, or fold.",
  },
  full: {
    id: "full",
    label: "Full Hand Practice",
    description: "Paused while the postflop presentation and solver UX are rebuilt.",
    disabled: !POSTFLOP_SOLVER_ENABLED,
  },
};

const CARD_STYLES = [
  { id: "reef", name: "Reef Standard", xp: 0, description: "Clean blue-white trainer deck." },
  { id: "current", name: "Current Hunter", xp: 120, description: "Electric aqua trim for early grinders." },
  { id: "abyss", name: "Abyss Pro", xp: 320, description: "Deep-sea dark cards for serious volume." },
  { id: "goldfin", name: "Goldfin Elite", xp: 650, description: "Gold-edged deck for proven crushers." },
];

const VISUAL_SKINS = [
  { id: "fishkiller2", label: "FishKiller2" },
  { id: "fishkiller1", label: "FishKiller1" },
];
const DEFAULT_VISUAL_SKIN = "fishkiller2";

const TABLES = {
  hu: {
    id: "hu",
    label: "Heads-Up",
    shortLabel: "HU",
    subtitle: "Starter heads-up drills using the legacy scenario pack.",
    seats: [
      { seat: "SB / BTN", x: "50%", y: "18%" },
      { seat: "BB", x: "50%", y: "82%" },
    ],
  },
  three: {
    id: "three",
    label: "3-Max",
    shortLabel: "3M",
    subtitle: "Starter 3-max drills using the legacy scenario pack.",
    seats: [
      { seat: "BTN", x: "50%", y: "16%" },
      { seat: "SB", x: "24%", y: "76%" },
      { seat: "BB", x: "76%", y: "76%" },
    ],
  },
  six: {
    id: "six",
    label: "6-Max",
    shortLabel: "6M",
    subtitle: "Flagship 56-spot preflop trainer for RFI, facing-open, defense, 3-bet, facing 3-bet, facing 4-bet, BvB limp, iso vs limp, and squeeze.",
    seats: [
      { seat: "UTG", x: "18%", y: "40%" },
      { seat: "HJ", x: "33%", y: "17%" },
      { seat: "CO", x: "67%", y: "17%" },
      { seat: "BTN", x: "82%", y: "40%" },
      { seat: "SB", x: "66%", y: "80%" },
      { seat: "BB", x: "34%", y: "80%" },
    ],
  },
  nine: {
    id: "nine",
    label: "9-Max",
    shortLabel: "9M",
    subtitle: "Starter full-ring drills using the legacy scenario pack.",
    seats: [
      { seat: "UTG", x: "12%", y: "46%" },
      { seat: "UTG+1", x: "20%", y: "24%" },
      { seat: "MP", x: "38%", y: "12%" },
      { seat: "LJ", x: "58%", y: "12%" },
      { seat: "HJ", x: "76%", y: "24%" },
      { seat: "CO", x: "87%", y: "46%" },
      { seat: "BTN", x: "77%", y: "75%" },
      { seat: "SB", x: "50%", y: "85%" },
      { seat: "BB", x: "23%", y: "75%" },
    ],
  },
};

const SEAT_AVATAR_BY_SEAT = {
  "SB / BTN": "dolphin",
  UTG: "shark",
  "UTG+1": "octopus",
  MP: "turtle",
  LJ: "shark",
  HJ: "octopus",
  CO: "turtle",
  BTN: "blue-shark",
  SB: "dolphin",
  BB: "angler",
};

const SEAT_AVATAR_CONFIG = {
  shark: { src: "assets/avatars/seat-shark.png", objectPosition: "50% 50%", scale: 1.02, spriteLeft: "0%", spriteTop: "0%" },
  octopus: { src: "assets/avatars/seat-octopus.png", objectPosition: "50% 50%", scale: 1.02, spriteLeft: "-100%", spriteTop: "0%" },
  turtle: { src: "assets/avatars/seat-turtle.png", objectPosition: "51% 50%", scale: 1.02, spriteLeft: "-200%", spriteTop: "0%" },
  "blue-shark": { src: "assets/avatars/seat-blue-shark.png", objectPosition: "50% 50%", scale: 1.02, spriteLeft: "0%", spriteTop: "-100%" },
  dolphin: { src: "assets/avatars/seat-dolphin.png", objectPosition: "50% 51%", scale: 1.04, spriteLeft: "-100%", spriteTop: "-100%" },
  angler: { src: "assets/avatars/seat-angler.png", objectPosition: "50% 50%", scale: 1.02, spriteLeft: "-200%", spriteTop: "-100%" },
};

const SEAT_AVATAR_CROP_CONFIG = {
  shark: { scale: 1.26, x: "-2%", y: "1%", objectPosition: "49% 51%" },
  octopus: { scale: 1.22, x: "0%", y: "3%", objectPosition: "50% 53%" },
  turtle: { scale: 1.2, x: "2%", y: "2%", objectPosition: "53% 52%" },
  "blue-shark": { scale: 1.24, x: "-2%", y: "2%", objectPosition: "48% 52%" },
  dolphin: { scale: 1.2, x: "0%", y: "2%", objectPosition: "50% 53%" },
  angler: { scale: 1.24, x: "2%", y: "1%", objectPosition: "52% 51%" },
};

const SEAT_AVATAR_ASSET_VERSION = "20260601-dolphinbelly";
const SEAT_AVATAR_SPRITE_SRC = `assets/avatars/fishkiller-avatar-sheet.png?v=${SEAT_AVATAR_ASSET_VERSION}`;
const SEAT_SHELL_ASSET_VERSION = "20260603-fkseat-transparent";

const SIX_MAX_PLAYER_VIEW_SEAT_SLOTS = [
  { x: "50.4%", y: "82%", anchor: "hero" },
  { x: "28.6%", y: "82%", anchor: "bottom-left" },
  { x: "15.6%", y: "47%", anchor: "left" },
  { x: "34.6%", y: "11.2%", anchor: "top-left" },
  { x: "65.2%", y: "11.2%", anchor: "top-right" },
  { x: "81.6%", y: "47%", anchor: "right" },
];

const QUESTS = [
  {
    id: "complete-session",
    title: "Open The Lab",
    description: "Complete one main session today.",
    target: 1,
    reward: { type: "heart", amount: 1, label: "+1 heart" },
    getProgress: (daily) => daily.mainSessionsCompleted,
  },
  {
    id: "earn-xp",
    title: "XP Grind",
    description: "Earn 160 XP across all formats today.",
    target: 160,
    reward: { type: "boost", amount: 1, label: "+1 XP boost" },
    getProgress: (daily) => daily.xpEarned,
  },
  {
    id: "mix-sizes",
    title: "Table Hopper",
    description: "Train two different table sizes today.",
    target: 2,
    reward: { type: "xp", amount: 60, label: "+60 XP" },
    getProgress: (daily) => Object.keys(daily.tableSizesPlayed).length,
  },
];

const SCENARIOS = window.FISHKILLER_SCENARIOS || window.RIVERRISE_SCENARIOS || [];
const SOLVER_LIBRARY = normalizeSolverLibrary(window.FISHKILLER_SOLVER_LIBRARY);
const TRAINING_ENGINE_IDS = {
  scenarioPack: "scenario-pack",
  preflopRange: "preflop-range",
};
const PREFLOP_RANGE_PACK_URL = "data/preflop-ranges/real/fishkiller-6max-100bb-v1.preflop-range.json";
const DRILL_DEFINITIONS = window.FishKillerDrillDefinitions;
const {
  PREFLOP_RANGE_DEFAULT_DRILL_ID,
  PREFLOP_RANGE_REVIEW_DRILL_ID,
  PREFLOP_RANGE_DRILL_DEFAULT_VERSION,
} = DRILL_DEFINITIONS;
const PREFLOP_RANGE_TRAINABLE_SPOT_IDS = DRILL_DEFINITIONS.SPOT_IDS.TRAINABLE_SPOT_IDS;
const PREFLOP_RANGE_MIN_WEAK_SPOT_ATTEMPTS = 5;
const PREFLOP_RANGE_DRILL_OPTIONS = DRILL_DEFINITIONS.DRILL_OPTIONS;
const PREFLOP_RANGE_QUESTION_XP = 12;
const PREFLOP_PROGRESS = window.FishKillerPreflopProgress || null;
const SCENARIOS_BY_ID = Object.fromEntries(SCENARIOS.map((scenario) => [scenario.id, scenario]));
const SCENARIOS_BY_TABLE = SCENARIOS.reduce((accumulator, scenario) => {
  accumulator[scenario.tableSize] ||= [];
  accumulator[scenario.tableSize].push(scenario);
  return accumulator;
}, {});

const elements = window.FishKillerDomElements.collectDomElements(document);
const tableAnimationHooks = window.FishKillerTableAnimations.createTableAnimationHooks({
  windowRef: window,
  tableElement: elements.tableVisual,
});

let state = loadState();
let activeSession = null;
let latestSummary = null;
let preflopRangePack = null;
let preflopRangeSpot = null;
let preflopRangeSpots = [];
let preflopRangeStatus = "idle";
let tableActionAnimationKey = "";
let tableActionAnimationTimers = [];
let tableActionAnimationRevealKey = "";
let tableActionAnimationRevealedFoldSeats = new Set();
const solverCache = new Map();

boot();

function boot() {
  syncHearts(state);
  saveState();
  bindEvents();
  render();
  loadPreflopRangePack();

  window.setInterval(() => {
    syncHearts(state);
    ensureDailyState(state);
    saveState();
    renderTopline();
    renderQuests();
  }, 60000);
}

function bindEvents() {
  elements.splashStartButton?.addEventListener("click", enterAppFromSplash);
  elements.profileMenuButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleProfileMenu();
  });
  elements.profileMenu?.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  document.addEventListener("click", closeProfileMenu);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeEndSessionModal();
      closeProfileMenu();
    }
  });
  elements.startSessionButton.addEventListener("click", () => startMainSession(state.selectedTableSize));
  elements.continueButton.addEventListener("click", advanceSession);
  elements.sessionExitButton?.addEventListener("click", openEndSessionModal);
  elements.visualSkinToggle?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-skin]");
    if (button) {
      selectVisualSkin(button.dataset.skin);
    }
  });
  elements.gtoTableButton.addEventListener("click", openGtoModal);
  elements.gtoCloseButton.addEventListener("click", closeGtoModal);
  elements.cancelEndSessionButton?.addEventListener("click", closeEndSessionModal);
  elements.confirmEndSessionButton?.addEventListener("click", endActiveSessionPrematurely);
  elements.modalCloseButton.addEventListener("click", closeSummaryModal);
  elements.modalNewSessionButton.addEventListener("click", () => {
    closeSummaryModal();
    startMainSession(state.selectedTableSize);
  });
  elements.retryMissesButton.addEventListener("click", () => {
    if (!latestSummary || !latestSummary.reviewQueue.length) {
      return;
    }

    closeSummaryModal();
    if (latestSummary.reviewType === TRAINING_ENGINE_IDS.preflopRange) {
      startPreflopRangeReviewSession(latestSummary.tableSize);
      return;
    }

    startReviewSession(latestSummary.tableSize, latestSummary.reviewQueue);
  });
  elements.summaryModal.addEventListener("click", (event) => {
    if (event.target === elements.summaryModal) {
      closeSummaryModal();
    }
  });
  elements.endSessionModal?.addEventListener("click", (event) => {
    if (event.target === elements.endSessionModal) {
      closeEndSessionModal();
    }
  });
  elements.gtoModal.addEventListener("click", (event) => {
    if (event.target === elements.gtoModal) {
      closeGtoModal();
    }
  });
}

function loadPreflopRangePack() {
  if (!window.fetch || !window.FishKillerPreflopEngine) {
    preflopRangeStatus = "error";
    console.warn("Preflop range engine is not available; 6-max will use scenario fallback.");
    return;
  }

  preflopRangeStatus = "loading";
  window.FishKillerRangePackLoader.loadRangePack({
    url: PREFLOP_RANGE_PACK_URL,
    fetchImpl: fetch,
    engine: window.FishKillerPreflopEngine,
    getTrainableSpots: getPreflopRangeTrainableSpots,
  })
    .then(({ normalizedPack, spots }) => {
      preflopRangePack = normalizedPack;
      preflopRangeSpots = spots;
      preflopRangeSpot = spots[0];
      preflopRangeStatus = "ready";
      renderTopline();
      renderPracticeModes();
      renderScenario();
    })
    .catch((error) => {
      preflopRangeStatus = "error";
      preflopRangePack = null;
      preflopRangeSpot = null;
      preflopRangeSpots = [];
      console.warn("Failed to load preflop range pack; 6-max will use scenario fallback.", error);
    });
}

function enterAppFromSplash() {
  if (!elements.splashScreen) {
    document.body.classList.remove("splash-active");
    return;
  }

  if (elements.splashScreen.classList.contains("splash-pressed")) {
    return;
  }

  elements.splashScreen.classList.add("splash-pressed");
  elements.splashStartButton?.setAttribute("disabled", "true");
  document.body.classList.remove("splash-active");
  document.body.classList.add("app-launching");

  window.setTimeout(() => {
    elements.splashScreen.classList.add("splash-exiting");
  }, 180);

  window.setTimeout(() => {
    elements.splashScreen.classList.add("hidden");
    document.body.classList.remove("app-launching");
  }, 820);
}

function toggleProfileMenu() {
  if (!elements.profileMenu || !elements.profileMenuButton) {
    return;
  }

  const willOpen = elements.profileMenu.classList.contains("hidden");
  elements.profileMenu.classList.toggle("hidden", !willOpen);
  elements.profileMenuButton.setAttribute("aria-expanded", String(willOpen));
}

function closeProfileMenu() {
  elements.profileMenu?.classList.add("hidden");
  elements.profileMenuButton?.setAttribute("aria-expanded", "false");
}

function createDefaultState() {
  const now = Date.now();
  return {
    selectedTableSize: "six",
    hearts: MAX_HEARTS,
    heartRefillStartedAt: now,
    xpByTable: {
      hu: 0,
      three: 0,
      six: 0,
      nine: 0,
    },
    modeByTable: {
      hu: "preflop",
      three: "preflop",
      six: "preflop",
      nine: "preflop",
    },
    totalXp: 0,
    xpBoostSessions: 0,
    cardStyle: "reef",
    visualSkin: DEFAULT_VISUAL_SKIN,
    daily: createDailyState(),
    preflop6maxProgress: createDefaultPreflop6maxProgress(),
    preflop6maxDrillId: PREFLOP_RANGE_DEFAULT_DRILL_ID,
    preflop6maxDrillDefaultVersion: PREFLOP_RANGE_DRILL_DEFAULT_VERSION,
    lastResult: {
      grade: "No run yet",
      xp: 0,
      accuracy: 0,
      tableLabel: "-",
      misses: 0,
      note: "Finish a session to populate your most recent breakdown and review prompt.",
    },
  };
}

function createDailyState() {
  return {
    dateKey: getLocalDayKey(new Date()),
    mainSessionsCompleted: 0,
    xpEarned: 0,
    tableSizesPlayed: {},
    claimedQuestIds: [],
  };
}

function createDefaultPreflop6maxProgress() {
  return PREFLOP_PROGRESS
    ? PREFLOP_PROGRESS.createPreflop6maxProgress()
    : { attemptsBySpotHand: {}, mistakes: [], totals: { attempts: 0, correct: 0, mixed: 0, mistakes: 0 } };
}

function normalizePreflop6maxProgress(progress) {
  return PREFLOP_PROGRESS
    ? PREFLOP_PROGRESS.normalizePreflop6maxProgress(progress)
    : { ...createDefaultPreflop6maxProgress(), ...(progress || {}) };
}

function loadState() {
  const defaults = createDefaultState();

  try {
    const parsed = window.FishKillerProgressStore.loadJson(localStorage, [STORAGE_KEY, LEGACY_STORAGE_KEY]);
    // TODO(mobile): localStorage is fine for the browser demo, but long-term mobile progress should move behind a storage adapter.
    if (!parsed) {
      return defaults;
    }

    const merged = window.FishKillerAppState.mergeSavedState(defaults, parsed, {
      getCardStyleById,
      normalizeVisualSkinId,
      normalizePreflop6maxProgress,
      normalizeStoredPreflopRangeDrillId,
      preflopRangeDrillDefaultVersion: PREFLOP_RANGE_DRILL_DEFAULT_VERSION,
    });

    ensureDailyState(merged);
    return merged;
  } catch (error) {
    console.warn("Failed to load state", error);
    return defaults;
  }
}

function saveState() {
  // TODO(mobile): replace direct localStorage writes before PWA/Capacitor packaging so progress can survive quota and backup edge cases.
  window.FishKillerProgressStore.saveJson(localStorage, STORAGE_KEY, state);
}

function ensureDailyState(targetState) {
  const today = getLocalDayKey(new Date());
  if (targetState.daily.dateKey !== today) {
    targetState.daily = createDailyState();
  }
}

function syncHearts(targetState) {
  ensureDailyState(targetState);

  if (targetState.hearts >= MAX_HEARTS) {
    targetState.hearts = MAX_HEARTS;
    targetState.heartRefillStartedAt = Date.now();
    return;
  }

  const elapsed = Date.now() - targetState.heartRefillStartedAt;
  const recovered = Math.floor(elapsed / HEART_REGEN_MS);

  if (recovered <= 0) {
    return;
  }

  targetState.hearts = Math.min(MAX_HEARTS, targetState.hearts + recovered);
  if (targetState.hearts >= MAX_HEARTS) {
    targetState.heartRefillStartedAt = Date.now();
  } else {
    targetState.heartRefillStartedAt += recovered * HEART_REGEN_MS;
  }
}

function startMainSession(tableSize) {
  syncHearts(state);
  const practiceMode = getPracticeMode(tableSize);
  const sessionEngine = resolveSessionEngine(tableSize, practiceMode);

  if (activeSession && !window.confirm("Start a fresh session? Your current progress will be replaced.")) {
    return;
  }

  if (state.hearts <= 0) {
    showToast("No hearts left", `Next heart arrives in ${formatDuration(timeUntilNextHeart(state))}.`);
    render();
    return;
  }

  if (!isPracticeModeAvailable(practiceMode)) {
    showToast("Mode paused", "Postflop practice is commented out while we rebuild the presentation layer.");
    state.modeByTable[tableSize] = "preflop";
    saveState();
    render();
    return;
  }

  if (sessionEngine.engineId === TRAINING_ENGINE_IDS.preflopRange) {
    startPreflopRangeSession(tableSize, sessionEngine);
    return;
  }

  const scenarioCount = practiceMode === "full" ? Math.ceil(MAIN_SESSION_LENGTH / FULL_HAND_STREETS.length) : MAIN_SESSION_LENGTH;
  const scenarioIds = practiceMode === "preflop"
    ? createRandomPreflopScenarioIds(tableSize, MAIN_SESSION_LENGTH)
    : pickScenarioIds(tableSize, scenarioCount, practiceMode);
  activeSession = buildSession(tableSize, scenarioIds, "main", practiceMode);
  activeSession.trainingEngine = sessionEngine.engineId;
  activeSession.requestedTrainingEngine = sessionEngine.requestedEngineId;
  activeSession.usingEngineFallback = Boolean(sessionEngine.isFallback);
  latestSummary = null;
  closeSummaryModal();
  closeEndSessionModal();
  enterLessonMode();
  render();
}

function startPreflopRangeSession(tableSize, sessionEngine, options = {}) {
  const engine = window.FishKillerPreflopEngine;
  const spot = getActivePreflopRangeSpot();
  const drillId = options.reviewMode ? PREFLOP_RANGE_REVIEW_DRILL_ID : getSelectedPreflopRangeDrillId();

  if (!engine || !preflopRangePack || !spot) {
    console.warn("6-max preflop range trainer is unavailable; using the legacy scenario fallback.", {
      engineLoaded: Boolean(engine),
      rangePackLoaded: Boolean(preflopRangePack),
      hasActiveSpot: Boolean(spot),
    });
    const scenarioCount = MAIN_SESSION_LENGTH;
    const scenarioIds = createRandomPreflopScenarioIds(tableSize, scenarioCount);
    activeSession = buildSession(tableSize, scenarioIds, "main", "preflop");
    activeSession.trainingEngine = TRAINING_ENGINE_IDS.scenarioPack;
    activeSession.requestedTrainingEngine = sessionEngine.requestedEngineId;
    activeSession.usingEngineFallback = true;
    latestSummary = null;
    closeSummaryModal();
    closeEndSessionModal();
    enterLessonMode();
    render();
    return;
  }

  activeSession = {
    id: `preflop-range-${Date.now()}`,
    tableSize,
    mode: options.reviewMode ? "review" : "main",
    reviewType: options.reviewMode ? TRAINING_ENGINE_IDS.preflopRange : "",
    drillId,
    practiceMode: "preflop",
    trainingEngine: TRAINING_ENGINE_IDS.preflopRange,
    requestedTrainingEngine: sessionEngine.requestedEngineId,
    usingEngineFallback: false,
    rangePackId: preflopRangePack.packId,
    spotId: spot.spotId,
    questionStates: Array.from(
      { length: getPreflopRangeSessionLength(options.reviewMode) },
      () => createPreflopRangeQuestionState({ reviewMode: options.reviewMode, drillId })
    ),
    currentIndex: 0,
    pendingAdvance: false,
    strikes: 0,
    correctCount: 0,
    xpEarned: 0,
    missedIds: [],
    missedQuestions: [],
    reviewCarryForward: [],
  };
  activeSession.spotId = activeSession.questionStates[0]?.spotId || spot.spotId;
  latestSummary = null;
  closeSummaryModal();
  closeEndSessionModal();
  enterLessonMode();
  render();
}

function startPreflopRangeReviewSession(tableSize) {
  if (!PREFLOP_PROGRESS?.hasPreflop6maxMistakes(state.preflop6maxProgress)) {
    showToast("No range mistakes yet", "Miss a 6-max range spot first, then review it here.");
    closeSummaryModal();
    render();
    return;
  }

  startPreflopRangeSession(tableSize, {
    tableSize,
    practiceMode: "preflop",
    engineId: TRAINING_ENGINE_IDS.preflopRange,
    requestedEngineId: TRAINING_ENGINE_IDS.preflopRange,
    fallbackEngineId: TRAINING_ENGINE_IDS.scenarioPack,
    isFallback: false,
  }, { reviewMode: true });
}

function getPreflopRangeSessionLength(reviewMode = false) {
  if (!reviewMode) {
    return MAIN_SESSION_LENGTH;
  }

  return Math.max(1, Math.min(MAIN_SESSION_LENGTH, state.preflop6maxProgress?.mistakes?.length || 0));
}

function createPreflopRangeQuestionState(options = {}) {
  const sample = options.reviewMode
    ? samplePreflopRangeReviewQuestion() || samplePreflopRangeQuestion(options.drillId)
    : samplePreflopRangeQuestion(options.drillId);
  const spot = getPreflopRangeSpot(sample.spotId);

  return {
    engine: TRAINING_ENGINE_IDS.preflopRange,
    spotId: sample.spotId,
    handClass: sample.handClass,
    legalActions: sample.legalActions,
    strategy: sample.strategy,
    street: "preflop",
    answered: false,
    selected: "",
    isCorrect: false,
    isMixed: false,
    grade: null,
    startedAt: 0,
    answerMs: 0,
    preflopResponses: createPreflopRangeResponses(spot),
  };
}

function samplePreflopRangeQuestion(drillId = getSelectedPreflopRangeDrillId()) {
  const spot = samplePreflopRangeSpot(drillId);
  if (!spot) {
    throw new Error("No trainable 6-max preflop range spots are loaded.");
  }

  return window.FishKillerPreflopEngine.samplePreflopQuestion({
    packOrNormalizedPack: preflopRangePack,
    spotId: spot.spotId,
    rng: Math.random,
  });
}

function samplePreflopRangeReviewQuestion() {
  const mistake = PREFLOP_PROGRESS?.samplePreflop6maxMistake(state.preflop6maxProgress, { rng: Math.random });
  const spot = getPreflopRangeSpot(mistake?.spotId);
  if (!mistake || !spot) {
    return null;
  }

  const strategy = window.FishKillerPreflopEngine.getPreflopHandStrategy(spot, mistake.handClass);
  if (!strategy) {
    return null;
  }

  return {
    spotId: spot.spotId,
    handClass: mistake.handClass,
    legalActions: spot.legalActions,
    strategy,
    reviewSource: mistake,
  };
}

function startReviewSession(tableSize, scenarioIds) {
  const reviewRefs = normalizeReviewQuestionRefs(scenarioIds);
  if (!reviewRefs.length) {
    showToast("Review paused", "Only preflop review spots are active while postflop is commented out.");
    closeSummaryModal();
    render();
    return;
  }

  activeSession = buildSession(tableSize, reviewRefs, "review", "review");
  closeSummaryModal();
  enterLessonMode();
  render();
}

function buildSession(tableSize, scenarioIds, mode, practiceMode = "preflop") {
  return {
    id: `${mode}-${Date.now()}`,
    tableSize,
    mode,
    practiceMode,
    questionStates: buildQuestionStates(scenarioIds, practiceMode),
    currentIndex: 0,
    pendingAdvance: false,
    strikes: 0,
    correctCount: 0,
    xpEarned: 0,
    missedIds: [],
    missedQuestions: [],
    reviewCarryForward: [],
  };
}

function buildQuestionStates(scenarioIds, practiceMode) {
  if (practiceMode === "review") {
    return scenarioIds.map((questionRef) => createQuestionState(
      questionRef.scenarioId,
      questionRef.street || "preflop",
      questionRef.runoutSeed || questionRef.scenarioId
    ));
  }

  if (practiceMode !== "full") {
    return scenarioIds.map((scenarioId) => createQuestionState(scenarioId, "preflop"));
  }

  return scenarioIds.flatMap((scenarioId) => {
    const runoutSeed = `${scenarioId}-${Date.now()}-${Math.floor(Math.random() * 1000000000)}`;
    return FULL_HAND_STREETS.map((street) => createQuestionState(scenarioId, street, runoutSeed));
  });
}

function createQuestionState(scenarioId, street, runoutSeed = scenarioId) {
  const scenario = SCENARIOS_BY_ID[scenarioId];
  const spot = getScenarioSpot(scenario, { street, scenarioId, runoutSeed });
  return {
    scenarioId,
    street,
    runoutSeed,
    optionOrder: shuffleArray([...spot.options]),
    answered: false,
    selected: "",
    isCorrect: false,
    isMixed: false,
    mixInfo: null,
    initialSelected: "",
    initialIsCorrect: false,
    initialIsMixed: false,
    initialMixInfo: null,
    decisionReview: null,
    awaitingRaiseResponse: false,
    awaitingFinalRaiseResponse: false,
    raiseSpot: null,
    raiseResponse: "",
    raiseResponseCorrect: false,
    raiseResponseMixed: false,
    finalRaiseSpot: null,
    finalRaiseResponse: "",
    finalRaiseResponseCorrect: false,
    finalRaiseResponseMixed: false,
    startedAt: 0,
    answerMs: 0,
    villainResponse: null,
    villainReturnResponse: null,
    preflopResponses: [],
    preHeroActions: [],
    liveOpponentSeats: [],
    showdownResult: null,
  };
}

function getCurrentQuestion() {
  return activeSession ? activeSession.questionStates[activeSession.currentIndex] || null : null;
}

function getCurrentScenario() {
  const question = getCurrentQuestion();
  return question ? SCENARIOS_BY_ID[question.scenarioId] : null;
}

function getCurrentSpot() {
  const question = getCurrentQuestion();
  const scenario = getCurrentScenario();
  return question && scenario ? getScenarioSpot(scenario, question) : null;
}

function getMixedActionInfo(spot, selectedAction) {
  if (spot.street === "preflop") {
    return null;
  }

  const selectedSolverAction = getActionForOption(spot, selectedAction);
  const bestSolverAction = getActionForOption(spot, spot.correctAction);
  if (!selectedSolverAction || !bestSolverAction || selectedSolverAction.id === bestSolverAction.id) {
    return null;
  }

  const heroHand = normalizeHandClass(spot.heroHand);
  const solved = solvePostflopHandClass(heroHand, spot);
  const selectedFrequency = getSolvedActionFrequency(solved, selectedSolverAction.id);
  const bestFrequency = getSolvedActionFrequency(solved, bestSolverAction.id);

  if (selectedFrequency < 0.18 || bestFrequency < 0.34) {
    return null;
  }

  return {
    selectedAction,
    selectedLabel: selectedSolverAction.label,
    selectedFrequency,
    bestAction: spot.correctAction,
    bestLabel: bestSolverAction.label,
    bestFrequency,
    message: `${bestSolverAction.label} is preferred ${formatPercent(bestFrequency)}, but ${selectedSolverAction.label} is in the mix at ${formatPercent(selectedFrequency)}.`,
  };
}

function getActionForOption(spot, option) {
  return getMatrixActionSet(spot).find((action) => action.option === option) || null;
}

function getSolvedActionFrequency(solved, actionId) {
  const matched = solved.actions?.find((item) => item.action.id === actionId);
  if (matched && typeof matched.frequency === "number") {
    return matched.frequency;
  }

  if (solved.action?.id === actionId && solved.action.solver?.frequency) {
    return solved.action.solver.frequency;
  }

  return 0;
}

function answerCurrentQuestion(selectedAction) {
  const question = getCurrentQuestion();
  if (!question || question.answered || question.decisionReview) {
    return;
  }

  if (activeSession?.trainingEngine === TRAINING_ENGINE_IDS.preflopRange) {
    answerPreflopRangeQuestion(selectedAction);
    return;
  }

  if (question.awaitingFinalRaiseResponse) {
    answerFinalRaiseDecision(selectedAction);
    return;
  }

  if (question.awaitingRaiseResponse) {
    answerRaiseDecision(selectedAction);
    return;
  }

  const scenario = SCENARIOS_BY_ID[question.scenarioId];
  const spot = getScenarioSpot(scenario, question);
  const isCorrect = selectedAction === spot.correctAction;
  const mixInfo = isCorrect ? null : getMixedActionInfo(spot, selectedAction);
  const isMixed = Boolean(mixInfo);

  question.selected = selectedAction;
  question.initialSelected = selectedAction;
  question.initialIsCorrect = isCorrect;
  question.initialIsMixed = isMixed;
  question.initialMixInfo = mixInfo;

  const preflopReturnSpot = createPreflopReraiseReturnSpot(scenario, spot, question, selectedAction);
  if (preflopReturnSpot) {
    question.preflopResponses = preflopReturnSpot.preflopResponses;
    question.villainResponse = preflopReturnSpot.response;

    if (preflopReturnSpot.raiseSpot) {
      question.raiseSpot = preflopReturnSpot.raiseSpot;
      stageDecisionReview(question, {
        stage: "initial",
        selectedAction,
        correctAction: spot.correctAction,
        isCorrect,
        isMixed,
        mixInfo,
        nextStage: "raise",
        nextPrompt: `${preflopReturnSpot.response.seat} ${formatVillainResponseLabel(preflopReturnSpot.response).toLowerCase()}.`,
      });
      renderScenario();
      return;
    }

    completeQuestion(question, scenario, spot, {
      isCorrect,
      isMixed,
      mixInfo,
    });
    return;
  }

  const raiseSpot = createVillainRaiseSpot(scenario, spot, question, selectedAction, isCorrect || isMixed);

  if (raiseSpot) {
    question.raiseSpot = raiseSpot;
    question.villainResponse = raiseSpot.response;
    stageDecisionReview(question, {
      stage: "initial",
      selectedAction,
      correctAction: spot.correctAction,
      isCorrect,
      isMixed,
      mixInfo,
      nextStage: "raise",
      nextPrompt: `${raiseSpot.response.seat} ${formatVillainResponseLabel(raiseSpot.response).toLowerCase()}.`,
    });
    renderScenario();
    return;
  }

  completeQuestion(question, scenario, spot, {
    isCorrect,
    isMixed,
    mixInfo,
  });
}

function answerRaiseDecision(selectedAction) {
  const question = getCurrentQuestion();
  if (!question || !question.awaitingRaiseResponse || question.answered || question.decisionReview) {
    return;
  }

  const scenario = SCENARIOS_BY_ID[question.scenarioId];
  const spot = getScenarioSpot(scenario, question);
  const raiseSpot = question.raiseSpot;
  const responseCorrect = selectedAction === raiseSpot.correctAction;
  const responseMixed = !responseCorrect && raiseSpot.mixedActions?.includes(selectedAction);
  const initialAccepted = question.initialIsCorrect || question.initialIsMixed;

  question.raiseResponse = selectedAction;
  question.raiseResponseCorrect = responseCorrect;
  question.raiseResponseMixed = responseMixed;
  question.awaitingRaiseResponse = false;

  const villainReturnResponse = createPreflopVillainReturnResponse(scenario, spot, question, raiseSpot, selectedAction);
  if (villainReturnResponse) {
    question.villainReturnResponse = villainReturnResponse;

    if (villainReturnResponse.isRaise) {
      question.finalRaiseSpot = createPreflopFinalRaiseSpot(scenario, question, raiseSpot, villainReturnResponse);
      stageDecisionReview(question, {
        stage: "raise",
        selectedAction,
        correctAction: raiseSpot.correctAction,
        isCorrect: responseCorrect,
        isMixed: responseMixed,
        mixInfo: responseMixed
          ? {
              message: `${raiseSpot.correctAction} is preferred after the raise, but ${selectedAction} is a viable mixed response.`,
            }
          : null,
        nextStage: "final",
        nextPrompt: `${villainReturnResponse.seat} ${formatVillainResponseLabel(villainReturnResponse).toLowerCase()}.`,
      });
      renderScenario();
      return;
    }
  }

  completeQuestion(question, scenario, spot, {
    isCorrect: question.initialIsCorrect && responseCorrect,
    isMixed: (question.initialIsMixed && responseCorrect) || (initialAccepted && responseMixed),
    mixInfo: initialAccepted && responseMixed
      ? {
          message: `${raiseSpot.correctAction} is preferred after the raise, but ${selectedAction} is a viable mixed response.`,
        }
      : question.initialMixInfo,
  });
}

function answerFinalRaiseDecision(selectedAction) {
  const question = getCurrentQuestion();
  if (!question || !question.awaitingFinalRaiseResponse || question.answered || question.decisionReview) {
    return;
  }

  const scenario = SCENARIOS_BY_ID[question.scenarioId];
  const spot = getScenarioSpot(scenario, question);
  const finalRaiseSpot = question.finalRaiseSpot;
  const finalCorrect = selectedAction === finalRaiseSpot.correctAction;
  const finalMixed = !finalCorrect && finalRaiseSpot.mixedActions?.includes(selectedAction);
  const priorAccepted = (question.initialIsCorrect || question.initialIsMixed) &&
    (question.raiseResponseCorrect || question.raiseResponseMixed);
  const finalAccepted = finalCorrect || finalMixed;
  const isCorrect = question.initialIsCorrect && question.raiseResponseCorrect && finalCorrect;

  question.finalRaiseResponse = selectedAction;
  question.finalRaiseResponseCorrect = finalCorrect;
  question.finalRaiseResponseMixed = finalMixed;
  question.awaitingFinalRaiseResponse = false;

  completeQuestion(question, scenario, spot, {
    isCorrect,
    isMixed: !isCorrect && priorAccepted && finalAccepted,
    mixInfo: priorAccepted && finalMixed
      ? {
          message: `${finalRaiseSpot.correctAction} is preferred versus the 5-bet, but ${selectedAction} can mix at low frequency.`,
        }
      : question.initialMixInfo,
  });
}

function stageDecisionReview(question, review) {
  question.decisionReview = {
    stage: review.stage,
    selectedAction: review.selectedAction,
    correctAction: review.correctAction,
    isCorrect: Boolean(review.isCorrect),
    isMixed: Boolean(review.isMixed),
    mixInfo: review.mixInfo || null,
    nextStage: review.nextStage,
    nextPrompt: review.nextPrompt || "",
  };
}

function continueStagedDecision(question) {
  const review = question?.decisionReview;
  if (!review) {
    return false;
  }

  question.decisionReview = null;

  if (review.nextStage === "raise") {
    question.awaitingRaiseResponse = true;
    renderScenario();
    return true;
  }

  if (review.nextStage === "final") {
    question.awaitingFinalRaiseResponse = true;
    renderScenario();
    return true;
  }

  renderScenario();
  return true;
}

function completeQuestion(question, scenario, spot, result) {
  const isCorrect = Boolean(result.isCorrect);
  const isMixed = Boolean(result.isMixed);
  const mixInfo = result.mixInfo || null;

  question.answered = true;
  question.isCorrect = isCorrect;
  question.isMixed = isMixed;
  question.mixInfo = mixInfo;
  question.answerMs = Math.max(0, Date.now() - (question.startedAt || Date.now()));
  question.preHeroActions = spot.preHeroActions || [];
  question.liveOpponentSeats = spot.liveOpponentSeats || [];
  ensurePreflopResponseState(scenario, spot, question);
  question.villainResponse ||= createVillainResponse(scenario, spot, question);
  question.showdownResult = createShowdownResult(scenario, spot, question);
  syncVillainResponseWithShowdownResult(question);
  activeSession.pendingAdvance = true;

  if (isCorrect) {
    activeSession.correctCount += 1;
    activeSession.xpEarned += activeSession.mode === "main" ? getQuestionXp(scenario, question) : Math.round(scenario.xp * 0.35);
  } else if (isMixed) {
    activeSession.xpEarned += activeSession.mode === "main" ? Math.max(1, Math.round(getQuestionXp(scenario, question) * 0.55)) : Math.round(scenario.xp * 0.2);
    window.setTimeout(() => {
      showToast("Solver mix", mixInfo.message, 1200, "mixed");
    }, 80);
  } else {
    activeSession.strikes += 1;
    pushUnique(activeSession.missedIds, scenario.id);
    activeSession.missedQuestions.push(createQuestionRef(question));
    if (activeSession.mode === "review") {
      pushUniqueQuestionRef(activeSession.reviewCarryForward, createQuestionRef(question));
    }
  }

  renderScenario();
}

function answerPreflopRangeQuestion(actionId) {
  const engine = window.FishKillerPreflopEngine;
  const question = getCurrentQuestion();
  const spot = getPreflopRangeSpot(question?.spotId);

  if (!engine || !question || !spot || question.answered) {
    return;
  }

  const grade = engine.gradePreflopAnswer({
    spot,
    handClass: question.handClass,
    actionId,
  });

  question.selected = actionId;
  question.grade = grade;
  question.answered = true;
  question.isCorrect = grade.kind === "correct";
  question.isMixed = grade.kind === "mixed";
  question.answerMs = Math.max(0, Date.now() - (question.startedAt || Date.now()));
  activeSession.pendingAdvance = true;
  recordPreflopRangeAttempt(question, grade);

  if (question.isCorrect) {
    activeSession.correctCount += 1;
    activeSession.xpEarned += PREFLOP_RANGE_QUESTION_XP;
  } else if (question.isMixed) {
    activeSession.xpEarned += Math.round(PREFLOP_RANGE_QUESTION_XP * 0.55);
    window.setTimeout(() => {
      showToast("Mixed action", grade.feedback, 1200, "mixed");
    }, 80);
  } else {
    activeSession.strikes += 1;
    pushUnique(activeSession.missedIds, `${question.spotId}:${question.handClass}`);
    activeSession.missedQuestions.push(createPreflopRangeQuestionRef(question));
    if (activeSession.mode === "review") {
      activeSession.reviewCarryForward.push(createPreflopRangeQuestionRef(question));
    }
  }

  renderPreflopRangeAnsweredState(question);
}

function recordPreflopRangeAttempt(question, grade) {
  if (!PREFLOP_PROGRESS) {
    return;
  }

  state.preflop6maxProgress = PREFLOP_PROGRESS.recordPreflop6maxAttempt(state.preflop6maxProgress, {
    spotId: question.spotId,
    handClass: question.handClass,
    chosenActionId: grade.chosenActionId,
    preferredActionId: grade.preferredActionId,
    chosenFrequency: grade.chosenFrequency,
    preferredFrequency: grade.preferredFrequency,
    resultKind: grade.kind,
  });
  saveState();
}

function advanceSession() {
  if (!activeSession) {
    return;
  }

  const question = getCurrentQuestion();
  if (!activeSession.pendingAdvance) {
    if (question?.decisionReview && continueStagedDecision(question)) {
      return;
    }
    if (activeSession.trainingEngine === TRAINING_ENGINE_IDS.preflopRange && question?.answered) {
      activeSession.pendingAdvance = true;
    } else {
      return;
    }
  }

  if (activeSession.trainingEngine === TRAINING_ENGINE_IDS.preflopRange && !question?.answered) {
    return;
  }

  const lastQuestion = activeSession.currentIndex >= activeSession.questionStates.length - 1;
  const failedMain = activeSession.mode === "main" && activeSession.strikes >= 3;

  if (failedMain || lastQuestion) {
    finishSession(failedMain ? "failed" : "completed");
    return;
  }

  const currentQuestion = getCurrentQuestion();
  activeSession.currentIndex += 1;
  if (currentQuestion?.showdownResult?.type === "fold") {
    skipRemainingStreetsForFoldedHand(currentQuestion);
  }

  if (activeSession.currentIndex >= activeSession.questionStates.length) {
    finishSession("completed");
    return;
  }

  if (activeSession.trainingEngine === TRAINING_ENGINE_IDS.preflopRange && activeSession.mode === "main") {
    activeSession.questionStates[activeSession.currentIndex] = createPreflopRangeQuestionState({
      drillId: activeSession.drillId || getSelectedPreflopRangeDrillId(),
    });
    activeSession.spotId = activeSession.questionStates[activeSession.currentIndex]?.spotId || activeSession.spotId;
  }

  activeSession.pendingAdvance = false;
  render();
}

function openEndSessionModal() {
  if (!activeSession || !elements.endSessionModal) {
    return;
  }

  elements.endSessionModal.classList.remove("hidden");
  elements.cancelEndSessionButton?.focus();
}

function closeEndSessionModal() {
  elements.endSessionModal?.classList.add("hidden");
}

function endActiveSessionPrematurely() {
  if (!activeSession) {
    closeEndSessionModal();
    return;
  }

  const lostXp = activeSession.xpEarned || 0;
  activeSession = null;
  latestSummary = null;
  clearTableActionAnimations();
  closeGtoModal();
  closeSummaryModal();
  closeEndSessionModal();
  exitLessonMode();
  render();
  showToast(
    "Session ended",
    lostXp > 0
      ? `${formatNumber(lostXp)} session XP discarded. No heart was lost.`
      : "No XP was awarded. No heart was lost."
  );
}

function skipRemainingStreetsForFoldedHand(foldedQuestion) {
  while (activeSession.currentIndex < activeSession.questionStates.length) {
    const nextQuestion = activeSession.questionStates[activeSession.currentIndex];
    if (
      nextQuestion.scenarioId !== foldedQuestion.scenarioId ||
      nextQuestion.runoutSeed !== foldedQuestion.runoutSeed ||
      nextQuestion.street === "preflop"
    ) {
      break;
    }

    activeSession.currentIndex += 1;
  }
}

function finishSession(outcome) {
  if (!activeSession) {
    return;
  }

  syncHearts(state);
  const answeredCount = activeSession.questionStates.filter((question) => question.answered).length;
  const accuracy = answeredCount ? Math.round((activeSession.correctCount / answeredCount) * 100) : 0;
  const answeredQuestions = activeSession.questionStates.filter((question) => question.answered);
  const averageAnswerMs = answeredQuestions.length
    ? Math.round(answeredQuestions.reduce((total, question) => total + (question.answerMs || 0), 0) / answeredQuestions.length)
    : 0;
  let baseXp = activeSession.xpEarned;

  if (activeSession.mode === "main" && outcome === "completed") {
    baseXp += 25;
  }

  if (activeSession.mode === "main" && activeSession.correctCount >= 8 && activeSession.strikes <= 1) {
    baseXp += 15;
  }

  if (activeSession.mode === "review" && activeSession.reviewCarryForward.length === 0) {
    baseXp += 10;
  }

  const isPreflopRangeSession = activeSession.trainingEngine === TRAINING_ENGINE_IDS.preflopRange;
  const boostUsed = activeSession.mode === "main" && state.xpBoostSessions > 0;
  const finalXp = boostUsed ? Math.round(baseXp * 1.25) : baseXp;

  if (boostUsed) {
    state.xpBoostSessions -= 1;
  }

  awardXp(activeSession.tableSize, finalXp);

  if (activeSession.mode === "main") {
    state.daily.mainSessionsCompleted += 1;
    state.daily.xpEarned += finalXp;
    state.daily.tableSizesPlayed[activeSession.tableSize] = true;

    if (outcome === "failed") {
      consumeHeart(state);
    }
  } else {
    state.daily.xpEarned += finalXp;
  }

  const summary = {
    mode: activeSession.mode,
    outcome,
    reviewType: isPreflopRangeSession ? TRAINING_ENGINE_IDS.preflopRange : "",
    tableSize: activeSession.tableSize,
    tableLabel: TABLES[activeSession.tableSize].label,
    xp: finalXp,
    accuracy,
    misses: activeSession.missedQuestions.length,
    grade: getGrade(outcome, accuracy),
    averageAnswerMs,
    questionReview: buildQuestionReview(activeSession),
    reviewQueue: isPreflopRangeSession
      ? createPreflopRangeReviewQueue(activeSession)
      : activeSession.mode === "main"
      ? [...activeSession.missedQuestions]
      : [...activeSession.reviewCarryForward],
    note: buildSummaryNote(activeSession, outcome, boostUsed),
  };

  state.lastResult = {
    grade: summary.grade,
    xp: summary.xp,
    accuracy: summary.accuracy,
    tableLabel: summary.tableLabel,
    misses: summary.misses,
    note: summary.note,
  };

  latestSummary = summary;
  resolveQuestRewards(summary.tableSize);
  saveState();
  activeSession = null;
  closeGtoModal();
  exitLessonMode();
  render();

  if (outcome === "failed" && summary.mode === "main") {
    showToast("Session ended", `Three mistakes. You lost 1 heart and now have ${state.hearts} / ${MAX_HEARTS}.`);
  }

  openSummaryModal(summary);
}

function enterLessonMode() {
  closeProfileMenu();
  document.body.classList.add("lesson-active");

  // TODO(mobile): fullscreen is a desktop-first assumption; mobile shells should use viewport-safe layout instead.
  if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {
      showToast("Fullscreen blocked", "Use F11 or your browser fullscreen control if it does not switch automatically.");
    });
  }
}

function exitLessonMode() {
  document.body.classList.remove("lesson-active");
  document.body.classList.remove("preflop-range-active");

  if (document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  }
}

function consumeHeart(targetState) {
  if (targetState.hearts >= MAX_HEARTS) {
    targetState.heartRefillStartedAt = Date.now();
  }
  targetState.hearts = Math.max(0, targetState.hearts - 1);
}

function awardXp(tableSize, amount) {
  if (amount <= 0) {
    return;
  }

  const previousBestReward = getBestUnlockedCardStyle(state.totalXp);
  state.xpByTable[tableSize] += amount;
  state.totalXp += amount;
  const nextBestReward = getBestUnlockedCardStyle(state.totalXp);

  if (nextBestReward.id !== previousBestReward.id) {
    state.cardStyle = nextBestReward.id;
    showToast("Card style unlocked", `${nextBestReward.name}: ${nextBestReward.description}`);
  }
}

function resolveQuestRewards(contextTableSize) {
  QUESTS.forEach((quest) => {
    const progress = quest.getProgress(state.daily);
    if (progress < quest.target || state.daily.claimedQuestIds.includes(quest.id)) {
      return;
    }

    state.daily.claimedQuestIds.push(quest.id);

    if (quest.reward.type === "heart") {
      syncHearts(state);
      state.hearts = Math.min(MAX_HEARTS, state.hearts + quest.reward.amount);
      if (state.hearts >= MAX_HEARTS) {
        state.heartRefillStartedAt = Date.now();
      }
    }

    if (quest.reward.type === "boost") {
      state.xpBoostSessions += quest.reward.amount;
    }

    if (quest.reward.type === "xp") {
      awardXp(contextTableSize || state.selectedTableSize, quest.reward.amount);
      state.daily.xpEarned += quest.reward.amount;
    }

    showToast(`Quest complete: ${quest.title}`, `${quest.description} Reward: ${quest.reward.label}.`);
  });
}

function getGrade(outcome, accuracy) {
  if (outcome === "failed") {
    return "Heartbreak";
  }
  if (accuracy >= 95) {
    return "S";
  }
  if (accuracy >= 85) {
    return "A";
  }
  if (accuracy >= 70) {
    return "B";
  }
  return "C";
}

function buildSummaryNote(session, outcome, boostUsed) {
  const boostNote = boostUsed ? " Your quest boost fired for this run." : "";

  if (session.mode === "review") {
    if (session.reviewCarryForward.length === 0) {
      return `Review round cleared every missed spot.${boostNote}`;
    }
    return `Review round still has ${session.reviewCarryForward.length} unresolved decision${session.reviewCarryForward.length === 1 ? "" : "s"} to revisit.${boostNote}`;
  }

  if (outcome === "failed") {
    return `Main session ended after three mistakes and cost one heart.${boostNote}`;
  }

  if (session.trainingEngine === TRAINING_ENGINE_IDS.preflopRange) {
    const drillLabel = getPreflopRangeDrill(session.drillId)?.label || "6-max preflop range";
    return `${drillLabel} drill finished with ${session.missedQuestions.length} missed decision${session.missedQuestions.length === 1 ? "" : "s"}.${boostNote}`;
  }

  return `Main session finished with ${session.missedQuestions.length} missed decision${session.missedQuestions.length === 1 ? "" : "s"} saved for review.${boostNote}`;
}

function buildQuestionReview(session) {
  if (session.trainingEngine === TRAINING_ENGINE_IDS.preflopRange) {
    return buildPreflopRangeQuestionReview(session);
  }

  return session.questionStates
    .filter((question) => question.answered)
    .map((question, index) => {
      const scenario = SCENARIOS_BY_ID[question.scenarioId];
      const spot = getScenarioSpot(scenario, question);
      const selectedActions = [question.selected, question.raiseResponse, question.finalRaiseResponse].filter(Boolean).join(" / ");
      const correctActions = [
        spot.correctAction,
        question.raiseSpot?.correctAction,
        question.finalRaiseSpot?.correctAction,
      ].filter(Boolean).join(" / ");
      return {
        index: index + 1,
        street: getStreetLabel(question.street),
        hand: scenario.heroHand,
        selected: selectedActions,
        correctAction: correctActions,
        isCorrect: question.isCorrect,
        isMixed: question.isMixed,
        mixInfo: question.mixInfo,
        answerMs: question.answerMs || 0,
      };
    });
}

function buildPreflopRangeQuestionReview(session) {
  return session.questionStates
    .filter((question) => question.answered)
    .map((question, index) => {
      const grade = question.grade || {};
      return {
        index: index + 1,
        street: "Preflop",
        hand: question.handClass,
        selected: getPreflopActionLabel(question.legalActions, question.selected),
        correctAction: getPreflopActionLabel(question.legalActions, grade.preferredActionId),
        isCorrect: question.isCorrect,
        isMixed: question.isMixed,
        mixInfo: question.isMixed ? { message: grade.feedback } : null,
        answerMs: question.answerMs || 0,
      };
    });
}

function createPreflopRangeReviewQueue(session) {
  if (session.mode === "review") {
    return [...session.reviewCarryForward];
  }

  return (state.preflop6maxProgress?.mistakes || []).map((mistake) => ({
    engine: TRAINING_ENGINE_IDS.preflopRange,
    spotId: mistake.spotId,
    handClass: mistake.handClass,
    street: "preflop",
  }));
}

function render() {
  renderTopline();
  renderTableSizes();
  renderPracticeModes();
  renderQuests();
  renderRewards();
  renderScenario();
  renderLastResult();
}

function renderTopline() {
  syncHearts(state);
  saveState();
  applyVisualSkin();
  document.body.classList.toggle("menu-mode", !activeSession);
  document.body.classList.toggle("session-mode", Boolean(activeSession));
  document.body.classList.toggle("preflop-range-active", activeSession?.trainingEngine === TRAINING_ENGINE_IDS.preflopRange);
  elements.sessionExitButton?.classList.toggle("hidden", !activeSession);

  const selectedTable = TABLES[state.selectedTableSize];
  const activeTable = activeSession ? TABLES[activeSession.tableSize] : selectedTable;
  const totalLevel = getLevelFromXp(state.totalXp);
  const totalProgress = getLevelProgressPercent(state.totalXp);
  elements.totalXpDisplay.textContent = formatNumber(state.totalXp);
  elements.selectedXpDisplay.textContent = formatNumber(state.xpByTable[state.selectedTableSize] || 0);
  elements.selectedXpLabel.textContent = `${selectedTable.label} mastery XP`;
  elements.profileLevelDisplay.textContent = String(totalLevel);
  elements.profileXpText.textContent = `${formatNumber(state.totalXp)} XP`;
  elements.profileXpFill.style.width = `${totalProgress}%`;
  elements.profileHeartMeter.innerHTML = renderHeartIcons(state.hearts);
  elements.profileHeartMeter.setAttribute("aria-label", `${state.hearts} of ${MAX_HEARTS} hearts`);
  elements.heartsDisplay.textContent = `${state.hearts} / ${MAX_HEARTS}`;
  elements.heartsTimer.textContent = state.hearts >= MAX_HEARTS ? "Full stack ready" : `Next heart in ${formatDuration(timeUntilNextHeart(state))}`;
  elements.boostDisplay.textContent = String(state.xpBoostSessions);
  elements.boostSubtitle.textContent = state.xpBoostSessions > 0 ? "Next main session gets +25%" : "Earned from quests";

  if (activeSession) {
    const modeLabel = PRACTICE_MODES[activeSession.practiceMode]?.label || PRACTICE_MODES.preflop.label;
    elements.heroTitle.textContent = activeSession.mode === "main" ? `${activeTable.label} ${modeLabel.toLowerCase()} in motion.` : `${activeTable.label} review round is live.`;
    elements.heroSubtitle.textContent =
      activeSession.mode === "main"
        ? "Pick the range-pack baseline, absorb instant corrections, and protect your last two strikes."
        : "These are the spots you missed. Clean them up without spending hearts.";
  } else {
    elements.heroTitle.textContent = selectedTable.id === "six"
      ? "6-Max preflop trainer ready."
      : `${selectedTable.label} starter drills ready.`;
    elements.heroSubtitle.textContent = getTableIntroCopy(selectedTable.id);
  }

  elements.startSessionButton.textContent = `Start ${PRACTICE_MODES[getPracticeMode(selectedTable.id)].label}`;
  elements.startSessionButton.disabled = state.hearts <= 0 && !activeSession;
  renderVisualSkinToggle();
}

function normalizeVisualSkinId(skinId) {
  return VISUAL_SKINS.some((skin) => skin.id === skinId) ? skinId : DEFAULT_VISUAL_SKIN;
}

function applyVisualSkin() {
  document.body.dataset.visualSkin = normalizeVisualSkinId(state.visualSkin);
}

function renderVisualSkinToggle() {
  elements.visualSkinToggle?.querySelectorAll("[data-skin]").forEach((button) => {
    const isActive = button.dataset.skin === normalizeVisualSkinId(state.visualSkin);
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function selectVisualSkin(skinId) {
  const normalized = normalizeVisualSkinId(skinId);
  if (state.visualSkin === normalized) {
    return;
  }

  state.visualSkin = normalized;
  saveState();
  applyVisualSkin();
  renderVisualSkinToggle();
  showToast("Visual skin equipped", VISUAL_SKINS.find((skin) => skin.id === normalized)?.label || "FishKiller");
}

function getPreflopCoverageLabel() {
  return "All spots";
}

function getTableIntroCopy(tableSize) {
  if (tableSize === "six") {
    return `Flagship 6-max 100bb cash preflop trainer: ${getPreflopCoverageLabel()}. Internal baseline ranges, not universal GTO.`;
  }

  const table = TABLES[tableSize] || TABLES.six;
  return `${table.subtitle} The full range-pack trainer is currently focused on 6-max preflop.`;
}

function getTableTrainingLabel(tableSize) {
  return tableSize === "six" ? "56-spot preflop range" : "Starter scenario drills";
}

function getTablePillLabel(tableSize) {
  return tableSize === "six" ? "Live range pack" : "Legacy drills";
}

function getPracticeModeDescription(mode, tableSize) {
  if (mode.id !== "preflop") {
    return mode.description;
  }

  return tableSize === "six"
    ? `Flagship 56-spot 6-max 100bb cash preflop range trainer: ${getPreflopCoverageLabel()}.`
    : "Starter scenario-pack preflop drills for quick reps; the full range-pack trainer is currently 6-max.";
}

function renderHeartIcons(count) {
  return Array.from({ length: MAX_HEARTS }, (_, index) => {
    const stateClass = index < count ? "filled" : "empty";
    return `<span class="profile-heart ${stateClass}" aria-hidden="true"></span>`;
  }).join("");
}

function renderTableSizes() {
  elements.tableSizeList.innerHTML = "";

  Object.values(TABLES).forEach((table) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `table-size-card${state.selectedTableSize === table.id ? " active" : ""}`;
    const xp = state.xpByTable[table.id] || 0;
    const level = getLevelFromXp(xp);
    const progress = getLevelProgressPercent(xp);

    card.innerHTML = `
      <div class="table-card-top">
        <div>
          <h3>${table.label}</h3>
          <p>${table.subtitle}</p>
        </div>
        <span class="table-tag">${table.shortLabel}</span>
      </div>
      <div class="table-card-bottom">
        <div>
          <strong>${formatNumber(xp)} XP</strong>
          <p>Level ${level} - ${getTableTrainingLabel(table.id)}</p>
        </div>
        <div class="table-pill">${getTablePillLabel(table.id)}</div>
      </div>
      <div class="progress-mini">
        <div class="progress-mini-fill" style="width: ${progress}%;"></div>
      </div>
    `;

    card.addEventListener("click", () => {
      state.selectedTableSize = table.id;
      saveState();
      render();
    });

    elements.tableSizeList.appendChild(card);
  });
}

function renderPracticeModes() {
  const selectedTable = TABLES[state.selectedTableSize];
  elements.modeTableLabel.textContent = selectedTable.label;
  elements.modeList.innerHTML = "";

  Object.values(PRACTICE_MODES).forEach((mode) => {
    const disabled = !isPracticeModeAvailable(mode.id);
    const button = document.createElement("button");
    button.type = "button";
    button.disabled = disabled;
    button.className = [
      "mode-card",
      getPracticeMode(selectedTable.id) === mode.id ? "active" : "",
      disabled ? "disabled" : "",
    ].filter(Boolean).join(" ");
    button.innerHTML = `
      <strong>${mode.label}</strong>
      <span>${getPracticeModeDescription(mode, selectedTable.id)}</span>
      ${disabled ? `<em>Postflop solver commented out</em>` : ""}
    `;
    button.addEventListener("click", () => {
      if (disabled) {
        showToast("Mode paused", "Full-hand/postflop practice is parked while we work on the UI.");
        return;
      }
      state.modeByTable[selectedTable.id] = mode.id;
      saveState();
      render();
    });
    elements.modeList.appendChild(button);
  });
}

function renderQuests() {
  ensureDailyState(state);
  elements.questList.innerHTML = "";

  QUESTS.forEach((quest) => {
    const progress = quest.getProgress(state.daily);
    const current = Math.min(progress, quest.target);
    const percent = Math.min(100, Math.round((current / quest.target) * 100));
    const claimed = state.daily.claimedQuestIds.includes(quest.id);
    const card = document.createElement("article");
    card.className = "quest-card";
    card.innerHTML = `
      <div class="quest-top">
        <div>
          <h3>${quest.title}</h3>
          <p>${quest.description}</p>
        </div>
        <span class="quest-reward">${claimed ? "Claimed" : quest.reward.label}</span>
      </div>
      <div class="quest-bottom">
        <span>${current} / ${quest.target}</span>
        <span>${percent}%</span>
      </div>
      <div class="quest-progress-bar">
        <div class="quest-progress-fill" style="width: ${percent}%;"></div>
      </div>
    `;
    elements.questList.appendChild(card);
  });
}

function renderRewards() {
  elements.rewardList.innerHTML = "";

  CARD_STYLES.forEach((reward) => {
    const unlocked = isCardStyleUnlocked(reward.id);
    const selected = state.cardStyle === reward.id;
    const progress = Math.min(100, Math.round((state.totalXp / Math.max(1, reward.xp)) * 100));
    const card = document.createElement("button");
    card.type = "button";
    card.className = `reward-card${unlocked ? " unlocked" : " locked"}${selected ? " active" : ""}`;
    card.disabled = !unlocked;
    card.innerHTML = `
      <div class="reward-preview card-style-${reward.id}">
        <span>A</span>
        <span>&spades;</span>
      </div>
      <div class="reward-copy">
        <strong>${reward.name}</strong>
        <span>${unlocked ? reward.description : `${formatNumber(reward.xp - state.totalXp)} XP to unlock`}</span>
        <div class="reward-progress"><div style="width: ${unlocked ? 100 : progress}%;"></div></div>
      </div>
      <span class="reward-state">${selected ? "Equipped" : unlocked ? "Use" : `${formatNumber(reward.xp)} XP`}</span>
    `;
    card.addEventListener("click", () => {
      if (!unlocked) {
        return;
      }

      state.cardStyle = reward.id;
      saveState();
      renderRewards();
      renderScenario();
      showToast("Card style equipped", reward.name);
    });
    elements.rewardList.appendChild(card);
  });
}

function renderScenario() {
  if (activeSession?.trainingEngine === TRAINING_ENGINE_IDS.preflopRange) {
    renderPreflopRangeScenario();
    return;
  }

  const question = getCurrentQuestion();
  const scenario = getCurrentScenario();
  const spot = getCurrentSpot();

  if (!activeSession || !question || !scenario || !spot) {
    renderIdleScenario();
    return;
  }

  if (!question.answered && !question.startedAt) {
    question.startedAt = Date.now();
  }

  renderScenarioCards(scenario);
  elements.scenarioTable.textContent = `${TABLES[scenario.tableSize].label} - ${scenario.pack}`;
  elements.scenarioDifficulty.textContent = spot.difficulty;
  const bettingSummary = createBettingSummary(scenario);
  renderBettingLine(addStreetContextToBettingLine(bettingSummary, spot, question));
  elements.scenarioTitle.textContent = spot.title;
  elements.scenarioCopy.textContent = spot.copy;
  elements.sessionChip.textContent = activeSession.mode === "main" ? getStreetLabel(question.street) : "Review Round";
  elements.sessionCounter.textContent = `${activeSession.currentIndex + 1} / ${activeSession.questionStates.length}`;
  elements.mistakeCounter.textContent = activeSession.mode === "main" ? `${activeSession.strikes} / 3 mistakes` : `${activeSession.missedQuestions.length} misses logged`;
  elements.sessionAccuracy.textContent = getActiveSessionAccuracyValue();
  elements.progressFill.style.width = `${Math.round(((activeSession.currentIndex + (question.answered ? 1 : 0)) / activeSession.questionStates.length) * 100)}%`;
  elements.scenarioFacts.innerHTML = spot.facts.map((fact) => createFactCard(fact.label, fact.value)).join("");
  setScenarioExplanationVisible(question.answered || Boolean(question.decisionReview));
  syncQuestionOptionOrder(question, spot);

  renderTableVisual(scenario, bettingSummary, spot, question);
  renderAnswers(spot, question);
  renderFeedback(spot, question);
}

function renderPreflopRangeScenario() {
  const question = getCurrentQuestion();
  const spot = getPreflopRangeSpot(question?.spotId);

  if (!activeSession || !question || !spot) {
    renderIdleScenario();
    return;
  }

  if (!question.answered && !question.startedAt) {
    question.startedAt = Date.now();
  }

  const visualScenario = createPreflopRangeVisualScenario(question);
  const bettingSummary = createPreflopRangeBettingSummary(question);
  renderCards(question.handClass, `${activeSession.id}-${activeSession.currentIndex}`);
  elements.scenarioTable.textContent = "6-Max - real preflop range";
  elements.scenarioDifficulty.textContent = "Internal baseline";
  renderBettingLine(bettingSummary);
  elements.scenarioTitle.textContent = formatPreflopRangeSpotTitle(spot);
  elements.scenarioCopy.textContent = createPreflopRangeScenarioCopy(spot, question);
  elements.sessionChip.textContent = activeSession.mode === "review" ? "Range Review" : "Preflop Range";
  elements.sessionCounter.textContent = `${activeSession.currentIndex + 1} / ${activeSession.questionStates.length}`;
  elements.mistakeCounter.textContent = activeSession.mode === "main"
    ? `${activeSession.strikes} / 3`
    : `${activeSession.missedQuestions.length} misses`;
  elements.sessionAccuracy.textContent = getActiveSessionAccuracyValue();
  elements.progressFill.style.width = `${Math.round(((activeSession.currentIndex + (question.answered ? 1 : 0)) / activeSession.questionStates.length) * 100)}%`;
  elements.scenarioFacts.innerHTML = [
    createFactCard("Spot", getPreflopRangeSpotShortLabel(spot)),
    createFactCard("Drill", getPreflopRangeDrill(getActivePreflopRangeDrillId())?.label || "All Preflop"),
    createFactCard("Coverage", getPreflopCoverageLabel()),
    createFactCard("Stack", "100bb"),
    createFactCard(getPreflopRangeSizeFactLabel(spot), getPreflopRangeOpenLabel(spot)),
    createFactCard("Lifetime Reps", state.preflop6maxProgress?.totals?.attempts || 0),
  ].join("");
  renderPreflopRangeProgressSummary();
  setScenarioExplanationVisible(true);
  renderTableVisual(visualScenario, bettingSummary, {
    ...spot,
    street: "preflop",
    heroCards: getHeroCardsForScenario(visualScenario),
    facts: [{ label: "Pot", value: formatMoney(bettingSummary.pot || SMALL_BLIND + BIG_BLIND) }],
  }, question);
  renderPreflopRangeAnswers(question);
  renderPreflopRangeFeedback(question);
}

function getPreflopRangeSessionAccuracyLabel() {
  return `${getActiveSessionAccuracyValue()} accuracy`;
}

function getActiveSessionAccuracyValue() {
  const answered = activeSession?.questionStates?.filter((question) => question.answered).length || 0;
  if (!answered) {
    return "0%";
  }
  return `${Math.round((activeSession.correctCount / answered) * 100)}%`;
}

function renderPreflopRangeProgressSummary() {
  if (!PREFLOP_PROGRESS?.summarizePreflop6maxProgress || !elements.scenarioFacts) {
    return;
  }

  const summary = PREFLOP_PROGRESS.summarizePreflop6maxProgress(state.preflop6maxProgress, {
    minimumSpotAttempts: PREFLOP_RANGE_MIN_WEAK_SPOT_ATTEMPTS,
    recentMistakeLimit: 3,
  });
  elements.scenarioFacts.insertAdjacentHTML("beforeend", createPreflopRangeProgressSummaryMarkup(summary));
}

function createPreflopRangeProgressSummaryMarkup(summary) {
  if (!summary || !summary.totalAttempts) {
    return `
      <div class="preflop-progress-summary empty">
        <span>6-max progress</span>
        <strong>No preflop reps yet</strong>
        <em>Local lifetime stats appear here after a few reps in the supported preflop families.</em>
      </div>
    `;
  }

  const weakestSpot = summary.weakestSpots?.[0];
  const weakestLabel = weakestSpot
    ? `${formatPreflopProgressSpotLabel(weakestSpot.spotId)} (${formatPercent(weakestSpot.mistakeRate)} mistakes)`
    : `Need ${PREFLOP_RANGE_MIN_WEAK_SPOT_ATTEMPTS}+ reps in a spot`;
  const recentMistake = summary.recentMistakes?.[0];
  const recentLabel = recentMistake
    ? `${recentMistake.handClass} in ${formatPreflopProgressSpotLabel(recentMistake.spotId)}`
    : "No recent mistakes";
  const leakLabel = getPreflopProgressLeakLabel(summary.actionPatterns);

  return `
    <div class="preflop-progress-summary">
      <span>Local lifetime reps<strong>${summary.totalAttempts}</strong></span>
      <span>Top-action rate<strong>${formatPercent(summary.accuracy)}</strong></span>
      <span>Good or mixed rate<strong>${formatPercent(summary.playableAccuracy)}</strong></span>
      <span>Weakest local spot<strong>${weakestLabel}</strong></span>
      <span>Recent miss<strong>${recentLabel}</strong></span>
      <span>Pattern<strong>${leakLabel}</strong></span>
    </div>
  `;
}

function getPreflopProgressLeakLabel(patterns = {}) {
  const entries = [
    ["overfold", "Overfolding"],
    ["overcall", "Overcalling"],
    ["overraise", "Over-raising"],
    ["missedAggression", "Passing on aggression"],
    ["missedCalls", "Missing calls"],
    ["illegal", "Unsupported clicks"],
  ].filter(([key]) => patterns[key] > 0);

  if (!entries.length) {
    return "Clean so far";
  }

  const [key, label] = entries.sort((left, right) => patterns[right[0]] - patterns[left[0]])[0];
  return `${label} (${patterns[key]})`;
}

function formatPreflopProgressSpotLabel(spotId = "") {
  if (spotId === "fk_6max_100bb_sb_first_in_limp_or_raise_v1") {
    return "SB first in: limp or raise";
  }
  if (spotId === "fk_6max_100bb_bb_vs_sb_limp_v1") {
    return "BB vs SB limp";
  }
  if (spotId === "fk_6max_100bb_sb_limp_vs_bb_raise_v1") {
    return "SB limp vs BB raise";
  }

  const facingFourBetMatch = String(spotId).match(/100bb_(lj|hj|co|btn|sb|bb)_3bet_vs_(lj|hj|co|btn|sb)_open_(lj|hj|co|btn|sb)_4bet/i);
  if (facingFourBetMatch) {
    return `${facingFourBetMatch[1].toUpperCase()} 3-bet vs ${facingFourBetMatch[2].toUpperCase()} open, ${facingFourBetMatch[3].toUpperCase()} 4-bet`;
  }

  const facingThreeBetMatch = String(spotId).match(/100bb_(lj|hj|co|btn|sb)_open_vs_(lj|hj|co|btn|sb|bb)_3bet/i);
  if (facingThreeBetMatch) {
    return `${facingThreeBetMatch[1].toUpperCase()} open vs ${facingThreeBetMatch[2].toUpperCase()} 3-bet`;
  }

  const bbMatch = String(spotId).match(/bb_vs_(lj|hj|co|btn|sb)_open/i);
  if (bbMatch) {
    return `BB vs ${bbMatch[1].toUpperCase()} open`;
  }

  const rfiMatch = String(spotId).match(/100bb_(lj|hj|co|btn|sb)_rfi/i);
  if (rfiMatch) {
    return `${rfiMatch[1].toUpperCase()} first in`;
  }

  return spotId || "Unknown spot";
}

function createPreflopRangeVisualScenario(question) {
  const spot = getPreflopRangeSpot(question?.spotId);
  const parsed = parseHand(question.handClass, `${activeSession?.id || "preflop-range"}-${activeSession?.currentIndex || 0}`);
  const heroSeat = getPreflopRangeTableSeat(spot?.heroPosition || "BTN");
  return {
    id: `preflop-range-${question.handClass}`,
    tableSize: "six",
    heroSeat,
    heroHand: question.handClass,
    heroCards: [
      { rank: parsed.left, suit: parsed.leftSuit },
      { rank: parsed.right, suit: parsed.rightSuit },
    ],
    actors: createPreflopRangeActors(spot),
  };
}

function createPreflopRangeBettingSummary(question) {
  const spot = getPreflopRangeSpot(question?.spotId);
  if (isPreflopRangePriorActionDecisionSpot(spot)) {
    return createPreflopRangeBvbLimpBettingSummary(spot, question);
  }

  if (isPreflopRangeFacingFourBetSpot(spot)) {
    return createPreflopRangeFacingFourBetBettingSummary(spot, question);
  }

  if (isPreflopRangeFacingThreeBetSpot(spot)) {
    return createPreflopRangeFacingThreeBetBettingSummary(spot, question);
  }

  if (isPreflopRangeFacingOpenSpot(spot)) {
    return createPreflopRangeFacingOpenBettingSummary(spot, question);
  }

  const actionBySeat = createPreflopRangeActionBySeat(spot, question);
  const foldedPositions = getPreflopRangePriorPositions(spot?.heroPosition || "BTN");
  const foldedText = foldedPositions.length
    ? `${foldedPositions.join(", ")} fold`
    : "Action starts first in";

  return {
    pot: SMALL_BLIND + BIG_BLIND,
    items: [
      `Blinds ${formatMoney(SMALL_BLIND)} / ${formatMoney(BIG_BLIND)}`,
      foldedText,
      `${spot?.heroPosition || "BTN"} first in`,
      `Pot ${formatMoney(SMALL_BLIND + BIG_BLIND)}`,
    ],
    actionBySeat,
  };
}

function createPreflopRangeResponses(spot) {
  if (isPreflopRangePriorActionDecisionSpot(spot)) {
    return createPreflopRangeBvbLimpResponses(spot);
  }

  if (isPreflopRangeFacingFourBetSpot(spot)) {
    return createPreflopRangeFacingFourBetResponses(spot);
  }

  if (isPreflopRangeFacingThreeBetSpot(spot)) {
    return createPreflopRangeFacingThreeBetResponses(spot);
  }

  if (isPreflopRangeFacingOpenSpot(spot)) {
    return createPreflopRangeFacingOpenResponses(spot);
  }

  return getPreflopRangePriorPositions(spot?.heroPosition || "BTN").map((position) => ({
    seat: getPreflopRangeTableSeat(position),
    action: "Folds",
    folded: true,
  }));
}

function createPreflopRangeActors(spot) {
  if (isPreflopRangePriorActionDecisionSpot(spot)) {
    return createPreflopRangeBvbLimpActors(spot);
  }

  if (isPreflopRangeFacingFourBetSpot(spot)) {
    return createPreflopRangeFacingFourBetActors(spot);
  }

  if (isPreflopRangeFacingThreeBetSpot(spot)) {
    return createPreflopRangeFacingThreeBetActors(spot);
  }

  if (isPreflopRangeFacingOpenSpot(spot)) {
    return createPreflopRangeFacingOpenActors(spot);
  }

  const heroPosition = spot?.heroPosition || "BTN";
  return [
    ...getPreflopRangePriorPositions(heroPosition).map((position) => ({
      seat: getPreflopRangeTableSeat(position),
      label: "Folded",
    })),
    { seat: getPreflopRangeTableSeat(heroPosition), label: "Hero" },
  ];
}

function createPreflopRangeActionBySeat(spot, question) {
  if (isPreflopRangePriorActionDecisionSpot(spot)) {
    return createPreflopRangeBvbLimpActionBySeat(spot, question);
  }

  if (isPreflopRangeFacingFourBetSpot(spot)) {
    return createPreflopRangeFacingFourBetActionBySeat(spot, question);
  }

  if (isPreflopRangeFacingThreeBetSpot(spot)) {
    return createPreflopRangeFacingThreeBetActionBySeat(spot, question);
  }

  if (isPreflopRangeFacingOpenSpot(spot)) {
    return createPreflopRangeFacingOpenActionBySeat(spot, question);
  }

  const heroPosition = spot?.heroPosition || "BTN";
  const heroSeat = getPreflopRangeTableSeat(heroPosition);
  const actionBySeat = {};
  getPreflopRangePriorPositions(heroPosition).forEach((position) => {
    actionBySeat[getPreflopRangeTableSeat(position)] = "Folded";
  });
  actionBySeat[heroSeat] = question.answered ? getPreflopActionLabel(question.legalActions, question.selected) : "Hero to act";

  if (heroSeat !== "SB") {
    actionBySeat.SB = "Waiting";
  }
  if (heroSeat !== "BB") {
    actionBySeat.BB = "Waiting";
  }

  return actionBySeat;
}

function getPreflopRangePriorPositions(heroPosition) {
  const order = ["LJ", "HJ", "CO", "BTN", "SB"];
  const index = order.indexOf(heroPosition);
  return index > 0 ? order.slice(0, index) : [];
}

function getPreflopRangeTableSeat(position) {
  return position === "LJ" ? "UTG" : position;
}

function formatPreflopRangeSpotTitle(spot) {
  return `6-max ${spot?.stackDepthBb || 100}bb - ${formatPreflopSpotLabel(spot)}`;
}

function createPreflopRangeFacingOpenBettingSummary(spot, question) {
  const actionBySeat = createPreflopRangeFacingOpenActionBySeat(spot, question);
  const opener = spot?.villainPosition || "BTN";
  const heroPosition = spot?.heroPosition || "BB";
  const openLabel = getPreflopRangeOpenLabel(spot);
  const foldedPositions = getPreflopRangeFacingOpenFoldedPositions(opener, heroPosition);
  const foldedText = foldedPositions.length
    ? `${foldedPositions.join(", ")} fold`
    : "Action starts with opener";

  return {
    pot: getPreflopRangeFacingOpenPot(spot),
    items: [
      `Blinds ${formatMoney(SMALL_BLIND)} / ${formatMoney(BIG_BLIND)}`,
      foldedText,
      openLabel,
      `${heroPosition} to respond`,
    ],
    actionBySeat,
  };
}

function createPreflopRangeFacingOpenResponses(spot) {
  const opener = spot?.villainPosition || "BTN";
  const heroPosition = spot?.heroPosition || "BB";
  return [
    ...getPreflopRangePriorPositions(opener).map((position) => ({
      seat: getPreflopRangeTableSeat(position),
      action: "Folds",
      folded: true,
    })),
    { seat: getPreflopRangeTableSeat(opener), action: "Opens", amount: spot?.facingOpen?.sizeBb || null },
    ...getPreflopRangePositionsBetweenOpenerAndHero(opener, heroPosition).map((position) => ({
      seat: getPreflopRangeTableSeat(position),
      action: "Folds",
      folded: true,
    })),
  ];
}

function createPreflopRangeFacingOpenActors(spot) {
  const opener = spot?.villainPosition || "BTN";
  const heroPosition = spot?.heroPosition || "BB";
  return [
    ...getPreflopRangePriorPositions(opener).map((position) => ({
      seat: getPreflopRangeTableSeat(position),
      label: "Folded",
    })),
    { seat: getPreflopRangeTableSeat(opener), label: "Opener" },
    ...getPreflopRangePositionsBetweenOpenerAndHero(opener, heroPosition).map((position) => ({
      seat: getPreflopRangeTableSeat(position),
      label: "Folded",
    })),
    { seat: getPreflopRangeTableSeat(heroPosition), label: "Hero" },
    ...getPreflopRangePositionsAfterHero(heroPosition).map((position) => ({
      seat: getPreflopRangeTableSeat(position),
      label: "Waiting",
    })),
  ];
}

function createPreflopRangeFacingOpenActionBySeat(spot, question) {
  const opener = spot?.villainPosition || "BTN";
  const heroPosition = spot?.heroPosition || "BB";
  const heroSeat = getPreflopRangeTableSeat(heroPosition);
  const actionBySeat = {};
  getPreflopRangePriorPositions(opener).forEach((position) => {
    actionBySeat[getPreflopRangeTableSeat(position)] = "Folded";
  });
  actionBySeat[getPreflopRangeTableSeat(opener)] = getPreflopRangeOpenLabel(spot);
  getPreflopRangePositionsBetweenOpenerAndHero(opener, heroPosition).forEach((position) => {
    actionBySeat[getPreflopRangeTableSeat(position)] = "Folded";
  });
  actionBySeat[heroSeat] = question.answered ? getPreflopActionLabel(question.legalActions, question.selected) : "Hero to act";
  getPreflopRangePositionsAfterHero(heroPosition).forEach((position) => {
    actionBySeat[getPreflopRangeTableSeat(position)] = "Waiting";
  });
  return actionBySeat;
}

function createPreflopRangeFacingThreeBetBettingSummary(spot, question) {
  const actionBySeat = createPreflopRangeFacingThreeBetActionBySeat(spot, question);
  const opener = spot?.heroPosition || "BTN";
  const threeBettor = spot?.villainPosition || "BB";
  const openLabel = getPreflopRangeOpenActionLabel(spot);
  const threeBetLabel = getPreflopRangeThreeBetActionLabel(spot);
  const foldedPositions = getPreflopRangeFacingThreeBetFoldedPositions(opener, threeBettor);
  const foldedText = foldedPositions.length
    ? `${foldedPositions.join(", ")} fold`
    : "Action starts with opener";

  return {
    pot: getPreflopRangeFacingThreeBetPot(spot),
    items: [
      `Blinds ${formatMoney(SMALL_BLIND)} / ${formatMoney(BIG_BLIND)}`,
      foldedText,
      openLabel,
      threeBetLabel,
      `${opener} to respond`,
    ],
    actionBySeat,
  };
}

function createPreflopRangeFacingThreeBetResponses(spot) {
  const opener = spot?.heroPosition || "BTN";
  const threeBettor = spot?.villainPosition || "BB";
  return [
    ...getPreflopRangePriorPositions(opener).map((position) => ({
      seat: getPreflopRangeTableSeat(position),
      action: "Folds",
      folded: true,
    })),
    { seat: getPreflopRangeTableSeat(opener), action: "Opens", amount: spot?.facingOpen?.sizeBb || null },
    ...getPreflopRangePositionsBetweenOpenerAndHero(opener, threeBettor).map((position) => ({
      seat: getPreflopRangeTableSeat(position),
      action: "Folds",
      folded: true,
    })),
    { seat: getPreflopRangeTableSeat(threeBettor), action: "3-bets", amount: spot?.facingThreeBet?.sizeBb || null },
    ...getPreflopRangePositionsAfterHero(threeBettor).map((position) => ({
      seat: getPreflopRangeTableSeat(position),
      action: "Folds",
      folded: true,
    })),
  ];
}

function createPreflopRangeFacingThreeBetActors(spot) {
  const opener = spot?.heroPosition || "BTN";
  const threeBettor = spot?.villainPosition || "BB";
  return [
    ...getPreflopRangePriorPositions(opener).map((position) => ({
      seat: getPreflopRangeTableSeat(position),
      label: "Folded",
    })),
    { seat: getPreflopRangeTableSeat(opener), label: "Hero" },
    ...getPreflopRangePositionsBetweenOpenerAndHero(opener, threeBettor).map((position) => ({
      seat: getPreflopRangeTableSeat(position),
      label: "Folded",
    })),
    { seat: getPreflopRangeTableSeat(threeBettor), label: "3-bettor" },
    ...getPreflopRangePositionsAfterHero(threeBettor).map((position) => ({
      seat: getPreflopRangeTableSeat(position),
      label: "Folded",
    })),
  ];
}

function createPreflopRangeFacingThreeBetActionBySeat(spot, question) {
  const opener = spot?.heroPosition || "BTN";
  const threeBettor = spot?.villainPosition || "BB";
  const heroSeat = getPreflopRangeTableSeat(opener);
  const actionBySeat = {};
  getPreflopRangePriorPositions(opener).forEach((position) => {
    actionBySeat[getPreflopRangeTableSeat(position)] = "Folded";
  });
  actionBySeat[heroSeat] = question.answered ? getPreflopActionLabel(question.legalActions, question.selected) : "Hero to act";
  getPreflopRangePositionsBetweenOpenerAndHero(opener, threeBettor).forEach((position) => {
    actionBySeat[getPreflopRangeTableSeat(position)] = "Folded";
  });
  actionBySeat[getPreflopRangeTableSeat(threeBettor)] = getPreflopRangeThreeBetActionLabel(spot);
  getPreflopRangePositionsAfterHero(threeBettor).forEach((position) => {
    actionBySeat[getPreflopRangeTableSeat(position)] = "Folded";
  });
  return actionBySeat;
}

function getPreflopRangeFacingThreeBetFoldedPositions(opener, threeBettor) {
  return [
    ...getPreflopRangePriorPositions(opener),
    ...getPreflopRangePositionsBetweenOpenerAndHero(opener, threeBettor),
    ...getPreflopRangePositionsAfterHero(threeBettor),
  ];
}

function createPreflopRangeBvbLimpBettingSummary(spot, question) {
  const actionBySeat = createPreflopRangeBvbLimpActionBySeat(spot, question);
  const heroPosition = spot?.heroPosition || "SB";
  const foldedPositions = (spot?.priorActions || [])
    .filter((action) => action.actionId === "fold")
    .map((action) => action.position);
  const keyActions = (spot?.priorActions || [])
    .filter((action) => action.actionId !== "fold")
    .map(getPreflopRangePriorActionLabel);
  return {
    pot: getPreflopRangePriorActionPot(spot),
    items: [
      `Blinds ${formatMoney(SMALL_BLIND)} / ${formatMoney(BIG_BLIND)}`,
      foldedPositions.length ? `${foldedPositions.join(", ")} fold` : "Action starts blind vs blind",
      ...(keyActions.length ? keyActions : [formatPreflopSpotLabel(spot)]),
      `${heroPosition} to respond`,
    ],
    actionBySeat,
  };
}

function createPreflopRangeBvbLimpResponses(spot) {
  return (spot?.priorActions || []).map((action) => ({
    seat: getPreflopRangeTableSeat(action.position),
    action: getPreflopRangePriorActionVerb(action),
    amount: action.sizeBb || null,
    folded: action.actionId === "fold",
  }));
}

function createPreflopRangeBvbLimpActors(spot) {
  const actionByPosition = getFinalPreflopActionByPosition(spot);
  const heroPosition = spot?.heroPosition || "SB";
  return ["LJ", "HJ", "CO", "BTN", "SB", "BB"]
    .filter((position) => position === heroPosition || position === "SB" || position === "BB" || actionByPosition[position])
    .map((position) => {
      let label = "Waiting";
      if (position === heroPosition) {
        label = "Hero";
      } else if (actionByPosition[position]?.actionId === "fold") {
        label = "Folded";
      } else if (actionByPosition[position]?.actionId === "limp") {
        label = "Limper";
      } else if (actionByPosition[position]?.actionId === "call") {
        label = "Caller";
      } else if (actionByPosition[position]?.actionId === "raise") {
        label = isPreflopRangeSqueezeSpot(spot) ? "Opener" : "Raiser";
      }
      return { seat: getPreflopRangeTableSeat(position), label };
    });
}

function createPreflopRangeBvbLimpActionBySeat(spot, question) {
  const actionBySeat = {};
  (spot?.priorActions || []).forEach((action) => {
    actionBySeat[getPreflopRangeTableSeat(action.position)] = getPreflopRangePriorActionLabel(action);
  });

  const heroPosition = spot?.heroPosition || "SB";
  actionBySeat[getPreflopRangeTableSeat(heroPosition)] = question.answered
    ? getPreflopActionLabel(question.legalActions, question.selected)
    : "Hero to act";
  if (!actionBySeat.BB && heroPosition !== "BB") {
    actionBySeat.BB = "Waiting";
  }
  return actionBySeat;
}

function createPreflopRangeFacingFourBetBettingSummary(spot, question) {
  const actionBySeat = createPreflopRangeFacingFourBetActionBySeat(spot, question);
  const heroPosition = spot?.heroPosition || spot?.threeBettorPosition || "BTN";
  const foldedPositions = (spot?.priorActions || [])
    .filter((action) => action.actionId === "fold")
    .map((action) => action.position);
  const keyActions = (spot?.priorActions || [])
    .filter((action) => action.actionId !== "fold")
    .map(getPreflopRangePriorActionLabel);
  return {
    pot: getPreflopRangePriorActionPot(spot),
    items: [
      `Blinds ${formatMoney(SMALL_BLIND)} / ${formatMoney(BIG_BLIND)}`,
      foldedPositions.length ? `${foldedPositions.join(", ")} fold` : "No folds before the 4-bet",
      ...keyActions,
      `${heroPosition} to respond`,
    ],
    actionBySeat,
  };
}

function createPreflopRangeFacingFourBetResponses(spot) {
  return (spot?.priorActions || []).map((action) => ({
    seat: getPreflopRangeTableSeat(action.position),
    action: getPreflopRangePriorActionVerb(action),
    amount: action.sizeBb || null,
    folded: action.actionId === "fold",
  }));
}

function createPreflopRangeFacingFourBetActors(spot) {
  const actionByPosition = getFinalPreflopActionByPosition(spot);
  const heroPosition = spot?.heroPosition || spot?.threeBettorPosition || "BTN";
  const fourBettor = spot?.fourBettorPosition || spot?.villainPosition || spot?.openerPosition || "CO";
  return ["LJ", "HJ", "CO", "BTN", "SB", "BB"]
    .filter((position) => position === heroPosition || position === fourBettor || actionByPosition[position])
    .map((position) => {
      let label = "Folded";
      if (position === heroPosition) {
        label = "Hero";
      } else if (position === fourBettor) {
        label = "4-bettor";
      } else if (actionByPosition[position]?.actionId === "threeBet") {
        label = "3-bettor";
      }
      return { seat: getPreflopRangeTableSeat(position), label };
    });
}

function createPreflopRangeFacingFourBetActionBySeat(spot, question) {
  const actionBySeat = {};
  (spot?.priorActions || []).forEach((action) => {
    actionBySeat[getPreflopRangeTableSeat(action.position)] = getPreflopRangePriorActionLabel(action);
  });

  const heroPosition = spot?.heroPosition || spot?.threeBettorPosition || "BTN";
  actionBySeat[getPreflopRangeTableSeat(heroPosition)] = question.answered
    ? getPreflopActionLabel(question.legalActions, question.selected)
    : "Hero to act";
  return actionBySeat;
}

function getPreflopRangePriorActionLabel(action = {}) {
  const amount = action.sizeBb ? ` ${formatBbAmount(action.sizeBb)}bb` : "";
  if (action.actionId === "fold") return "Folded";
  if (action.actionId === "limp") return `${action.position} limps${amount}`;
  if (action.actionId === "call") return `${action.position} calls${amount}`;
  if (action.actionId === "raise" && action.position === "BB") return `${action.position} raises${amount}`;
  if (action.actionId === "raise") return `${action.position} opens${amount}`;
  if (action.actionId === "threeBet") return `${action.position} 3-bets${amount}`;
  if (action.actionId === "fourBet") return `${action.position} 4-bets${amount}`;
  return `${action.position || "Player"} ${formatPreflopActionLabel(action.actionId)}${amount}`.trim();
}

function getPreflopRangePriorActionVerb(action = {}) {
  if (action.actionId === "fold") return "Folds";
  if (action.actionId === "limp") return "Limps";
  if (action.actionId === "call") return "Calls";
  if (action.actionId === "raise" && action.position === "BB") return "Raises";
  if (action.actionId === "raise") return "Opens";
  if (action.actionId === "threeBet") return "3-bets";
  if (action.actionId === "fourBet") return "4-bets";
  return formatPreflopActionLabel(action.actionId) || "Acts";
}

function getFinalPreflopActionByPosition(spot) {
  return (spot?.priorActions || []).reduce((accumulator, action) => {
    if (action.position) {
      accumulator[action.position] = action;
    }
    return accumulator;
  }, {});
}

function getPreflopRangeFacingOpenFoldedPositions(opener, heroPosition) {
  return [
    ...getPreflopRangePriorPositions(opener),
    ...getPreflopRangePositionsBetweenOpenerAndHero(opener, heroPosition),
  ];
}

function getPreflopRangePositionsBetweenOpenerAndHero(opener, heroPosition) {
  const order = ["LJ", "HJ", "CO", "BTN", "SB", "BB"];
  const index = order.indexOf(opener);
  const heroIndex = order.indexOf(heroPosition);
  return index >= 0 && heroIndex > index ? order.slice(index + 1, heroIndex) : [];
}

function getPreflopRangePositionsAfterHero(heroPosition) {
  const order = ["LJ", "HJ", "CO", "BTN", "SB", "BB"];
  const index = order.indexOf(heroPosition);
  return index >= 0 ? order.slice(index + 1) : [];
}

function isPreflopRangeFacingOpenSpot(spot) {
  return spot?.actionContext === "facing-open" && Boolean(spot?.heroPosition) && Boolean(spot?.villainPosition);
}

function isPreflopRangeFacingThreeBetSpot(spot) {
  return spot?.actionContext === "facing-3bet" && Boolean(spot?.heroPosition) && Boolean(spot?.villainPosition);
}

function isPreflopRangeFacingFourBetSpot(spot) {
  return spot?.actionContext === "facing-4bet" && Boolean(spot?.heroPosition) && Boolean(spot?.villainPosition);
}

function isPreflopRangeBvbLimpSpot(spot) {
  return spot?.family === "limpedPot" || spot?.actionContext === "limped-pot";
}

function isPreflopRangeIsoVsLimpSpot(spot) {
  return spot?.family === "isoVsLimper" || spot?.actionContext === "iso-vs-limper" || spot?.spotType === "iso-vs-limper";
}

function isPreflopRangeSqueezeSpot(spot) {
  return spot?.family === "squeeze" || spot?.actionContext === "squeeze" || spot?.spotType === "squeeze";
}

function isPreflopRangeLimpDecisionSpot(spot) {
  return isPreflopRangeBvbLimpSpot(spot) || isPreflopRangeIsoVsLimpSpot(spot);
}

function isPreflopRangePriorActionDecisionSpot(spot) {
  return isPreflopRangeLimpDecisionSpot(spot) || isPreflopRangeSqueezeSpot(spot);
}

function isPreflopRangeBbDefenseSpot(spot) {
  return isPreflopRangeFacingOpenSpot(spot) && spot?.heroPosition === "BB";
}

function getPreflopRangeSpotShortLabel(spot) {
  return formatPreflopSpotLabel(spot);
}

function formatPreflopRangeDecisionLabel(spot) {
  if (isPreflopRangePriorActionDecisionSpot(spot)) {
    return formatPreflopSpotLabel(spot);
  }

  if (isPreflopRangeFacingFourBetSpot(spot)) {
    return `${spot.heroPosition} 3-bet versus ${spot.villainPosition} 4-bet`;
  }

  if (isPreflopRangeFacingThreeBetSpot(spot)) {
    return `${spot.heroPosition} open versus ${spot.villainPosition} 3-bet`;
  }

  return isPreflopRangeFacingOpenSpot(spot)
    ? `${spot.heroPosition} versus ${spot.villainPosition} open`
    : `${spot?.heroPosition || "BTN"} first-in`;
}

function getPreflopRangeOpenLabel(spot) {
  return formatPreflopSizeLabel(spot);
}

function getPreflopRangeOpenActionLabel(spot) {
  const openSize = spot?.facingOpen?.sizeBb || spot?.raiseSize?.sizeBb || 0;
  const sizeLabel = openSize ? `${formatBbAmount(openSize)}bb` : "open";
  return `${spot?.heroPosition || "Hero"} opens ${sizeLabel}`;
}

function getPreflopRangeThreeBetActionLabel(spot) {
  const threeBetSize = spot?.facingThreeBet?.sizeBb || spot?.threeBetSize?.sizeBb || 0;
  const sizeLabel = threeBetSize ? `${formatBbAmount(threeBetSize)}bb` : "3-bet";
  return `${spot?.villainPosition || "Villain"} 3-bets ${sizeLabel}`;
}

function getPreflopRangeSizeFactLabel(spot) {
  if (isPreflopRangeSqueezeSpot(spot)) {
    return "Squeeze Size";
  }

  if (isPreflopRangeIsoVsLimpSpot(spot)) {
    return "Iso Size";
  }

  if (isPreflopRangeBvbLimpSpot(spot)) {
    return spot?.spotType === "sb-limp-vs-bb-raise" ? "Raise Size" : "Limp Size";
  }

  if (isPreflopRangeFacingFourBetSpot(spot)) {
    return "4-bet Size";
  }
  if (isPreflopRangeFacingThreeBetSpot(spot)) {
    return "3-bet Size";
  }
  return isPreflopRangeFacingOpenSpot(spot) ? "Facing Size" : "Open Size";
}

function createPreflopRangeScenarioCopy(spot, question) {
  const legalLabels = (question?.legalActions || [])
    .map((action) => getPreflopActionLabel(question.legalActions, action.id))
    .join(" / ");
  const reviewPrefix = activeSession?.mode === "review" ? "Review mode. " : "";
  return `${reviewPrefix}Hero has ${question.handClass}. Choose ${legalLabels} for ${formatPreflopSpotLabel(spot)}.`;
}

function formatPreflopActionLabel(actionId, context = null) {
  const formatted = window.FishKillerPreflopEngine?.formatPreflopActionLabel?.(actionId, context || undefined);
  if (formatted) return formatted;
  if (actionId === "fold") return "Fold";
  if (actionId === "call" && isPreflopRangeIsoVsLimpSpot(context)) {
    return context?.heroPosition === "SB" ? "Complete" : "Overlimp";
  }
  if (actionId === "call") return "Call";
  if (actionId === "check") return "Check";
  if (actionId === "limp") return "Limp";
  if (actionId === "raise") return "Raise";
  if (actionId === "isoRaise") return "Iso-raise";
  if (actionId === "squeeze") return "Squeeze";
  if (actionId === "threeBet") return "3-bet";
  if (actionId === "fourBet") return "4-bet";
  if (actionId === "fiveBetJam") return "5-bet jam";
  return "";
}

function formatPreflopSpotLabel(spot) {
  const formatted = window.FishKillerPreflopEngine?.formatPreflopSpotLabel?.(spot);
  if (formatted) return formatted;
  if (spot?.actionContext === "facing-4bet" || spot?.spotType === "facing-4bet") {
    return `${spot?.heroPosition || "Hero"} 3-bet vs ${spot?.openerPosition || spot?.villainPosition || "opener"} open, ${spot?.fourBettorPosition || spot?.aggressorPosition || spot?.villainPosition || "opener"} 4-bet`;
  }
  if (isPreflopRangeFacingThreeBetSpot(spot)) {
    return `${spot?.heroPosition || "Hero"} open vs ${spot?.villainPosition || "3-bettor"} 3-bet`;
  }
  if (spot?.actionContext === "iso-vs-limper" || spot?.spotType === "iso-vs-limper") {
    return `${spot?.heroPosition || "Hero"} vs ${spot?.limperPosition || spot?.villainPosition || "limper"} limp`;
  }
  if (spot?.actionContext === "squeeze" || spot?.spotType === "squeeze") {
    return `${spot?.heroPosition || "Hero"} vs ${spot?.openerPosition || spot?.villainPosition || "open"} open${spot?.callerPosition ? ` + ${spot.callerPosition} call` : ""}`;
  }
  if (spot?.actionContext === "limped-pot" || spot?.spotType === "limped-pot") {
    if (spot?.spotType === "sb-first-in-limp-or-raise") return "SB first in: limp or raise";
    if (spot?.spotType === "bb-vs-sb-limp") return "BB vs SB limp";
    if (spot?.spotType === "sb-limp-vs-bb-raise") return "SB limp vs BB raise";
    return `${spot?.heroPosition || "Hero"} in limped pot`;
  }
  if (isPreflopRangeFacingOpenSpot(spot)) {
    return `${spot?.heroPosition || "Hero"} vs ${spot?.openerPosition || spot?.villainPosition || "opener"} open`;
  }
  return `${spot?.heroPosition || "BTN"} first in`;
}

function formatPreflopSizeLabel(spot) {
  const formatted = window.FishKillerPreflopEngine?.formatPreflopSizeLabel?.(spot);
  if (formatted) return formatted;
  if (spot?.facingFourBet?.sizeBb) {
    return `${spot?.aggressorPosition || spot?.villainPosition || "4-bettor"} 4-bets ${formatBbAmount(spot.facingFourBet.sizeBb)}bb`;
  }
  if ((spot?.actionContext === "iso-vs-limper" || spot?.spotType === "iso-vs-limper") && spot?.isoRaiseSize?.sizeBb) {
    return `Iso ${formatBbAmount(spot.isoRaiseSize.sizeBb)}bb`;
  }
  if ((spot?.actionContext === "squeeze" || spot?.spotType === "squeeze") && spot?.squeezeSize?.sizeBb) {
    return `Squeeze ${formatBbAmount(spot.squeezeSize.sizeBb)}bb`;
  }
  if (spot?.actionContext === "limped-pot" || spot?.spotType === "limped-pot") {
    if (spot?.facingLimpRaise?.sizeBb) {
      return `${spot?.facingLimpRaise.raiserPosition || spot?.villainPosition || "Raiser"} raises ${formatBbAmount(spot.facingLimpRaise.sizeBb)}bb`;
    }
    if (spot?.facingLimp?.sizeBb) {
      return `${spot?.facingLimp.limperPosition || spot?.villainPosition || "Limper"} limps ${formatBbAmount(spot.facingLimp.sizeBb)}bb`;
    }
    if (spot?.limpSize?.sizeBb && spot?.raiseSize?.sizeBb) {
      return `Limp ${formatBbAmount(spot.limpSize.sizeBb)}bb / Raise ${formatBbAmount(spot.raiseSize.sizeBb)}bb`;
    }
    return "Limped pot";
  }
  if (spot?.facingThreeBet?.sizeBb) {
    return `${spot?.villainPosition || "Villain"} 3-bets ${formatBbAmount(spot.facingThreeBet.sizeBb)}bb`;
  }
  const size = spot?.facingOpen?.sizeBb || spot?.raiseSize?.sizeBb || 0;
  if (!size) {
    return "Open size unavailable";
  }
  const label = Number.isInteger(Number(size)) ? `${Number(size)}bb` : `${Number(size).toFixed(1)}bb`;
  return isPreflopRangeFacingOpenSpot(spot)
    ? `${spot?.villainPosition || "Opener"} opens ${label}`
    : `Open ${label}`;
}

function getPreflopRangeFacingOpenPot(spot) {
  const openSize = spot?.facingOpen?.sizeBb || 0;
  return spot?.villainPosition === "SB" ? openSize + BIG_BLIND : openSize + SMALL_BLIND + BIG_BLIND;
}

function getPreflopRangeFacingThreeBetPot(spot) {
  const openSize = spot?.facingOpen?.sizeBb || 0;
  const threeBetSize = spot?.facingThreeBet?.sizeBb || 0;
  const threeBettor = spot?.villainPosition || "";
  const deadSmallBlind = threeBettor === "SB" ? 0 : SMALL_BLIND;
  const deadBigBlind = threeBettor === "BB" ? 0 : BIG_BLIND;
  return openSize + threeBetSize + deadSmallBlind + deadBigBlind;
}

function getPreflopRangePriorActionPot(spot) {
  const contributions = { SB: SMALL_BLIND, BB: BIG_BLIND };
  (spot?.priorActions || []).forEach((action) => {
    if (action.position && typeof action.sizeBb === "number") {
      contributions[action.position] = action.sizeBb;
    }
  });
  return Object.values(contributions).reduce((total, amount) => total + amount, 0);
}

function renderPreflopRangeAnswers(question) {
  elements.answerGrid.innerHTML = "";
  renderPreflopRangeDrillSelector();
  const preferredActionId = question.grade?.preferredActionId || "";

  (question.legalActions || []).forEach((action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";

    if (question.answered) {
      if (action.id === preferredActionId) {
        button.classList.add("correct");
      } else if (action.id === question.selected && question.isMixed) {
        button.classList.add("mixed");
      } else if (action.id === question.selected) {
        button.classList.add("wrong");
      } else {
        button.classList.add("locked");
      }
    }

    button.disabled = question.answered;
    button.classList.add(`answer-${getPreflopActionTone(action.id)}`);
    button.innerHTML = createPreflopActionButtonMarkup(action, question.legalActions);
    button.addEventListener("click", () => answerCurrentQuestion(action.id));
    elements.answerGrid.appendChild(button);
  });

}

function renderPreflopRangeAnsweredState(question) {
  try {
    renderScenario();
    return;
  } catch (error) {
    console.error("Failed to render answered 6-max preflop spot; showing fallback controls.", error);
  }

  renderPreflopRangeAnswerFallback(question);
}

function renderPreflopRangeAnswerFallback(question) {
  if (!question) {
    return;
  }

  elements.answerGrid.innerHTML = "";
  const preferredActionId = question.grade?.preferredActionId || "";
  (question.legalActions || []).forEach((action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";
    if (action.id === preferredActionId) {
      button.classList.add("correct");
    } else if (action.id === question.selected && question.isMixed) {
      button.classList.add("mixed");
    } else if (action.id === question.selected) {
      button.classList.add("wrong");
    } else {
      button.classList.add("locked");
    }
    button.classList.add(`answer-${getPreflopActionTone(action.id)}`);
    button.disabled = true;
    button.innerHTML = createPreflopActionButtonMarkup(action, question.legalActions);
    elements.answerGrid.appendChild(button);
  });
  const grade = question.grade || {};
  elements.feedbackBand.className = `feedback-band ${question.isCorrect ? "correct" : question.isMixed ? "mixed" : "wrong"}`;
  elements.feedbackLabel.textContent = question.isCorrect ? "Correct" : question.isMixed ? "Mixed" : "Correction";
  elements.feedbackText.textContent = grade.feedback || "Answer recorded. Continue to the next hand.";
  elements.continueButton.disabled = false;
  elements.continueButton.textContent = getPreflopRangeAdvanceLabel();
}

function createPreflopActionButtonMarkup(action, legalActions = []) {
  const label = getPreflopActionLabel(legalActions, action.id);
  return `
    <span class="answer-icon-well" aria-hidden="true">
      ${createPreflopActionIconMarkup(action.id)}
    </span>
    <span class="answer-copy">
      <strong>${label}</strong>
      <span>${getPreflopRangeActionHint(action)}</span>
    </span>
  `;
}

function getPreflopActionTone(actionId = "") {
  if (actionId === "fold") {
    return "fold";
  }

  if (["call", "check", "limp"].includes(actionId)) {
    return "call";
  }

  return "raise";
}

function createPreflopActionIconMarkup(actionId = "") {
  if (actionId === "fold") {
    return '<svg viewBox="0 0 24 24" focusable="false"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  }

  if (actionId === "check") {
    return '<svg viewBox="0 0 24 24" focusable="false"><path d="M5 12.5l4.2 4.2L19 7"/></svg>';
  }

  if (actionId === "call" || actionId === "limp") {
    return '<svg viewBox="0 0 24 24" focusable="false"><path d="M12 3l7 3v5.5c0 4.1-2.8 7.2-7 9.5-4.2-2.3-7-5.4-7-9.5V6l7-3Z"/></svg>';
  }

  return '<svg viewBox="0 0 24 24" focusable="false"><path d="M12 19V5M6.5 10.5 12 5l5.5 5.5"/><path d="M7 19h10"/></svg>';
}

function renderPreflopRangeDrillSelector() {
  const wrapper = document.createElement("div");
  wrapper.className = "preflop-drill-selector";
  const question = getCurrentQuestion();
  const spot = getPreflopRangeSpot(question?.spotId);
  const activeDrillId = getActivePreflopRangeDrillId();
  const hasMistakes = Boolean(PREFLOP_PROGRESS?.hasPreflop6maxMistakes(state.preflop6maxProgress));
  const activeDrill = getPreflopRangeDrill(activeDrillId) || getPreflopRangeDrill(PREFLOP_RANGE_DEFAULT_DRILL_ID);
  const details = document.createElement("details");
  details.className = "preflop-drill-menu";

  const summary = document.createElement("summary");
  summary.className = "preflop-drill-menu-button";
  summary.setAttribute("aria-label", "Choose 6-max preflop drill");
  summary.title = `Drill: ${activeDrill?.label || "All Preflop"}`;
  const menuIcon = document.createElement("span");
  menuIcon.className = "preflop-drill-menu-icon";
  menuIcon.setAttribute("aria-hidden", "true");
  for (let index = 0; index < 3; index += 1) {
    menuIcon.appendChild(document.createElement("i"));
  }
  summary.appendChild(menuIcon);

  const panel = document.createElement("div");
  panel.className = "preflop-drill-panel";

  const label = document.createElement("label");
  label.className = "preflop-drill-label";
  label.setAttribute("for", "preflop-drill-select");
  label.textContent = activeSession?.mode === "review" ? "Review mode" : "Choose drill";

  let currentGroup = "";
  let groupElement = null;
  const select = document.createElement("select");
  select.id = "preflop-drill-select";
  select.className = "preflop-drill-select";
  select.setAttribute("aria-label", "Choose 6-max preflop drill");

  PREFLOP_RANGE_DRILL_OPTIONS.forEach((drill) => {
    if (drill.group && drill.group !== currentGroup) {
      groupElement = document.createElement("optgroup");
      groupElement.label = drill.group;
      select.appendChild(groupElement);
      currentGroup = drill.group;
    }

    const option = document.createElement("option");
    option.value = drill.id;
    option.textContent = drill.label;
    option.selected = drill.id === activeDrillId;
    option.disabled = drill.reviewMode && !hasMistakes;
    (groupElement || select).appendChild(option);
  });

  select.addEventListener("change", () => selectPreflopRangeDrill(select.value));

  const hint = document.createElement("span");
  hint.className = "preflop-drill-hint";
  hint.textContent = activeDrill?.reviewMode
    ? "Replaying recent missed hands."
    : activeDrill?.id === PREFLOP_RANGE_DEFAULT_DRILL_ID
      ? "Default: all 56 live preflop spots can appear."
      : `Focused: ${activeDrill?.label || "selected drill"}.`;

  const meta = document.createElement("div");
  meta.className = "preflop-drill-meta";
  meta.innerHTML = [
    ["Spot", spot ? getPreflopRangeSpotShortLabel(spot) : "Ready"],
    ["Stack", "100bb"],
    [spot ? getPreflopRangeSizeFactLabel(spot) : "Size", spot ? getPreflopRangeOpenLabel(spot) : "All spots"],
    ["Coverage", getPreflopCoverageLabel()],
  ].map(([key, value]) => `<span><em>${key}</em><strong>${value}</strong></span>`).join("");

  panel.append(label, select, hint, meta);
  details.append(summary, panel);
  wrapper.appendChild(details);
  elements.answerGrid.appendChild(wrapper);
}

function renderPreflopRangeFeedback(question) {
  elements.gtoTableButton.classList.remove("hidden");
  elements.gtoTableButton.textContent = "View Range Table";

  if (!question.answered) {
    elements.feedbackBand.className = "feedback-band neutral";
    elements.feedbackLabel.textContent = "Choose your line";
    elements.feedbackText.textContent = "Use the loaded FishKiller 6-max preflop range pack. Only supported actions for this exact spot are shown.";
    elements.continueButton.disabled = true;
    elements.continueButton.textContent = "Continue";
    return;
  }

  const grade = question.grade || {};
  const preferredLabel = getPreflopActionLabel(question.legalActions, grade.preferredActionId);
  const selectedLabel = getPreflopActionLabel(question.legalActions, grade.chosenActionId);
  const frequencyText = formatPreflopRangeFrequencies(question);

  if (grade.kind === "correct") {
    elements.feedbackBand.className = "feedback-band correct";
    elements.feedbackLabel.textContent = "Correct";
    elements.feedbackText.textContent = `Good. ${selectedLabel} is the top-frequency action here. Frequencies: ${frequencyText}.`;
  } else if (grade.kind === "mixed") {
    elements.feedbackBand.className = "feedback-band mixed";
    elements.feedbackLabel.textContent = "Mixed";
    elements.feedbackText.textContent = `${selectedLabel} has meaningful frequency, so it is playable, but ${preferredLabel} is the top action. Frequencies: ${frequencyText}.`;
  } else if (grade.kind === "illegal") {
    elements.feedbackBand.className = "feedback-band wrong";
    elements.feedbackLabel.textContent = "Unsupported";
    elements.feedbackText.textContent = `${selectedLabel || grade.chosenActionId} is not available in this exact range spot. Available actions: ${(question.legalActions || []).map((action) => getPreflopActionLabel(question.legalActions, action.id)).join(" / ")}.`;
  } else {
    elements.feedbackBand.className = "feedback-band wrong";
    elements.feedbackLabel.textContent = "Correction";
    elements.feedbackText.textContent = `Prefer ${preferredLabel}. ${selectedLabel || grade.chosenActionId} is ${formatPercent(grade.chosenFrequency || 0)}; ${preferredLabel} is ${formatPercent(grade.preferredFrequency || 0)}. Full mix: ${frequencyText}.`;
  }

  elements.continueButton.disabled = false;
  elements.continueButton.textContent = getPreflopRangeAdvanceLabel();
}

function getPreflopRangeAdvanceLabel() {
  if (!activeSession) {
    return "Continue";
  }

  const lastQuestion = activeSession.currentIndex >= activeSession.questionStates.length - 1;
  const failedMain = activeSession.mode === "main" && activeSession.strikes >= 3;
  return failedMain ? "End Session" : lastQuestion ? "See Summary" : "Next Hand";
}

function getPreflopRangeAdvanceHint() {
  if (!activeSession) {
    return "Continue the session.";
  }

  const failedMain = activeSession.mode === "main" && activeSession.strikes >= 3;
  if (failedMain) {
    return "Three mistakes ends this run.";
  }

  const lastQuestion = activeSession.currentIndex >= activeSession.questionStates.length - 1;
  return lastQuestion ? "Open your session review." : "Move to the next preflop spot.";
}

function getPreflopActionLabel(actions = [], actionId = "", spot = preflopRangeSpot) {
  const formatted = formatPreflopActionLabel(actionId, spot);
  if (formatted) {
    return formatted;
  }

  const action = actions.find((item) => item.id === actionId);
  return action?.label || actionId;
}

function getPreflopRangeActionHint(action) {
  if (action.id === "check") {
    return "Take the free option when raising is not required.";
  }
  if (action.id === "limp") {
    return "Complete into the pot with the limp portion of the range.";
  }
  if (action.id === "raise") {
    return action.sizeBb ? `Open to ${action.sizeBb}bb and take the initiative.` : "Open the range.";
  }
  if (action.id === "isoRaise") {
    return action.sizeBb ? `Isolate to ${action.sizeBb}bb against the limper.` : "Raise over the limp.";
  }
  if (action.id === "threeBet") {
    return action.sizeBb ? `Re-raise to ${action.sizeBb}bb with pressure.` : "Re-raise from the big blind.";
  }
  if (action.id === "squeeze") {
    return action.sizeBb ? `Squeeze to ${action.sizeBb}bb after open and call.` : "Squeeze over the open and caller.";
  }
  if (action.id === "fourBet") {
    return action.sizeBb ? `4-bet to ${action.sizeBb}bb or release weaker opens.` : "4-bet the continue range.";
  }
  if (action.id === "fiveBetJam") {
    return "Jam the 5-bet portion of the range.";
  }
  if (action.id === "call") {
    const activeSpot = getActivePreflopRangeSpot();
    if (isPreflopRangeIsoVsLimpSpot(activeSpot)) {
      return activeSpot?.heroPosition === "SB"
        ? "Complete the small blind against the limp."
        : "Overlimp behind the limper with the calling portion.";
    }
    return action.callAmountBb ? `Defend by adding ${action.callAmountBb}bb.` : "Defend and see a flop.";
  }
  if (action.id === "fold") {
    return "Release hands outside this range.";
  }
  return "Choose a supported action from this range spot.";
}

function formatPreflopRangeFrequencies(question) {
  const strategy = question.grade?.strategy || question.strategy?.actions || {};
  return (question.legalActions || [])
    .map((action) => `${getPreflopActionLabel(question.legalActions, action.id)} ${formatPercent(strategy[action.id] || 0)}`)
    .join(" / ");
}

function renderIdleScenario() {
  const selectedTable = TABLES[state.selectedTableSize];
  renderCards("AKo", "idle");
  elements.scenarioTable.textContent = `${selectedTable.label} - Current Pack: 100bb Cash`;
  elements.scenarioDifficulty.textContent = "Core";
  renderBettingLine({
    pot: SMALL_BLIND + BIG_BLIND,
    items: [
      `Blinds ${formatMoney(SMALL_BLIND)} / ${formatMoney(BIG_BLIND)}`,
      `Starting pot ${formatMoney(SMALL_BLIND + BIG_BLIND)}`,
    ],
    actionBySeat: {},
  });
  elements.scenarioTitle.textContent = "Start a new session whenever you want.";
  elements.scenarioCopy.textContent = selectedTable.id === "six"
    ? `6-max is the flagship preflop trainer: 56 internal baseline spots across ${getPreflopCoverageLabel()}.`
    : `${selectedTable.label} currently uses starter scenario-pack drills. The full range-pack trainer is focused on 6-max preflop.`;
  elements.sessionChip.textContent = "Ready";
  elements.sessionCounter.textContent = "0 / 10";
  elements.mistakeCounter.textContent = "0 mistakes";
  elements.sessionAccuracy.textContent = "0%";
  elements.progressFill.style.width = "0%";
  const idleFacts = [
    createFactCard("Format", selectedTable.label),
    createFactCard("Session", "10 spots"),
    createFactCard("Engine", getTableTrainingLabel(selectedTable.id)),
    createFactCard("Heart Rule", "3 strikes max"),
  ];
  if (selectedTable.id === "six") {
    idleFacts.splice(3, 0, createFactCard("Coverage", getPreflopCoverageLabel()));
  }
  elements.scenarioFacts.innerHTML = idleFacts.join("");
  setScenarioExplanationVisible(true);

  renderTableVisual({
    tableSize: selectedTable.id,
    heroSeat: TABLES[selectedTable.id].seats[0].seat,
    actors: [{ seat: TABLES[selectedTable.id].seats[0].seat, label: "Hero" }],
  });

  elements.answerGrid.innerHTML = `
    <button class="answer-button" type="button" onclick="window.__fishkillerStartFromCard()">
      <strong>Launch Session</strong>
      <span>${selectedTable.id === "six" ? "Start a 56-spot range-pack run." : "Start a starter scenario-pack run."}</span>
    </button>
    <button class="answer-button" type="button" disabled>
      <strong>Instant Corrections</strong>
      <span>Wrong answers show the correct solver-style baseline and the reason behind it.</span>
    </button>
    <button class="answer-button" type="button" disabled>
      <strong>Retry Misses</strong>
      <span>Any leak you show in a main session is bundled into a dedicated repair round.</span>
    </button>
    <button class="answer-button" type="button" disabled>
      <strong>Format XP</strong>
      <span>Each table size has its own XP lane, plus your global total on top.</span>
    </button>
  `;

  elements.feedbackBand.className = "feedback-band neutral";
  elements.feedbackLabel.textContent = "Warm-up";
  elements.feedbackText.textContent = selectedTable.id === "six"
    ? "6-max uses the live range pack. Main sessions cost a heart only if you hit three mistakes; review rounds are free."
    : "Starter scenario drills are still available for this table size. Main sessions cost a heart only if you hit three mistakes.";
  elements.gtoTableButton.classList.add("hidden");
  elements.continueButton.disabled = true;
  elements.continueButton.textContent = "Continue";
}

function setScenarioExplanationVisible(isVisible) {
  [elements.scenarioTitle, elements.scenarioCopy, elements.scenarioFacts].forEach((element) => {
    element.classList.toggle("hidden", !isVisible);
  });
}

function renderCards(hand, seed = hand) {
  const parsed = parseHand(hand, seed);
  applyCardStyle();
  elements.heroCardLeft.innerHTML = createCardFace(parsed.left, parsed.leftSuit);
  elements.heroCardRight.innerHTML = createCardFace(parsed.right, parsed.rightSuit);
}

function renderScenarioCards(scenario) {
  const cards = getHeroCardsForScenario(scenario);
  applyCardStyle();
  elements.heroCardLeft.innerHTML = createCardFace(cards[0].rank, cards[0].suit);
  elements.heroCardRight.innerHTML = createCardFace(cards[1].rank, cards[1].suit);
}

function applyCardStyle() {
  const cardStyle = getActiveCardStyleId();
  [elements.heroCardLeft, elements.heroCardRight].forEach((card) => {
    card.className = `hero-card card-style-${cardStyle}`;
  });
}

function getActiveCardStyleId() {
  return isCardStyleUnlocked(state.cardStyle) ? state.cardStyle : "reef";
}

function createCardFace(rank, suit) {
  return `
    <span class="card-rank">${rank}</span>
    <span class="card-suit suit-${suit.id}" aria-label="${suit.name}" title="${suit.name}">${suit.symbol}</span>
  `;
}

function createFactCard(label, value) {
  return `<div class="fact-card"><span>${label}</span><strong>${value}</strong></div>`;
}

function getScenarioSpot(scenario, question) {
  const street = question.street || "preflop";
  if (street === "preflop") {
    return {
      street,
      title: scenario.title,
      copy: scenario.copy,
      heroHand: scenario.heroHand,
      difficulty: scenario.difficulty,
      facts: scenario.facts,
      options: scenario.options,
      correctAction: scenario.correctAction,
      tableSize: scenario.tableSize,
      heroSeat: scenario.heroSeat,
      scenarioId: scenario.id,
      preflopAction: scenario.correctAction,
      explanation: scenario.explanation,
    };
  }

  return createFullHandSpot(scenario, street, question.runoutSeed, question);
}

function createFullHandSpot(scenario, street, runoutSeed = scenario.id, question = null) {
  const board = getBoardForStreet(scenario, street, runoutSeed);
  const boardLabel = formatBoard(board);
  const basePot = getCarriedPotForStreet(scenario, street, runoutSeed, question);
  const texture = getBoardTexture(board);
  const heroCards = getHeroCardsForScenario(scenario);
  const liveSeatSet = getPostflopLiveSeatSet(scenario, TABLES[scenario.tableSize], question, runoutSeed);
  const liveOpponentSeats = [...liveSeatSet].filter((seat) => seat !== scenario.heroSeat);
  const preHeroActions = createPreHeroPostflopActions(scenario, street, runoutSeed, basePot, board, liveSeatSet);
  const facingAction = getFacingPreHeroAction(preHeroActions);
  const preHeroContribution = preHeroActions.reduce((total, action) => total + (action.contribution || 0), 0);
  const pot = basePot + preHeroContribution;
  const actionProfile = getPostflopActionProfile(street, scenario.heroHand, board, texture, pot, runoutSeed, scenario, {
    basePot,
    preHeroActions,
    facingAction,
  });
  const liveOpponentCount = getLiveOpponentSeatsAfterPreHero(scenario, preHeroActions, liveSeatSet).length;
  const actionFact = facingAction
    ? `${facingAction.seat} ${facingAction.action.toLowerCase()} ${facingAction.amountLabel}`
    : preHeroActions.length
      ? "Checked to Hero"
      : "Hero opens action";

  return {
    street,
    title: `${getStreetLabel(street)} decision after ${scenario.correctAction.toLowerCase()}`,
    copy: `${boardLabel}. Decide how Hero should continue with ${formatCardsForText(heroCards)}.`,
    board,
    heroHand: scenario.heroHand,
    heroCards,
    difficulty: street === "river" ? "Full Hand" : "Postflop",
    facts: [
      { label: "Street", value: getStreetLabel(street) },
      { label: "Board", value: boardLabel },
      { label: "Pot", value: formatMoney(pot) },
      { label: "Opponents", value: `${liveOpponentCount} live hand${liveOpponentCount === 1 ? "" : "s"}` },
      { label: "Action", value: actionFact },
    ],
    options: actionProfile.options,
    correctAction: actionProfile.correctAction,
    pressure: actionProfile.pressure,
    pot,
    tableSize: scenario.tableSize,
    heroSeat: scenario.heroSeat,
    preflopAction: scenario.correctAction,
    basePot,
    runoutSeed,
    preHeroActions,
    facingAction,
    liveOpponentSeats,
    callAmount: actionProfile.callAmount || 0,
    raiseAmount: actionProfile.raiseAmount || 0,
    scenarioId: scenario.id,
    explanation: actionProfile.explanation,
  };
}

function getPostflopActionProfile(street, heroHand, board, texture, pot, runoutSeed = "", scenario = {}, actionContext = {}) {
  if (!POSTFLOP_SOLVER_ENABLED) {
    return {
      options: ["Check"],
      correctAction: "Check",
      pressure: "paused",
      callAmount: 0,
      raiseAmount: 0,
      explanation: "Postflop solver output is paused while the presentation layer is rebuilt.",
    };
  }

  const smallBet = `Bet 33% pot (${formatMoney(pot * 0.33)})`;
  const bigBet = `Bet 75% pot (${formatMoney(pot * 0.75)})`;
  const check = street === "river" ? "Check / Showdown" : "Check";
  const facingAction = actionContext.facingAction || null;
  const callAmount = facingAction?.amount || 0;
  const raiseAmount = facingAction ? getHeroRaiseAmountFacingAction(pot, facingAction) : 0;
  const options = facingAction
    ? ["Fold", `Call ${formatMoney(callAmount)}`, `Raise to ${formatMoney(raiseAmount)}`]
    : [check, smallBet, bigBet];
  const handClass = normalizeHandClass(heroHand);
  const evaluation = evaluatePostflopHandClass(handClass, board);
  const boardProfile = getBoardProfile(board);
  const pressure = getRecommendedPostflopPressure(evaluation, boardProfile, street);
  const pressureAction = facingAction
    ? `Call ${formatMoney(callAmount)}`
    : pressure === "polar" ? bigBet : pressure === "range" ? smallBet : check;
  const spot = {
    street,
    board,
    heroHand,
    heroCards: scenario.id ? getHeroCardsForScenario(scenario) : null,
    options,
    correctAction: pressureAction,
    pressure,
    pot,
    runoutSeed,
    tableSize: scenario.tableSize,
    heroSeat: scenario.heroSeat,
    preflopAction: scenario.correctAction,
    basePot: actionContext.basePot || pot,
    preHeroActions: actionContext.preHeroActions || [],
    facingAction,
    callAmount,
    raiseAmount,
    scenarioId: scenario.id,
  };
  const action = classifyPostflopMatrixHand(handClass, spot);

  return {
    options,
    correctAction: action.option,
    pressure,
    callAmount,
    raiseAmount,
    explanation: getPostflopActionExplanation(action, evaluation, boardProfile, texture),
  };
}

function getRecommendedPostflopPressure(evaluation, boardProfile, street) {
  if (street === "flop" && (boardProfile.dryness >= 6 || boardProfile.paired || boardProfile.monotone)) {
    return evaluation.showdownScore >= 35 || evaluation.drawScore >= 10 || evaluation.overcardScore >= 10 ? "range" : "thin";
  }

  if (street === "river") {
    if (evaluation.madeScore >= 72 || evaluation.nutPotential >= 78) return "polar";
    if (evaluation.showdownScore >= 42) return "thin";
    if (evaluation.blockerScore >= 13 && boardProfile.wetness >= 5) return "polar";
    return "thin";
  }

  if (evaluation.madeScore >= 78 || evaluation.nutPotential >= 76) return "polar";
  if (boardProfile.wetness >= 7 && (evaluation.madeScore >= 62 || evaluation.strongDraw)) return "polar";
  if (boardProfile.monotone && !evaluation.flush && !evaluation.strongDraw) return "thin";
  if (boardProfile.dryness >= 6 || evaluation.drawScore >= 16 || evaluation.overcardScore >= 10) return "range";
  if (evaluation.madeScore >= 48) return "range";
  return "thin";
}

function getPostflopActionExplanation(action, evaluation, boardProfile, texture) {
  if (action.solver?.source === "imported") {
    const frequency = Math.round((action.solver.frequency || 0) * 100);
    const equity = typeof action.solver.equity === "number" ? `, ${Math.round(action.solver.equity * 100)}% exported equity` : "";
    const ev = typeof action.solver.ev === "number" ? `, ${formatMoney(action.solver.ev)} exported EV` : "";
    return `${action.label} comes from imported solver pack "${action.solver.packName}" at ${frequency}% frequency${equity}${ev}.`;
  }

  if (action.solver) {
    const frequency = Math.round(action.solver.frequency * 100);
    const equity = Math.round(action.solver.equity * 100);
    return `${action.label} is the best local solver line: ${equity}% sampled equity, ${frequency}% mixed frequency, and ${formatMoney(action.solver.ev)} estimated EV on this ${texture} board.`;
  }

  if (action.tags?.includes("trap")) {
    return `This hand is strong enough to sometimes slowplay on a ${texture} board, keeping traps in the checking range.`;
  }

  if (action.tags?.includes("bluff")) {
    return `The solver-style mix uses blockers and draw equity as bluffs here, so this combo can pressure the range without needing showdown value.`;
  }

  if (action.id === "bet-big" || action.id === "raise-big") {
    return `A larger bet keeps the range polar: strong value is balanced by the right bluff candidates on this ${texture} board.`;
  }

  if (action.id === "bet-small") {
    return `A smaller range bet applies pressure while protecting medium equity and backdoor hands on this ${texture} board.`;
  }

  if (evaluation.showdownScore >= 38 || evaluation.madeScore >= 42) {
    return `Checking realizes equity and avoids over-bluffing a hand with enough showdown value.`;
  }

  if (boardProfile.monotone || boardProfile.wetness >= 7) {
    return `This board is coordinated enough that weak hands should not auto-fire without useful blockers or draw equity.`;
  }

  return `This combo does not gain enough from betting, so checking keeps the range protected.`;
}

function createVillainResponse(scenario, spot, question) {
  if (!question.answered) {
    return null;
  }

  if (spot.street === "preflop") {
    ensurePreflopResponseState(scenario, spot, question);
    return getPrimaryPreflopResponse(question);
  }

  const seat = getVillainSeatForSpot(scenario, spot, question);
  const pot = spot.street === "preflop"
    ? createBettingSummary(scenario).pot
    : spot.pot || getSpotPotValue(spot) || estimateStreetPot(scenario, spot.street);
  const selected = question.selected;
  const accepted = question.isCorrect || question.isMixed;
  const selectedAction = getActionForOption(spot, selected);

  if (spot.facingAction) {
    if (!selectedAction || selectedAction.id === "fold" || selectedAction.id === "call") {
      return null;
    }

    if (selectedAction.id === "raise") {
      const raiseAmount = getActionAmount(selectedAction) || spot.raiseAmount || pot * 1.1;
      const callContribution = Math.max(0, raiseAmount - (spot.facingAction.amount || 0));
      const reRaiseAmount = Math.max(raiseAmount * 2.2, pot * 2.4);
      const contribution = accepted ? callContribution : reRaiseAmount;
      return {
        seat,
        action: accepted ? "Calls" : "Re-raises",
        contribution,
        amountLabel: formatMoney(contribution),
        isRaise: !accepted,
      };
    }

    return null;
  }

  if (selected.includes("Bet 75")) {
    const contribution = accepted ? pot * 0.75 : pot * 2.15;
    return {
      seat,
      action: accepted ? "Calls" : "Raises",
      contribution,
      amountLabel: formatMoney(contribution),
    };
  }

  if (selected.includes("Bet 33")) {
    const contribution = accepted ? pot * 0.33 : pot * 1.25;
    return {
      seat,
      action: accepted ? "Calls" : "Check-raises",
      contribution,
      amountLabel: formatMoney(contribution),
    };
  }

  const contribution = accepted ? 0 : pot * 0.66;
  return {
    seat,
    action: accepted ? "Checks back" : "Bets",
    contribution,
    amountLabel: contribution > 0 ? formatMoney(contribution) : "$0.00",
  };
}

function syncVillainResponseWithShowdownResult(question) {
  const result = question.showdownResult;
  if (!result || result.type !== "fold" || result.winner !== "Hero") {
    return;
  }

  const targetKey = question.villainReturnResponse ? "villainReturnResponse" : "villainResponse";
  const previousResponse = question[targetKey] || question.villainResponse || question.preflopResponses?.find((response) => response.seat === result.villainSeat) || {};
  question[targetKey] = {
    ...previousResponse,
    seat: result.villainSeat,
    action: "Folds",
    contribution: 0,
    amountLabel: "",
    folded: true,
  };
}

function ensurePreflopResponseState(scenario, spot, question) {
  if (spot.street !== "preflop" || question.preflopResponses?.length || question.raiseSpot?.preflopResponses?.length) {
    if (question.raiseSpot?.preflopResponses?.length && !question.preflopResponses?.length) {
      question.preflopResponses = [...question.raiseSpot.preflopResponses];
    }
    return;
  }

  const selectedAction = getActionForOption(spot, question.selected);
  if (!isHeroOpenAction(selectedAction)) {
    return;
  }

  const responseKind = getPreflopOpenResponseKind(scenario, question, selectedAction, false);
  const plan = createPreflopOpenResponsePlan(scenario, question, selectedAction, responseKind);
  question.preflopResponses = plan.responses;
}

function getPrimaryPreflopResponse(question) {
  if (!question.preflopResponses?.length) {
    return null;
  }

  return question.preflopResponses.find((response) => response.isRaise || response.action === "Calls") || question.preflopResponses[question.preflopResponses.length - 1];
}

function isHeroOpenAction(action) {
  return Boolean(action && action.id === "raise" && /^Open\s+/i.test(action.option || ""));
}

function createPreflopOpenResponsePlan(scenario, question, selectedAction, responseKind) {
  const openAmount = getPreflopOpenAmount(selectedAction.option, scenario);
  const candidates = getPreflopOpenResponseSeats(scenario);
  const fallbackSeat = getDefaultVillainSeat(scenario, TABLES[scenario.tableSize]);
  const responseSeats = candidates.length ? candidates : [fallbackSeat];
  const profiles = getPreflopOpenResponseProfiles(scenario, question, selectedAction, responseSeats);
  const profileBySeat = Object.fromEntries(profiles.map((profile) => [profile.seat, profile]));

  if (responseKind === "fold") {
    const responses = responseSeats.map((seat) => createPreflopSeatResponse(seat, "Folds", 0, 0, false, profileBySeat[seat]));
    return { openAmount, responses, primaryResponse: responses[responses.length - 1] };
  }

  const responder = choosePreflopResponderSeat(responseSeats, question, responseKind, profiles);
  const responses = responseSeats.map((seat) => {
    const profile = profileBySeat[seat];
    if (seat !== responder) {
      return createPreflopSeatResponse(seat, "Folds", 0, 0, false, profile);
    }

    if (responseKind === "reraise") {
      const raiseTo = getPreflopVillainThreeBetAmount(openAmount, seat, scenario);
      return createPreflopSeatResponse(seat, "3-bets to", raiseTo, getAdditionalPreflopContribution(seat, raiseTo), true, profile);
    }

    const callContribution = getAdditionalPreflopContribution(seat, openAmount);
    return createPreflopSeatResponse(seat, "Calls", callContribution, callContribution, false, profile);
  });

  return {
    openAmount,
    responses,
    primaryResponse: responses.find((response) => response.seat === responder),
  };
}

function createPreflopSeatResponse(seat, action, amount = 0, contribution = 0, isRaise = false, profile = null) {
  return {
    seat,
    action,
    amount,
    amountLabel: amount > 0 ? formatMoney(amount) : "",
    contribution,
    folded: action === "Folds",
    isRaise,
    cards: profile?.cards || null,
    handClass: profile?.handClass || "",
    strength: profile?.strength || 0,
  };
}

function getPreflopOpenResponseKind(scenario, question, selectedAction, allowReraise = true) {
  const responseSeats = getPreflopOpenResponseSeats(scenario);
  const profiles = getPreflopOpenResponseProfiles(scenario, question, selectedAction, responseSeats);
  const bestReraise = getBestPreflopProfileByKind(profiles, "reraise");
  if (bestReraise && allowReraise) {
    return "reraise";
  }

  if (bestReraise && !allowReraise) {
    return "call";
  }

  return getBestPreflopProfileByKind(profiles, "call") ? "call" : "fold";
}

function getPreflopOpenResponseProfiles(scenario, question, selectedAction, responseSeats = getPreflopOpenResponseSeats(scenario)) {
  const dealtHands = dealPreflopVillainHands(scenario, question, responseSeats);
  return responseSeats.map((seat) => {
    const cards = dealtHands[seat] || [];
    const handClass = getHandClassFromCards(cards);
    const strength = handClass ? getHandStrength(handClass) : 0;
    const kind = classifyPreflopVillainOpenResponse(scenario, seat, handClass, selectedAction, strength, question);
    return { seat, cards, handClass, strength, kind };
  });
}

function dealPreflopVillainHands(scenario, question, seats) {
  const heroCards = getHeroCardsForScenario(scenario);
  const used = new Set(heroCards.map((card) => getCardKey(card.rank, card.suit.id)));
  const deck = seededShuffle(
    buildDeck().filter((card) => !used.has(getCardKey(card.rank, card.suit.id))),
    hashString(`${question.runoutSeed}-${question.selected || scenario.id}-villain-preflop-deal`)
  );
  const hands = {};

  seats.forEach((seat, index) => {
    hands[seat] = deck.slice(index * 2, index * 2 + 2);
  });

  return hands;
}

function getHandClassFromCards(cards) {
  if (!cards || cards.length < 2) {
    return "";
  }

  const [firstCard, secondCard] = [...cards].sort((first, second) => HAND_RANKS.indexOf(first.rank) - HAND_RANKS.indexOf(second.rank));
  if (firstCard.rank === secondCard.rank) {
    return `${firstCard.rank}${secondCard.rank}`;
  }

  return `${firstCard.rank}${secondCard.rank}${firstCard.suit.id === secondCard.suit.id ? "s" : "o"}`;
}

function classifyPreflopVillainOpenResponse(scenario, seat, handClass, selectedAction, strength, question) {
  if (!handClass || selectedAction.id === "raise-big" || selectedAction.option.includes("Jam")) {
    return strength >= 88 ? "call" : "fold";
  }

  const thresholds = getPreflopVillainOpenThresholds(scenario, seat);
  const mixRoll = getMixRoll(`${question.runoutSeed}-${seat}-${handClass}-villain-response-mix`);
  const stealSpot = ["BTN", "SB / BTN", "CO"].includes(scenario.heroSeat);

  if (isWheelAce(handClass) && stealSpot && mixRoll < 0.55) {
    return "reraise";
  }

  if (strength >= thresholds.reraise || shouldReraisePreflopCombo(handClass, scenario, seat, strength)) {
    return "reraise";
  }

  if (strength >= thresholds.call || shouldCallPreflopCombo(handClass, scenario, seat, strength)) {
    return "call";
  }

  return "fold";
}

function getPreflopVillainOpenThresholds(scenario, seat) {
  const opener = scenario.heroSeat;
  let call = 56;
  let reraise = 84;

  if (opener === "SB / BTN") {
    call = 34;
    reraise = 68;
  } else if (opener === "BTN") {
    call = seat.includes("BB") ? 39 : 46;
    reraise = seat.includes("BB") ? 72 : 76;
  } else if (opener === "CO") {
    call = seat.includes("BB") ? 45 : 51;
    reraise = seat.includes("BB") ? 77 : 80;
  } else if (opener === "HJ" || opener === "LJ") {
    call = 53;
    reraise = 83;
  } else if (opener === "UTG" || opener === "UTG+1" || opener === "MP") {
    call = 61;
    reraise = 88;
  } else if (opener === "SB") {
    call = 42;
    reraise = 72;
  }

  return { call, reraise };
}

function shouldReraisePreflopCombo(handClass, scenario, seat, strength) {
  const stealSpot = ["BTN", "SB / BTN", "CO"].includes(scenario.heroSeat);
  if (/^A[TKQJ9]s$/.test(handClass) && stealSpot && seat.includes("B")) {
    return true;
  }

  if (/^(AA|KK|QQ|JJ|TT)$/.test(handClass)) {
    return true;
  }

  return stealSpot && strength >= 76 && /s$/.test(handClass);
}

function shouldCallPreflopCombo(handClass, scenario, seat, strength) {
  if (seat.includes("BB") && ["BTN", "SB / BTN", "CO"].includes(scenario.heroSeat)) {
    return strength >= 38 || /^[2-9][2-9]$/.test(handClass);
  }

  return false;
}

function getBestPreflopProfileByKind(profiles, kind) {
  return profiles
    .filter((profile) => profile.kind === kind)
    .sort((first, second) => second.strength - first.strength)[0] || null;
}

function getPreflopOpenResponseSeats(scenario) {
  const layout = TABLES[scenario.tableSize];
  const heroIndex = layout?.seats.findIndex((seatConfig) => seatConfig.seat === scenario.heroSeat) ?? -1;
  if (!layout || heroIndex < 0) {
    return [];
  }

  return layout.seats
    .slice(heroIndex + 1)
    .map((seatConfig) => seatConfig.seat)
    .filter((seat) => seat !== scenario.heroSeat);
}

function choosePreflopResponderSeat(seats, question, responseKind, profiles = []) {
  const matchedProfile = getBestPreflopProfileByKind(profiles, responseKind);
  if (matchedProfile) {
    return matchedProfile.seat;
  }

  const seed = hashString(`${question.runoutSeed}-${question.selected}-${responseKind}-responder`);
  return seats[seed % seats.length];
}

function getPreflopOpenAmount(option, scenario) {
  if (/^Open\s+[\d.]+x/i.test(option)) {
    return parseMultiplierAmount(option);
  }

  if (option.includes("Jam")) {
    return BIG_BLIND * 100;
  }

  return getDefaultOpenAmount(scenario);
}

function getPreflopVillainThreeBetAmount(openAmount, seat, scenario) {
  const multiplier = seat.includes("SB") || seat.includes("BB") ? 4.2 : 3.4;
  const minimum = scenario.tableSize === "hu" ? BIG_BLIND * 9 : BIG_BLIND * 8.5;
  return roundMoney(Math.max(openAmount * multiplier, minimum));
}

function getPreflopHeroFourBetAmount(openAmount, threeBetAmount) {
  return roundMoney(Math.max(threeBetAmount * 2.35, openAmount * 5.2));
}

function getAdditionalPreflopContribution(seat, totalContribution) {
  return Math.max(0, roundMoney(totalContribution - getPostedBlindForSeat(seat)));
}

function getPostedBlindForSeat(seat) {
  if (!seat) {
    return 0;
  }

  if (seat.includes("BB")) {
    return BIG_BLIND;
  }

  if (seat.includes("SB")) {
    return SMALL_BLIND;
  }

  return 0;
}

function createPreflopReraiseReturnSpot(scenario, spot, question, selectedAction) {
  if (spot.street !== "preflop") {
    return null;
  }

  const action = getActionForOption(spot, selectedAction);
  const openInfo = getOpenInfo(scenario);
  if (!openInfo || !action || action.id !== "raise" || isHeroOpenAction(action)) {
    return null;
  }

  const heroRaiseAmount = getPreflopHeroRaiseToAmount(action, scenario);
  if (!heroRaiseAmount) {
    return null;
  }

  const profile = getPreflopVillainProfileForSeat(scenario, question, openInfo.seat);
  const responseKind = getPreflopOpenerVsReraiseActionKind(scenario, openInfo.seat, profile.handClass, profile.strength, question);

  if (responseKind === "fold") {
    const response = createPreflopSeatResponse(openInfo.seat, "Folds", 0, 0, false, profile);
    return { response, preflopResponses: [response], raiseSpot: null };
  }

  if (responseKind === "call") {
    const contribution = Math.max(0, roundMoney(heroRaiseAmount - openInfo.amount));
    const response = createPreflopSeatResponse(openInfo.seat, "Calls", contribution, contribution, false, profile);
    return { response, preflopResponses: [response], raiseSpot: null };
  }

  const fourBetAmount = getPreflopVillainFourBetAmount(heroRaiseAmount, openInfo.amount, scenario);
  const response = createPreflopSeatResponse(
    openInfo.seat,
    "4-bets to",
    fourBetAmount,
    Math.max(0, roundMoney(fourBetAmount - openInfo.amount)),
    true,
    profile
  );
  const callAmount = Math.max(0, roundMoney(fourBetAmount - heroRaiseAmount));
  const fiveBetAmount = getPreflopHeroFiveBetAmount(heroRaiseAmount, fourBetAmount);
  const options = ["Fold", `Call ${formatMoney(callAmount)}`, `5-bet to ${formatMoney(fiveBetAmount)}`];
  const correctAction = getPreflopFourBetResponseAction(scenario, options);

  return {
    response,
    preflopResponses: [response],
    raiseSpot: {
      options,
      correctAction,
      callAmount,
      heroBet: getAdditionalPreflopContribution(scenario.heroSeat, heroRaiseAmount),
      raiseAmount: response.contribution,
      reRaiseAmount: Math.max(0, roundMoney(fiveBetAmount - heroRaiseAmount)),
      mixedActions: getPreflopFourBetResponseMixedActions(scenario, options, correctAction),
      response,
      preflopResponses: [response],
    },
  };
}

function getPreflopVillainProfileForSeat(scenario, question, seat) {
  const rangedCards = dealPreflopVillainHandFromStartingRange(scenario, question, seat);
  const cards = rangedCards || dealPreflopVillainHands(scenario, question, [seat])[seat] || [];
  const handClass = getHandClassFromCards(cards);
  const strength = handClass ? getHandStrength(handClass) : 0;
  return { seat, cards, handClass, strength };
}

function dealPreflopVillainHandFromStartingRange(scenario, question, seat) {
  const rangeClasses = getScenarioVillainStartingRangeClasses(scenario, seat);
  if (!rangeClasses.length) {
    return null;
  }

  const heroCards = getHeroCardsForScenario(scenario);
  const used = new Set(heroCards.map((card) => getCardKey(card.rank, card.suit.id)));
  const combos = rangeClasses.flatMap((handClass) => expandHandClassToCombos(handClass, used));
  if (!combos.length) {
    return null;
  }

  const seed = hashString(`${question.runoutSeed}-${question.selected || scenario.id}-${seat}-starting-range`);
  return seededShuffle(combos, seed)[0] || null;
}

function getScenarioVillainStartingRangeClasses(scenario, seat = getVillainSeat(scenario)) {
  if (!scenario || !seat) {
    return [];
  }

  const actor = (scenario.actors || []).find((candidate) => candidate.seat === seat);
  const openInfo = getOpenInfo(scenario);
  if (actor?.label === "Opens" || openInfo?.seat === seat) {
    return getRealisticOpeningRangeClasses(seat, scenario.tableSize);
  }

  if (actor?.label === "3-bets") {
    return getRealisticThreeBetRangeClasses(seat, scenario.tableSize, openInfo?.seat || scenario.heroSeat);
  }

  return [];
}

function getRealisticOpeningRangeClasses(seat, tableSize) {
  return getAllMatrixHandClasses().filter((handClass) => isRealisticOpeningHand(handClass, seat, tableSize));
}

function getRealisticThreeBetRangeClasses(seat, tableSize, openerSeat = "") {
  return getAllMatrixHandClasses().filter((handClass) => isRealisticThreeBetHand(handClass, seat, tableSize, openerSeat));
}

function isRealisticOpeningHand(handClass, seat, tableSize) {
  const shape = getHandShape(handClass);
  const position = getRangePosition(seat, tableSize);

  if (tableSize === "hu") {
    return getHandStrength(handClass) >= 34 && !/^([2-5][2-7]o|[2-5][2-3]s)$/.test(handClass);
  }

  if (position === "early") {
    return shape.pairValue >= (tableSize === "nine" ? 8 : 7) ||
      (shape.suited && shape.ace && shape.lowValue >= 11) ||
      (shape.suited && ["KQs", "KJs", "QJs", "JTs"].includes(handClass)) ||
      (!shape.suited && ["AKo", "AQo", "KQo"].includes(handClass));
  }

  if (position === "middle") {
    return shape.pairValue >= 6 ||
      (shape.suited && shape.ace && shape.lowValue >= 9) ||
      (shape.suited && shape.highValue >= 10 && shape.lowValue >= 9) ||
      (shape.suited && ["98s", "87s"].includes(handClass)) ||
      (!shape.suited && (["AKo", "AQo", "AJo", "KQo"].includes(handClass)));
  }

  if (position === "cutoff") {
    return shape.pairValue >= 4 ||
      (shape.suited && shape.ace) ||
      (shape.suited && shape.king && shape.lowValue >= 8) ||
      (shape.suited && shape.highValue >= 9 && shape.lowValue >= 8) ||
      (shape.suited && shape.connected && shape.lowValue >= 4) ||
      (!shape.suited && (shape.ace && shape.lowValue >= 10 || shape.king && shape.lowValue >= 10 || ["QJo", "QTo", "JTo"].includes(handClass)));
  }

  return shape.pairValue >= 2 ||
    (shape.suited && shape.ace) ||
    (shape.suited && shape.king && shape.lowValue >= 2) ||
    (shape.suited && shape.highValue >= 8 && shape.lowValue >= 5) ||
    (shape.suited && shape.connected && shape.lowValue >= 4) ||
    (!shape.suited && (shape.ace || shape.king && shape.lowValue >= 8 || shape.highValue >= 10 && shape.lowValue >= 9));
}

function isRealisticThreeBetHand(handClass, seat, tableSize, openerSeat = "") {
  const shape = getHandShape(handClass);
  const openerPosition = getRangePosition(openerSeat, tableSize);
  const versusEarly = openerPosition === "early";

  if (shape.pairValue >= (versusEarly ? 10 : 9)) {
    return true;
  }

  if (["AKs", "AKo", "AQs"].includes(handClass)) {
    return true;
  }

  if (!versusEarly && ["AQo", "AJs", "KQs"].includes(handClass)) {
    return true;
  }

  if (!versusEarly && shape.suited && isWheelAce(handClass)) {
    return true;
  }

  return !versusEarly && getHandStrength(handClass) >= 78 && shape.suited;
}

function getHandShape(handClass) {
  const first = handClass[0];
  const second = handClass[1];
  const suitedness = handClass[2] || "";
  const firstValue = rankValue(first);
  const secondValue = rankValue(second);
  const gap = Math.abs(HAND_RANKS.indexOf(first) - HAND_RANKS.indexOf(second));

  return {
    first,
    second,
    suited: suitedness === "s",
    offsuit: suitedness === "o",
    pairValue: suitedness ? 0 : firstValue,
    highValue: Math.max(firstValue, secondValue),
    lowValue: Math.min(firstValue, secondValue),
    ace: first === "A",
    king: first === "K",
    connected: gap <= 1,
  };
}

function getRangePosition(seat, tableSize) {
  if (tableSize === "hu") return "button";
  if (["UTG", "UTG+1", "MP"].includes(seat)) return "early";
  if (["LJ", "HJ"].includes(seat)) return "middle";
  if (seat === "CO") return "cutoff";
  return "button";
}

function getPreflopHeroRaiseToAmount(action, scenario) {
  return getActionAmount(action) || parseBbAmount(action.option || "") || (action.id === "raise-big" ? BIG_BLIND * 100 : getDefaultThreeBetAmount(scenario.heroSeat, getOpenInfo(scenario)));
}

function getPreflopOpenerVsReraiseActionKind(scenario, seat, handClass, strength, question) {
  const normalized = normalizeHandClass(handClass || "22");
  const roll = getMixRoll(`${question.runoutSeed}-${seat}-${normalized}-opener-vs-reraise`);
  const premiumPairs = ["AA", "KK"];
  const strongStackOffs = ["QQ", "AKs", "AKo"];
  const calls = ["JJ", "TT", "99", "AQs", "AJs", "KQs"];

  if (premiumPairs.includes(normalized)) {
    return roll < 0.86 ? "reraise" : "call";
  }

  if (strongStackOffs.includes(normalized)) {
    return roll < 0.34 ? "reraise" : "call";
  }

  if (calls.includes(normalized) || strength >= 72) {
    return roll < 0.82 ? "call" : "reraise";
  }

  if (isWheelAce(normalized) && roll < 0.16) {
    return "reraise";
  }

  if (/^[2-9][2-9]$/.test(normalized) && strength >= 44) {
    return roll < 0.42 ? "call" : "fold";
  }

  return "fold";
}

function getPreflopVillainFourBetAmount(heroRaiseAmount, openAmount, scenario) {
  const positionMultiplier = scenario.heroSeat.includes("SB") || scenario.heroSeat.includes("BB") ? 2.45 : 2.25;
  return roundMoney(Math.max(heroRaiseAmount * positionMultiplier, openAmount * 4.6));
}

function getPreflopHeroFiveBetAmount(heroRaiseAmount, fourBetAmount) {
  const maxStack = BIG_BLIND * 100;
  return Math.min(maxStack, roundMoney(Math.max(fourBetAmount * 2.15, fourBetAmount + BIG_BLIND * 22)));
}

function getPreflopFourBetResponseAction(scenario, options) {
  const strength = getHandStrength(normalizeHandClass(scenario.heroHand));
  const [fold, call, fiveBet] = options;

  if (strength >= 90) {
    return fiveBet;
  }

  if (strength >= 78 || isWheelAce(normalizeHandClass(scenario.heroHand))) {
    return call;
  }

  return fold;
}

function getPreflopFourBetResponseMixedActions(scenario, options, correctAction) {
  const strength = getHandStrength(normalizeHandClass(scenario.heroHand));
  const [fold, call, fiveBet] = options;

  if (correctAction === fiveBet && strength < 96) {
    return [call];
  }

  if (correctAction === call && strength >= 84) {
    return [fiveBet];
  }

  if (correctAction === fold && strength >= 62) {
    return [call];
  }

  return [];
}

function createVillainRaiseSpot(scenario, spot, question, selectedAction, accepted) {
  const action = getActionForOption(spot, selectedAction);
  if (spot.street === "preflop") {
    if (!isHeroOpenAction(action)) {
      return null;
    }

    const responseKind = getPreflopOpenResponseKind(scenario, question, action, true);
    if (responseKind !== "reraise") {
      return null;
    }

    const plan = createPreflopOpenResponsePlan(scenario, question, action, "reraise");
    const response = plan.primaryResponse;
    const openAmount = plan.openAmount;
    const raiseAmount = response.amount || getPreflopVillainThreeBetAmount(openAmount, response.seat, scenario);
    const callAmount = Math.max(0, roundMoney(raiseAmount - openAmount));
    const fourBetAmount = getPreflopHeroFourBetAmount(openAmount, raiseAmount);
    const fourBetContribution = Math.max(0, roundMoney(fourBetAmount - openAmount));
    const options = ["Fold", `Call ${formatMoney(callAmount)}`, `4-bet to ${formatMoney(fourBetAmount)}`];
    const correctAction = getPreflopReRaiseResponseAction(scenario, options);

    question.preflopResponses = plan.responses;
    return {
      options,
      correctAction,
      callAmount,
      heroBet: getAdditionalPreflopContribution(scenario.heroSeat, openAmount),
      raiseAmount: response.contribution,
      reRaiseAmount: fourBetContribution,
      mixedActions: getPreflopReRaiseMixedActions(scenario, options, correctAction),
      response,
      preflopResponses: plan.responses,
    };
  }

  if (!action || !["bet-small", "bet-big"].includes(action.id)) {
    return null;
  }

  const frequency = getVillainRaiseFrequency(action, spot, accepted);
  const roll = getMixRoll(`${question.runoutSeed}-${spot.street}-${selectedAction}-raise`);
  if (roll >= frequency) {
    return null;
  }

  const seat = getVillainSeatForSpot(scenario, spot, question);
  const pot = spot.street === "preflop"
    ? createBettingSummary(scenario).pot
    : spot.pot || getSpotPotValue(spot) || estimateStreetPot(scenario, spot.street);
  const heroBet = getActionAmount(action) || pot * (getBetFractionFromAction(action) || 0.33);
  const raiseAmount = action.id === "bet-small"
    ? Math.max(heroBet * 3.1, pot * 1.15)
    : Math.max(heroBet * 2.4, pot * 1.75);
  const callAmount = Math.max(BIG_BLIND, raiseAmount - heroBet);
  const reRaiseAmount = Math.max(raiseAmount * 2.4, pot * 3.1);
  const options = ["Fold", `Call ${formatMoney(callAmount)}`, `Re-raise to ${formatMoney(reRaiseAmount)}`];
  const correctAction = getRaiseResponseAction(spot, options, raiseAmount, heroBet);

  return {
    options,
    correctAction,
    callAmount,
    heroBet,
    raiseAmount,
    reRaiseAmount,
    mixedActions: getRaiseResponseMixedActions(spot, options, correctAction),
    response: {
      seat,
      action: action.id === "bet-small" ? "Check-raises" : "Raises",
      contribution: raiseAmount,
      amountLabel: formatMoney(raiseAmount),
      isRaise: true,
    },
  };
}

function getVillainRaiseFrequency(action, spot, accepted) {
  const boardProfile = getBoardProfile(spot.board || []);
  let frequency = action.id === "bet-small" ? 0.2 : 0.14;

  if (boardProfile.wetness >= 7) frequency += 0.08;
  if (boardProfile.paired) frequency += 0.04;
  if (boardProfile.flushPossible && spot.street === "river") frequency += 0.05;
  if (spot.street === "river") frequency -= 0.04;
  if (!accepted) frequency += 0.14;

  return clampNumber(frequency, 0.08, 0.42);
}

function getRaiseResponseAction(spot, options, raiseAmount, heroBet) {
  const heroCards = spot.heroCards || getRepresentativeHoleCards(normalizeHandClass(spot.heroHand), spot.board || []);
  const evaluation = evaluateHoleCardsPostflop(heroCards, spot.board || []);
  const boardProfile = getBoardProfile(spot.board || []);
  const pot = spot.pot || getSpotPotValue(spot) || BIG_BLIND * 6;
  const pressure = raiseAmount / Math.max(1, pot + heroBet);
  const [fold, call, reRaise] = options;

  if (evaluation.valueClass === "nut" && evaluation.madeScore >= 86 && pressure <= 2.4) {
    return reRaise;
  }

  if (evaluation.madeScore >= 76 && (!boardProfile.flushPossible || evaluation.flush || spot.street !== "river")) {
    return pressure > 2.2 ? call : reRaise;
  }

  if (spot.street !== "river" && (evaluation.strongDraw || evaluation.nutPotential >= 68)) {
    return call;
  }

  if (evaluation.madeScore >= 56 || evaluation.showdownScore >= 48) {
    return pressure > 2.6 ? fold : call;
  }

  return fold;
}

function getPreflopReRaiseResponseAction(scenario, options) {
  const strength = getHandStrength(normalizeHandClass(scenario.heroHand));
  const [fold, call, fourBet] = options;

  if (strength >= 86) {
    return fourBet;
  }

  if (strength >= 66 || isWheelAce(normalizeHandClass(scenario.heroHand))) {
    return call;
  }

  return fold;
}

function getPreflopReRaiseMixedActions(scenario, options, correctAction) {
  const strength = getHandStrength(normalizeHandClass(scenario.heroHand));
  const [fold, call, fourBet] = options;

  if (correctAction === call && strength >= 78) {
    return [fourBet];
  }

  if (correctAction === call && strength <= 69) {
    return [fold];
  }

  if (correctAction === fold && strength >= 58) {
    return [call];
  }

  return [];
}

function createPreflopVillainReturnResponse(scenario, spot, question, raiseSpot, heroResponseOption) {
  if (spot.street !== "preflop" || !heroResponseOption?.includes("4-bet")) {
    return null;
  }

  const response = raiseSpot.response;
  const heroFourBetAmount = getActionAmount({ option: heroResponseOption }) ||
    getCurrentHighestCommitment({ hero: 0, villain: (response.amount || 0) }) + (raiseSpot.reRaiseAmount || 0);
  const villainCurrentAmount = response.amount || getCurrentHighestCommitment({ villain: response.contribution || 0 });
  const handClass = response.handClass || "";
  const strength = response.strength || getHandStrength(handClass);
  const actionKind = getPreflopVillainReturnActionKind(scenario, response.seat, handClass, strength, question);

  if (actionKind === "fold") {
    return {
      ...response,
      action: "Folds",
      amount: 0,
      amountLabel: "",
      contribution: 0,
      folded: true,
      isRaise: false,
      facingAmount: heroFourBetAmount,
    };
  }

  if (actionKind === "call") {
    const contribution = Math.max(0, roundMoney(heroFourBetAmount - villainCurrentAmount));
    return {
      ...response,
      action: "Calls",
      amount: contribution,
      amountLabel: formatMoney(contribution),
      contribution,
      folded: false,
      isRaise: false,
      callsTo: heroFourBetAmount,
    };
  }

  const fiveBetAmount = getPreflopVillainFiveBetAmount(heroFourBetAmount, scenario);
  return {
    ...response,
    action: "5-bets to",
    amount: fiveBetAmount,
    amountLabel: formatMoney(fiveBetAmount),
    contribution: Math.max(0, roundMoney(fiveBetAmount - villainCurrentAmount)),
    folded: false,
    isRaise: true,
    facingAmount: heroFourBetAmount,
  };
}

function getPreflopVillainReturnActionKind(scenario, seat, handClass, strength, question) {
  const normalized = normalizeHandClass(handClass || "22");
  const roll = getMixRoll(`${question.runoutSeed}-${seat}-${normalized}-villain-vs-fourbet`);
  const premiumPairs = ["AA", "KK"];
  const stackOffHands = ["QQ", "AKs", "AKo"];
  const continueHands = ["JJ", "TT", "AQs"];

  if (premiumPairs.includes(normalized)) {
    return roll < 0.78 ? "reraise" : "call";
  }

  if (stackOffHands.includes(normalized)) {
    return roll < 0.38 ? "reraise" : "call";
  }

  if (continueHands.includes(normalized) || strength >= 78) {
    return roll < 0.72 ? "call" : "fold";
  }

  if (isWheelAce(normalized) && ["BTN", "SB / BTN", "CO"].includes(scenario.heroSeat)) {
    return roll < 0.16 ? "reraise" : "fold";
  }

  if (/^[2-9][2-9]$/.test(normalized) && seat.includes("BB")) {
    return roll < 0.18 ? "call" : "fold";
  }

  return "fold";
}

function getPreflopVillainFiveBetAmount(heroFourBetAmount, scenario) {
  const maxStack = BIG_BLIND * 100;
  const size = roundMoney(Math.max(heroFourBetAmount * 2.15, heroFourBetAmount + BIG_BLIND * 20));
  return Math.min(maxStack, size);
}

function createPreflopFinalRaiseSpot(scenario, question, raiseSpot, villainReturnResponse) {
  const heroFourBetAmount = getActionAmount({ option: question.raiseResponse }) ||
    getCurrentHighestCommitment({ hero: 0, villain: raiseSpot.response.amount || 0 }) + (raiseSpot.reRaiseAmount || 0);
  const callAmount = Math.max(0, roundMoney((villainReturnResponse.amount || 0) - heroFourBetAmount));
  const options = ["Fold", `Call ${formatMoney(callAmount)}`];
  const correctAction = getPreflopFiveBetResponseAction(scenario, options);

  return {
    options,
    correctAction,
    callAmount,
    heroFourBetAmount,
    raiseAmount: villainReturnResponse.amount || 0,
    mixedActions: getPreflopFiveBetResponseMixedActions(scenario, options, correctAction),
    response: villainReturnResponse,
  };
}

function getPreflopFiveBetResponseAction(scenario, options) {
  const strength = getHandStrength(normalizeHandClass(scenario.heroHand));
  const [fold, call] = options;

  if (strength >= 86) {
    return call;
  }

  if (isWheelAce(normalizeHandClass(scenario.heroHand))) {
    return fold;
  }

  return strength >= 82 ? call : fold;
}

function getPreflopFiveBetResponseMixedActions(scenario, options, correctAction) {
  const strength = getHandStrength(normalizeHandClass(scenario.heroHand));
  const [fold, call] = options;

  if (correctAction === call && strength < 90) {
    return [fold];
  }

  if (correctAction === fold && strength >= 80) {
    return [call];
  }

  return [];
}

function getRaiseResponseMixedActions(spot, options, correctAction) {
  const heroCards = spot.heroCards || getRepresentativeHoleCards(normalizeHandClass(spot.heroHand), spot.board || []);
  const evaluation = evaluateHoleCardsPostflop(heroCards, spot.board || []);
  const [fold, call, reRaise] = options;

  if (correctAction === call && (evaluation.showdownScore >= 42 || evaluation.strongDraw)) {
    return [fold];
  }

  if (correctAction === reRaise && evaluation.valueClass === "nut") {
    return [call];
  }

  if (correctAction === fold && spot.street !== "river" && evaluation.drawScore >= 18) {
    return [call];
  }

  return [];
}

function createShowdownResult(scenario, spot, question) {
  if (!question.answered) {
    return null;
  }

  const pot = spot.street === "preflop"
    ? createBettingSummary(scenario).pot
    : spot.pot || getSpotPotValue(spot) || estimateStreetPot(scenario, spot.street);
  const resolvedPot = getResolvedShowdownPot(spot, question, pot);
  const selectedAction = getActionForOption(spot, question.selected);
  const accepted = question.isCorrect || question.isMixed;
  const villainSeat = getVillainSeatForSpot(scenario, spot, question);
  const reRaiseFoldRoll = getMixRoll(`${question.runoutSeed}-${spot.street}-${question.raiseResponse}-villain-reraise-fold`);
  const revealVillainCards = () => pickVillainShowdownCards(scenario, spot, question);

  if (spot.street === "preflop") {
    return createPreflopShowdownResult(scenario, spot, question, selectedAction, resolvedPot, revealVillainCards);
  }

  if (selectedAction?.id === "fold") {
    return {
      type: "fold",
      villainSeat,
      villainCards: revealVillainCards(),
      winner: villainSeat,
      potLabel: formatMoney(resolvedPot),
      text: `Hero folds. ${villainSeat} wins ${formatMoney(resolvedPot)}.`,
    };
  }

  if (question.raiseResponse?.includes("Fold")) {
    return {
      type: "fold",
      villainSeat,
      villainCards: revealVillainCards(),
      winner: villainSeat,
      potLabel: formatMoney(resolvedPot),
      text: `Hero folds. ${villainSeat} wins ${formatMoney(resolvedPot)}.`,
    };
  }

  if (question.raiseResponse?.includes("Re-raise") && reRaiseFoldRoll < 0.58) {
    return {
      type: "fold",
      villainSeat,
      villainCards: revealVillainCards(),
      winner: "Hero",
      potLabel: formatMoney(resolvedPot),
      text: `${villainSeat} folds to the re-raise. Hero wins ${formatMoney(resolvedPot)}.`,
    };
  }

  const foldFrequency = selectedAction ? getVillainFoldRevealFrequency(selectedAction, spot, question) : 0;
  const foldRoll = getMixRoll(`${question.runoutSeed}-${spot.street}-${question.selected}-villain-fold`);

  if (!question.raiseResponse && selectedAction && isAggressiveSolverAction(selectedAction) && accepted && foldRoll < foldFrequency) {
    const winPot = getHeroAggressiveFoldWinPot(spot, question, pot, selectedAction);
    return {
      type: "fold",
      villainSeat,
      villainCards: revealVillainCards(),
      winner: "Hero",
      potLabel: formatMoney(winPot),
      text: `${villainSeat} folds. Hero wins ${formatMoney(winPot)}.`,
    };
  }

  if (spot.street !== "river") {
    return null;
  }

  const villainCards = pickVillainShowdownCards(scenario, spot, question);
  const heroCards = spot.heroCards || getHeroCardsForScenario(scenario);
  const heroScore = getBestHandScore([...heroCards, ...spot.board]);
  const villainScore = getBestHandScore([...villainCards, ...spot.board]);
  const winner = heroScore > villainScore ? "Hero" : villainScore > heroScore ? villainSeat : "Split";
  const text = winner === "Split"
    ? `Split pot ${formatMoney(resolvedPot)}.`
    : `${winner} wins ${formatMoney(resolvedPot)}.`;

  return {
    type: "showdown",
    villainSeat,
    villainCards,
    heroCards,
    winner,
    potLabel: formatMoney(resolvedPot),
    text,
  };
}

function createPreflopShowdownResult(scenario, spot, question, selectedAction, resolvedPot, revealVillainCards) {
  const villainSeat = question.villainReturnResponse?.seat || question.villainResponse?.seat || getVillainSeat(scenario);
  const raiseResponse = question.raiseResponse || "";

  if (selectedAction?.id === "fold" || raiseResponse.includes("Fold") || question.finalRaiseResponse?.includes("Fold")) {
    return {
      type: "fold",
      villainSeat,
      villainCards: revealVillainCards(),
      winner: villainSeat,
      potLabel: formatMoney(resolvedPot),
      text: `Hero folds. ${villainSeat} wins ${formatMoney(resolvedPot)}.`,
    };
  }

  if (raiseResponse.includes("4-bet") && question.villainReturnResponse?.folded) {
    return {
      type: "fold",
      villainSeat,
      villainCards: revealVillainCards(),
      winner: "Hero",
      potLabel: formatMoney(resolvedPot),
      text: `${villainSeat} folds to the 4-bet. Hero wins ${formatMoney(resolvedPot)}.`,
    };
  }

  if (question.villainResponse?.folded && selectedAction && isAggressiveSolverAction(selectedAction)) {
    return {
      type: "fold",
      villainSeat,
      villainCards: revealVillainCards(),
      winner: "Hero",
      potLabel: formatMoney(resolvedPot),
      text: `${villainSeat} folds. Hero wins ${formatMoney(resolvedPot)}.`,
    };
  }

  if (isHeroOpenAction(selectedAction) && question.preflopResponses?.length && question.preflopResponses.every((response) => response.folded)) {
    return {
      type: "fold",
      villainSeat,
      villainCards: revealVillainCards(),
      winner: "Hero",
      potLabel: formatMoney(resolvedPot),
      text: `${villainSeat} folds. Hero wins ${formatMoney(resolvedPot)}.`,
    };
  }

  return null;
}

function getResolvedShowdownPot(spot, question, pot) {
  if (question?.engine === TRAINING_ENGINE_IDS.preflopRange || !Array.isArray(spot?.options)) {
    return pot;
  }

  const accepted = question.isCorrect || question.isMixed;
  const selectedAction = getActionForOption(spot, question.selected);
  if (spot.street === "preflop") {
    return getResolvedPreflopPot(spot, question, pot);
  }

  if (question.raiseSpot) {
    const heroBet = question.raiseSpot.heroBet || 0;
    const raiseAmount = question.raiseSpot.raiseAmount || 0;
    const callAmount = getRaiseResponseCallAmount(question);
    const reRaiseAmount = question.raiseSpot.reRaiseAmount || 0;

    if (!question.raiseResponse) {
      return pot + heroBet + raiseAmount;
    }

    if (question.raiseResponse?.includes("Fold")) {
      return pot + heroBet + raiseAmount;
    }

    if (question.raiseResponse?.includes("Re-raise") || question.raiseResponse?.includes("4-bet") || question.raiseResponse?.includes("5-bet") || question.raiseResponse?.includes("Jam")) {
      return pot + heroBet + raiseAmount + reRaiseAmount;
    }

    if (question.raiseResponse?.includes("Call")) {
      return pot + heroBet + raiseAmount + callAmount;
    }
  }

  if (spot.facingAction && selectedAction) {
    if (selectedAction.id === "fold") {
      return pot;
    }

    if (selectedAction.id === "call") {
      return pot + (spot.callAmount || getActionAmount(selectedAction) || 0);
    }

    if (selectedAction.id === "raise") {
      const raiseAmount = getActionAmount(selectedAction) || spot.raiseAmount || 0;
      const villainCall = question.villainResponse?.action === "Calls"
        ? Math.max(0, raiseAmount - (spot.facingAction.amount || 0))
        : 0;
      const villainReRaise = !accepted && question.villainResponse?.contribution
        ? question.villainResponse.contribution
        : 0;
      return pot + raiseAmount + villainCall + villainReRaise;
    }
  }

  if (question.selected.includes("Bet 75")) {
    const bet = pot * 0.75;
    return accepted ? pot + bet * 2 : pot + bet;
  }

  if (question.selected.includes("Bet 33")) {
    const bet = pot * 0.33;
    return accepted ? pot + bet * 2 : pot + bet;
  }

  if (!accepted && question.villainResponse?.contribution) {
    return pot + question.villainResponse.contribution;
  }

  return pot;
}

function getRaiseResponseCallAmount(question) {
  const storedCallAmount = question.raiseSpot?.callAmount || 0;
  if (storedCallAmount > 0) {
    return storedCallAmount;
  }

  if (question.raiseResponse?.includes("Call")) {
    const parsed = getActionAmount({ option: question.raiseResponse });
    if (parsed > 0) {
      return parsed;
    }
  }

  return 0;
}

function getResolvedPreflopPot(spot, question, pot) {
  const scenario = SCENARIOS_BY_ID[question.scenarioId];
  if (!scenario) {
    return pot;
  }

  return getPreflopPotFromActions(scenario, spot, question);
}

function getPreflopPotFromActions(scenario, spot, question) {
  const commitments = getInitialPreflopCommitments(scenario);
  const selectedAction = getActionForOption(spot, question.selected);
  const setCommitment = (seat, amount) => {
    if (!seat || !Number.isFinite(amount)) {
      return;
    }

    commitments[seat] = Math.max(commitments[seat] || 0, roundMoney(amount));
  };
  const openInfo = getOpenInfo(scenario);
  if (openInfo) {
    setCommitment(openInfo.seat, openInfo.amount);
    const threeBetInfo = getThreeBetInfo(scenario, openInfo);
    if (threeBetInfo) {
      setCommitment(threeBetInfo.seat, threeBetInfo.amount);
    }
  }

  if (!selectedAction || selectedAction.id === "fold") {
    return sumCommitments(commitments);
  }

  let heroOpenAmount = 0;
  if (isHeroOpenAction(selectedAction)) {
    heroOpenAmount = getPreflopOpenAmount(selectedAction.option, scenario);
    setCommitment(scenario.heroSeat, heroOpenAmount);
  } else if (selectedAction.id === "call") {
    setCommitment(scenario.heroSeat, openInfo?.amount || BIG_BLIND);
  } else if (selectedAction.id === "raise" || selectedAction.id === "raise-big") {
    const raiseTo = getActionAmount(selectedAction) || parseBbAmount(selectedAction.option) || (selectedAction.id === "raise-big" ? BIG_BLIND * 100 : 0);
    setCommitment(scenario.heroSeat, raiseTo);
  }

  (question.preflopResponses || []).forEach((response) => {
    if (response.folded) {
      return;
    }

    if (response.action === "Calls") {
      setCommitment(response.seat, heroOpenAmount || getCurrentHighestCommitment(commitments));
      return;
    }

    if (response.isRaise || response.action.includes("bet")) {
      setCommitment(response.seat, response.amount || getCurrentHighestCommitment(commitments) + (response.contribution || 0));
    }
  });

  if (question.raiseSpot && question.raiseResponse) {
    if (question.raiseResponse.includes("Call")) {
      setCommitment(scenario.heroSeat, getCurrentHighestCommitment(commitments));
    } else if (question.raiseResponse.includes("4-bet") || question.raiseResponse.includes("5-bet") || question.raiseResponse.includes("Re-raise") || question.raiseResponse.includes("Jam")) {
      setCommitment(scenario.heroSeat, getActionAmount({ option: question.raiseResponse }) || getCurrentHighestCommitment(commitments) + (question.raiseSpot.reRaiseAmount || 0));
    }
  }

  if (question.villainReturnResponse && !question.villainReturnResponse.folded) {
    if (question.villainReturnResponse.action === "Calls") {
      setCommitment(question.villainReturnResponse.seat, getCurrentHighestCommitment(commitments));
    } else if (question.villainReturnResponse.isRaise) {
      setCommitment(question.villainReturnResponse.seat, question.villainReturnResponse.amount || getCurrentHighestCommitment(commitments) + (question.villainReturnResponse.contribution || 0));
    }
  }

  if (question.finalRaiseSpot && question.finalRaiseResponse?.includes("Call")) {
    setCommitment(scenario.heroSeat, getCurrentHighestCommitment(commitments));
  }

  return sumCommitments(commitments);
}

function getInitialPreflopCommitments(scenario) {
  const layout = TABLES[scenario.tableSize];
  const commitments = {};

  (layout?.seats || []).forEach((seatConfig) => {
    const postedBlind = getPostedBlindForSeat(seatConfig.seat);
    if (postedBlind > 0) {
      commitments[seatConfig.seat] = postedBlind;
    }
  });

  if (!Object.values(commitments).some((amount) => amount === SMALL_BLIND)) {
    commitments.SB = SMALL_BLIND;
  }

  if (!Object.values(commitments).some((amount) => amount === BIG_BLIND)) {
    commitments.BB = BIG_BLIND;
  }

  return commitments;
}

function getCurrentHighestCommitment(commitments) {
  return Math.max(0, ...Object.values(commitments));
}

function sumCommitments(commitments) {
  return roundMoney(Object.values(commitments).reduce((total, amount) => total + amount, 0));
}

function isAggressiveSolverAction(action) {
  return ["bet-small", "bet-big", "raise", "raise-big"].includes(action.id);
}

function getHeroAggressiveFoldWinPot(spot, question, pot, selectedAction) {
  if (spot.facingAction && selectedAction.id === "raise") {
    return pot + (getActionAmount(selectedAction) || spot.raiseAmount || 0);
  }

  if (selectedAction.id === "bet-big") {
    return pot + pot * 0.75;
  }

  if (selectedAction.id === "bet-small") {
    return pot + pot * 0.33;
  }

  return getResolvedShowdownPot(spot, question, pot);
}

function pickVillainShowdownCards(scenario, spot, question) {
  const storedVillainCards = getStoredVillainCardsForReveal(question);
  if (storedVillainCards?.length === 2) {
    return storedVillainCards;
  }

  const heroCards = spot.heroCards || getHeroCardsForScenario(scenario);
  const used = new Set([...heroCards, ...(spot.board || [])].map((card) => getCardKey(card.rank, card.suit.id)));
  const villainRange = getVillainRangeCombos(spot, heroCards, spot.board || []);
  const availableRange = villainRange.filter((combo) => combo.every((card) => !used.has(getCardKey(card.rank, card.suit.id))));
  const seed = hashString(`${question.runoutSeed}-${spot.street}-${question.selected}-villain-hand`);
  const preferred = pickVillainComboForReveal(availableRange, spot, question, seed);

  if (preferred) {
    return preferred;
  }

  return seededShuffle(buildDeck().filter((card) => !used.has(getCardKey(card.rank, card.suit.id))), seed).slice(0, 2);
}

function getStoredVillainCardsForReveal(question) {
  const villainSeat = question.showdownResult?.villainSeat || question.villainReturnResponse?.seat || question.villainResponse?.seat;
  const response = question.villainReturnResponse?.cards?.length
    ? question.villainReturnResponse
    : question.villainResponse?.cards?.length
      ? question.villainResponse
      : question.preflopResponses?.find((item) => item.seat === villainSeat && item.cards?.length);
  return response?.cards || null;
}

function pickVillainComboForReveal(villainRange, spot, question, seed) {
  if (!villainRange.length) {
    return null;
  }

  const accepted = question.isCorrect || question.isMixed;
  const board = spot.board || [];
  const sorted = [...villainRange].sort((first, second) => {
    const firstScore = getBestHandScore([...first, ...board]);
    const secondScore = getBestHandScore([...second, ...board]);
    return firstScore - secondScore;
  });
  const randomOffset = seed % Math.max(1, Math.floor(sorted.length / 5));

  if (!accepted) {
    return sorted[Math.min(sorted.length - 1, sorted.length - 1 - randomOffset)];
  }

  const middle = Math.floor(sorted.length * 0.45);
  return sorted[Math.min(sorted.length - 1, middle + randomOffset)];
}

function getVillainFoldRevealFrequency(action, spot, question) {
  if (action.id === "check" || action.id === "call" || action.id === "fold") {
    return 0;
  }

  const solved = solvePostflopHandClass(normalizeHandClass(spot.heroHand), spot);
  const actionFrequency = getSolvedActionFrequency(solved, action.id);
  const base = action.id === "bet-big" || action.id === "raise-big" ? 0.48 : 0.32;
  const textureAdjustment = getBoardProfile(spot.board || []).wetness >= 7 ? -0.08 : 0.06;
  const mixAdjustment = actionFrequency >= 0.5 ? 0.06 : -0.05;
  const mistakeAdjustment = question.isCorrect || question.isMixed ? 0 : -0.12;
  return clampNumber(base + textureAdjustment + mixAdjustment + mistakeAdjustment, 0.12, 0.68);
}

function getVillainSeat(scenario) {
  const explicitVillain = scenario.actors?.find((actor) => actor.seat !== scenario.heroSeat);
  if (explicitVillain) {
    return explicitVillain.seat;
  }

  const layout = TABLES[scenario.tableSize];
  return getDefaultVillainSeat(scenario, layout);
}

function getVillainSeatForSpot(scenario, spot = null, question = null) {
  const liveOpponentSeats = getLiveOpponentSeatsForSpot(scenario, spot, question);
  const preferredSeat = spot?.facingAction?.seat ||
    question?.raiseSpot?.response?.seat ||
    question?.villainResponse?.seat ||
    question?.showdownResult?.villainSeat;

  if (preferredSeat && (liveOpponentSeats.includes(preferredSeat) || !liveOpponentSeats.length)) {
    return preferredSeat;
  }

  return liveOpponentSeats[0] || getVillainSeat(scenario);
}

function getLiveOpponentSeatsForSpot(scenario, spot = null, question = null) {
  if (spot?.liveOpponentSeats?.length) {
    const foldedSeats = new Set((spot.preHeroActions || []).filter((action) => action.folded).map((action) => action.seat));
    return spot.liveOpponentSeats.filter((seat) => !foldedSeats.has(seat));
  }

  return getLiveOpponentSeats(scenario, question, question?.runoutSeed || spot?.runoutSeed || scenario.id);
}

function getDefaultVillainSeat(scenario, layout) {
  if (!layout) {
    return scenario.heroSeat;
  }

  const blindDefender = layout.seats.find((seatConfig) => seatConfig.seat === "BB" && seatConfig.seat !== scenario.heroSeat);
  if (blindDefender) {
    return blindDefender.seat;
  }

  const smallBlindDefender = layout.seats.find((seatConfig) => seatConfig.seat === "SB" && seatConfig.seat !== scenario.heroSeat);
  if (smallBlindDefender) {
    return smallBlindDefender.seat;
  }

  const heroIndex = layout.seats.findIndex((seatConfig) => seatConfig.seat === scenario.heroSeat);
  if (heroIndex < 0) {
    return layout.seats[0].seat;
  }

  return layout.seats[(heroIndex + 1) % layout.seats.length].seat;
}

function getPostflopActionOrder(layout) {
  if (!layout?.seats?.length) {
    return [];
  }

  const seats = layout.seats.map((seatConfig) => seatConfig.seat);
  const firstPostflopSeat = layout.id === "hu"
    ? seats.findIndex((seat) => seat === "BB")
    : seats.findIndex((seat) => seat.includes("SB"));
  const startIndex = firstPostflopSeat >= 0 ? firstPostflopSeat : 0;
  return [...seats.slice(startIndex), ...seats.slice(0, startIndex)];
}

function createPreHeroPostflopActions(scenario, street, runoutSeed, basePot, board, liveSeatSet = null) {
  if (street === "preflop") {
    return [];
  }

  const layout = TABLES[scenario.tableSize];
  const actionOrder = getPostflopActionOrder(layout);
  const actionHeroIndex = actionOrder.indexOf(scenario.heroSeat);
  if (!layout || actionHeroIndex <= 0) {
    return [];
  }

  const liveSeats = liveSeatSet || getPostflopLiveSeatSet(scenario, layout);
  const seatsBeforeHero = actionOrder
    .slice(0, actionHeroIndex)
    .filter((seat) => seat !== scenario.heroSeat && liveSeats.has(seat));
  const actions = [];
  let currentBet = 0;

  seatsBeforeHero.forEach((seat, index) => {
    const actor = scenario.actors?.find((candidate) => candidate.seat === seat);
    const seed = `${runoutSeed}-${street}-${seat}-${index}-prehero`;

    if (currentBet <= 0) {
      if (shouldPreHeroSeatBet(scenario, actor, street, board, seed)) {
        const amount = getPreHeroBetAmount(basePot, street, board, seed);
        currentBet = amount;
        actions.push(createPreHeroAction(seat, "Bets", amount, amount, true));
        return;
      }

      actions.push(createPreHeroAction(seat, "Checks"));
      return;
    }

    const responseRoll = getMixRoll(`${seed}-response`);
    if (responseRoll < 0.1) {
      const amount = getPreHeroRaiseAmount(basePot, currentBet, seed);
      currentBet = amount;
      actions.push(createPreHeroAction(seat, "Raises", amount, amount, true));
    } else if (responseRoll < 0.74) {
      actions.push(createPreHeroAction(seat, "Calls", currentBet, currentBet));
    } else {
      actions.push(createPreHeroAction(seat, "Folds", 0, 0, false, true));
    }
  });

  return actions;
}

function createPreHeroAction(seat, action, amount = 0, contribution = 0, isAggressive = false, folded = false) {
  return {
    seat,
    action,
    amount,
    amountLabel: amount > 0 ? formatMoney(amount) : "",
    contribution,
    isAggressive,
    folded,
  };
}

function shouldPreHeroSeatBet(scenario, actor, street, board, seed) {
  const boardProfile = getBoardProfile(board);
  let frequency = street === "flop" ? 0.34 : street === "turn" ? 0.29 : 0.24;

  if (scenario.tableSize === "hu" || scenario.tableSize === "three") {
    frequency += 0.06;
  }

  if (actor?.label === "3-bets") {
    frequency += 0.09;
  } else if (actor?.label === "Opens") {
    frequency += 0.04;
  }

  if (boardProfile.wetness >= 7) {
    frequency += 0.06;
  }

  if (boardProfile.paired || boardProfile.dryness >= 7) {
    frequency -= 0.05;
  }

  return getMixRoll(seed) < clampNumber(frequency, 0.14, 0.52);
}

function getPreHeroBetAmount(basePot, street, board, seed) {
  const boardProfile = getBoardProfile(board);
  const sizeRoll = getMixRoll(`${seed}-size`);
  let fraction = sizeRoll < 0.68 ? 0.33 : 0.66;

  if (street === "river" && boardProfile.wetness >= 7) {
    fraction = sizeRoll < 0.42 ? 0.33 : 0.75;
  }

  return roundMoney(Math.max(BIG_BLIND, basePot * fraction));
}

function getPreHeroRaiseAmount(basePot, currentBet, seed) {
  const multiplier = getMixRoll(`${seed}-raise-size`) < 0.72 ? 2.8 : 3.6;
  return roundMoney(Math.max(currentBet * multiplier, basePot * 0.9));
}

function getFacingPreHeroAction(preHeroActions) {
  return [...preHeroActions].reverse().find((action) => action.isAggressive) || null;
}

function getHeroRaiseAmountFacingAction(pot, facingAction) {
  return roundMoney(Math.max(facingAction.amount * 3, pot * 0.88));
}

function formatPreHeroSeatAction(action) {
  return action.amountLabel ? `${action.action} ${action.amountLabel}` : action.action;
}

function roundMoney(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function getSpotPotValue(spot) {
  const potFact = spot.facts?.find((fact) => fact.label === "Pot");
  if (!potFact) {
    return 0;
  }

  return Number(String(potFact.value).replace(/[^0-9.]/g, "")) || 0;
}

function getBoardForStreet(scenario, street, runoutSeed = scenario.id) {
  const deck = getShuffledDeckForScenario(scenario, runoutSeed);
  const count = street === "flop" ? 3 : street === "turn" ? 4 : 5;
  return deck.slice(0, count);
}

function buildDeck() {
  return HAND_RANKS.flatMap((rank) => getSuitObjects().map((suit) => ({ rank, suit })));
}

function getShuffledDeckForScenario(scenario, runoutSeed = scenario.id) {
  const heroCards = getHeroCardsForScenario(scenario);
  const heroKeys = new Set(heroCards.map((card) => getCardKey(card.rank, card.suit.id)));
  const deck = buildDeck().filter((card) => !heroKeys.has(getCardKey(card.rank, card.suit.id)));
  return seededShuffle(deck, hashString(`${runoutSeed}-full-runout`));
}

function getHeroCardsForScenario(scenario) {
  if (Array.isArray(scenario.heroCards) && scenario.heroCards.length === 2) {
    return scenario.heroCards;
  }

  const parsed = parseHand(scenario.heroHand, scenario.id);
  return [
    { rank: parsed.left, suit: parsed.leftSuit },
    { rank: parsed.right, suit: parsed.rightSuit },
  ];
}

function getCardKey(rank, suitId) {
  return `${rank}-${suitId}`;
}

function seededShuffle(items, seed) {
  const result = [...items];
  let random = seed || 1;

  for (let index = result.length - 1; index > 0; index -= 1) {
    random = (random * 1664525 + 1013904223) >>> 0;
    const swapIndex = random % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

function formatBoard(board) {
  return board.map((card) => `${card.rank}${card.suit.symbol}`).join(" ");
}

function formatCardsForText(cards) {
  return cards.map((card) => `${card.rank}${card.suit.symbol}`).join(" ");
}

function getBoardTexture(board) {
  const uniqueSuits = new Set(board.map((card) => card.suit.id)).size;
  const rankIndexes = board.map((card) => HAND_RANKS.indexOf(card.rank)).sort((a, b) => a - b);
  const connected = rankIndexes.some((rankIndex, index) => index > 0 && rankIndex - rankIndexes[index - 1] <= 2);
  if (uniqueSuits <= 2 || connected) {
    return "dynamic";
  }
  return "dry";
}

function estimateStreetPot(scenario, street) {
  const preflopPot = createBettingSummary(scenario).pot;
  if (street === "flop") return preflopPot;
  if (street === "turn") return preflopPot * 1.66;
  return preflopPot * 2.9;
}

function getCarriedPotForStreet(scenario, street, runoutSeed, question = null) {
  if (street === "preflop") {
    return createBettingSummary(scenario).pot;
  }

  const previousStreet = getPreviousStreet(street);
  const previousQuestion = getPriorAnsweredQuestionForStreet(scenario.id, runoutSeed, previousStreet, question);
  if (!previousQuestion) {
    return estimateStreetPot(scenario, street);
  }

  return getResolvedPotForQuestion(previousQuestion);
}

function getPreviousStreet(street) {
  const index = FULL_HAND_STREETS.indexOf(street);
  return index > 0 ? FULL_HAND_STREETS[index - 1] : "preflop";
}

function getPriorAnsweredQuestionForStreet(scenarioId, runoutSeed, street, currentQuestion = null) {
  if (!activeSession) {
    return null;
  }

  return activeSession.questionStates.find((candidate) => {
    return candidate !== currentQuestion &&
      candidate.answered &&
      candidate.scenarioId === scenarioId &&
      candidate.runoutSeed === runoutSeed &&
      candidate.street === street;
  }) || null;
}

function getResolvedPotForQuestion(question) {
  const scenario = SCENARIOS_BY_ID[question.scenarioId];
  if (!scenario) {
    return SMALL_BLIND + BIG_BLIND;
  }

  const spot = getScenarioSpot(scenario, question);
  const basePot = spot.street === "preflop"
    ? createBettingSummary(scenario).pot
    : spot.pot || getSpotPotValue(spot) || estimateStreetPot(scenario, spot.street);
  return getResolvedShowdownPot(spot, question, basePot);
}

function addStreetContextToBettingLine(summary, spot, question = null) {
  if (spot.street === "preflop") {
    if (question?.raiseSpot || question?.answered) {
      return {
        ...summary,
        items: createPreflopCurrentBettingItems(summary, spot, question),
      };
    }

    return summary;
  }

  return {
    ...summary,
    items: [
      `Blinds ${formatMoney(SMALL_BLIND)} / ${formatMoney(BIG_BLIND)}`,
      `${getStreetLabel(spot.street)} ${spot.facts.find((fact) => fact.label === "Board")?.value || ""}`,
      `Pot ${spot.facts.find((fact) => fact.label === "Pot")?.value || formatMoney(summary.pot)}`,
      spot.facts.find((fact) => fact.label === "Action")?.value || "",
      spot.facts.find((fact) => fact.label === "Opponents")?.value || "",
      "Hero to act",
    ].filter(Boolean),
  };
}

function createPreflopCurrentBettingItems(summary, spot, question) {
  const scenario = SCENARIOS_BY_ID[question.scenarioId];
  const selectedAction = getActionForOption(spot, question.selected);
  const items = [`Blinds ${formatMoney(SMALL_BLIND)} / ${formatMoney(BIG_BLIND)}`];

  if (isHeroOpenAction(selectedAction)) {
    items.push(`${scenario.heroSeat} opens to ${formatMoney(getPreflopOpenAmount(selectedAction.option, scenario))}`);
  } else if (question.selected) {
    items.push(`Hero ${formatOptionLabel(question.selected).toLowerCase()}`);
  }

  const response = question.villainResponse || getPrimaryPreflopResponse(question);
  if (response) {
    items.push(`${response.seat} ${formatVillainResponseLabel(response).toLowerCase()}`);
  }

  if (question.raiseResponse) {
    items.push(`Hero ${formatOptionLabel(question.raiseResponse).toLowerCase()}`);
  }

  if (question.villainReturnResponse) {
    items.push(`${question.villainReturnResponse.seat} ${formatVillainResponseLabel(question.villainReturnResponse).toLowerCase()}`);
  }

  if (question.finalRaiseResponse) {
    items.push(`Hero ${formatOptionLabel(question.finalRaiseResponse).toLowerCase()}`);
  }

  items.push(`Pot ${getTablePotLabel(summary, spot, question)}`);
  items.push(question.answered ? "Decision complete" : "Hero to act");
  return items;
}

function renderBettingLine(summary) {
  elements.bettingLine.innerHTML = summary.items.map((item) => `<span>${item}</span>`).join("");
}

function renderTableVisual(scenario, bettingSummary = createBettingSummary(scenario), spot = getCurrentSpot(), question = getCurrentQuestion()) {
  const layout = TABLES[scenario.tableSize];
  const visualLayout = getTableVisualLayout(scenario, layout);
  const actorMap = Object.fromEntries((scenario.actors || []).map((actor) => [actor.seat, actor]));
  const seatStates = getSeatStates(scenario, layout, spot, question);
  const animationEvents = buildTableActionAnimationEvents(scenario, visualLayout, bettingSummary, spot, question, seatStates, actorMap);
  const animationKey = getTableActionAnimationKey(question, animationEvents);
  ensureTableActionRevealState(animationKey);
  const displayedSeatStates = maskSeatStatesForPendingFoldAnimations(seatStates, animationEvents);
  const board = spot?.board || [];
  const potLabel = getTablePotLabel(bettingSummary, spot, question);
  const heroCards = scenario.heroCards || spot?.heroCards || [];
  const villainResponse = question?.villainReturnResponse || question?.villainResponse || null;
  const tableState = window.FishKillerTableView.createTableSessionState({
    scenario,
    bettingSummary,
    spot,
    question,
    visualLayout,
    actorMap,
    seatStates,
    displayedSeatStates,
    board,
    potLabel,
    potBb: bettingSummary.pot || 0,
    heroCards,
    villainResponse,
  });

  window.FishKillerTableView.renderTableView(elements, tableState, {
    createBoardMarkup,
    createTablePotMarkup,
    createStageHeroCardsMarkup,
    createVillainResponseMarkup,
    createShowdownMarkup,
    createSeatHeroCardsMarkup,
    createSeatAvatarMarkup,
    createSeatChromeMarkup,
    getSeatChromeSide,
    hydrateSeatAvatarImages,
    formatVillainResponseLabel,
    animationHooks: tableAnimationHooks,
  });
  renderPixiTableScene(tableState);
  scheduleTableActionAnimations(scenario, visualLayout, bettingSummary, spot, question, seatStates, actorMap, animationEvents, animationKey);
}

function renderPixiTableScene(tableState) {
  const tableStage = elements.tableStage || elements.tableVisual?.closest(".table-stage");
  const pixiMount = elements.pixiTableScene;
  const pixiScene = window.FishKillerFk2TableScene;

  if (!tableStage || !pixiMount || !pixiScene || !ENABLE_PIXI_TABLE) {
    tableStage?.classList.remove("pixi-table-enabled");
    pixiScene?.destroyTableScene?.(pixiMount);
    return;
  }

  pixiScene.renderTableScene(pixiMount, tableState)
    .then(() => {
      tableStage.classList.add("pixi-table-enabled");
    })
    .catch((error) => {
      console.warn("Pixi table scene failed; keeping DOM table fallback.", error);
      tableStage.classList.remove("pixi-table-enabled");
      pixiScene.destroyTableScene?.(pixiMount);
    });
}

function createSeatAvatarMarkup(seat, isHero = false) {
  const avatarKind = SEAT_AVATAR_BY_SEAT[seat] || "dolphin";
  const avatarLabel = isHero ? "Hero avatar" : `${seat} avatar`;
  const avatarConfig = SEAT_AVATAR_CONFIG[avatarKind] || SEAT_AVATAR_CONFIG.dolphin;
  const cropConfig = SEAT_AVATAR_CROP_CONFIG[avatarKind] || {};
  const avatarSrc = `${avatarConfig.src}?v=${SEAT_AVATAR_ASSET_VERSION}`;
  const avatarStyle = [
    `--avatar-object-position: ${cropConfig.objectPosition || avatarConfig.objectPosition}`,
    `--avatar-scale: ${cropConfig.scale || avatarConfig.scale}`,
    `--avatar-x: ${cropConfig.x || "0%"}`,
    `--avatar-y: ${cropConfig.y || "0%"}`,
    `--avatar-left: ${avatarConfig.spriteLeft}`,
    `--avatar-top: ${avatarConfig.spriteTop}`,
  ].join("; ");
  return `
    <span class="seat-avatar seat-avatar-${avatarKind}" role="img" aria-label="${avatarLabel}" style="${avatarStyle}">
      <img class="seat-avatar-image" src="${avatarSrc}" data-fallback-src="${SEAT_AVATAR_SPRITE_SRC}" alt="" aria-hidden="true">
    </span>
  `;
}

function getSeatChromeSide(seatAnchor = "", isHero = false, seat = "") {
  if (["HJ", "CO", "BTN"].includes(seat)) {
    return "left";
  }

  if (["UTG", "SB", "BB"].includes(seat)) {
    return "right";
  }

  if (isHero) {
    return "right";
  }

  return seatAnchor.includes("right") ? "left" : "right";
}

function createSeatChromeMarkup(side = "right") {
  const normalizedSide = side === "left" ? "left" : "right";
  const shellFile = normalizedSide === "left" ? "FKFrameLeft_transparent.png" : "FKFrame_transparent.png";
  return `
    <img class="seat-shell-image" src="assets/FKSeat/${shellFile}?v=${SEAT_SHELL_ASSET_VERSION}" alt="" aria-hidden="true">
  `;
}

function hydrateSeatAvatarImages(root) {
  root.querySelectorAll(".seat-avatar-image").forEach((image) => {
    const seatAvatar = image.closest(".seat-avatar");
    const showArtwork = () => seatAvatar?.classList.add("has-avatar-art");
    const useFallbackArtwork = () => {
      const fallbackSrc = image.dataset.fallbackSrc;
      if (fallbackSrc && !image.classList.contains("uses-avatar-sheet")) {
        image.classList.add("uses-avatar-sheet");
        image.addEventListener("load", showArtwork, { once: true });
        image.addEventListener("error", () => image.remove(), { once: true });
        image.src = fallbackSrc;
        return;
      }
      image.remove();
    };

    if (image.complete) {
      if (image.naturalWidth > 0) {
        showArtwork();
      } else {
        useFallbackArtwork();
      }
      return;
    }

    image.addEventListener("load", showArtwork, { once: true });
    image.addEventListener("error", useFallbackArtwork, { once: true });
  });
}

function getTableVisualLayout(scenario, layout) {
  if (scenario?.tableSize !== "six" || !layout?.seats?.length) {
    return layout;
  }

  const heroIndex = layout.seats.findIndex((seatConfig) => seatConfig.seat === scenario.heroSeat);
  if (heroIndex < 0) {
    return layout;
  }

  const rotatedSeats = [
    ...layout.seats.slice(heroIndex),
    ...layout.seats.slice(0, heroIndex),
  ];

  return {
    ...layout,
    seats: rotatedSeats.map((seatConfig, index) => ({
      ...seatConfig,
      ...(SIX_MAX_PLAYER_VIEW_SEAT_SLOTS[index] || {}),
    })),
  };
}

function scheduleTableActionAnimations(scenario, layout, bettingSummary, spot, question, seatStates = {}, actorMap = {}, prebuiltEvents = null, prebuiltAnimationKey = "") {
  const events = prebuiltEvents || buildTableActionAnimationEvents(scenario, layout, bettingSummary, spot, question, seatStates, actorMap);
  const animationKey = prebuiltAnimationKey || getTableActionAnimationKey(question, events);

  if (!events.length || animationKey === tableActionAnimationKey) {
    return;
  }

  clearTableActionAnimations();
  tableActionAnimationKey = animationKey;
  events.forEach((event, index) => {
    tableActionAnimationTimers.push(window.setTimeout(() => {
      playTableActionAnimation(event);
    }, index * TABLE_ACTION_ANIMATION_STAGGER_MS));
  });
}

function getTableActionAnimationKey(question, events = []) {
  return [
    activeSession?.id || "idle",
    activeSession?.currentIndex ?? "none",
    question?.answered ? "answered" : "waiting",
    question?.selected || "",
    events.map((event) => `${event.seat}:${event.label}`).join("|"),
  ].join("::");
}

function ensureTableActionRevealState(animationKey) {
  if (animationKey === tableActionAnimationRevealKey) {
    return;
  }

  tableActionAnimationRevealKey = animationKey;
  tableActionAnimationRevealedFoldSeats = new Set();
}

function maskSeatStatesForPendingFoldAnimations(seatStates = {}, events = []) {
  const pendingFoldSeats = new Set(
    events
      .filter((event) => event.kind === "fold" && !tableActionAnimationRevealedFoldSeats.has(event.seat))
      .map((event) => event.seat)
  );

  if (!pendingFoldSeats.size) {
    return seatStates;
  }

  const masked = { ...seatStates };
  pendingFoldSeats.forEach((seat) => {
    masked[seat] = {
      ...(masked[seat] || {}),
      status: "action pending-fold",
      label: "To act",
      pendingFoldAnimation: true,
    };
  });
  return masked;
}

function clearTableActionAnimations() {
  tableActionAnimationTimers.forEach((timerId) => window.clearTimeout(timerId));
  tableActionAnimationTimers = [];
  elements.tableVisual.querySelectorAll(".table-action-anim").forEach((element) => element.remove());
}

function buildTableActionAnimationEvents(scenario, layout, bettingSummary, spot, question, seatStates = {}, actorMap = {}) {
  if (!activeSession || !question || (spot?.street || "preflop") !== "preflop") {
    return [];
  }

  if (question.engine === TRAINING_ENGINE_IDS.preflopRange) {
    return buildPreflopRangeTableActionAnimationEvents(scenario, layout, spot, question);
  }

  return layout.seats
    .map((seatConfig) => {
      const isHero = seatConfig.seat === scenario.heroSeat;
      const actor = actorMap[seatConfig.seat];
      const seatState = seatStates[seatConfig.seat] || {};
      const label = isHero
        ? question.answered ? getPreflopActionLabel(question.legalActions || [], question.selected) : ""
        : seatState.label || bettingSummary.actionBySeat?.[seatConfig.seat] || actor?.label || "";
      const normalizedLabel = normalizeTableActionAnimationLabel(label);
      if (!normalizedLabel) {
        return null;
      }

      return {
        seat: seatConfig.seat,
        label: normalizedLabel,
        kind: getTableActionAnimationKind(normalizedLabel),
        x: seatConfig.x,
        y: seatConfig.y,
      };
    })
    .filter(Boolean);
}

function buildPreflopRangeTableActionAnimationEvents(scenario, layout, spot, question) {
  const seatConfigBySeat = Object.fromEntries(layout.seats.map((seatConfig) => [seatConfig.seat, seatConfig]));
  const events = [];

  const pushEvent = (seat, label) => {
    const seatConfig = seatConfigBySeat[seat];
    const normalizedLabel = normalizeTableActionAnimationLabel(label);
    if (!seatConfig || !normalizedLabel) {
      return;
    }

    events.push({
      seat,
      label: normalizedLabel,
      kind: getTableActionAnimationKind(normalizedLabel),
      x: seatConfig.x,
      y: seatConfig.y,
    });
  };

  if (!question.answered) {
    (question.preflopResponses || []).forEach((response) => {
      pushEvent(response.seat, formatTablePreflopResponseAnimationLabel(response));
    });
    return events;
  }

  if (question.selected) {
    pushEvent(scenario.heroSeat, getPreflopActionLabel(question.legalActions || [], question.selected, spot));
  }

  const responseEvent = getPreflopRangePostAnswerAnimationEvent(spot, question);
  if (responseEvent) {
    pushEvent(responseEvent.seat, responseEvent.label);
  }

  return events;
}

function formatTablePreflopResponseAnimationLabel(response = {}) {
  const amount = response.amountLabel || (typeof response.amount === "number" ? `${formatBbAmount(response.amount)}bb` : "");
  return [response.action, amount].filter(Boolean).join(" ");
}

function getPreflopRangePostAnswerAnimationEvent(spot, question) {
  if (!isPreflopRangeFacingOpenSpot(spot) || question.selected !== "threeBet") {
    return null;
  }

  const openerSeat = getPreflopRangeTableSeat(spot.openerPosition || spot.villainPosition || "");
  return openerSeat ? { seat: openerSeat, label: "Folds to 3-bet" } : null;
}

function normalizeTableActionAnimationLabel(label = "") {
  const value = String(label || "").trim();
  if (!value || /^(waiting|hero|hero to act|opener|raiser|caller|3-bettor|4-bettor|in hand)$/i.test(value)) {
    return "";
  }

  return value
    .replace(/^([A-Z]{2,3}|UTG|BB|SB|HJ|CO|BTN)\s+/i, "")
    .replace(/\s+/g, " ");
}

function getTableActionAnimationKind(label = "") {
  if (/fold/i.test(label)) return "fold";
  if (/check/i.test(label)) return "check";
  return "chips";
}

function playTableActionAnimation(event) {
  if (!elements.tableVisual || !event) {
    return;
  }

  const burst = document.createElement("div");
  burst.className = `table-action-anim ${event.kind}`;
  burst.style.setProperty("--x", event.x);
  burst.style.setProperty("--y", event.y);
  if (event.kind === "fold") {
    const centerDelta = getTableCenterDeltaFromSeat(event);
    burst.style.setProperty("--fold-x", `${centerDelta.x}px`);
    burst.style.setProperty("--fold-y", `${centerDelta.y}px`);
    revealTableFoldSeat(event);
  } else if (event.kind === "chips") {
    const centerDelta = getTableCenterDeltaFromSeat(event);
    burst.style.setProperty("--chip-x", `${centerDelta.x}px`);
    burst.style.setProperty("--chip-y", `${centerDelta.y}px`);
  }
  burst.innerHTML = `
    <span>${event.seat}</span>
    <strong>${event.label}</strong>
    ${createTableActionAnimationIcon(event.kind)}
  `;
  elements.tableVisual.appendChild(burst);
  tableActionAnimationTimers.push(window.setTimeout(() => burst.remove(), TABLE_ACTION_ANIMATION_MS));
}

function revealTableFoldSeat(event) {
  if (!event?.seat || !elements.tableVisual) {
    return;
  }

  tableActionAnimationRevealedFoldSeats.add(event.seat);
  const seatNode = elements.tableVisual.querySelector(`.seat-node[data-seat="${event.seat}"]`);
  if (!seatNode) {
    return;
  }

  seatNode.classList.remove("action", "villain-recent", "pending-fold");
  seatNode.classList.add("folded");
  const captions = seatNode.querySelectorAll(".seat-caption");
  captions.forEach((caption) => {
    const captionText = caption.querySelector(".seat-caption-text");
    if (captionText) {
      captionText.textContent = event.label;
      return;
    }
    caption.textContent = event.label;
  });
}

function getTableCenterDeltaFromSeat(event) {
  const bounds = elements.tableVisual.getBoundingClientRect();
  const seatX = parseCssPercent(event.x, 50);
  const seatY = parseCssPercent(event.y, 50);
  return {
    x: ((50 - seatX) / 100) * bounds.width,
    y: ((50 - seatY) / 100) * bounds.height,
  };
}

function parseCssPercent(value, fallback) {
  const parsed = Number(String(value || "").replace("%", ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function createTableActionAnimationIcon(kind) {
  if (kind === "fold") {
    const cardStyle = getActiveCardStyleId();
    return `<i class="action-cards fold-card-style-${cardStyle}" aria-hidden="true"><b class="action-card-back"></b><b class="action-card-back"></b></i>`;
  }

  if (kind === "check") {
    return `<i class="action-check" aria-hidden="true"></i>`;
  }

  return `<i class="action-chips" aria-hidden="true"><b></b><b></b><b></b></i>`;
}

function createSeatHeroCardsMarkup(cards) {
  if (!Array.isArray(cards) || cards.length < 2) {
    return "";
  }

  return `<div class="seat-hole-cards">${cards.slice(0, 2).map((card) => createMiniCardMarkup(card)).join("")}</div>`;
}

function createStageHeroCardsMarkup(cards) {
  const cardsMarkup = createSeatHeroCardsMarkup(cards);
  return cardsMarkup ? `<div class="stage-hero-cards">${cardsMarkup}</div>` : "";
}

function createVillainResponseMarkup(response) {
  return `
    <div class="villain-action-burst">
      <span>${response.seat}</span>
      <strong>${formatVillainResponseLabel(response)}</strong>
    </div>
  `;
}

function formatVillainResponseLabel(response) {
  return [response.action, response.amountLabel].filter(Boolean).join(" ");
}

function createBoardMarkup(board, street, potLabel) {
  return `
    <div class="board-zone" aria-label="${getStreetLabel(street)} board">
      <span class="board-label">${getStreetLabel(street)}</span>
      <span class="board-pot-label">Pot ${potLabel}</span>
      <div class="board-cards">
        ${board.map((card) => `
          <div class="board-card">
            <span>${card.rank}</span>
            <span class="board-suit suit-${card.suit.id}">${card.suit.symbol}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function createTablePotMarkup(potLabel) {
  return `<div class="table-pot-badge">Pot ${potLabel}</div>`;
}

function getTablePotLabel(bettingSummary, spot, question) {
  if (question?.showdownResult?.potLabel) {
    return question.showdownResult.potLabel;
  }

  const basePot = spot?.pot || getSpotPotValue(spot || {}) || bettingSummary?.pot || (SMALL_BLIND + BIG_BLIND);
  if (question?.engine === TRAINING_ENGINE_IDS.preflopRange) {
    return formatMoney(basePot);
  }

  if (spot && question?.raiseSpot) {
    return formatMoney(getResolvedShowdownPot(spot, question, basePot));
  }

  if (spot && question?.answered) {
    return formatMoney(getResolvedShowdownPot(spot, question, basePot));
  }

  return formatMoney(basePot);
}

function createShowdownMarkup(result) {
  const villainCards = result.villainCards?.length
    ? `<div class="showdown-cards">${result.villainCards.map((card) => createMiniCardMarkup(card)).join("")}</div>`
    : "";
  const label = result.type === "fold" ? "Fold" : result.winner === "Split" ? "Showdown - Split" : `Showdown - ${result.winner}`;

  return `
    <div class="showdown-result ${result.type}">
      <span>${label}</span>
      ${villainCards}
      <strong>${result.text}</strong>
    </div>
  `;
}

function createMiniCardMarkup(card) {
  return `
    <div class="mini-card">
      <span>${card.rank}</span>
      <span class="board-suit suit-${card.suit.id}">${card.suit.symbol}</span>
    </div>
  `;
}

function createBettingSummary(scenario) {
  const actionBySeat = {};
  const openInfo = getOpenInfo(scenario);
  const threeBetInfo = getThreeBetInfo(scenario, openInfo);
  const items = [`Blinds ${formatMoney(SMALL_BLIND)} / ${formatMoney(BIG_BLIND)}`];
  let pot = SMALL_BLIND + BIG_BLIND;

  if (!openInfo) {
    items.push("No raise yet");
    items.push(`Pot ${formatMoney(pot)}`);
    items.push(`${scenario.heroSeat} to act`);
    return { pot, items, actionBySeat };
  }

  pot = getPotAfterOpen(openInfo);
  actionBySeat[openInfo.seat] = `Opens ${formatMoney(openInfo.amount)}`;
  items.push(`${openInfo.seat} opens to ${formatMoney(openInfo.amount)}`);

  if (threeBetInfo) {
    pot = getPotAfterThreeBet(openInfo, threeBetInfo, scenario);
    actionBySeat[threeBetInfo.seat] = `3-bets ${formatMoney(threeBetInfo.amount)}`;
    items.push(`${threeBetInfo.seat} 3-bets to ${formatMoney(threeBetInfo.amount)}`);
  }

  items.push(`Pot ${formatMoney(pot)}`);
  items.push(`${scenario.heroSeat} to act`);
  return { pot, items, actionBySeat };
}

function getOpenInfo(scenario) {
  const facts = scenario.facts || [];
  const options = scenario.options || [];
  const villainFact = facts.find((fact) => fact.label === "Villain" && /opens\s+[\d.]+x/i.test(fact.value));
  if (villainFact) {
    const seat = villainFact.value.replace(/\s+opens.+$/i, "");
    return { seat, amount: parseMultiplierAmount(villainFact.value) };
  }

  if (scenario.actors?.some((actor) => actor.label === "3-bets")) {
    return { seat: scenario.heroSeat, amount: getDefaultOpenAmount(scenario) };
  }

  const openOption = options.find((option) => /^Open\s+[\d.]+x/i.test(option));
  if (openOption) {
    return null;
  }

  return null;
}

function getThreeBetInfo(scenario, openInfo) {
  const actor = scenario.actors?.find((candidate) => candidate.label === "3-bets");
  if (!actor) {
    return null;
  }

  return { seat: actor.seat, amount: getDefaultThreeBetAmount(actor.seat, openInfo) };
}

function getDefaultOpenAmount(scenario) {
  if (scenario.tableSize === "hu") return BIG_BLIND * 2.5;
  return BIG_BLIND * 2.3;
}

function getDefaultThreeBetAmount(seat, openInfo) {
  if (seat.includes("SB")) return BIG_BLIND * 11;
  if (seat.includes("BB")) return BIG_BLIND * 10;
  return Math.max(BIG_BLIND * 9, openInfo.amount * 4);
}

function getPotAfterOpen(openInfo) {
  if (openInfo.seat.includes("SB")) {
    return openInfo.amount + BIG_BLIND;
  }

  if (openInfo.seat.includes("BB")) {
    return openInfo.amount + SMALL_BLIND;
  }

  return openInfo.amount + SMALL_BLIND + BIG_BLIND;
}

function getPotAfterThreeBet(openInfo, threeBetInfo, scenario) {
  const blindDeadMoney = scenario.tableSize === "hu" ? 0 : getDeadBlindMoney(openInfo.seat, threeBetInfo.seat);
  return openInfo.amount + threeBetInfo.amount + blindDeadMoney;
}

function getDeadBlindMoney(...activeSeats) {
  const activeText = activeSeats.join(" ");
  let deadMoney = 0;
  if (!activeText.includes("SB")) deadMoney += SMALL_BLIND;
  if (!activeText.includes("BB")) deadMoney += BIG_BLIND;
  return deadMoney;
}

function parseMultiplierAmount(text) {
  const match = text.match(/([\d.]+)x/i);
  return match ? Number(match[1]) * BIG_BLIND : BIG_BLIND * 2.3;
}

function parseBbAmount(text) {
  const match = text.match(/to\s+([\d.]+)bb/i);
  return match ? Number(match[1]) * BIG_BLIND : null;
}

function formatMoney(value) {
  const amount = Number(value) || 0;
  return amount < 0 ? `-$${Math.abs(amount).toFixed(2)}` : `$${amount.toFixed(2)}`;
}

function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

function getSeatStates(scenario, layout, spot = null, question = null) {
  const actorMap = Object.fromEntries((scenario.actors || []).map((actor) => [actor.seat, actor]));
  const heroIndex = layout.seats.findIndex((seatConfig) => seatConfig.seat === scenario.heroSeat);
  const states = {};

  if ((spot?.street || "preflop") === "preflop" && question?.preflopResponses?.length) {
    const responseBySeat = Object.fromEntries(question.preflopResponses.map((response) => [response.seat, response]));
    layout.seats.forEach((seatConfig, index) => {
      if (seatConfig.seat === scenario.heroSeat) {
        return;
      }

      const response = responseBySeat[seatConfig.seat];
      if (response) {
        const rangeSeatState = getPreflopRangeSeatState(seatConfig.seat, response, spot, question);
        if (rangeSeatState) {
          states[seatConfig.seat] = rangeSeatState;
          return;
        }

        states[seatConfig.seat] = {
          status: response.folded ? "folded" : response.isRaise ? "villain-recent" : "action",
          label: formatVillainResponseLabel(response),
        };
        return;
      }

      states[seatConfig.seat] = index < heroIndex
        ? { status: "folded", label: "Folded" }
        : { status: "waiting", label: "Waiting" };
    });
    return states;
  }

  if (spot?.street && spot.street !== "preflop") {
    const liveSeats = getPostflopLiveSeatSet(scenario, layout, question, question?.runoutSeed || spot.runoutSeed);
    const preHeroActionBySeat = Object.fromEntries((spot.preHeroActions || []).map((action) => [action.seat, action]));
    layout.seats.forEach((seatConfig) => {
      if (seatConfig.seat === scenario.heroSeat) {
        return;
      }

      const preHeroAction = preHeroActionBySeat[seatConfig.seat];
      if (preHeroAction) {
        states[seatConfig.seat] = {
          status: preHeroAction.folded ? "folded" : preHeroAction.isAggressive ? "villain-recent" : "action",
          label: formatPreHeroSeatAction(preHeroAction),
        };
        return;
      }

      states[seatConfig.seat] = liveSeats.has(seatConfig.seat)
        ? { status: "action", label: "In hand" }
        : { status: "folded", label: "Folded" };
    });
    return states;
  }

  layout.seats.forEach((seatConfig, index) => {
    if (seatConfig.seat === scenario.heroSeat || actorMap[seatConfig.seat]) {
      return;
    }

    states[seatConfig.seat] = index < heroIndex
      ? { status: "folded", label: "Folded" }
      : { status: "waiting", label: "Waiting" };
  });

  const actedSeats = (scenario.actors || []).filter((actor) => actor.seat !== scenario.heroSeat);
  if (!actedSeats.length) {
    return states;
  }

  const lastActionIndex = Math.max(
    ...actedSeats.map((actor) => layout.seats.findIndex((seatConfig) => seatConfig.seat === actor.seat))
  );

  layout.seats.forEach((seatConfig, index) => {
    if (seatConfig.seat === scenario.heroSeat || actorMap[seatConfig.seat]) {
      return;
    }

    if (lastActionIndex < heroIndex) {
      states[seatConfig.seat] = index > lastActionIndex && index < heroIndex
        ? { status: "folded", label: "Folded" }
        : states[seatConfig.seat];
      return;
    }

    if (index > lastActionIndex || index < heroIndex) {
      states[seatConfig.seat] = { status: "folded", label: "Folded" };
    }
  });

  return states;
}

function getPreflopRangeSeatState(seat, response, spot = null, question = null) {
  if (question?.engine !== TRAINING_ENGINE_IDS.preflopRange || !isPreflopRangeFacingOpenSpot(spot)) {
    return null;
  }

  const openerSeat = getPreflopRangeTableSeat(spot.openerPosition || spot.villainPosition || "");
  if (!openerSeat || seat !== openerSeat || !question.answered) {
    return null;
  }

  if (question.selected === "threeBet") {
    return { status: "folded", label: "Folds to 3-bet" };
  }

  if (question.selected === "call") {
    return { status: "action", label: "Opened - in hand" };
  }

  if (question.selected === "fold") {
    return { status: "action", label: "Opened - wins" };
  }

  return {
    status: response.folded ? "folded" : "action",
    label: formatVillainResponseLabel(response),
  };
}

function getPostflopLiveSeatSet(scenario, layout = TABLES[scenario.tableSize], question = null, runoutSeed = question?.runoutSeed || scenario.id) {
  const carriedSeats = getLiveSeatsFromPreflopState(scenario, question, runoutSeed);
  if (carriedSeats) {
    return applyPriorPostflopSeatFolds(scenario, carriedSeats, question, runoutSeed);
  }

  const liveSeats = new Set([scenario.heroSeat]);
  const opponentActors = (scenario.actors || []).filter((actor) => actor.seat !== scenario.heroSeat);

  opponentActors.forEach((actor) => liveSeats.add(actor.seat));

  if (!opponentActors.length) {
    liveSeats.add(getDefaultVillainSeat(scenario, layout));
  }

  return applyPriorPostflopSeatFolds(scenario, liveSeats, question, runoutSeed);
}

function getLiveSeatsFromPreflopState(scenario, question = null, runoutSeed = question?.runoutSeed || scenario.id) {
  const preflopQuestion = getPriorAnsweredQuestionForStreet(scenario.id, runoutSeed, "preflop", question);
  if (!preflopQuestion) {
    return null;
  }

  const liveSeats = new Set([scenario.heroSeat]);
  const livePreflopResponses = (preflopQuestion.preflopResponses || []).filter((response) => !response.folded);

  livePreflopResponses.forEach((response) => liveSeats.add(response.seat));

  if (!livePreflopResponses.length) {
    (scenario.actors || [])
      .filter((actor) => actor.seat !== scenario.heroSeat)
      .forEach((actor) => liveSeats.add(actor.seat));
  }

  return liveSeats;
}

function getLiveOpponentSeats(scenario, question = null, runoutSeed = question?.runoutSeed || scenario.id) {
  const layout = TABLES[scenario.tableSize];
  return [...getPostflopLiveSeatSet(scenario, layout, question, runoutSeed)].filter((seat) => seat !== scenario.heroSeat);
}

function applyPriorPostflopSeatFolds(scenario, liveSeats, question = null, runoutSeed = question?.runoutSeed || scenario.id) {
  if (!activeSession || !question?.street || question.street === "preflop") {
    return liveSeats;
  }

  const currentStreetIndex = FULL_HAND_STREETS.indexOf(question.street);
  if (currentStreetIndex <= FULL_HAND_STREETS.indexOf("flop")) {
    return liveSeats;
  }

  const result = new Set(liveSeats);
  activeSession.questionStates.forEach((candidate) => {
    const candidateStreetIndex = FULL_HAND_STREETS.indexOf(candidate.street);
    if (
      candidate === question ||
      !candidate.answered ||
      candidate.scenarioId !== scenario.id ||
      candidate.runoutSeed !== runoutSeed ||
      candidateStreetIndex <= FULL_HAND_STREETS.indexOf("preflop") ||
      candidateStreetIndex >= currentStreetIndex
    ) {
      return;
    }

    (candidate.preHeroActions || []).forEach((action) => {
      if (action.folded) {
        result.delete(action.seat);
      }
    });

    if (candidate.villainResponse?.folded || candidate.villainResponse?.action === "Folds") {
      result.delete(candidate.villainResponse.seat);
    }

    if (candidate.showdownResult?.type === "fold" && candidate.showdownResult.winner === "Hero") {
      result.delete(candidate.showdownResult.villainSeat);
    }
  });

  result.add(scenario.heroSeat);
  return result;
}

function getLiveOpponentSeatsAfterPreHero(scenario, preHeroActions = [], liveSeatSet = null) {
  const foldedSeats = new Set(preHeroActions.filter((action) => action.folded).map((action) => action.seat));
  const liveOpponents = liveSeatSet
    ? [...liveSeatSet].filter((seat) => seat !== scenario.heroSeat)
    : getLiveOpponentSeats(scenario);
  return liveOpponents.filter((seat) => !foldedSeats.has(seat));
}

function renderAnswers(spot, question) {
  elements.answerGrid.innerHTML = "";
  const review = question.decisionReview;
  const showFinalRaiseResponseOptions = shouldShowFinalRaiseResponseOptions(question);
  const showRaiseResponseOptions = shouldShowRaiseResponseOptions(question);
  const options = review
    ? getDecisionReviewOptions(question, review)
    : showFinalRaiseResponseOptions
    ? question.finalRaiseSpot.options
    : showRaiseResponseOptions
    ? question.raiseSpot.options
    : question.optionOrder;
  const correctAction = review
    ? review.correctAction
    : showFinalRaiseResponseOptions
    ? question.finalRaiseSpot.correctAction
    : showRaiseResponseOptions
    ? question.raiseSpot.correctAction
    : spot.correctAction;
  const selectedAction = review
    ? review.selectedAction
    : showFinalRaiseResponseOptions
    ? question.finalRaiseResponse
    : showRaiseResponseOptions
    ? question.raiseResponse
    : question.selected;

  options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";

    if (question.answered || review) {
      if (option === correctAction) {
        button.classList.add("correct");
      } else if (option === selectedAction && (question.isMixed || review?.isMixed)) {
        button.classList.add("mixed");
      } else if (option === selectedAction) {
        button.classList.add("wrong");
      } else {
        button.classList.add("locked");
      }
    }

    button.disabled = question.answered || Boolean(review);
    button.innerHTML = `<strong>${formatOptionLabel(option)}</strong><span>${getOptionHint(option)}</span>`;
    button.addEventListener("click", () => answerCurrentQuestion(option));
    elements.answerGrid.appendChild(button);
  });
}

function getDecisionReviewOptions(question, review) {
  if (review.stage === "raise") {
    return question.raiseSpot?.options || [];
  }

  if (review.stage === "final") {
    return question.finalRaiseSpot?.options || [];
  }

  return question.optionOrder || [];
}

function getDecisionReviewSpot(spot, question, review = question?.decisionReview) {
  if (!review) {
    return spot;
  }

  if (review.stage === "raise" && question.raiseSpot) {
    return {
      ...spot,
      options: question.raiseSpot.options,
      correctAction: question.raiseSpot.correctAction,
      callAmount: question.raiseSpot.callAmount || 0,
      raiseAmount: question.raiseSpot.reRaiseAmount || 0,
    };
  }

  if (review.stage === "final" && question.finalRaiseSpot) {
    return {
      ...spot,
      options: question.finalRaiseSpot.options,
      correctAction: question.finalRaiseSpot.correctAction,
      callAmount: question.finalRaiseSpot.callAmount || 0,
      raiseAmount: question.finalRaiseSpot.raiseAmount || 0,
    };
  }

  return spot;
}

function syncQuestionOptionOrder(question, spot) {
  if (question.answered || question.decisionReview || question.awaitingRaiseResponse || question.awaitingFinalRaiseResponse || arraysEqual(question.optionOrder, spot.options)) {
    return;
  }

  const currentActions = getMatrixActionSet(spot);
  const currentById = new Map(currentActions.map((action) => [action.id, action.option]));
  const previousActions = getMatrixActionSet({ options: question.optionOrder });
  const reordered = previousActions.map((action) => currentById.get(action.id)).filter(Boolean);

  if (reordered.length === spot.options.length && new Set(reordered).size === spot.options.length) {
    question.optionOrder = reordered;
    return;
  }

  question.optionOrder = shuffleArray([...spot.options]);
}

function arraysEqual(first, second) {
  return first.length === second.length && first.every((item, index) => item === second[index]);
}

function shouldShowRaiseResponseOptions(question) {
  return Boolean(question.raiseSpot && (question.awaitingRaiseResponse || question.raiseResponse));
}

function shouldShowFinalRaiseResponseOptions(question) {
  return Boolean(question.finalRaiseSpot && (question.awaitingFinalRaiseResponse || question.finalRaiseResponse));
}

function renderFeedback(spot, question) {
  elements.gtoTableButton.classList.add("hidden");
  elements.gtoTableButton.textContent = "View GTO Table";

  if (question.decisionReview) {
    const review = question.decisionReview;
    if (review.isCorrect) {
      elements.feedbackBand.className = "feedback-band correct";
      elements.feedbackLabel.textContent = "Correct";
      elements.feedbackText.textContent = `${review.selectedAction} is the right decision. ${review.nextPrompt} Continue when you're ready for the next action.`;
    } else if (review.isMixed) {
      elements.feedbackBand.className = "feedback-band mixed";
      elements.feedbackLabel.textContent = "Solver mix";
      elements.feedbackText.textContent = `${review.mixInfo?.message || `${review.selectedAction} is a viable mix.`} ${review.nextPrompt} Continue when you're ready for the next action.`;
    } else {
      elements.feedbackBand.className = "feedback-band wrong";
      elements.feedbackLabel.textContent = "Correction";
      elements.feedbackText.textContent = `Best action: ${review.correctAction}. ${review.nextPrompt} Continue when you're ready for the next action.`;
      elements.gtoTableButton.classList.remove("hidden");
    }

    elements.continueButton.disabled = false;
    elements.continueButton.textContent = "Continue";
    return;
  }

  if (!question.answered) {
    if (question.awaitingFinalRaiseResponse) {
      elements.feedbackBand.className = "feedback-band mixed";
      elements.feedbackLabel.textContent = "Facing a 5-bet";
      elements.feedbackText.textContent = `${question.villainReturnResponse.seat} ${question.villainReturnResponse.action.toLowerCase()} ${question.villainReturnResponse.amountLabel}. Choose how Hero continues.`;
    } else if (question.awaitingRaiseResponse) {
      elements.feedbackBand.className = "feedback-band mixed";
      elements.feedbackLabel.textContent = "Facing a raise";
      elements.feedbackText.textContent = `${question.raiseSpot.response.seat} ${formatVillainResponseLabel(question.raiseSpot.response).toLowerCase()}. Choose how Hero continues.`;
    } else {
      elements.feedbackBand.className = "feedback-band neutral";
      elements.feedbackLabel.textContent = activeSession.mode === "main" ? "Choose your line" : "Fix the leak";
      elements.feedbackText.textContent =
        activeSession.mode === "main"
          ? "Pick the strongest baseline from the options above. You'll see the correction instantly if you miss."
          : "These are the spots you missed from the prior run. Lock in the correction before moving on.";
    }
    elements.continueButton.disabled = true;
    elements.continueButton.textContent = "Continue";
    return;
  }

  if (question.isCorrect) {
    elements.feedbackBand.className = "feedback-band correct";
    elements.feedbackLabel.textContent = "Correct";
    elements.feedbackText.textContent = question.finalRaiseResponse
      ? `${question.finalRaiseResponse} closes the 5-bet branch cleanly. ${spot.explanation}`
      : question.raiseResponse
      ? `${question.raiseResponse} handles the raise cleanly. ${spot.explanation}`
      : `${spot.correctAction} is the clean baseline here. ${spot.explanation}`;
  } else if (question.isMixed) {
    elements.feedbackBand.className = "feedback-band mixed";
    elements.feedbackLabel.textContent = "Solver mix";
    elements.feedbackText.textContent = `${question.mixInfo.message} ${spot.explanation}`;
  } else {
    elements.feedbackBand.className = "feedback-band wrong";
    elements.feedbackLabel.textContent = "Correction";
    elements.feedbackText.textContent = question.finalRaiseResponse && (question.initialIsCorrect || question.initialIsMixed) && (question.raiseResponseCorrect || question.raiseResponseMixed)
      ? `Best response: ${question.finalRaiseSpot.correctAction}. ${spot.explanation}`
      : question.raiseResponse && (question.initialIsCorrect || question.initialIsMixed)
      ? `Best response: ${question.raiseSpot.correctAction}. ${spot.explanation}`
      : `Best action: ${spot.correctAction}. ${spot.explanation}`;
    elements.gtoTableButton.classList.remove("hidden");
  }

  const lastQuestion = activeSession.currentIndex >= activeSession.questionStates.length - 1;
  const failedMain = activeSession.mode === "main" && activeSession.strikes >= 3;
  elements.continueButton.disabled = false;
  elements.continueButton.textContent = failedMain ? "End Session" : lastQuestion ? "See Summary" : getNextButtonLabel();
}

function renderLastResult() {
  const result = state.lastResult;
  elements.lastGrade.textContent = result.grade;
  elements.lastXp.textContent = formatNumber(result.xp);
  elements.lastAccuracy.textContent = `${result.accuracy}%`;
  elements.lastTable.textContent = result.tableLabel;
  elements.lastMisses.textContent = String(result.misses);
  elements.lastNote.textContent = result.note;
}

function getNextButtonLabel() {
  if (!activeSession) {
    return "Continue";
  }

  const currentQuestion = getCurrentQuestion();
  if (!currentQuestion) {
    return "Continue";
  }

  if (activeSession.trainingEngine === TRAINING_ENGINE_IDS.preflopRange) {
    return activeSession.currentIndex >= activeSession.questionStates.length - 1 ? "See Summary" : "Next Hand";
  }

  if (currentQuestion.showdownResult?.type === "fold") {
    return getNextQuestionIndexAfterCurrentFold() === -1 ? "See Summary" : "Next Hand";
  }

  const nextQuestion = activeSession.questionStates[activeSession.currentIndex + 1];
  if (!nextQuestion) {
    return "Continue";
  }

  if (nextQuestion.scenarioId !== currentQuestion.scenarioId) {
    return "Next Hand";
  }

  if (nextQuestion.street === "flop") return "See Flop";
  if (nextQuestion.street === "turn") return "See Turn";
  if (nextQuestion.street === "river") return "See River";
  return "Continue";
}

function getNextQuestionIndexAfterCurrentFold() {
  if (!activeSession) {
    return -1;
  }

  const currentQuestion = getCurrentQuestion();
  if (!currentQuestion) {
    return -1;
  }

  let nextIndex = activeSession.currentIndex + 1;
  while (nextIndex < activeSession.questionStates.length) {
    const nextQuestion = activeSession.questionStates[nextIndex];
    if (
      nextQuestion.scenarioId !== currentQuestion.scenarioId ||
      nextQuestion.runoutSeed !== currentQuestion.runoutSeed ||
      nextQuestion.street === "preflop"
    ) {
      break;
    }

    nextIndex += 1;
  }

  return nextIndex < activeSession.questionStates.length ? nextIndex : -1;
}

function openSummaryModal(summary) {
  elements.summaryModal.classList.toggle("failed", summary.outcome === "failed");
  elements.summaryModal.classList.toggle("success", summary.outcome !== "failed");
  elements.modalKicker.textContent = summary.mode === "main" ? (summary.outcome === "failed" ? "Session ended early" : "Main session cleared") : "Review round finished";
  elements.modalTitle.textContent = summary.outcome === "failed" ? "Failure review." : summary.mode === "review" ? "Review complete." : "Success review.";
  elements.modalCopy.textContent = summary.note;
  elements.modalGrade.textContent = summary.grade;
  elements.modalXp.textContent = formatNumber(summary.xp);
  elements.modalAccuracy.textContent = `${summary.accuracy}%`;
  elements.modalMisses.textContent = String(summary.misses);
  elements.modalAverageTime.textContent = formatSeconds(summary.averageAnswerMs || 0);
  elements.modalReviewList.innerHTML = createReviewListMarkup(summary.questionReview || []);

  if (summary.reviewQueue.length) {
    elements.retryMissesButton.classList.remove("hidden");
    elements.retryMissesButton.textContent = summary.reviewType === TRAINING_ENGINE_IDS.preflopRange
      ? "Review Range Mistakes"
      : summary.mode === "review" ? "Retry Remaining Misses" : "Retry Misses";
  } else {
    elements.retryMissesButton.classList.add("hidden");
  }

  elements.summaryModal.classList.remove("hidden");
}

function closeSummaryModal() {
  elements.summaryModal.classList.add("hidden");
  elements.summaryModal.classList.remove("failed", "success");
}

function createReviewListMarkup(items) {
  if (!items.length) {
    return "";
  }

  return `
    <div class="review-list-head">
      <span>Decision Review</span>
      <span>Time</span>
    </div>
    ${items.map((item) => `
      <div class="review-row ${item.isCorrect ? "correct" : item.isMixed ? "mixed" : "wrong"}">
        <div>
          <strong>${item.index}. ${item.street} - ${item.hand}</strong>
          <span>${item.isCorrect ? "Correct" : item.isMixed ? `Mixed line: picked ${item.selected}; preferred ${item.correctAction}` : `Picked ${item.selected}; best ${item.correctAction}`}</span>
        </div>
        <em>${formatSeconds(item.answerMs)}</em>
      </div>
    `).join("")}
  `;
}

function openGtoModal() {
  if (activeSession?.trainingEngine === TRAINING_ENGINE_IDS.preflopRange) {
    openPreflopRangeModal();
    return;
  }

  const question = getCurrentQuestion();
  const scenario = getCurrentScenario();
  const baseSpot = getCurrentSpot();
  const spot = question?.decisionReview ? getDecisionReviewSpot(baseSpot, question) : baseSpot;
  const review = question?.decisionReview;
  const hasWrongDecision = review ? !review.isCorrect && !review.isMixed : question && !question.isCorrect;
  if (!question || !scenario || !spot || (!question.answered && !review) || !hasWrongDecision) {
    return;
  }

  if (spot.street !== "preflop" && !POSTFLOP_SOLVER_ENABLED) {
    showToast("Postflop paused", "Postflop GTO tables are commented out while we rebuild the UI.");
    return;
  }

  const bettingSummary = createBettingSummary(scenario);
  elements.gtoMatrix.classList.remove("preflop-range-matrix");
  elements.gtoKicker.textContent = `${TABLES[scenario.tableSize].label} - ${scenario.pack}`;
  elements.gtoTitle.textContent = `${scenario.heroSeat} ${getStreetLabel(spot.street)} matrix`;
  elements.gtoCopy.textContent = `${formatHandForDisplay(scenario.heroHand)} in a ${getSpotPotLabel(spot, bettingSummary)} pot. Imported solved packs are used first when they match; otherwise FishSolver samples equity, estimates EV, and marks value, blocker bluffs, traps, and mixed-frequency hands.`;
  elements.gtoLegend.innerHTML = createGtoLegend(spot);
  elements.gtoMatrix.innerHTML = createGtoMatrix(scenario, spot);
  elements.gtoModal.classList.remove("hidden");
}

function openPreflopRangeModal() {
  const question = getCurrentQuestion();
  const spot = getPreflopRangeSpot(question?.spotId) || getActivePreflopRangeSpot();
  elements.gtoKicker.textContent = "6-Max Preflop Range";
  elements.gtoTitle.textContent = `${formatPreflopSpotLabel(spot)} range`;
  elements.gtoCopy.textContent = `${formatPreflopRangeSpotTitle(spot)} - ${getPreflopRangeOpenLabel(spot)}. Internal baseline range, not a universal GTO claim.`;
  elements.gtoLegend.innerHTML = createPreflopRangeLegend(spot);

  try {
    if (!window.FishKillerPreflopEngine || !spot) {
      throw new Error("Preflop range data is not loaded.");
    }

    const matrix = window.FishKillerPreflopEngine.buildPreflopRangeMatrix(spot);
    elements.gtoMatrix.classList.add("preflop-range-matrix");
    elements.gtoMatrix.innerHTML = createPreflopRangeMatrix(matrix, question?.handClass || "", spot);
  } catch (error) {
    console.warn("Failed to render preflop range matrix", error);
    elements.gtoMatrix.classList.remove("preflop-range-matrix");
    elements.gtoMatrix.innerHTML = `<div class="gto-empty-state">Range matrix is unavailable right now. The trainer can still continue.</div>`;
  }

  elements.gtoModal.classList.remove("hidden");
}

function closeGtoModal() {
  elements.gtoModal.classList.add("hidden");
  elements.gtoMatrix.classList.remove("preflop-range-matrix");
}

function createPreflopRangeLegend(spot) {
  const legalActionIds = new Set((spot?.legalActions || []).map((action) => action.id));
  const actionLegend = ["fold", "check", "limp", "call", "raise", "isoRaise", "threeBet", "squeeze", "fourBet", "fiveBetJam"]
    .filter((actionId) => legalActionIds.has(actionId))
    .map((actionId) => `<span class="${getPreflopLegendClass(actionId)}">${getPreflopActionLabel(spot.legalActions, actionId)}</span>`);
  return [
    ...actionLegend,
    `<span class="legend-mix">Mixed</span>`,
    `<span class="legend-hero">Current hand</span>`,
  ].join("");
}

function createPreflopRangeMatrix(matrix, heroHandClass, spot = null) {
  const normalizedHeroHand = heroHandClass ? normalizeHandClass(heroHandClass) : "";
  return matrix.cells.map((cell) => {
    const actionClass = getPreflopMatrixActionClass(cell.dominantAction);
    const mixedClass = cell.mixed ? " gto-mix" : "";
    const heroClass = cell.handClass === normalizedHeroHand ? " hero-hand" : "";
    const frequencyText = formatPreflopCellFrequencies(cell.actions, spot);
    const title = `${cell.handClass}: ${getPreflopActionLabel(spot?.legalActions || [], cell.dominantAction)}. ${frequencyText}`;
    return `
      <div class="gto-cell ${actionClass}${mixedClass}${heroClass}" title="${title}">
        <span>${cell.handClass}</span>
        <em>${formatPreflopCellCompact(cell.actions)}</em>
      </div>
    `;
  }).join("");
}

function getPreflopMatrixActionClass(actionId) {
  if (actionId === "raise" || actionId === "isoRaise") return "gto-raise";
  if (actionId === "threeBet" || actionId === "squeeze") return "gto-threebet";
  if (actionId === "fourBet" || actionId === "fiveBetJam") return "gto-threebet";
  if (actionId === "call") return "gto-call";
  if (actionId === "check" || actionId === "limp") return "gto-call";
  return "gto-fold";
}

function getPreflopLegendClass(actionId) {
  if (actionId === "raise" || actionId === "isoRaise") return "legend-raise";
  if (actionId === "threeBet" || actionId === "squeeze") return "legend-threebet";
  if (actionId === "fourBet" || actionId === "fiveBetJam") return "legend-threebet";
  if (actionId === "call") return "legend-call";
  if (actionId === "check" || actionId === "limp") return "legend-call";
  return "legend-fold";
}

function formatPreflopCellFrequencies(actions = {}, spot = preflopRangeSpot) {
  return Object.entries(actions)
    .map(([actionId, frequency]) => `${getPreflopActionLabel(spot?.legalActions || [], actionId)} ${formatPercent(frequency)}`)
    .join(" / ");
}

function formatPreflopCellCompact(actions = {}) {
  const labels = {
    raise: "R",
    threeBet: "3B",
    fourBet: "4B",
    fiveBetJam: "5J",
    isoRaise: "ISO",
    squeeze: "SQZ",
    call: "C",
    check: "X",
    limp: "L",
    fold: "F",
  };
  return Object.entries(actions)
    .filter(([, frequency]) => frequency > 0)
    .map(([actionId, frequency]) => `${labels[actionId] || actionId.toUpperCase()}${formatPercent(frequency)}`)
    .join(" ");
}

function createGtoLegend(spot) {
  const actionSet = getMatrixActionSet(spot);
  return [
    ...actionSet.map((action) => `<span class="legend-${action.id}">${action.label}</span>`),
    ...(spot.street !== "preflop"
      ? [
          `<span class="legend-solver">Import or FishSolver</span>`,
          `<span class="legend-bluff">Bluff candidate</span>`,
          `<span class="legend-trap">Trap / slowplay</span>`,
          `<span class="legend-mix">Mixed frequency</span>`,
        ]
      : []),
    `<span class="legend-hero">Your hand</span>`,
  ].join("");
}

function createGtoMatrix(scenario, spot = getScenarioSpot(scenario, { street: "preflop", scenarioId: scenario.id })) {
  const heroHand = normalizeHandClass(scenario.heroHand);

  return HAND_RANKS.map((rowRank, rowIndex) => {
    return HAND_RANKS.map((columnRank, columnIndex) => {
      const handClass = getMatrixHandClass(rowRank, columnRank, rowIndex, columnIndex);
      const action = classifyMatrixHand(handClass, scenario, spot);
      const isHero = handClass === heroHand;
      const tagClasses = (action.tags || []).map((tag) => `gto-${tag}`).join(" ");
      const title = `${handClass}: ${action.label}${action.note ? ` - ${action.note}` : ""}`;
      return `<div class="gto-cell gto-${action.id}${tagClasses ? ` ${tagClasses}` : ""}${isHero ? " hero-hand" : ""}" title="${title}">${handClass}</div>`;
    }).join("");
  }).join("");
}

function getMatrixHandClass(rowRank, columnRank, rowIndex, columnIndex) {
  if (rowIndex === columnIndex) {
    return `${rowRank}${columnRank}`;
  }

  return rowIndex < columnIndex ? `${rowRank}${columnRank}s` : `${columnRank}${rowRank}o`;
}

function normalizeHandClass(hand) {
  if (hand.length === 2) {
    return hand;
  }

  const [first, second, suitedness] = hand;
  const firstIndex = HAND_RANKS.indexOf(first);
  const secondIndex = HAND_RANKS.indexOf(second);
  const high = firstIndex <= secondIndex ? first : second;
  const low = firstIndex <= secondIndex ? second : first;
  return `${high}${low}${suitedness}`;
}

function getMatrixActionSet(spot) {
  return spot.options.map((option) => {
    if (option.includes("75%")) return { id: "bet-big", label: "Bet Big", option };
    if (option.includes("33%")) return { id: "bet-small", label: "Bet Small", option };
    if (option.includes("Check")) return { id: "check", label: option.includes("Showdown") ? "Check / Showdown" : "Check", option };
    if (option.includes("Call")) return { id: "call", label: "Call", option };
    if (option.includes("Fold")) return { id: "fold", label: "Fold", option };
    if (option.includes("3-bet") || option.includes("4-bet") || option.includes("5-bet")) return { id: "raise", label: option.includes("5-bet") ? "5-bet" : option.includes("4-bet") ? "4-bet" : "3-bet", option };
    if (option.includes("Raise")) return { id: "raise", label: "Raise", option };
    if (option.includes("Open")) return { id: "raise", label: "Open", option };
    if (option.includes("Jam")) return { id: "raise-big", label: "Jam", option };
    return { id: "call", label: option, option };
  });
}

function findMatrixAction(spot, preferredIds) {
  const actions = getMatrixActionSet(spot);
  return preferredIds.map((id) => actions.find((action) => action.id === id)).find(Boolean) || actions[0];
}

function withMatrixTags(action, tags = [], note = "") {
  return { ...action, tags, note };
}

function getTargetBluffShare(action) {
  if (!action) return 0.18;
  const size = getBetFractionFromAction(action);
  if (size) return size / (1 + 2 * size);
  if (action.id === "raise" || action.id === "raise-big") return 0.25;
  return 0.12;
}

function getBetFractionFromAction(action) {
  const percentMatch = action.option?.match(/(\d+)%/);
  if (percentMatch) {
    return Number(percentMatch[1]) / 100;
  }

  if (action.id === "raise-big") return 1.8;
  if (action.id === "bet-big") return 0.75;
  if (action.id === "bet-small") return 0.33;
  return 0;
}

function getMixRoll(seed) {
  return (hashString(seed) % 1000) / 1000;
}

function classifyMatrixHand(handClass, scenario, spot = getScenarioSpot(scenario, { street: "preflop", scenarioId: scenario.id })) {
  const strength = getHandStrength(handClass);
  const action = spot.correctAction;

  if (spot.street !== "preflop") {
    return classifyPostflopMatrixHand(handClass, spot);
  }

  if (scenario.generated) {
    return classifyGeneratedPreflopMatrixHand(handClass, scenario, spot);
  }

  if (action.includes("Fold")) {
    if (strength >= 78) return findMatrixAction(spot, ["raise", "raise-big", "call"]);
    if (strength >= 58) return findMatrixAction(spot, ["call", "raise"]);
    return findMatrixAction(spot, ["fold", "check"]);
  }

  if (action.includes("Call")) {
    if (strength >= 84) return findMatrixAction(spot, ["raise", "raise-big"]);
    if (strength >= 46) return findMatrixAction(spot, ["call"]);
    return findMatrixAction(spot, ["fold", "check"]);
  }

  if (action.includes("3-bet") || action.includes("4-bet") || action.includes("5-bet")) {
    if (strength >= 72 || isWheelAce(handClass)) return findMatrixAction(spot, ["raise", "raise-big"]);
    if (strength >= 50) return findMatrixAction(spot, ["call"]);
    return findMatrixAction(spot, ["fold"]);
  }

  if (action.includes("Open")) {
    const threshold = getOpenThreshold(scenario.heroSeat, scenario.tableSize);
    return strength >= threshold ? findMatrixAction(spot, ["raise"]) : findMatrixAction(spot, ["fold", "check"]);
  }

  return strength >= 55 ? findMatrixAction(spot, ["call", "check"]) : findMatrixAction(spot, ["fold", "check"]);
}

function classifyGeneratedPreflopMatrixHand(handClass, scenario, spot) {
  if (scenario.preflopKind === "vs-open") {
    const actions = getMatrixActionSet(spot);
    const threeBetAction = actions.find((candidate) => candidate.label === "3-bet") || actions.find((candidate) => candidate.id === "raise");
    const callAction = actions.find((candidate) => candidate.id === "call");
    const foldAction = actions.find((candidate) => candidate.id === "fold");

    if (isRealisticThreeBetHand(handClass, scenario.heroSeat, scenario.tableSize, scenario.openerSeat)) {
      return threeBetAction || callAction || foldAction || actions[0];
    }

    if (isRealisticCallVsOpenHand(handClass, scenario.heroSeat, scenario.openerSeat, scenario.tableSize)) {
      return callAction || foldAction || actions[0];
    }

    return foldAction || actions[0];
  }

  return isRealisticOpeningHand(handClass, scenario.heroSeat, scenario.tableSize)
    ? findMatrixAction(spot, ["raise"])
    : findMatrixAction(spot, ["fold"]);
}

function classifyPostflopMatrixHand(handClass, spot) {
  return solvePostflopHandClass(handClass, spot).action;
}

function solvePostflopHandClass(handClass, spot) {
  const cacheKey = getSolverCacheKey(handClass, spot);
  if (solverCache.has(cacheKey)) {
    return solverCache.get(cacheKey);
  }

  const importedSolution = getImportedSolverSolution(handClass, spot);
  if (importedSolution) {
    solverCache.set(cacheKey, importedSolution);
    return importedSolution;
  }

  const board = spot.board || [];
  const actions = getMatrixActionSet(spot);
  const pot = getSolverPot(spot);
  const boardProfile = getBoardProfile(board);
  const heroCards = getSolverHeroCards(handClass, spot, board);
  const evaluation = evaluateHoleCardsPostflop(heroCards, board);
  const villainRange = getVillainRangeCombos(spot, heroCards, board);
  const equity = estimateHandEquity(heroCards, board, villainRange, hashString(cacheKey), spot.street);
  const bluffScore = getBluffScore(evaluation, boardProfile, spot);
  const trapScore = getTrapScore(evaluation, boardProfile, spot);
  const rangePlan = getRangeStrategyPlan(spot, boardProfile);
  const context = { spot, board, pot, evaluation, boardProfile, heroCards, villainRange, equity, bluffScore, trapScore, rangePlan };
  const scoredActions = actions.map((action) => scoreSolverAction(action, context));
  const frequencies = getSolverFrequencies(scoredActions, pot);

  scoredActions.forEach((scored, index) => {
    scored.frequency = frequencies[index];
  });

  const ordered = [...scoredActions].sort((a, b) => {
    if (b.frequency !== a.frequency) return b.frequency - a.frequency;
    return b.ev - a.ev;
  });
  const best = ordered[0];
  const second = ordered[1] || ordered[0];
  const action = decorateSolverAction(best, second, scoredActions, context);
  const solved = {
    action,
    equity,
    actions: scoredActions,
    villainCombos: villainRange.length,
  };

  solverCache.set(cacheKey, solved);
  return solved;
}

function normalizeSolverLibrary(rawLibrary) {
  const packs = Array.isArray(rawLibrary?.packs) ? rawLibrary.packs : [];
  return {
    version: rawLibrary?.version || 1,
    packs: packs
      .filter((pack) => pack && pack.enabled !== false)
      .map((pack) => ({
        ...pack,
        spots: (Array.isArray(pack.spots) ? pack.spots : []).filter((spot) => spot && spot.enabled !== false),
      }))
      .filter((pack) => pack.spots.length),
  };
}

function getImportedSolverSolution(handClass, spot) {
  const match = findImportedSolverSpot(handClass, spot);
  if (!match) {
    return null;
  }

  const { pack, solvedSpot, entry, score } = match;
  const frequencies = normalizeImportedFrequencies(entry, solvedSpot);
  const actions = getMatrixActionSet(spot);
  const scoredActions = actions
    .map((action) => {
      const frequency = frequencies[normalizeImportedActionId(action.id)] || frequencies[action.id] || 0;
      const ev = getImportedActionEv(entry, action.id);
      return { action, frequency, ev, kind: action.id };
    })
    .filter((item) => item.frequency > 0 || Number.isFinite(item.ev));

  if (!scoredActions.length) {
    return null;
  }

  const ordered = [...scoredActions].sort((a, b) => {
    if (b.frequency !== a.frequency) return b.frequency - a.frequency;
    return (b.ev ?? -Infinity) - (a.ev ?? -Infinity);
  });
  const best = ordered[0];
  const second = ordered[1] || ordered[0];
  const importedTags = Array.isArray(entry.tags) ? entry.tags : [];
  const tags = [...new Set([...importedTags, best.frequency < 0.85 || second.frequency > 0.15 ? "mix" : ""])]
    .filter(Boolean);
  const action = withMatrixTags(
    best.action,
    tags,
    entry.note || `${pack.name || pack.id} ${solvedSpot.name || solvedSpot.id}: ${Math.round(best.frequency * 100)}% imported frequency`
  );

  action.solver = {
    source: "imported",
    packId: pack.id,
    packName: pack.name || pack.id,
    spotId: solvedSpot.id,
    matchScore: score,
    frequency: best.frequency,
    secondFrequency: second.frequency,
    ev: Number.isFinite(best.ev) ? best.ev : null,
    equity: Number.isFinite(entry.equity) ? entry.equity : null,
  };

  return {
    action,
    equity: action.solver.equity,
    actions: scoredActions,
    imported: true,
    source: action.solver,
    villainCombos: 0,
  };
}

function findImportedSolverSpot(handClass, spot) {
  let bestMatch = null;

  SOLVER_LIBRARY.packs.forEach((pack) => {
    pack.spots.forEach((solvedSpot) => {
      const entry = getImportedStrategyEntry(solvedSpot, handClass);
      if (!entry) {
        return;
      }

      const score = scoreImportedSolverSpot(solvedSpot, spot);
      if (score < 35) {
        return;
      }

      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { pack, solvedSpot, entry, score };
      }
    });
  });

  return bestMatch;
}

function getImportedStrategyEntry(solvedSpot, handClass) {
  const strategy = solvedSpot.strategy || {};
  return strategy[handClass] || strategy[normalizeHandClass(handClass)] || null;
}

function scoreImportedSolverSpot(solvedSpot, spot) {
  if (solvedSpot.street && solvedSpot.street !== spot.street) {
    return 0;
  }

  let score = 20;
  if (solvedSpot.tableSize && solvedSpot.tableSize === spot.tableSize) score += 18;
  if (solvedSpot.heroSeat && solvedSpot.heroSeat === spot.heroSeat) score += 12;
  if (solvedSpot.preflopActionIncludes && spot.preflopAction?.includes(solvedSpot.preflopActionIncludes)) score += 8;
  if (solvedSpot.potBbRange && isPotInImportedRange(spot, solvedSpot.potBbRange)) score += 8;
  if (solvedSpot.actions && importedActionsFitSpot(solvedSpot.actions, spot)) score += 8;
  score += scoreImportedBoardMatch(solvedSpot.board, spot.board || []);
  return score;
}

function isPotInImportedRange(spot, range) {
  const potBb = getSolverPot(spot) / BIG_BLIND;
  return potBb >= range[0] && potBb <= range[1];
}

function importedActionsFitSpot(importedActions, spot) {
  const spotActionIds = new Set(getMatrixActionSet(spot).map((action) => normalizeImportedActionId(action.id)));
  return importedActions.every((action) => spotActionIds.has(normalizeImportedActionId(action)));
}

function scoreImportedBoardMatch(boardSpec, board) {
  if (!boardSpec) {
    return 0;
  }

  let score = 0;
  const boardRanks = board.map((card) => card.rank).join("");
  const boardTags = getBoardMatchTags(board);

  if (boardSpec.ranks && boardSpec.ranks === boardRanks) score += 30;
  if (Array.isArray(boardSpec.exact) && boardSpec.exact.join("") === getBoardExactKey(board)) score += 40;

  const textures = Array.isArray(boardSpec.texture) ? boardSpec.texture : boardSpec.texture ? [boardSpec.texture] : [];
  textures.forEach((texture) => {
    if (boardTags.includes(texture)) {
      score += 8;
    }
  });

  return score;
}

function getBoardExactKey(board) {
  return board.map((card) => `${card.rank}${card.suit.id[0]}`).join("");
}

function getBoardMatchTags(board) {
  const profile = getBoardProfile(board);
  const texture = getBoardTexture(board);
  const suitCount = new Set(board.map((card) => card.suit.id)).size;
  return [
    texture,
    profile.monotone ? "monotone" : "",
    profile.flushPossible ? "flush" : "",
    profile.twoTone ? "two-tone" : "",
    suitCount === board.length ? "rainbow" : "",
    profile.paired ? "paired" : "unpaired",
    profile.dryness >= 6 ? "dry" : "",
    profile.wetness >= 7 ? "wet" : "",
    board.length === 3 ? "flop" : board.length === 4 ? "turn" : "river",
  ].filter(Boolean);
}

function normalizeImportedFrequencies(entry, solvedSpot) {
  const source = entry.mix || entry.frequencies || entry;
  const frequencies = {};

  Object.entries(source).forEach(([key, value]) => {
    if (typeof value !== "number") {
      return;
    }

    frequencies[normalizeImportedActionId(key)] = value;
  });

  if (entry.action && !Object.keys(frequencies).length) {
    frequencies[normalizeImportedActionId(entry.action)] = Number(entry.frequency) || 1;
  }

  const allowedIds = new Set((solvedSpot.actions || []).map(normalizeImportedActionId));
  Object.keys(frequencies).forEach((id) => {
    if (allowedIds.size && !allowedIds.has(id)) {
      delete frequencies[id];
    }
  });

  return frequencies;
}

function getImportedActionEv(entry, actionId) {
  if (typeof entry.ev === "number") {
    return entry.ev;
  }

  const evs = entry.evs || entry.ev || {};
  const value = evs[actionId] ?? evs[normalizeImportedActionId(actionId)];
  return typeof value === "number" ? value : null;
}

function normalizeImportedActionId(action) {
  const text = String(action).toLowerCase().replace(/[_\s]+/g, "-");
  if (text.includes("jam")) return "raise-big";
  if (text.includes("raise-big")) return "raise-big";
  if (text.includes("raise") || text.includes("3-bet") || text.includes("4-bet") || text.includes("5-bet")) return "raise";
  if (text.includes("75") || text.includes("big") || text.includes("large")) return "bet-big";
  if (text.includes("33") || text.includes("small") || text.includes("range")) return "bet-small";
  if (text.includes("call")) return "call";
  if (text.includes("fold")) return "fold";
  if (text.includes("check")) return "check";
  return text;
}

function getSolverCacheKey(handClass, spot) {
  return [
    handClass,
    spot.street,
    formatBoard(spot.board || []),
    (spot.heroCards || []).map((card) => getCardKey(card.rank, card.suit.id)).join(","),
    spot.options.join("|"),
    spot.pressure || "",
    spot.tableSize || "",
    spot.heroSeat || "",
    spot.preflopAction || "",
  ].join("::");
}

function getSolverPot(spot) {
  if (spot.pot) return spot.pot;
  return getSpotPotValue(spot) || BIG_BLIND * 6;
}

function getSolverHeroCards(handClass, spot, board) {
  const actualHeroHand = spot.heroHand ? normalizeHandClass(spot.heroHand) : "";
  const actualCards = Array.isArray(spot.heroCards) ? spot.heroCards : [];
  if (actualHeroHand === handClass && actualCards.length === 2) {
    return actualCards;
  }

  return getRepresentativeHoleCards(handClass, board);
}

function scoreSolverAction(action, context) {
  if (action.id === "check") {
    return { action, ev: getCheckEv(context) + getCheckStrategyAdjustment(context), kind: "check" };
  }

  if (action.id === "fold") {
    return { action, ev: 0, kind: "fold" };
  }

  if (action.id === "call") {
    return { action, ev: getCallEv(action, context), kind: "call" };
  }

  return { action, ev: getBetEv(action, context), kind: "bet" };
}

function getCheckStrategyAdjustment({ pot, evaluation, boardProfile, spot, trapScore, rangePlan }) {
  let adjustment = rangePlan?.check || 0;

  if (trapScore >= 70 && boardProfile.dryness >= 6) {
    adjustment += pot * 0.28;
  }

  if (spot.street === "river" && boardProfile.flushPossible && boardProfile.broadwayDensity >= 3 && evaluation.flush && evaluation.primarySuitBlocker) {
    adjustment += pot * 0.18;
  }

  return adjustment;
}

function getCheckEv({ spot, pot, equity, evaluation, boardProfile }) {
  if (spot.street === "river") {
    return equity * pot;
  }

  return equity * pot * getEquityRealization(evaluation, boardProfile, spot);
}

function getCallEv(action, { pot, equity }) {
  const callAmount = getActionAmount(action) || pot * 0.5;
  return equity * (pot + callAmount) - (1 - equity) * callAmount;
}

function getBetEv(action, context) {
  const { pot, equity, evaluation, boardProfile, spot, heroCards, board, villainRange, rangePlan } = context;
  const betAmount = getActionAmount(action) || pot * (getBetFractionFromAction(action) || 0.5);
  const sizeFraction = betAmount / Math.max(0.01, pot);
  const continuingRange = getVillainContinuingRange(action, context);
  const rangeFoldFrequency = villainRange.length ? 1 - continuingRange.length / villainRange.length : 0.42;
  const heuristicFoldFrequency = getOpponentFoldFrequency(action, context);
  const foldFrequency = clampNumber(rangeFoldFrequency * 0.72 + heuristicFoldFrequency * 0.28, 0.06, action.id === "raise-big" ? 0.86 : 0.74);
  const calledEquity = continuingRange.length
    ? estimateHandEquity(
        heroCards,
        board,
        continuingRange,
        hashString(`${spot.street}-${formatBoard(board)}-${action.id}-${heroCards.map((card) => getCardKey(card.rank, card.suit.id)).join("")}`),
        spot.street
      )
    : getCalledEquity(equity, sizeFraction, evaluation, spot);
  const calledEv = calledEquity * (pot + betAmount) - (1 - calledEquity) * betAmount;
  const raiseRisk =
    spot.street === "river"
      ? 0
      : pot *
        clampNumber(
          0.02 + boardProfile.wetness * 0.006 + (evaluation.valueClass === "air" ? 0.025 : 0) - (evaluation.strongDraw ? 0.02 : 0),
          0,
          0.13
        );
  const showdownTax =
    evaluation.madeScore >= 34 && evaluation.madeScore < 62
      ? pot * (sizeFraction >= 0.7 ? 0.12 : 0.045)
      : 0;
  const rangeShapeAdjustment = getRangeShapeAdjustment(action, context, foldFrequency, calledEquity);

  return foldFrequency * pot + (1 - foldFrequency) * calledEv - raiseRisk - showdownTax + rangeShapeAdjustment + (rangePlan[action.id] || 0);
}

function getRangeStrategyPlan(spot, boardProfile) {
  const pot = getSolverPot(spot);
  const flop = spot.street === "flop";
  const turnOrRiver = spot.street === "turn" || spot.street === "river";
  const dryStatic = boardProfile.dryness >= 6 || boardProfile.paired;
  const wetDynamic = boardProfile.wetness >= 7;

  const plan = {
    check: 0,
    call: 0,
    fold: 0,
    "bet-small": 0,
    "bet-big": 0,
    raise: 0,
    "raise-big": -pot * 0.9,
  };

  if (flop && dryStatic) {
    plan["bet-small"] += pot * 0.12;
    plan.check += pot * 0.05;
    plan["bet-big"] -= pot * 0.24;
  }

  if (flop && boardProfile.monotone) {
    plan.check += pot * 0.08;
    plan["bet-small"] += pot * 0.05;
    plan["bet-big"] -= pot * 0.22;
  }

  if (wetDynamic) {
    plan["bet-big"] += turnOrRiver ? pot * 0.12 : pot * 0.04;
    plan["bet-small"] -= pot * 0.04;
  }

  if (turnOrRiver && !boardProfile.monotone) {
    plan["bet-big"] += pot * 0.07;
  }

  if (spot.street === "river" && boardProfile.flushPossible && boardProfile.broadwayDensity >= 3) {
    plan.check += pot * 0.1;
    plan["bet-small"] += pot * 0.08;
    plan["bet-big"] -= pot * 0.2;
  }

  return plan;
}

function getVillainContinuingRange(action, context) {
  const { villainRange, board, boardProfile, spot } = context;
  if (!villainRange.length || action.id === "check") {
    return villainRange;
  }

  const threshold = getContinueThreshold(action, boardProfile, spot);
  return villainRange.filter((villainCards) => {
    const evaluation = evaluateHoleCardsPostflop(villainCards, board);
    const continueScore =
      evaluation.madeScore +
      evaluation.drawScore * 0.9 +
      evaluation.blockerScore * 0.7 +
      evaluation.overcardScore * (spot.street === "flop" ? 0.45 : 0.18) +
      (evaluation.valueClass === "top-pair" ? 8 : 0) +
      (evaluation.valueClass === "nut" ? 18 : 0) +
      (evaluation.strongDraw ? 9 : 0);

    return continueScore >= threshold;
  });
}

function getContinueThreshold(action, boardProfile, spot) {
  const sizeFraction = getBetFractionFromAction(action) || 0.5;
  let threshold = 34 + sizeFraction * 32;

  if (action.id === "raise-big") threshold += 28;
  if (action.id === "bet-big") threshold += 8;
  if (action.id === "bet-small") threshold -= 8;
  if (boardProfile.dryness >= 6) threshold += action.id === "bet-big" || action.id === "raise-big" ? 8 : -4;
  if (boardProfile.wetness >= 7) threshold -= 7;
  if (boardProfile.monotone) threshold += 4;
  if (boardProfile.flushPossible && spot.street === "river") threshold += action.id === "bet-big" || action.id === "raise-big" ? 13 : 5;
  if (boardProfile.broadwayDensity >= 3 && spot.street === "river") threshold += action.id === "bet-big" || action.id === "raise-big" ? 8 : 2;
  if (boardProfile.paired) threshold += 3;
  if (spot.street === "river") threshold += 6;

  return clampNumber(threshold, 28, 92);
}

function getRangeShapeAdjustment(action, { pot, evaluation, boardProfile, spot, trapScore, bluffScore, equity }, foldFrequency, calledEquity) {
  const sizeFraction = getBetFractionFromAction(action) || 0.5;
  let adjustment = 0;

  if (action.id === "raise-big" && spot.street !== "preflop") {
    adjustment -= pot * (0.65 + foldFrequency * 0.55);
  }

  if (action.id === "bet-big" && spot.street === "flop" && (boardProfile.dryness >= 6 || boardProfile.monotone || boardProfile.paired)) {
    adjustment -= pot * 0.18;
  }

  if ((action.id === "bet-big" || action.id === "raise-big") && evaluation.madeScore >= 78 && foldFrequency > 0.42) {
    adjustment -= pot * (foldFrequency - 0.42) * 0.95;
  }

  if (
    ["bet-small", "bet-big", "raise", "raise-big"].includes(action.id) &&
    evaluation.valueClass === "air" &&
    evaluation.drawScore < 8 &&
    evaluation.overcardScore <= 0 &&
    bluffScore < 28 &&
    equity < 0.28
  ) {
    adjustment -= pot * (action.id === "bet-big" || action.id === "raise-big" ? 0.65 : 0.12);
  }

  if (spot.street === "river" && boardProfile.flushPossible && boardProfile.broadwayDensity >= 3 && evaluation.flush && evaluation.primarySuitBlocker) {
    if (action.id === "bet-big" || action.id === "raise-big") {
      adjustment -= pot * 0.42;
    }
    if (action.id === "bet-small") {
      adjustment += pot * 0.1;
    }
  }

  if (action.id === "bet-small" && spot.street === "flop" && boardProfile.dryness >= 6 && evaluation.madeScore >= 58) {
    adjustment += pot * 0.08;
  }

  if (action.id === "bet-small" && spot.street === "flop" && evaluation.valueClass === "pocket-second-pair") {
    adjustment += pot * (boardProfile.wetness >= 7 ? 0.04 : 0.09);
  }

  if (action.id === "check" && evaluation.valueClass === "pocket-second-pair") {
    adjustment += pot * 0.06;
  }

  if (action.id === "bet-small" && trapScore >= 78 && boardProfile.dryness >= 6) {
    adjustment -= pot * 0.05;
  }

  if (action.id === "check" && trapScore >= 70 && boardProfile.dryness >= 6) {
    adjustment += pot * 0.38;
  }

  if (sizeFraction >= 1.25 && calledEquity < 0.72 && evaluation.madeScore >= 70) {
    adjustment -= pot * 0.35;
  }

  return adjustment;
}

function getEquityRealization(evaluation, boardProfile, spot) {
  if (spot.street === "river") return 1;

  const base = spot.street === "turn" ? 0.72 : 0.66;
  return clampNumber(
    base +
      evaluation.madeScore / 280 +
      evaluation.drawScore / 260 +
      evaluation.positionScore / 120 -
      boardProfile.wetness / 75 +
      (evaluation.strongDraw ? 0.05 : 0) -
      (evaluation.valueClass === "air" ? 0.04 : 0),
    0.45,
    0.98
  );
}

function getCalledEquity(equity, sizeFraction, evaluation, spot) {
  return clampNumber(
    equity -
      (sizeFraction >= 0.7 ? 0.12 : 0.07) +
      (evaluation.madeScore >= 78 ? 0.1 : evaluation.madeScore >= 62 ? 0.04 : 0) +
      (evaluation.strongDraw && spot.street !== "river" ? 0.035 : 0) -
      (evaluation.valueClass === "air" ? 0.055 : 0) -
      (evaluation.showdownScore < 28 && spot.street === "river" ? 0.04 : 0),
    0.03,
    0.96
  );
}

function getOpponentFoldFrequency(action, { spot, boardProfile, evaluation, bluffScore, trapScore }) {
  const sizeFraction = getActionAmount(action) / Math.max(0.01, getSolverPot(spot)) || getBetFractionFromAction(action) || 0.5;
  const mdfFoldTarget = sizeFraction / (1 + sizeFraction);
  let foldFrequency = mdfFoldTarget;

  foldFrequency += boardProfile.dryness >= 6 ? 0.055 : 0;
  foldFrequency -= boardProfile.wetness >= 7 ? 0.045 : 0;
  foldFrequency += evaluation.primarySuitBlocker && boardProfile.monotone ? 0.07 : 0;
  foldFrequency += evaluation.blockerScore >= 12 ? 0.035 : 0;
  foldFrequency += boardProfile.paired ? 0.025 : 0;
  foldFrequency += action.id === "bet-big" ? 0.035 : 0;
  foldFrequency += spot.street === "river" && bluffScore >= 62 ? 0.06 : 0;
  foldFrequency -= trapScore >= 72 ? 0.025 : 0;
  foldFrequency -= evaluation.valueClass === "air" && evaluation.blockerScore < 7 ? 0.04 : 0;

  return clampNumber(foldFrequency, 0.1, 0.66);
}

function getSolverFrequencies(scoredActions, pot) {
  const maxEv = Math.max(...scoredActions.map((item) => item.ev));
  const temperature = Math.max(0.24, pot * 0.055);
  const weights = scoredActions.map((item) => {
    const evGap = item.ev - maxEv;
    return Math.exp(evGap / temperature);
  });
  const total = weights.reduce((sum, weight) => sum + weight, 0) || 1;
  return weights.map((weight) => weight / total);
}

function decorateSolverAction(best, second, scoredActions, context) {
  const tags = getSolverTags(best, second, context);
  const note = getSolverNote(best, second, scoredActions, context);
  const action = withMatrixTags(best.action, tags, note);
  action.solver = {
    equity: context.equity,
    ev: best.ev,
    frequency: best.frequency,
    secondFrequency: second.frequency,
  };
  return action;
}

function getSolverTags(best, second, { evaluation, equity, bluffScore, trapScore, pot }) {
  const tags = [];
  const isAggressive = ["bet-small", "bet-big", "raise", "raise-big"].includes(best.action.id);
  const isMixed = best.frequency < 0.72 || second.frequency > 0.22 || Math.abs(best.ev - second.ev) < pot * 0.08;
  const valueBet =
    evaluation.madeScore >= 62 ||
    ["nut", "strong", "overpair"].includes(evaluation.valueClass) ||
    (evaluation.valueClass === "top-pair" && equity >= 0.55);

  if (isAggressive && valueBet) {
    tags.push("value");
  }

  if (isAggressive && evaluation.madeScore < 58 && bluffScore >= 42) {
    tags.push("bluff");
  }

  if (best.action.id === "check" && trapScore >= 66 && evaluation.madeScore >= 70) {
    tags.push("trap");
  }

  if (isMixed) {
    tags.push("mix");
  }

  return [...new Set(tags)];
}

function getSolverNote(best, second, scoredActions, { equity, evaluation, bluffScore, trapScore }) {
  const frequency = Math.round(best.frequency * 100);
  const equityPercent = Math.round(equity * 100);
  const secondText = second && second.action !== best.action ? `; next ${second.action.label} ${Math.round(second.frequency * 100)}%` : "";
  let reason = "highest local EV";

  if (best.action.id === "check" && trapScore >= 66 && evaluation.madeScore >= 70) {
    reason = "trap/protected check";
  } else if (best.action.id === "check" && isShowdownMadeClass(evaluation.valueClass)) {
    reason = "showdown-value check";
  } else if (["bet-small", "bet-big", "raise", "raise-big"].includes(best.action.id) && evaluation.madeScore >= 58) {
    reason = "value/protection";
  } else if (["bet-small", "bet-big", "raise", "raise-big"].includes(best.action.id) && isShowdownMadeClass(evaluation.valueClass)) {
    reason = "thin value/protection";
  } else if (["bet-small", "bet-big", "raise", "raise-big"].includes(best.action.id) && bluffScore >= 42) {
    reason = "blocker or semi-bluff";
  } else if (best.action.id === "check") {
    reason = evaluation.showdownScore >= 38 ? "equity realization" : "low-EV give-up";
  }

  const evSummary = scoredActions
    .map((item) => `${item.action.label} ${formatMoney(item.ev)}`)
    .join(", ");
  return `${reason}; ${equityPercent}% equity, ${frequency}% frequency${secondText}. EVs: ${evSummary}`;
}

function isShowdownMadeClass(valueClass) {
  return [
    "pocket-second-pair",
    "pocket-pair-with-board-pair",
    "board-pair-kicker",
    "board-two-pair-kicker",
    "board-trips-kicker",
    "underpair",
    "pair",
  ].includes(valueClass);
}

function getActionAmount(action) {
  const amountMatch = action.option?.match(/\$([0-9]+(?:\.[0-9]+)?)/);
  return amountMatch ? Number(amountMatch[1]) : 0;
}

function getVillainRangeCombos(spot, heroCards, board) {
  const used = new Set([...heroCards, ...board].map((card) => getCardKey(card.rank, card.suit.id)));
  const rangeClasses = getVillainRangeClasses(spot);
  const combos = rangeClasses.flatMap((handClass) => expandHandClassToCombos(handClass, used));
  const seed = hashString(`${spot.tableSize || "table"}-${spot.preflopAction || "range"}-${formatBoard(board)}`);
  const sampled = seededShuffle(combos, seed).slice(0, SOLVER_RANGE_SAMPLE_SIZE);
  return sampled.length ? sampled : combos;
}

function getVillainRangeClasses(spot) {
  const scenario = spot?.scenarioId ? SCENARIOS_BY_ID[spot.scenarioId] : null;
  const startingRange = scenario ? getScenarioVillainStartingRangeClasses(scenario) : [];
  const candidateClasses = startingRange.length ? startingRange : getAllMatrixHandClasses();
  const threshold = getVillainRangeThreshold(spot);
  return candidateClasses
    .filter((handClass) => {
      const strength = getHandStrength(handClass);
      const suitedConnector = handClass[2] === "s" && Math.abs(HAND_RANKS.indexOf(handClass[0]) - HAND_RANKS.indexOf(handClass[1])) <= 2;
      return strength >= threshold || (isWheelAce(handClass) && threshold <= 72) || (suitedConnector && threshold <= 58 && strength >= threshold - 7);
    })
    .sort((a, b) => getHandStrength(b) - getHandStrength(a));
}

function getVillainRangeThreshold(spot) {
  const tableBase = {
    hu: 34,
    three: 40,
    six: 48,
    nine: 56,
  }[spot.tableSize] || 48;
  const action = spot.preflopAction || "";
  let threshold = tableBase;

  if (action.includes("5-bet") || action.includes("4-bet") || action.includes("Jam")) threshold = 78;
  else if (action.includes("3-bet")) threshold = 68;
  else if (action.includes("Call")) threshold = Math.max(42, tableBase - 4);
  else if (action.includes("Open")) threshold = tableBase;

  if (spot.street === "turn") threshold += 2;
  if (spot.street === "river") threshold += 4;
  return threshold;
}

function getAllMatrixHandClasses() {
  return HAND_RANKS.flatMap((rowRank, rowIndex) => {
    return HAND_RANKS.map((columnRank, columnIndex) => getMatrixHandClass(rowRank, columnRank, rowIndex, columnIndex));
  });
}

function expandHandClassToCombos(handClass, used) {
  const first = handClass[0];
  const second = handClass[1];
  const suitedness = handClass[2] || "";
  const suits = getSuitObjects();
  const combos = [];

  if (!suitedness) {
    suits.forEach((firstSuit, firstIndex) => {
      suits.slice(firstIndex + 1).forEach((secondSuit) => {
        const firstKey = getCardKey(first, firstSuit.id);
        const secondKey = getCardKey(second, secondSuit.id);
        if (!used.has(firstKey) && !used.has(secondKey)) {
          combos.push([{ rank: first, suit: firstSuit }, { rank: second, suit: secondSuit }]);
        }
      });
    });
    return combos;
  }

  suits.forEach((firstSuit) => {
    suits.forEach((secondSuit) => {
      if ((suitedness === "s") !== (firstSuit.id === secondSuit.id)) {
        return;
      }

      const firstKey = getCardKey(first, firstSuit.id);
      const secondKey = getCardKey(second, secondSuit.id);
      if (!used.has(firstKey) && !used.has(secondKey)) {
        combos.push([{ rank: first, suit: firstSuit }, { rank: second, suit: secondSuit }]);
      }
    });
  });

  return combos;
}

function estimateHandEquity(heroCards, board, villainCombos, seed, street) {
  if (!villainCombos.length) {
    return 0.5;
  }

  const neededBoardCards = Math.max(0, 5 - board.length);
  const sampleCount = neededBoardCards === 0
    ? Math.min(villainCombos.length, SOLVER_RANGE_SAMPLE_SIZE)
    : SOLVER_EQUITY_SAMPLES;
  const sampledVillains = seededShuffle(villainCombos, seed).slice(0, Math.max(1, Math.min(villainCombos.length, sampleCount)));
  let wins = 0;
  let ties = 0;
  let total = 0;

  for (let index = 0; index < sampleCount; index += 1) {
    const villainCards = sampledVillains[index % sampledVillains.length];
    const used = new Set([...heroCards, ...board, ...villainCards].map((card) => getCardKey(card.rank, card.suit.id)));
    const deck = buildDeck().filter((card) => !used.has(getCardKey(card.rank, card.suit.id)));
    const runout = neededBoardCards
      ? seededShuffle(deck, seed + index * 7919 + street.length).slice(0, neededBoardCards)
      : [];
    const finalBoard = [...board, ...runout];
    const heroScore = getBestHandScore([...heroCards, ...finalBoard]);
    const villainScore = getBestHandScore([...villainCards, ...finalBoard]);

    if (heroScore > villainScore) wins += 1;
    else if (heroScore === villainScore) ties += 1;
    total += 1;
  }

  return total ? (wins + ties * 0.5) / total : 0.5;
}

function getBestHandScore(cards) {
  let best = 0;

  for (let first = 0; first < cards.length - 4; first += 1) {
    for (let second = first + 1; second < cards.length - 3; second += 1) {
      for (let third = second + 1; third < cards.length - 2; third += 1) {
        for (let fourth = third + 1; fourth < cards.length - 1; fourth += 1) {
          for (let fifth = fourth + 1; fifth < cards.length; fifth += 1) {
            best = Math.max(best, scoreFiveCardHand([cards[first], cards[second], cards[third], cards[fourth], cards[fifth]]));
          }
        }
      }
    }
  }

  return best;
}

function scoreFiveCardHand(cards) {
  const values = cards.map((card) => rankValue(card.rank)).sort((a, b) => b - a);
  const groups = Object.entries(countBy(values)).map(([value, count]) => ({ value: Number(value), count }));
  const sortedGroups = groups.sort((a, b) => b.count - a.count || b.value - a.value);
  const flush = new Set(cards.map((card) => card.suit.id)).size === 1;
  const straightHigh = getStraightHigh(values);
  const categoryBase = 10000000000;

  if (flush && straightHigh) return 8 * categoryBase + encodeKickers([straightHigh]);

  const quads = sortedGroups.find((group) => group.count === 4);
  if (quads) {
    const kicker = sortedGroups.find((group) => group.value !== quads.value).value;
    return 7 * categoryBase + encodeKickers([quads.value, kicker]);
  }

  const trips = sortedGroups.filter((group) => group.count === 3);
  const pairs = sortedGroups.filter((group) => group.count === 2);
  if (trips.length && (pairs.length || trips.length > 1)) {
    const pairValue = pairs[0]?.value || trips[1].value;
    return 6 * categoryBase + encodeKickers([trips[0].value, pairValue]);
  }

  if (flush) return 5 * categoryBase + encodeKickers(values);
  if (straightHigh) return 4 * categoryBase + encodeKickers([straightHigh]);

  if (trips.length) {
    const kickers = values.filter((value) => value !== trips[0].value).slice(0, 2);
    return 3 * categoryBase + encodeKickers([trips[0].value, ...kickers]);
  }

  if (pairs.length >= 2) {
    const pairValues = pairs.map((pair) => pair.value).sort((a, b) => b - a).slice(0, 2);
    const kicker = values.find((value) => !pairValues.includes(value));
    return 2 * categoryBase + encodeKickers([...pairValues, kicker]);
  }

  if (pairs.length === 1) {
    const pairValue = pairs[0].value;
    const kickers = values.filter((value) => value !== pairValue).slice(0, 3);
    return categoryBase + encodeKickers([pairValue, ...kickers]);
  }

  return encodeKickers(values);
}

function getStraightHigh(values) {
  const unique = [...new Set(values.flatMap((value) => value === 14 ? [14, 1] : [value]))].sort((a, b) => b - a);
  for (const value of unique) {
    if ([value, value - 1, value - 2, value - 3, value - 4].every((needed) => unique.includes(needed))) {
      return value;
    }
  }
  return 0;
}

function encodeKickers(values) {
  return values.reduce((score, value) => score * 15 + value, 0);
}

function clampNumber(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function getBluffScore(evaluation, boardProfile, spot) {
  const pressure = getPostflopPressure(spot);
  let score =
    evaluation.drawScore * 1.05 +
    evaluation.blockerScore * 1.65 +
    evaluation.backdoorScore * 0.9 +
    evaluation.overcardScore * 0.7;

  if (evaluation.valueClass === "air") score += 9;
  if (evaluation.strongDraw) score += 12;
  if (evaluation.flushDraw && evaluation.aceBlocker) score += 10;
  if (evaluation.straightDraw >= 18) score += 9;
  if (evaluation.backdoorFlushDraw && spot.street === "flop") score += 5;
  if (pressure === "polar") score += 7;
  if (pressure === "range") score += 3;
  if (boardProfile.wetness >= 7) score += evaluation.strongDraw ? 8 : -7;
  if (boardProfile.monotone) score += evaluation.primarySuitBlocker ? 10 : -9;
  if (boardProfile.paired) score += evaluation.aceBlocker ? 4 : -4;

  if (evaluation.madeScore >= 65) score -= 28;
  if (evaluation.showdownScore >= 48 && spot.street === "river") score -= 22;
  if (evaluation.valueClass !== "air" && evaluation.showdownScore >= 42) score -= 10;

  if (spot.street === "river") {
    score += evaluation.blockerScore * 0.7;
    score -= evaluation.drawScore * 0.9;
    if (evaluation.showdownScore < 30) score += 13;
  }

  return Math.max(0, Math.min(100, score));
}

function getTrapScore(evaluation, boardProfile, spot) {
  let score = 0;
  if (evaluation.valueClass === "nut") score += 45;
  if (evaluation.madeScore >= 90) score += 28;
  else if (evaluation.madeScore >= 78) score += 20;
  else if (evaluation.madeScore >= 70) score += 10;

  if (boardProfile.dryness >= 7) score += 18;
  if (evaluation.madeScore >= 78 && boardProfile.dryness >= 6) score += 34;
  if (boardProfile.paired) score += 10;
  if (spot.street === "river") score += 8;
  if (spot.street === "river" && boardProfile.flushPossible && boardProfile.broadwayDensity >= 3 && evaluation.flush && evaluation.primarySuitBlocker) score += 18;
  if (evaluation.primarySuitBlocker && boardProfile.monotone) score += 8;
  if (boardProfile.wetness >= 8) score -= 20;
  if (evaluation.strongDraw && evaluation.madeScore < 70) score -= 12;
  if (evaluation.showdownScore < 55) score -= 18;

  return Math.max(0, Math.min(100, score));
}

function evaluatePostflopHandClass(handClass, board) {
  const holes = getRepresentativeHoleCards(handClass, board);
  return evaluateHoleCardsPostflop(holes, board);
}

function evaluateHoleCardsPostflop(holes, board) {
  const allCards = [...holes, ...board];
  const ranks = allCards.map((card) => rankValue(card.rank));
  const boardRanks = board.map((card) => rankValue(card.rank));
  const rankCounts = countBy(allCards.map((card) => card.rank));
  const boardRankCounts = countBy(board.map((card) => card.rank));
  const suitCounts = countBy(allCards.map((card) => card.suit.id));
  const highBoard = Math.max(...boardRanks);
  const holeValues = holes.map((card) => rankValue(card.rank)).sort((a, b) => b - a);
  const pairRanks = Object.entries(rankCounts).filter(([, count]) => count >= 2).map(([rank]) => rankValue(rank));
  const boardPairRanks = Object.entries(boardRankCounts).filter(([, count]) => count >= 2).map(([rank]) => rankValue(rank));
  const boardTripRanks = Object.entries(boardRankCounts).filter(([, count]) => count >= 3).map(([rank]) => rankValue(rank));
  const trips = Object.values(rankCounts).some((count) => count === 3);
  const quads = Object.values(rankCounts).some((count) => count === 4);
  const fullHouse = trips && pairRanks.length >= 2;
  const flush = Object.values(suitCounts).some((count) => count >= 5);
  const straight = hasStraight(ranks);
  const twoPair = pairRanks.length >= 2;
  const holePair = holes[0].rank === holes[1].rank;
  const boardMatches = holes.filter((card) => boardRankCounts[card.rank]).map((card) => rankValue(card.rank));
  const topPair = boardMatches.includes(highBoard);
  const overpair = holePair && holeValues[0] > highBoard;
  const underpair = holePair && holeValues[0] < highBoard && !boardRankCounts[holes[0].rank];
  const boardOnlyTrips = boardTripRanks.length > 0 && !boardMatches.includes(boardTripRanks[0]) && !holePair;
  const boardOnlyTwoPair = boardPairRanks.length >= 2 && !boardMatches.length && !holePair;
  const pocketPairWithBoardPair = holePair && boardPairRanks.length > 0 && !boardRankCounts[holes[0].rank] && !fullHouse;
  const boardPairShowdown = !holePair && boardPairRanks.length === 1 && !boardMatches.length;
  const boardCardsAbovePair = underpair ? boardRanks.filter((value) => value > holeValues[0]).length : 0;
  const boardCardsBelowPair = underpair ? boardRanks.filter((value) => value < holeValues[0]).length : 0;
  const pocketSecondPair = underpair && boardCardsAbovePair === 1 && boardCardsBelowPair >= 2;
  const flushDraw = !flush && board.length < 5 && Object.values(suitCounts).some((count) => count === 4);
  const backdoorFlushDraw = !flush && !flushDraw && board.length === 3 && Object.values(suitCounts).some((count) => count === 3);
  const straightDraw = !straight && board.length < 5 ? getStraightDrawScore(ranks) : 0;
  const overcards = holeValues.filter((value) => value > highBoard).length;
  const aceBlocker = holes.some((card) => card.rank === "A");
  const boardProfile = getBoardProfile(board);
  const primarySuitBlocker = holes.some((card) => card.suit.id === boardProfile.primarySuit);

  let madeScore = 0;
  let valueClass = "air";
  if (quads || fullHouse) {
    madeScore = 96;
    valueClass = "nut";
  } else if (flush) {
    madeScore = 90;
    valueClass = "nut";
  } else if (straight) {
    madeScore = 86;
    valueClass = "nut";
  } else if (trips) {
    if (boardOnlyTrips) {
      madeScore = 38 + holeValues[0] * 1.25 + holeValues[1] * 0.25;
      valueClass = "board-trips-kicker";
    } else {
      madeScore = 78;
      valueClass = "strong";
    }
  } else if (twoPair) {
    if (boardOnlyTwoPair) {
      madeScore = 30 + holeValues[0] * 1.15 + holeValues[1] * 0.2;
      valueClass = "board-two-pair-kicker";
    } else if (pocketPairWithBoardPair) {
      const boardPairValue = Math.max(...boardPairRanks);
      madeScore = holeValues[0] > boardPairValue
        ? 64
        : holeValues[0] >= 11 ? 54 : holeValues[0] >= 8 ? 46 : 38;
      valueClass = "pocket-pair-with-board-pair";
    } else {
      madeScore = 72;
      valueClass = "strong";
    }
  } else if (overpair) {
    madeScore = boardProfile.wetness >= 7 ? 62 : 70;
    valueClass = "overpair";
  } else if (topPair) {
    madeScore = holeValues[0] >= 13 ? 62 : 54;
    valueClass = "top-pair";
  } else if (boardMatches.length) {
    madeScore = 38 + Math.max(...boardMatches) * 1.1;
    valueClass = "pair";
  } else if (pocketSecondPair) {
    madeScore = boardProfile.wetness >= 7 ? 48 : 54;
    valueClass = "pocket-second-pair";
  } else if (underpair) {
    madeScore = boardCardsBelowPair >= 1 ? 39 : 34;
    valueClass = "underpair";
  } else if (boardPairShowdown) {
    madeScore = 20 + holeValues[0] * 1.45 + holeValues[1] * 0.45;
    valueClass = "board-pair-kicker";
  }

  const drawScore = (flushDraw ? 34 : 0) + straightDraw + (backdoorFlushDraw ? 9 : 0);
  const blockerScore = (aceBlocker ? 7 : 0) + (primarySuitBlocker ? 5 : 0);
  const overcardScore = overcards * 10;
  const backdoorScore = (backdoorFlushDraw ? 10 : 0) + (straightDraw >= 8 ? 8 : 0);
  const showdownScore = madeScore + overcardScore * 0.45 + (holeValues[0] >= 13 ? 8 : 0);
  const nutPotential = madeScore + drawScore + blockerScore + (flushDraw && aceBlocker ? 12 : 0);

  return {
    madeScore,
    drawScore,
    blockerScore,
    overcardScore,
    backdoorScore,
    showdownScore,
    nutPotential,
    valueClass,
    flush,
    flushDraw,
    backdoorFlushDraw,
    straightDraw,
    aceBlocker,
    primarySuitBlocker,
    overcards,
    strongDraw: flushDraw || straightDraw >= 18,
    positionScore: boardProfile.dryness >= 7 ? 8 : 0,
  };
}

function getRepresentativeHoleCards(handClass, board) {
  const first = handClass[0];
  const second = handClass[1];
  const suitedness = handClass[2] || "";
  const used = new Set(board.map((card) => getCardKey(card.rank, card.suit.id)));
  const suits = getSuitObjects();
  const boardSuitCounts = countBy(board.map((card) => card.suit.id));
  const flushSuit = Object.entries(boardSuitCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "spade";

  if (!suitedness) {
    const firstSuit = pickAvailableSuit(first, suits, used, flushSuit);
    used.add(getCardKey(first, firstSuit.id));
    const secondSuit = pickAvailableSuit(second, suits, used, firstSuit.id === flushSuit ? "heart" : flushSuit);
    return [{ rank: first, suit: firstSuit }, { rank: second, suit: secondSuit }];
  }

  if (suitedness === "s") {
    const preferredSuit = suits.find((suit) => suit.id === flushSuit) || suits[0];
    const suit = [preferredSuit, ...suits].find((candidate) => {
      return !used.has(getCardKey(first, candidate.id)) && !used.has(getCardKey(second, candidate.id));
    }) || preferredSuit;
    return [{ rank: first, suit }, { rank: second, suit }];
  }

  const firstSuit = pickAvailableSuit(first, suits, used, flushSuit);
  used.add(getCardKey(first, firstSuit.id));
  const secondSuit = pickAvailableSuit(second, suits.filter((suit) => suit.id !== firstSuit.id), used, "club");
  return [{ rank: first, suit: firstSuit }, { rank: second, suit: secondSuit }];
}

function pickAvailableSuit(rank, suits, used, preferredSuitId) {
  const ordered = [
    ...suits.filter((suit) => suit.id === preferredSuitId),
    ...suits.filter((suit) => suit.id !== preferredSuitId),
  ];
  return ordered.find((suit) => !used.has(getCardKey(rank, suit.id))) || ordered[0] || getSuitObjects()[0];
}

function getBoardProfile(board) {
  const values = board.map((card) => rankValue(card.rank)).sort((a, b) => b - a);
  const suits = countBy(board.map((card) => card.suit.id));
  const rankCounts = countBy(board.map((card) => card.rank));
  const maxSuitCount = Math.max(0, ...Object.values(suits));
  const monotone = (maxSuitCount >= 3 && board.length === 3) || maxSuitCount >= 4;
  const twoTone = (maxSuitCount === 2 && board.length === 3) || (maxSuitCount === 3 && board.length > 3);
  const paired = Object.values(rankCounts).some((count) => count >= 2);
  const connectedness = values.reduce((score, value, index) => {
    if (index === 0) return score;
    const gap = Math.abs(value - values[index - 1]);
    return score + (gap <= 1 ? 3 : gap <= 2 ? 2 : gap <= 4 ? 1 : 0);
  }, 0);
  const broadwayDensity = values.filter((value) => value >= 10).length;
  const wetness = connectedness + (twoTone ? 3 : 0) + (monotone ? 5 : 0) + (paired ? 1 : 0);
  const primarySuit = Object.entries(suits).sort((a, b) => b[1] - a[1])[0]?.[0] || "spade";

  return {
    monotone,
    twoTone,
    flushPossible: maxSuitCount >= 3,
    paired,
    wetness,
    broadwayDensity,
    dryness: Math.max(0, 10 - wetness - broadwayDensity),
    dangerPenalty: wetness >= 8 ? 12 : wetness >= 5 ? 7 : 2,
    primarySuit,
  };
}

function getPostflopPressure(spot) {
  if (spot.pressure) return spot.pressure;
  if (spot.correctAction.includes("Bet 75")) return "polar";
  if (spot.correctAction.includes("Bet 33")) return "range";
  return "thin";
}

function getStraightDrawScore(values) {
  const unique = [...new Set(values.flatMap((value) => value === 14 ? [14, 1] : [value]))].sort((a, b) => a - b);
  let bestMissing = 0;

  for (let start = 1; start <= 10; start += 1) {
    const windowValues = [start, start + 1, start + 2, start + 3, start + 4];
    const present = windowValues.filter((value) => unique.includes(value)).length;
    if (present === 4) {
      const missing = windowValues.filter((value) => !unique.includes(value));
      const openEnded = missing[0] !== start && missing[0] !== start + 4;
      bestMissing = Math.max(bestMissing, openEnded ? 24 : 15);
    } else if (present === 3) {
      bestMissing = Math.max(bestMissing, 8);
    }
  }

  return bestMissing;
}

function hasStraight(values) {
  const unique = [...new Set(values.flatMap((value) => value === 14 ? [14, 1] : [value]))].sort((a, b) => a - b);
  return unique.some((value) => {
    return [value, value + 1, value + 2, value + 3, value + 4].every((needed) => unique.includes(needed));
  });
}

function countBy(items) {
  return items.reduce((counts, item) => {
    counts[item] = (counts[item] || 0) + 1;
    return counts;
  }, {});
}

function rankValue(rank) {
  return 14 - HAND_RANKS.indexOf(rank);
}

function getHandStrength(handClass) {
  const first = handClass[0];
  const second = handClass[1];
  const suitedness = handClass[2] || "";
  const firstValue = 14 - HAND_RANKS.indexOf(first);
  const secondValue = 14 - HAND_RANKS.indexOf(second);

  if (!suitedness) {
    return 48 + firstValue * 3.2;
  }

  const gap = Math.abs(HAND_RANKS.indexOf(first) - HAND_RANKS.indexOf(second));
  const highCardValue = firstValue * 3 + secondValue * 1.8;
  const suitedBonus = suitedness === "s" ? 10 : 0;
  const connectedBonus = Math.max(0, 8 - gap * 2);
  const broadwayBonus = firstValue >= 11 && secondValue >= 10 ? 8 : 0;
  const offsuitPenalty = suitedness === "o" ? 8 : 0;
  return highCardValue + suitedBonus + connectedBonus + broadwayBonus - offsuitPenalty;
}

function isWheelAce(handClass) {
  return /^A[2-5]s$/.test(handClass);
}

function getOpenThreshold(heroSeat, tableSize) {
  if (tableSize === "hu") return 33;
  if (tableSize === "three") return heroSeat === "BTN" ? 38 : 46;
  if (tableSize === "six") {
    if (heroSeat === "UTG") return 62;
    if (heroSeat === "HJ") return 55;
    if (heroSeat === "CO") return 48;
    if (heroSeat === "BTN") return 38;
    return 46;
  }
  if (["UTG", "UTG+1", "MP"].includes(heroSeat)) return 66;
  if (["LJ", "HJ"].includes(heroSeat)) return 58;
  if (heroSeat === "CO") return 50;
  if (heroSeat === "BTN") return 40;
  return 48;
}

function showToast(title, message, duration = 4000, tone = "") {
  const toast = document.createElement("article");
  toast.className = ["toast", tone ? `toast-${tone}` : ""].filter(Boolean).join(" ");
  toast.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
  elements.toastStack.appendChild(toast);
  window.setTimeout(() => toast.remove(), duration);
}

function pickScenarioIds(tableSize, count, practiceMode = "preflop") {
  const fullBank = SCENARIOS_BY_TABLE[tableSize] || [];
  const bank = practiceMode === "full"
    ? fullBank.filter((scenario) => !scenario.correctAction.includes("Fold"))
    : fullBank;
  return shuffleArray(bank.map((scenario) => scenario.id)).slice(0, Math.min(count, bank.length));
}

function createRandomPreflopScenarioIds(tableSize, count) {
  const sessionSeed = `${tableSize}-${Date.now()}-${Math.floor(Math.random() * 1000000000)}`;
  const scenarios = Array.from({ length: count }, (_, index) => createRandomPreflopScenario(tableSize, sessionSeed, index));
  scenarios.forEach(registerGeneratedScenario);
  return scenarios.map((scenario) => scenario.id);
}

function registerGeneratedScenario(scenario) {
  SCENARIOS_BY_ID[scenario.id] = scenario;
  SCENARIOS_BY_TABLE[scenario.tableSize] ||= [];
  SCENARIOS_BY_TABLE[scenario.tableSize].push(scenario);
}

function createRandomPreflopScenario(tableSize, sessionSeed, index) {
  const layout = TABLES[tableSize] || TABLES.six;
  const seed = hashString(`${sessionSeed}-${index}`);
  const heroCards = seededShuffle(buildDeck(), seed).slice(0, 2);
  const heroHand = getHandClassFromCards(heroCards);
  const templates = getRandomPreflopTemplates(layout, tableSize);
  const template = templates[seed % templates.length] || createOpenTemplate(layout.seats[0].seat);
  const id = `random-${tableSize}-${sessionSeed}-${index}`;

  return template.kind === "vs-open"
    ? createRandomFacingOpenScenario({ id, tableSize, heroCards, heroHand, heroSeat: template.heroSeat, openerSeat: template.openerSeat, seed })
    : createRandomOpenScenario({ id, tableSize, heroCards, heroHand, heroSeat: template.heroSeat, seed });
}

function getRandomPreflopTemplates(layout, tableSize) {
  const seats = layout.seats.map((seatConfig) => seatConfig.seat);
  const openSeats = seats.filter((seat) => canGenerateOpenSpot(seat, tableSize)).map(createOpenTemplate);
  const facingOpenSeats = [];

  seats.forEach((heroSeat, heroIndex) => {
    seats.slice(0, heroIndex).forEach((openerSeat) => {
      if (openerSeat !== heroSeat) {
        facingOpenSeats.push({ kind: "vs-open", heroSeat, openerSeat });
      }
    });
  });

  return [...openSeats, ...facingOpenSeats];
}

function createOpenTemplate(heroSeat) {
  return { kind: "open", heroSeat };
}

function canGenerateOpenSpot(seat, tableSize) {
  if (tableSize === "hu") {
    return seat === "SB / BTN";
  }

  return seat !== "BB";
}

function createRandomOpenScenario({ id, tableSize, heroCards, heroHand, heroSeat }) {
  const openOption = `Open ${getOpenMultiplierLabel(tableSize)}x`;
  const correctAction = isRealisticOpeningHand(heroHand, heroSeat, tableSize) ? openOption : "Fold";
  const actionWord = correctAction === "Fold" ? "fold" : "open";

  return {
    id,
    generated: true,
    preflopKind: "open",
    tableSize,
    pack: "Random 100bb Cash",
    title: `${TABLES[tableSize].label} ${heroSeat} ${actionWord} decision`,
    copy: `${formatCardsForText(heroCards)} in ${heroSeat}. Decide whether this combo belongs in the first-in range.`,
    heroHand,
    heroCards,
    heroSeat,
    difficulty: "Random Range",
    xp: 20,
    facts: [
      { label: "Hero Seat", value: heroSeat },
      { label: "Pot Type", value: "Unopened" },
      { label: "Stacks", value: "100bb" },
    ],
    options: ["Fold", openOption, "Open Jam"],
    correctAction,
    explanation: createPreflopRangeExplanation(heroHand, heroSeat, tableSize, correctAction),
    actors: [{ seat: heroSeat, label: "Hero" }],
  };
}

function createRandomFacingOpenScenario({ id, tableSize, heroCards, heroHand, heroSeat, openerSeat }) {
  const openMultiplier = getOpenMultiplierLabel(tableSize);
  const openAmount = parseMultiplierAmount(`${openMultiplier}x`);
  const threeBetAmount = getDefaultThreeBetAmount(heroSeat, { seat: openerSeat, amount: openAmount });
  const threeBetOption = `3-bet to ${formatBbAmount(threeBetAmount / BIG_BLIND)}bb`;
  const options = ["Fold", "Call", threeBetOption];
  const correctAction = getPreflopVsOpenCorrectAction(heroHand, heroSeat, openerSeat, tableSize, options);

  return {
    id,
    generated: true,
    preflopKind: "vs-open",
    tableSize,
    pack: "Random 100bb Cash",
    title: `${TABLES[tableSize].label} ${heroSeat} versus ${openerSeat} open`,
    copy: `${formatCardsForText(heroCards)} facing ${openerSeat} open. Continue only with the range that performs here.`,
    heroHand,
    heroCards,
    heroSeat,
    openerSeat,
    difficulty: "Random Range",
    xp: 24,
    facts: [
      { label: "Hero Seat", value: heroSeat },
      { label: "Villain", value: `${openerSeat} opens ${openMultiplier}x` },
      { label: "Stacks", value: "100bb" },
    ],
    options,
    correctAction,
    explanation: createPreflopRangeExplanation(heroHand, heroSeat, tableSize, correctAction, openerSeat),
    actors: [
      { seat: openerSeat, label: "Opens" },
      { seat: heroSeat, label: "Hero" },
    ],
  };
}

function getOpenMultiplierLabel(tableSize) {
  return tableSize === "hu" ? "2.5" : "2.3";
}

function formatBbAmount(amount) {
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(1).replace(/\.0$/, "");
}

function getPreflopVsOpenCorrectAction(handClass, heroSeat, openerSeat, tableSize, options) {
  const [, callOption, threeBetOption] = options;

  if (isRealisticThreeBetHand(handClass, heroSeat, tableSize, openerSeat)) {
    return threeBetOption;
  }

  if (isRealisticCallVsOpenHand(handClass, heroSeat, openerSeat, tableSize)) {
    return callOption;
  }

  return "Fold";
}

function isRealisticCallVsOpenHand(handClass, heroSeat, openerSeat, tableSize) {
  const shape = getHandShape(handClass);
  const strength = getHandStrength(handClass);
  const openerPosition = getRangePosition(openerSeat, tableSize);
  const heroInBlind = heroSeat.includes("BB") || heroSeat.includes("SB");
  const heroOnButton = heroSeat === "BTN";
  const versusEarly = openerPosition === "early";

  if (isRealisticThreeBetHand(handClass, heroSeat, tableSize, openerSeat)) {
    return false;
  }

  if (tableSize === "hu") {
    return strength >= 34 || shape.pairValue >= 2 || shape.suited;
  }

  if (heroSeat.includes("BB")) {
    const floor = versusEarly ? 48 : openerPosition === "middle" ? 40 : 32;
    return strength >= floor ||
      shape.pairValue >= 2 ||
      (shape.suited && (shape.ace || shape.king || shape.connected || shape.lowValue >= 6));
  }

  if (heroSeat.includes("SB")) {
    return strength >= (versusEarly ? 60 : 52) ||
      shape.pairValue >= 5 ||
      (shape.suited && (shape.ace || shape.highValue >= 11 && shape.lowValue >= 9));
  }

  if (heroOnButton) {
    return strength >= (versusEarly ? 58 : 48) ||
      shape.pairValue >= 4 ||
      (shape.suited && (shape.ace || shape.connected && shape.lowValue >= 5 || shape.highValue >= 10 && shape.lowValue >= 8));
  }

  return strength >= (versusEarly ? 62 : 54) ||
    shape.pairValue >= 6 ||
    (shape.suited && (shape.ace && shape.lowValue >= 9 || shape.highValue >= 11 && shape.lowValue >= 10));
}

function createPreflopRangeExplanation(handClass, heroSeat, tableSize, correctAction, openerSeat = "") {
  const displayHand = handClass;
  if (correctAction.includes("Open")) {
    return `${displayHand} is inside the ${heroSeat} first-in range at 100bb, so raising captures initiative and fold equity.`;
  }

  if (correctAction.includes("3-bet")) {
    return `${displayHand} fits the ${heroSeat} 3-bet range versus ${openerSeat}: enough value, blocker power, or suited equity to pressure the opener.`;
  }

  if (correctAction === "Call") {
    return `${displayHand} continues profitably versus ${openerSeat}, but it performs better realizing equity than inflating the pot with a 3-bet.`;
  }

  const context = openerSeat ? ` versus ${openerSeat}` : ` from ${heroSeat}`;
  return `${displayHand} falls outside the profitable 100bb range${context}; folding protects the rest of the strategy.`;
}

function parseHand(hand, seed = hand) {
  const suits = pickSuits(hand, seed);

  if (hand.length === 2) {
    return { left: hand[0], right: hand[1], leftSuit: suits[0], rightSuit: suits[1] };
  }
  return { left: hand[0], right: hand[1], leftSuit: suits[0], rightSuit: suits[1] };
}

function pickSuits(hand, seed) {
  const suits = getSuitObjects();
  const index = hashString(`${seed}-${hand}`) % suits.length;

  if (hand.length === 2) {
    return [suits[index], suits[(index + 2) % suits.length]];
  }

  if (hand[2] === "s") {
    return [suits[index], suits[index]];
  }

  return [suits[index], suits[(index + 1) % suits.length]];
}

function getSuitObjects() {
  return [
    { id: "heart", name: "Hearts", symbol: "♥" },
    { id: "diamond", name: "Diamonds", symbol: "♦" },
    { id: "club", name: "Clubs", symbol: "♣" },
    { id: "spade", name: "Spades", symbol: "♠" },
  ];
}

function hashString(value) {
  return [...value].reduce((hash, character) => {
    return ((hash << 5) - hash + character.charCodeAt(0)) >>> 0;
  }, 0);
}

function getOptionHint(option) {
  if (option.includes("Open")) return "Own the initiative with your preferred opening size.";
  if (option.includes("Bet")) return "Choose the pressure size that fits your range and board texture.";
  if (option.includes("Check")) return "Control the pot and protect the hands that continue later.";
  if (option.includes("3-bet")) return "Apply pressure and deny clean realization.";
  if (option.includes("4-bet")) return "Punish the aggressive branch before postflop.";
  if (option.includes("5-bet")) return "Commit only the range that can handle maximum pressure.";
  if (option.includes("Call")) return "Realize equity without inflating the pot too hard.";
  if (option.includes("Fold")) return "Protect your range and move on to cleaner mixes.";
  if (option.includes("Jam")) return "Force the stack-depth decision now.";
  return "Choose the cleanest baseline available.";
}

function formatOptionLabel(option) {
  const openAmount = /^Open\s+[\d.]+x/i.test(option) ? parseMultiplierAmount(option) : null;
  if (openAmount) {
    return `${option} (${formatMoney(openAmount)})`;
  }

  const bbAmount = parseBbAmount(option);
  if (bbAmount) {
    return `${option} (${formatMoney(bbAmount)})`;
  }

  return option;
}

function getSpotPotLabel(spot, bettingSummary) {
  const potFact = spot.facts?.find((fact) => fact.label === "Pot");
  return potFact?.value || formatMoney(bettingSummary.pot);
}

function getPracticeMode(tableSize) {
  const mode = state.modeByTable?.[tableSize] || "preflop";
  return isPracticeModeAvailable(mode) ? mode : "preflop";
}

function resolveSessionEngine(tableSize, practiceMode) {
  const wantsPreflopRange = tableSize === "six" && practiceMode === "preflop";
  const engineId = wantsPreflopRange && isPreflopRangeEngineReady()
    ? TRAINING_ENGINE_IDS.preflopRange
    : TRAINING_ENGINE_IDS.scenarioPack;

  return {
    tableSize,
    practiceMode,
    engineId,
    requestedEngineId: wantsPreflopRange ? TRAINING_ENGINE_IDS.preflopRange : TRAINING_ENGINE_IDS.scenarioPack,
    fallbackEngineId: wantsPreflopRange ? TRAINING_ENGINE_IDS.scenarioPack : "",
    isFallback: wantsPreflopRange && engineId !== TRAINING_ENGINE_IDS.preflopRange,
  };
}

function selectPreflopRangeDrill(drillId) {
  const requestedDrill = getPreflopRangeDrill(drillId);
  if (requestedDrill?.reviewMode) {
    startPreflopRangeReviewSession(activeSession?.tableSize || "six");
    return;
  }

  const normalizedDrillId = normalizePreflopRangeDrillId(drillId);

  state.preflop6maxDrillId = normalizedDrillId;
  saveState();

  if (activeSession?.trainingEngine === TRAINING_ENGINE_IDS.preflopRange) {
    if (activeSession.mode === "review") {
      startPreflopRangeSession(activeSession.tableSize || "six", {
        tableSize: activeSession.tableSize || "six",
        practiceMode: "preflop",
        engineId: TRAINING_ENGINE_IDS.preflopRange,
        requestedEngineId: TRAINING_ENGINE_IDS.preflopRange,
        fallbackEngineId: TRAINING_ENGINE_IDS.scenarioPack,
        isFallback: false,
      });
      return;
    }

    activeSession.mode = "main";
    activeSession.reviewType = "";
    activeSession.drillId = normalizedDrillId;
    refreshPreflopRangeQuestionsForDrill(normalizedDrillId);
  }

  render();
}

function refreshPreflopRangeQuestionsForDrill(drillId) {
  if (!activeSession?.questionStates?.length || activeSession.trainingEngine !== TRAINING_ENGINE_IDS.preflopRange) {
    return;
  }

  for (let index = activeSession.currentIndex; index < activeSession.questionStates.length; index += 1) {
    if (!activeSession.questionStates[index]?.answered) {
      activeSession.questionStates[index] = createPreflopRangeQuestionState({ drillId });
    }
  }

  activeSession.spotId = activeSession.questionStates[activeSession.currentIndex]?.spotId || activeSession.spotId;
  activeSession.pendingAdvance = false;
}

function getSelectedPreflopRangeDrillId() {
  return normalizePreflopRangeDrillId(state.preflop6maxDrillId);
}

function getActivePreflopRangeDrillId() {
  return activeSession?.mode === "review" ? PREFLOP_RANGE_REVIEW_DRILL_ID : getSelectedPreflopRangeDrillId();
}

function normalizePreflopRangeDrillId(drillId) {
  const drill = getPreflopRangeDrill(drillId);
  return drill && !drill.reviewMode ? drill.id : PREFLOP_RANGE_DEFAULT_DRILL_ID;
}

function normalizeStoredPreflopRangeDrillId(drillId, drillDefaultVersion) {
  const isOldImplicitDefault = !drillDefaultVersion && (!drillId || drillId === "all-rfi");
  return isOldImplicitDefault ? PREFLOP_RANGE_DEFAULT_DRILL_ID : normalizePreflopRangeDrillId(drillId);
}

function getPreflopRangeDrill(drillId) {
  return PREFLOP_RANGE_DRILL_OPTIONS.find((drill) => drill.id === drillId) || null;
}

function isPreflopRangeEngineReady() {
  if (!window.FishKillerPreflopEngine || !preflopRangePack) {
    return false;
  }

  return getPreflopRangeTrainableSpots().length > 0;
}

function getActivePreflopRangeSpot() {
  if (!window.FishKillerPreflopEngine || !preflopRangePack) {
    return null;
  }

  const questionSpot = getPreflopRangeSpot(getCurrentQuestion()?.spotId);
  if (questionSpot) return questionSpot;

  const sessionSpot = getPreflopRangeSpot(activeSession?.spotId);
  if (sessionSpot) return sessionSpot;

  preflopRangeSpot = getPreflopRangeTrainableSpots()[0] || null;
  return preflopRangeSpot;
}

function getPreflopRangeSpot(spotId) {
  if (!window.FishKillerPreflopEngine || !preflopRangePack || !spotId) {
    return null;
  }

  const cached = preflopRangeSpots.find((spot) => spot.spotId === spotId);
  preflopRangeSpot = cached || window.FishKillerPreflopEngine.getPreflopSpot(preflopRangePack, spotId);
  return preflopRangeSpot;
}

function samplePreflopRangeSpot(drillId = getSelectedPreflopRangeDrillId()) {
  const spots = getPreflopRangeTrainableSpotsForDrill(drillId);
  if (!spots.length) {
    return null;
  }

  return spots[Math.floor(Math.random() * spots.length)];
}

function getPreflopRangeTrainableSpotsForDrill(drillId = getSelectedPreflopRangeDrillId()) {
  const spotIds = window.FishKillerPreflopEngine?.resolvePreflopDrillSpotIds(
    drillId,
    PREFLOP_RANGE_DRILL_OPTIONS
  ) || PREFLOP_RANGE_TRAINABLE_SPOT_IDS;
  const allowed = new Set(spotIds.length ? spotIds : PREFLOP_RANGE_TRAINABLE_SPOT_IDS);
  const spots = getPreflopRangeTrainableSpots();
  const filtered = spots.filter((spot) => allowed.has(spot.spotId));
  return filtered.length ? filtered : spots;
}

function getPreflopRangeTrainableSpots(pack = preflopRangePack) {
  if (!pack) {
    return [];
  }

  const spots = Array.isArray(pack.spots) ? pack.spots : [];
  const discovered = spots.filter(isTrainablePreflopRangeSpot);
  if (discovered.length) {
    return discovered.sort((left, right) => {
      return getPreflopRangeSpotOrder(left.spotId) - getPreflopRangeSpotOrder(right.spotId);
    });
  }

  return PREFLOP_RANGE_TRAINABLE_SPOT_IDS
    .map((spotId) => window.FishKillerPreflopEngine?.getPreflopSpot(pack, spotId))
    .filter(Boolean);
}

function isTrainablePreflopRangeSpot(spot) {
  if (!spot || spot.tableSize !== 6 || spot.stackDepthBb !== 100) {
    return false;
  }

  const actionIds = new Set((spot.legalActions || []).map((action) => action.id));
  const isRfi = (
    spot.complete === true &&
    spot.actionContext === "rfi" &&
    spot.priorAction === "folded-to-hero" &&
    spot.potState === "unopened" &&
    actionIds.has("fold") &&
    actionIds.has("raise")
  );
  const isBbDefense = (
    spot.complete === true &&
    spot.actionContext === "facing-open" &&
    spot.heroPosition === "BB" &&
    Boolean(spot.villainPosition) &&
    actionIds.has("fold") &&
    actionIds.has("call") &&
    actionIds.has("threeBet")
  );
  const isFacingOpen = (
    spot.complete === true &&
    spot.actionContext === "facing-open" &&
    spot.family === "facingOpen" &&
    spot.spotType === "facing-open-response" &&
    Boolean(spot.heroPosition) &&
    Boolean(spot.openerPosition || spot.villainPosition) &&
    actionIds.has("fold") &&
    actionIds.has("call") &&
    actionIds.has("threeBet")
  );
  const isThreeBetVsOpen = (
    spot.complete === true &&
    spot.actionContext === "facing-open" &&
    spot.spotType === "three-bet-vs-open" &&
    Boolean(spot.heroPosition) &&
    Boolean(spot.villainPosition) &&
    actionIds.has("fold") &&
    actionIds.has("call") &&
    actionIds.has("threeBet")
  );
  const isFacingThreeBet = (
    spot.complete === true &&
    spot.actionContext === "facing-3bet" &&
    spot.spotType === "facing-3bet" &&
    Boolean(spot.heroPosition) &&
    Boolean(spot.villainPosition) &&
    actionIds.has("fold") &&
    actionIds.has("call") &&
    actionIds.has("fourBet")
  );
  const isFacingFourBet = (
    spot.complete === true &&
    spot.actionContext === "facing-4bet" &&
    spot.spotType === "facing-4bet" &&
    Boolean(spot.heroPosition) &&
    Boolean(spot.villainPosition) &&
    actionIds.has("fold") &&
    actionIds.has("call") &&
    actionIds.has("fiveBetJam")
  );
  const isBvbLimp = (
    spot.complete === true &&
    spot.family === "limpedPot" &&
    spot.actionContext === "limped-pot" &&
    Boolean(spot.heroPosition) &&
    (
      (spot.spotType === "sb-first-in-limp-or-raise" && actionIds.has("fold") && actionIds.has("limp") && actionIds.has("raise")) ||
      (spot.spotType === "bb-vs-sb-limp" && actionIds.has("check") && actionIds.has("raise")) ||
      (spot.spotType === "sb-limp-vs-bb-raise" && actionIds.has("fold") && actionIds.has("call") && actionIds.has("threeBet"))
    )
  );
  const isIsoVsLimp = (
    spot.complete === true &&
    spot.family === "isoVsLimper" &&
    spot.actionContext === "iso-vs-limper" &&
    spot.spotType === "iso-vs-limper" &&
    Boolean(spot.heroPosition) &&
    Boolean(spot.limperPosition || spot.villainPosition) &&
    actionIds.has("fold") &&
    actionIds.has("call") &&
    actionIds.has("isoRaise")
  );
  const isSqueeze = (
    spot.complete === true &&
    spot.family === "squeeze" &&
    spot.actionContext === "squeeze" &&
    spot.spotType === "squeeze" &&
    Boolean(spot.heroPosition) &&
    Boolean(spot.openerPosition || spot.villainPosition) &&
    Boolean(spot.callerPosition) &&
    actionIds.has("fold") &&
    actionIds.has("call") &&
    actionIds.has("squeeze")
  );
  return isRfi || isFacingOpen || isBbDefense || isThreeBetVsOpen || isFacingThreeBet || isFacingFourBet || isBvbLimp || isIsoVsLimp || isSqueeze;
}

function getPreflopRangeSpotOrder(spotId) {
  const index = PREFLOP_RANGE_TRAINABLE_SPOT_IDS.indexOf(spotId);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function isPracticeModeAvailable(modeId) {
  const mode = PRACTICE_MODES[modeId];
  return Boolean(mode && !mode.disabled);
}

function getQuestionXp(scenario, question) {
  if ((question.street || "preflop") === "preflop") {
    return scenario.xp;
  }

  return Math.max(10, Math.round(scenario.xp * 0.55));
}

function getStreetLabel(street = "preflop") {
  return {
    preflop: "Preflop",
    flop: "Flop",
    turn: "Turn",
    river: "River",
  }[street] || "Decision";
}

function getCardStyleById(id) {
  return CARD_STYLES.find((style) => style.id === id) || null;
}

function isCardStyleUnlocked(id) {
  const style = getCardStyleById(id);
  return Boolean(style && state.totalXp >= style.xp);
}

function getBestUnlockedCardStyle(totalXp) {
  return CARD_STYLES.reduce((best, style) => {
    if (totalXp >= style.xp && style.xp >= best.xp) {
      return style;
    }
    return best;
  }, CARD_STYLES[0]);
}

function formatHandForDisplay(hand) {
  if (hand.length === 2) {
    return `${hand[0]}${hand[1]}`;
  }

  return `${hand[0]}${hand[1]}${hand[2] === "s" ? " suited" : " offsuit"}`;
}

function getLevelFromXp(xp) {
  return Math.floor(xp / 160) + 1;
}

function getLevelProgressPercent(xp) {
  return Math.round(((xp % 160) / 160) * 100);
}

function timeUntilNextHeart(targetState) {
  syncHearts(targetState);
  if (targetState.hearts >= MAX_HEARTS) {
    return 0;
  }
  const elapsed = Date.now() - targetState.heartRefillStartedAt;
  return Math.max(0, HEART_REGEN_MS - (elapsed % HEART_REGEN_MS));
}

function formatDuration(milliseconds) {
  const totalMinutes = Math.max(1, Math.ceil(milliseconds / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (!hours) return `${minutes}m`;
  if (!minutes) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

function formatSeconds(milliseconds) {
  return `${(Math.max(0, milliseconds) / 1000).toFixed(1)}s`;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-GB").format(value);
}

function getLocalDayKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shuffleArray(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function pushUnique(items, value) {
  if (!items.includes(value)) {
    items.push(value);
  }
}

function createQuestionRef(question) {
  return {
    scenarioId: question.scenarioId,
    street: question.street || "preflop",
    runoutSeed: question.runoutSeed || question.scenarioId,
  };
}

function createPreflopRangeQuestionRef(question) {
  return {
    engine: TRAINING_ENGINE_IDS.preflopRange,
    spotId: question.spotId,
    handClass: question.handClass,
    street: "preflop",
  };
}

function normalizeReviewQuestionRefs(items) {
  return (items || [])
    .map((item) => {
      if (typeof item === "string") {
        return { scenarioId: item, street: "preflop", runoutSeed: item };
      }

      return {
        scenarioId: item?.scenarioId,
        street: item?.street || "preflop",
        runoutSeed: item?.runoutSeed || item?.scenarioId,
      };
    })
    .filter((item) => item.scenarioId && SCENARIOS_BY_ID[item.scenarioId])
    .filter((item) => POSTFLOP_SOLVER_ENABLED || (item.street || "preflop") === "preflop");
}

function getQuestionRefKey(questionRef) {
  return `${questionRef.scenarioId}|${questionRef.street || "preflop"}|${questionRef.runoutSeed || questionRef.scenarioId}`;
}

function pushUniqueQuestionRef(items, questionRef) {
  const key = getQuestionRefKey(questionRef);
  if (!items.some((item) => getQuestionRefKey(item) === key)) {
    items.push(questionRef);
  }
}

function uniqueValues(items) {
  return [...new Set(items)];
}

window.__fishkillerStartFromCard = () => startMainSession(state.selectedTableSize);
