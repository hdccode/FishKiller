(function initFk2TableStateAdapter(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.FishKillerFk2TableStateAdapter = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function buildFk2TableStateAdapterApi() {
  const SEAT_ORDER = Object.freeze(["UTG", "HJ", "CO", "BTN", "SB", "BB"]);
  const DEFAULT_HERO_CARDS = Object.freeze([
    Object.freeze({ rank: "A", suit: Object.freeze({ id: "spade", symbol: "\u2660" }) }),
    Object.freeze({ rank: "K", suit: Object.freeze({ id: "heart", symbol: "\u2665" }) }),
  ]);
  const SUIT_SYMBOL_BY_ID = Object.freeze({
    club: "\u2663",
    clubs: "\u2663",
    c: "\u2663",
    diamond: "\u2666",
    diamonds: "\u2666",
    d: "\u2666",
    heart: "\u2665",
    hearts: "\u2665",
    h: "\u2665",
    spade: "\u2660",
    spades: "\u2660",
    s: "\u2660",
  });
  const SUIT_ID_BY_SYMBOL = Object.freeze({
    "\u2663": "club",
    "\u2666": "diamond",
    "\u2665": "heart",
    "\u2660": "spade",
  });

  function normalizeTableState(tableState = {}) {
    const heroSeat = tableState.heroSeat || tableState.scenario?.heroSeat || "";
    const activeSeat = tableState.actingSeat || heroSeat;
    const foldedSeats = normalizeFoldedSeats(tableState);
    const boardCards = normalizeCards(tableState.boardCards || tableState.board || tableState.spot?.board || [], []);
    const heroCards = normalizeCards(tableState.heroCards || tableState.spot?.heroCards || [], DEFAULT_HERO_CARDS).slice(0, 2);
    const actionsBySeat = normalizeActionsBySeat(tableState);
    const seatMap = Object.fromEntries(SEAT_ORDER.map((seat) => {
      const seatView = normalizeSeat(tableState, seat, {
        heroSeat,
        activeSeat,
        foldedSeats,
        actionsBySeat,
      });
      return [seat, seatView];
    }));

    return {
      ...tableState,
      heroSeat,
      activeSeat,
      actingSeat: activeSeat,
      foldedSeats: Array.from(foldedSeats),
      heroCards,
      boardCards,
      board: boardCards,
      pot: {
        label: tableState.potLabel || "",
        bb: Number(tableState.potBb || tableState.bettingSummary?.pot || 0),
      },
      potLabel: tableState.potLabel || "",
      potBb: Number(tableState.potBb || tableState.bettingSummary?.pot || 0),
      feedbackState: normalizeFeedbackState(tableState),
      selectedAction: tableState.selectedAction || tableState.question?.selected || "",
      actions: normalizeLegalActions(tableState),
      actionsBySeat,
      seats: SEAT_ORDER.map((seat) => seatMap[seat]),
      seatMap,
    };
  }

  function normalizeSeat(tableState, seat, context) {
    const actor = tableState.actorMap?.[seat];
    const seatState = tableState.displayedSeatStates?.[seat] || tableState.seatStates?.[seat] || {};
    const isHero = seat === context.heroSeat;
    const isActing = seat === context.activeSeat;
    const isFolded = context.foldedSeats.has(seat);
    const isVillainRecent = tableState.villainResponse?.seat === seat;
    const isPostflop = tableState.spot?.street && tableState.spot.street !== "preflop";
    const displayedStateLabel = /to act/i.test(seatState.label || "") && !isActing && !isHero
      ? "Waiting"
      : seatState.label;
    const actionLabel = isFolded && !isHero
      ? "Folds"
      : isVillainRecent
        ? formatVillainResponseLabel(tableState.villainResponse)
        : seatState.pendingFoldAnimation
          ? displayedStateLabel
          : isPostflop && displayedStateLabel
            ? displayedStateLabel
            : context.actionsBySeat[seat] || actor?.label || "";
    const caption = isHero
      ? "Hero to act"
      : isVillainRecent
        ? actionLabel
        : isFolded
          ? "Folds"
          : actor
            ? actionLabel
            : displayedStateLabel || "Waiting";

    return {
      seat,
      caption,
      actionLabel,
      isHero,
      isActing,
      isFolded,
      isVillainRecent,
      hasAction: Boolean(actor || actionLabel),
      status: seatState.status || (isFolded ? "folded" : isActing ? "acting" : ""),
    };
  }

  function normalizeFoldedSeats(tableState) {
    const folded = new Set(Array.isArray(tableState.foldedSeats) ? tableState.foldedSeats : []);
    Object.entries(tableState.displayedSeatStates || tableState.seatStates || {}).forEach(([seat, seatState]) => {
      if (seatState?.status === "folded" || /fold/i.test(seatState?.label || "")) {
        folded.add(seat);
      }
    });
    return folded;
  }

  function normalizeActionsBySeat(tableState) {
    return {
      ...(tableState.bettingSummary?.actionBySeat || {}),
      ...(tableState.actionsBySeat || {}),
    };
  }

  function normalizeLegalActions(tableState) {
    return (tableState.legalActions || tableState.question?.legalActions || []).map((action) => ({
      id: action.id || action.option || action.label || "",
      label: action.label || action.option || action.id || "",
      option: action.option || action.label || action.id || "",
      disabled: Boolean(action.disabled),
      selected: action.id === tableState.selectedAction || action.option === tableState.selectedAction,
    }));
  }

  function normalizeFeedbackState(tableState) {
    if (tableState.feedbackState) {
      return tableState.feedbackState;
    }

    const question = tableState.question;
    if (!question?.answered) {
      return "waiting";
    }

    if (question.isCorrect) {
      return "correct";
    }

    return question.isMixed ? "mixed" : "wrong";
  }

  function normalizeCards(cards, fallbackCards) {
    const sourceCards = Array.isArray(cards) && cards.length ? cards : fallbackCards;
    return (sourceCards || []).map((card, index) => normalizeCard(card, fallbackCards?.[index] || DEFAULT_HERO_CARDS[0]));
  }

  function normalizeCard(card, fallback = DEFAULT_HERO_CARDS[0]) {
    if (typeof card === "string") {
      const trimmed = card.trim();
      const rank = normalizeRank(trimmed[0] || fallback.rank);
      const suitSymbol = normalizeSuitSymbol(trimmed.slice(1), fallback.suit);
      return createCard(rank, suitSymbol);
    }

    const rank = normalizeRank(card?.rank || fallback.rank);
    const suit = card?.suit || fallback.suit;
    const suitSymbol = normalizeSuitSymbol(suit, fallback.suit);
    return createCard(rank, suitSymbol, suit);
  }

  function createCard(rank, suitSymbol, suit = null) {
    const suitId = normalizeSuitId(suit, suitSymbol);
    return {
      rank,
      suit: {
        id: suitId,
        symbol: suitSymbol,
      },
      suitSymbol,
      isRed: suitSymbol === "\u2665" || suitSymbol === "\u2666" || suitId === "heart" || suitId === "diamond",
    };
  }

  function normalizeRank(rank) {
    const normalized = String(rank || "").trim().toUpperCase();
    return normalized === "10" ? "T" : normalized || "A";
  }

  function normalizeSuitSymbol(suit, fallbackSuit) {
    if (typeof suit === "string") {
      return SUIT_SYMBOL_BY_ID[suit.toLowerCase()] || suit || fallbackSuit?.symbol || "";
    }

    return suit?.symbol || SUIT_SYMBOL_BY_ID[String(suit?.id || "").toLowerCase()] || fallbackSuit?.symbol || "";
  }

  function normalizeSuitId(suit, suitSymbol) {
    if (typeof suit === "string") {
      const normalized = suit.toLowerCase();
      return SUIT_SYMBOL_BY_ID[normalized] ? normalizeSuitName(normalized) : SUIT_ID_BY_SYMBOL[suit] || normalized;
    }

    return normalizeSuitName(String(suit?.id || "")) || SUIT_ID_BY_SYMBOL[suitSymbol] || "";
  }

  function normalizeSuitName(suitId) {
    if (suitId === "c" || suitId === "clubs") return "club";
    if (suitId === "d" || suitId === "diamonds") return "diamond";
    if (suitId === "h" || suitId === "hearts") return "heart";
    if (suitId === "s" || suitId === "spades") return "spade";
    return suitId;
  }

  function formatVillainResponseLabel(response) {
    if (!response) {
      return "";
    }

    return [response.action, response.amountLabel].filter(Boolean).join(" ");
  }

  return Object.freeze({
    normalizeTableState,
    normalizeCard,
    normalizeCards,
  });
});
