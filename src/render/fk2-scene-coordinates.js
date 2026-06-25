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
    UTG: Object.freeze({ x: 608, y: 320, side: "right" }),
    HJ: Object.freeze({ x: 992, y: 320, side: "left" }),
    CO: Object.freeze({ x: 1328, y: 466, side: "left" }),
    BTN: Object.freeze({ x: 1036, y: 702, side: "left" }),
    SB: Object.freeze({ x: 564, y: 702, side: "right" }),
    BB: Object.freeze({ x: 272, y: 466, side: "right" }),
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
    UTG: Object.freeze({ x: -190, y: -8 }),
    HJ: Object.freeze({ x: 122, y: -8 }),
    CO: Object.freeze({ x: -318, y: -86 }),
    BTN: Object.freeze({ x: -258, y: -102 }),
    SB: Object.freeze({ x: 126, y: -102 }),
    BB: Object.freeze({ x: 210, y: -86 }),
    left: Object.freeze({ x: -318, y: -86 }),
    right: Object.freeze({ x: 210, y: -86 }),
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
