(function (global) {
  "use strict";

  const TABLE_RAIL = {
    centerX: 0.5,
    centerY: 0.585,
    radiusX: 0.325,
    radiusY: 0.245,
  };

  const AVATAR_SEQUENCE = ["shark", "octopus", "turtle", "dolphin", "marlin", "anglerfish"];

  const AVATAR_BY_SEAT = {
    "SB / BTN": "dolphin",
    BTN: "dolphin",
    SB: "marlin",
    BB: "shark",
    UTG: "anglerfish",
    "UTG+1": "octopus",
    MP: "turtle",
    LJ: "marlin",
    HJ: "octopus",
    CO: "turtle",
    HERO: "dolphin",
  };

  const COORDINATES = {
    hu: [
      { seat: "SB / BTN", x: 0.5, y: 0.7 },
      { seat: "BB", x: 0.5, y: 0.28 },
    ],
    three: [
      { seat: "BTN", x: 0.5, y: 0.27 },
      { seat: "SB", x: 0.34, y: 0.7 },
      { seat: "BB", x: 0.66, y: 0.7 },
    ],
    six: [
      { seat: "UTG", x: 0.175, y: 0.5 },
      { seat: "HJ", x: 0.355, y: 0.28 },
      { seat: "CO", x: 0.645, y: 0.28 },
      { seat: "BTN", x: 0.825, y: 0.5 },
      { seat: "SB", x: 0.64, y: 0.7 },
      { seat: "BB", x: 0.36, y: 0.7 },
    ],
    nine: [
      { seat: "UTG", x: 0.155, y: 0.52 },
      { seat: "UTG+1", x: 0.24, y: 0.36 },
      { seat: "MP", x: 0.39, y: 0.26 },
      { seat: "LJ", x: 0.61, y: 0.26 },
      { seat: "HJ", x: 0.76, y: 0.36 },
      { seat: "CO", x: 0.845, y: 0.52 },
      { seat: "BTN", x: 0.70, y: 0.70 },
      { seat: "SB", x: 0.50, y: 0.74 },
      { seat: "BB", x: 0.30, y: 0.70 },
    ],
  };

  function getTableCoordinates(tableSize) {
    return COORDINATES[tableSize] || COORDINATES.six;
  }

  function getSeatCoordinate(tableSize, seat, index = 0, total = 6) {
    const configured = getTableCoordinates(tableSize).find((candidate) => candidate.seat === seat);
    if (configured) {
      return { ...configured };
    }

    return createFallbackCoordinate(seat, index, total);
  }

  function getSeatCoordinates(tableSize, seats = []) {
    const total = seats.length || getTableCoordinates(tableSize).length;

    return seats.map((seatConfig, index) => {
      const seat = typeof seatConfig === "string" ? seatConfig : seatConfig.seat;
      const coordinate = getSeatCoordinate(tableSize, seat, index, total);

      return {
        ...seatConfig,
        seat,
        x: coordinate.x,
        y: coordinate.y,
        avatar: getAvatarKey(seat, index),
      };
    });
  }

  function createFallbackCoordinate(seat, index, total) {
    const angle = (-90 + (360 / Math.max(total, 1)) * index) * (Math.PI / 180);
    const x = TABLE_RAIL.centerX + Math.cos(angle) * TABLE_RAIL.radiusX * 1.22;
    const y = TABLE_RAIL.centerY + Math.sin(angle) * TABLE_RAIL.radiusY * 1.22;

    return { seat, x: clamp(x, 0.12, 0.88), y: clamp(y, 0.22, 0.88) };
  }

  function getAvatarKey(seat, index = 0) {
    return AVATAR_BY_SEAT[seat] || AVATAR_SEQUENCE[index % AVATAR_SEQUENCE.length];
  }

  function getDealerSeat(tableSize, seats = [], heroSeat = "") {
    const seatNames = seats.map((seatConfig) => typeof seatConfig === "string" ? seatConfig : seatConfig.seat);
    if (seatNames.includes("BTN")) return "BTN";
    if (seatNames.includes("SB / BTN")) return "SB / BTN";
    if (tableSize === "hu" && heroSeat) return heroSeat;
    return seatNames[0] || "";
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  global.FK2_SCENE_COORDINATES = {
    AVATAR_SEQUENCE,
    AVATAR_BY_SEAT,
    TABLE_RAIL,
    getTableCoordinates,
    getSeatCoordinate,
    getSeatCoordinates,
    getAvatarKey,
    getDealerSeat,
  };
})(typeof window !== "undefined" ? window : globalThis);
