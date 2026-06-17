# Pixi Scaffold QA Notes

Date: 2026-06-16

Branch: `deploy-demo`

## Scope

This QA pass temporarily enabled `ENABLE_PIXI_TABLE` locally to inspect the disabled PixiJS table-scene scaffold. The committed code must keep `ENABLE_PIXI_TABLE = false`.

Checked desktop viewports:

- 1920 x 1080
- 1440 x 900
- 1366 x 768

## Polished Placeholder Manual QA - 2026-06-17

Result: pass for the disabled polished-placeholder scaffold, with Pixi still not ready for promotion. `ENABLE_PIXI_TABLE` was temporarily set to `true` for inspection and restored to `false` before validation and commit.

Captured viewport checks:

- 1920 x 1080: pass. Stage fills the table area, hero cards are readable, seat plaques and action labels are legible, pot/chip placeholders are centered, and action controls remain below the stage without overlap.
- 1440 x 900: pass. Stage fits cleanly, card labels remain readable, plaques stay attached to seats, pot/chips remain readable, and the bottom action row is not collided with the Pixi scene.
- 1366 x 768: pass with caution. Stage still fits and cards/labels remain readable, but the overall UI is dense and the bottom feedback band has little vertical breathing room.

Checklist:

- Card readability: pass for placeholder rank/suit cards at all checked sizes.
- Seat plaques: pass for position plaques and status plaques at all checked sizes.
- Pot/chips: pass for placeholder pot badge and chip stacks at all checked sizes.
- Active/folded states: pass after a small Pixi-only fix. Folded seats now render `Folds` instead of inheriting a temporary `Waiting` caption from the animation-masked DOM state.
- Action labels: pass for opener/limp/action labels, with truncation still expected on very long labels.
- Stage fit: pass at 1920 x 1080, 1440 x 900, and 1366 x 768.

Tiny visual fix applied:

- `src/render/fk2-table-scene.js` now prioritizes the folded-seat state when building Pixi seat captions, so folded seats display `Folds` consistently.

Top five remaining issues before promoting Pixi mode:

1. Pixi still uses generic medallion/plaque primitives instead of the production avatar and seat chrome assets.
2. Card faces are still drawn placeholders, not production card textures.
3. Pot/chip visuals are placeholder primitives and need real chip art or a final visual spec.
4. Pixi still has no explicit board/community-card slots for postflop table scenes.
5. The 1366 x 768 layout is usable but tight; final Pixi promotion should include a denser small-desktop layout pass for the surrounding DOM controls.

QA tooling notes:

- Playwright was already installed in the repo; no extra screenshot software was downloaded.
- The local browser needed network access to load `https://cdn.jsdelivr.net/npm/pixi.js@8.8.1/dist/pixi.mjs`, because Pixi is currently CDN-loaded only when the temporary flag is enabled.
- Fresh screenshots were captured under the ignored `.tmp-edge-cdp-pixi-qa/screenshots/` folder.

## Seat Frame Texture QA - 2026-06-17

Result: pass for the first real Pixi seat chrome integration. `ENABLE_PIXI_TABLE` was temporarily set to `true` for inspection and restored to `false` before validation and commit.

Checked desktop viewports:

- 1920 x 1080
- 1440 x 900
- 1366 x 768

Findings:

- Pixi now loads `assets/FKSeat/FKFrame_transparent.png` and `assets/FKSeat/FKFrameLeft_transparent.png` for right/left seat chrome.
- Position labels, action/status labels, hero state, acting state, and folded state remain readable on top of the frame textures.
- The renderer keeps primitive avatar fills for now; avatar portraits are intentionally not integrated in this pass.
- Primitive fallback remains available if the frame textures fail to load.
- The 1366 x 768 viewport remains dense but usable, with no table-stage collision from the frame textures.

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

## Polished Placeholder Manual QA Attempt

On 2026-06-17, Pixi was temporarily enabled locally again to QA the polished placeholder renderer at:

- 1920 x 1080
- 1440 x 900
- 1366 x 768

Result: visual pass/fail is inconclusive. `ENABLE_PIXI_TABLE` was restored to `false`, and the committed code remains DOM-table-first.

Capture/inspection attempts:

- The existing Edge/CDP helper reached the remote debugging endpoint, but Node's built-in WebSocket failed opening the DevTools page socket before screenshots could be captured.
- A second ignored temporary CDP helper was tried with `--remote-allow-origins=*`; it reached the same CDP page target but hit the same WebSocket failure.
- Edge's native headless `--screenshot` path was tried with a temporary local `?pixiQa=1` auto-start hook, but this Edge installation did not write screenshot files reliably from the shell.

Checks from code/server inspection:

- Pixi remains feature-flagged and disabled by default.
- The DOM fallback is still the only committed user-facing renderer.
- The polished placeholder renderer still uses primitives for cards, chips, and seats because production card/chip/avatar textures are not yet wired into Pixi.

Top five issues before promoting Pixi mode:

1. Visual QA tooling needs to be repaired or replaced so Pixi changes can be checked at desktop sizes without relying on stale screenshots.
2. Seat placeholders still lack live avatar textures and remain materially behind the DOM FK2 seat treatment.
3. Hero card primitives are readable in code structure, but they still need a real screenshot pass to verify size, contrast, and per-seat offsets.
4. Pot/chip primitives are useful as placeholders, but they need production chip assets or a stronger shared visual spec.
5. Pixi still has no board/community-card slots, so the center felt cannot yet support the planned postflop visual model.

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
