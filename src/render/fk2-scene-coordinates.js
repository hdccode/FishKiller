(function initFk2SceneCoordinates(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.FishKillerFk2SceneCoordinates = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function buildFk2SceneCoordinatesApi() {
  const STAGE_SIZE = Object.freeze({ width: 1600, height: 900 });

  const SCENE_FRAME = Object.freeze({
    zoom: 1.2,
    offsetX: 0,
    offsetY: 68,
  });

  const SEAT_POSITIONS = Object.freeze({
    UTG: Object.freeze({ x: 608, y: 276, side: "right" }),
    HJ: Object.freeze({ x: 992, y: 276, side: "left" }),
    CO: Object.freeze({ x: 1328, y: 422, side: "left" }),
    BTN: Object.freeze({ x: 1036, y: 658, side: "left" }),
    SB: Object.freeze({ x: 564, y: 658, side: "right" }),
    BB: Object.freeze({ x: 272, y: 422, side: "right" }),
  });

  const TABLE = Object.freeze({
    centerX: 800,
    centerY: 538,
    radiusX: 520,
    radiusY: 228,
    feltRadiusX: 390,
    feltRadiusY: 142,
  });

  const HERO_CARD_OFFSETS = Object.freeze({
    UTG: Object.freeze({ x: -166, y: -4 }),
    HJ: Object.freeze({ x: 120, y: -4 }),
    CO: Object.freeze({ x: -240, y: -122 }),
    BTN: Object.freeze({ x: -230, y: -92 }),
    SB: Object.freeze({ x: 96, y: -92 }),
    BB: Object.freeze({ x: 188, y: -122 }),
    left: Object.freeze({ x: -240, y: -122 }),
    right: Object.freeze({ x: 188, y: -122 }),
  });

  const BOARD = Object.freeze({
    x: 631,
    y: 382,
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
    cardWidth: 46,
    cardHeight: 64,
    cardGap: 7,
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
