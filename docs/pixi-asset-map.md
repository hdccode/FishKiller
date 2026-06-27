# Pixi Asset Map

## Marine Runtime Set

Runtime marine assets live under `assets/runtime/marine/` and are loaded through `assets/runtime/marine/manifest.js`.

The manifest exposes semantic, version-aware keys under `window.FK2_MARINE_ASSETS.semantic` and the current production choices under `window.FK2_MARINE_ASSETS.production`.

| Runtime file | Source file used | Manifest key | Status |
| --- | --- | --- | --- |
| `marine-background.png` | `FKBack3.0.png` | `background.table.v3_0` | Active table/lounge background; no newer background asset is present. |
| `avatar-shark-v3_1.png` | `FKShark3.1.png` | `character.shark.v3_1` | Active character portrait. |
| `avatar-octopus-v3_1.png` | `FKOctopus3.1.png` | `character.octopus.v3_1` | Active character portrait. |
| `avatar-turtle-v3_1.png` | `FKTurtle3.1.png` | `character.turtle.v3_1` | Active character portrait. |
| `avatar-dolphin-v3_1.png` | `FKDolphin3.1.png` | `character.dolphin.v3_1` | Active character/profile portrait. |
| `avatar-swordfish-v3_1.png` | `FKSwordfish3.1.png` | `character.swordfish.v3_1` | Active character portrait; also aliased to the existing `marlin` seat key. |
| `avatar-anglerfish-v3_1.png` | `FKAngler3.1.png` | `character.anglerfish.v3_1` | Active character portrait. |
| `seat-frame-v3_1.png` | `FKFrame3.1.png` | `frame.main.v3_1` | Active transparent character/profile frame. |
| `chip-anchor-v4_1.png` | `FKChip4.1.png` | `chip.anchor.v4_1` | Active single chip/currency display. |
| `chip-helm-v4_2.png` | `FKChip4.2.png` | `chip.helm.v4_2` | Active alternate single chip. |
| `chip-stack-small-v4_3.png` | `FKChip4.3.png` | `chip.stack.small.v4_3` | Active small chip stack. |
| `chip-pot-pile-v4_4.png` | `FKChip4.4.png` | `chip.potPile.v4_4` | Active table pot pile. |
| `chip-stack-medium-v4_5.png` | `FKChip4.5.png` | `chip.stack.medium.v4_5` | Active medium chip stack. |
| `chip-stack-tall-v4_6.png` | `FKChip4.6.png` | `chip.stack.tall.v4_6` | Active tall chip stack. |
| `chip-shadow-v3_1.png` | `FKShadow3.1.png` | `chip.shadow.v3_1` | Active soft shadow layer. |

## Disabled Candidates

| Source file | Reason |
| --- | --- |
| `FKChip3.1.png` | Opaque `24bppRgb` PNG with a baked white/preview background. Not copied into the production runtime set and not rendered. |
| `seat-frame.png`, `avatar-*.png`, `dealer-button.png`, `chip-pot-pile.png`, `chip-shadow.png` | Older runtime copies from the 3.0 pass had baked checker/white backgrounds. They remain only as legacy files and are not production selections. |

## Renderer Ownership

- `src/render/fk2-table-scene.js` owns the table scene background, active character portraits, active `FKFrame3.1` seat frame, active `FKChip4.4` pot pile, and `FKShadow3.1` shadow layer.
- Pixi is still responsible for the table scene. The canvas path mirrors the same asset choices as a fallback.
- DOM/CSS owns HUD, buttons, menus, panels, labels, card faces, board cards, hero-card overlay, pot labels, and action feedback.
- `app.js` provides vanilla reusable asset helpers named `FKAssetImage`, `FKCharacterPortrait`, `FKChip`, `FKChipStack`, `FKRewardDisplay`, and `FKFramePanel`.
- Existing trainer logic is unchanged; `app.js` passes the current table view model into the marine scene renderer from `renderTableVisual`.

## Notes

- Active version preference is `4.#` first, then `3.1`, then older assets only where no newer equivalent exists.
- The 3.0 background remains active because no `3.1` or `4.#` replacement background was supplied.
- The dealer button remains code-rendered because no transparent `3.1` or `4.#` dealer asset is present.
