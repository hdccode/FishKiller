(function initFk2TableScene(root, factory) {
  const api = factory(root);
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.FishKillerFk2TableScene = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function buildFk2TableSceneApi(root) {
  const PIXI_CDN_URL = "https://cdn.jsdelivr.net/npm/pixi.js@8.8.1/dist/pixi.mjs";
  const FK2_SCENE_BACKGROUND_SRC = "assets/FishKiller2.2.png";
  const SEAT_FRAME_RIGHT_SRC = "assets/FKSeat/FKFrame_transparent.png";
  const SEAT_FRAME_LEFT_SRC = "assets/FKSeat/FKFrameLeft_transparent.png";
  const AVATAR_SRC_BY_SEAT = Object.freeze({
    UTG: "assets/avatars/seat-shark.png",
    HJ: "assets/avatars/seat-octopus.png",
    CO: "assets/avatars/seat-turtle.png",
    BTN: "assets/avatars/seat-blue-shark.png",
    SB: "assets/avatars/seat-dolphin.png",
    BB: "assets/avatars/seat-angler.png",
  });
  const SEAT_FRAME_TEXTURE_ANCHORS = Object.freeze({
    right: Object.freeze({ x: 0.25, y: 0.5 }),
    left: Object.freeze({ x: 0.74, y: 0.5 }),
  });
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
      sceneAssetsPromise = Promise.all([
        loadOptionalTexture(Pixi, FK2_SCENE_BACKGROUND_SRC, "background"),
        loadOptionalTexture(Pixi, SEAT_FRAME_RIGHT_SRC, "right seat frame"),
        loadOptionalTexture(Pixi, SEAT_FRAME_LEFT_SRC, "left seat frame"),
        loadAvatarTextures(Pixi),
      ]).then(([backgroundTexture, seatFrameRightTexture, seatFrameLeftTexture, avatarTextures]) => (
        {
          backgroundTexture,
          seatFrameRightTexture,
          seatFrameLeftTexture,
          avatarTextures,
        }
      ));
    }

    return sceneAssetsPromise;
  }

  function loadAvatarTextures(Pixi) {
    const avatarEntries = Object.entries(AVATAR_SRC_BY_SEAT);
    return Promise.all(avatarEntries.map(([seat, src]) => (
      loadOptionalTexture(Pixi, src, `${seat} avatar`).then((texture) => [seat, texture])
    ))).then((entries) => Object.fromEntries(entries.filter(([, texture]) => texture)));
  }

  function loadOptionalTexture(Pixi, src, label) {
    return loadTexture(Pixi, src).catch((error) => {
      console.warn(`Pixi ${label} texture failed to load; using primitive fallback.`, error);
      return null;
    });
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
    drawSeats(Pixi, stage, coordinates.SEAT_POSITIONS, tableState, sceneAssets);
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

  function drawSeats(Pixi, stage, seatPositions, tableState, sceneAssets) {
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

      const avatarTexture = getSeatAvatarTexture(sceneAssets, seat);
      const didDrawFrameTexture = drawSeatFrameTexture(Pixi, seatContainer, seatView, avatarRadius, sceneAssets);
      drawSeatMedallion(Pixi, seatContainer, seatView, avatarRadius, {
        avatarTexture,
        includeOuterChrome: !didDrawFrameTexture,
      });
      if (!didDrawFrameTexture) {
        drawSeatPlaques(Pixi, seatContainer, seatView, {
          plaqueX,
          plaqueWidth,
          plaqueHeight,
          statusWidth,
          statusHeight,
        });
      } else {
        drawSeatStatusBacking(Pixi, seatContainer, seatView, {
          plaqueX,
          statusWidth,
          statusHeight,
        });
      }

      const textOffset = didDrawFrameTexture ? getSeatFrameTextOffset(seatView) : { markerY: -8, statusY: 31 };
      const plaqueTextX = plaqueX + (plaqueWidth / 2);
      const statusTextX = plaqueX + 14 + (statusWidth / 2);

      if (didDrawFrameTexture && (seatView.isHero || seatView.isActing || seatView.isVillainRecent)) {
        drawSeatFrameStateTrim(Pixi, seatContainer, seatView, {
          plaqueX,
          plaqueWidth,
          statusWidth,
          statusHeight,
        });
      }

      const seatText = createText(Pixi, markerText, {
        fill: seatView.isFolded ? 0xd9bd88 : 0xffdf96,
        fontFamily: "Georgia, serif",
        fontSize: seatView.isHero ? 18 : 19,
        fontWeight: "700",
        align: "center",
      });
      seatText.anchor.set(0.5);
      seatText.x = plaqueTextX;
      seatText.y = textOffset.markerY;
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
      statusText.x = statusTextX;
      statusText.y = textOffset.statusY;
      seatContainer.addChild(statusText);

      stage.addChild(seatContainer);
    });
  }

  function drawSeatFrameTexture(Pixi, container, seatView, avatarRadius, sceneAssets) {
    const texture = seatView.isLeft ? sceneAssets?.seatFrameLeftTexture : sceneAssets?.seatFrameRightTexture;
    if (!texture) {
      return false;
    }

    const frameSprite = new Pixi.Sprite(texture);
    const anchor = seatView.isLeft ? SEAT_FRAME_TEXTURE_ANCHORS.left : SEAT_FRAME_TEXTURE_ANCHORS.right;
    const targetRingDiameter = (avatarRadius * 2) + (seatView.isHero ? 34 : 28);
    const textureHeight = Math.max(1, texture.height || frameSprite.texture?.height || 1);
    const scale = targetRingDiameter / textureHeight;

    frameSprite.anchor.set(anchor.x, anchor.y);
    frameSprite.scale.set(scale);
    frameSprite.alpha = seatView.isFolded ? 0.7 : 0.96;
    container.addChild(frameSprite);
    return true;
  }

  function drawSeatFrameStateTrim(Pixi, container, seatView, layout) {
    const {
      plaqueX,
      plaqueWidth,
      statusWidth,
      statusHeight,
    } = layout;
    const trimColor = getPlaqueStrokeColor(seatView);

    container.addChild(createShape(Pixi, (graphics) => {
      strokeRoundedRect(graphics, plaqueX - 2, -31, plaqueWidth + 4, 42, 12, trimColor, 0.56, 2);
      strokeRoundedRect(graphics, plaqueX + 12, 16, statusWidth + 4, statusHeight + 4, 8, trimColor, 0.38, 1.5);
    }));
  }

  function drawSeatStatusBacking(Pixi, container, seatView, layout) {
    const {
      plaqueX,
      statusWidth,
      statusHeight,
    } = layout;

    container.addChild(createShape(Pixi, (graphics) => {
      drawRoundedRect(graphics, plaqueX + 14, 17, statusWidth, statusHeight, 8, 0x080504, seatView.isFolded ? 0.4 : 0.54);
    }));
  }

  function getSeatFrameTextOffset(seatView) {
    return seatView.isLeft
      ? { markerY: -18, statusY: 28 }
      : { markerY: -18, statusY: 30 };
  }

  function getSeatAvatarTexture(sceneAssets, seat) {
    return sceneAssets?.avatarTextures?.[seat] || null;
  }

  function drawPot(Pixi, stage, table, tableState) {
    const label = tableState.potLabel ? `Pot ${tableState.potLabel}` : `Pot ${Number(tableState.potBb || 0).toFixed(1)}bb`;
    drawChipStack(Pixi, stage, table.centerX - 110, table.centerY - 26, getPotChipColor(tableState), 0.98);
    drawChipStack(Pixi, stage, table.centerX + 82, table.centerY - 26, 0x2f4050, 0.9);

    const potBadge = createShape(Pixi, (graphics) => {
      drawRoundedRect(graphics, table.centerX - 78, table.centerY - 38, 156, 42, 17, 0x000000, 0.24);
      drawRoundedRect(graphics, table.centerX - 72, table.centerY - 40, 144, 38, 16, 0x090604, 0.86);
      drawRoundedRect(graphics, table.centerX - 64, table.centerY - 34, 128, 10, 8, 0xffd27a, 0.08);
      strokeRoundedRect(graphics, table.centerX - 72, table.centerY - 40, 144, 38, 16, 0xd69b42, 0.62, 2);
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
    potText.y = table.centerY - 21;
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
      drawPlayingCard(Pixi, stage, card, x, y, cardWidth, cardHeight);
    });
  }

  function drawSeatMedallion(Pixi, container, seatView, avatarRadius, options = {}) {
    const includeOuterChrome = options.includeOuterChrome !== false;
    const avatarTexture = options.avatarTexture || null;
    container.addChild(createShape(Pixi, (graphics) => {
      drawEllipse(graphics, 9, 12, avatarRadius + 12, avatarRadius * 0.38, 0x000000, seatView.isFolded ? 0.2 : 0.38);
    }));

    if (seatView.isActing || seatView.isHero || seatView.isVillainRecent) {
      container.addChild(createShape(Pixi, (graphics) => {
        drawEllipse(graphics, 0, 0, avatarRadius + 17, avatarRadius + 17, getSeatGlowColor(seatView), getSeatGlowAlpha(seatView));
      }));
    }

    container.addChild(createShape(Pixi, (graphics) => {
      if (includeOuterChrome) {
        drawEllipse(graphics, 0, 0, avatarRadius + 10, avatarRadius + 10, 0x150c05, seatView.isFolded ? 0.64 : 0.92);
        strokeEllipse(graphics, 0, 0, avatarRadius + 11, avatarRadius + 11, 0xffdf95, seatView.isFolded ? 0.18 : 0.42, 2);
        drawEllipse(graphics, 0, 0, avatarRadius + 5, avatarRadius + 5, getSeatRingColor(seatView), seatView.isFolded ? 0.48 : 0.9);
        strokeEllipse(graphics, 0, 0, avatarRadius + 5, avatarRadius + 5, 0x6c3512, seatView.isFolded ? 0.34 : 0.58, 3);
      }
      drawEllipse(graphics, 0, 0, avatarRadius - 2, avatarRadius - 2, 0x1a100b, 0.94);
      drawEllipse(graphics, 0, 0, avatarRadius - 8, avatarRadius - 8, getSeatFillColor(seatView), avatarTexture ? 0.44 : seatView.isFolded ? 0.74 : 0.96);
    }));

    if (avatarTexture) {
      drawSeatAvatarTexture(Pixi, container, seatView, avatarRadius, avatarTexture);
    }

    container.addChild(createShape(Pixi, (graphics) => {
      drawEllipse(graphics, -avatarRadius * 0.18, -avatarRadius * 0.22, avatarRadius * 0.34, avatarRadius * 0.2, 0xffffff, seatView.isFolded ? 0.03 : 0.08);
      strokeEllipse(graphics, 0, 0, avatarRadius - 8, avatarRadius - 8, 0xffefb8, seatView.isFolded ? 0.08 : 0.18, 1.5);
      if (seatView.isFolded) {
        drawEllipse(graphics, 0, 0, avatarRadius - 8, avatarRadius - 8, 0x090604, 0.42);
      }
    }));
  }

  function drawSeatAvatarTexture(Pixi, container, seatView, avatarRadius, avatarTexture) {
    const clipRadius = avatarRadius - 9;
    const avatarSprite = new Pixi.Sprite(avatarTexture);
    const textureWidth = Math.max(1, avatarTexture.width || avatarSprite.texture?.width || 1);
    const textureHeight = Math.max(1, avatarTexture.height || avatarSprite.texture?.height || 1);
    const scale = ((clipRadius * 2) * 1.08) / Math.max(textureWidth, textureHeight);
    const avatarMask = createShape(Pixi, (graphics) => {
      drawEllipse(graphics, 0, 0, clipRadius, clipRadius, 0xffffff, 1);
    });

    avatarSprite.anchor.set(0.5);
    avatarSprite.scale.set(scale);
    avatarSprite.y = avatarRadius * 0.03;
    avatarSprite.alpha = seatView.isFolded ? 0.64 : 0.95;
    avatarSprite.mask = avatarMask;

    container.addChild(avatarMask);
    container.addChild(avatarSprite);
  }

  function drawSeatPlaques(Pixi, container, seatView, layout) {
    const {
      plaqueX,
      plaqueWidth,
      plaqueHeight,
      statusWidth,
      statusHeight,
    } = layout;
    const strokeColor = getPlaqueStrokeColor(seatView);
    const plaqueAlpha = seatView.isFolded ? 0.66 : 0.9;
    const statusAlpha = seatView.isFolded ? 0.62 : 0.82;

    container.addChild(createShape(Pixi, (graphics) => {
      drawRoundedRect(graphics, plaqueX + 4, -23, plaqueWidth, plaqueHeight, 12, 0x000000, 0.28);
      drawRoundedRect(graphics, plaqueX, -30, plaqueWidth, plaqueHeight, 11, 0x150b06, plaqueAlpha);
      drawRoundedRect(graphics, plaqueX + 8, -25, plaqueWidth - 16, 10, 8, 0xffd27a, seatView.isFolded ? 0.03 : 0.08);
      strokeRoundedRect(graphics, plaqueX, -30, plaqueWidth, plaqueHeight, 11, strokeColor, seatView.isFolded ? 0.36 : 0.62, 2);
      strokeRoundedRect(graphics, plaqueX + 5, -25, plaqueWidth - 10, plaqueHeight - 10, 8, 0xffdf95, seatView.isFolded ? 0.05 : 0.13, 1);
      drawRoundedRect(graphics, plaqueX + 14, 18, statusWidth, statusHeight, 8, 0x080504, statusAlpha);
      drawRoundedRect(graphics, plaqueX + 20, 21, statusWidth - 12, 6, 6, 0xffd27a, seatView.isFolded ? 0.03 : 0.06);
      strokeRoundedRect(graphics, plaqueX + 14, 18, statusWidth, statusHeight, 8, strokeColor, seatView.isFolded ? 0.24 : 0.46, 1.5);
    }));
  }

  function drawPlayingCard(Pixi, stage, card, x, y, width, height) {
    const suitColor = card.isRed ? 0xb62224 : 0x151b19;

    stage.addChild(createShape(Pixi, (graphics) => {
      drawEllipse(graphics, x + (width / 2) + 3, y + height + 7, width * 0.44, 8, 0x000000, 0.28);
      drawRoundedRect(graphics, x + 5, y + 8, width, height, 8, 0x000000, 0.32);
      drawRoundedRect(graphics, x, y, width, height, 8, 0xf0e3c8, 1);
      drawRoundedRect(graphics, x + 2, y + 2, width - 4, height - 4, 7, 0xfffbef, 0.96);
      drawRoundedRect(graphics, x + 5, y + 6, width - 10, height - 12, 5, 0xf9f2df, 0.62);
      drawRoundedRect(graphics, x + 6, y + height - 14, width - 12, 8, 5, 0xd4c4a6, 0.24);
      strokeRoundedRect(graphics, x, y, width, height, 8, 0x3b2412, 0.58, 2);
      strokeRoundedRect(graphics, x + 4, y + 4, width - 8, height - 8, 5, 0xffffff, 0.34, 1);
    }));

    drawCardCorner(Pixi, stage, card, x + 7, y + 5, suitColor, false);
    drawCardCorner(Pixi, stage, card, x + width - 7, y + height - 5, suitColor, true);
    drawCardPips(Pixi, stage, card, x, y, width, height, suitColor);
  }

  function drawCardCorner(Pixi, stage, card, x, y, suitColor, isRotated) {
    const rankText = createText(Pixi, card.rank, {
      fill: suitColor,
      fontFamily: "Georgia, serif",
      fontSize: 17,
      fontWeight: "800",
      align: "center",
    });
    const suitText = createText(Pixi, card.suitSymbol, {
      fill: suitColor,
      fontFamily: "Georgia, serif",
      fontSize: 13,
      fontWeight: "800",
      align: "center",
    });
    rankText.anchor.set(0.5, 0);
    suitText.anchor.set(0.5, 0);
    rankText.x = x;
    rankText.y = y;
    suitText.x = x;
    suitText.y = y + 16;

    if (isRotated) {
      rankText.rotation = Math.PI;
      suitText.rotation = Math.PI;
    }

    stage.addChild(rankText);
    stage.addChild(suitText);
  }

  function drawCardPips(Pixi, stage, card, x, y, width, height, suitColor) {
    const rankValue = getCardRankValue(card.rank);
    const pipPositions = getCardPipPositions(rankValue);
    pipPositions.forEach((position) => {
      const pip = createText(Pixi, card.suitSymbol, {
        fill: suitColor,
        fontFamily: "Georgia, serif",
        fontSize: position.large ? 24 : 15,
        fontWeight: "800",
        align: "center",
      });
      pip.anchor.set(0.5);
      pip.x = x + (width * position.x);
      pip.y = y + (height * position.y);
      if (position.rotated) {
        pip.rotation = Math.PI;
      }
      stage.addChild(pip);
    });

    if (rankValue > 10) {
      const rankMark = createText(Pixi, card.rank, {
        fill: suitColor,
        fontFamily: "Georgia, serif",
        fontSize: 21,
        fontWeight: "800",
        align: "center",
      });
      rankMark.anchor.set(0.5);
      rankMark.x = x + (width / 2);
      rankMark.y = y + (height / 2);
      stage.addChild(rankMark);
    }

    const label = formatCardLabel(card);
    const smallLabel = createText(Pixi, label, {
      fill: suitColor,
      fontFamily: "Georgia, serif",
      fontSize: 9,
      fontWeight: "800",
    });
    smallLabel.anchor.set(0.5);
    smallLabel.x = x + (width / 2);
    smallLabel.y = y + height - 11;
    stage.addChild(smallLabel);
  }

  function getCardRankValue(rank) {
    const normalizedRank = String(rank || "").toUpperCase();
    if (normalizedRank === "A") {
      return 14;
    }
    if (normalizedRank === "K") {
      return 13;
    }
    if (normalizedRank === "Q") {
      return 12;
    }
    if (normalizedRank === "J") {
      return 11;
    }
    if (normalizedRank === "T") {
      return 10;
    }
    return Number(normalizedRank) || 2;
  }

  function getCardPipPositions(rankValue) {
    if (rankValue > 10) {
      return [{ x: 0.5, y: 0.56, large: true }];
    }

    const pipLayouts = {
      10: [
        { x: 0.34, y: 0.26 },
        { x: 0.66, y: 0.26 },
        { x: 0.34, y: 0.38 },
        { x: 0.66, y: 0.38 },
        { x: 0.34, y: 0.5 },
        { x: 0.66, y: 0.5 },
        { x: 0.34, y: 0.62, rotated: true },
        { x: 0.66, y: 0.62, rotated: true },
        { x: 0.34, y: 0.74, rotated: true },
        { x: 0.66, y: 0.74, rotated: true },
      ],
      9: [
        { x: 0.34, y: 0.27 },
        { x: 0.66, y: 0.27 },
        { x: 0.34, y: 0.42 },
        { x: 0.66, y: 0.42 },
        { x: 0.5, y: 0.5 },
        { x: 0.34, y: 0.58, rotated: true },
        { x: 0.66, y: 0.58, rotated: true },
        { x: 0.34, y: 0.73, rotated: true },
        { x: 0.66, y: 0.73, rotated: true },
      ],
      8: [
        { x: 0.34, y: 0.27 },
        { x: 0.66, y: 0.27 },
        { x: 0.34, y: 0.42 },
        { x: 0.66, y: 0.42 },
        { x: 0.34, y: 0.58, rotated: true },
        { x: 0.66, y: 0.58, rotated: true },
        { x: 0.34, y: 0.73, rotated: true },
        { x: 0.66, y: 0.73, rotated: true },
      ],
      7: [
        { x: 0.34, y: 0.28 },
        { x: 0.66, y: 0.28 },
        { x: 0.5, y: 0.41 },
        { x: 0.34, y: 0.55, rotated: true },
        { x: 0.66, y: 0.55, rotated: true },
        { x: 0.34, y: 0.7, rotated: true },
        { x: 0.66, y: 0.7, rotated: true },
      ],
      6: [
        { x: 0.34, y: 0.29 },
        { x: 0.66, y: 0.29 },
        { x: 0.34, y: 0.5 },
        { x: 0.66, y: 0.5 },
        { x: 0.34, y: 0.71, rotated: true },
        { x: 0.66, y: 0.71, rotated: true },
      ],
      5: [
        { x: 0.34, y: 0.31 },
        { x: 0.66, y: 0.31 },
        { x: 0.5, y: 0.5 },
        { x: 0.34, y: 0.69, rotated: true },
        { x: 0.66, y: 0.69, rotated: true },
      ],
      4: [
        { x: 0.34, y: 0.31 },
        { x: 0.66, y: 0.31 },
        { x: 0.34, y: 0.69, rotated: true },
        { x: 0.66, y: 0.69, rotated: true },
      ],
      3: [
        { x: 0.5, y: 0.3 },
        { x: 0.5, y: 0.5 },
        { x: 0.5, y: 0.7, rotated: true },
      ],
      2: [
        { x: 0.5, y: 0.31 },
        { x: 0.5, y: 0.69, rotated: true },
      ],
    };

    return pipLayouts[rankValue] || pipLayouts[2];
  }

  function drawChipStack(Pixi, stage, x, y, color, alpha) {
    drawChip(Pixi, stage, x, y + 14, color, alpha * 0.9);
    drawChip(Pixi, stage, x + 13, y + 6, color, alpha);
    drawChip(Pixi, stage, x + 28, y + 14, color, alpha * 0.86);
  }

  function drawChip(Pixi, stage, x, y, color, alpha) {
    stage.addChild(createShape(Pixi, (graphics) => {
      drawEllipse(graphics, x + 2, y + 7, 16, 8, 0x000000, 0.28);
      drawEllipse(graphics, x, y, 15, 15, color, alpha);
      strokeEllipse(graphics, x, y, 16, 16, 0xffd27a, 0.62, 2);
      strokeEllipse(graphics, x, y, 9, 9, 0xffffff, 0.18, 1.5);
      drawRect(graphics, x - 2, y - 14, 4, 8, 0xf7e3b0, 0.38);
      drawRect(graphics, x - 2, y + 6, 4, 8, 0xf7e3b0, 0.38);
      drawRect(graphics, x - 14, y - 2, 8, 4, 0xf7e3b0, 0.38);
      drawRect(graphics, x + 6, y - 2, 8, 4, 0xf7e3b0, 0.38);
    }));
  }

  function getPotChipColor(tableState) {
    const potValue = Number(tableState.potBb || 0);
    if (potValue >= 20) {
      return 0x7c4ad4;
    }

    if (potValue >= 8) {
      return 0xb53b2e;
    }

    return 0x2f8f70;
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
    const actionLabel = isFolded && !isHero
      ? "Folds"
      : isVillainRecent
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
        : isFolded
          ? "Folds"
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

    return `${normalizedLabel.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
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
