(function initFk2TableScene(root, factory) {
  const api = factory(root);
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.FishKillerFk2TableScene = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function buildFk2TableSceneApi(root) {
  const PIXI_CDN_URL = "https://cdn.jsdelivr.net/npm/pixi.js@8.8.1/dist/pixi.mjs";
  const sceneByMount = new WeakMap();

  async function loadPixi() {
    if (root.PIXI) {
      return root.PIXI;
    }

    const pixiModule = await import(PIXI_CDN_URL);
    return pixiModule;
  }

  async function renderTableScene(mount, tableState) {
    if (!mount || !tableState?.scenario) {
      return null;
    }

    const Pixi = await loadPixi();
    const coordinates = root.FishKillerFk2SceneCoordinates;
    if (!coordinates) {
      throw new Error("FishKiller FK2 scene coordinates are not loaded.");
    }

    const scene = await getOrCreateScene(Pixi, mount, coordinates.STAGE_SIZE);
    drawScene(Pixi, scene.app.stage, coordinates, tableState);
    return scene;
  }

  function destroyTableScene(mount) {
    const scene = sceneByMount.get(mount);
    if (!scene) {
      return;
    }

    scene.app.destroy(true, { children: true, texture: false, baseTexture: false });
    sceneByMount.delete(mount);
    mount.replaceChildren();
  }

  async function getOrCreateScene(Pixi, mount, stageSize) {
    const existingScene = sceneByMount.get(mount);
    if (existingScene) {
      return existingScene;
    }

    const app = await createPixiApplication(Pixi, stageSize);
    const canvas = app.canvas || app.view;
    canvas.className = "pixi-table-canvas";
    canvas.setAttribute("aria-hidden", "true");
    mount.replaceChildren(canvas);

    const scene = { app };
    sceneByMount.set(mount, scene);
    return scene;
  }

  async function createPixiApplication(Pixi, stageSize) {
    if (typeof Pixi.Application === "function") {
      const app = new Pixi.Application();
      if (typeof app.init === "function") {
        await app.init({
          width: stageSize.width,
          height: stageSize.height,
          backgroundAlpha: 0,
          antialias: true,
          resolution: root.devicePixelRatio || 1,
          autoDensity: true,
        });
        return app;
      }

      return new Pixi.Application({
        width: stageSize.width,
        height: stageSize.height,
        transparent: true,
        antialias: true,
        resolution: root.devicePixelRatio || 1,
        autoDensity: true,
      });
    }

    throw new Error("PixiJS Application constructor is unavailable.");
  }

  function drawScene(Pixi, stage, coordinates, tableState) {
    stage.removeChildren();

    drawBackground(Pixi, stage, coordinates.STAGE_SIZE);
    drawTable(Pixi, stage, coordinates.TABLE);
    drawSeats(Pixi, stage, coordinates.SEAT_POSITIONS, tableState);
    drawPot(Pixi, stage, coordinates.TABLE, tableState);
    drawHeroCards(Pixi, stage, coordinates, tableState);
  }

  function drawBackground(Pixi, stage, stageSize) {
    const background = createShape(Pixi, (graphics) => {
      drawRect(graphics, 0, 0, stageSize.width, stageSize.height, 0x120805, 1);
      drawRect(graphics, 0, 0, stageSize.width, stageSize.height, 0x000000, 0.18);
    });
    stage.addChild(background);
  }

  function drawTable(Pixi, stage, table) {
    const tableLayer = createShape(Pixi, (graphics) => {
      drawEllipse(graphics, table.centerX, table.centerY, table.radiusX, table.radiusY, 0x4b230d, 0.98);
      strokeEllipse(graphics, table.centerX, table.centerY, table.radiusX, table.radiusY, 0xd69b42, 0.46, 6);
      drawEllipse(graphics, table.centerX, table.centerY, table.feltRadiusX, table.feltRadiusY, 0x193126, 1);
      strokeEllipse(graphics, table.centerX, table.centerY, table.feltRadiusX, table.feltRadiusY, 0xae7a31, 0.34, 3);
    });
    stage.addChild(tableLayer);
  }

  function drawSeats(Pixi, stage, seatPositions, tableState) {
    Object.entries(seatPositions).forEach(([seat, position]) => {
      const seatContainer = new Pixi.Container();
      seatContainer.x = position.x;
      seatContainer.y = position.y;

      const isHero = seat === tableState.heroSeat;
      const statusLabel = getSeatStatusLabel(tableState, seat, isHero);
      const isLeft = position.side === "left";

      seatContainer.addChild(createShape(Pixi, (graphics) => {
        drawEllipse(graphics, 0, 0, isHero ? 48 : 42, isHero ? 48 : 42, isHero ? 0x264f65 : 0x172923, 1);
        strokeEllipse(graphics, 0, 0, isHero ? 51 : 45, isHero ? 51 : 45, isHero ? 0xffcc66 : 0xd69b42, isHero ? 0.92 : 0.66, 5);
      }));

      const plaqueX = isLeft ? -176 : 52;
      seatContainer.addChild(createShape(Pixi, (graphics) => {
        drawRoundedRect(graphics, plaqueX, -28, 124, 40, 10, 0x090604, 0.88);
        strokeRoundedRect(graphics, plaqueX, -28, 124, 40, 10, 0xd69b42, 0.58, 2);
        drawRoundedRect(graphics, plaqueX + 16, 18, 92, 26, 8, 0x090604, 0.78);
        strokeRoundedRect(graphics, plaqueX + 16, 18, 92, 26, 8, 0xae7a31, 0.42, 1.5);
      }));

      const seatText = createText(Pixi, seat, {
        fill: 0xffdf96,
        fontFamily: "Georgia, serif",
        fontSize: 19,
        fontWeight: "700",
        align: "center",
      });
      seatText.anchor.set(0.5);
      seatText.x = plaqueX + 62;
      seatText.y = -8;
      seatContainer.addChild(seatText);

      const statusText = createText(Pixi, statusLabel, {
        fill: 0xf2dec2,
        fontFamily: "Arial, sans-serif",
        fontSize: 11,
        fontWeight: "700",
        align: "center",
      });
      statusText.anchor.set(0.5);
      statusText.x = plaqueX + 62;
      statusText.y = 31;
      seatContainer.addChild(statusText);

      stage.addChild(seatContainer);
    });
  }

  function drawPot(Pixi, stage, table, tableState) {
    const label = tableState.potLabel ? `Pot ${tableState.potLabel}` : `Pot ${Number(tableState.potBb || 0).toFixed(1)}bb`;
    const potBadge = createShape(Pixi, (graphics) => {
      drawRoundedRect(graphics, table.centerX - 72, table.centerY - 32, 144, 38, 16, 0x090604, 0.82);
      strokeRoundedRect(graphics, table.centerX - 72, table.centerY - 32, 144, 38, 16, 0xd69b42, 0.56, 2);
    });
    stage.addChild(potBadge);

    const potText = createText(Pixi, label, {
      fill: 0xffdf96,
      fontFamily: "Arial, sans-serif",
      fontSize: 20,
      fontWeight: "700",
    });
    potText.anchor.set(0.5);
    potText.x = table.centerX;
    potText.y = table.centerY - 13;
    stage.addChild(potText);
  }

  function drawHeroCards(Pixi, stage, coordinates, tableState) {
    const heroPosition = coordinates.SEAT_POSITIONS[tableState.heroSeat] || { x: 800, y: 690, side: "right" };
    const cardOffset = coordinates.HERO_CARD_OFFSETS[heroPosition.side] || coordinates.HERO_CARD_OFFSETS.right;
    const cards = tableState.heroCards.length ? tableState.heroCards : ["A♠", "K♥"];

    cards.slice(0, 2).forEach((card, index) => {
      const x = heroPosition.x + cardOffset.x + (index * 58);
      const y = heroPosition.y + cardOffset.y;
      stage.addChild(createShape(Pixi, (graphics) => {
        drawRoundedRect(graphics, x, y, 50, 70, 8, 0xf8f3e8, 1);
        strokeRoundedRect(graphics, x, y, 50, 70, 8, 0x3b2412, 0.4, 2);
      }));

      const cardText = createText(Pixi, formatCardLabel(card), {
        fill: isRedCard(card) ? 0xbc2d28 : 0x141a18,
        fontFamily: "Georgia, serif",
        fontSize: 22,
        fontWeight: "800",
      });
      cardText.x = x + 12;
      cardText.y = y + 10;
      stage.addChild(cardText);
    });
  }

  function getSeatStatusLabel(tableState, seat, isHero) {
    if (isHero) {
      return "Hero";
    }

    return tableState.bettingSummary?.actionBySeat?.[seat]
      || tableState.displayedSeatStates?.[seat]?.label
      || "Waiting";
  }

  function createText(Pixi, text, style) {
    try {
      return new Pixi.Text({ text: String(text || ""), style });
    } catch (_error) {
      return new Pixi.Text(String(text || ""), style);
    }
  }

  function createShape(Pixi, draw) {
    const graphics = new Pixi.Graphics();
    draw(graphics);
    return graphics;
  }

  function drawRect(graphics, x, y, width, height, color, alpha) {
    if (typeof graphics.rect === "function") {
      graphics.rect(x, y, width, height).fill({ color, alpha });
      return;
    }

    graphics.beginFill(color, alpha);
    graphics.drawRect(x, y, width, height);
    graphics.endFill();
  }

  function drawRoundedRect(graphics, x, y, width, height, radius, color, alpha) {
    if (typeof graphics.roundRect === "function") {
      graphics.roundRect(x, y, width, height, radius).fill({ color, alpha });
      return;
    }

    graphics.beginFill(color, alpha);
    graphics.drawRoundedRect(x, y, width, height, radius);
    graphics.endFill();
  }

  function strokeRoundedRect(graphics, x, y, width, height, radius, color, alpha, lineWidth) {
    if (typeof graphics.roundRect === "function") {
      graphics.roundRect(x, y, width, height, radius).stroke({ color, alpha, width: lineWidth });
      return;
    }

    graphics.lineStyle(lineWidth, color, alpha);
    graphics.drawRoundedRect(x, y, width, height, radius);
  }

  function drawEllipse(graphics, x, y, radiusX, radiusY, color, alpha) {
    if (typeof graphics.ellipse === "function") {
      graphics.ellipse(x, y, radiusX, radiusY).fill({ color, alpha });
      return;
    }

    graphics.beginFill(color, alpha);
    graphics.drawEllipse(x, y, radiusX, radiusY);
    graphics.endFill();
  }

  function strokeEllipse(graphics, x, y, radiusX, radiusY, color, alpha, lineWidth) {
    if (typeof graphics.ellipse === "function") {
      graphics.ellipse(x, y, radiusX, radiusY).stroke({ color, alpha, width: lineWidth });
      return;
    }

    graphics.lineStyle(lineWidth, color, alpha);
    graphics.drawEllipse(x, y, radiusX, radiusY);
  }

  function formatCardLabel(card) {
    if (typeof card === "string") {
      return card;
    }

    return `${card?.rank || ""}${card?.suit || ""}`;
  }

  function isRedCard(card) {
    const label = formatCardLabel(card);
    return /[♥♦hd]/i.test(label);
  }

  return Object.freeze({
    renderTableScene,
    destroyTableScene,
    PIXI_CDN_URL,
  });
});
