(function attachFishKillerTraining(globalScope) {
  const RANK_ORDER = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

  function validateSolvedTree(tree) {
    const errors = [];
    if (!tree || typeof tree !== "object") {
      return { valid: false, errors: ["Tree must be an object."] };
    }

    if (!tree.treeId) errors.push("Missing treeId.");
    if (!tree.nodes || typeof tree.nodes !== "object") errors.push("Missing nodes object.");
    if (tree.nodes && !tree.nodes.root) errors.push("Missing root node.");

    Object.values(tree.nodes || {}).forEach((node) => {
      if (!node.nodeId) errors.push("A node is missing nodeId.");
      if (!node.actor) errors.push(`${node.nodeId || "unknown"} is missing actor.`);
      (node.legalActions || []).forEach((action) => {
        if (!action.id || !action.type) errors.push(`${node.nodeId} has an action missing id/type.`);
      });
      Object.entries(node.children || {}).forEach(([actionId, childId]) => {
        if (!tree.nodes[childId]) errors.push(`${node.nodeId}.${actionId} points to missing child ${childId}.`);
      });
    });

    return { valid: errors.length === 0, errors };
  }

  function normalizeSolvedTrees(rawTrees) {
    return (Array.isArray(rawTrees) ? rawTrees : [])
      .map(normalizeSolvedTree)
      .filter((tree) => validateSolvedTree(tree).valid);
  }

  function normalizeSolvedTree(tree) {
    const nodes = {};
    Object.entries(tree.nodes || {}).forEach(([key, node]) => {
      const nodeId = node.nodeId || key;
      nodes[nodeId] = {
        nodeId,
        street: node.street || getStreetFromBoard(node.board || tree.metadata?.flop || []),
        board: node.board || tree.metadata?.flop || [],
        actor: node.actor || "hero",
        potBb: Number(node.potBb ?? 0),
        effectiveStackBb: Number(node.effectiveStackBb ?? tree.metadata?.stackDepthBb ?? 100),
        legalActions: normalizeActions(node.legalActions || []),
        strategyByCombo: normalizeStrategyMap(node.strategyByCombo || {}),
        defaultStrategy: normalizeStrategyEntry(node.defaultStrategy || null),
        children: node.children || {},
        cardOptions: node.cardOptions || [],
        terminal: node.terminal || null,
      };
    });

    return {
      treeId: tree.treeId,
      label: tree.label || tree.treeId,
      isDemo: Boolean(tree.isDemo),
      metadata: tree.metadata || {},
      nodes,
    };
  }

  function normalizeActions(actions) {
    return actions.map((action) => ({
      id: action.id,
      label: action.label || action.id,
      type: action.type || inferActionType(action.id),
      sizePctPot: Number.isFinite(Number(action.sizePctPot)) ? Number(action.sizePctPot) : null,
      amountBb: Number.isFinite(Number(action.amountBb)) ? Number(action.amountBb) : null,
    }));
  }

  function normalizeStrategyMap(strategyByCombo) {
    return Object.fromEntries(
      Object.entries(strategyByCombo).map(([combo, entry]) => [normalizeCombo(combo), normalizeStrategyEntry(entry)])
    );
  }

  function normalizeStrategyEntry(entry) {
    if (!entry || typeof entry !== "object") {
      return null;
    }

    const actions = {};
    Object.entries(entry.actions || entry.mix || {}).forEach(([actionId, value]) => {
      actions[actionId] = typeof value === "number"
        ? { frequency: clamp01(value), evBb: null }
        : {
            frequency: clamp01(Number(value.frequency ?? 0)),
            evBb: Number.isFinite(Number(value.evBb)) ? Number(value.evBb) : null,
          };
    });

    return {
      actions,
      bestActionId: entry.bestActionId || getBestActionId(actions),
      note: entry.note || "",
      approximate: Boolean(entry.approximate),
    };
  }

  function createTrainingSession({ tree, heroCombo, rng = Math.random }) {
    const normalizedTree = normalizeSolvedTree(tree);
    const validation = validateSolvedTree(normalizedTree);
    if (!validation.valid) {
      throw new Error(`Invalid solved tree: ${validation.errors.join("; ")}`);
    }

    const combo = resolveHeroCombo(normalizedTree, heroCombo);
    const root = normalizedTree.nodes.root;
    return {
      sessionId: `tree-${Date.now()}-${Math.floor(rng() * 1000000)}`,
      mode: "solved-tree",
      treeId: normalizedTree.treeId,
      tree: normalizedTree,
      currentNodeId: "root",
      heroPosition: normalizedTree.metadata.heroPosition || "BTN",
      villainPosition: normalizedTree.metadata.villainPosition || "BB",
      heroCombo: combo,
      heroCards: parseCombo(combo),
      board: [...(root.board || normalizedTree.metadata.flop || [])],
      potBb: Number(root.potBb || 0),
      effectiveStackBb: Number(root.effectiveStackBb || normalizedTree.metadata.stackDepthBb || 100),
      actionHistory: [],
      decisions: [],
      feedback: [],
      status: "active",
      terminal: null,
      awaitingNextStreet: false,
      rng,
    };
  }

  function createPreflopSimulator({
    tableSize = "six",
    seats = [],
    heroPosition = "BTN",
    villainPosition = "BB",
    heroSeat = "",
    villainSeat = "",
    openSizeBb = 2.5,
    rootPotBb = 5.5,
    effectiveStackBb = 100,
    smallBlindBb = 0.5,
    bigBlindBb = 1,
  } = {}) {
    const seatLabels = normalizeSeatLabels(seats, tableSize);
    const resolvedHeroSeat = heroSeat || findSeatForPosition(seatLabels, heroPosition) || seatLabels[0] || heroPosition;
    const resolvedVillainSeat = villainSeat || findSeatForPosition(seatLabels, villainPosition) || seatLabels[seatLabels.length - 1] || villainPosition;
    const smallBlindSeat = findBlindSeat(seatLabels, "SB", resolvedHeroSeat, resolvedVillainSeat);
    const bigBlindSeat = findBlindSeat(seatLabels, "BB", resolvedHeroSeat, resolvedVillainSeat) || resolvedVillainSeat;
    const contributions = {};
    const history = [];

    if (smallBlindSeat) {
      contributions[smallBlindSeat] = round(smallBlindBb, 2);
      history.push(createPreflopHistoryEntry({
        seat: smallBlindSeat,
        actionId: "post_small_blind",
        label: "Posts SB",
        amountBb: smallBlindBb,
        contributionBb: smallBlindBb,
      }));
    }

    if (bigBlindSeat) {
      contributions[bigBlindSeat] = round((contributions[bigBlindSeat] || 0) + bigBlindBb, 2);
      history.push(createPreflopHistoryEntry({
        seat: bigBlindSeat,
        actionId: "post_big_blind",
        label: "Posts BB",
        amountBb: bigBlindBb,
        contributionBb: contributions[bigBlindSeat],
      }));
    }

    return {
      street: "preflop",
      tableSize,
      seats: seatLabels,
      heroPosition,
      villainPosition,
      heroSeat: resolvedHeroSeat,
      villainSeat: resolvedVillainSeat,
      smallBlindSeat,
      bigBlindSeat,
      openSizeBb: Number(openSizeBb) || 2.5,
      rootPotBb: Number(rootPotBb) || 0,
      effectiveStackBb: Number(effectiveStackBb) || 100,
      contributions,
      potBb: sumContributions(contributions),
      history,
      currentSeatIndex: 0,
      currentActorSeat: seatLabels[0] || "",
      legalActions: [],
      status: "active",
      heroOpened: false,
      terminal: null,
      lastAction: history[history.length - 1] || null,
    };
  }

  function advancePreflopUntilUser(preflop) {
    if (!preflop || !Array.isArray(preflop.seats)) {
      return preflop;
    }

    let guard = 0;
    while (preflop.status === "active" && guard < 30) {
      guard += 1;
      const seat = preflop.seats[preflop.currentSeatIndex];

      if (!seat) {
        completePreflop(preflop);
        break;
      }

      preflop.currentActorSeat = seat;
      if (seat === preflop.heroSeat && !preflop.heroOpened) {
        preflop.status = "awaiting_hero";
        preflop.legalActions = getPreflopHeroActions(preflop);
        return preflop;
      }

      if (!preflop.heroOpened) {
        recordPreflopAction(preflop, seat, {
          actionId: "fold",
          label: "Folds",
          type: "fold",
          folded: true,
        });
        preflop.currentSeatIndex += 1;
        continue;
      }

      if (seat === preflop.villainSeat) {
        const callAmountBb = Math.max(0, preflop.openSizeBb - (preflop.contributions[seat] || 0));
        recordPreflopAction(preflop, seat, {
          actionId: "call",
          label: `Calls ${formatBb(callAmountBb)}`,
          type: "call",
          amountBb: callAmountBb,
          contributionBb: preflop.openSizeBb,
        });
        completePreflop(preflop);
        return preflop;
      }

      recordPreflopAction(preflop, seat, {
        actionId: "fold",
        label: "Folds",
        type: "fold",
        folded: true,
      });
      preflop.currentSeatIndex += 1;
    }

    return preflop;
  }

  function applyPreflopHeroAction(preflop, actionId) {
    if (!preflop) {
      throw new Error("No preflop state.");
    }

    if (preflop.status !== "awaiting_hero") {
      return {
        ok: false,
        error: "not_hero_turn",
        message: "It is not Hero's preflop turn.",
      };
    }

    const action = getPreflopHeroActions(preflop).find((candidate) => candidate.id === actionId);
    if (!action) {
      return {
        ok: false,
        error: "unsupported_action",
        message: `${actionId} is not available in this preflop line.`,
        legalActions: getPreflopHeroActions(preflop),
      };
    }

    if (action.type === "fold") {
      recordPreflopAction(preflop, preflop.heroSeat, {
        actionId: "fold",
        label: "Folds",
        type: "fold",
        folded: true,
      });
      preflop.status = "terminal";
      preflop.terminal = {
        type: "fold",
        winner: "villain",
        summary: "Hero folds preflop before entering the solved postflop tree.",
      };
      preflop.legalActions = [];
      return {
        ok: true,
        feedback: createPreflopFeedback(preflop, action),
        preflop,
      };
    }

    recordPreflopAction(preflop, preflop.heroSeat, {
      actionId: action.id,
      label: action.label,
      type: "raise",
      amountBb: Math.max(0, preflop.openSizeBb - (preflop.contributions[preflop.heroSeat] || 0)),
      contributionBb: preflop.openSizeBb,
    });
    preflop.heroOpened = true;
    preflop.status = "active";
    preflop.legalActions = [];
    preflop.currentSeatIndex = preflop.seats.indexOf(preflop.heroSeat) + 1;
    advancePreflopUntilUser(preflop);

    return {
      ok: true,
      feedback: createPreflopFeedback(preflop, action),
      preflop,
    };
  }

  function getCurrentNode(session) {
    return session?.tree?.nodes?.[session.currentNodeId] || null;
  }

  function getLegalActions(session) {
    const node = getCurrentNode(session);
    return node?.legalActions || [];
  }

  function getCurrentStrategy(session, combo = session.heroCombo) {
    const node = getCurrentNode(session);
    return getStrategyForNode(node, combo);
  }

  function applyHeroAction(session, actionId, rng = session.rng || Math.random) {
    const node = getCurrentNode(session);
    if (!node) throw new Error("No current node.");
    if (session.status !== "active") throw new Error("Hand is not active.");
    if (node.actor !== "hero") throw new Error(`Current actor is ${node.actor}, not hero.`);

    const action = node.legalActions.find((candidate) => candidate.id === actionId);
    if (!action) {
      return {
        ok: false,
        error: "unsupported_action",
        message: `${actionId} is not available in this solved node.`,
        legalActions: node.legalActions,
      };
    }

    const feedback = createDecisionFeedback(node, session.heroCombo, actionId);
    recordAction(session, "hero", node, action);
    session.decisions.push({
      nodeId: node.nodeId,
      street: node.street,
      board: [...node.board],
      actionId,
      feedback,
    });
    session.feedback.push(feedback);
    advanceToChild(session, node, actionId);
    autoAdvanceNonHero(session, rng);
    return { ok: true, feedback, session };
  }

  function autoAdvanceNonHero(session, rng = session.rng || Math.random) {
    let guard = 0;
    while (session.status === "active" && guard < 20) {
      guard += 1;
      const node = getCurrentNode(session);
      if (!node) {
        session.status = "terminal";
        return session;
      }

      syncStateFromNode(session, node);

      if (node.actor === "hero") {
        return session;
      }

      if (node.actor === "terminal" || node.terminal) {
        completeHand(session, node.terminal || { type: "showdown" });
        return session;
      }

      if (node.actor === "chance") {
        const chosen = sampleChanceCard(node, rng, session);
        const nextNodeId = chosen.childNodeId || node.children?.[chosen.card];
        session.board = [...(chosen.board || node.board || session.board)];
        session.awaitingNextStreet = true;
        session.actionHistory.push({
          actor: "dealer",
          street: node.street,
          actionId: "deal_card",
          label: chosen.card ? `Deals ${chosen.card}` : "Runout unavailable",
          board: [...session.board],
          potBb: Number(node.potBb ?? session.potBb),
          approximate: Boolean(chosen.blocked),
        });
        session.currentNodeId = nextNodeId;
        continue;
      }

      if (node.actor === "villain") {
        const strategy = getStrategyForNode(node, session.heroCombo) || buildFallbackStrategy(node);
        const sampled = sampleWeightedAction(strategy.actions, rng);
        const action = node.legalActions.find((candidate) => candidate.id === sampled.actionId) || node.legalActions[0];
        recordAction(session, "villain", node, action, strategy.approximate);
        advanceToChild(session, node, action.id);
        continue;
      }

      return session;
    }

    return session;
  }

  function createDecisionFeedback(node, combo, actionId) {
    const strategy = getStrategyForNode(node, combo);
    const actionStrategy = strategy?.actions?.[actionId] || null;
    const bestActionId = strategy?.bestActionId || getBestActionId(strategy?.actions || {});
    const best = bestActionId ? strategy?.actions?.[bestActionId] : null;
    const chosenEv = Number.isFinite(actionStrategy?.evBb) ? actionStrategy.evBb : null;
    const bestEv = Number.isFinite(best?.evBb) ? best.evBb : null;
    const evLossBb = chosenEv !== null && bestEv !== null ? round(Math.max(0, bestEv - chosenEv), 3) : null;
    const chosenFrequency = actionStrategy ? actionStrategy.frequency : 0;
    const severity = classifySeverity({ actionId, bestActionId, chosenFrequency, evLossBb, hasStrategy: Boolean(strategy) });

    return {
      nodeId: node.nodeId,
      street: node.street,
      chosenActionId: actionId,
      preferredActionId: bestActionId || actionId,
      chosenFrequency,
      chosenEvBb: chosenEv,
      bestEvBb: bestEv,
      evLossBb,
      severity,
      approximate: !strategy || Boolean(strategy.approximate),
      explanation: buildFeedbackText(node, actionId, bestActionId || actionId, chosenFrequency, evLossBb, !strategy || Boolean(strategy.approximate)),
    };
  }

  function buildHandReview(session) {
    const decisions = session.decisions || [];
    const totalEvLossBb = round(decisions.reduce((sum, decision) => sum + (decision.feedback.evLossBb || 0), 0), 3);
    const biggestMistake = decisions
      .filter((decision) => decision.feedback.evLossBb !== null)
      .sort((a, b) => b.feedback.evLossBb - a.feedback.evLossBb)[0] || null;
    const bestDecision = decisions
      .filter((decision) => decision.feedback.severity === "good")
      .sort((a, b) => (b.feedback.chosenEvBb ?? -Infinity) - (a.feedback.chosenEvBb ?? -Infinity))[0] || decisions[0] || null;

    return {
      treeId: session.treeId,
      heroCombo: session.heroCombo,
      board: [...session.board],
      terminal: session.terminal,
      totalEvLossBb,
      biggestMistake,
      bestDecision,
      decisions,
      theme: getReviewTheme(decisions),
      studySuggestion: getStudySuggestion(decisions),
    };
  }

  function sampleWeightedAction(actions, rng = Math.random) {
    const entries = Object.entries(actions || {})
      .map(([actionId, value]) => [actionId, Math.max(0, Number(value.frequency ?? value ?? 0))])
      .filter(([, frequency]) => frequency > 0);

    if (!entries.length) {
      return { actionId: "", frequency: 0, fallback: true };
    }

    const total = entries.reduce((sum, [, frequency]) => sum + frequency, 0);
    let roll = rng() * total;
    for (const [actionId, frequency] of entries) {
      roll -= frequency;
      if (roll <= 0) {
        return { actionId, frequency: frequency / total, fallback: false };
      }
    }

    const [actionId, frequency] = entries[entries.length - 1];
    return { actionId, frequency: frequency / total, fallback: false };
  }

  function getStrategyForNode(node, combo) {
    if (!node) return null;
    const normalized = normalizeCombo(combo);
    const handClass = comboToHandClass(normalized);
    return node.strategyByCombo?.[normalized] ||
      node.strategyByCombo?.[handClass] ||
      node.defaultStrategy ||
      null;
  }

  function buildFallbackStrategy(node) {
    const firstAction = node?.legalActions?.[0]?.id || "check";
    return {
      actions: { [firstAction]: { frequency: 1, evBb: null } },
      bestActionId: firstAction,
      approximate: true,
      note: "Fallback strategy; solver frequencies missing.",
    };
  }

  function getPreflopHeroActions(preflop) {
    const openSize = Number(preflop?.openSizeBb) || 2.5;
    return [
      {
        id: `open_${String(openSize).replace(".", "_")}bb`,
        label: `Open ${formatBb(openSize)}`,
        type: "raise",
        amountBb: openSize,
      },
      {
        id: "fold",
        label: "Fold",
        type: "fold",
      },
    ];
  }

  function createPreflopFeedback(preflop, action) {
    const openActionId = getPreflopHeroActions(preflop)[0].id;
    const isOpen = action.id === openActionId;
    return {
      nodeId: "preflop",
      street: "preflop",
      chosenActionId: action.id,
      preferredActionId: openActionId,
      chosenFrequency: isOpen ? 1 : 0,
      chosenEvBb: null,
      bestEvBb: null,
      evLossBb: null,
      severity: isOpen ? "good" : "blunder",
      approximate: true,
      explanation: isOpen
        ? `${action.label} enters the supported ${preflop.heroPosition} vs ${preflop.villainPosition} single-raised-pot tree. The table action is now carried into the flop.`
        : `Folding ends the hand before the solved postflop branch. Open ${formatBb(preflop.openSizeBb)} is the supported training line here.`,
    };
  }

  function recordPreflopAction(preflop, seat, action) {
    if (action.contributionBb !== undefined) {
      preflop.contributions[seat] = round(Number(action.contributionBb) || 0, 2);
    } else if (action.amountBb) {
      preflop.contributions[seat] = round((preflop.contributions[seat] || 0) + Number(action.amountBb), 2);
    }

    preflop.potBb = sumContributions(preflop.contributions);
    const entry = createPreflopHistoryEntry({
      seat,
      actionId: action.actionId || action.id,
      label: action.label,
      type: action.type,
      amountBb: action.amountBb || 0,
      contributionBb: preflop.contributions[seat] || 0,
      folded: Boolean(action.folded),
      isHero: seat === preflop.heroSeat,
      isVillain: seat === preflop.villainSeat,
    });
    preflop.history.push(entry);
    preflop.lastAction = entry;
    return entry;
  }

  function createPreflopHistoryEntry({
    seat,
    actionId,
    label,
    type = "blind",
    amountBb = 0,
    contributionBb = 0,
    folded = false,
    isHero = false,
    isVillain = false,
  }) {
    return {
      actor: isHero ? "hero" : isVillain ? "villain" : "table",
      seat,
      position: seat,
      street: "preflop",
      actionId,
      type,
      label,
      amountBb: round(amountBb, 2),
      contributionBb: round(contributionBb, 2),
      folded,
    };
  }

  function completePreflop(preflop) {
    preflop.status = "complete";
    preflop.currentActorSeat = "";
    preflop.legalActions = [];
    if (preflop.rootPotBb && Math.abs(preflop.potBb - preflop.rootPotBb) <= 0.75) {
      preflop.potBb = round(preflop.rootPotBb, 2);
    }
    return preflop;
  }

  function recordAction(session, actor, node, action, approximate = false) {
    const entry = {
      actor,
      position: actor === "hero" ? session.heroPosition : actor === "villain" ? session.villainPosition : actor,
      nodeId: node.nodeId,
      street: node.street,
      actionId: action.id,
      label: action.label,
      potBeforeBb: Number(node.potBb ?? session.potBb),
      potBb: Number(node.potBb ?? session.potBb),
      approximate,
    };
    updatePotForAction(session, node, action);
    entry.potBb = session.potBb;
    session.actionHistory.push(entry);
  }

  function advanceToChild(session, node, actionId) {
    const childId = node.children?.[actionId];
    if (!childId) {
      completeHand(session, { type: "terminal", reason: "No child node for selected action." });
      return;
    }
    session.currentNodeId = childId;
  }

  function syncStateFromNode(session, node) {
    session.potBb = Number(node.potBb ?? session.potBb);
    session.effectiveStackBb = Number(node.effectiveStackBb ?? session.effectiveStackBb);
    session.board = [...(node.board || session.board)];
  }

  function completeHand(session, terminal) {
    session.status = terminal.type === "fold" ? "folded" : terminal.type === "showdown" ? "showdown" : "terminal";
    session.terminal = terminal;
    session.currentNodeId = "";
    session.review = buildHandReview(session);
  }

  function updatePotForAction(session, node, action) {
    if (action.type === "bet" && action.sizePctPot) {
      session.potBb = round(node.potBb + node.potBb * (action.sizePctPot / 100), 2);
    } else if (action.type === "call" && action.amountBb) {
      session.potBb = round(node.potBb + action.amountBb, 2);
    } else if (action.type === "raise" && action.amountBb) {
      session.potBb = round(node.potBb + action.amountBb, 2);
    } else {
      session.potBb = Number(node.potBb ?? session.potBb);
    }
  }

  function sampleChanceCard(node, rng, session = null) {
    const options = getCompatibleChanceOptions(node, session);
    if (!options.length) {
      return { card: "", board: node.board || session?.board || [], childNodeId: "", blocked: true };
    }
    const index = Math.floor(rng() * options.length) % options.length;
    return options[index];
  }

  function getFirstHeroCombo(tree) {
    return getCompatibleHeroCombos(tree)[0] || getFallbackCompatibleCombo(tree);
  }

  function resolveHeroCombo(tree, requestedCombo) {
    const requested = normalizeCombo(requestedCombo || "");
    if (requested && isComboCompatibleWithTree(tree, requested)) {
      return requested;
    }

    return getFirstHeroCombo(tree);
  }

  function getHeroComboCandidates(tree) {
    const root = tree?.nodes?.root;
    const candidates = [
      ...(tree?.metadata?.heroCombos || []),
      ...Object.keys(root?.strategyByCombo || {}),
    ];
    return [...new Set(candidates.map(normalizeCombo).filter(Boolean))];
  }

  function getCompatibleHeroCombos(tree) {
    return getHeroComboCandidates(tree).filter((combo) => isComboCompatibleWithTree(tree, combo));
  }

  function isComboCompatibleWithTree(tree, combo) {
    const comboCards = parseCombo(combo);
    if (comboCards.length !== 2) {
      return true;
    }

    const boardKeys = getFixedBoardCardKeys(tree);
    return comboCards.every((card) => !boardKeys.has(card.toLowerCase()));
  }

  function getFixedBoardCardKeys(tree) {
    const cards = [
      ...(tree?.metadata?.flop || []),
      ...(tree?.nodes?.root?.board || []),
    ];
    Object.values(tree?.nodes || {}).forEach((node) => {
      if (node.actor !== "chance" || node.cardOptions?.length !== 1) {
        return;
      }
      const forced = node.cardOptions[0];
      cards.push(forced.card, ...(forced.board || []));
    });
    return new Set(cards.filter(Boolean).map((card) => String(card).toLowerCase()));
  }

  function getCompatibleChanceOptions(node, session) {
    const options = node?.cardOptions || [];
    if (!session?.heroCards?.length) {
      return options;
    }

    const used = new Set([
      ...session.heroCards,
      ...(session.board || []),
    ].map((card) => String(card).toLowerCase()));

    return options.filter((option) => {
      const optionCards = [
        option.card,
        ...(option.board || []),
      ].filter(Boolean).map((card) => String(card).toLowerCase());
      return optionCards.every((card) => !used.has(card) || (session.board || []).map((boardCard) => String(boardCard).toLowerCase()).includes(card));
    });
  }

  function getFallbackCompatibleCombo(tree) {
    const blocked = getFixedBoardCardKeys(tree);
    const deck = RANK_ORDER.flatMap((rank) => ["s", "h", "d", "c"].map((suit) => `${rank}${suit}`))
      .filter((card) => !blocked.has(card.toLowerCase()));
    return `${deck[0] || "As"}${deck[1] || "Qs"}`;
  }

  function getBestActionId(actions) {
    return Object.entries(actions || {})
      .sort(([, first], [, second]) => {
        const firstEv = Number.isFinite(first.evBb) ? first.evBb : -Infinity;
        const secondEv = Number.isFinite(second.evBb) ? second.evBb : -Infinity;
        if (secondEv !== firstEv) return secondEv - firstEv;
        return (second.frequency || 0) - (first.frequency || 0);
      })[0]?.[0] || "";
  }

  function classifySeverity({ actionId, bestActionId, chosenFrequency, evLossBb, hasStrategy }) {
    if (!hasStrategy) return "acceptable";
    if (actionId === bestActionId || evLossBb === 0) return "good";
    if (evLossBb !== null) {
      if (evLossBb <= 0.08 || chosenFrequency >= 0.2) return "acceptable";
      if (evLossBb <= 0.45) return "mistake";
      return "blunder";
    }
    if (chosenFrequency >= 0.2) return "acceptable";
    if (chosenFrequency >= 0.05) return "mistake";
    return "blunder";
  }

  function buildFeedbackText(node, chosenActionId, bestActionId, frequency, evLossBb, approximate) {
    const chosenLabel = getActionLabel(node, chosenActionId);
    const bestLabel = getActionLabel(node, bestActionId);
    const frequencyText = `${Math.round((frequency || 0) * 100)}%`;
    const evText = evLossBb === null ? "EV data unavailable." : `Estimated EV loss: ${evLossBb.toFixed(2)}bb.`;
    const sourceText = approximate ? " This uses a fallback because this node has incomplete solver data." : "";

    if (chosenActionId === bestActionId) {
      return `${chosenLabel} is preferred here at ${frequencyText}. ${evText}${sourceText}`;
    }

    if (frequency >= 0.2) {
      return `${bestLabel} is preferred here. Your ${chosenLabel.toLowerCase()} is playable but lower frequency (${frequencyText}). ${evText}${sourceText}`;
    }

    return `${bestLabel} is preferred here. Your ${chosenLabel.toLowerCase()} is a low-frequency line (${frequencyText}). ${evText}${sourceText}`;
  }

  function getActionLabel(node, actionId) {
    return node?.legalActions?.find((action) => action.id === actionId)?.label || actionId || "Unknown";
  }

  function getReviewTheme(decisions) {
    const mistakes = decisions.filter((decision) => ["mistake", "blunder"].includes(decision.feedback.severity));
    if (!mistakes.length) return "You followed the solved tree closely across the hand.";
    const firstMistake = mistakes[0];
    if (firstMistake.street === "flop") return "You gave up too much value or pressure at the flop root.";
    if (firstMistake.street === "turn") return "The biggest leak appeared in the turn continuation branch.";
    return "River discipline was the main pressure point.";
  }

  function getStudySuggestion(decisions) {
    const blunder = decisions.find((decision) => decision.feedback.severity === "blunder");
    if (blunder) return `Review ${blunder.street} ${blunder.feedback.preferredActionId} branches for this texture.`;
    const mistake = decisions.find((decision) => decision.feedback.severity === "mistake");
    if (mistake) return `Compare the EV of ${mistake.feedback.chosenActionId} versus ${mistake.feedback.preferredActionId} on this board.`;
    return "Replay the hand once with a different combo from the same range.";
  }

  function parseCombo(combo) {
    const matches = String(combo).match(/[2-9TJQKA][cdhs]/gi);
    return matches ? matches.map((card) => card[0].toUpperCase() + card[1].toLowerCase()) : [];
  }

  function normalizeCombo(combo) {
    const cards = parseCombo(combo);
    if (cards.length !== 2) return String(combo || "");
    return cards.sort((a, b) => RANK_ORDER.indexOf(a[0]) - RANK_ORDER.indexOf(b[0])).join("");
  }

  function normalizeSeatLabels(seats, tableSize) {
    const labels = (seats || []).map((seat) => typeof seat === "string" ? seat : seat?.seat).filter(Boolean);
    if (labels.length) return labels;
    if (tableSize === "hu") return ["SB / BTN", "BB"];
    if (tableSize === "three") return ["BTN", "SB", "BB"];
    if (tableSize === "nine") return ["UTG", "UTG+1", "MP", "LJ", "HJ", "CO", "BTN", "SB", "BB"];
    return ["UTG", "HJ", "CO", "BTN", "SB", "BB"];
  }

  function findSeatForPosition(seats, position) {
    if (!position) return "";
    const normalizedPosition = String(position).toUpperCase();
    return seats.find((seat) => String(seat).toUpperCase() === normalizedPosition) ||
      seats.find((seat) => String(seat).toUpperCase().includes(normalizedPosition)) ||
      "";
  }

  function findBlindSeat(seats, blind, heroSeat, villainSeat) {
    if (blind === "BB" && villainSeat && String(villainSeat).toUpperCase().includes("BB")) {
      return villainSeat;
    }
    if (blind === "SB" && heroSeat && String(heroSeat).toUpperCase().includes("SB")) {
      return heroSeat;
    }
    return seats.find((seat) => {
      const normalized = String(seat).toUpperCase();
      return blind === "SB" ? normalized === "SB" || normalized.includes("SB") : normalized === "BB" || normalized.includes("BB");
    }) || "";
  }

  function sumContributions(contributions) {
    return round(Object.values(contributions || {}).reduce((sum, value) => sum + (Number(value) || 0), 0), 2);
  }

  function formatBb(value) {
    return `${round(value, 2)}bb`;
  }

  function comboToHandClass(combo) {
    const cards = parseCombo(combo);
    if (cards.length !== 2) return String(combo || "");
    const sorted = cards.sort((a, b) => RANK_ORDER.indexOf(a[0]) - RANK_ORDER.indexOf(b[0]));
    if (sorted[0][0] === sorted[1][0]) return `${sorted[0][0]}${sorted[1][0]}`;
    return `${sorted[0][0]}${sorted[1][0]}${sorted[0][1] === sorted[1][1] ? "s" : "o"}`;
  }

  function inferActionType(actionId) {
    if (actionId.includes("check")) return "check";
    if (actionId.includes("fold")) return "fold";
    if (actionId.includes("call")) return "call";
    if (actionId.includes("raise")) return "raise";
    if (actionId.includes("bet")) return "bet";
    return "action";
  }

  function getStreetFromBoard(board) {
    if (!board || board.length <= 3) return "flop";
    if (board.length === 4) return "turn";
    return "river";
  }

  function clamp01(value) {
    return Math.max(0, Math.min(1, Number(value) || 0));
  }

  function round(value, decimals = 4) {
    const multiplier = 10 ** decimals;
    return Math.round((Number(value) || 0) * multiplier) / multiplier;
  }

  const api = {
    validateSolvedTree,
    normalizeSolvedTrees,
    normalizeSolvedTree,
    createTrainingSession,
    createPreflopSimulator,
    advancePreflopUntilUser,
    applyPreflopHeroAction,
    getPreflopHeroActions,
    getCurrentNode,
    getLegalActions,
    getCurrentStrategy,
    applyHeroAction,
    autoAdvanceNonHero,
    createDecisionFeedback,
    buildHandReview,
    sampleWeightedAction,
    isComboCompatibleWithTree,
    getCompatibleHeroCombos,
    normalizeCombo,
    comboToHandClass,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.FishKillerTraining = api;
})(typeof window !== "undefined" ? window : globalThis);
