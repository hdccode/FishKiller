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
- State-fed placeholders render:
  - FK2 room/table scene background
  - six tuned seat placeholders
  - position labels
  - status/action labels
  - pot label
  - hero-card placeholders beside the hero seat
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

## Renderer Parity QA Update

After the Pixi scene-background pass, the renderer was checked again at:

- 1920 x 1080
- 1440 x 900
- 1366 x 768

Updated results:

- Pixi now keeps the clean `assets/FishKiller2.2.png` scene background rather than drawing a dark box or a synthetic table over the stage.
- Seat placeholders now consume the same rendered-state concepts as the DOM table: hero seat, folded seats, villain/action labels, recent villain response labels, and the single acting seat.
- Active/hero seats receive a stronger warm ring/glow; folded seats are dimmed but still readable.
- Pot text is still state-fed and remains centered in the felt area.
- Hero card labels are normalized and placed beside the current hero seat instead of in the center community-card area.
- The 1600 x 900 contain transform remains stable across all three checked desktop viewports.
- Restoring `ENABLE_PIXI_TABLE = false` returns the app to the DOM fallback table.

## Primitive Asset Polish Update

On 2026-06-17, after auditing committed FK2 assets, the Pixi renderer was moved slightly closer to production visuals without adding or replacing art:

- Card-face image assets are not present yet, so Pixi now renders more polished card-like primitives with bevels, shadows, corner rank/suit labels, and center suit marks.
- Chip/pot image assets are not present yet, so Pixi now draws small chip-stack primitives around the pot badge.
- Seat placeholders now have more layered brass medallion and plaque primitives while still avoiding avatar replacement.
- `docs/pixi-asset-map.md` records which FK2 scene, avatar, and seat chrome assets are usable, and which card/chip/HUD assets are still missing.
- `ENABLE_PIXI_TABLE` was restored to `false` after local checks.

Fresh automated screenshot capture was attempted for this pass, but the local Edge/CDP helper became unreliable in this shell and did not produce fresh screenshot files. The code/server checks below remain the validation record for this pass. The last successful visual captures still apply to background/stage scaling, but the primitive card/chip polish should receive a fresh manual or repaired-CDP visual pass before promoting Pixi mode.

## Remaining Misalignment And Visual Issues

- The renderer still uses Pixi-drawn placeholder medallions and plaques, not the production DOM seat/avatar art.
- Seat coordinates are tuned for the FK2 scene and usable, but they still need final art-direction tuning once real Pixi avatar/chrome textures are introduced.
- Hero cards are now beside the hero seat, but the exact offsets may need per-seat art tuning when real card textures replace the primitive card renderer.
- The Pixi renderer does not yet draw board/community-card slots for postflop scenes.
- The canvas scale works predictably, but Pixi still needs a shared renderer-state adapter before it can fully replace the DOM table.

## Missing Or Weak TableState Data

- Hero cards now have renderer-facing normalization in the Pixi scaffold, but this helper is local to `src/render/fk2-table-scene.js` and should eventually move into a shared adapter.
- Seat avatar art is not passed as render-ready texture data. Pixi currently draws generic circles instead of using the live avatar assets.
- Seat chrome/shell data is not represented in renderer-friendly form. The DOM renderer still owns shell selection and text placement.
- The Pixi layer now owns a fixed FK2 scene coordinate map, but there is still no shared coordinate transform between DOM percentages and Pixi stage pixels.
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
   Normalize cards, seats, avatar URLs, status labels, board slots, and animation events before either renderer consumes them.

2. Move avatar and seat chrome rendering into Pixi.
   Start with the same live avatar URLs and FK2 seat chrome strategy used by the DOM table, then replace the generic Pixi circles.

3. Add card texture rendering.
   Replace rank/suit text placeholders with card face textures, while keeping the current hero-card placement beside the hero seat.

4. Add community-card and pot prop slots.
   Model the center board area explicitly before using Pixi for postflop table scenes.

5. Keep DOM fallback until Pixi reaches visual parity.
   The current Pixi scaffold is useful as a mount/state proof, not as a user-facing renderer.
