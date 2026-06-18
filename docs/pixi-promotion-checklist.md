# Pixi Promotion Checklist

Date: 2026-06-18

Current decision: Pixi is the local default with `ENABLE_PIXI_TABLE = true`; the DOM renderer remains the reversible fallback by setting the flag to `false`.

## Local Default Trial - 2026-06-18

Decision: pass for making Pixi the local default. `ENABLE_PIXI_TABLE` can be committed as `true` after the local runtime and full-flow checks passed.

Verification:

- Pixi default full-flow QA mounted one canvas at 1920 x 1080, 1440 x 900, and 1366 x 768.
- The trainer flow reached start hand, answer feedback, range modal, continue, and session summary with Pixi active.
- The Pixi runtime loaded from `/third_party/pixi/pixi.min.mjs`; no CDN or network fetch errors appeared.
- Browser messages were limited to headless/software WebGL warnings.
- Restoring `ENABLE_PIXI_TABLE = false` brought back the DOM fallback path with zero Pixi canvases at all three viewports, and the same trainer flow remained usable.

Remaining blockers before calling Pixi fully promoted:

- Primitive card and chip visuals still need production assets or final visual approval.
- Postflop board-card states still need real three-, four-, and five-card board QA.
- A human visual pass should confirm small-desktop density and action-label readability after repeated sessions.

## Default Hardening QA - 2026-06-18

Decision: pass. Pixi remains the default after repeated trainer-flow QA.

Verification:

- Pixi completed 10 repeated hands at 1920 x 1080, 1440 x 900, and 1366 x 768.
- Each Pixi viewport mounted one canvas, showed answer feedback, opened the range modal, advanced with continue, and reached `Success review.`
- No console errors or page errors were reported; warnings were limited to headless/software WebGL and `ReadPixels` performance warnings.
- DOM fallback was verified by temporarily setting `ENABLE_PIXI_TABLE = false`; it completed the same 10-hand flow at all three viewports with zero Pixi canvases and no console warnings/errors.

Current hardening blockers:

- Add a tracked smoke/visual QA script for repeated Pixi sessions instead of relying on ignored helper tooling.
- Run a live human readability pass at 1366 x 768 after several repeated sessions.
- Add postflop board-card QA with actual three-, four-, and five-card boards.

## Promotion Readiness Review - 2026-06-18

Decision: no local default trial yet. Continue Pixi behind `ENABLE_PIXI_TABLE = false`.

Latest full-flow QA could not verify the live Pixi renderer because the browser was unable to fetch the CDN Pixi module in the network-restricted environment:

- `https://cdn.jsdelivr.net/npm/pixi.js@8.8.1/dist/pixi.mjs`
- Browser error: `net::ERR_NETWORK_ACCESS_DENIED`
- App behavior: `renderTableScene(...)` failed safely and kept the DOM table fallback visible.

Promotion-readiness result:

- DOM fallback full trainer flow passed at 1920 x 1080, 1440 x 900, and 1366 x 768.
- Pixi-enabled fallback safety passed at the same viewports because the DOM table remained usable when Pixi failed to load.
- Actual Pixi full-flow readiness is fail/inconclusive until the renderer can load without depending on external network access during QA.

Next required step before a local default trial:

- Bundle, vendor, or otherwise make the Pixi runtime dependency locally reliable.
- Rerun the full trainer flow with an actual Pixi canvas present at 1920 x 1080, 1440 x 900, and 1366 x 768.
- Verify correct/incorrect feedback flashes, pot/card pulses, range modal behavior, continue behavior, and session summary with Pixi active.

## Local Pixi Runtime Update - 2026-06-18

Status: the CDN runtime blocker is addressed. Pixi now loads from the vendored local ESM file at `third_party/pixi/pixi.min.mjs`, so enabling Pixi no longer requires reaching `cdn.jsdelivr.net`.

Verification:

- Pixi-enabled full-flow QA mounted one canvas at 1920 x 1080, 1440 x 900, and 1366 x 768.
- The trainer flow reached start hand, answer feedback, range modal, continue, and session summary with Pixi active.
- The original network/CDN error did not recur; only headless/software WebGL warnings were reported.

Follow-up after local runtime verification:

- Re-run promotion QA after every Pixi renderer change with external network unavailable.
- Continue treating visual parity, primitive card/chip assets, and postflop board QA as promotion blockers.

## Blockers Before Pixi Default

- Fix and repeatedly verify Pixi first-render stability at 1920 x 1080, 1440 x 900, and 1366 x 768.
- Tune Pixi stage scale, seat offsets, hero-card offsets, pot/chip placement, and dealer-button placement until they match DOM readability at small desktop sizes.
- Replace primitive card and chip visuals with production-quality assets or a final approved renderer-native visual spec.
- Extend the renderer-facing state adapter until DOM and Pixi consume postflop decision states and any future action-animation event payloads.
- Prove full interaction parity for correct/incorrect feedback flashes, pot/card update pulses, and disabled action-control states.

## Required DOM Parity

- Table scene fits the same visible stage area without clipping or empty first-render states.
- Seat avatars, chrome, position plaques, action/status plaques, and active/folded visual states are at least as readable as DOM.
- Hero hole cards stay beside the hero seat and never appear in the center felt/community-card area.
- Pot text remains centered, legible, and visually connected to chip props.
- Empty board slots render in the center felt when no community cards exist; filled board-card primitives render in those same slots.
- Dealer button does not overlap cards, seat plaques, or action labels.
- Action labels and available choices match the DOM renderer for the same training spot.
- Recent-action badges render for meaningful call/raise/bet/jam/squeeze labels without duplicating routine waiting/folded captions.
- Active seat, answer feedback, pot changes, and card changes have subtle Pixi-only visual pulses that are safe when state is missing.
- Bottom action controls, feedback band, stats header, and range modal behavior remain unaffected by Pixi mode.
- DOM fallback can be restored by setting `ENABLE_PIXI_TABLE = false` without data migration or gameplay changes.

## Asset Gaps

- Card deck face assets are missing; Pixi currently uses primitive card faces.
- Card back and card-shadow assets are missing.
- Chip stack, chip pile, chip contact shadow, and dealer button assets are missing; Pixi currently uses primitives.
- Production community-card face assets are missing; Pixi currently uses the same primitive card renderer for board cards and hero cards.
- Final seat/avatar art-direction tuning is still needed even though FKSeat frames and consistent avatar portraits are wired.

## QA Viewports

Required desktop capture set:

- 1920 x 1080
- 1440 x 900
- 1366 x 768

Each viewport must be checked in DOM and Pixi mode for:

- Overall professionalism
- Alignment and stage fit
- Avatar/card/chip quality
- Pot, stack, dealer-button readability
- Hero, acting, folded, waiting, and recent-action states
- Action label parity
- Answer feedback flash, pot pulse, active-seat pulse, and card update pulse
- No overlap with action controls or the feedback band

Promotion should also include a folded-state sweep and at least one postflop board-card screenshot with three, four, and five community cards.

## Rollback Plan

1. Keep `ENABLE_PIXI_TABLE` as the single rollback switch.
2. If a visual or state regression appears, set `ENABLE_PIXI_TABLE = false` and redeploy to restore the DOM table.
3. Keep the DOM renderer code path intact until Pixi has passed repeated QA on production-like data and assets.
4. Treat Pixi promotion as reversible; do not remove DOM table CSS, markup, or state plumbing in the promotion commit.
5. Record rollback reason, viewport, screenshot path, and affected table state in `docs/pixi-qa-notes.md`.
