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

## Scaling Fix QA Update

After adding the centered contain transform in `src/render/fk2-table-scene.js`, the Pixi stage was checked again at:

- 1920 x 1080
- 1440 x 900
- 1366 x 768

Updated results:

- The Pixi renderer now resizes its renderer to the mount dimensions instead of stretching the 1600 x 900 drawing through CSS alone.
- The logical 1600 x 900 world is scaled with `min(mountWidth / 1600, mountHeight / 900)` and centered in the mount.
- The placeholder table no longer collides with the action row at 1440 x 900 or 1366 x 768.
- The canvas remains stable across the checked desktop viewports.
- Hero cards now render as clean rank/suit text rather than object text.
- Restoring `ENABLE_PIXI_TABLE = false` returns the app to the DOM fallback table.

## Misalignment And Visual Issues

- The 1600 x 900 placeholder drawing is now stable, but it is still not visually aligned to the production FK2 room composition.
- At 1920 x 1080, the placeholder scene is centered and contained, but the dark Pixi background rectangle reads as a separate staged box over the FK2 room.
- At 1440 x 900, the table no longer collides with the action row, but the placeholder stage has large empty/dark space around the table.
- At 1366 x 768, the table remains contained and readable, but the placeholder table is now intentionally smaller because the mount height drives the contain scale.
- The Pixi scene draws a flat placeholder table over the FK2 room image, so it visually fights the current asset-backed background rather than replacing it cleanly.
- Seat placeholder coordinates are logical for a raw 1600 x 900 stage, but they do not map to the existing CSS/FK2 table crop.
- Hero-card placeholders still need layout rules for every hero seat, but they no longer run into the action row after the contain transform.
- The canvas scale now works predictably, but the art-coordinate system still needs a production FK2 scene coordinate map before it can be visually useful.

## Missing Or Weak TableState Data

- Hero cards now have renderer-facing normalization in the Pixi scaffold, but this helper is local to `src/render/fk2-table-scene.js` and should eventually move into a shared adapter.
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
   A centered contain transform now exists. The next decision is whether Pixi owns the full FK2 room scene or only a table layer; that decision will determine whether the production transform should remain contain, switch to cover, or use a custom safe-area fit.

3. Replace placeholder drawing with the clean FK2 background only after the transform is stable.
   Avoid drawing a second table over the existing DOM/CSS background unless Pixi fully owns that scene layer.

4. Move seat rendering into Pixi in one small slice.
   Start with one seat using the same avatar asset and live text, then scale out to all six seats.

5. Keep DOM fallback until Pixi reaches visual parity.
   The current Pixi scaffold is useful as a mount/state proof, not as a user-facing renderer.
