# Pixi QA Notes

## Marine Scene Pass

Date: 2026-06-27

Scope:

- Replaced the table scene background with `assets/runtime/marine/marine-background.png`.
- Added avatar, seat-frame/chrome, and dealer-button rendering through `src/render/fk2-table-scene.js`.
- Retuned normalized seat coordinates in `src/render/fk2-scene-coordinates.js` and mirrored them in `TABLES` for DOM labels.
- Kept card faces, chip rendering, HUD, menus, buttons, and trainer decisions on the existing DOM/CSS path.

## Coordinate Notes

- 6-max seats are symmetric around the table rail: UTG/BTN on the side rail, HJ/CO above the rail, SB/BB below the rail.
- HU, 3-max, and 9-max reuse the same coordinate system with lower seats pulled high enough to avoid clipping the generated seat-frame label plate.
- The dealer button is anchored to the current button seat and offset inward toward the table center.

## Validation

- `git diff --check`: pass. Only Windows CRLF conversion warnings were printed.
- `node --check app.js`: pass.
- `node --check src/render/fk2-table-scene.js`: pass.
- `node --check src/render/fk2-scene-coordinates.js`: pass.
- `node --check server.js`: pass.
- Server HTTP 200: pass at `http://127.0.0.1:4173/`.
- Runtime asset HTTP 200: pass for `assets/runtime/marine/marine-background.png` and `assets/runtime/marine/manifest.js`.

## Viewport QA

Manual screenshot review is being handled by the user.

| Viewport | Status | Notes |
| --- | --- | --- |
| 1920x1080 | Pending manual screenshot | Check table large/centered, no bottom seat clipping, board/pot labels readable. |
| 1440x900 | Pending manual screenshot | Check 16:10 balance and side seats on rail. |
| 1366x768 | Pending manual screenshot | Check shortest target height for frame clipping and text overlap. |

## Residual Risk

- This checkout does not include a bundled Pixi runtime. The renderer uses Pixi when `window.PIXI` exists and otherwise uses the local canvas renderer so the static app remains visible.
