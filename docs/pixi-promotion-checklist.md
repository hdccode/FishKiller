# Pixi Promotion Checklist

Date: 2026-06-18

Current decision: keep the DOM table as the production default and continue Pixi behind `ENABLE_PIXI_TABLE = false`.

## Blockers Before Pixi Default

- Fix and repeatedly verify Pixi first-render stability at 1920 x 1080, 1440 x 900, and 1366 x 768.
- Tune Pixi stage scale, seat offsets, hero-card offsets, pot/chip placement, and dealer-button placement until they match DOM readability at small desktop sizes.
- Replace primitive card and chip visuals with production-quality assets or a final approved renderer-native visual spec.
- Add explicit board/community-card slots before using Pixi beyond preflop hero-card scenes.
- Move renderer-facing state normalization into a shared adapter so DOM and Pixi consume the same seats, cards, pot, action labels, folded states, and animation events.
- Prove action-state parity for hero-to-act, villain action, folded, waiting, recent action, and disabled action-control states.

## Required DOM Parity

- Table scene fits the same visible stage area without clipping or empty first-render states.
- Seat avatars, chrome, position plaques, action/status plaques, and active/folded visual states are at least as readable as DOM.
- Hero hole cards stay beside the hero seat and never appear in the center felt/community-card area.
- Pot text remains centered, legible, and visually connected to chip props.
- Dealer button does not overlap cards, seat plaques, or action labels.
- Action labels and available choices match the DOM renderer for the same training spot.
- Bottom action controls, feedback band, stats header, and range modal behavior remain unaffected by Pixi mode.
- DOM fallback can be restored by setting `ENABLE_PIXI_TABLE = false` without data migration or gameplay changes.

## Asset Gaps

- Card deck face assets are missing; Pixi currently uses primitive card faces.
- Card back and card-shadow assets are missing.
- Chip stack, chip pile, chip contact shadow, and dealer button assets are missing; Pixi currently uses primitives.
- Community-card board slots and any board-card treatment are missing.
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
- No overlap with action controls or the feedback band

Promotion should also include a folded-state sweep and at least one postflop-ready board-slot screenshot once board cards exist.

## Rollback Plan

1. Leave `ENABLE_PIXI_TABLE = false` as the default until promotion is explicitly approved.
2. If Pixi is promoted and a visual or state regression appears, set `ENABLE_PIXI_TABLE = false` and redeploy to restore the DOM table.
3. Keep the DOM renderer code path intact until Pixi has passed repeated QA on production-like data and assets.
4. Treat Pixi promotion as reversible; do not remove DOM table CSS, markup, or state plumbing in the promotion commit.
5. Record rollback reason, viewport, screenshot path, and affected table state in `docs/pixi-qa-notes.md`.
