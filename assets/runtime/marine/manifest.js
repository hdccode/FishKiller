(function (global) {
  "use strict";

  const basePath = "assets/runtime/marine/";
  const asset = (filename) => `${basePath}${filename}`;

  const semantic = {
    background: {
      table: {
        v3_0: asset("marine-background.png"),
      },
    },
    character: {
      shark: {
        v3_1: asset("avatar-shark-v3_1.png"),
      },
      octopus: {
        v3_1: asset("avatar-octopus-v3_1.png"),
      },
      turtle: {
        v3_1: asset("avatar-turtle-v3_1.png"),
      },
      dolphin: {
        v3_1: asset("avatar-dolphin-v3_1.png"),
      },
      swordfish: {
        v3_1: asset("avatar-swordfish-v3_1.png"),
      },
      anglerfish: {
        v3_1: asset("avatar-anglerfish-v3_1.png"),
      },
    },
    frame: {
      main: {
        v3_1: asset("seat-frame-v3_1.png"),
      },
    },
    chip: {
      anchor: {
        v4_1: asset("chip-anchor-v4_1.png"),
      },
      helm: {
        v4_2: asset("chip-helm-v4_2.png"),
      },
      stack: {
        small: {
          v4_3: asset("chip-stack-small-v4_3.png"),
        },
        medium: {
          v4_5: asset("chip-stack-medium-v4_5.png"),
        },
        tall: {
          v4_6: asset("chip-stack-tall-v4_6.png"),
        },
      },
      potPile: {
        v4_4: asset("chip-pot-pile-v4_4.png"),
      },
      shadow: {
        v3_1: asset("chip-shadow-v3_1.png"),
      },
    },
  };

  const production = {
    background: semantic.background.table.v3_0,
    character: {
      shark: semantic.character.shark.v3_1,
      octopus: semantic.character.octopus.v3_1,
      turtle: semantic.character.turtle.v3_1,
      dolphin: semantic.character.dolphin.v3_1,
      marlin: semantic.character.swordfish.v3_1,
      swordfish: semantic.character.swordfish.v3_1,
      anglerfish: semantic.character.anglerfish.v3_1,
    },
    frame: {
      main: semantic.frame.main.v3_1,
    },
    chip: {
      anchor: semantic.chip.anchor.v4_1,
      helm: semantic.chip.helm.v4_2,
      stackSmall: semantic.chip.stack.small.v4_3,
      stackMedium: semantic.chip.stack.medium.v4_5,
      stackTall: semantic.chip.stack.tall.v4_6,
      potPile: semantic.chip.potPile.v4_4,
      shadow: semantic.chip.shadow.v3_1,
    },
    dealer: {
      button: null,
    },
  };

  global.FK2_MARINE_ASSETS = {
    basePath,
    versions: {
      active: {
        background: "v3_0",
        character: "v3_1",
        frame: "v3_1",
        chip: "v4",
        chipShadow: "v3_1",
      },
      preference: ["v4", "v3_1", "legacy"],
    },
    semantic,
    production,
    disabled: {
      chip: {
        anchor: {
          v3_1: {
            source: "FKChip3.1.png",
            reason: "Opaque 24bpp RGB PNG with baked white/preview background; not copied into the production runtime set.",
          },
        },
      },
      legacy: {
        v3_0: {
          reason: "Older generated sprite set had baked checker/white backgrounds. Kept only where an existing wired asset has no newer replacement.",
        },
      },
    },
    images: {
      background: production.background,
      seatFrame: production.frame.main,
      dealerButton: production.dealer.button,
      cardBack: asset("card-back.png"),
      avatars: production.character,
      chips: {
        singleBlue: production.chip.anchor,
        singleRed: production.chip.helm,
        singleGold: production.chip.anchor,
        stackSmall: production.chip.stackSmall,
        stackMedium: production.chip.stackMedium,
        stackTall: production.chip.stackTall,
        potPile: production.chip.potPile,
        shadow: production.chip.shadow,
      },
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
