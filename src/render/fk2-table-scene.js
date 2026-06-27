(function (global) {
  "use strict";

  const DEFAULT_ASSETS = {
    images: {
      background: "assets/runtime/marine/marine-background.png",
      seatFrame: "assets/runtime/marine/seat-frame-v3_1.png",
      avatars: {
        shark: "assets/runtime/marine/avatar-shark-v3_1.png",
        octopus: "assets/runtime/marine/avatar-octopus-v3_1.png",
        turtle: "assets/runtime/marine/avatar-turtle-v3_1.png",
        dolphin: "assets/runtime/marine/avatar-dolphin-v3_1.png",
        marlin: "assets/runtime/marine/avatar-swordfish-v3_1.png",
        swordfish: "assets/runtime/marine/avatar-swordfish-v3_1.png",
        anglerfish: "assets/runtime/marine/avatar-anglerfish-v3_1.png",
      },
      chips: {
        potPile: "assets/runtime/marine/chip-pot-pile-v4_4.png",
        shadow: "assets/runtime/marine/chip-shadow-v3_1.png",
      },
    },
    production: {
      background: "assets/runtime/marine/marine-background.png",
      character: {
        shark: "assets/runtime/marine/avatar-shark-v3_1.png",
        octopus: "assets/runtime/marine/avatar-octopus-v3_1.png",
        turtle: "assets/runtime/marine/avatar-turtle-v3_1.png",
        dolphin: "assets/runtime/marine/avatar-dolphin-v3_1.png",
        marlin: "assets/runtime/marine/avatar-swordfish-v3_1.png",
        swordfish: "assets/runtime/marine/avatar-swordfish-v3_1.png",
        anglerfish: "assets/runtime/marine/avatar-anglerfish-v3_1.png",
      },
      frame: {
        main: "assets/runtime/marine/seat-frame-v3_1.png",
      },
      chip: {
        potPile: "assets/runtime/marine/chip-pot-pile-v4_4.png",
        shadow: "assets/runtime/marine/chip-shadow-v3_1.png",
      },
    },
  };

  const instances = new WeakMap();
  const AVATAR_COLORS = {
    shark: { fill: "#15344a", glow: "#65c7f7" },
    octopus: { fill: "#3a2152", glow: "#d38cff" },
    turtle: { fill: "#244b34", glow: "#99d88d" },
    dolphin: { fill: "#183f5c", glow: "#79d8ff" },
    marlin: { fill: "#123c61", glow: "#5eb7ff" },
    anglerfish: { fill: "#3b2e18", glow: "#f2c15f" },
  };

  function render(host, model = {}) {
    if (!host) {
      return null;
    }

    let instance = instances.get(host);
    if (!instance) {
      instance = createSceneInstance(host);
      instances.set(host, instance);
    }

    instance.update(model);
    return instance;
  }

  function createSceneInstance(host) {
    const pixi = global.PIXI;

    if (pixi?.Application && pixi?.Sprite && pixi?.Texture) {
      try {
        return createPixiScene(host, pixi);
      } catch (error) {
        host.dataset.rendererFallback = "canvas";
      }
    }

    return createCanvasScene(host);
  }

  function createPixiScene(host, PIXI) {
    const options = {
      width: Math.max(1, host.clientWidth),
      height: Math.max(1, host.clientHeight),
      backgroundAlpha: 0,
      antialias: true,
      autoDensity: true,
      resolution: global.devicePixelRatio || 1,
    };
    const isAsyncPixi = typeof PIXI.Application.prototype?.init === "function";
    const app = isAsyncPixi ? new PIXI.Application() : new PIXI.Application(options);
    const root = new PIXI.Container();
    const sprites = new Map();

    host.textContent = "";
    host.dataset.renderer = "pixi";

    const scene = {
      model: {},
      ready: false,
      update(model) {
        scene.model = model;
        if (!scene.ready) {
          return;
        }
        resizePixi(app, host);
        drawPixiScene(PIXI, root, sprites, app.renderer.width / app.renderer.resolution, app.renderer.height / app.renderer.resolution, model);
        app.render();
      },
      destroy() {
        app.destroy(true, { children: true, texture: false, baseTexture: false });
      },
    };

    const finishInit = () => {
      host.appendChild(app.view || app.canvas);
      app.stage.addChild(root);
      scene.ready = true;
      scene.update(scene.model);
    };

    if (isAsyncPixi) {
      app.init(options).then(finishInit).catch(() => {
        host.dataset.rendererFallback = "canvas";
        const fallback = createCanvasScene(host);
        instances.set(host, fallback);
        fallback.update(scene.model);
      });
    } else {
      finishInit();
    }

    attachResize(host, () => scene.update(scene.model));
    return scene;
  }

  function resizePixi(app, host) {
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    app.renderer.resize(width, height);
  }

  function drawPixiScene(PIXI, root, sprites, width, height, model) {
    root.removeChildren();

    const assets = getAssets();
    const background = getPixiSprite(PIXI, sprites, "background", assets.images.background);
    coverPixiSprite(background, width, height, 0.5, 0.56);
    root.addChild(background);
    drawPixiPotPile(PIXI, root, sprites, width, height);

    const seats = getRenderSeats(model);
    seats.sort((a, b) => a.y - b.y).forEach((seat) => drawPixiSeat(PIXI, root, sprites, seat, width, height, model));

    drawPixiDealerButton(PIXI, root, sprites, width, height, model, seats);
  }

  function getPixiSprite(PIXI, sprites, key, path) {
    const spriteKey = `${key}:${path}`;
    if (!sprites.has(spriteKey)) {
      sprites.set(spriteKey, new PIXI.Sprite(PIXI.Texture.from(path)));
    }
    return sprites.get(spriteKey);
  }

  function coverPixiSprite(sprite, width, height, focusX, focusY) {
    const sourceWidth = sprite.texture.width || width;
    const sourceHeight = sprite.texture.height || height;
    const scale = Math.max(width / sourceWidth, height / sourceHeight);
    sprite.width = sourceWidth * scale;
    sprite.height = sourceHeight * scale;
    sprite.x = (width - sprite.width) * focusX;
    sprite.y = (height - sprite.height) * focusY;
  }

  function containPixiSprite(sprite, maxWidth, maxHeight) {
    const sourceWidth = sprite.texture.width || maxWidth;
    const sourceHeight = sprite.texture.height || maxHeight;
    const scale = Math.min(maxWidth / sourceWidth, maxHeight / sourceHeight);
    sprite.width = sourceWidth * scale;
    sprite.height = sourceHeight * scale;
  }

  function drawPixiDealerButton(PIXI, root, sprites, width, height, model, seats) {
    const dealerSeat = model.dealerSeat || getCoordinateApi().getDealerSeat(model.tableSize, model.seats, model.heroSeat);
    const dealer = seats.find((seat) => seat.seat === dealerSeat);
    if (!dealer) {
      return;
    }

    const size = clamp(Math.min(width, height) * 0.07, 34, 58);
    const point = getDealerButtonPoint(dealer, width, height, size);
    const button = new PIXI.Graphics();
    drawPixiCircle(button, point.x, point.y, size * 0.5, 0x06121d, 0.94);
    drawPixiRing(button, point.x, point.y, size * 0.5, 0xf0bb59, 2.2, 0.95);
    drawPixiRing(button, point.x, point.y, size * 0.38, 0x6f4716, 1.2, 0.82);
    root.addChild(button);
  }

  function drawPixiSeat(PIXI, root, sprites, seat, width, height, model) {
    const production = getProductionAssets();
    const framePath = production.frame?.main || getAssets().images?.seatFrame;
    const avatarPath = getCharacterAssetPath(seat.avatar);

    if (framePath || avatarPath) {
      drawPixiAssetSeat(PIXI, root, sprites, seat, width, height, model, framePath, avatarPath);
      return;
    }

    drawPixiPrimitiveSeat(PIXI, root, seat, width, height, model);
  }

  function drawPixiAssetSeat(PIXI, root, sprites, seat, width, height, model, framePath, avatarPath) {
    const group = new PIXI.Container();
    const x = seat.x * width;
    const y = seat.y * height;
    const frameWidth = getFrameWidth(width, height);
    const avatarSize = frameWidth * 0.74;
    const active = seat.seat === model.activeSeat || seat.seat === model.heroSeat;
    const foldedAlpha = seat.status === "folded" ? 0.55 : 1;
    const glow = new PIXI.Graphics();

    drawPixiEllipse(glow, x, y + frameWidth * 0.18, frameWidth * 0.48, frameWidth * 0.34, active ? 0xf0bb59 : 0x000000, active ? 0.18 : 0.26);
    group.addChild(glow);

    if (avatarPath) {
      const avatar = getPixiSprite(PIXI, sprites, `avatar-${seat.seat}-${seat.avatar}`, avatarPath);
      const mask = new PIXI.Graphics();

      drawPixiCircle(mask, x, y, frameWidth * 0.33, 0xffffff, 1);
      mask.renderable = false;
      avatar.anchor.set(0.5);
      avatar.alpha = foldedAlpha;
      containPixiSprite(avatar, avatarSize, avatarSize);
      avatar.x = x;
      avatar.y = y;
      avatar.mask = mask;
      group.addChild(mask);
      group.addChild(avatar);
    } else {
      const avatarFallback = new PIXI.Graphics();
      drawPixiAvatarFallback(avatarFallback, x, y, avatarSize, seat.avatar, seat.status === "folded");
      group.addChild(avatarFallback);
    }

    if (framePath) {
      const frame = getPixiSprite(PIXI, sprites, `frame-${seat.seat}`, framePath);
      frame.anchor.set(0.5, 0.335);
      frame.width = frameWidth;
      frame.height = frameWidth;
      frame.x = x;
      frame.y = y;
      frame.alpha = foldedAlpha;
      group.addChild(frame);
    } else {
      const frameFallback = new PIXI.Graphics();
      drawPixiFrameFallback(frameFallback, x, y, frameWidth, seat.status === "folded");
      group.addChild(frameFallback);
    }

    root.addChild(group);
  }

  function drawPixiPrimitiveSeat(PIXI, root, seat, width, height, model) {
    const group = new PIXI.Container();
    const x = seat.x * width;
    const y = seat.y * height;
    const frameWidth = getFrameWidth(width, height);
    const avatarSize = frameWidth * 0.74;
    const active = seat.seat === model.activeSeat || seat.seat === model.heroSeat;
    const palette = AVATAR_COLORS[seat.avatar] || AVATAR_COLORS.shark;
    const graphics = new PIXI.Graphics();

    drawPixiEllipse(graphics, x, y + frameWidth * 0.17, frameWidth * 0.44, frameWidth * 0.26, active ? 0xf0bb59 : 0x000000, active ? 0.17 : 0.28);
    drawPixiCircle(graphics, x, y, avatarSize * 0.5, parseColor(palette.fill), seat.status === "folded" ? 0.52 : 0.98);
    drawPixiCircle(graphics, x - avatarSize * 0.13, y - avatarSize * 0.16, avatarSize * 0.22, parseColor(palette.glow), seat.status === "folded" ? 0.12 : 0.26);
    drawPixiRing(graphics, x, y, frameWidth * 0.42, 0x0a0f13, frameWidth * 0.1, 0.98);
    drawPixiRing(graphics, x, y, frameWidth * 0.46, 0xf2c46b, frameWidth * 0.035, seat.status === "folded" ? 0.42 : 0.95);
    drawPixiRing(graphics, x, y, frameWidth * 0.35, 0xbf7b2d, frameWidth * 0.02, seat.status === "folded" ? 0.32 : 0.78);
    group.addChild(graphics);
    root.addChild(group);
  }

  function drawPixiPotPile(PIXI, root, sprites, width, height) {
    const chipAssets = getProductionAssets().chip || {};
    if (chipAssets.potPile) {
      drawPixiAssetPotPile(PIXI, root, sprites, width, height, chipAssets);
      return;
    }

    drawPixiPrimitivePotPile(PIXI, root, width, height);
  }

  function drawPixiAssetPotPile(PIXI, root, sprites, width, height, chipAssets) {
    const x = width * 0.5;
    const y = height * 0.545;
    const potWidth = clamp(width * 0.12, 100, 210);
    const potHeight = potWidth * 0.62;

    if (chipAssets.shadow) {
      const shadow = getPixiSprite(PIXI, sprites, "chip-shadow-v3_1", chipAssets.shadow);
      shadow.anchor.set(0.5);
      shadow.alpha = 0.56;
      containPixiSprite(shadow, potWidth * 1.35, potHeight * 0.6);
      shadow.x = x;
      shadow.y = y + potHeight * 0.28;
      root.addChild(shadow);
    }

    const pile = getPixiSprite(PIXI, sprites, "chip-pot-pile-v4_4", chipAssets.potPile);
    pile.anchor.set(0.5);
    containPixiSprite(pile, potWidth, potHeight);
    pile.x = x;
    pile.y = y;
    root.addChild(pile);
  }

  function drawPixiPrimitivePotPile(PIXI, root, width, height) {
    const graphics = new PIXI.Graphics();
    const x = width * 0.5;
    const y = height * 0.545;
    const size = clamp(width * 0.03, 21, 38);

    drawPixiEllipse(graphics, x, y + size * 0.72, size * 2.3, size * 0.58, 0x000000, 0.28);
    [
      { x: -1.25, y: 0.05, color: 0x174f86 },
      { x: -0.45, y: -0.18, color: 0xa92f27 },
      { x: 0.38, y: -0.05, color: 0x123a6b },
      { x: 1.12, y: 0.12, color: 0xd09a36 },
      { x: -0.02, y: 0.45, color: 0x0d253f },
    ].forEach((chip) => {
      const cx = x + chip.x * size;
      const cy = y + chip.y * size;
      drawPixiEllipse(graphics, cx, cy, size * 0.46, size * 0.22, chip.color, 0.98);
      drawPixiRing(graphics, cx, cy, size * 0.46, 0xf0bb59, 1.4, 0.82);
      drawPixiEllipse(graphics, cx, cy - size * 0.04, size * 0.24, size * 0.1, 0x080d12, 0.9);
    });
    root.addChild(graphics);
  }

  function createCanvasScene(host) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const images = new Map();

    host.textContent = "";
    host.dataset.renderer = "canvas";
    host.appendChild(canvas);

    const scene = {
      model: {},
      update(model) {
        scene.model = model;
        drawCanvasScene(canvas, context, images, model);
      },
    };

    attachResize(host, () => scene.update(scene.model));
    return scene;
  }

  function drawCanvasScene(canvas, context, images, model) {
    const host = canvas.parentElement;
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    const ratio = global.devicePixelRatio || 1;

    if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);

    const assets = getAssets();
    const background = loadImage(images, assets.images.background, () => drawCanvasScene(canvas, context, images, model));

    if (background.loaded) {
      drawCoverImage(context, background.image, 0, 0, width, height, 0.5, 0.56);
    } else {
      drawFallbackBackground(context, width, height);
    }

    drawCanvasVignette(context, width, height);
    drawCanvasPotPile(context, images, assets, width, height, model);

    const seats = getRenderSeats(model).sort((a, b) => a.y - b.y);
    seats.forEach((seat) => drawCanvasSeat(context, images, assets, seat, width, height, model));
    drawCanvasDealerButton(context, model, seats, width, height);
  }

  function drawCanvasSeat(context, images, assets, seat, width, height, model) {
    const production = getProductionAssets();
    const framePath = production.frame?.main || assets.images?.seatFrame;
    const avatarPath = getCharacterAssetPath(seat.avatar);
    const frame = loadOptionalImage(images, framePath, () => rerenderFromContext(context, model));
    const avatar = loadOptionalImage(images, avatarPath, () => rerenderFromContext(context, model));
    const x = seat.x * width;
    const y = seat.y * height;
    const frameWidth = getFrameWidth(width, height);
    const avatarSize = frameWidth * 0.74;
    const active = seat.seat === model.activeSeat || seat.seat === model.heroSeat;

    context.save();
    context.globalAlpha = seat.status === "folded" ? 0.58 : 1;
    drawSeatGlow(context, x, y, frameWidth, active);
    if (avatar?.loaded) {
      context.save();
      context.beginPath();
      context.arc(x, y, frameWidth * 0.33, 0, Math.PI * 2);
      context.clip();
      drawContainImage(context, avatar.image, x, y, avatarSize, avatarSize);
      context.restore();
    } else {
      drawAvatarFallback(context, x, y, avatarSize, seat.avatar);
    }

    if (frame?.loaded) {
      context.drawImage(frame.image, x - frameWidth / 2, y - frameWidth * 0.335, frameWidth, frameWidth);
    } else {
      drawFrameFallback(context, x, y, frameWidth);
    }
    context.restore();
  }

  function drawCanvasDealerButton(context, model, seats, width, height) {
    const dealerSeat = model.dealerSeat || getCoordinateApi().getDealerSeat(model.tableSize, model.seats, model.heroSeat);
    const dealer = seats.find((seat) => seat.seat === dealerSeat);
    if (!dealer) {
      return;
    }

    const size = clamp(Math.min(width, height) * 0.072, 34, 60);
    const point = getDealerButtonPoint(dealer, width, height, size);

    context.save();
    context.shadowColor = "rgba(0, 0, 0, 0.44)";
    context.shadowBlur = 14;
    context.shadowOffsetY = 8;
    context.beginPath();
    context.arc(point.x, point.y, size / 2, 0, Math.PI * 2);
    context.fillStyle = "rgba(6, 18, 29, 0.94)";
    context.fill();
    context.lineWidth = 2.2;
    context.strokeStyle = "rgba(240, 187, 89, 0.95)";
    context.stroke();
    context.shadowColor = "transparent";
    context.beginPath();
    context.arc(point.x, point.y, size * 0.36, 0, Math.PI * 2);
    context.lineWidth = 1.2;
    context.strokeStyle = "rgba(142, 91, 28, 0.82)";
    context.stroke();
    context.restore();
  }

  function drawCanvasPotPile(context, images, assets, width, height, model) {
    const chipAssets = getProductionAssets().chip || assets.images?.chips || {};
    const pile = loadOptionalImage(images, chipAssets.potPile, () => rerenderFromContext(context, model));
    const shadow = loadOptionalImage(images, chipAssets.shadow, () => rerenderFromContext(context, model));
    if (pile?.loaded) {
      const x = width * 0.5;
      const y = height * 0.545;
      const potWidth = clamp(width * 0.12, 100, 210);
      const potHeight = potWidth * 0.62;

      context.save();
      if (shadow?.loaded) {
        context.globalAlpha = 0.56;
        drawContainImage(context, shadow.image, x, y + potHeight * 0.28, potWidth * 1.35, potHeight * 0.6);
        context.globalAlpha = 1;
      }
      drawContainImage(context, pile.image, x, y, potWidth, potHeight);
      context.restore();
      return;
    }

    drawCanvasPrimitivePotPile(context, width, height);
  }

  function drawCanvasPrimitivePotPile(context, width, height) {
    const size = clamp(width * 0.03, 21, 38);
    const x = width * 0.5;
    const y = height * 0.545;

    context.save();
    context.globalAlpha = 0.96;
    context.beginPath();
    context.ellipse(x, y + size * 0.72, size * 2.3, size * 0.58, 0, 0, Math.PI * 2);
    context.fillStyle = "rgba(0, 0, 0, 0.28)";
    context.fill();

    [
      { x: -1.25, y: 0.05, color: "#174f86" },
      { x: -0.45, y: -0.18, color: "#a92f27" },
      { x: 0.38, y: -0.05, color: "#123a6b" },
      { x: 1.12, y: 0.12, color: "#d09a36" },
      { x: -0.02, y: 0.45, color: "#0d253f" },
    ].forEach((chip) => drawCanvasChip(context, x + chip.x * size, y + chip.y * size, size, chip.color));
    context.restore();
  }

  function drawCanvasChip(context, x, y, size, color) {
    context.beginPath();
    context.ellipse(x, y, size * 0.46, size * 0.22, 0, 0, Math.PI * 2);
    context.fillStyle = color;
    context.fill();
    context.lineWidth = 1.4;
    context.strokeStyle = "rgba(240, 187, 89, 0.82)";
    context.stroke();
    context.beginPath();
    context.ellipse(x, y - size * 0.04, size * 0.24, size * 0.1, 0, 0, Math.PI * 2);
    context.fillStyle = "rgba(8, 13, 18, 0.9)";
    context.fill();
  }

  function rerenderFromContext(context, model) {
    const canvas = context.canvas;
    if (canvas?.parentElement) {
      const instance = instances.get(canvas.parentElement);
      instance?.update(model);
    }
  }

  function getRenderSeats(model) {
    const api = getCoordinateApi();
    return api.getSeatCoordinates(model.tableSize || "six", model.seats || []);
  }

  function getCoordinateApi() {
    return global.FK2_SCENE_COORDINATES || {
      getSeatCoordinates(tableSize, seats) {
        return (seats || []).map((seatConfig, index) => ({
          ...seatConfig,
          x: Number.parseFloat(seatConfig.x) / 100 || 0.5,
          y: Number.parseFloat(seatConfig.y) / 100 || 0.5,
          avatar: ["shark", "octopus", "turtle", "dolphin", "marlin", "anglerfish"][index % 6],
        }));
      },
      getDealerSeat(tableSize, seats, heroSeat) {
        return seats.find((seatConfig) => seatConfig.seat === "BTN")?.seat || heroSeat || seats[0]?.seat || "";
      },
    };
  }

  function getDealerButtonPoint(seat, width, height, size) {
    const rail = getCoordinateApi().TABLE_RAIL || { centerX: 0.5, centerY: 0.585 };
    const x = seat.x * width;
    const y = seat.y * height;
    const dx = x - rail.centerX * width;
    const dy = y - rail.centerY * height;
    const length = Math.max(1, Math.hypot(dx, dy));
    const inwardX = x - (dx / length) * size * 0.86;
    const inwardY = y - (dy / length) * size * 0.74;

    return { x: inwardX, y: inwardY };
  }

  function getFrameWidth(width, height) {
    return clamp(Math.min(width * 0.124, height * 0.25), 84, 158);
  }

  function getAssets() {
    return global.FK2_MARINE_ASSETS || DEFAULT_ASSETS;
  }

  function getProductionAssets() {
    const assets = getAssets();
    return assets.production || {
      background: assets.images?.background,
      character: assets.images?.avatars || {},
      frame: {
        main: assets.images?.seatFrame,
      },
      chip: assets.images?.chips || {},
      dealer: {
        button: assets.images?.dealerButton || null,
      },
    };
  }

  function getCharacterAssetPath(avatarKey = "shark") {
    const characters = getProductionAssets().character || {};
    return characters[avatarKey] || characters.shark || "";
  }

  function loadImage(images, path, onLoad) {
    if (!images.has(path)) {
      const image = new Image();
      const entry = { image, loaded: false };
      image.onload = () => {
        entry.loaded = true;
        onLoad?.();
      };
      image.src = path;
      images.set(path, entry);
    }

    return images.get(path);
  }

  function loadOptionalImage(images, path, onLoad) {
    return path ? loadImage(images, path, onLoad) : null;
  }

  function drawCoverImage(context, image, x, y, width, height, focusX = 0.5, focusY = 0.5) {
    const scale = Math.max(width / image.width, height / image.height);
    const sourceWidth = width / scale;
    const sourceHeight = height / scale;
    const sourceX = clamp((image.width - sourceWidth) * focusX, 0, Math.max(0, image.width - sourceWidth));
    const sourceY = clamp((image.height - sourceHeight) * focusY, 0, Math.max(0, image.height - sourceHeight));

    context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
  }

  function drawContainImage(context, image, centerX, centerY, maxWidth, maxHeight) {
    const scale = Math.min(maxWidth / image.width, maxHeight / image.height);
    const width = image.width * scale;
    const height = image.height * scale;
    context.drawImage(image, centerX - width / 2, centerY - height / 2, width, height);
  }

  function drawFallbackBackground(context, width, height) {
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#02070d");
    gradient.addColorStop(0.48, "#092130");
    gradient.addColorStop(1, "#010407");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  }

  function drawCanvasVignette(context, width, height) {
    const gradient = context.createRadialGradient(width / 2, height * 0.55, height * 0.16, width / 2, height * 0.55, width * 0.58);
    gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    gradient.addColorStop(0.72, "rgba(0, 0, 0, 0.08)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.54)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  }

  function drawSeatGlow(context, x, y, frameWidth, active) {
    context.save();
    context.shadowColor = active ? "rgba(240, 187, 89, 0.5)" : "rgba(0, 0, 0, 0.62)";
    context.shadowBlur = active ? 30 : 18;
    context.shadowOffsetY = active ? 0 : 10;
    context.beginPath();
    context.ellipse(x, y + frameWidth * 0.18, frameWidth * 0.46, frameWidth * 0.36, 0, 0, Math.PI * 2);
    context.fillStyle = active ? "rgba(240, 187, 89, 0.13)" : "rgba(0, 0, 0, 0.28)";
    context.fill();
    context.restore();
  }

  function drawAvatarFallback(context, x, y, size, avatarKey = "shark") {
    context.save();
    const palette = AVATAR_COLORS[avatarKey] || AVATAR_COLORS.shark;
    const gradient = context.createRadialGradient(x - size * 0.15, y - size * 0.18, size * 0.1, x, y, size * 0.52);
    gradient.addColorStop(0, palette.glow);
    gradient.addColorStop(1, palette.fill);
    context.beginPath();
    context.arc(x, y, size * 0.48, 0, Math.PI * 2);
    context.fillStyle = gradient;
    context.fill();
    context.beginPath();
    context.arc(x + size * 0.12, y - size * 0.1, size * 0.09, 0, Math.PI * 2);
    context.fillStyle = "rgba(255, 246, 207, 0.22)";
    context.fill();
    context.restore();
  }

  function drawFrameFallback(context, x, y, width) {
    context.save();
    context.strokeStyle = "rgba(9, 15, 19, 0.96)";
    context.lineWidth = Math.max(6, width * 0.1);
    context.beginPath();
    context.arc(x, y, width * 0.38, 0, Math.PI * 2);
    context.stroke();
    context.strokeStyle = "rgba(242, 196, 107, 0.95)";
    context.lineWidth = Math.max(2, width * 0.035);
    context.beginPath();
    context.arc(x, y, width * 0.46, 0, Math.PI * 2);
    context.stroke();
    context.strokeStyle = "rgba(191, 123, 45, 0.78)";
    context.lineWidth = Math.max(1.2, width * 0.02);
    context.beginPath();
    context.arc(x, y, width * 0.35, 0, Math.PI * 2);
    context.stroke();
    context.restore();
  }

  function drawPixiAvatarFallback(graphics, x, y, size, avatarKey = "shark", folded = false) {
    const palette = AVATAR_COLORS[avatarKey] || AVATAR_COLORS.shark;
    drawPixiCircle(graphics, x, y, size * 0.48, parseColor(palette.fill), folded ? 0.52 : 0.98);
    drawPixiCircle(graphics, x - size * 0.13, y - size * 0.16, size * 0.22, parseColor(palette.glow), folded ? 0.12 : 0.26);
  }

  function drawPixiFrameFallback(graphics, x, y, width, folded = false) {
    drawPixiRing(graphics, x, y, width * 0.42, 0x0a0f13, width * 0.1, folded ? 0.48 : 0.98);
    drawPixiRing(graphics, x, y, width * 0.46, 0xf2c46b, width * 0.035, folded ? 0.42 : 0.95);
    drawPixiRing(graphics, x, y, width * 0.35, 0xbf7b2d, width * 0.02, folded ? 0.32 : 0.78);
  }

  function drawPixiCircle(graphics, x, y, radius, color, alpha) {
    if (typeof graphics.circle === "function" && typeof graphics.fill === "function") {
      graphics.circle(x, y, radius);
      graphics.fill({ color, alpha });
      return;
    }

    graphics.beginFill(color, alpha);
    graphics.drawCircle(x, y, radius);
    graphics.endFill();
  }

  function drawPixiEllipse(graphics, x, y, radiusX, radiusY, color, alpha) {
    if (typeof graphics.ellipse === "function" && typeof graphics.fill === "function") {
      graphics.ellipse(x, y, radiusX, radiusY);
      graphics.fill({ color, alpha });
      return;
    }

    graphics.beginFill(color, alpha);
    graphics.drawEllipse(x, y, radiusX, radiusY);
    graphics.endFill();
  }

  function drawPixiRing(graphics, x, y, radius, color, width, alpha) {
    if (typeof graphics.circle === "function" && typeof graphics.stroke === "function") {
      graphics.circle(x, y, radius);
      graphics.stroke({ color, width, alpha });
      return;
    }

    graphics.lineStyle(width, color, alpha);
    graphics.drawCircle(x, y, radius);
  }

  function parseColor(color) {
    return Number.parseInt(String(color).replace("#", ""), 16);
  }

  function attachResize(host, onResize) {
    if ("ResizeObserver" in global) {
      const observer = new ResizeObserver(() => onResize());
      observer.observe(host);
      return observer;
    }

    global.addEventListener?.("resize", onResize);
    return null;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  global.FK2_TABLE_SCENE = {
    render,
  };
})(typeof window !== "undefined" ? window : globalThis);
