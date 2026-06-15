(function initTableView(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.FishKillerTableView = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function buildTableViewApi() {
  function createTableSessionState(input) {
    const foldedSeats = Object.entries(input.seatStates || {})
      .filter(([, seatState]) => seatState.status === "folded" || /fold/i.test(seatState.label || ""))
      .map(([seat]) => seat);
    const actingSeat = Object.entries(input.seatStates || {})
      .find(([, seatState]) => /to act/i.test(seatState.label || ""))?.[0] || input.scenario?.heroSeat || "";

    return {
      seats: input.visualLayout?.seats || [],
      heroSeat: input.scenario?.heroSeat || "",
      actingSeat,
      foldedSeats,
      potBb: input.potBb || 0,
      heroCards: input.heroCards || [],
      villainActions: input.question?.preflopResponses || [],
      legalActions: input.question?.legalActions || [],
      selectedAction: input.question?.selected || "",
      feedbackState: input.question?.answered
        ? input.question.isCorrect ? "correct" : input.question.isMixed ? "mixed" : "wrong"
        : "waiting",
      scenario: input.scenario,
      bettingSummary: input.bettingSummary,
      spot: input.spot,
      question: input.question,
      visualLayout: input.visualLayout,
      actorMap: input.actorMap || {},
      seatStates: input.seatStates || {},
      displayedSeatStates: input.displayedSeatStates || input.seatStates || {},
      board: input.board || [],
      potLabel: input.potLabel || "",
      villainResponse: input.villainResponse || null,
    };
  }

  function renderTableView(elements, tableState, helpers) {
    if (!elements?.tableVisual || !tableState?.scenario) {
      return;
    }

    const boardMarkup = tableState.board.length
      ? helpers.createBoardMarkup(tableState.board, tableState.spot?.street, tableState.potLabel)
      : "";
    const potMarkup = tableState.board.length ? "" : helpers.createTablePotMarkup(tableState.potLabel);
    const stageHeroCardsMarkup = !tableState.board.length
      ? helpers.createStageHeroCardsMarkup(tableState.heroCards)
      : "";
    const responseMarkup = tableState.villainResponse ? helpers.createVillainResponseMarkup(tableState.villainResponse) : "";
    const showdownMarkup = tableState.question?.showdownResult ? helpers.createShowdownMarkup(tableState.question.showdownResult) : "";
    const seatMarkup = tableState.seats.map((seatConfig) => renderSeat(seatConfig, tableState, helpers, stageHeroCardsMarkup)).join("");

    elements.tableVisual.innerHTML = `${boardMarkup}${potMarkup}${stageHeroCardsMarkup}${responseMarkup}${showdownMarkup}${seatMarkup}`;
    helpers.hydrateSeatAvatarImages(elements.tableVisual);
    helpers.animationHooks?.onStateRendered(tableState);
  }

  function renderSeat(seatConfig, tableState, helpers, stageHeroCardsMarkup) {
    const actor = tableState.actorMap[seatConfig.seat];
    const isHero = seatConfig.seat === tableState.heroSeat;
    const seatState = tableState.displayedSeatStates[seatConfig.seat] || {};
    const isVillainResponseSeat = tableState.villainResponse?.seat === seatConfig.seat;
    const seatAnchor = seatConfig.anchor || "default";
    const className = [
      "seat-node",
      `seat-anchor-${seatAnchor}`,
      isHero ? "hero" : "",
      actor || isVillainResponseSeat ? "action" : "",
      isVillainResponseSeat ? "villain-recent" : "",
      tableState.actingSeat === seatConfig.seat ? "acting-seat" : "",
      tableState.foldedSeats.includes(seatConfig.seat) ? "folded-seat" : "",
      seatState.status || "",
    ].filter(Boolean).join(" ");
    const isPostflop = tableState.spot?.street && tableState.spot.street !== "preflop";
    const actionLabel = isVillainResponseSeat
      ? helpers.formatVillainResponseLabel(tableState.villainResponse)
      : seatState.pendingFoldAnimation
        ? seatState.label
        : isPostflop && seatState.label
          ? seatState.label
          : tableState.bettingSummary.actionBySeat[seatConfig.seat] || actor?.label;
    const caption = isHero ? "Hero to act" : isVillainResponseSeat ? actionLabel : actor ? actionLabel : seatState.label || "Waiting";
    const heroCardsMarkup = isHero && !stageHeroCardsMarkup ? helpers.createSeatHeroCardsMarkup(tableState.heroCards) : "";
    const avatarMarkup = helpers.createSeatAvatarMarkup(seatConfig.seat, isHero);
    const chromeSide = helpers.getSeatChromeSide(seatAnchor, isHero, seatConfig.seat);
    const chromeMarkup = helpers.createSeatChromeMarkup(chromeSide);

    return `
      <div class="${className}" data-seat="${seatConfig.seat}" style="--x: ${seatConfig.x}; --y: ${seatConfig.y};">
        <div class="seat-hero-hand">
          ${heroCardsMarkup}
        </div>
        <div class="seat-player">
          <div class="seat-main seat-orient-${chromeSide}">
            ${chromeMarkup}
            ${avatarMarkup}
            <div class="seat-marker">${seatConfig.seat}</div>
            <div class="seat-caption">${caption}</div>
          </div>
        </div>
      </div>
    `;
  }

  return Object.freeze({ createTableSessionState, renderTableView });
});
