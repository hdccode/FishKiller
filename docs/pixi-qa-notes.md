# Pixi QA Notes

## Marine Scene Pass

Date: 2026-06-27

Scope:

- Replaced the table scene background with `assets/runtime/marine/marine-background.png` sourced from `FKBack3.0.png`.
- Repaired the scene so baked checker/white sprite assets are no longer rendered.
- Added the transparent `FK3.1` character/frame/shadow assets and transparent `FK4.#` chip assets as the current production runtime set.
- Updated `src/render/fk2-table-scene.js` so Pixi/canvas seats use `FKFrame3.1` plus `FK3.1` character portraits, and the table pot uses `FKChip4.4` plus `FKShadow3.1`.
- Added vanilla DOM asset helpers in `app.js` for `FKAssetImage`, `FKCharacterPortrait`, `FKChip`, `FKChipStack`, `FKRewardDisplay`, and `FKFramePanel`.
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
- The newer `FK3.1` character/frame/shadow files and `FK4.#` chip files were regenerated with real alpha and transparent edges.

Assets kept:

- `marine-background.png`, sourced from `FKBack3.0.png`.
- `avatar-shark-v3_1.png`, `avatar-octopus-v3_1.png`, `avatar-turtle-v3_1.png`, `avatar-dolphin-v3_1.png`, `avatar-swordfish-v3_1.png`, and `avatar-anglerfish-v3_1.png`.
- `seat-frame-v3_1.png`.
- `chip-anchor-v4_1.png`, `chip-helm-v4_2.png`, `chip-stack-small-v4_3.png`, `chip-pot-pile-v4_4.png`, `chip-stack-medium-v4_5.png`, and `chip-stack-tall-v4_6.png`.
- `chip-shadow-v3_1.png`.

Assets disabled from rendering:

- Seat frame/chrome: `seat-frame.png`.
- Avatars: `avatar-shark.png`, `avatar-octopus.png`, `avatar-turtle.png`, `avatar-dolphin.png`, `avatar-marlin.png`, `avatar-anglerfish.png`.
- Dealer button: `dealer-button.png`.
- Pot/chips/shadow sprites: `chip-pot-pile.png`, `chip-shadow.png`, and the single/stack chip sprites.
- `FKChip3.1.png`: still opaque `24bppRgb` with a baked white/preview background. It is flagged in the manifest and not copied into the production runtime set.

Fallback decision:

- Seats and the pot are now asset-first using the `3.1`/`4.#` production set. Pixi/canvas primitives remain as fallback if an active asset path is unavailable.
- The dealer button remains code-rendered because there is no transparent `3.1` or `4.#` dealer-button replacement.
- Seat text remains DOM-rendered.

## Validation

- `git diff --check`: pass. Only Windows CRLF conversion warnings were printed.
- `node --check app.js`: pass.
- `node --check src/render/fk2-table-scene.js`: pass.
- `node --check src/render/fk2-scene-coordinates.js`: pass.
- `node --check server.js`: pass.
- `node --check assets/runtime/marine/manifest.js`: pass.
- Server HTTP 200: pass at `http://127.0.0.1:4173/`.
- Runtime asset HTTP 200: pass for `assets/runtime/marine/marine-background.png` and `assets/runtime/marine/manifest.js`.
- Runtime asset HTTP 200: pass for every copied `3.1` and `4.#` production asset.
- Runtime background byte check: `marine-background.png` served as 2225923 bytes, matching `FKBack3.0.png`.
- Alpha audit: all copied `3.1` character/frame/shadow files and `4.#` chip files have transparent edges and usable alpha. `FKChip3.1.png` failed and is disabled.
- Dark/light composite QA: pass using `.tmp/asset-qa/fk-assets-dark.png` and `.tmp/asset-qa/fk-assets-light.png`; no checkerboards, rectangular preview plates, or obvious white halos seen.

## Viewport QA

Manual screenshot review is being handled by the user.

| Viewport | Status | Notes |
| --- | --- | --- |
| 1920x1080 | Pending manual screenshot | Check concept-like full-screen table, top HUD, side panels, hero cards, pot pile, and no seat clipping. |
| 1440x900 | Pending manual screenshot | Check 16:10 background crop, centered action buttons, and side seats on rail. |
| 1366x768 | Pending manual screenshot | Check shortest target height for bottom action buttons, feedback band, seat labels, and panel overlap. |

## Residual Risk

- This checkout does not include a bundled Pixi runtime. The renderer uses Pixi when `window.PIXI` exists and otherwise uses the local canvas renderer so the static app remains visible.
