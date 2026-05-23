window.FISHKILLER_SOLVED_TREES = (window.FISHKILLER_SOLVED_TREES || []).concat([
  {
    treeId: "demo_btn_bb_srp_100bb_ks7d2c",
    label: "Demo BTN vs BB SRP - K72 rainbow",
    isDemo: true,
    metadata: {
      formation: "BTN_vs_BB_SRP",
      heroPosition: "BTN",
      villainPosition: "BB",
      stackDepthBb: 100,
      potType: "single-raised-pot",
      flop: ["Ks", "7d", "2c"],
      availableFlopSizes: ["check", "bet_33", "bet_75"],
      source: "Mock/demo data for FishKiller MVP. Not real solver output.",
      heroCombos: ["AsQs", "AhQh", "KcQc"],
    },
    nodes: {
      root: {
        nodeId: "root",
        street: "flop",
        board: ["Ks", "7d", "2c"],
        actor: "hero",
        potBb: 5.5,
        effectiveStackBb: 97.5,
        legalActions: [
          { id: "check", label: "Check", type: "check" },
          { id: "bet_33", label: "Bet 33%", type: "bet", sizePctPot: 33 },
          { id: "bet_75", label: "Bet 75%", type: "bet", sizePctPot: 75 }
        ],
        strategyByCombo: {
          AsQs: {
            actions: {
              check: { frequency: 0.29, evBb: 1.12 },
              bet_33: { frequency: 0.71, evBb: 1.18 },
              bet_75: { frequency: 0.0, evBb: 1.02 }
            },
            bestActionId: "bet_33"
          },
          AhQh: {
            actions: {
              check: { frequency: 0.42, evBb: 1.09 },
              bet_33: { frequency: 0.58, evBb: 1.13 },
              bet_75: { frequency: 0.0, evBb: 0.98 }
            },
            bestActionId: "bet_33"
          },
          KcQc: {
            actions: {
              check: { frequency: 0.18, evBb: 3.22 },
              bet_33: { frequency: 0.66, evBb: 3.37 },
              bet_75: { frequency: 0.16, evBb: 3.31 }
            },
            bestActionId: "bet_33"
          },
        },
        children: {
          check: "deal_turn_after_flop_check",
          bet_33: "bb_vs_flop_bet_33",
          bet_75: "bb_vs_flop_bet_75"
        }
      },
      bb_vs_flop_bet_33: {
        nodeId: "bb_vs_flop_bet_33",
        street: "flop",
        board: ["Ks", "7d", "2c"],
        actor: "villain",
        potBb: 7.32,
        effectiveStackBb: 95.7,
        legalActions: [
          { id: "fold", label: "Fold", type: "fold" },
          { id: "call", label: "Call", type: "call", amountBb: 1.82 },
          { id: "raise_3x", label: "Raise 3x", type: "raise", amountBb: 5.46 }
        ],
        defaultStrategy: {
          actions: {
            fold: { frequency: 0.38, evBb: 0 },
            call: { frequency: 0.49, evBb: 0.21 },
            raise_3x: { frequency: 0.13, evBb: 0.16 }
          },
          bestActionId: "call",
          note: "Demo aggregate BB response versus 33% c-bet."
        },
        children: {
          fold: "terminal_flop_fold_to_hero",
          call: "deal_turn_after_bet_call",
          raise_3x: "hero_vs_flop_raise"
        }
      },
      bb_vs_flop_bet_75: {
        nodeId: "bb_vs_flop_bet_75",
        street: "flop",
        board: ["Ks", "7d", "2c"],
        actor: "villain",
        potBb: 9.63,
        effectiveStackBb: 93.38,
        legalActions: [
          { id: "fold", label: "Fold", type: "fold" },
          { id: "call", label: "Call", type: "call", amountBb: 4.13 }
        ],
        defaultStrategy: {
          actions: {
            fold: { frequency: 0.52, evBb: 0 },
            call: { frequency: 0.48, evBb: 0.08 }
          },
          bestActionId: "fold",
          note: "Demo aggregate BB response versus large flop bet."
        },
        children: {
          fold: "terminal_flop_fold_to_hero",
          call: "deal_turn_after_big_bet_call"
        }
      },
      hero_vs_flop_raise: {
        nodeId: "hero_vs_flop_raise",
        street: "flop",
        board: ["Ks", "7d", "2c"],
        actor: "hero",
        potBb: 12.78,
        effectiveStackBb: 90.24,
        legalActions: [
          { id: "fold", label: "Fold", type: "fold" },
          { id: "call", label: "Call", type: "call", amountBb: 3.64 }
        ],
        strategyByCombo: {
          AsQs: {
            actions: {
              fold: { frequency: 0.76, evBb: 0.0 },
              call: { frequency: 0.24, evBb: 0.04 }
            },
            bestActionId: "call"
          },
          KcQc: {
            actions: {
              fold: { frequency: 0.0, evBb: 0.0 },
              call: { frequency: 1.0, evBb: 2.88 }
            },
            bestActionId: "call"
          }
        },
        defaultStrategy: {
          actions: {
            fold: { frequency: 0.7, evBb: 0 },
            call: { frequency: 0.3, evBb: 0.03 }
          },
          bestActionId: "fold",
          approximate: true
        },
        children: {
          fold: "terminal_hero_folds_flop_raise",
          call: "deal_turn_after_raise_call"
        }
      },
      deal_turn_after_flop_check: {
        nodeId: "deal_turn_after_flop_check",
        street: "turn",
        board: ["Ks", "7d", "2c"],
        actor: "chance",
        potBb: 5.5,
        effectiveStackBb: 97.5,
        cardOptions: [
          { card: "4h", board: ["Ks", "7d", "2c", "4h"], childNodeId: "turn_after_flop_check_4h" }
        ]
      },
      deal_turn_after_bet_call: {
        nodeId: "deal_turn_after_bet_call",
        street: "turn",
        board: ["Ks", "7d", "2c"],
        actor: "chance",
        potBb: 9.14,
        effectiveStackBb: 95.68,
        cardOptions: [
          { card: "4h", board: ["Ks", "7d", "2c", "4h"], childNodeId: "turn_after_bet_call_4h" }
        ]
      },
      deal_turn_after_big_bet_call: {
        nodeId: "deal_turn_after_big_bet_call",
        street: "turn",
        board: ["Ks", "7d", "2c"],
        actor: "chance",
        potBb: 13.75,
        effectiveStackBb: 93.38,
        cardOptions: [
          { card: "4h", board: ["Ks", "7d", "2c", "4h"], childNodeId: "turn_after_bet_call_4h" }
        ]
      },
      deal_turn_after_raise_call: {
        nodeId: "deal_turn_after_raise_call",
        street: "turn",
        board: ["Ks", "7d", "2c"],
        actor: "chance",
        potBb: 16.42,
        effectiveStackBb: 90.24,
        cardOptions: [
          { card: "4h", board: ["Ks", "7d", "2c", "4h"], childNodeId: "turn_after_bet_call_4h" }
        ]
      },
      turn_after_flop_check_4h: {
        nodeId: "turn_after_flop_check_4h",
        street: "turn",
        board: ["Ks", "7d", "2c", "4h"],
        actor: "hero",
        potBb: 5.5,
        effectiveStackBb: 97.5,
        legalActions: [
          { id: "check", label: "Check", type: "check" },
          { id: "bet_75", label: "Bet 75%", type: "bet", sizePctPot: 75 }
        ],
        strategyByCombo: {
          AsQs: {
            actions: {
              check: { frequency: 0.83, evBb: 0.92 },
              bet_75: { frequency: 0.17, evBb: 0.86 }
            },
            bestActionId: "check"
          },
          KcQc: {
            actions: {
              check: { frequency: 0.31, evBb: 2.76 },
              bet_75: { frequency: 0.69, evBb: 2.91 }
            },
            bestActionId: "bet_75"
          }
        },
        defaultStrategy: {
          actions: {
            check: { frequency: 0.72, evBb: 0.42 },
            bet_75: { frequency: 0.28, evBb: 0.39 }
          },
          bestActionId: "check",
          approximate: true
        },
        children: {
          check: "deal_river_after_turn_check",
          bet_75: "bb_vs_turn_bet"
        }
      },
      turn_after_bet_call_4h: {
        nodeId: "turn_after_bet_call_4h",
        street: "turn",
        board: ["Ks", "7d", "2c", "4h"],
        actor: "hero",
        potBb: 9.14,
        effectiveStackBb: 95.68,
        legalActions: [
          { id: "check", label: "Check", type: "check" },
          { id: "bet_75", label: "Bet 75%", type: "bet", sizePctPot: 75 }
        ],
        strategyByCombo: {
          AsQs: {
            actions: {
              check: { frequency: 0.55, evBb: 1.36 },
              bet_75: { frequency: 0.45, evBb: 1.39 }
            },
            bestActionId: "bet_75"
          },
          KcQc: {
            actions: {
              check: { frequency: 0.24, evBb: 4.48 },
              bet_75: { frequency: 0.76, evBb: 4.76 }
            },
            bestActionId: "bet_75"
          }
        },
        defaultStrategy: {
          actions: {
            check: { frequency: 0.64, evBb: 0.64 },
            bet_75: { frequency: 0.36, evBb: 0.66 }
          },
          bestActionId: "bet_75",
          approximate: true
        },
        children: {
          check: "deal_river_after_turn_check",
          bet_75: "bb_vs_turn_bet"
        }
      },
      bb_vs_turn_bet: {
        nodeId: "bb_vs_turn_bet",
        street: "turn",
        board: ["Ks", "7d", "2c", "4h"],
        actor: "villain",
        potBb: 16.0,
        effectiveStackBb: 88.82,
        legalActions: [
          { id: "fold", label: "Fold", type: "fold" },
          { id: "call", label: "Call", type: "call", amountBb: 6.86 }
        ],
        defaultStrategy: {
          actions: {
            fold: { frequency: 0.41, evBb: 0 },
            call: { frequency: 0.59, evBb: 0.18 }
          },
          bestActionId: "call"
        },
        children: {
          fold: "terminal_turn_fold_to_hero",
          call: "deal_river_after_turn_bet_call"
        }
      },
      deal_river_after_turn_check: {
        nodeId: "deal_river_after_turn_check",
        street: "river",
        board: ["Ks", "7d", "2c", "4h"],
        actor: "chance",
        potBb: 9.14,
        effectiveStackBb: 95.68,
        cardOptions: [
          { card: "9s", board: ["Ks", "7d", "2c", "4h", "9s"], childNodeId: "river_showdown_decision_9s" }
        ]
      },
      deal_river_after_turn_bet_call: {
        nodeId: "deal_river_after_turn_bet_call",
        street: "river",
        board: ["Ks", "7d", "2c", "4h"],
        actor: "chance",
        potBb: 22.86,
        effectiveStackBb: 88.82,
        cardOptions: [
          { card: "9s", board: ["Ks", "7d", "2c", "4h", "9s"], childNodeId: "river_showdown_decision_9s" }
        ]
      },
      river_showdown_decision_9s: {
        nodeId: "river_showdown_decision_9s",
        street: "river",
        board: ["Ks", "7d", "2c", "4h", "9s"],
        actor: "hero",
        potBb: 22.86,
        effectiveStackBb: 88.82,
        legalActions: [
          { id: "check", label: "Check", type: "check" },
          { id: "bet_75", label: "Bet 75%", type: "bet", sizePctPot: 75 }
        ],
        strategyByCombo: {
          AsQs: {
            actions: {
              check: { frequency: 0.74, evBb: 0.95 },
              bet_75: { frequency: 0.26, evBb: 0.89 }
            },
            bestActionId: "check"
          },
          KcQc: {
            actions: {
              check: { frequency: 0.36, evBb: 3.58 },
              bet_75: { frequency: 0.64, evBb: 3.71 }
            },
            bestActionId: "bet_75"
          }
        },
        defaultStrategy: {
          actions: {
            check: { frequency: 0.82, evBb: 0.4 },
            bet_75: { frequency: 0.18, evBb: 0.32 }
          },
          bestActionId: "check",
          approximate: true
        },
        children: {
          check: "terminal_river_showdown",
          bet_75: "bb_vs_river_bet"
        }
      },
      bb_vs_river_bet: {
        nodeId: "bb_vs_river_bet",
        street: "river",
        board: ["Ks", "7d", "2c", "4h", "9s"],
        actor: "villain",
        potBb: 40.0,
        effectiveStackBb: 71.68,
        legalActions: [
          { id: "fold", label: "Fold", type: "fold" },
          { id: "call", label: "Call", type: "call", amountBb: 17.14 }
        ],
        defaultStrategy: {
          actions: {
            fold: { frequency: 0.44, evBb: 0 },
            call: { frequency: 0.56, evBb: 0.22 }
          },
          bestActionId: "call"
        },
        children: {
          fold: "terminal_river_fold_to_hero",
          call: "terminal_river_showdown"
        }
      },
      terminal_flop_fold_to_hero: {
        nodeId: "terminal_flop_fold_to_hero",
        street: "flop",
        board: ["Ks", "7d", "2c"],
        actor: "terminal",
        potBb: 7.32,
        effectiveStackBb: 95.7,
        terminal: { type: "fold", winner: "hero", summary: "BB folds flop. Hero wins the pot." }
      },
      terminal_hero_folds_flop_raise: {
        nodeId: "terminal_hero_folds_flop_raise",
        street: "flop",
        board: ["Ks", "7d", "2c"],
        actor: "terminal",
        potBb: 12.78,
        effectiveStackBb: 90.24,
        terminal: { type: "fold", winner: "villain", summary: "Hero folds to the flop raise." }
      },
      terminal_turn_fold_to_hero: {
        nodeId: "terminal_turn_fold_to_hero",
        street: "turn",
        board: ["Ks", "7d", "2c", "4h"],
        actor: "terminal",
        potBb: 16.0,
        effectiveStackBb: 88.82,
        terminal: { type: "fold", winner: "hero", summary: "BB folds turn. Hero wins the pot." }
      },
      terminal_river_fold_to_hero: {
        nodeId: "terminal_river_fold_to_hero",
        street: "river",
        board: ["Ks", "7d", "2c", "4h", "9s"],
        actor: "terminal",
        potBb: 40.0,
        effectiveStackBb: 71.68,
        terminal: { type: "fold", winner: "hero", summary: "BB folds river. Hero wins the pot." }
      },
      terminal_river_showdown: {
        nodeId: "terminal_river_showdown",
        street: "river",
        board: ["Ks", "7d", "2c", "4h", "9s"],
        actor: "terminal",
        potBb: 40.0,
        effectiveStackBb: 71.68,
        terminal: { type: "showdown", winner: "showdown", summary: "The hand reaches showdown in this demo branch." }
      }
    }
  }
]);

(function addFishKillerDemoTreeVariants() {
  const source = window.FISHKILLER_SOLVED_TREES.find((tree) => tree.treeId === "demo_btn_bb_srp_100bb_ks7d2c");
  if (!source) {
    return;
  }

  const variants = [
    {
      treeId: "demo_btn_bb_srp_100bb_q84ss",
      label: "Demo BTN vs BB SRP - Q84 two-tone",
      flop: ["Qh", "8s", "4s"],
      turn: "2d",
      river: "Jc",
      heroCombos: ["AdQd", "JhTh", "Ts9s", "Ac5c"]
    },
    {
      treeId: "demo_btn_bb_srp_100bb_a95r",
      label: "Demo BTN vs BB SRP - A95 rainbow",
      flop: ["Ah", "9c", "5d"],
      turn: "Tc",
      river: "3s",
      heroCombos: ["AdKd", "QsJs", "9h8h", "7c6c"]
    },
    {
      treeId: "demo_btn_bb_srp_100bb_jt6ss",
      label: "Demo BTN vs BB SRP - JT6 two-tone",
      flop: ["Jd", "Ts", "6s"],
      turn: "2c",
      river: "Qh",
      heroCombos: ["AcJc", "KdQd", "8h7h", "As5s"]
    },
    {
      treeId: "demo_btn_bb_srp_100bb_754hhh",
      label: "Demo BTN vs BB SRP - 754 monotone",
      flop: ["7h", "5h", "4h"],
      turn: "Kd",
      river: "2s",
      heroCombos: ["AcKc", "QdJd", "8s6s", "Ad7d"]
    }
  ];

  window.FISHKILLER_SOLVED_TREES = window.FISHKILLER_SOLVED_TREES.concat(
    variants.map((variant) => createDemoVariant(source, variant))
  );

  function createDemoVariant(baseTree, variant) {
    const cardMap = {
      Ks: variant.flop[0],
      "7d": variant.flop[1],
      "2c": variant.flop[2],
      "4h": variant.turn,
      "9s": variant.river
    };
    const tree = remapCards(JSON.parse(JSON.stringify(baseTree)), cardMap);
    tree.treeId = variant.treeId;
    tree.label = variant.label;
    tree.metadata.flop = [...variant.flop];
    tree.metadata.heroCombos = [...variant.heroCombos];
    tree.metadata.source = "Mock/demo variant generated from the FishKiller MVP tree. Not real solver output.";

    Object.values(tree.nodes || {}).forEach((node) => {
      if (node.strategyByCombo) {
        node.strategyByCombo = remapStrategyCombos(node.strategyByCombo, variant.heroCombos);
      }
    });

    return tree;
  }

  function remapCards(value, cardMap) {
    if (Array.isArray(value)) {
      return value.map((item) => remapCards(item, cardMap));
    }

    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, remapCards(item, cardMap)])
      );
    }

    if (typeof value === "string") {
      return cardMap[value] || value;
    }

    return value;
  }

  function remapStrategyCombos(strategyByCombo, heroCombos) {
    const templates = Object.values(strategyByCombo || {});
    if (!templates.length) {
      return {};
    }

    return Object.fromEntries(
      heroCombos.map((combo, index) => [combo, JSON.parse(JSON.stringify(templates[index % templates.length]))])
    );
  }
})();
