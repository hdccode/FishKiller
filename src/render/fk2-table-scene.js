(function (global) {
  "use strict";

  const DEFAULT_ASSETS = {
    images: {
      background: "assets/runtime/marine/marine-background.png",
      seatFrame: "assets/runtime/marine/seat-frame.png",
      dealerButton: "assets/runtime/marine/dealer-button.png",
      avatars: {
        shark: "assets/runtime/marine/avatar-shark.png",
        octopus: "assets/runtime/marine/avatar-octopus.png",
        turtle: "assets/runtime/marine/avatar-turtle.png",
        dolphin: "assets/runtime/marine/avatar-dolphin.png",
        marlin: "assets/runtime/marine/avatar-marlin.png",
        anglerfish: "assets/runtime/marine/avatar-anglerfish.png",
      },
    },
  };

  const instances = new WeakMap();

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

    const seats = getRenderSeats(model);
    seats.sort((a, b) => a.y - b.y).forEach((seat) => {
      const group = new PIXI.Container();
      const x = seat.x * width;
      const y = seat.y * height;
      const frameWidth = getFrameWidth(width, height);
      const frameHeight = frameWidth * 1.18;
      const avatarSize = frameWidth * 0.76;
      const frame = getPixiSprite(PIXI, sprites, `frame-${seat.seat}`, assets.images.seatFrame);
      const avatar = getPixiSprite(PIXI, sprites, `avatar-${seat.seat}`, assets.images.avatars[seat.avatar] || assets.images.avatars.shark);

      avatar.anchor.set(0.5);
      avatar.width = avatarSize;
      avatar.height = avatarSize;
      avatar.x = x;
      avatar.y = y;

      frame.anchor.set(0.5, 0.33);
      frame.width = frameWidth;
      frame.height = frameHeight;
      frame.x = x;
      frame.y = y;

      group.addChild(avatar);
      group.addChild(frame);
      root.addChild(group);
    });

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

  function drawPixiDealerButton(PIXI, root, sprites, width, height, model, seats) {
    const assets = getAssets();
    const dealerSeat = model.dealerSeat || getCoordinateApi().getDealerSeat(model.tableSize, model.seats, model.heroSeat);
    const dealer = seats.find((seat) => seat.seat === dealerSeat);
    if (!dealer) {
      return;
    }

    const button = getPixiSprite(PIXI, sprites, "dealer-button", assets.images.dealerButton);
    const size = clamp(Math.min(width, height) * 0.07, 34, 58);
    const point = getDealerButtonPoint(dealer, width, height, size);
    button.anchor.set(0.5);
    button.width = size;
    button.height = size;
    button.x = point.x;
    button.y = point.y;
    root.addChild(button);
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

    const seats = getRenderSeats(model).sort((a, b) => a.y - b.y);
    seats.forEach((seat) => drawCanvasSeat(context, images, assets, seat, width, height, model));
    drawCanvasDealerButton(context, images, assets, model, seats, width, height);
  }

  function drawCanvasSeat(context, images, assets, seat, width, height, model) {
    const frame = loadImage(images, assets.images.seatFrame, () => rerenderFromContext(context, model));
    const avatarPath = assets.images.avatars[seat.avatar] || assets.images.avatars.shark;
    const avatar = loadImage(images, avatarPath, () => rerenderFromContext(context, model));
    const x = seat.x * width;
    const y = seat.y * height;
    const frameWidth = getFrameWidth(width, height);
    const frameHeight = frameWidth * 1.18;
    const avatarSize = frameWidth * 0.74;
    const active = seat.seat === model.activeSeat || seat.seat === model.heroSeat;

    context.save();
    context.globalAlpha = seat.status === "folded" ? 0.58 : 1;
    drawSeatGlow(context, x, y, frameWidth, active);

    if (avatar.loaded) {
      context.save();
      context.beginPath();
      context.arc(x, y, avatarSize * 0.48, 0, Math.PI * 2);
      context.clip();
      drawCoverImage(context, avatar.image, x - avatarSize / 2, y - avatarSize / 2, avatarSize, avatarSize, 0.5, 0.46);
      context.restore();
    } else {
      drawAvatarFallback(context, x, y, avatarSize);
    }

    if (frame.loaded) {
      context.drawImage(frame.image, x - frameWidth / 2, y - frameHeight * 0.33, frameWidth, frameHeight);
    } else {
      drawFrameFallback(context, x, y, frameWidth, frameHeight);
    }

    context.restore();
  }

  function drawCanvasDealerButton(context, images, assets, model, seats, width, height) {
    const dealerSeat = model.dealerSeat || getCoordinateApi().getDealerSeat(model.tableSize, model.seats, model.heroSeat);
    const dealer = seats.find((seat) => seat.seat === dealerSeat);
    if (!dealer) {
      return;
    }

    const button = loadImage(images, assets.images.dealerButton, () => rerenderFromContext(context, model));
    const size = clamp(Math.min(width, height) * 0.072, 34, 60);
    const point = getDealerButtonPoint(dealer, width, height, size);

    context.save();
    context.shadowColor = "rgba(0, 0, 0, 0.44)";
    context.shadowBlur = 14;
    context.shadowOffsetY = 8;
    if (button.loaded) {
      context.drawImage(button.image, point.x - size / 2, point.y - size / 2, size, size);
    } else {
      context.beginPath();
      context.arc(point.x, point.y, size / 2, 0, Math.PI * 2);
      context.fillStyle = "#06121d";
      context.fill();
      context.strokeStyle = "#f0bb59";
      context.lineWidth = 2;
      context.stroke();
    }
    context.restore();
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

  function drawCoverImage(context, image, x, y, width, height, focusX = 0.5, focusY = 0.5) {
    const scale = Math.max(width / image.width, height / image.height);
    const sourceWidth = width / scale;
    const sourceHeight = height / scale;
    const sourceX = clamp((image.width - sourceWidth) * focusX, 0, Math.max(0, image.width - sourceWidth));
    const sourceY = clamp((image.height - sourceHeight) * focusY, 0, Math.max(0, image.height - sourceHeight));

    context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
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

  function drawAvatarFallback(context, x, y, size) {
    context.save();
    const gradient = context.createRadialGradient(x - size * 0.15, y - size * 0.18, size * 0.1, x, y, size * 0.52);
    gradient.addColorStop(0, "#245f80");
    gradient.addColorStop(1, "#06121d");
    context.beginPath();
    context.arc(x, y, size * 0.48, 0, Math.PI * 2);
    context.fillStyle = gradient;
    context.fill();
    context.restore();
  }

  function drawFrameFallback(context, x, y, width, height) {
    context.save();
    context.strokeStyle = "#c89445";
    context.lineWidth = Math.max(2, width * 0.04);
    context.beginPath();
    context.arc(x, y, width * 0.38, 0, Math.PI * 2);
    context.stroke();
    context.strokeRect(x - width * 0.43, y + height * 0.24, width * 0.86, height * 0.28);
    context.restore();
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
