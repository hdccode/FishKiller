window.FISHKILLER_SOLVER_LIBRARY = {
  version: 1,
  packs: [
    {
      id: "example-sixmax-srp-a72r",
      name: "Example Solver Pack",
      source: "Replace this disabled example with your own Pio/GTO+/open-source solver export.",
      enabled: false,
      spots: [
        {
          id: "sixmax-btn-srp-a72r-flop",
          name: "6-max BTN SRP A72r flop",
          enabled: true,
          tableSize: "six",
          heroSeat: "BTN",
          street: "flop",
          preflopActionIncludes: "Open",
          potBbRange: [4, 16],
          board: {
            ranks: "A72",
            texture: ["dry", "rainbow"],
          },
          actions: ["check", "bet-small", "bet-big"],
          strategy: {
            AA: { mix: { "bet-big": 0.85, check: 0.15 }, tags: ["value", "mix"], note: "Top set favors large value while retaining slowplays." },
            AKs: { mix: { "bet-big": 0.62, "bet-small": 0.28, check: 0.1 }, tags: ["value", "mix"] },
            A5s: { mix: { "bet-small": 0.54, check: 0.46 }, tags: ["value", "mix"] },
            KQs: { mix: { "bet-small": 0.32, check: 0.68 }, tags: ["bluff", "mix"] },
            "54s": { mix: { "bet-small": 0.44, check: 0.56 }, tags: ["bluff", "mix"] },
            "32o": { mix: { check: 1 }, tags: [], note: "Give up low-equity air without useful blockers." },
          },
        },
      ],
    },
  ],
};
