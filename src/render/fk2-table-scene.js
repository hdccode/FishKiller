(function initFk2TableScene(root, factory) {
  const api = factory(root);
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.FishKillerFk2TableScene = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function buildFk2TableSceneApi(root) {
  const PIXI_CDN_URL = "https://cdn.jsdelivr.net/npm/pixi.js@8.8.1/dist/pixi.mjs";
  const FK2_SCENE_BACKGROUND_SRC = "assets/FishKiller2.2.png";
  const DEFAULT_HERO_CARDS = Object.freeze([
    Object.freeze({ rank: "A", suit: Object.freeze({ id: "spade", symbol: "\u2660" }) }),
    Object.freeze({ rank: "K", suit: Object.freeze({ id: "heart", symbol: "\u2665" }) }),
  ]);
  const SUIT_SYMBOL_BY_ID = Object.freeze({
    club: "\u2663",
    clubs: "\u2663",
    c: "\u2663",
    diamond: "\u2666",
    diamonds: "\u2666",
    d: "\u2666",
    heart: "\u2665",
    hearts: "\u2665",
    h: "\u2665",
    spade: "\u2660",
    spades: "\u2660",
    s: "\u2660",
  });
  let sceneAssetsPromise = null;
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
    const sceneAssets = await loadSceneAssets(Pixi);
    updateSceneTransform(scene, mount, coordinates.STAGE_SIZE);
    drawScene(Pixi, scene.world, coordinates, tableState, sceneAssets);
    return scene;
  }

  function loadSceneAssets(Pixi) {
    if (!sceneAssetsPromise) {
      sceneAssetsPromise = loadTexture(Pixi, FK2_SCENE_BACKGROUND_SRC)
        .then((backgroundTexture) => ({ backgroundTexture }))
        .catch((error) => {
          console.warn("Pixi FK2 background failed to load; using placeholder scene.", error);
          return { backgroundTexture: null };
        });
    }

    return sceneAssetsPromise;
  }

  async function loadTexture(Pixi, src) {
    if (Pixi.Assets?.load) {
      return Pixi.Assets.load(src);
    }

    if (Pixi.Texture?.from) {
      return Pixi.Texture.from(src);
    }

    throw new Error("PixiJS texture loading is unavailable.");
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
    const world = new Pixi.Container();
    const canvas = app.canvas || app.view;
    canvas.className = "pixi-table-canvas";
    canvas.setAttribute("aria-hidden", "true");
    mount.replaceChildren(canvas);
    app.stage.addChild(world);

    const scene = { app, world };
    sceneByMount.set(mount, scene);
    return scene;
  }

  function updateSceneTransform(scene, mount, stageSize) {
    const bounds = mount.getBoundingClientRect();
    const width = Math.max(1, Math.round(bounds.width));
    const height = Math.max(1, Math.round(bounds.height));

    if (scene.app.renderer?.resize) {
      scene.app.renderer.resize(width, height);
    }

    const canvas = scene.app.canvas || scene.app.view;
    if (canvas) {
      canvas.style.width = "100%";
      canvas.style.height = "100%";
    }

    const scale = Math.min(width / stageSize.width, height / stageSize.height);
    const scaledWidth = stageSize.width * scale;
    const scaledHeight = stageSize.height * scale;
    const offsetX = (width - scaledWidth) / 2;
    const offsetY = (height - scaledHeight) / 2;

    scene.world.scale.set(scale);
    scene.world.position.set(offsetX, offsetY);
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

  function drawScene(Pixi, stage, coordinates, tableState, sceneAssets) {
    stage.removeChildren();

    const hasSceneBackground = drawBackground(Pixi, stage, coordinates.STAGE_SIZE, sceneAssets);
    if (!hasSceneBackground) {
      drawTable(Pixi, stage, coordinates.TABLE);
    }
    drawSeats(Pixi, stage, coordinates.SEAT_POSITIONS, tableState);
    drawPot(Pixi, stage, coordinates.TABLE, tableState);
    drawHeroCards(Pixi, stage, coordinates, tableState);
  }

  function drawBackground(Pixi, stage, stageSize, sceneAssets) {
    if (sceneAssets?.backgroundTexture) {
      const backgroundSprite = new Pixi.Sprite(sceneAssets.backgroundTexture);
      fitSpriteCover(backgroundSprite, stageSize);
      stage.addChild(backgroundSprite);
      stage.addChild(createShape(Pixi, (graphics) => {
        drawRect(graphics, 0, 0, stageSize.width, stageSize.height, 0x000000, 0.08);
      }));
      return true;
    }

    const background = createShape(Pixi, (graphics) => {
      drawRect(graphics, 0, 0, stageSize.width, stageSize.height, 0x120805, 1);
      drawRect(graphics, 0, 0, stageSize.width, stageSize.height, 0x000000, 0.18);
    });
    stage.addChild(background);
    return false;
  }

  function fitSpriteCover(sprite, stageSize) {
    const textureWidth = Math.max(1, sprite.texture?.width || stageSize.width);
    const textureHeight = Math.max(1, sprite.texture?.height || stageSize.height);
    const scale = Math.max(stageSize.width / textureWidth, stageSize.height / textureHeight);
    const width = textureWidth * scale;
    const height = textureHeight * scale;

    sprite.width = width;
    sprite.height = height;
    sprite.x = (stageSize.width - width) / 2;
    sprite.y = (stageSize.height - height) / 2;
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

      const seatView = getSeatViewModel(tableState, seat, position);
      const style = root.FishKillerFk2SceneCoordinates?.SEAT_STYLE || {};
      const avatarRadius = seatView.isHero ? style.heroAvatarRadius || 52 : style.avatarRadius || 46;
      const plaqueWidth = style.plaqueWidth || 132;
      const plaqueHeight = style.plaqueHeight || 40;
      const statusWidth = style.statusWidth || 104;
      const statusHeight = style.statusHeight || 26;
      const plaqueX = seatView.isLeft ? -(avatarRadius + plaqueWidth + 10) : avatarRadius + 10;
      const markerText = seatView.isHero ? `${seat} (Hero)` : seat;
      const statusLabel = truncateLabel(seatView.caption, seatView.isHero ? 20 : 18);

      seatContainer.addChild(createShape(Pixi, (graphics) => {
        drawEllipse(graphics, 8, 11, avatarRadius + 8, avatarRadius * 0.34, 0x000000, seatView.isFolded ? 0.22 : 0.34);
      }));

      if (seatView.isActing || seatView.isHero || seatView.isVillainRecent) {
        seatContainer.addChild(createShape(Pixi, (graphics) => {
          drawEllipse(graphics, 0, 0, avatarRadius + 12, avatarRadius + 12, getSeatGlowColor(seatView), getSeatGlowAlpha(seatView));
        }));
      }

      seatContainer.addChild(createShape(Pixi, (graphics) => {
        drawEllipse(graphics, 0, 0, avatarRadius, avatarRadius, getSeatFillColor(seatView), seatView.isFolded ? 0.76 : 0.94);
        strokeEllipse(graphics, 0, 0, avatarRadius + 4, avatarRadius + 4, getSeatRingColor(seatView), getSeatRingAlpha(seatView), seatView.isActing || seatView.isHero ? 6 : 4);
        strokeEllipse(graphics, 0, 0, avatarRadius - 6, avatarRadius - 6, 0xffefb8, seatView.isFolded ? 0.08 : 0.16, 1.5);
      }));

      seatContainer.addChild(createShape(Pixi, (graphics) => {
        drawRoundedRect(graphics, plaqueX, -28, plaqueWidth, plaqueHeight, 10, 0x090604, seatView.isFolded ? 0.68 : 0.88);
        strokeRoundedRect(graphics, plaqueX, -28, plaqueWidth, plaqueHeight, 10, getPlaqueStrokeColor(seatView), seatView.isFolded ? 0.38 : 0.62, 2);
        drawRoundedRect(graphics, plaqueX + 14, 18, statusWidth, statusHeight, 8, 0x080504, seatView.isFolded ? 0.62 : 0.8);
        strokeRoundedRect(graphics, plaqueX + 14, 18, statusWidth, statusHeight, 8, getPlaqueStrokeColor(seatView), seatView.isFolded ? 0.26 : 0.46, 1.5);
      }));

      const seatText = createText(Pixi, markerText, {
        fill: seatView.isFolded ? 0xd9bd88 : 0xffdf96,
        fontFamily: "Georgia, serif",
        fontSize: seatView.isHero ? 18 : 19,
        fontWeight: "700",
        align: "center",
      });
      seatText.anchor.set(0.5);
      seatText.x = plaqueX + (plaqueWidth / 2);
      seatText.y = -8;
      seatContainer.addChild(seatText);

      const statusText = createText(Pixi, statusLabel, {
        fill: getStatusTextColor(seatView),
        fontFamily: "Arial, sans-serif",
        fontSize: 11,
        fontWeight: "700",
        align: "center",
        wordWrap: true,
        wordWrapWidth: statusWidth - 8,
      });
      statusText.anchor.set(0.5);
      statusText.x = plaqueX + 14 + (statusWidth / 2);
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
    const style = coordinates.SEAT_STYLE || {};
    const cardWidth = style.cardWidth || 50;
    const cardHeight = style.cardHeight || 70;
    const cardGap = style.cardGap || 8;
    const cards = normalizeCards(tableState.heroCards);

    cards.slice(0, 2).forEach((card, index) => {
      const x = heroPosition.x + cardOffset.x + (index * (cardWidth + cardGap));
      const y = heroPosition.y + cardOffset.y;
      stage.addChild(createShape(Pixi, (graphics) => {
        drawRoundedRect(graphics, x + 4, y + 6, cardWidth, cardHeight, 8, 0x000000, 0.26);
        drawRoundedRect(graphics, x, y, cardWidth, cardHeight, 8, 0xf8f3e8, 1);
        strokeRoundedRect(graphics, x, y, cardWidth, cardHeight, 8, 0x3b2412, 0.4, 2);
      }));

      const cardText = createText(Pixi, formatCardLabel(card), {
        fill: card.isRed ? 0xbc2d28 : 0x141a18,
        fontFamily: "Georgia, serif",
        fontSize: 22,
        fontWeight: "800",
      });
      cardText.x = x + 12;
      cardText.y = y + 10;
      stage.addChild(cardText);
    });
  }

  function getSeatViewModel(tableState, seat, position) {
    const actor = tableState.actorMap?.[seat];
    const seatState = tableState.displayedSeatStates?.[seat] || {};
    const isHero = seat === tableState.heroSeat;
    const isActing = tableState.actingSeat === seat;
    const isFolded = tableState.foldedSeats?.includes(seat) || seatState.status === "folded" || /fold/i.test(seatState.label || "");
    const isVillainRecent = tableState.villainResponse?.seat === seat;
    const isPostflop = tableState.spot?.street && tableState.spot.street !== "preflop";
    const displayedStateLabel = /to act/i.test(seatState.label || "") && !isActing && !isHero
      ? "Waiting"
      : seatState.label;
    const actionLabel = isVillainRecent
      ? formatVillainResponseLabel(tableState.villainResponse)
      : seatState.pendingFoldAnimation
        ? displayedStateLabel
        : isPostflop && displayedStateLabel
          ? displayedStateLabel
          : tableState.bettingSummary?.actionBySeat?.[seat] || actor?.label || "";
    const caption = isHero
      ? "Hero to act"
      : isVillainRecent
        ? actionLabel
        : actor
          ? actionLabel
          : displayedStateLabel || "Waiting";

    return {
      seat,
      caption,
      isHero,
      isActing,
      isFolded,
      isVillainRecent,
      isLeft: position.side === "left",
      hasAction: Boolean(actor || actionLabel),
    };
  }

  function formatVillainResponseLabel(response) {
    if (!response) {
      return "";
    }

    return [response.action, response.amountLabel].filter(Boolean).join(" ");
  }

  function truncateLabel(label, maxLength) {
    const normalizedLabel = String(label || "Waiting");
    if (normalizedLabel.length <= maxLength) {
      return normalizedLabel;
    }

    return `${normalizedLabel.slice(0, Math.max(0, maxLength - 1)).trim()}…`;
  }

  function getSeatFillColor(seatView) {
    if (seatView.isHero) {
      return 0x21495e;
    }

    if (seatView.isVillainRecent || seatView.hasAction) {
      return 0x2f2019;
    }

    if (seatView.isFolded) {
      return 0x1b211c;
    }

    return 0x122f27;
  }

  function getSeatRingColor(seatView) {
    if (seatView.isHero || seatView.isActing) {
      return 0xffcc66;
    }

    if (seatView.isVillainRecent || seatView.hasAction) {
      return 0xd6863a;
    }

    if (seatView.isFolded) {
      return 0x8d734b;
    }

    return 0xd69b42;
  }

  function getSeatRingAlpha(seatView) {
    if (seatView.isHero || seatView.isActing) {
      return 0.94;
    }

    if (seatView.isFolded) {
      return 0.46;
    }

    return 0.68;
  }

  function getSeatGlowColor(seatView) {
    if (seatView.isVillainRecent || seatView.hasAction) {
      return 0xb84f2d;
    }

    return 0xffc866;
  }

  function getSeatGlowAlpha(seatView) {
    if (seatView.isHero || seatView.isActing) {
      return 0.2;
    }

    return 0.12;
  }

  function getPlaqueStrokeColor(seatView) {
    if (seatView.isHero || seatView.isActing) {
      return 0xffcc66;
    }

    if (seatView.isVillainRecent || seatView.hasAction) {
      return 0xc87337;
    }

    return 0xd69b42;
  }

  function getStatusTextColor(seatView) {
    if (seatView.isHero || seatView.isActing) {
      return 0xffedbd;
    }

    if (seatView.isFolded) {
      return 0xd7c5a6;
    }

    return 0xf2dec2;
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
    const normalizedCard = normalizeCard(card);
    return `${normalizedCard.rank}${normalizedCard.suitSymbol}`;
  }

  function isRedCard(card) {
    return normalizeCard(card).isRed;
  }

  function normalizeCards(cards) {
    const sourceCards = Array.isArray(cards) && cards.length ? cards : DEFAULT_HERO_CARDS;
    return sourceCards.slice(0, 2).map((card, index) => normalizeCard(card, DEFAULT_HERO_CARDS[index]));
  }

  function normalizeCard(card, fallback = DEFAULT_HERO_CARDS[0]) {
    if (typeof card === "string") {
      const trimmed = card.trim();
      const rank = trimmed[0] || fallback.rank;
      const rawSuit = trimmed.slice(1);
      const suitSymbol = normalizeSuitSymbol(rawSuit, fallback.suit);
      return {
        rank,
        suitSymbol,
        isRed: suitSymbol === "\u2665" || suitSymbol === "\u2666",
      };
    }

    const rank = card?.rank || fallback.rank;
    const suit = card?.suit || fallback.suit;
    const suitSymbol = normalizeSuitSymbol(suit, fallback.suit);
    return {
      rank,
      suitSymbol,
      isRed: isRedSuit(suit, suitSymbol),
    };
  }

  function normalizeSuitSymbol(suit, fallbackSuit) {
    if (typeof suit === "string") {
      return SUIT_SYMBOL_BY_ID[suit.toLowerCase()] || suit || fallbackSuit?.symbol || "";
    }

    return suit?.symbol || SUIT_SYMBOL_BY_ID[String(suit?.id || "").toLowerCase()] || fallbackSuit?.symbol || "";
  }

  function isRedSuit(suit, suitSymbol) {
    const suitId = typeof suit === "string" ? suit.toLowerCase() : String(suit?.id || "").toLowerCase();
    return suitSymbol === "\u2665" || suitSymbol === "\u2666" || suitId === "heart" || suitId === "diamond" || suitId === "h" || suitId === "d";
  }

  return Object.freeze({
    renderTableScene,
    destroyTableScene,
    PIXI_CDN_URL,
  });
});
