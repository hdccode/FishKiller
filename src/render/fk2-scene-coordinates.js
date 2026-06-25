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
    UTG: Object.freeze({ x: 531, y: 276, side: "right" }),
    HJ: Object.freeze({ x: 1069, y: 276, side: "left" }),
    CO: Object.freeze({ x: 1328, y: 422, side: "left" }),
    BTN: Object.freeze({ x: 1130, y: 658, side: "left" }),
    SB: Object.freeze({ x: 470, y: 658, side: "right" }),
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

  const CARD_SIZES = Object.freeze({
    hero: Object.freeze({
      width: 56,
      height: 81,
      gap: 10,
    }),
    board: Object.freeze({
      width: 52,
      height: 75,
      gap: 10,
    }),
  });

  const HERO_CARD_ANCHORS = Object.freeze({
    UTG: Object.freeze({ x: 470, y: 135 }),
    HJ: Object.freeze({ x: 1008, y: 135 }),
    CO: Object.freeze({ x: 1267, y: 281 }),
    BTN: Object.freeze({ x: 1069, y: 517 }),
    SB: Object.freeze({ x: 409, y: 517 }),
    BB: Object.freeze({ x: 211, y: 281 }),
  });

  const BOARD = Object.freeze({
    x: 650,
    y: 382,
    cardWidth: CARD_SIZES.board.width,
    cardHeight: CARD_SIZES.board.height,
    gap: CARD_SIZES.board.gap,
    slots: 5,
  });

  const SEAT_STYLE = Object.freeze({
    avatarRadius: 46,
    heroAvatarRadius: 52,
    plaqueWidth: 132,
    plaqueHeight: 40,
    statusWidth: 104,
    statusHeight: 26,
    cardWidth: 41,
    cardHeight: 57,
    cardGap: 5,
  });

  return Object.freeze({
    STAGE_SIZE,
    SCENE_FRAME,
    SEAT_POSITIONS,
    TABLE,
    CARD_SIZES,
    HERO_CARD_ANCHORS,
    BOARD,
    SEAT_STYLE,
  });
});
