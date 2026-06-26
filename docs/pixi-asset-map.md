# Pixi Asset Map

## Marine Runtime Set

Runtime marine assets live under `assets/runtime/marine/` and are loaded through `assets/runtime/marine/manifest.js`.

| Runtime file | Source file used | First use |
| --- | --- | --- |
| `marine-background.png` | `FKBack.png` | Table/lounge background plate |
| `seat-frame.png` | `FKFrame3.0.png` | Seat chrome/frame overlay |
| `avatar-shark.png` | `FKShark3.0.png` | BB/default shark avatar |
| `avatar-octopus.png` | `FKOctopus3.0.png` | HJ/UTG+1 avatar |
| `avatar-turtle.png` | `FKTurtle3.0.png` | CO/MP avatar |
| `avatar-dolphin.png` | `FKDolphin3.0.png` | BTN/Hero avatar |
| `avatar-marlin.png` | `FKSwordfish3.0.png` | SB/LJ avatar |
| `avatar-anglerfish.png` | `FKAngler3.0.png` | UTG avatar |
| `card-back.png` | `FKCard3.0.png` | Reserved card back asset |
| `chip-single-blue.png` | `FKChip2.png` | Reserved chip asset |
| `chip-single-red.png` | `FKChip3.1.png` | Reserved chip asset |
| `chip-single-gold.png` | `FKChip3.2.png` | Reserved chip asset |
| `chip-stack-small.png` | `FKChip3.3.png` | Reserved chip asset |
| `chip-stack-medium.png` | `FKChip3.5.png` | Reserved chip asset |
| `chip-pot-pile.png` | `FKChips.png` | Reserved chip asset |
| `chip-shadow.png` | `FKChip3.6.png` | Reserved chip shadow asset |
| `dealer-button.png` | `FKDealer.png` | Dealer button sprite |

## Renderer Ownership

- `src/render/fk2-table-scene.js` owns the table scene background, avatar sprites, seat frame/chrome, and dealer button.
- `src/render/fk2-scene-coordinates.js` owns normalized seat positions and avatar assignment.
- DOM/CSS still owns HUD, buttons, menus, panels, labels, card faces, board cards, pot labels, and action feedback.
- Existing trainer logic is unchanged; `app.js` now passes the current table view model into the marine scene renderer from `renderTableVisual`.

## Notes

- The runtime manifest exposes `window.FK2_MARINE_ASSETS`.
- The scene renderer prefers `window.PIXI` when present and keeps a canvas renderer available for this static checkout.
- Chip and card-back assets are staged in the manifest for later Pixi replacement work but are not wired into the active trainer display yet.
