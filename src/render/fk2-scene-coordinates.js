(function initFk2SceneCoordinates(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.FishKillerFk2SceneCoordinates = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function buildFk2SceneCoordinatesApi() {
  const STAGE_SIZE = Object.freeze({ width: 1600, height: 900 });

  const SEAT_POSITIONS = Object.freeze({
    UTG: Object.freeze({ x: 470, y: 246, side: "right" }),
    HJ: Object.freeze({ x: 1130, y: 246, side: "left" }),
    CO: Object.freeze({ x: 1288, y: 450, side: "left" }),
    BTN: Object.freeze({ x: 1088, y: 678, side: "left" }),
    SB: Object.freeze({ x: 512, y: 678, side: "right" }),
    BB: Object.freeze({ x: 312, y: 450, side: "right" }),
  });

  const TABLE = Object.freeze({
    centerX: 800,
    centerY: 455,
    radiusX: 615,
    radiusY: 250,
    feltRadiusX: 470,
    feltRadiusY: 170,
  });

  const HERO_CARD_OFFSETS = Object.freeze({
    left: Object.freeze({ x: -302, y: -34 }),
    right: Object.freeze({ x: 214, y: -34 }),
  });

  const SEAT_STYLE = Object.freeze({
    avatarRadius: 46,
    heroAvatarRadius: 52,
    plaqueWidth: 132,
    plaqueHeight: 40,
    statusWidth: 104,
    statusHeight: 26,
    cardWidth: 50,
    cardHeight: 70,
    cardGap: 8,
  });

  return Object.freeze({
    STAGE_SIZE,
    SEAT_POSITIONS,
    TABLE,
    HERO_CARD_OFFSETS,
    SEAT_STYLE,
  });
});
