# Pixi Asset Map

Date: 2026-06-17

Branch: `deploy-demo`

## Current Direction

Pixi is still disabled by default. When `ENABLE_PIXI_TABLE` is enabled locally, the renderer owns only the table scene while the DOM keeps the HUD, action buttons, feedback dock, and trainer controls.

This map records which committed assets are suitable for the Pixi migration and which production assets are still missing.

## Usable Scene Assets

| Asset | Dimensions | Notes |
| --- | ---: | --- |
| `assets/FishKiller2.2.png` | 1586 x 992 | Current production FK2 scene plate. Clean room/table/rug image with no baked cards, seats, labels, HUD, or buttons. Used by Pixi as the background. |
| `assets/FishKiller2.png` | 1672 x 941 | Reference target image. Contains baked UI and should not be used as a live gameplay stage. |
| `assets/FishKiller2.1.png` | 1672 x 941 | Previous FK2 stage direction. Kept as reference, not active. |
| `assets/fishkiller2-stage-bg.png` | 1672 x 562 | Cropped/partial stage background with alpha. Superseded by `FishKiller2.2.png` for Pixi. |
| `assets/FishKiller1.png` | 1672 x 941 | Alternate skin reference/background. Not part of the Pixi FK2 migration. |

## Usable Avatar Assets

| Asset | Dimensions | Notes |
| --- | ---: | --- |
| `assets/avatars/seat-shark.png` | 512 x 512 | Transparent live avatar. DOM uses it; Pixi does not yet load avatar textures. |
| `assets/avatars/seat-octopus.png` | 512 x 512 | Transparent live avatar. DOM uses it; Pixi does not yet load avatar textures. |
| `assets/avatars/seat-turtle.png` | 512 x 512 | Transparent live avatar. DOM uses it; Pixi does not yet load avatar textures. |
| `assets/avatars/seat-blue-shark.png` | 512 x 512 | Transparent live avatar. DOM uses it; Pixi does not yet load avatar textures. |
| `assets/avatars/seat-dolphin.png` | 512 x 512 | Transparent live avatar. DOM uses it; Pixi does not yet load avatar textures. |
| `assets/avatars/seat-angler.png` | 512 x 512 | Transparent live avatar. DOM uses it; Pixi does not yet load avatar textures. |
| `assets/avatars/fishkiller-avatar-sheet.png` | 1536 x 1024 | Transparent fallback sprite sheet. Not used by Pixi yet. |

## Seat Chrome Assets

| Asset | Dimensions | Notes |
| --- | ---: | --- |
| `assets/FKSeat/FKFrame_transparent.png` | 1354 x 685 | Transparent combined right-facing seat shell. Good candidate for a later Pixi texture pass. |
| `assets/FKSeat/FKFrameLeft_transparent.png` | 1309 x 664 | Transparent combined left-facing seat shell. Good candidate for a later Pixi texture pass. |
| `assets/FKSeat/FKHero_transparent.png` | 1076 x 1116 | Transparent hero seat shell/medallion. Needs layout testing before use. |
| `assets/FKSeat/FKBorder_transparent.png` | 1069 x 1087 | Transparent medallion/ring source. Candidate for later texture pass. |
| `assets/FKSeat/FKPos_transparent.png` | 1459 x 452 | Transparent position plaque. Not used in the current combined-shell strategy. |
| `assets/FKSeat/FKStat_transparent.png` | 1610 x 420 | Transparent status plaque. Not used in the current combined-shell strategy. |
| `assets/fk2_medallion_ring_normal.png` | 148 x 148 | Small transparent medallion ring. Candidate for lightweight Pixi ring texture. |
| `assets/fk2_position_plaque_blank.png` | 132 x 46 | Small transparent position plaque. Candidate for lightweight Pixi plaque texture. |
| `assets/fk2_position_plaque_blank_left.png` | 132 x 46 | Small transparent left plaque. Candidate for lightweight Pixi plaque texture. |
| `assets/fk2_status_plaque_blank.png` | 118 x 36 | Small transparent status plaque. Candidate for lightweight Pixi plaque texture. |

Older top-level `FKFrame.png`, `FKFrameLeft.png`, `FKHero.png`, `FKPos.png`, and `FKBorder.png` are not suitable for Pixi rendering because they do not have alpha and would create rectangular artifacts.

## Missing Production Assets

| Need | Status | Current Pixi Fallback |
| --- | --- | --- |
| Card face textures | Missing | Pixi renders card-like primitives with rank/suit text, bevels, and shadows. |
| Card back texture | Missing | Not needed yet for hero-card display. |
| Chip stack / pot pile props | Missing | Pixi renders small layered chip primitives near the pot. |
| Dealer button prop | Missing | Not rendered yet. |
| Action icons for Fold / Call / Raise / 3-bet / 4-bet / Jam / Squeeze | Missing | DOM action buttons still own action controls. |
| HUD icons/textures | Missing | DOM HUD still owns session stats. |
| Board/community-card texture slots | Missing | Not modeled in Pixi yet. |
| Correct/incorrect feedback effects | Missing | DOM feedback dock still owns answer feedback. |

## Current Pixi Visual Strategy

- Use `assets/FishKiller2.2.png` as the FK2 scene plate.
- Keep DOM avatar/card assets untouched until renderer-state parity is stronger.
- Use Pixi primitives for cards, chip stacks, and seat chrome in the interim.
- Avoid loading unsuitable non-alpha screenshot crops or top-level legacy FK assets into Pixi.
- Keep all poker logic and action behavior outside Pixi.

## Recommended Next Asset Slice

1. Load live seat avatar textures into Pixi from the same avatar URLs the DOM uses.
2. Test one lightweight transparent ring/plaque asset set in Pixi.
3. Replace the primitive card renderer with a small generated card-face atlas.
4. Add chip/dealer-button prop textures once the pot/seat/card positions are stable.
