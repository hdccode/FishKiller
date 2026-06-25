# Pixi Scaffold QA Notes

Date: 2026-06-16

Branch: `deploy-demo`

## Scope

This QA pass temporarily enabled `ENABLE_PIXI_TABLE` locally to inspect the disabled PixiJS table-scene scaffold. The committed code must keep `ENABLE_PIXI_TABLE = false`.

Checked desktop viewports:

- 1920 x 1080
- 1440 x 900
- 1366 x 768

## FKBack3 Pixi Framing QA - 2026-06-25

Decision: pass. Keep Pixi as the default with `ENABLE_PIXI_TABLE = true`.

Implementation:

- Kept the committed `assets/runtime/fk2/FKBack3.png` background.
- Added a Pixi scene frame/camera setting in `src/render/fk2-scene-coordinates.js`: `zoom: 1.18`, `offsetX: 0`, `offsetY: 34`.
- Updated `src/render/fk2-table-scene.js` so the Pixi world applies the scene-frame zoom and offset after responsive stage fitting.
- Retained the FKBack3 seat, board, pot, and per-seat hero-card coordinate set; the zoomed frame now brings the lower seats closer to the action row without changing the DOM button layout.

Viewport QA:

- 1920 x 1080: pass. One Pixi canvas mounted; table remains centered; FKBack3 fills more of the stage; lower seats are closer to the action row; board/pot stay centered on felt; hero cards do not cover labels.
- 1440 x 900: pass. One Pixi canvas mounted; zoomed crop stays balanced; lower seat chrome is anchored to the chair backs; board slots and pot/chips remain readable.
- 1366 x 768: pass with density caution. One Pixi canvas mounted; table scene is tighter vertically, answer controls stay below the stage, and hero cards remain clear of seat labels.

QA artifacts:

- Final screenshots were captured under `.tmp/fkback3-frame-qa/`.

## FKBack3 Pixi Background QA - 2026-06-25

Decision: pass. Keep Pixi as the default with `ENABLE_PIXI_TABLE = true`.

Implementation:

- Added `assets/runtime/fk2/FKBack3.png` as the active Pixi background.
- Updated `src/render/fk2-table-scene.js` to load `assets/runtime/fk2/FKBack3.png`.
- Retuned `src/render/fk2-scene-coordinates.js` for the FKBack3 table: six seats align with the chairs/table edge, board slots sit centered on the felt, pot/chip primitives sit below the board, and hero-card offsets are now per-seat.

Viewport QA:

- 1920 x 1080: pass. One Pixi canvas mounted; FKBack3 rendered; seats align with the visible chairs/table edge; board slots and pot/chips sit on the felt; side hero cards clear the seat plaques.
- 1440 x 900: pass. One Pixi canvas mounted; FKBack3 framing remains stable; board/pot/card placement is readable; answer controls stay below the stage.
- 1366 x 768: pass with density caution. One Pixi canvas mounted; scene remains aligned without incoherent overlap; trainer controls are tight but usable below the stage.

Remaining primitive visuals:

1. Card faces, card backs, and card shadows still use renderer primitives.
2. Chip stacks, pot pile, and chip shadows still use renderer primitives.
3. Board slot frames and slot shadows still use renderer primitives.
4. Dealer button still uses a renderer primitive.
5. Active/folded/recent-action/feedback overlays still use renderer primitives.

QA artifacts:

- Final screenshots were captured under `.tmp/fkback3-qa/`.
- Server returned HTTP 200 for `/` and `assets/runtime/fk2/FKBack3.png`.

## Pixi Local Default Trial - 2026-06-18

Decision: pass. Pixi can be committed as the local default with `ENABLE_PIXI_TABLE = true`.

Pixi default QA:

- 1920 x 1080: pass. One Pixi canvas mounted, start hand rendered, answer feedback appeared, range modal opened, continue advanced the session, and session summary opened.
- 1440 x 900: pass. One Pixi canvas mounted and the full trainer flow completed with correct/correction feedback states observed.
- 1366 x 768: pass. One Pixi canvas mounted and the full trainer flow completed; layout remains dense but usable.

Fallback verification:

- `ENABLE_PIXI_TABLE` was temporarily restored to `false`.
- DOM fallback QA at 1920 x 1080, 1440 x 900, and 1366 x 768 showed zero Pixi canvases and a usable trainer flow.
- Start hand, answer feedback, range-table modal, continue, and session summary remained functional through the DOM renderer.

Notes:

- Pixi loaded from `/third_party/pixi/pixi.min.mjs`; the previous CDN/network blocker did not recur.
- Browser output only showed headless/software WebGL warnings during Pixi QA.
- The automated helper can mislabel an intended "correct" answer when strategy frequencies are all zero, so exact answer-grading semantics still need human spot checks. This did not block the renderer default trial because both Pixi and DOM flows remained interactive and stable.

Remaining visual blockers:

1. Primitive card and chip visuals still need production assets or final approval.
2. Postflop board-card states still need live three-, four-, and five-card QA.
3. 1366 x 768 should receive a human readability pass after longer repeated sessions.

## Pixi Default Hardening QA - 2026-06-18

Decision: pass. Keep Pixi as the default with `ENABLE_PIXI_TABLE = true`.

Pixi repeated-hand QA:

- 1920 x 1080: pass. Completed 10 hands, mounted one Pixi canvas, checked answer feedback, opened the range modal, continued through all hands, and reached `Success review.`
- 1440 x 900: pass. Completed 10 hands, mounted one Pixi canvas, checked answer feedback, opened the range modal, continued through all hands, and reached `Success review.`
- 1366 x 768: pass. Completed 10 hands, mounted one Pixi canvas, checked answer feedback, opened the range modal, continued through all hands, and reached `Success review.`

Console result:

- No console errors or page errors at any viewport.
- Browser warnings were limited to headless/software WebGL and `ReadPixels` performance warnings.

Fallback verification:

- `ENABLE_PIXI_TABLE` was temporarily set to `false`.
- DOM fallback completed 10 hands at 1920 x 1080, 1440 x 900, and 1366 x 768.
- DOM fallback showed zero Pixi canvases, opened the range modal, continued through all hands, reached `Success review.`, and produced no console warnings/errors.

Bugs found/fixed:

- No committed app bugs were found.
- The ignored QA helper was adjusted to choose the highest-frequency action from `question.strategy.actions`, so the repeated-hand pass reliably reaches all 10 hands instead of ending early on accumulated mistakes.

## Pixi Promotion Readiness Review - 2026-06-18

Recommendation: no local default trial yet. Keep the DOM table as the production default and continue Pixi behind `ENABLE_PIXI_TABLE = false`.

Result: fail/inconclusive for actual Pixi promotion readiness, pass for DOM fallback safety.

Full trainer flow checked at:

- 1920 x 1080
- 1440 x 900
- 1366 x 768

DOM fallback findings:

- Start hand, answer action, incorrect/correction feedback, continue, range-table modal, and session-summary flow all completed at the checked viewports.
- Correct-feedback behavior was observed during the automated flow at 1440 x 900 and 1366 x 768.
- The 1920 x 1080 correct-answer attempt landed on another correction state due to helper answer selection, so the flow mechanics passed but that specific correct-feedback color/state needs a live manual recheck.
- The range table modal opened and closed without stage/layout interference.
- Session summary opened after the automated failure-review path.

Pixi-enabled findings:

- Pixi could not be promotion-reviewed in this run because the runtime module fetch was blocked: `https://cdn.jsdelivr.net/npm/pixi.js@8.8.1/dist/pixi.mjs` returned `net::ERR_NETWORK_ACCESS_DENIED`.
- The app failed safely: the Pixi renderer warning was logged, `.pixi-table-enabled` was removed, and the DOM fallback stayed visible and usable.
- No Pixi canvas mounted in the checked Pixi-enabled run, so active-seat pulse, answer flash, pot pulse, card pulse, and board-slot behavior were not verified with actual Pixi rendering.

Blockers before local default trial:

1. Make the Pixi runtime dependency local/offline-safe, or otherwise prove the pinned Pixi module can load reliably in the target QA/runtime environment.
2. Rerun the full trainer flow with an actual Pixi canvas mounted at 1920 x 1080, 1440 x 900, and 1366 x 768.
3. Verify live correct, mixed, and incorrect feedback flashes during actual answer transitions.
4. Verify pot/card pulse timing and postflop board slots with real state transitions.
5. Replace or formally approve the remaining primitive card/chip visuals before production promotion.

Next step: do not begin a local Pixi default trial yet. First make Pixi loading independent of external CDN availability, then rerun this promotion-readiness flow against the actual Pixi renderer.

## Local Pixi Runtime QA - 2026-06-18

Result: pass for removing the CDN dependency. `ENABLE_PIXI_TABLE` remains `false` in committed code.

Implementation:

- Vendored the installed Pixi ESM runtime to `third_party/pixi/pixi.min.mjs`.
- Updated `src/render/fk2-table-scene.js` to import the vendored module instead of `cdn.jsdelivr.net`.
- Added `.mjs` to the local server MIME map so browser dynamic imports are served as JavaScript modules.
- Added a narrow `.gitignore` exception so only the local Pixi runtime file is tracked under `third_party/pixi/`.

QA target:

- 1920 x 1080
- 1440 x 900
- 1366 x 768

Validation result:

- Pixi-enabled full-flow QA mounted one canvas at 1920 x 1080, 1440 x 900, and 1366 x 768.
- Start hand, answer action, correction feedback, range-table modal, continue, and session-summary flow completed with Pixi active.
- The original CDN fetch error did not recur; the only browser messages were headless/software WebGL warnings.
- DOM fallback remains the committed default when `ENABLE_PIXI_TABLE = false`.

## Polished Placeholder Manual QA - 2026-06-17

Result: pass for the disabled polished-placeholder scaffold, with Pixi still not ready for promotion. `ENABLE_PIXI_TABLE` was temporarily set to `true` for inspection and restored to `false` before validation and commit.

Captured viewport checks:

- 1920 x 1080: pass. Stage fills the table area, hero cards are readable, seat plaques and action labels are legible, pot/chip placeholders are centered, and action controls remain below the stage without overlap.
- 1440 x 900: pass. Stage fits cleanly, card labels remain readable, plaques stay attached to seats, pot/chips remain readable, and the bottom action row is not collided with the Pixi scene.
- 1366 x 768: pass with caution. Stage still fits and cards/labels remain readable, but the overall UI is dense and the bottom feedback band has little vertical breathing room.

Checklist:

- Card readability: pass for placeholder rank/suit cards at all checked sizes.
- Seat plaques: pass for position plaques and status plaques at all checked sizes.
- Pot/chips: pass for placeholder pot badge and chip stacks at all checked sizes.
- Active/folded states: pass after a small Pixi-only fix. Folded seats now render `Folds` instead of inheriting a temporary `Waiting` caption from the animation-masked DOM state.
- Action labels: pass for opener/limp/action labels, with truncation still expected on very long labels.
- Stage fit: pass at 1920 x 1080, 1440 x 900, and 1366 x 768.

Tiny visual fix applied:

- `src/render/fk2-table-scene.js` now prioritizes the folded-seat state when building Pixi seat captions, so folded seats display `Folds` consistently.

Top five remaining issues before promoting Pixi mode:

1. Pixi still uses generic medallion/plaque primitives instead of the production avatar and seat chrome assets.
2. Card faces are still drawn placeholders, not production card textures.
3. Pot/chip visuals are placeholder primitives and need real chip art or a final visual spec.
4. Pixi still has no explicit board/community-card slots for postflop table scenes.
5. The 1366 x 768 layout is usable but tight; final Pixi promotion should include a denser small-desktop layout pass for the surrounding DOM controls.

QA tooling notes:

- Playwright was already installed in the repo; no extra screenshot software was downloaded.
- The local browser needed network access to load `https://cdn.jsdelivr.net/npm/pixi.js@8.8.1/dist/pixi.mjs`, because Pixi is currently CDN-loaded only when the temporary flag is enabled.
- Fresh screenshots were captured under the ignored `.tmp-edge-cdp-pixi-qa/screenshots/` folder.

## Seat Frame Texture QA - 2026-06-17

Result: pass for the first real Pixi seat chrome integration. `ENABLE_PIXI_TABLE` was temporarily set to `true` for inspection and restored to `false` before validation and commit.

Checked desktop viewports:

- 1920 x 1080
- 1440 x 900
- 1366 x 768

Findings:

- Pixi now loads `assets/FKSeat/FKFrame_transparent.png` and `assets/FKSeat/FKFrameLeft_transparent.png` for right/left seat chrome.
- Position labels, action/status labels, hero state, acting state, and folded state remain readable on top of the frame textures.
- The renderer keeps primitive avatar fills for now; avatar portraits are intentionally not integrated in this pass.
- Primitive fallback remains available if the frame textures fail to load.
- The 1366 x 768 viewport remains dense but usable, with no table-stage collision from the frame textures.

## Avatar Texture QA - 2026-06-17

Result: pass for the first Pixi avatar portrait integration. `ENABLE_PIXI_TABLE` was temporarily set to `true` for inspection and restored to `false` before validation and commit.

Checked desktop viewports:

- 1920 x 1080
- 1440 x 900
- 1366 x 768

Findings:

- Pixi now loads the consistent `assets/avatars/seat-*.png` portrait set and clips each portrait inside the existing FKSeat medallion frame.
- The loose `ChatGPT Image...` avatar source files and `fishkiller-avatar-sheet.png` remain reference/fallback assets and were not wired into Pixi.
- Hero, acting, and folded states remain readable over the portrait treatment.
- Folded seats keep visible portraits with dimming plus a readable `Folds` caption.
- Primitive avatar fills remain the fallback if any portrait texture fails to load.
- The 1366 x 768 viewport remains tight but usable, with no new overlap from avatar portraits.

## Card Primitive QA - 2026-06-17

Result: pass for improved Pixi hero-card primitives. `ENABLE_PIXI_TABLE` was temporarily set to `true` for inspection and restored to `false` before validation and commit.

Checked desktop viewports:

- 1920 x 1080
- 1440 x 900
- 1366 x 768

Findings:

- No real card deck, card atlas, card back, or reusable card-shadow assets are currently committed.
- Pixi hero cards now use a more deck-like primitive renderer with suit-colored corner labels, suit pips, bevels, and contact shadows.
- Hero cards remain beside the hero seat and do not move into the center-felt/community-card area.
- Red and black suit labels remain readable at all checked desktop sizes.
- The 1366 x 768 viewport remains tight but usable, with no new overlap from the card primitive changes.

## Chip And Table Prop QA - 2026-06-17

Result: pass for improved Pixi chip/pot primitives and a subtle primitive dealer button. `ENABLE_PIXI_TABLE` was temporarily set to `true` for inspection and restored to `false` before validation and commit.

Checked desktop viewports:

- 1920 x 1080
- 1440 x 900
- 1366 x 768

Findings:

- No real chip stack, pot pile, dealer button, or chip-shadow assets are currently committed.
- Pixi now renders richer layered chip-stack primitives around the centered pot badge.
- Pot text remains centered and readable at all checked desktop sizes.
- A small primitive dealer button renders near the BTN seat without overlapping hero cards, seat plaques, or action labels in the checked views.
- The 1366 x 768 viewport remains tight but usable, with no new stage collision from chip or dealer-button props.

## DOM Versus Pixi Default Decision - 2026-06-17

Recommendation: continue Pixi behind the feature flag and keep the DOM table as the production default. Do not make Pixi default yet.

`ENABLE_PIXI_TABLE` was kept `false` for the DOM capture pass, temporarily set to `true` for Pixi capture, then restored to `false` before validation and commit.

Captured viewport checks:

- 1920 x 1080: DOM pass; Pixi no-go. The DOM table renders the full production seat/card/pot treatment. The Pixi canvas mounted, but this capture showed the FK2 background without the Pixi seat/card/chip layer, which is a promotion blocker until the startup/render race is understood.
- 1440 x 900: DOM pass; Pixi partial pass. DOM has stronger production polish, larger readable avatars/cards, and stable seat plaque alignment. Pixi renders seats, avatars, hero cards, chips, pot, and dealer button, but the whole table reads smaller and more placeholder-like.
- 1366 x 768: DOM pass; Pixi partial pass. DOM remains dense but readable. Pixi fits without action-row collision, but seat labels/cards/chips are noticeably smaller and the background contain crop is less composed.

Comparison:

- Overall professionalism: DOM wins. It looks like the current product surface; Pixi is atmospheric and promising, but still reads as an in-progress renderer.
- Alignment/stability: DOM wins. DOM seat plaques, cards, pot, and action controls stayed stable across all captures. Pixi mounted correctly at all sizes, but the 1920 x 1080 blank-layer capture and smaller table scale keep it behind the flag.
- Avatar/card/chip quality: DOM wins today. Pixi has real avatars and seat frames, but cards and chips are still primitives and the overall scale makes them less confident than the DOM treatment.
- Readability: DOM wins. Pixi labels are readable in the successful 1440 x 900 and 1366 x 768 captures, but they are smaller and less comfortable than DOM.
- Action-state parity: partial. Pixi displays hero, folded, waiting, and action captions, but the DOM renderer still owns the established animation/state behavior and should remain the reference until Pixi consumes a shared renderer-state adapter.
- Remaining blockers: Pixi has not reached default-readiness because of the intermittent blank-layer capture, primitive card/chip assets, no community-card/board slots, smaller responsive composition, and incomplete renderer-state/action-animation parity.

Exact blockers before changing the default:

1. Fix the intermittent Pixi startup/render issue that produced a 1920 x 1080 canvas with background only and no seats/cards/chips.
2. Tune Pixi stage scale and seat/card offsets so 1440 x 900 and 1366 x 768 have DOM-level readability instead of a noticeably smaller table.
3. Replace primitive card and chip rendering with production-quality assets or a final renderer-native visual spec.
4. Add explicit community-card/board slots before Pixi is used beyond preflop hero-card scenes.
5. Move state normalization, action captions, and animation events into a shared renderer adapter so DOM and Pixi can be verified against the same table state.

QA artifact paths:

- DOM screenshots: `.tmp-edge-cdp-pixi-qa/screenshots/dom-1920x1080.png`, `.tmp-edge-cdp-pixi-qa/screenshots/dom-1440x900.png`, `.tmp-edge-cdp-pixi-qa/screenshots/dom-1366x768.png`
- Pixi screenshots: `.tmp-edge-cdp-pixi-qa/screenshots/pixi-1920x1080.png`, `.tmp-edge-cdp-pixi-qa/screenshots/pixi-1440x900.png`, `.tmp-edge-cdp-pixi-qa/screenshots/pixi-1366x768.png`

## Pixi First-Render Stability Check - 2026-06-18

Recommendation remains unchanged: keep the DOM table as the production default and continue Pixi behind `ENABLE_PIXI_TABLE = false`.

Findings:

- The 1920 x 1080 issue reproduced as a capture-timing problem in the ignored Playwright helper, not as a gameplay or committed renderer-state failure.
- On a cold Pixi run, the first 1920 x 1080 capture can happen before the CDN Pixi module finishes loading and before the canvas is mounted. The helper reported `.pixi-table-scene` visible but `canvasCount: 0`.
- Later viewports in the same run mounted a canvas successfully, consistent with the module/assets being warm after the first viewport.
- The committed app already keeps the DOM table visible until `renderTableScene(...)` resolves and only then applies `.pixi-table-enabled`, so a slow Pixi load should not replace the DOM fallback with a blank user-facing stage.
- No app code fix was committed because the root cause sits in ignored QA tooling. The durable fix is to make the Pixi capture helper wait for `#pixi-table-scene canvas` and at least one settled animation frame before screenshotting.
- A subsequent warmed Pixi QA run did mount a 1920 x 1080 canvas and rendered seats, avatars, hero cards, pot/chip primitives, and dealer button successfully.
- This finding does not change gameplay or make Pixi default.

QA follow-up:

- Repair or promote a tracked Pixi QA helper that waits for canvas mount instead of sleeping for a fixed timeout.
- Run the Pixi capture helper at least three consecutive times at 1920 x 1080 before considering the first-render blocker fully closed.
- Continue comparing against DOM at 1920 x 1080, 1440 x 900, and 1366 x 768.
- Treat primitive card/chip assets, postflop board-card QA, small-desktop scale, and shared renderer-state parity as remaining promotion blockers.

## Pixi Adapter And Board Slot QA - 2026-06-18

Result: pass for the first Pixi renderer-state adapter and empty board-slot support. `ENABLE_PIXI_TABLE` was temporarily set to `true` for inspection and restored to `false` before validation and commit.

Checked desktop viewports:

- 1920 x 1080
- 1440 x 900
- 1366 x 768

Findings:

- `src/render/fk2-table-state-adapter.js` now normalizes Pixi-facing seats, hero cards, board cards, pot data, actions, active seat, and folded seats.
- Pixi renders five center-felt board/community-card slots even when no board cards exist.
- Board-card primitives use the existing Pixi card renderer when `tableState.board`/`boardCards` contains community cards.
- Hero cards remain beside the hero seat and do not move into the center board area.
- Pot/chip primitives remain centered below the board slots.
- The Pixi mount is made visible before `renderTableScene(...)` measures it, which fixed the hidden-mount sizing path that produced background-only captures.
- QA captured working Pixi canvases at 1920 x 1080, 1440 x 900, and 1366 x 768. The browser still reported headless software WebGL warnings only.

Remaining blockers:

1. Card and chip visuals are still primitives, not production assets.
2. Board slots need postflop QA with actual three-, four-, and five-card boards.
3. Small-desktop composition remains usable but visually dense.
4. Animation-event parity is still not fully normalized through the adapter.
5. Pixi remains behind `ENABLE_PIXI_TABLE = false`.

## Pixi Action Feedback Animation QA - 2026-06-18

Result: pass for first Pixi action badges and safe visual animation parity hooks. `ENABLE_PIXI_TABLE` was temporarily set to `true` for inspection and restored to `false` before validation and commit.

Checked desktop viewports:

- 1920 x 1080
- 1440 x 900
- 1366 x 768

Findings:

- Pixi now renders compact recent-action badges for meaningful action labels such as opens, calls, raises, 3-bets, 4-bets, jams, squeezes, and iso-raises.
- Routine `Waiting`, `Hero to act`, and non-recent folded captions do not get duplicate action badges, which keeps 1366 x 768 readable.
- Active seats receive a subtle ticker-driven pulse around the avatar/frame.
- Pot, hero-card, board-card, and feedback flashes are driven from safe previous-vs-current render signatures and no-op when prior state is unavailable.
- Correct, mixed, and wrong feedback flashes are supported through normalized `feedbackState`; screenshot QA did not force an answered state, so interaction QA should still verify the live flash colors.
- Pot/card pulses are short-lived overlays; still screenshots mainly verify that their setup does not destabilize layout.
- QA captured working Pixi canvases at 1920 x 1080, 1440 x 900, and 1366 x 768. The browser reported headless software WebGL warnings only.

Remaining blockers:

1. Live answer interaction QA should verify correct, mixed, and wrong flashes during actual answer transitions.
2. Pot/card pulse timing should be checked with real state transitions, not only static screenshot capture.
3. Card and chip visuals are still primitives, not production assets.
4. Board slots still need postflop QA with actual three-, four-, and five-card boards.
5. Pixi remains behind `ENABLE_PIXI_TABLE = false`.

## What Works

- The Pixi scaffold loads and renders when `ENABLE_PIXI_TABLE` is temporarily set to `true`.
- The canvas mounts inside `#pixi-table-scene` within the existing `.table-stage`.
- The feature flag correctly hides the DOM table only while Pixi mode is enabled.
- The Pixi layer receives the existing `tableState` from `app.js`.
- State-fed placeholders render:
  - FK2 room/table scene background
  - six tuned seat placeholders
  - position labels
  - status/action labels
  - pot label
  - hero-card placeholders beside the hero seat
- After restoring `ENABLE_PIXI_TABLE = false`, the DOM table fallback is visible again and the existing trainer view continues to load.

## Scaling Fix QA Update

After adding the centered contain transform in `src/render/fk2-table-scene.js`, the Pixi stage was checked again at:

- 1920 x 1080
- 1440 x 900
- 1366 x 768

Updated results:

- The Pixi renderer now resizes its renderer to the mount dimensions instead of stretching the 1600 x 900 drawing through CSS alone.
- The logical 1600 x 900 world is scaled with `min(mountWidth / 1600, mountHeight / 900)` and centered in the mount.
- The placeholder table no longer collides with the action row at 1440 x 900 or 1366 x 768.
- The canvas remains stable across the checked desktop viewports.
- Hero cards now render as clean rank/suit text rather than object text.
- Restoring `ENABLE_PIXI_TABLE = false` returns the app to the DOM fallback table.

## Renderer Parity QA Update

After the Pixi scene-background pass, the renderer was checked again at:

- 1920 x 1080
- 1440 x 900
- 1366 x 768

Updated results:

- Pixi now keeps the clean `assets/FishKiller2.2.png` scene background rather than drawing a dark box or a synthetic table over the stage.
- Seat placeholders now consume the same rendered-state concepts as the DOM table: hero seat, folded seats, villain/action labels, recent villain response labels, and the single acting seat.
- Active/hero seats receive a stronger warm ring/glow; folded seats are dimmed but still readable.
- Pot text is still state-fed and remains centered in the felt area.
- Hero card labels are normalized and placed beside the current hero seat instead of in the center community-card area.
- The 1600 x 900 contain transform remains stable across all three checked desktop viewports.
- Restoring `ENABLE_PIXI_TABLE = false` returns the app to the DOM fallback table.

## Primitive Asset Polish Update

On 2026-06-17, after auditing committed FK2 assets, the Pixi renderer was moved slightly closer to production visuals without adding or replacing art:

- Card-face image assets are not present yet, so Pixi now renders more polished card-like primitives with bevels, shadows, corner rank/suit labels, and center suit marks.
- Chip/pot image assets are not present yet, so Pixi now draws small chip-stack primitives around the pot badge.
- Seat placeholders now have more layered brass medallion and plaque primitives while still avoiding avatar replacement.
- `docs/pixi-asset-map.md` records which FK2 scene, avatar, and seat chrome assets are usable, and which card/chip/HUD assets are still missing.
- `ENABLE_PIXI_TABLE` was restored to `false` after local checks.

Fresh automated screenshot capture was attempted for this pass, but the local Edge/CDP helper became unreliable in this shell and did not produce fresh screenshot files. The code/server checks below remain the validation record for this pass. The last successful visual captures still apply to background/stage scaling, but the primitive card/chip polish should receive a fresh manual or repaired-CDP visual pass before promoting Pixi mode.

## Polished Placeholder Manual QA Attempt

On 2026-06-17, Pixi was temporarily enabled locally again to QA the polished placeholder renderer at:

- 1920 x 1080
- 1440 x 900
- 1366 x 768

Result: visual pass/fail is inconclusive. `ENABLE_PIXI_TABLE` was restored to `false`, and the committed code remains DOM-table-first.

Capture/inspection attempts:

- The existing Edge/CDP helper reached the remote debugging endpoint, but Node's built-in WebSocket failed opening the DevTools page socket before screenshots could be captured.
- A second ignored temporary CDP helper was tried with `--remote-allow-origins=*`; it reached the same CDP page target but hit the same WebSocket failure.
- Edge's native headless `--screenshot` path was tried with a temporary local `?pixiQa=1` auto-start hook, but this Edge installation did not write screenshot files reliably from the shell.

Checks from code/server inspection:

- Pixi remains feature-flagged and disabled by default.
- The DOM fallback is still the only committed user-facing renderer.
- The polished placeholder renderer still uses primitives for cards, chips, and seats because production card/chip/avatar textures are not yet wired into Pixi.

Top five issues before promoting Pixi mode:

1. Visual QA tooling needs to be repaired or replaced so Pixi changes can be checked at desktop sizes without relying on stale screenshots.
2. Seat placeholders still lack live avatar textures and remain materially behind the DOM FK2 seat treatment.
3. Hero card primitives are readable in code structure, but they still need a real screenshot pass to verify size, contrast, and per-seat offsets.
4. Pot/chip primitives are useful as placeholders, but they need production chip assets or a stronger shared visual spec.
5. Pixi still has no board/community-card slots, so the center felt cannot yet support the planned postflop visual model.

## Remaining Misalignment And Visual Issues

- The renderer still uses Pixi-drawn placeholder medallions and plaques, not the production DOM seat/avatar art.
- Seat coordinates are tuned for the FK2 scene and usable, but they still need final art-direction tuning once real Pixi avatar/chrome textures are introduced.
- Hero cards are now beside the hero seat, but the exact offsets may need per-seat art tuning when real card textures replace the primitive card renderer.
- The Pixi renderer does not yet draw board/community-card slots for postflop scenes.
- The canvas scale works predictably, but Pixi still needs a shared renderer-state adapter before it can fully replace the DOM table.

## Missing Or Weak TableState Data

- Hero cards now have renderer-facing normalization in the Pixi scaffold, but this helper is local to `src/render/fk2-table-scene.js` and should eventually move into a shared adapter.
- Seat avatar art is not passed as render-ready texture data. Pixi currently draws generic circles instead of using the live avatar assets.
- Seat chrome/shell data is not represented in renderer-friendly form. The DOM renderer still owns shell selection and text placement.
- The Pixi layer now owns a fixed FK2 scene coordinate map, but there is still no shared coordinate transform between DOM percentages and Pixi stage pixels.
- Board/community-card slots are not modeled as a first-class render target yet.
- Action animation state is still DOM-specific and is not represented in a way Pixi can consume.

## DOM Fallback Check

After the temporary QA pass:

- `ENABLE_PIXI_TABLE` was restored to `false`.
- The DOM `.table-visual` renderer is visible again.
- The Pixi mount remains present but hidden/inactive.
- The local server responded with HTTP `200`.

## Next Migration Steps

1. Add a renderer-facing table-state adapter.
   Normalize cards, seats, avatar URLs, status labels, board slots, and animation events before either renderer consumes them.

2. Move avatar and seat chrome rendering into Pixi.
   Start with the same live avatar URLs and FK2 seat chrome strategy used by the DOM table, then replace the generic Pixi circles.

3. Add card texture rendering.
   Replace rank/suit text placeholders with card face textures, while keeping the current hero-card placement beside the hero seat.

4. Add community-card and pot prop slots.
   Model the center board area explicitly before using Pixi for postflop table scenes.

5. Keep DOM fallback until Pixi reaches visual parity.
   The current Pixi scaffold is useful as a mount/state proof, not as a user-facing renderer.
