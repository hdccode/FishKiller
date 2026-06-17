# Pixi Asset Production Brief

Date: 2026-06-17

Branch: `deploy-demo`

## Scope

This brief defines the real art needed before Pixi can replace its polished placeholder primitives for avatars, cards, chips, and seat frames. It is an asset-production document only:

- Do not change gameplay.
- Do not enable Pixi by default.
- Keep `ENABLE_PIXI_TABLE = false` until a later implementation/QA pass.
- Do not mix unrelated styles, legacy crops, or experimental extracted assets into the Pixi runtime set.

## Runtime Folder And Naming

Place final Pixi runtime assets under:

`assets/runtime/fk2/`

Use lowercase, hyphenated filenames. Keep source files, generation references, and alternates out of runtime paths. Suggested source/reference folders:

- `assets/source/fk2/`
- `assets/reference/fk2/`

## Style Rules

- Match the existing FK2 room: dark fantasy luxury poker room, warm amber/gold lighting, deep shadows, polished dark wood, brass, and green felt.
- All seat, avatar, card, and chip assets must look authored as one set: same lighting direction, contrast, rim light strength, edge sharpness, and material finish.
- Do not use flat cartoon, casino clipart, neon arcade, photoreal casino stock, or mismatched AI generations.
- Avoid baked text in art. Seat labels, status labels, card ranks/suits, and pot amounts stay renderer-driven unless the asset is an explicit deck atlas.
- Transparent assets must have clean premultiplied-looking edges with no rectangular matte, halos, white fringe, or baked background.
- Props need contact-shadow compatibility with the FK2 table. Prefer separate shadow assets where reusable.
- Keep readability first: cards and labels must remain legible at 1366 x 768 as well as 1920 x 1080.

## Priority Order

1. Seat frame/chrome set
   Create the minimum left/right shell assets Pixi needs to stop drawing generic medallions and plaques.
2. Avatar portrait set
   Produce or finalize six matched portraits in the same lighting/style, then wire them into the seat frames.
3. Card deck slice
   Add the full face atlas, card back, and shadow so hero cards and future board cards can leave placeholder primitives.
4. Chip and table prop set
   Add pot pile, chip stacks, dealer button, and shadows for pot display and future chip movement.
5. State overlays
   Add active/folded glow/shadow overlays only after the base frames and avatars are visually stable.

## Required Seat Frame Assets

| Filename | Target Dimensions | Format | Background | Requirement |
| --- | ---: | --- | --- | --- |
| `assets/runtime/fk2/seat-frame-right.png` | 1400 x 700 | PNG or WebP with alpha | Transparent | Right-facing combined medallion, position plaque, and status plaque shell. No avatar, no text. |
| `assets/runtime/fk2/seat-frame-left.png` | 1400 x 700 | PNG or WebP with alpha | Transparent | Mirrored/left-facing combined shell, authored rather than auto-flipped if highlights change. No avatar, no text. |
| `assets/runtime/fk2/seat-frame-hero-right.png` | 1400 x 700 | PNG or WebP with alpha | Transparent | Optional hero-emphasis right shell if CSS/Pixi glow cannot provide enough distinction. No text. |
| `assets/runtime/fk2/seat-frame-hero-left.png` | 1400 x 700 | PNG or WebP with alpha | Transparent | Optional hero-emphasis left shell. No text. |
| `assets/runtime/fk2/seat-glow-active.png` | 512 x 256 | PNG/WebP with alpha | Transparent | Soft brass/amber active glow usable behind the visible shell only. |
| `assets/runtime/fk2/seat-glow-folded.png` | 512 x 256 | PNG/WebP with alpha | Transparent | Subtle low-contrast folded shadow/glow. Must keep folded seats readable. |

Seat frame notes:

- Current committed candidates `assets/FKSeat/FKFrame_transparent.png` and `assets/FKSeat/FKFrameLeft_transparent.png` are usable references, not final Pixi runtime filenames.
- Plaque regions must be large enough for renderer text: position label width at least 132 px at current Pixi stage scale; status label width at least 104 px.
- Do not bake seat names, action labels, folded labels, or hero labels.

## Required Avatar Assets

| Filename | Target Dimensions | Format | Background | Requirement |
| --- | ---: | --- | --- | --- |
| `assets/runtime/fk2/avatar-utg-shark.webp` | 1024 x 1024 source, safe at 512 x 512 | WebP or PNG | Transparent or authored circular portrait background | Matched shark portrait for UTG. |
| `assets/runtime/fk2/avatar-hj-octopus.webp` | 1024 x 1024 source, safe at 512 x 512 | WebP or PNG | Transparent or authored circular portrait background | Matched octopus portrait for HJ. |
| `assets/runtime/fk2/avatar-co-turtle.webp` | 1024 x 1024 source, safe at 512 x 512 | WebP or PNG | Transparent or authored circular portrait background | Matched turtle portrait for CO. |
| `assets/runtime/fk2/avatar-btn-blue-shark.webp` | 1024 x 1024 source, safe at 512 x 512 | WebP or PNG | Transparent or authored circular portrait background | Matched blue-shark portrait for BTN. |
| `assets/runtime/fk2/avatar-sb-dolphin.webp` | 1024 x 1024 source, safe at 512 x 512 | WebP or PNG | Transparent or authored circular portrait background | Matched dolphin portrait for SB. |
| `assets/runtime/fk2/avatar-bb-angler.webp` | 1024 x 1024 source, safe at 512 x 512 | WebP or PNG | Transparent or authored circular portrait background | Matched angler portrait for BB. |

Avatar notes:

- Existing `assets/avatars/seat-*.png` files are ready enough for a first Pixi texture-loading pass, but they are not the final production runtime filenames.
- Each portrait must share eye-line scale, head size, rim light, shadow density, and crop safety.
- Keep faces readable inside a 92 to 120 px on-screen medallion.

## Required Card Assets

| Filename | Target Dimensions | Format | Background | Requirement |
| --- | ---: | --- | --- | --- |
| `assets/runtime/fk2/cards-atlas.webp` | 13 columns x 4 rows, 240 x 336 per card, total 3120 x 1344 | WebP or PNG | Opaque card faces inside atlas | Full 52-card face atlas in one deck style. |
| `assets/runtime/fk2/cards-atlas.json` | N/A | JSON | N/A | Atlas metadata mapping ranks/suits to frame rectangles. |
| `assets/runtime/fk2/card-back-fk2.webp` | 240 x 336 | WebP or PNG | Opaque card rectangle with transparent-safe edges optional | FK2 card back for future face-down states. |
| `assets/runtime/fk2/card-shadow.png` | 256 x 96 | PNG/WebP with alpha | Transparent | Reusable soft contact shadow for hole cards and board cards. |

Card notes:

- Use high-contrast rank/suit corners and a restrained luxury deck treatment.
- Red suits must be readable on the warm/dark FK2 scene.
- Card faces should survive display around 50 x 70 px in the current Pixi scaffold and scale up cleanly later.

## Required Chip And Prop Assets

| Filename | Target Dimensions | Format | Background | Requirement |
| --- | ---: | --- | --- | --- |
| `assets/runtime/fk2/chip-stack-small.webp` | 256 x 256 | WebP or PNG with alpha | Transparent | Small bet stack prop. |
| `assets/runtime/fk2/chip-stack-medium.webp` | 384 x 384 | WebP or PNG with alpha | Transparent | Medium bet stack prop. |
| `assets/runtime/fk2/chip-stack-large.webp` | 512 x 512 | WebP or PNG with alpha | Transparent | Large bet/jam stack prop. |
| `assets/runtime/fk2/chip-pile-pot.webp` | 512 x 256 | WebP or PNG with alpha | Transparent | Horizontal pot pile that can sit behind/near the pot label. |
| `assets/runtime/fk2/dealer-button.webp` | 128 x 128 | WebP or PNG with alpha | Transparent | Dealer button prop for BTN marker. No baked seat label. |
| `assets/runtime/fk2/chip-shadow.png` | 256 x 96 | PNG/WebP with alpha | Transparent | Reusable chip contact shadow. |

Chip notes:

- Use the FK2 palette: teal/jade, brass/gold, muted red, dark blue/slate accent. Avoid bright primary casino chips.
- Chips need readable silhouettes at small sizes; do not over-detail the edge marks.
- Pot pile must leave room for renderer text and should not obscure table action labels.

## Ready Versus Missing Summary

Ready for an integration prototype:

- `assets/FishKiller2.2.png` scene background.
- Existing transparent avatar PNGs in `assets/avatars/`.
- Existing transparent FKSeat frame references in `assets/FKSeat/`.
- Existing lightweight `fk2_*` medallion/plaque references.

Missing for production Pixi runtime:

- Final `assets/runtime/fk2/` seat frame filenames.
- Final matched avatar portrait set with runtime filenames.
- Full card atlas, atlas metadata, card back, and card shadow.
- Chip stacks, pot pile, dealer button, and chip shadow.
- Final active/folded overlays, if renderer effects are not enough.
