# Pixi Table Scene Migration

This branch keeps the existing DOM poker table as the production renderer and adds a disabled PixiJS proof-of-concept path for the FK2 table scene.

## Current Hybrid Approach

- `src/ui/table-view.js` remains the live DOM table renderer.
- `app.js` still builds the existing `tableState` from trainer state, range data, seat state, cards, pot, and feedback.
- `src/render/fk2-table-scene.js` can render a separate Pixi canvas from that same `tableState`.
- `src/render/fk2-scene-coordinates.js` owns the fixed 1600 x 900 Pixi stage coordinates.
- `index.html` includes a `#pixi-table-scene` mount inside the existing `.table-stage`.
- The feature flag `ENABLE_PIXI_TABLE` in `app.js` defaults to `false`, so the current DOM table remains visible and gameplay is unchanged.

## Scene Ownership Decision

When `ENABLE_PIXI_TABLE` is temporarily enabled, Pixi now owns the full FK2 table-scene plate. The renderer loads `assets/FishKiller2.2.png` into the fixed 1600 x 900 world and cover-fits it behind the live placeholder overlays.

The DOM still owns the top HUD, action buttons, feedback dock, range table modal, and all trainer controls. This keeps the Pixi migration scoped to the table scene while the existing DOM trainer remains the production fallback.

If the FK2 scene image fails to load, the Pixi renderer falls back to the earlier synthetic dark-room/table placeholder so local QA can still distinguish renderer placement from app failures.

## Pixi Loading

The proof of concept uses a browser dynamic import from the vendored local Pixi ESM build:

`third_party/pixi/pixi.min.mjs`

That keeps the experiment offline-safe while it remains disabled. Because `ENABLE_PIXI_TABLE` is `false`, PixiJS is not loaded during normal app use.

If the proof of concept graduates, switch to a package-managed dependency and a bundler/build step only after the rendering boundary is proven.

## How To Enable Locally

1. In `app.js`, temporarily set:

   ```js
   const ENABLE_PIXI_TABLE = true;
   ```

2. Start the local server:

   ```powershell
   npm start
   ```

3. Open `http://127.0.0.1:4173/` and enter the 6-max preflop trainer.

When enabled, the Pixi canvas is shown inside `.table-stage` and the DOM `.table-visual` is hidden. If Pixi fails to load or render, the code logs a warning and keeps the DOM fallback visible.

## Proof-Of-Concept Layers

The Pixi scene currently renders:

- FK2 room/table scene background from `assets/FishKiller2.2.png`
- six seat placeholders using the existing seat/status data
- pot label from the existing table state
- two hero-card placeholders near the hero seat

The synthetic dark background and simple wood/felt oval remain fallback-only layers for failed image loads. This is still not a replacement for the FK2 visual system yet; it is a rendering boundary test for letting Pixi own the table scene while DOM controls stay live.

## Migration Rules

- Do not move poker logic into Pixi.
- Do not move trainer state, range calculations, or grading into Pixi.
- Keep the DOM table as the fallback until the Pixi renderer has parity.
- Keep all coordinates centralized in `src/render/fk2-scene-coordinates.js`.
- Add real FK2 art assets only after the placeholder stage proves sizing, scaling, and state feeding.
