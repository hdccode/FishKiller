(function initAppState(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.FishKillerAppState = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function buildAppStateApi() {
  function mergeSavedState(defaults, parsed, helpers) {
    return {
      ...defaults,
      ...parsed,
      xpByTable: { ...defaults.xpByTable, ...(parsed.xpByTable || {}) },
      modeByTable: { ...defaults.modeByTable, ...(parsed.modeByTable || {}) },
      cardStyle: helpers.getCardStyleById(parsed.cardStyle)?.id || defaults.cardStyle,
      visualSkin: helpers.normalizeVisualSkinId(parsed.visualSkin),
      daily: {
        ...defaults.daily,
        ...(parsed.daily || {}),
        tableSizesPlayed: { ...defaults.daily.tableSizesPlayed, ...(parsed.daily?.tableSizesPlayed || {}) },
        claimedQuestIds: Array.isArray(parsed.daily?.claimedQuestIds) ? parsed.daily.claimedQuestIds : [],
      },
      preflop6maxProgress: helpers.normalizePreflop6maxProgress(parsed.preflop6maxProgress),
      preflop6maxDrillId: helpers.normalizeStoredPreflopRangeDrillId(
        parsed.preflop6maxDrillId,
        parsed.preflop6maxDrillDefaultVersion
      ),
      preflop6maxDrillDefaultVersion: helpers.preflopRangeDrillDefaultVersion,
      lastResult: { ...defaults.lastResult, ...(parsed.lastResult || {}) },
    };
  }

  return Object.freeze({ mergeSavedState });
});
