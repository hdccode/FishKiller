# Visual QA Notes After Polish Pass 1

Date: 2026-06-15  
Branch: `deploy-demo`  
Checked commit: `d4c57d7 style: unify trainer visual tokens and panels`

## Screenshots Checked

Generated with headless Edge against the local `server.js` app:

- `.tmp-edge-cdp-visual-qa/screenshots/trainer-1920x1080.png`
- `.tmp-edge-cdp-visual-qa/screenshots/trainer-1440x900.png`
- `.tmp-edge-cdp-visual-qa/screenshots/trainer-1366x768.png`
- `.tmp-edge-cdp-visual-qa/screenshots/range-modal-1440x900.png`

These screenshots are local QA artifacts and are intentionally not committed.

## Layout Balance Issues

- The FK2 scene is visually strongest at `1440x900`; table, seats, HUD, actions, and feedback read as one coherent product screen.
- At `1920x1080`, the scene background visibly repeats/tiles at the far right edge. This is the most obvious desktop-stage regression and makes the luxury room feel like a wallpaper rather than one authored scene.
- At `1366x768`, the bottom stack is cramped. Action buttons remain usable, but the raise button description is partly obscured by the lower dock/viewport pressure.
- The feedback dock is readable, but it competes for height on the shortest tested viewport.
- The automatic fullscreen prompt/toast appears in all captured trainer screenshots and blocks the lower-right controls. This is not part of the intended visual hierarchy and should not appear during normal desktop QA.

## Avatar And Sprite Integration Issues

- The combined FK seat shells are back to the right general direction: premium, brass, and more cohesive than the plain fallback seats.
- Folded seats become too low contrast in some positions, especially top rail seats against the darker bookshelf/fireplace background.
- Seat status text is readable at `1920x1080` and `1440x900`, but it is very small at `1366x768`.
- The hero cards are correctly attached to the hero seat rather than occupying the center felt. This preserves the center table area for future community cards.
- In some hero positions, the hole cards sit far outside the table rail. They remain readable, but they feel more like UI overlays than physical cards near the player.

## Action Button Hierarchy

- The pass 1 tokens improved consistency: Fold/Call/3-bet buttons now share warmer glass, shadow, and border language.
- Button hierarchy is clear: icons, labels, and descriptions read well on `1440x900`.
- At `1366x768`, button height and description copy are too ambitious for the available vertical space. This should be handled with a compact desktop breakpoint rather than layout redesign.
- The action row feels premium enough for this pass, but future icon assets would still be better than the current inline SVG marks.

## Card Readability

- Hole cards are high contrast and easy to read across all three viewport sizes.
- The card shadows are consistent with the current token pass.
- Cards can feel slightly detached from the seat chrome because they sit outside the shell rather than on a small local card tray or contact shadow.
- No center-felt preflop hole-card regression was observed.

## HUD Readability

- HUD typography and session stats are readable at all tested sizes.
- The top HUD is visually consistent after tokenization, with less mismatch between brand, progress, and stats surfaces.
- At `1366x768`, the HUD is close to the practical minimum height. Avoid making it taller in future passes.
- The FK1/FK2 toggle is compact and does not dominate.

## Modal And Range Table Consistency

- The range modal opens and remains functional.
- The modal uses the warmer token language, but it still reads more like a web overlay than part of the FK2 room.
- Matrix cells are readable, but dense. Small frequency labels become tiring at laptop scale.
- The modal scrollbar is visually raw/bright compared with the luxury surface treatment.
- The legend and range colors are understandable, but they should eventually share the same muted action palette as the main buttons.

## Obvious Regressions

- No gameplay, action availability, or hero-card placement regression was observed from the screenshots.
- No new black slab behind the action row was observed.
- No rectangular seat artifact/checkerboard regression was observed.
- The main visible regression is environmental: the FK2 background repeats at wide desktop widths.
- The fullscreen-blocked toast obscures UI in QA captures and should be treated as a product polish issue.

## Recommended Next 3 Visual Fixes

1. Fix FK2 scene background sizing/repeat behavior.
   - Ensure the room/table image never tiles at wide desktop widths.
   - Use a single centered, non-repeating scene plate with a safe fallback fill at extreme aspect ratios.

2. Add a compact desktop breakpoint for `1366x768`.
   - Reduce action button height and description size slightly.
   - Tighten the feedback dock height.
   - Preserve the current layout while preventing button-copy clipping.

3. Replace automatic fullscreen-blocked toast behavior with a quieter desktop treatment.
   - Avoid showing a persistent toast over the trainer controls when fullscreen is denied.
   - Prefer an optional fullscreen control or silent failure after the user enters the app.
