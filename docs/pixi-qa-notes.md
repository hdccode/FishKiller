# Pixi QA Notes

## Marine Scene Pass

Date: 2026-06-27

Scope:

- Replaced the table scene background with `assets/runtime/marine/marine-background.png` sourced from `FKBack3.0.png`.
- Repaired the scene so baked checker/white sprite assets are no longer rendered.
- Added code-rendered avatar disks, seat chrome, decorative pot-chip pile, and dealer button through `src/render/fk2-table-scene.js`.
- Enabled the active lesson/session screen as a full-viewport marine table layout inspired by `FKConcept3.png`.
- Retuned normalized seat coordinates in `src/render/fk2-scene-coordinates.js` and mirrored them in `TABLES` for DOM labels.
- Kept trainer decisions unchanged. HUD, menus, action buttons, board cards, hero cards, and feedback remain on the DOM/CSS path.

## Coordinate Notes

- 6-max seats are symmetric around the `FKBack3.0.png` rail: UTG/BTN on the side rail, HJ/CO above the rail, SB/BB below the rail.
- HU, 3-max, and 9-max reuse the same coordinate system with lower seats pulled high enough to avoid clipping the generated seat-frame label plate.
- The dealer button is anchored to the current button seat and offset inward toward the table center.

## Transparency Audit

Root cause:

- The generated runtime sprites were exported without usable alpha. They are fully opaque PNGs with checker/white pixels baked into the image data.
- The marine background is also opaque, but it is a full-frame background plate and does not need transparency.

Assets kept:

- `marine-background.png`, sourced from `FKBack3.0.png`.

Assets disabled from rendering:

- Seat frame/chrome: `seat-frame.png`.
- Avatars: `avatar-shark.png`, `avatar-octopus.png`, `avatar-turtle.png`, `avatar-dolphin.png`, `avatar-marlin.png`, `avatar-anglerfish.png`.
- Dealer button: `dealer-button.png`.
- Pot/chips/shadow sprites: `chip-pot-pile.png`, `chip-shadow.png`, and the single/stack chip sprites.

Fallback decision:

- Seat chrome, avatar disks, pot chips, and dealer button now use Pixi/canvas primitives. This keeps the marine scene transparent and avoids rendering any rectangular sprite backing.
- Seat text remains DOM-rendered.

## Validation

- `git diff --check`: pass. Only Windows CRLF conversion warnings were printed.
- `node --check app.js`: pass.
- `node --check src/render/fk2-table-scene.js`: pass.
- `node --check src/render/fk2-scene-coordinates.js`: pass.
- `node --check server.js`: pass.
- Server HTTP 200: pass at `http://127.0.0.1:4173/`.
- Runtime asset HTTP 200: pass for `assets/runtime/marine/marine-background.png` and `assets/runtime/marine/manifest.js`.
- Runtime background byte check: `marine-background.png` served as 2225923 bytes, matching `FKBack3.0.png`.
- `node --check src/render/fk2-table-scene.js`: pass after primitive fallback repair.

## Viewport QA

Manual screenshot review is being handled by the user.

| Viewport | Status | Notes |
| --- | --- | --- |
| 1920x1080 | Pending manual screenshot | Check concept-like full-screen table, top HUD, side panels, hero cards, pot pile, and no seat clipping. |
| 1440x900 | Pending manual screenshot | Check 16:10 background crop, centered action buttons, and side seats on rail. |
| 1366x768 | Pending manual screenshot | Check shortest target height for bottom action buttons, feedback band, seat labels, and panel overlap. |

## Residual Risk

- This checkout does not include a bundled Pixi runtime. The renderer uses Pixi when `window.PIXI` exists and otherwise uses the local canvas renderer so the static app remains visible.
