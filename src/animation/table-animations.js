(function initTableAnimations(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.FishKillerTableAnimations = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function buildTableAnimationsApi() {
  function createTableAnimationHooks({ windowRef, tableElement }) {
    let previousState = null;

    function flash(className) {
      if (!tableElement || !className) {
        return;
      }
      tableElement.classList.remove(className);
      void tableElement.offsetWidth;
      tableElement.classList.add(className);
      windowRef.setTimeout(() => tableElement.classList.remove(className), 420);
    }

    return {
      onStateRendered(nextState) {
        if (!nextState) {
          previousState = null;
          return;
        }
        if (previousState && previousState.actingSeat !== nextState.actingSeat) {
          flash("table-hook-acting-seat");
        }
        if (previousState && previousState.potBb !== nextState.potBb) {
          flash("table-hook-pot-changed");
        }
        if (previousState && previousState.selectedAction !== nextState.selectedAction) {
          flash("table-hook-answer-selected");
        }
        if (previousState && previousState.feedbackState !== nextState.feedbackState) {
          flash(`table-hook-feedback-${nextState.feedbackState || "neutral"}`);
        }
        if (previousState && JSON.stringify(previousState.heroCards) !== JSON.stringify(nextState.heroCards)) {
          flash("table-hook-card-update");
        }
        previousState = nextState;
      },
      reset() {
        previousState = null;
      },
    };
  }

  return Object.freeze({ createTableAnimationHooks });
});
