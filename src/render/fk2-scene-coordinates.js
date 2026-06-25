(function initFk2SceneCoordinates(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.FishKillerFk2SceneCoordinates = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function buildFk2SceneCoordinatesApi() {
  const STAGE_SIZE = Object.freeze({ width: 1600, height: 900 });

  const SCENE_FRAME = Object.freeze({
    zoom: 1.18,
    offsetX: 0,
    offsetY: 34,
  });

  const SEAT_POSITIONS = Object.freeze({
    UTG: Object.freeze({ x: 608, y: 304, side: "right" }),
    HJ: Object.freeze({ x: 992, y: 304, side: "left" }),
    CO: Object.freeze({ x: 1328, y: 452, side: "left" }),
    BTN: Object.freeze({ x: 1036, y: 674, side: "left" }),
    SB: Object.freeze({ x: 564, y: 674, side: "right" }),
    BB: Object.freeze({ x: 272, y: 452, side: "right" }),
  });

  const TABLE = Object.freeze({
    centerX: 800,
    centerY: 506,
    radiusX: 520,
    radiusY: 228,
    feltRadiusX: 390,
    feltRadiusY: 142,
  });

  const HERO_CARD_OFFSETS = Object.freeze({
    UTG: Object.freeze({ x: 92, y: -34 }),
    HJ: Object.freeze({ x: -200, y: -34 }),
    CO: Object.freeze({ x: -318, y: -76 }),
    BTN: Object.freeze({ x: -258, y: -110 }),
    SB: Object.freeze({ x: 126, y: -110 }),
    BB: Object.freeze({ x: 210, y: -76 }),
    left: Object.freeze({ x: -318, y: -76 }),
    right: Object.freeze({ x: 210, y: -76 }),
  });

  const BOARD = Object.freeze({
    x: 631,
    y: 358,
    cardWidth: 58,
    cardHeight: 78,
    gap: 12,
    slots: 5,
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
    SCENE_FRAME,
    SEAT_POSITIONS,
    TABLE,
    HERO_CARD_OFFSETS,
    BOARD,
    SEAT_STYLE,
  });
});
