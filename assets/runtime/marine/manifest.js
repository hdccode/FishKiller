(function (global) {
  "use strict";

  const basePath = "assets/runtime/marine/";

  global.FK2_MARINE_ASSETS = {
    basePath,
    images: {
      background: `${basePath}marine-background.png`,
      seatFrame: `${basePath}seat-frame.png`,
      dealerButton: `${basePath}dealer-button.png`,
      cardBack: `${basePath}card-back.png`,
      avatars: {
        shark: `${basePath}avatar-shark.png`,
        octopus: `${basePath}avatar-octopus.png`,
        turtle: `${basePath}avatar-turtle.png`,
        dolphin: `${basePath}avatar-dolphin.png`,
        marlin: `${basePath}avatar-marlin.png`,
        anglerfish: `${basePath}avatar-anglerfish.png`,
      },
      chips: {
        singleBlue: `${basePath}chip-single-blue.png`,
        singleRed: `${basePath}chip-single-red.png`,
        singleGold: `${basePath}chip-single-gold.png`,
        stackSmall: `${basePath}chip-stack-small.png`,
        stackMedium: `${basePath}chip-stack-medium.png`,
        potPile: `${basePath}chip-pot-pile.png`,
        shadow: `${basePath}chip-shadow.png`,
      },
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
