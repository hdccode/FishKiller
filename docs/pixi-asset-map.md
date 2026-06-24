# Pixi Asset Map

Date: 2026-06-24

Branch: `deploy-demo`

## Current Direction

Pixi is the default table renderer on `deploy-demo` with `ENABLE_PIXI_TABLE = true`.
The renderer owns the FK2 table scene while the DOM keeps the HUD, action buttons, feedback dock, range modal, and trainer controls.
The DOM table remains the reversible fallback path if `ENABLE_PIXI_TABLE` is set to `false`.

This map records which committed assets are suitable for the Pixi migration and which production assets are still missing.

See `docs/asset-production-brief.md` for the production filenames, target dimensions, transparency requirements, and style rules for the final Pixi runtime asset set.

## Pixi Default Verification - 2026-06-24

Verified repo state:

- Remote: `https://github.com/hdccode/FishKiller.git`
- Branch: `deploy-demo`
- HEAD: `fcc0d60 fix: harden Pixi default trainer flow`
- Pixi runtime: `third_party/pixi/pixi.min.mjs`
- Renderer files: `src/render/fk2-table-scene.js`, `src/render/fk2-table-state-adapter.js`, `src/render/fk2-scene-coordinates.js`

Viewport review:

| Viewport | Canvas | Status |
| --- | ---: | --- |
| 1920 x 1080 | 1 Pixi canvas | Pass. FK2 table fills the scene; primitive cards, chips, board slots, dealer button, and overlays remain visible. |
| 1440 x 900 | 1 Pixi canvas | Pass. Scene remains readable; remaining primitive assets are clearly the production gap. |
| 1366 x 768 | 1 Pixi canvas | Pass with density caution. Scene fits without scroll overflow; final assets must preserve small-desktop readability. |

Remaining primitive visuals after this review:

| Primitive Visual | Current Pixi Fallback | Final Asset Need |
| --- | --- | --- |
| Hero and future board cards | Renderer-drawn card rectangles, rank/suit text, pips, bevel, and primitive shadow | Full card face atlas, atlas JSON, card back, and reusable card shadow. |
| Chip stacks and pot pile | Renderer-drawn chip circles/stacks around pot label | Small/medium/large chip stack textures, pot pile texture, and chip shadow. |
| Dealer button | Renderer-drawn button circle with `D` text | `dealer-button.webp` with alpha, no baked seat label. |
| Board slots | Renderer-drawn five empty card slots on center felt | Empty board-slot frame, slot shadow, optional reveal highlight; filled slots should use the card atlas. |
| Active/folded/recent-action overlays | Renderer-drawn rings, dimming, and badge backing shapes | Optional overlay textures if primitives are not visually approved. |
| Pot/card/feedback pulses | Renderer-drawn transient outline/flash shapes | Optional richer pulse overlays if primitives are not visually approved. |

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

## Card Assets

| Asset | Dimensions | Status | Notes |
| --- | ---: | --- | --- |
| `assets/runtime/fk2/cards-atlas.webp` | 3120 x 1344 target | Missing; highest priority | No real card face atlas is committed yet. Pixi uses improved renderer-drawn card primitives for hero cards and would use the same primitive renderer for board cards. |
| `assets/runtime/fk2/cards-atlas.json` | N/A | Missing | No atlas metadata is committed yet. |
| `assets/runtime/fk2/card-back-fk2.webp` | 240 x 336 target | Missing | No card back is committed yet. Not needed for current hero-card display. |
| `assets/runtime/fk2/card-shadow.png` | 256 x 96 target | Missing | No reusable card shadow asset is committed yet. Pixi draws primitive shadows. |

## Board Slot Assets

| Asset | Dimensions | Status | Notes |
| --- | ---: | --- | --- |
| `assets/runtime/fk2/board-slot-empty.png` | 96 x 132 target | Missing; primitive fallback implemented | Pixi currently renders five primitive empty board slots in the center felt. |
| `assets/runtime/fk2/board-slot-shadow.png` | 128 x 48 target | Missing | Pixi currently draws primitive slot/card shadows. |
| `assets/runtime/fk2/board-slot-highlight.png` | 112 x 148 target | Optional/missing | Use only if final reveal/pulse art should exceed renderer primitives. |

## Chip And Table Prop Assets

| Asset | Dimensions | Status | Notes |
| --- | ---: | --- | --- |
| `assets/runtime/fk2/chip-stack-small.webp` | 256 x 256 target | Missing; second priority | No real chip stack asset is committed yet. Pixi uses improved renderer-drawn chip stacks around the pot. |
| `assets/runtime/fk2/chip-stack-medium.webp` | 384 x 384 target | Missing | No real medium chip stack asset is committed yet. |
| `assets/runtime/fk2/chip-stack-large.webp` | 512 x 512 target | Missing | No real large chip stack asset is committed yet. |
| `assets/runtime/fk2/chip-pile-pot.webp` | 512 x 256 target | Missing | No real pot pile asset is committed yet. Pixi uses primitive chip clusters flanking the pot label. |
| `assets/runtime/fk2/dealer-button.webp` | 128 x 128 target | Missing | No dealer-button asset is committed yet. Pixi uses a subtle primitive dealer button near the BTN seat. |
| `assets/runtime/fk2/chip-shadow.png` | 256 x 96 target | Missing | No reusable chip shadow asset is committed yet. Pixi draws primitive chip shadows. |

## Overlay Assets

| Asset | Dimensions | Status | Notes |
| --- | ---: | --- | --- |
| `assets/runtime/fk2/overlay-seat-active.png` | 384 x 384 target | Optional/missing | Pixi currently draws active-seat pulse rings. Produce only if final art direction needs textured glow. |
| `assets/runtime/fk2/overlay-seat-folded.png` | 384 x 384 target | Optional/missing | Pixi currently dims folded seats with primitive alpha/shape treatment. |
| `assets/runtime/fk2/overlay-recent-action.png` | 256 x 64 target | Optional/missing | Pixi currently draws recent-action badge backing shapes and renderer text. |
| `assets/runtime/fk2/overlay-feedback-correct.png` | 1600 x 900 target | Optional/missing | Pixi currently draws full-table correct flash primitives. |
| `assets/runtime/fk2/overlay-feedback-mixed.png` | 1600 x 900 target | Optional/missing | Pixi currently draws full-table mixed flash primitives. |
| `assets/runtime/fk2/overlay-feedback-wrong.png` | 1600 x 900 target | Optional/missing | Pixi currently draws full-table wrong flash primitives. |

## Missing Production Assets

| Need | Target Runtime Filename(s) | Status | Current Pixi Fallback |
| --- | --- | --- | --- |
| Production seat frames | `seat-frame-right.png`, `seat-frame-left.png`, optional hero variants | Prototype implemented; final runtime files missing | Pixi loads `assets/FKSeat/FKFrame_transparent.png` and `assets/FKSeat/FKFrameLeft_transparent.png`, with primitive fallback if texture loading fails. |
| Active/folded seat overlays | `seat-glow-active.png`, `seat-glow-folded.png` | Missing | Pixi uses primitive glow/dimming. |
| Matched avatar runtime set | `avatar-utg-shark.webp`, `avatar-hj-octopus.webp`, `avatar-co-turtle.webp`, `avatar-btn-blue-shark.webp`, `avatar-sb-dolphin.webp`, `avatar-bb-angler.webp` | Prototype implemented; final runtime files missing | Pixi loads the existing `assets/avatars/seat-*.png` portraits into circular masks, with primitive fill fallback if texture loading fails. |
| Card face atlas | `cards-atlas.webp`, `cards-atlas.json` | Missing; primitive fallback improved | Pixi renders deck-like primitives with suit-colored corner labels, suit pips, bevels, and shadows. |
| Card back texture | `card-back-fk2.webp` | Missing | Not needed yet for hero-card display. |
| Card contact shadow | `card-shadow.png` | Missing; primitive fallback improved | Pixi uses primitive card shadow shapes. |
| Chip stack / pot pile props | `chip-stack-small.webp`, `chip-stack-medium.webp`, `chip-stack-large.webp`, `chip-pile-pot.webp` | Missing; primitive fallback improved | Pixi renders layered chip-stack primitives around the pot label. |
| Dealer button prop | `dealer-button.webp` | Missing; primitive fallback implemented | Pixi renders a subtle primitive dealer button near the BTN seat. |
| Chip contact shadow | `chip-shadow.png` | Missing; primitive fallback improved | Pixi uses primitive chip shadow shapes. |
| Action icons for Fold / Call / Raise / 3-bet / 4-bet / Jam / Squeeze | Future DOM/Pixi icon set | Missing | DOM action buttons still own action controls. |
| HUD icons/textures | Future DOM/Pixi icon set | Missing | DOM HUD still owns session stats. |
| Board/community-card texture slots | Uses `cards-atlas.webp` plus board slot coordinates | Primitive slots implemented; production assets missing | Pixi renders five primitive empty slots; filled board cards should use the card atlas when postflop state is QA-ready. |
| Correct/mixed/incorrect feedback effects | Future feedback effect set | Primitive fallback implemented | DOM feedback dock owns feedback text; Pixi supports primitive table flash overlays. |

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
- Use improved Pixi primitives for hero cards, board slots, chip stacks, dealer button, avatar fills, action badges, feedback flashes, and state trims in the interim.
- Avoid loading unsuitable non-alpha screenshot crops or top-level legacy FK assets into Pixi.
- Keep all poker logic and action behavior outside Pixi.

## Recommended Next Asset Slice

1. Replace the primitive card renderer with a full card-face atlas, atlas metadata, card back, and card shadow.
2. Add chip stack, pot pile, dealer button, and chip shadow textures.
3. Replace primitive board slots and confirm filled board-card rendering uses the same card atlas.
4. Add active/folded/recent-action/feedback overlay textures only if primitive effects are not approved.
5. Promote or replace FKSeat frame textures and avatar portraits with final `assets/runtime/fk2/` production filenames after the high-visibility card/chip gaps are closed.
