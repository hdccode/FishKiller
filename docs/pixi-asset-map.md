# Pixi Asset Map

Date: 2026-06-17

Branch: `deploy-demo`

## Current Direction

Pixi is still disabled by default. When `ENABLE_PIXI_TABLE` is enabled locally, the renderer owns only the table scene while the DOM keeps the HUD, action buttons, feedback dock, and trainer controls.

This map records which committed assets are suitable for the Pixi migration and which production assets are still missing.

See `docs/asset-production-brief.md` for the production filenames, target dimensions, transparency requirements, and style rules for the final Pixi runtime asset set.

## Usable Scene Assets

| Asset | Dimensions | Status | Notes |
| --- | ---: | --- | --- |
| `assets/FishKiller2.2.png` | 1586 x 992 | Ready for prototype | Current FK2 scene plate. Clean room/table/rug image with no baked cards, seats, labels, HUD, or buttons. Used by Pixi as the background. |
| `assets/FishKiller2.png` | 1672 x 941 | Reference only | Target image with baked UI. Do not use as a live gameplay stage. |
| `assets/FishKiller2.1.png` | 1672 x 941 | Reference only | Previous FK2 stage direction. Kept as reference, not active. |
| `assets/fishkiller2-stage-bg.png` | 1672 x 562 | Superseded | Cropped/partial stage background with alpha. Superseded by `FishKiller2.2.png` for Pixi. |
| `assets/FishKiller1.png` | 1672 x 941 | Out of scope | Alternate skin reference/background. Not part of the Pixi FK2 migration. |

## Usable Avatar Assets

| Asset | Dimensions | Status | Notes |
| --- | ---: | --- | --- |
| `assets/avatars/seat-shark.png` | 512 x 512 | Implemented in Pixi prototype | Transparent live avatar. Pixi now loads it for UTG. Final runtime target: `assets/runtime/fk2/avatar-utg-shark.webp`. |
| `assets/avatars/seat-octopus.png` | 512 x 512 | Implemented in Pixi prototype | Transparent live avatar. Pixi now loads it for HJ. Final runtime target: `assets/runtime/fk2/avatar-hj-octopus.webp`. |
| `assets/avatars/seat-turtle.png` | 512 x 512 | Implemented in Pixi prototype | Transparent live avatar. Pixi now loads it for CO. Final runtime target: `assets/runtime/fk2/avatar-co-turtle.webp`. |
| `assets/avatars/seat-blue-shark.png` | 512 x 512 | Implemented in Pixi prototype | Transparent live avatar. Pixi now loads it for BTN. Final runtime target: `assets/runtime/fk2/avatar-btn-blue-shark.webp`. |
| `assets/avatars/seat-dolphin.png` | 512 x 512 | Implemented in Pixi prototype | Transparent live avatar. Pixi now loads it for SB. Final runtime target: `assets/runtime/fk2/avatar-sb-dolphin.webp`. |
| `assets/avatars/seat-angler.png` | 512 x 512 | Implemented in Pixi prototype | Transparent live avatar. Pixi now loads it for BB. Final runtime target: `assets/runtime/fk2/avatar-bb-angler.webp`. |
| `assets/avatars/fishkiller-avatar-sheet.png` | 1536 x 1024 | Reference/fallback only | Transparent fallback sprite sheet. Not used by Pixi yet. |

## Seat Chrome Assets

| Asset | Dimensions | Status | Notes |
| --- | ---: | --- | --- |
| `assets/FKSeat/FKFrame_transparent.png` | 1354 x 685 | Implemented in Pixi prototype | Transparent combined right-facing seat shell. Pixi now loads it for right-facing seat chrome. Final runtime target: `assets/runtime/fk2/seat-frame-right.png`. |
| `assets/FKSeat/FKFrameLeft_transparent.png` | 1309 x 664 | Implemented in Pixi prototype | Transparent combined left-facing seat shell. Pixi now loads it for left-facing seat chrome. Final runtime target: `assets/runtime/fk2/seat-frame-left.png`. |
| `assets/FKSeat/FKHero_transparent.png` | 1076 x 1116 | Needs testing | Transparent hero seat shell/medallion. Needs layout testing before use. |
| `assets/FKSeat/FKBorder_transparent.png` | 1069 x 1087 | Reference candidate | Transparent medallion/ring source. Candidate for later texture pass. |
| `assets/FKSeat/FKPos_transparent.png` | 1459 x 452 | Reference candidate | Transparent position plaque. Not used in the current combined-shell strategy. |
| `assets/FKSeat/FKStat_transparent.png` | 1610 x 420 | Reference candidate | Transparent status plaque. Not used in the current combined-shell strategy. |
| `assets/fk2_medallion_ring_normal.png` | 148 x 148 | Ready for prototype | Small transparent medallion ring. Candidate for lightweight Pixi ring texture. |
| `assets/fk2_position_plaque_blank.png` | 132 x 46 | Ready for prototype | Small transparent position plaque. Candidate for lightweight Pixi plaque texture. |
| `assets/fk2_position_plaque_blank_left.png` | 132 x 46 | Ready for prototype | Small transparent left plaque. Candidate for lightweight Pixi plaque texture. |
| `assets/fk2_status_plaque_blank.png` | 118 x 36 | Ready for prototype | Small transparent status plaque. Candidate for lightweight Pixi plaque texture. |

Older top-level `FKFrame.png`, `FKFrameLeft.png`, `FKHero.png`, `FKPos.png`, and `FKBorder.png` are not suitable for Pixi rendering because they do not have alpha and would create rectangular artifacts.

## Missing Production Assets

| Need | Target Runtime Filename(s) | Status | Current Pixi Fallback |
| --- | --- | --- | --- |
| Production seat frames | `seat-frame-right.png`, `seat-frame-left.png`, optional hero variants | Prototype implemented; final runtime files missing | Pixi loads `assets/FKSeat/FKFrame_transparent.png` and `assets/FKSeat/FKFrameLeft_transparent.png`, with primitive fallback if texture loading fails. |
| Active/folded seat overlays | `seat-glow-active.png`, `seat-glow-folded.png` | Missing | Pixi uses primitive glow/dimming. |
| Matched avatar runtime set | `avatar-utg-shark.webp`, `avatar-hj-octopus.webp`, `avatar-co-turtle.webp`, `avatar-btn-blue-shark.webp`, `avatar-sb-dolphin.webp`, `avatar-bb-angler.webp` | Prototype implemented; final runtime files missing | Pixi loads the existing `assets/avatars/seat-*.png` portraits into circular masks, with primitive fill fallback if texture loading fails. |
| Card face atlas | `cards-atlas.webp`, `cards-atlas.json` | Missing | Pixi renders card-like primitives with rank/suit text, bevels, and shadows. |
| Card back texture | `card-back-fk2.webp` | Missing | Not needed yet for hero-card display. |
| Card contact shadow | `card-shadow.png` | Missing | Pixi uses primitive card shadow shapes. |
| Chip stack / pot pile props | `chip-stack-small.webp`, `chip-stack-medium.webp`, `chip-stack-large.webp`, `chip-pile-pot.webp` | Missing | Pixi renders small layered chip primitives near the pot. |
| Dealer button prop | `dealer-button.webp` | Missing | Not rendered yet. |
| Chip contact shadow | `chip-shadow.png` | Missing | Pixi uses primitive chip shadow shapes. |
| Action icons for Fold / Call / Raise / 3-bet / 4-bet / Jam / Squeeze | Future DOM/Pixi icon set | Missing | DOM action buttons still own action controls. |
| HUD icons/textures | Future DOM/Pixi icon set | Missing | DOM HUD still owns session stats. |
| Board/community-card texture slots | Uses `cards-atlas.webp` plus board slot coordinates | Missing | Not modeled in Pixi yet. |
| Correct/incorrect feedback effects | Future feedback effect set | Missing | DOM feedback dock still owns answer feedback. |

## Ready For Prototype Integration

These assets can be used to prove Pixi texture loading and placement before final art production:

1. `assets/FishKiller2.2.png` as the FK2 scene plate.
2. `assets/avatars/seat-*.png` for live avatar texture loading. These are now wired into the Pixi prototype.
3. `assets/FKSeat/FKFrame_transparent.png` and `assets/FKSeat/FKFrameLeft_transparent.png` for combined seat shell testing. These are now wired into the Pixi prototype.
4. `assets/fk2_medallion_ring_normal.png`, `assets/fk2_position_plaque_blank*.png`, and `assets/fk2_status_plaque_blank.png` for lightweight plaque/ring testing.

These prototype assets should not be renamed into final runtime paths until they pass the production style and sizing requirements in `docs/asset-production-brief.md`.

## Current Pixi Visual Strategy

- Use `assets/FishKiller2.2.png` as the FK2 scene plate.
- Load the existing DOM avatar PNGs into Pixi seat medallions, with primitive fill fallback if texture loading fails.
- Use FKSeat frame textures for Pixi seat chrome, with primitive fallback if texture loading fails.
- Use Pixi primitives for cards, chip stacks, avatar fills, and state trims in the interim.
- Avoid loading unsuitable non-alpha screenshot crops or top-level legacy FK assets into Pixi.
- Keep all poker logic and action behavior outside Pixi.

## Recommended Next Asset Slice

1. Promote or replace FKSeat frame textures and avatar portraits with final `assets/runtime/fk2/` production filenames.
2. Add final active/folded overlays once the frame/avatar pairing is stable.
3. Replace the primitive card renderer with a small generated card-face atlas.
4. Add chip/dealer-button prop textures once the pot/seat/card positions are stable.
