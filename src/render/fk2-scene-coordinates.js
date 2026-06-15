(function initFk2SceneCoordinates(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.FishKillerFk2SceneCoordinates = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function buildFk2SceneCoordinatesApi() {
  const STAGE_SIZE = Object.freeze({ width: 1600, height: 900 });

  const SEAT_POSITIONS = Object.freeze({
    UTG: Object.freeze({ x: 470, y: 250, side: "right" }),
    HJ: Object.freeze({ x: 1130, y: 250, side: "left" }),
    CO: Object.freeze({ x: 1330, y: 465, side: "left" }),
    BTN: Object.freeze({ x: 1115, y: 705, side: "left" }),
    SB: Object.freeze({ x: 485, y: 705, side: "right" }),
    BB: Object.freeze({ x: 270, y: 465, side: "right" }),
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
    left: Object.freeze({ x: -168, y: -36 }),
    right: Object.freeze({ x: 76, y: -36 }),
  });

  return Object.freeze({
    STAGE_SIZE,
    SEAT_POSITIONS,
    TABLE,
    HERO_CARD_OFFSETS,
  });
});
