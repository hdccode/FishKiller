(function attachFishKillerPreflopEngine(globalScope) {
  const RANK_ORDER = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
  const MIXED_ACTION_MIN_FREQUENCY = 0.2;
  const TINY_ACTION_MAX_FREQUENCY = 0.05;
  const PURE_ACTION_MIN_FREQUENCY = 0.999;

  function normalizePreflopRangePack(pack) {
    if (!pack || typeof pack !== "object" || Array.isArray(pack)) {
      throw new Error("Preflop range pack must be an object.");
    }

    const spots = (Array.isArray(pack.spots) ? pack.spots : []).map(normalizePreflopSpot);
    return {
      ...pack,
      spots,
      spotsById: Object.fromEntries(spots.map((spot) => [spot.spotId, spot])),
    };
  }

  function getPreflopSpot(packOrNormalizedPack, spotId) {
    const pack = packOrNormalizedPack?.spotsById
      ? packOrNormalizedPack
      : normalizePreflopRangePack(packOrNormalizedPack);
    return pack.spotsById[spotId] || null;
  }

  function getPreflopHandStrategy(spot, handClass) {
    if (!spot || !spot.actionsByHand) {
      return null;
    }

    const normalizedHand = normalizeHandClass(handClass);
    return spot.actionsByHand[normalizedHand] || null;
  }

  function getPreferredPreflopAction(strategy) {
    if (!strategy || !strategy.actions) {
      return null;
    }

    const actionEntries = Object.entries(strategy.actions);
    if (!actionEntries.length) {
      return null;
    }

    const [actionId, frequency] = actionEntries.reduce((best, current) => {
      return current[1] > best[1] ? current : best;
    });
    return { actionId, frequency };
  }

  function gradePreflopAnswer({ spot, handClass, actionId }) {
    const legalActions = normalizeLegalActions(spot?.legalActions || []);
    const legalActionIds = new Set(legalActions.map((action) => action.id));
    const strategy = getPreflopHandStrategy(spot, handClass);
    const normalizedHand = normalizeHandClass(handClass);

    if (!legalActionIds.has(actionId)) {
      return createGradeResult({
        kind: "illegal",
        handClass: normalizedHand,
        actionId,
        legalActions,
        strategy,
        feedback: `${actionId} is not available in this spot.`,
      });
    }

    if (!strategy) {
      return createGradeResult({
        kind: "illegal",
        handClass: normalizedHand,
        actionId,
        legalActions,
        strategy,
        feedback: `${normalizedHand} is not in this range spot.`,
      });
    }

    const preferred = getPreferredPreflopAction(strategy);
    const chosenFrequency = getActionFrequency(strategy, actionId);
    const preferredFrequency = preferred?.frequency ?? 0;
    const isTopFrequency = preferred && Math.abs(chosenFrequency - preferredFrequency) < 0.000001;

    if (isTopFrequency) {
      return createGradeResult({
        kind: "correct",
        handClass: normalizedHand,
        actionId,
        preferred,
        legalActions,
        strategy,
        feedback: `${formatAction(actionId, legalActions)} is the preferred action for ${normalizedHand}.`,
      });
    }

    if (chosenFrequency >= MIXED_ACTION_MIN_FREQUENCY) {
      return createGradeResult({
        kind: "mixed",
        handClass: normalizedHand,
        actionId,
        preferred,
        legalActions,
        strategy,
        feedback: `${formatAction(actionId, legalActions)} is mixed for ${normalizedHand}, but ${formatAction(preferred.actionId, legalActions)} is preferred.`,
      });
    }

    const tinyLabel = chosenFrequency <= TINY_ACTION_MAX_FREQUENCY ? "tiny or zero frequency" : "low frequency";
    return createGradeResult({
      kind: "mistake",
      handClass: normalizedHand,
      actionId,
      preferred,
      legalActions,
      strategy,
      feedback: `${formatAction(actionId, legalActions)} is ${tinyLabel} for ${normalizedHand}. Prefer ${formatAction(preferred.actionId, legalActions)}.`,
    });
  }

  function buildPreflopRangeMatrix(spot) {
    const rows = RANK_ORDER.map((rowRank, rowIndex) => {
      return RANK_ORDER.map((columnRank, columnIndex) => {
        const handClass = getMatrixHandClass(rowIndex, columnIndex);
        const strategy = getPreflopHandStrategy(spot, handClass);
        const preferred = getPreferredPreflopAction(strategy);
        const topFrequency = preferred?.frequency ?? 0;
        return {
          handClass,
          row: rowIndex,
          column: columnIndex,
          rowRank,
          columnRank,
          dominantAction: preferred?.actionId || "",
          actions: strategy?.actions || {},
          pure: topFrequency >= PURE_ACTION_MIN_FREQUENCY,
          mixed: topFrequency > 0 && topFrequency < PURE_ACTION_MIN_FREQUENCY,
        };
      });
    });

    return {
      ranks: [...RANK_ORDER],
      rows,
      cells: rows.flat(),
    };
  }

  function samplePreflopQuestion({ packOrNormalizedPack, spotId, rng = Math.random }) {
    const spot = getPreflopSpot(packOrNormalizedPack, spotId);
    if (!spot) {
      throw new Error(`Preflop spot not found: ${spotId}`);
    }

    const handClasses = Object.keys(spot.actionsByHand || {}).sort(compareHandClassesForMatrix);
    if (!handClasses.length) {
      throw new Error(`Preflop spot has no hand strategies: ${spotId}`);
    }

    const index = Math.max(0, Math.min(handClasses.length - 1, Math.floor(clamp01(rng()) * handClasses.length)));
    const handClass = handClasses[index];
    return {
      spotId: spot.spotId,
      handClass,
      legalActions: spot.legalActions,
      strategy: getPreflopHandStrategy(spot, handClass),
    };
  }

  function resolvePreflopDrillSpotIds(drillId, drillOptions = []) {
    const options = Array.isArray(drillOptions) ? drillOptions : [];
    if (!options.length) {
      return [];
    }

    const selected = options.find((option) => option.id === drillId)
      || options.find((option) => option.default)
      || options[0];
    if (!selected || selected.reviewMode) {
      return [];
    }

    return Array.isArray(selected.spotIds)
      ? selected.spotIds.filter((spotId) => typeof spotId === "string" && spotId)
      : [];
  }

  function normalizePreflopSpot(spot) {
    if (!spot || typeof spot !== "object" || Array.isArray(spot)) {
      throw new Error("Preflop spot must be an object.");
    }

    const legalActions = normalizeLegalActions(spot.legalActions || []);
    const actionsByHand = {};
    Object.entries(spot.actionsByHand || {}).forEach(([handClass, strategy]) => {
      const normalizedHand = normalizeHandClass(handClass);
      actionsByHand[normalizedHand] = normalizeStrategy(normalizedHand, strategy, legalActions);
    });

    return {
      ...spot,
      legalActions,
      actionsByHand,
    };
  }

  function normalizeLegalActions(actions) {
    return (Array.isArray(actions) ? actions : []).map((action) => ({
      id: String(action.id || ""),
      label: action.label || action.id || "",
      type: action.type || action.id || "action",
      sizeBb: Number.isFinite(Number(action.sizeBb)) ? Number(action.sizeBb) : null,
    })).filter((action) => action.id);
  }

  function normalizeStrategy(handClass, strategy, legalActions) {
    const legalActionIds = new Set(legalActions.map((action) => action.id));
    const actions = {};
    Object.entries(strategy || {}).forEach(([actionId, frequency]) => {
      if (!legalActionIds.has(actionId)) {
        return;
      }
      actions[actionId] = round(clamp01(frequency));
    });

    legalActionIds.forEach((actionId) => {
      actions[actionId] ??= 0;
    });

    return {
      handClass,
      actions,
    };
  }

  function createGradeResult({ kind, handClass, actionId, preferred = null, legalActions, strategy, feedback }) {
    const preferredActionId = preferred?.actionId || "";
    return {
      kind,
      isCorrect: kind === "correct",
      isMixed: kind === "mixed",
      isIllegal: kind === "illegal",
      handClass,
      chosenActionId: actionId,
      preferredActionId,
      chosenFrequency: strategy ? getActionFrequency(strategy, actionId) : 0,
      preferredFrequency: preferred?.frequency ?? 0,
      legalActions,
      strategy: strategy?.actions || {},
      feedback,
    };
  }

  function getActionFrequency(strategy, actionId) {
    return round(strategy?.actions?.[actionId] ?? 0);
  }

  function normalizeHandClass(handClass) {
    const value = String(handClass || "").trim().toUpperCase().replace(/S$/, "s").replace(/O$/, "o");
    if (/^([AKQJT98765432])\1$/.test(value)) {
      return value;
    }

    const match = value.match(/^([AKQJT98765432])([AKQJT98765432])([so])$/);
    if (!match || match[1] === match[2]) {
      throw new Error(`Invalid preflop hand class: ${handClass}`);
    }

    const first = match[1];
    const second = match[2];
    const suffix = match[3];
    return rankIndex(first) <= rankIndex(second)
      ? `${first}${second}${suffix}`
      : `${second}${first}${suffix}`;
  }

  function getMatrixHandClass(row, column) {
    const rowRank = RANK_ORDER[row];
    const columnRank = RANK_ORDER[column];
    if (row === column) {
      return `${rowRank}${columnRank}`;
    }
    return row < column ? `${rowRank}${columnRank}s` : `${columnRank}${rowRank}o`;
  }

  function compareHandClassesForMatrix(left, right) {
    return getHandClassMatrixIndex(left) - getHandClassMatrixIndex(right);
  }

  function getHandClassMatrixIndex(handClass) {
    const normalized = normalizeHandClass(handClass);
    if (normalized.length === 2) {
      const rank = rankIndex(normalized[0]);
      return rank * 13 + rank;
    }

    const first = rankIndex(normalized[0]);
    const second = rankIndex(normalized[1]);
    return normalized[2] === "s" ? first * 13 + second : second * 13 + first;
  }

  function formatAction(actionId, legalActions) {
    return legalActions.find((action) => action.id === actionId)?.label || actionId;
  }

  function rankIndex(rank) {
    return RANK_ORDER.indexOf(rank);
  }

  function clamp01(value) {
    return Math.max(0, Math.min(1, Number(value) || 0));
  }

  function round(value) {
    return Math.round((Number(value) || 0) * 1000000) / 1000000;
  }

  const api = {
    MIXED_ACTION_MIN_FREQUENCY,
    TINY_ACTION_MAX_FREQUENCY,
    RANK_ORDER,
    normalizePreflopRangePack,
    getPreflopSpot,
    getPreflopHandStrategy,
    getPreferredPreflopAction,
    gradePreflopAnswer,
    buildPreflopRangeMatrix,
    samplePreflopQuestion,
    resolvePreflopDrillSpotIds,
    normalizeHandClass,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.FishKillerPreflopEngine = api;
})(typeof window !== "undefined" ? window : globalThis);
