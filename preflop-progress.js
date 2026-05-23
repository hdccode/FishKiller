(function attachFishKillerPreflopProgress(globalScope) {
  const MAX_RECENT_MISTAKES = 50;

  function createPreflop6maxProgress() {
    return {
      attemptsBySpotHand: {},
      mistakes: [],
      totals: {
        attempts: 0,
        correct: 0,
        mixed: 0,
        mistakes: 0,
      },
    };
  }

  function normalizePreflop6maxProgress(progress) {
    const defaults = createPreflop6maxProgress();
    if (!progress || typeof progress !== "object" || Array.isArray(progress)) {
      return defaults;
    }

    const attemptsBySpotHand = {};
    Object.entries(progress.attemptsBySpotHand || {}).forEach(([key, value]) => {
      if (!value || typeof value !== "object") {
        return;
      }
      attemptsBySpotHand[key] = {
        attempts: toCount(value.attempts),
        correct: toCount(value.correct),
        mixed: toCount(value.mixed),
        mistakes: toCount(value.mistakes),
        lastResult: String(value.lastResult || ""),
        lastChosenActionId: String(value.lastChosenActionId || ""),
        lastPreferredActionId: String(value.lastPreferredActionId || ""),
        updatedAt: toTimestamp(value.updatedAt),
      };
    });

    return {
      attemptsBySpotHand,
      mistakes: normalizeMistakes(progress.mistakes),
      totals: {
        attempts: toCount(progress.totals?.attempts),
        correct: toCount(progress.totals?.correct),
        mixed: toCount(progress.totals?.mixed),
        mistakes: toCount(progress.totals?.mistakes),
      },
    };
  }

  function recordPreflop6maxAttempt(progress, attempt, now = Date.now()) {
    const next = normalizePreflop6maxProgress(progress);
    const normalizedAttempt = normalizeAttempt(attempt, now);
    const key = getSpotHandKey(normalizedAttempt.spotId, normalizedAttempt.handClass);
    const previous = next.attemptsBySpotHand[key] || {
      attempts: 0,
      correct: 0,
      mixed: 0,
      mistakes: 0,
      lastResult: "",
      lastChosenActionId: "",
      lastPreferredActionId: "",
      updatedAt: 0,
    };
    const isCorrect = normalizedAttempt.resultKind === "correct";
    const isMixed = normalizedAttempt.resultKind === "mixed";
    const isMistake = isMistakeKind(normalizedAttempt.resultKind);

    next.attemptsBySpotHand[key] = {
      ...previous,
      attempts: previous.attempts + 1,
      correct: previous.correct + (isCorrect ? 1 : 0),
      mixed: previous.mixed + (isMixed ? 1 : 0),
      mistakes: previous.mistakes + (isMistake ? 1 : 0),
      lastResult: normalizedAttempt.resultKind,
      lastChosenActionId: normalizedAttempt.chosenActionId,
      lastPreferredActionId: normalizedAttempt.preferredActionId,
      updatedAt: normalizedAttempt.updatedAt,
    };

    next.totals.attempts += 1;
    if (isCorrect) next.totals.correct += 1;
    if (isMixed) next.totals.mixed += 1;
    if (isMistake) next.totals.mistakes += 1;

    if (isMistake) {
      next.mistakes = [
        normalizedAttempt,
        ...next.mistakes.filter((mistake) => getSpotHandKey(mistake.spotId, mistake.handClass) !== key),
      ].slice(0, MAX_RECENT_MISTAKES);
    }

    return next;
  }

  function samplePreflop6maxMistake(progress, { rng = Math.random } = {}) {
    const normalized = normalizePreflop6maxProgress(progress);
    if (!normalized.mistakes.length) {
      return null;
    }
    const index = Math.max(0, Math.min(normalized.mistakes.length - 1, Math.floor(clamp01(rng()) * normalized.mistakes.length)));
    return normalized.mistakes[index];
  }

  function hasPreflop6maxMistakes(progress) {
    return normalizePreflop6maxProgress(progress).mistakes.length > 0;
  }

  function getSpotHandKey(spotId, handClass) {
    return `${spotId}|${handClass}`;
  }

  function normalizeMistakes(mistakes) {
    return (Array.isArray(mistakes) ? mistakes : [])
      .map((mistake) => normalizeAttempt(mistake, mistake?.updatedAt || Date.now()))
      .filter((mistake) => mistake.spotId && mistake.handClass)
      .slice(0, MAX_RECENT_MISTAKES);
  }

  function normalizeAttempt(attempt, now) {
    return {
      spotId: String(attempt?.spotId || ""),
      handClass: String(attempt?.handClass || ""),
      chosenActionId: String(attempt?.chosenActionId || ""),
      preferredActionId: String(attempt?.preferredActionId || ""),
      chosenFrequency: toFrequency(attempt?.chosenFrequency),
      preferredFrequency: toFrequency(attempt?.preferredFrequency),
      resultKind: normalizeResultKind(attempt?.resultKind),
      updatedAt: toTimestamp(attempt?.updatedAt || now),
    };
  }

  function normalizeResultKind(resultKind) {
    return ["correct", "mixed", "mistake", "illegal"].includes(resultKind) ? resultKind : "mistake";
  }

  function isMistakeKind(resultKind) {
    return resultKind === "mistake" || resultKind === "illegal";
  }

  function toCount(value) {
    return Math.max(0, Math.floor(Number(value) || 0));
  }

  function toFrequency(value) {
    return clamp01(Number(value) || 0);
  }

  function toTimestamp(value) {
    const numeric = Number(value);
    return Number.isFinite(numeric) && numeric > 0 ? numeric : Date.now();
  }

  function clamp01(value) {
    return Math.max(0, Math.min(1, Number(value) || 0));
  }

  const api = {
    createPreflop6maxProgress,
    normalizePreflop6maxProgress,
    recordPreflop6maxAttempt,
    samplePreflop6maxMistake,
    hasPreflop6maxMistakes,
    getSpotHandKey,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.FishKillerPreflopProgress = api;
})(typeof window !== "undefined" ? window : globalThis);
