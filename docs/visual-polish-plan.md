# FishKiller Visual Polish Plan

This plan is for the current web preflop trainer on the `deploy-demo` branch. It is an art-direction and implementation plan only. It does not propose a Unity rewrite, framework migration, or poker logic changes.

## Current UI Ownership

The requested `src/ui/table-view.js`, `src/ui/action-buttons-view.js`, `src/ui/modal-view.js`, and `src/ui/range-table-view.js` files are not present in this branch. The current trainer table screen is owned by:

- `index.html`: static shell, trainer HUD markup, table stage container, action row, feedback dock, summary modal, end-session modal, range table modal.
- `app.js`: preflop trainer state, table render markup, avatar assignment, seat shell selection, action button markup, modal content, range table content.
- `styles.css`: nearly all visual system work, including FK1/FK2 skins, table stage, seat widgets, action buttons, HUD, feedback dock, cards, and modal styling.

Current major visual assets:

- Backgrounds and stage references:
  - `assets/FishKiller1.png` - 1672 x 941
  - `assets/FishKiller2.png` - 1672 x 941
  - `assets/FishKiller2.1.png` - 1672 x 941
  - `assets/FishKiller2.2.png` - 1586 x 992
  - `assets/fishkiller2-stage-bg.png` - 1672 x 562
  - `assets/FKBackground.png` - 1672 x 941
- Current live avatar portraits:
  - `assets/avatars/seat-shark.png` - 512 x 512
  - `assets/avatars/seat-octopus.png` - 512 x 512
  - `assets/avatars/seat-turtle.png` - 512 x 512
  - `assets/avatars/seat-blue-shark.png` - 512 x 512
  - `assets/avatars/seat-dolphin.png` - 512 x 512
  - `assets/avatars/seat-angler.png` - 512 x 512
  - `assets/avatars/fishkiller-avatar-sheet.png` - 1536 x 1024 fallback
- Current seat chrome:
  - `assets/FKSeat/FKFrame_transparent.png` - 1354 x 685
  - `assets/FKSeat/FKFrameLeft_transparent.png` - 1309 x 664
  - other experimental or fallback chrome assets are present but should not be mixed into the current combined-shell strategy without a deliberate pass.
- Other generated seat experiments:
  - `assets/fk2_*`
  - `assets/seat-*`
  - capitalized `assets/FK*.png`

Current dynamic trainer components:

- Background/table scene: FK2 image-backed stage via `.table-stage` and `.table-visual`.
- Seats: `.seat-node`, `.seat-player`, `.seat-main`, `.seat-shell-image`, `.seat-avatar`, `.seat-marker`, `.seat-caption`.
- Hero cards: mini card markup rendered through `.seat-hero-hand` and `.seat-hole-cards`.
- Center table: `.board-zone` for postflop board cards, `.table-pot` / pot label for preflop.
- Action controls: `.answer-grid`, `.answer-button`, `.answer-icon-well`, action tone classes.
- HUD/header: `.scenario-topline`, `.hud-brand`, `.hud-progress`, `.session-figures`, `.visual-skin-toggle`.
- Bottom feedback: `.feedback-band`, `.feedback-label`, `.feedback-actions`.
- Range table modal: `#gto-modal`, `#gto-matrix`, preflop matrix classes and modal card styles.

## A. Current Visual Issues

### Asset and style cohesion

- The screen has several generations of FK2 assets checked in at once: full scene backgrounds, extracted seat shells, transparent seat shells, standalone plaques, standalone rings, and fallback CSS treatments.
- The current combined-shell seat strategy is functional, but the art pipeline is unclear. Assets with similar purposes have different names, scales, styles, and transparency assumptions.
- Some assets are reference or extraction artifacts rather than production assets. They should be archived or clearly excluded from runtime use.

### Avatar and sprite consistency

- The six live avatar portraits are more coherent than the earlier generated set, but they still need a true final art pass as a matched portrait set.
- Portrait crops are tuned in CSS variables, which helps, but the portraits do not yet share identical lighting, rim highlights, line weight, facial scale, and background removal quality.
- The fallback avatar sheet and loose ChatGPT source images add ambiguity to the production asset story.

### Depth and shadow integration

- The FK2 background gives the room/table depth, but some live overlays still feel placed on top of the scene rather than lit by it.
- Seat shadows and shell highlights are mostly CSS filters, not authored lighting matched to the background.
- Cards and pot labels need stronger material integration: contact shadows, subtle perspective, and local highlights should match the table lighting.

### Table and seat composition

- Seat coordinates have been tuned manually and are serviceable, but they are not backed by a formal stage coordinate system.
- Seat chrome uses left/right combined shell images, but text placement is fragile because plaque text is positioned by percentages over a raster shell.
- Hero cards now sit with the hero seat, which is directionally correct, but the card and seat system need a final overlap/collision pass across all hero positions.

### Card and chip presentation

- Cards are still CSS-built mini cards, not production card face assets.
- There is no production chip stack, chip pile, or dealer button system.
- Action animations for chips/cards exist conceptually in CSS/DOM, but the props are not at the same quality level as the FK2 background.

### HUD, action buttons, and feedback

- The FK2 HUD and action buttons are much improved, but they still depend heavily on CSS gradients and text/icon approximations.
- Action icons are placeholder CSS/SVG-like marks rather than a unified icon set.
- The bottom feedback dock is functional but not yet as physically integrated into the game board as the target art direction.
- Correct, mixed, and incorrect result states need stronger visual language without becoming neon or noisy.

### Modal and range table

- The range table modal is functional and readable, but it looks closer to a styled web modal than a premium in-game overlay.
- The matrix needs a production panel style, tighter visual hierarchy, and a color language that matches the FK2 action tones.

### Areas where CSS alone cannot solve the problem

- Consistent avatar quality requires actual replacement portrait assets, not more crop tuning.
- Premium card and chip presentation needs authored card/chip/dealer assets.
- Table integration will improve most from better overlay assets and shadow plates, not more gradients.
- Professional action icons and feedback effects need a designed icon/effect set.
- A coherent product look needs asset pipeline decisions: naming, dimensions, transparency, compression, and runtime-only vs reference-only folders.

## B. Target Art Direction

FishKiller should read as a dark fantasy luxury poker trainer:

- A cinematic luxury poker room with warm amber/gold lighting, deep shadows, polished dark wood, brass, and green felt.
- A trainer-first interface: readable actions, clear feedback, and fast decisions remain more important than pure decoration.
- A creature/avatar table with six consistent portrait characters, each lit and framed like part of the same world.
- Glass, gold, dark enamel, and restrained neon accents for controls and feedback.
- Premium cards and chips with tactile depth, crisp contrast, and subtle table contact shadows.
- Strong state language:
  - Hero/current actor: warm brass emphasis.
  - Correct: muted emerald/gold success, not bright arcade green.
  - Mixed: amber/gold caution.
  - Incorrect: muted ember/red correction.
  - Folded/waiting: subdued but readable.

The target should feel like a professional product screenshot: distinctive, branded, and easy to read at a glance.

## C. Asset Replacement List

Use this as the production asset checklist. Prefer transparent PNG or WebP for raster art. Use SVG for simple vector icons only when it matches the art direction.

### Background and stage

- `fk2-stage-room.webp`
  - Use: full gameplay scene plate with room, table, rug/floor, and lower action-control area.
  - Size: 1920 x 1080 minimum, 2560 x 1440 ideal.
  - Format: WebP with high quality, JPG acceptable only if no transparency is needed.
  - Static or animated: static first, later subtle parallax/light overlay if needed.

- `fk2-stage-vignette.png`
  - Use: optional transparent edge shading and readability overlay.
  - Size: match stage plate, 1920 x 1080.
  - Format: transparent PNG/WebP.
  - Static or animated: static.

### Seats and avatars

- `avatar-utg-shark.webp`
- `avatar-hj-octopus.webp`
- `avatar-co-turtle.webp`
- `avatar-btn-blue-shark.webp`
- `avatar-sb-dolphin.webp`
- `avatar-bb-angler.webp`
  - Use: live portrait images inside seat medallions.
  - Size: 768 x 768 or 1024 x 1024 source, displayed around 72 to 120 CSS px.
  - Format: transparent PNG/WebP or portrait WebP with authored circular crop background.
  - Static or animated: static first, later idle blink/breath variants optional.
  - Requirement: same lighting direction, same line weight, same polish level, matching background removal.

- `seat-shell-right.webp`
- `seat-shell-left.webp`
- `seat-shell-active-right.webp`
- `seat-shell-active-left.webp`
  - Use: combined medallion plus position/status plaque chrome.
  - Size: source around 1400 x 700 for high DPI, displayed around 180 to 270 CSS px wide.
  - Format: transparent PNG or WebP with alpha.
  - Static or animated: static. Active glow should be CSS or separate overlay.
  - Requirement: no baked text, no avatar, no rectangular matte.

- `seat-glow-active.png`
- `seat-glow-folded.png`
  - Use: local state glow/shadow around the visible chrome only.
  - Size: around 512 x 256.
  - Format: transparent PNG/WebP.
  - Static or animated: static first, CSS opacity animation later.

### Cards

- `card-face-sprite.webp`
  - Use: all 52 card faces in one consistent deck style.
  - Size: source card face around 240 x 336 each, sprite or atlas sized accordingly.
  - Format: WebP/PNG.
  - Static or animated: static.

- `card-back-fk2.webp`
  - Use: face-down fold animations and future postflop/dealing.
  - Size: 240 x 336 source.
  - Format: WebP/PNG.
  - Static or animated: static.

- `card-shadow.png`
  - Use: reusable soft shadow under hole cards and board cards.
  - Size: 256 x 96.
  - Format: transparent PNG.
  - Static or animated: static.

### Chips and table props

- `chip-stack-small.webp`
- `chip-stack-medium.webp`
- `chip-stack-large.webp`
- `chip-pile-pot.webp`
  - Use: pot label support, bet/raise animation props, stack atmosphere.
  - Size: 256 x 256 to 512 x 512 source.
  - Format: transparent WebP/PNG.
  - Static or animated: static first, CSS slide/scale later.

- `dealer-button.webp`
  - Use: BTN/dealer indicator on or near the BTN seat.
  - Size: 128 x 128 source.
  - Format: transparent WebP/PNG.
  - Static or animated: static.

### Action and HUD icons

- `icon-fold.svg`
- `icon-call.svg`
- `icon-check.svg`
- `icon-raise.svg`
- `icon-3bet.svg`
- `icon-4bet.svg`
- `icon-jam.svg`
- `icon-squeeze.svg`
  - Use: action button icon wells.
  - Size: 32 x 32 viewbox.
  - Format: SVG preferred.
  - Static or animated: static first, micro-animation on hover/selection later.
  - Requirement: one icon family, not mixed CSS doodles.

- `icon-hands.svg`
- `icon-mistakes.svg`
- `icon-accuracy.svg`
- `icon-streak.svg`
  - Use: HUD stat panel.
  - Size: 20 x 20 or 24 x 24.
  - Format: SVG.
  - Static or animated: static.

### Panels and overlays

- `panel-glass-noise.png`
  - Use: subtle texture overlay for HUD, feedback, modals.
  - Size: tileable 256 x 256.
  - Format: transparent PNG/WebP.
  - Static or animated: static.

- `range-modal-surface.png`
  - Use: optional modal/range table panel surface.
  - Size: 1200 x 800 or scalable 9-slice source.
  - Format: PNG/WebP.
  - Static or animated: static.

- `feedback-correct-burst.png`
- `feedback-mixed-pulse.png`
- `feedback-wrong-spark.png`
  - Use: subtle local feedback effects.
  - Size: 512 x 128 or 512 x 256.
  - Format: transparent PNG/WebP.
  - Static or animated: static first, CSS opacity/scale animation later.

### Naming convention

Use lowercase, hyphenated runtime asset names:

- `fk2-stage-room.webp`
- `avatar-btn-blue-shark.webp`
- `seat-shell-right.webp`
- `card-back-fk2.webp`
- `icon-3bet.svg`

Move reference images and source experiments into a clearly named folder if they remain in the repo:

- `assets/reference/`
- `assets/source/`
- `assets/runtime/`

Runtime code should import or reference only `assets/runtime/*` after cleanup.

## D. CSS/UI Polish Plan

### Design tokens

Normalize the FK2 visual system around a tighter token set:

- Color:
  - `--fk2-bg`
  - `--fk2-ink`
  - `--fk2-panel`
  - `--fk2-glass`
  - `--fk2-brass`
  - `--fk2-gold`
  - `--fk2-gold-soft`
  - `--fk2-felt`
  - `--fk2-red`
  - `--fk2-teal`
  - `--fk2-purple`
  - `--fk2-success`
  - `--fk2-warning`
  - `--fk2-danger`
- Radius:
  - `--fk2-radius-panel`
  - `--fk2-radius-control`
  - `--fk2-radius-pill`
- Shadows:
  - `--fk2-shadow-soft`
  - `--fk2-shadow-hard`
  - `--fk2-shadow-card`
  - `--fk2-glow-gold`
  - `--fk2-glow-red`
  - `--fk2-glow-teal`
  - `--fk2-glow-purple`
- Motion:
  - `--fk2-motion-fast`
  - `--fk2-motion-medium`
  - `--fk2-ease-out`

### Panels and surfaces

- Replace repeated one-off glass/gradient stacks with reusable FK2 panel classes:
  - `.fk2-panel`
  - `.fk2-glass-panel`
  - `.fk2-hud-panel`
  - `.fk2-feedback-panel`
- Use consistent border opacity and inner highlight.
- Keep feedback dock visually quieter than action buttons.
- Keep modals using the same surface treatment as HUD and feedback, not a separate generic web card style.

### Avatar and seat integration

- Use one production shell strategy only.
- Keep seat wrapper transparent and state effects local to shell/avatar.
- Add consistent local contact shadow under each visible seat shell.
- Add active/hero ring light through a shell glow layer or CSS filter, not a large rectangle.
- Keep folded dimming readable: avoid opacity below roughly 0.75 on the full widget.

### Cards

- Replace CSS mini cards with card assets or a single precise card component that matches the production deck.
- Add a local card shadow layer instead of relying only on generic box-shadow.
- Add slight perspective/rotation only where it improves physicality.
- Keep hole cards next to hero/current seat; reserve center for board/community cards and pot.

### Chips and pot

- Introduce a chip pile prop beside/behind the pot amount.
- Use chip slide animations for opens, calls, raises, 3-bets, 4-bets, jams, iso-raises, and squeezes.
- Use consistent chip sizes and travel paths from seat anchor to pot zone.

### Action buttons

- Keep the current large glass button structure, but swap placeholder icons for a unified icon set.
- Reduce duplicated action-specific CSS by mapping each action tone to variables:
  - Fold: red/ember.
  - Call/check: teal/jade.
  - Raise/3-bet/4-bet/squeeze/jam: purple/amethyst with stronger gold edge for all-in/jam.
- Add selected/correct/wrong/mixed state overlays that do not blow out the button brightness.

### HUD

- Keep the current top HUD layout but normalize it to the FK2 panel system.
- Use the same icon family as action buttons.
- Reduce heavy borders and repeated vertical separators.
- Make the skin toggle less visually dominant than session stats.

### Feedback and range table modal

- Feedback dock should feel like a game-board command console:
  - low height
  - dark glass
  - brass trim
  - muted status color edge
  - clear CTA hierarchy
- Range table modal should use the same FK2 panel surface and a cleaner matrix legend.
- Matrix colors should map to action tones but remain muted enough for dense scanning.

## E. Implementation Sequence

Each step should be a small commit. Keep poker behavior unchanged unless explicitly scoped.

### 1. Add design tokens and normalize panel styles

- Add final FK2 token names in `styles.css`.
- Create reusable panel/surface/action-tone helper classes.
- Replace obvious duplicate border/shadow/glass values in HUD, feedback, modal, and buttons.
- No asset replacement yet.

Suggested commit: `Normalize FK2 visual tokens`

### 2. Replace avatar assets and seat frames

- Decide final runtime seat strategy.
- Replace the six avatar portraits with a matched production set.
- Replace current FKSeat combined shells with production shells if needed.
- Remove or quarantine reference/experimental seat assets from runtime code.
- Retune only avatar crop and seat text placement.

Suggested commit: `Replace FK2 seat and avatar assets`

### 3. Replace card, chip, and dealer assets

- Add production card deck assets.
- Add card back asset matching the fold animation.
- Add chip stack, chip pile, and dealer button props.
- Keep hero cards beside hero seat and board cards in center.
- Add chip prop to pot label.

Suggested commit: `Add production cards and chip props`

### 4. Improve action buttons and icons

- Add final action icon set.
- Replace CSS placeholder icons.
- Normalize action-tone variables.
- Improve selected/correct/mixed/wrong button states.
- Verify 2-action and 3-action layouts.

Suggested commit: `Polish FK2 action controls`

### 5. Improve HUD and bottom feedback panel

- Apply shared FK2 panel system to HUD and feedback.
- Replace HUD placeholder icons.
- Tighten progress bar, stats panel, and skin toggle hierarchy.
- Make feedback states coherent with action tones.

Suggested commit: `Polish FK2 HUD and feedback`

### 6. Add subtle CSS animation polish

- Add small hover/press feedback to controls.
- Add seat active pulse, folded dim transition, chip slide, and result pulse.
- Respect reduced-motion preferences.
- Keep all animations under trainer clarity thresholds.

Suggested commit: `Add FK2 micro-interactions`

### 7. Desktop screenshot regression pass

- Capture 1920 x 1080 and common laptop screenshots.
- Verify:
  - all hero positions
  - 2-action and 3-action spots
  - RFI, facing open, facing 3-bet, facing 4-bet, limp, iso, squeeze
  - review mistakes empty/non-empty
  - range table modal
- Fix overlap, clipping, contrast, and state regressions only.

Suggested commit: `QA FK2 desktop trainer visuals`

## F. Unity Decision Checkpoint

Do not consider Unity until all of this is true:

- A professional web vertical slice exists with final-quality FK2 art.
- The six-avatar set, seat frames, card deck, chips, HUD icons, and feedback effects are production quality.
- The current web build has a screenshot-worthy 6-max preflop trainer at desktop size.
- Remaining blockers are genuinely about animation/rendering/game feel, 3D/camera work, native packaging, or mobile performance.
- Migration cost is justified by product requirements, not by missing assets or unfinished CSS cleanup.

Unity should be a later product/platform decision, not a shortcut around art direction.

## Immediate Next Step

The next useful implementation step is not another layout experiment. It is a production asset pass:

1. Choose or commission the final six avatar portraits in one style.
2. Produce one clean right shell and one clean left shell with no baked text or avatar.
3. Produce a production card back and at least one card face style.
4. Replace runtime references to experimental FK2 assets with a small `assets/runtime/fk2/` set.

After that, the CSS polish pass will be much more predictable and much less like fighting temporary art.
