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
  const nodes = collectActionNodes(raw, {
    board: initialBoard,
    actionPath: [],
    actionDepth: 0,
    maxActionDepth,
  });

  if (!nodes.length) {
    throw new Error("No TexasSolver action nodes with strategy data were found. Try --max-action-depth 2 for deeper nodes.");
  }

  const packId = args.packId || slugify(path.basename(inputPath, path.extname(inputPath)));
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
    fs.writeFileSync(outputPath, output, "utf8");
    console.log(`Converted ${nodes.length} TexasSolver node(s) into ${outputPath}`);
  }
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
