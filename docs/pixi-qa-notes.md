# Pixi Scaffold QA Notes

Date: 2026-06-16

Branch: `deploy-demo`

## Scope

This QA pass temporarily enabled `ENABLE_PIXI_TABLE` locally to inspect the disabled PixiJS table-scene scaffold. The committed code must keep `ENABLE_PIXI_TABLE = false`.

Checked desktop viewports:

- 1920 x 1080
- 1440 x 900
- 1366 x 768

## What Works

- The Pixi scaffold loads and renders when `ENABLE_PIXI_TABLE` is temporarily set to `true`.
- The canvas mounts inside `#pixi-table-scene` within the existing `.table-stage`.
- The feature flag correctly hides the DOM table only while Pixi mode is enabled.
- The Pixi layer receives the existing `tableState` from `app.js`.
- Basic state-fed placeholders render:
  - table oval
  - six seat placeholders
  - position labels
  - status/action labels
  - pot label
  - hero-card placeholders
- After restoring `ENABLE_PIXI_TABLE = false`, the DOM table fallback is visible again and the existing trainer view continues to load.

## Misalignment And Visual Issues

- The 1600 x 900 placeholder drawing is not scaled/positioned like the current FK2 room composition.
- At 1920 x 1080, the placeholder table is too large and sits too far left relative to the production FK2 scene.
- At 1440 x 900, the placeholder table collides with the action row and partly disappears behind the controls.
- At 1366 x 768, the placeholder table is significantly too large for the available stage height and clips at the right/bottom.
- The Pixi scene draws a flat placeholder table over the FK2 room image, so it visually fights the current asset-backed background rather than replacing it cleanly.
- Seat placeholder coordinates are logical for a raw 1600 x 900 stage, but they do not map to the existing CSS/FK2 table crop.
- Hero-card placeholders can overlap seat labels and action controls, especially when the hero is on a side/top seat.
- The canvas scale works mechanically, but the art-coordinate system needs a contain/cover transform and a stage-safe layout box before it can be visually useful.

## Missing Or Weak TableState Data

- Hero-card objects need a renderer-facing normalization helper. The Pixi placeholder exposed suit/object formatting issues, such as labels rendering with object text instead of clean rank/suit glyphs.
- Seat avatar art is not passed as render-ready texture data. Pixi currently draws generic circles instead of using the live avatar assets.
- Seat chrome/shell data is not represented in renderer-friendly form. The DOM renderer still owns shell selection and text placement.
- The Pixi layer does not receive precise FK2 stage crop/framing information from CSS, so it cannot align to the current background composition.
- There is no shared coordinate transform between DOM percentages and Pixi stage pixels.
- Board/community-card slots are not modeled as a first-class render target yet.
- Action animation state is still DOM-specific and is not represented in a way Pixi can consume.

## DOM Fallback Check

After the temporary QA pass:

- `ENABLE_PIXI_TABLE` was restored to `false`.
- The DOM `.table-visual` renderer is visible again.
- The Pixi mount remains present but hidden/inactive.
- The local server responded with HTTP `200`.

## Next Migration Steps

1. Add a renderer-facing table-state adapter.
   Normalize cards, seats, avatar URLs, status labels, and board slots before either renderer consumes them.

2. Add a proper Pixi stage transform.
   Decide whether the Pixi stage should own the full FK2 room scene or only the table layer. Then implement a single contain/cover transform so coordinates map predictably at 1920, 1440, and 1366 widths.

3. Replace placeholder drawing with the clean FK2 background only after the transform is stable.
   Avoid drawing a second table over the existing DOM/CSS background unless Pixi fully owns that scene layer.

4. Move seat rendering into Pixi in one small slice.
   Start with one seat using the same avatar asset and live text, then scale out to all six seats.

5. Keep DOM fallback until Pixi reaches visual parity.
   The current Pixi scaffold is useful as a mount/state proof, not as a user-facing renderer.
