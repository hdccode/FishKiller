(function initDomElements(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.FishKillerDomElements = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function buildDomElementsApi() {
  const ELEMENT_IDS = Object.freeze({
    splashScreen: "splash-screen",
    splashStartButton: "splash-start-button",
    profileMenuButton: "profile-menu-button",
    profileMenu: "profile-menu",
    profileLevelDisplay: "profile-level-display",
    profileXpText: "profile-xp-text",
    profileXpFill: "profile-xp-fill",
    profileHeartMeter: "profile-heart-meter",
    tableSizeList: "table-size-list",
    modeList: "mode-list",
    modeTableLabel: "mode-table-label",
    questList: "quest-list",
    rewardList: "reward-list",
    totalXpDisplay: "total-xp-display",
    selectedXpDisplay: "selected-xp-display",
    selectedXpLabel: "selected-xp-label",
    heroTitle: "hero-title",
    heroSubtitle: "hero-subtitle",
    heartsDisplay: "hearts-display",
    heartsTimer: "hearts-timer",
    boostDisplay: "boost-display",
    boostSubtitle: "boost-subtitle",
    startSessionButton: "start-session-button",
    sessionChip: "session-chip",
    progressFill: "progress-fill",
    sessionCounter: "session-counter",
    mistakeCounter: "mistake-counter",
    sessionAccuracy: "session-accuracy",
    scenarioTable: "scenario-table",
    scenarioDifficulty: "scenario-difficulty",
    bettingLine: "betting-line",
    heroCardLeft: "hero-card-left",
    heroCardRight: "hero-card-right",
    scenarioTitle: "scenario-title",
    scenarioCopy: "scenario-copy",
    scenarioFacts: "scenario-facts",
    tableVisual: "table-visual",
    answerGrid: "answer-grid",
    feedbackBand: "feedback-band",
    feedbackLabel: "feedback-label",
    feedbackText: "feedback-text",
    gtoTableButton: "gto-table-button",
    continueButton: "continue-button",
    sessionExitButton: "session-exit-button",
    visualSkinToggle: "visual-skin-toggle",
    lastGrade: "last-grade",
    lastXp: "last-xp",
    lastAccuracy: "last-accuracy",
    lastTable: "last-table",
    lastMisses: "last-misses",
    lastNote: "last-note",
    summaryModal: "summary-modal",
    modalKicker: "modal-kicker",
    modalTitle: "modal-title",
    modalCopy: "modal-copy",
    modalGrade: "modal-grade",
    modalXp: "modal-xp",
    modalAccuracy: "modal-accuracy",
    modalMisses: "modal-misses",
    modalAverageTime: "modal-average-time",
    modalReviewList: "modal-review-list",
    modalCloseButton: "modal-close-button",
    retryMissesButton: "retry-misses-button",
    modalNewSessionButton: "modal-new-session-button",
    endSessionModal: "end-session-modal",
    cancelEndSessionButton: "cancel-end-session-button",
    confirmEndSessionButton: "confirm-end-session-button",
    gtoModal: "gto-modal",
    gtoKicker: "gto-kicker",
    gtoTitle: "gto-title",
    gtoCopy: "gto-copy",
    gtoLegend: "gto-legend",
    gtoMatrix: "gto-matrix",
    gtoCloseButton: "gto-close-button",
    toastStack: "toast-stack",
  });

  function collectDomElements(documentRef) {
    return Object.fromEntries(
      Object.entries(ELEMENT_IDS).map(([key, id]) => [key, documentRef.getElementById(id)])
    );
  }

  return Object.freeze({ ELEMENT_IDS, collectDomElements });
});
