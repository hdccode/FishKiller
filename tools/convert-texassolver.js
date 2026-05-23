#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const SUIT_NAMES = {
  c: "club",
  d: "diamond",
  h: "heart",
  s: "spade",
};

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.input) {
    printUsage();
    process.exit(args.help ? 0 : 1);
  }

  const inputPath = path.resolve(args.input);
  const outputPath = path.resolve(args.output || "solver-library.js");
  const raw = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const initialBoard = parseBoard(args.board || "");
  const maxActionDepth = Number(args.maxActionDepth ?? 0);
  const pot = Number(args.pot || 0);

  const packId = args.packId || slugify(path.basename(inputPath, path.extname(inputPath)));
  if (args.schema === "solved-tree") {
    const tree = convertRawToSolvedTree(raw, args, pot, packId, inputPath, initialBoard);
    const json = JSON.stringify(tree, null, 2);
    const output = shouldWriteJson(args, outputPath)
      ? `${json}\n`
      : `window.FISHKILLER_SOLVED_TREES = (window.FISHKILLER_SOLVED_TREES || []).concat(${JSON.stringify([tree], null, 2)});\n`;

    if (args.output === "-") {
      process.stdout.write(output);
    } else {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, output, "utf8");
      console.log(`Converted ${Object.keys(tree.nodes || {}).length} TexasSolver node(s) into solved tree ${outputPath}`);
    }
    return;
  }

  const nodes = collectActionNodes(raw, {
    board: initialBoard,
    actionPath: [],
    actionDepth: 0,
    maxActionDepth,
  });

  if (!nodes.length) {
    throw new Error("No TexasSolver action nodes with strategy data were found. Try --max-action-depth 2 for deeper nodes.");
  }

  const pack = {
    id: packId,
    name: args.packName || `TexasSolver ${packId}`,
    source: args.source || `TexasSolver export: ${path.basename(inputPath)}`,
    enabled: args.enabled !== "false",
    spots: nodes.map((node, index) => convertNodeToSpot(node, args, pot, index)),
  };

  const library = {
    version: 1,
    packs: [pack],
  };

  const output = `window.FISHKILLER_SOLVER_LIBRARY = ${JSON.stringify(library, null, 2)};\n`;

  if (args.output === "-") {
    process.stdout.write(output);
  } else {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, output, "utf8");
    console.log(`Converted ${nodes.length} TexasSolver node(s) into ${outputPath}`);
  }
}

function convertRawToSolvedTree(raw, args, pot, packId, inputPath, initialBoard) {
  const convertedNodes = {};
  const counters = { action: 0, chance: 0, terminal: 0 };
  const maxActionDepth = Number.isFinite(Number(args.maxActionDepth)) ? Number(args.maxActionDepth) : Infinity;
  const effectiveStackBb = Number(args.effectiveStackBb || args.stackDepthBb || 100);
  const rootId = convertRawNodeToSolvedNode(raw, {
    args,
    convertedNodes,
    counters,
    board: initialBoard,
    potBb: pot,
    effectiveStackBb,
    path: [],
    actionDepth: 0,
    maxActionDepth,
    incomingAction: "",
    parentActor: "",
  });

  if (!rootId || !convertedNodes[rootId]) {
    throw new Error("No TexasSolver action nodes with strategy data were found in the raw export.");
  }

  if (rootId !== "root") {
    convertedNodes.root = { ...convertedNodes[rootId], nodeId: "root" };
    delete convertedNodes[rootId];
    Object.values(convertedNodes).forEach((node) => {
      Object.entries(node.children || {}).forEach(([actionId, childId]) => {
        if (childId === rootId) node.children[actionId] = "root";
      });
      (node.cardOptions || []).forEach((option) => {
        if (option.childNodeId === rootId) option.childNodeId = "root";
      });
    });
  }

  const board = initialBoard.length ? initialBoard : parseBoard(args.board || "");
  return {
    treeId: args.treeId || packId,
    label: args.treeName || args.packName || `TexasSolver ${packId}`,
    isDemo: false,
    metadata: {
      formation: args.formation || "BTN_vs_BB_SRP",
      heroPosition: args.heroPosition || args.heroSeat || "BTN",
      villainPosition: args.villainPosition || "BB",
      stackDepthBb: Number(args.stackDepthBb || 100),
      potType: args.potType || "single-raised-pot",
      flop: board.slice(0, 3).map(formatCardKey),
      availableFlopSizes: convertedNodes.root?.legalActions?.map((action) => action.id) || [],
      heroCombos: getAllHeroCombos(convertedNodes),
      source: args.source || `TexasSolver export: ${path.basename(inputPath)}`,
    },
    nodes: convertedNodes,
  };
}

function convertRawNodeToSolvedNode(rawNode, context) {
  if (!rawNode || typeof rawNode !== "object") {
    return createTerminalSolvedNode(context, { type: "terminal", reason: "Missing TexasSolver child node." });
  }

  if (rawNode.node_type === "chance_node" || rawNode.dealcards) {
    return convertChanceNode(rawNode, context);
  }

  const strategyPayload = getStrategyPayload(rawNode);
  if (strategyPayload) {
    return convertActionNode(rawNode, strategyPayload, context);
  }

  return createTerminalSolvedNode(context, inferTerminalForMissingChild(context));
}

function convertActionNode(rawNode, strategyPayload, context) {
  const nodeId = context.path.length === 0 ? "root" : `node_${++context.counters.action}`;
  const legalActions = strategyPayload.actions.map((action) => normalizeTexasSolverActionObject(action, context.potBb));
  const strategyByCombo = aggregateSolvedTreeStrategy(strategyPayload, legalActions);
  const children = {};

  if (context.actionDepth >= context.maxActionDepth) {
    legalActions.forEach((action) => {
      children[action.id] = createTerminalSolvedNode(
        { ...context, path: [...context.path, action.id], incomingAction: action.id, parentActor: getActorFromTexasSolverPlayer(rawNode.player, context.args) },
        { type: "terminal", reason: "Converter action-depth limit reached." }
      );
    });
  } else {
    strategyPayload.actions.forEach((rawAction, index) => {
      const action = legalActions[index];
      const child = rawNode.childrens?.[rawAction];
      const nextContext = {
        ...context,
        potBb: getPotAfterAction(context.potBb, action),
        path: [...context.path, action.id],
        actionDepth: context.actionDepth + 1,
        incomingAction: action.id,
        parentActor: getActorFromTexasSolverPlayer(rawNode.player, context.args),
      };
      children[action.id] = child
        ? convertRawNodeToSolvedNode(child, nextContext)
        : createTerminalSolvedNode(nextContext, inferTerminalForAction(action, nextContext.parentActor));
    });
  }

  context.convertedNodes[nodeId] = {
    nodeId,
    street: context.args.street || getStreetFromBoard(context.board),
    board: context.board.map(formatCardKey),
    actor: getActorFromTexasSolverPlayer(rawNode.player, context.args),
    potBb: round(context.potBb),
    effectiveStackBb: round(context.effectiveStackBb),
    legalActions,
    strategyByCombo,
    defaultStrategy: aggregateDefaultStrategy(strategyPayload, legalActions),
    children,
  };
  return nodeId;
}

function convertChanceNode(rawNode, context) {
  const nodeId = `chance_${++context.counters.chance}`;
  const children = {};
  const cardOptions = [];
  Object.entries(rawNode.dealcards || {}).forEach(([card, child]) => {
    const parsed = parseCard(card);
    const board = [...context.board, parsed];
    const childNodeId = convertRawNodeToSolvedNode(child, {
      ...context,
      board,
      path: [...context.path, `deal_${formatCardKey(parsed)}`],
      incomingAction: `deal_${formatCardKey(parsed)}`,
      parentActor: "dealer",
    });
    const cardKey = formatCardKey(parsed);
    children[cardKey] = childNodeId;
    cardOptions.push({
      card: cardKey,
      board: board.map(formatCardKey),
      childNodeId,
    });
  });

  context.convertedNodes[nodeId] = {
    nodeId,
    street: getStreetFromBoard(context.board),
    board: context.board.map(formatCardKey),
    actor: "chance",
    potBb: round(context.potBb),
    effectiveStackBb: round(context.effectiveStackBb),
    legalActions: [],
    strategyByCombo: {},
    children,
    cardOptions,
  };
  return nodeId;
}

function createTerminalSolvedNode(context, terminal) {
  const nodeId = `terminal_${++context.counters.terminal}`;
  context.convertedNodes[nodeId] = {
    nodeId,
    street: getStreetFromBoard(context.board),
    board: context.board.map(formatCardKey),
    actor: "terminal",
    potBb: round(context.potBb),
    effectiveStackBb: round(context.effectiveStackBb),
    legalActions: [],
    strategyByCombo: {},
    children: {},
    terminal: {
      ...terminal,
      potBb: round(context.potBb),
      summary: terminal.summary || getTerminalSummary(terminal, context),
    },
  };
  return nodeId;
}

function inferTerminalForMissingChild(context) {
  if (String(context.incomingAction).includes("fold")) {
    return inferTerminalForAction({ type: "fold" }, context.parentActor);
  }
  return { type: "showdown" };
}

function inferTerminalForAction(action, actor) {
  if (action.type === "fold") {
    return {
      type: "fold",
      winner: actor === "hero" ? "villain" : "hero",
    };
  }

  if (action.type === "call") {
    return { type: "showdown" };
  }

  return { type: "terminal" };
}

function getTerminalSummary(terminal, context) {
  if (terminal.type === "fold") {
    const winner = terminal.winner === "hero" ? "Hero" : "Villain";
    return `${winner} wins the pot after a fold.`;
  }

  if (terminal.type === "showdown") {
    return "The hand reaches showdown in the solved tree.";
  }

  return terminal.reason || "The solved branch ends here.";
}

function getActorFromTexasSolverPlayer(player, args) {
  const numericPlayer = Number(player);
  if (numericPlayer === 0) return args.ipActor || "hero";
  if (numericPlayer === 1) return args.oopActor || "villain";
  return args.rootActor || "hero";
}

function getPotAfterAction(potBb, action) {
  const amount = Number(action.amountBb || 0);
  if (amount > 0) {
    return round(potBb + amount);
  }

  if (action.type === "bet" && action.sizePctPot) {
    return round(potBb + potBb * (action.sizePctPot / 100));
  }

  return round(potBb);
}

function aggregateDefaultStrategy(payload, legalActions) {
  const actionsByIndex = legalActions.map((action) => action.id);
  const totals = {};
  let comboCount = 0;

  Object.values(payload.strategy || {}).forEach((frequencies) => {
    if (!Array.isArray(frequencies)) {
      return;
    }
    comboCount += 1;
    frequencies.forEach((frequency, index) => {
      const actionId = actionsByIndex[index];
      if (!actionId || typeof frequency !== "number") {
        return;
      }
      totals[actionId] = (totals[actionId] || 0) + frequency;
    });
  });

  const actions = {};
  Object.entries(totals).forEach(([actionId, total]) => {
    actions[actionId] = {
      frequency: comboCount ? round(total / comboCount) : 0,
      evBb: null,
    };
  });
  normalizeActionFrequencies(actions);
  return {
    actions,
    bestActionId: getBestActionIdFromSolvedActions(actions) || legalActions[0]?.id || "",
    approximate: false,
    note: comboCount ? `Range-average TexasSolver strategy across ${comboCount} combos.` : "TexasSolver strategy missing for this node.",
  };
}

function getAllHeroCombos(nodes) {
  const combos = new Set();
  Object.values(nodes || {}).forEach((node) => {
    if (node.actor !== "hero") {
      return;
    }
    Object.keys(node.strategyByCombo || {}).forEach((combo) => combos.add(combo));
  });
  return [...combos].slice(0, 200);
}

function shouldWriteJson(args, outputPath) {
  return args.format === "json" || path.extname(outputPath).toLowerCase() === ".json";
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--help" || token === "-h") {
      args.help = true;
    } else if (token.startsWith("--")) {
      const key = toCamel(token.slice(2));
      const next = argv[index + 1];
      if (!next || next.startsWith("--")) {
        args[key] = true;
      } else {
        args[key] = next;
        index += 1;
      }
    }
  }
  return args;
}

function printUsage() {
  console.log(`
Usage:
  npm run convert:texassolver -- --input output_result.json --output solver-library.js --board Qs,Jh,2h --table-size hu --hero-seat "SB / BTN"

Common options:
  --input <file>                    TexasSolver output_result.json
  --output <file>                   FishKiller solver library JS output
  --pack-id <id>                    Pack id
  --pack-name <name>                Pack display name
  --source <text>                   Source note stored in the pack
  --table-size <hu|three|six|nine>  FishKiller table size
  --hero-seat <seat>                FishKiller hero seat label
  --preflop-action-includes <text>  Required preflop text match, e.g. Open
  --board <cards>                   Board at the exported node, e.g. Qs,Jh,2h
  --pot <number>                    TexasSolver pot amount, used for bet-size mapping
  --pot-bb-range <min,max>          Match range in big blinds
  --max-action-depth <number>       0 exports root action nodes only; increase for child nodes
  --schema <legacy|solved-tree>     Use solved-tree for the MVP full-hand trainer schema
  --format <js|json>                With --schema solved-tree, write plain JSON for /data/solves/real
`);
}

function collectActionNodes(node, context) {
  if (!node || typeof node !== "object") {
    return [];
  }

  const nodes = [];
  const strategyPayload = getStrategyPayload(node);
  if (strategyPayload && context.actionDepth <= context.maxActionDepth) {
    nodes.push({
      node,
      strategyPayload,
      board: context.board,
      actionPath: context.actionPath,
      actionDepth: context.actionDepth,
    });
  }

  Object.entries(node.childrens || {}).forEach(([action, child]) => {
    nodes.push(...collectActionNodes(child, {
      ...context,
      actionPath: [...context.actionPath, action],
      actionDepth: context.actionDepth + 1,
    }));
  });

  Object.entries(node.dealcards || {}).forEach(([card, child]) => {
    nodes.push(...collectActionNodes(child, {
      ...context,
      board: [...context.board, parseCard(card)],
    }));
  });

  return nodes;
}

function getStrategyPayload(node) {
  if (node.strategy?.strategy && Array.isArray(node.strategy?.actions)) {
    return node.strategy;
  }

  if (node.strategy && Array.isArray(node.actions)) {
    return {
      actions: node.actions,
      strategy: node.strategy,
    };
  }

  return null;
}

function convertNodeToSpot(nodeInfo, args, pot, index) {
  const board = nodeInfo.board.length ? nodeInfo.board : parseBoard(args.board || "");
  const actions = nodeInfo.strategyPayload.actions.map((action) => normalizeTexasSolverAction(action, pot));
  const strategy = aggregateStrategy(nodeInfo.strategyPayload, actions);
  const street = args.street || getStreetFromBoard(board);
  const idParts = [
    args.spotId || args.packId || "texassolver",
    street,
    board.map((card) => `${card.rank}${card.suit}`).join("").toLowerCase(),
    index + 1,
  ];

  return {
    id: slugify(idParts.filter(Boolean).join("-")),
    name: args.spotName || `${args.packName || "TexasSolver"} ${street} ${formatBoard(board)}`,
    enabled: true,
    tableSize: args.tableSize || "hu",
    heroSeat: args.heroSeat || "SB / BTN",
    street,
    preflopActionIncludes: args.preflopActionIncludes || "Open",
    potBbRange: parseNumberRange(args.potBbRange) || [0, 500],
    board: {
      ranks: board.map((card) => card.rank).join(""),
      exact: board.map((card) => `${card.rank}${card.suit}`),
      texture: getBoardTextureTags(board),
    },
    actions: unique(actions),
    strategy,
    texasSolver: {
      actionPath: nodeInfo.actionPath,
      originalActions: nodeInfo.strategyPayload.actions,
    },
  };
}

function convertNodesToSolvedTree(nodes, args, pot, packId, inputPath) {
  const nodeByPath = new Map(nodes.map((nodeInfo, index) => [getSolvedNodePathKey(nodeInfo.actionPath), { nodeInfo, index }]));
  const convertedNodes = {};

  nodes.forEach((nodeInfo, index) => {
    const nodeId = index === 0 && nodeInfo.actionPath.length === 0
      ? "root"
      : getSolvedNodeId(nodeInfo.actionPath, index);
    convertedNodes[nodeId] = convertNodeToSolvedNode(nodeInfo, args, pot, nodeByPath, index);
  });

  if (!convertedNodes.root) {
    const firstKey = Object.keys(convertedNodes)[0];
    convertedNodes.root = { ...convertedNodes[firstKey], nodeId: "root" };
    delete convertedNodes[firstKey];
  }

  const board = nodes[0]?.board?.length ? nodes[0].board : parseBoard(args.board || "");
  return {
    treeId: args.treeId || packId,
    label: args.treeName || args.packName || `TexasSolver ${packId}`,
    isDemo: false,
    metadata: {
      formation: args.formation || "BTN_vs_BB_SRP",
      heroPosition: args.heroPosition || args.heroSeat || "BTN",
      villainPosition: args.villainPosition || "BB",
      stackDepthBb: Number(args.stackDepthBb || 100),
      potType: args.potType || "single-raised-pot",
      flop: board.slice(0, 3).map(formatCardKey),
      availableFlopSizes: convertedNodes.root?.legalActions?.map((action) => action.id) || [],
      source: args.source || `TexasSolver export: ${path.basename(inputPath)}`,
    },
    nodes: convertedNodes,
  };
}

function convertNodeToSolvedNode(nodeInfo, args, pot, nodeByPath, index) {
  const nodeId = index === 0 && nodeInfo.actionPath.length === 0
    ? "root"
    : getSolvedNodeId(nodeInfo.actionPath, index);
  const board = nodeInfo.board.length ? nodeInfo.board : parseBoard(args.board || "");
  const legalActions = nodeInfo.strategyPayload.actions.map((action) => normalizeTexasSolverActionObject(action, pot));
  const strategyByCombo = aggregateSolvedTreeStrategy(nodeInfo.strategyPayload, legalActions);
  const children = {};

  Object.keys(nodeInfo.node.childrens || {}).forEach((action) => {
    const actionId = normalizeTexasSolverActionObject(action, pot).id;
    const childKey = getSolvedNodePathKey([...nodeInfo.actionPath, action]);
    const child = nodeByPath.get(childKey);
    if (child) {
      children[actionId] = getSolvedNodeId(child.nodeInfo.actionPath, child.index);
    }
  });

  return {
    nodeId,
    street: args.street || getStreetFromBoard(board),
    board: board.map(formatCardKey),
    actor: inferActorForSolvedNode(nodeInfo, args),
    potBb: Number(args.potBb || args.pot || 0),
    effectiveStackBb: Number(args.effectiveStackBb || args.stackDepthBb || 100),
    legalActions,
    strategyByCombo,
    children,
  };
}

function aggregateSolvedTreeStrategy(payload, legalActions) {
  const actionsByIndex = legalActions.map((action) => action.id);
  const result = {};

  Object.entries(payload.strategy || {}).forEach(([combo, frequencies]) => {
    if (!Array.isArray(frequencies)) {
      return;
    }

    const actions = {};
    frequencies.forEach((frequency, index) => {
      const actionId = actionsByIndex[index];
      if (!actionId || typeof frequency !== "number") {
        return;
      }
      actions[actionId] = {
        frequency: round(frequency),
        evBb: null,
      };
    });
    normalizeActionFrequencies(actions);
    result[normalizeComboKey(combo)] = {
      actions,
      bestActionId: Object.entries(actions).sort((a, b) => b[1].frequency - a[1].frequency)[0]?.[0] || legalActions[0]?.id || "",
    };
  });

  return result;
}

function normalizeTexasSolverActionObject(action, pot) {
  const text = String(action).trim();
  const upper = text.toUpperCase();
  const amount = Number(upper.match(/-?\d+(?:\.\d+)?/)?.[0] || 0);
  const sizePctPot = pot > 0 && amount > 0 ? Math.round((amount / pot) * 100) : null;

  if (upper.includes("CHECK")) return { id: "check", label: "Check", type: "check" };
  if (upper.includes("CALL")) return { id: "call", label: "Call", type: "call", amountBb: amount || null };
  if (upper.includes("FOLD")) return { id: "fold", label: "Fold", type: "fold" };
  if (upper.includes("ALLIN")) return { id: "jam", label: "Jam", type: "raise", amountBb: amount || null };
  if (upper.includes("RAISE")) {
    const id = sizePctPot ? `raise_${sizePctPot}` : amount ? `raise_${String(amount).replace(".", "_")}` : "raise";
    return { id, label: sizePctPot ? `Raise ${sizePctPot}%` : "Raise", type: "raise", amountBb: amount || null, sizePctPot };
  }
  if (upper.includes("BET")) {
    const id = sizePctPot ? `bet_${sizePctPot}` : amount ? `bet_${String(amount).replace(".", "_")}` : "bet";
    return { id, label: sizePctPot ? `Bet ${sizePctPot}%` : "Bet", type: "bet", amountBb: amount || null, sizePctPot };
  }
  const fallbackId = slugify(text) || "action";
  return { id: fallbackId, label: text, type: "action", amountBb: amount || null, sizePctPot };
}

function getBestActionIdFromSolvedActions(actions) {
  return Object.entries(actions || {})
    .sort(([, first], [, second]) => {
      const firstEv = Number.isFinite(first.evBb) ? first.evBb : -Infinity;
      const secondEv = Number.isFinite(second.evBb) ? second.evBb : -Infinity;
      if (secondEv !== firstEv) return secondEv - firstEv;
      return (second.frequency || 0) - (first.frequency || 0);
    })[0]?.[0] || "";
}

function normalizeActionFrequencies(actions) {
  const total = Object.values(actions).reduce((sum, action) => sum + (action.frequency || 0), 0) || 1;
  Object.values(actions).forEach((action) => {
    action.frequency = round((action.frequency || 0) / total);
  });
}

function normalizeComboKey(combo) {
  const cards = String(combo).match(/[2-9TJQKA][cdhs]/gi);
  if (!cards || cards.length !== 2) {
    return comboToHandClass(combo);
  }

  return cards
    .map((card) => card[0].toUpperCase() + card[1].toLowerCase())
    .sort((a, b) => RANKS.indexOf(a[0]) - RANKS.indexOf(b[0]))
    .join("");
}

function getSolvedNodePathKey(actionPath = []) {
  return actionPath.join("|") || "root";
}

function getSolvedNodeId(actionPath = [], index = 0) {
  if (!actionPath.length) return "root";
  return slugify(`node-${index + 1}-${actionPath.join("-")}`);
}

function inferActorForSolvedNode(nodeInfo, args) {
  if (args.actor) {
    return args.actor;
  }

  return nodeInfo.actionPath.length % 2 === 0 ? "hero" : "villain";
}

function formatCardKey(card) {
  return `${card.rank}${card.suit}`;
}

function aggregateStrategy(payload, normalizedActions) {
  const buckets = {};
  Object.entries(payload.strategy || {}).forEach(([combo, frequencies]) => {
    const handClass = comboToHandClass(combo);
    if (!handClass || !Array.isArray(frequencies)) {
      return;
    }

    buckets[handClass] ||= { count: 0, mix: {} };
    buckets[handClass].count += 1;
    frequencies.forEach((frequency, index) => {
      const actionId = normalizedActions[index];
      if (!actionId || typeof frequency !== "number") {
        return;
      }
      buckets[handClass].mix[actionId] = (buckets[handClass].mix[actionId] || 0) + frequency;
    });
  });

  return Object.fromEntries(
    Object.entries(buckets).map(([handClass, bucket]) => {
      const mix = Object.fromEntries(
        Object.entries(bucket.mix)
          .map(([actionId, total]) => [actionId, round(total / bucket.count)])
          .filter(([, frequency]) => frequency > 0.001)
      );
      const total = Object.values(mix).reduce((sum, frequency) => sum + frequency, 0) || 1;
      Object.keys(mix).forEach((actionId) => {
        mix[actionId] = round(mix[actionId] / total);
      });
      const maxFrequency = Math.max(...Object.values(mix));
      const topAction = Object.entries(mix).sort((a, b) => b[1] - a[1])[0]?.[0] || "check";
      return [
        handClass,
        {
          mix,
          tags: maxFrequency < 0.85 ? ["mix"] : [],
          note: `TexasSolver aggregate from ${bucket.count} exact combo${bucket.count === 1 ? "" : "s"}; top action ${topAction} ${Math.round(maxFrequency * 100)}%.`,
        },
      ];
    })
  );
}

function comboToHandClass(combo) {
  const cards = String(combo).match(/[2-9TJQKA][cdhs]/gi);
  if (!cards || cards.length !== 2) {
    return "";
  }

  const parsed = cards.map(parseCard);
  const [first, second] = parsed.sort((a, b) => RANKS.indexOf(a.rank) - RANKS.indexOf(b.rank));
  if (first.rank === second.rank) {
    return `${first.rank}${second.rank}`;
  }
  return `${first.rank}${second.rank}${first.suit === second.suit ? "s" : "o"}`;
}

function normalizeTexasSolverAction(action, pot) {
  const text = String(action).trim().toUpperCase();
  const amount = Number(text.match(/-?\d+(?:\.\d+)?/)?.[0] || 0);
  const size = pot > 0 ? amount / pot : amount / 100;

  if (text.includes("CHECK")) return "check";
  if (text.includes("CALL")) return "call";
  if (text.includes("FOLD")) return "fold";
  if (text.includes("ALLIN")) return "raise-big";
  if (text.includes("RAISE")) return size >= 1.15 ? "raise-big" : "raise";
  if (text.includes("BET")) return size <= 0.55 ? "bet-small" : "bet-big";
  return text.toLowerCase().replace(/\s+/g, "-");
}

function parseBoard(value) {
  if (!value) return [];
  return String(value)
    .split(/[,\s]+/)
    .filter(Boolean)
    .map(parseCard);
}

function parseCard(value) {
  const match = String(value).trim().match(/^([2-9TJQKA])([cdhs])$/i);
  if (!match) {
    throw new Error(`Invalid card "${value}". Use TexasSolver notation like Qs or 2h.`);
  }
  return { rank: match[1].toUpperCase(), suit: match[2].toLowerCase() };
}

function getStreetFromBoard(board) {
  if (board.length <= 3) return "flop";
  if (board.length === 4) return "turn";
  return "river";
}

function getBoardTextureTags(board) {
  const suits = countBy(board.map((card) => card.suit));
  const ranks = board.map((card) => rankValue(card.rank)).sort((a, b) => b - a);
  const maxSuitCount = Math.max(0, ...Object.values(suits));
  const paired = new Set(ranks).size !== ranks.length;
  const connectedness = ranks.reduce((score, rank, index) => {
    if (index === 0) return score;
    const gap = Math.abs(rank - ranks[index - 1]);
    return score + (gap <= 1 ? 3 : gap <= 2 ? 2 : gap <= 4 ? 1 : 0);
  }, 0);
  const wetness = connectedness + (maxSuitCount >= 3 ? 5 : maxSuitCount === 2 ? 3 : 0) + (paired ? 1 : 0);
  return [
    maxSuitCount === board.length ? "monotone" : "",
    maxSuitCount >= 3 ? "flush" : "",
    maxSuitCount === 2 ? "two-tone" : "",
    maxSuitCount === 1 ? "rainbow" : "",
    paired ? "paired" : "unpaired",
    wetness >= 7 ? "wet" : "dry",
    getStreetFromBoard(board),
  ].filter(Boolean);
}

function parseNumberRange(value) {
  if (!value) return null;
  const [min, max] = String(value).split(",").map(Number);
  return Number.isFinite(min) && Number.isFinite(max) ? [min, max] : null;
}

function rankValue(rank) {
  return 14 - RANKS.indexOf(rank);
}

function countBy(items) {
  return items.reduce((counts, item) => {
    counts[item] = (counts[item] || 0) + 1;
    return counts;
  }, {});
}

function formatBoard(board) {
  return board.map((card) => `${card.rank}${card.suit}`).join(" ");
}

function unique(items) {
  return [...new Set(items)];
}

function round(value) {
  return Math.round(value * 10000) / 10000;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toCamel(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

main();
