# Preflop Range Packs

FishKiller can prepare TexasSolver range strings from local preflop range-pack JSON. This tooling is intentionally lightweight and local-first: it validates range metadata, builds IP/OOP range strings, and refuses demo/unusable data unless you explicitly allow it for smoke tests.

## Folder Layout

```text
data/preflop-ranges/
  demo/
    demo-rule-baseline.preflop-range.json
  real/
  validation-report.json
```

The `real/` folder is reserved for real licensed, generated, or manually authored data. The demo pack is disabled and must not be copied into real solver workflows.

## Pack Schema

Each pack uses this shape:

```json
{
  "packId": "fishkiller-6max-100bb-v1",
  "name": "FishKiller 6-Max 100bb Internal Baseline",
  "sourceType": "manual",
  "enabled": true,
  "usableAsRealTrainingData": true,
  "game": "NLHE",
  "format": "6-max cash",
  "stackDepthBb": 100,
  "anteBb": 0,
  "streets": ["preflop"],
  "strategySource": {
    "type": "internal-authored-baseline",
    "solverDerived": false,
    "proprietary": false
  },
  "spots": [
    {
      "spotId": "fk_6max_100bb_btn_rfi_unopened_v1",
      "tableSize": 6,
      "stackDepthBb": 100,
      "family": "rfi",
      "spotType": "rfi",
      "heroPosition": "BTN",
      "openerPosition": "BTN",
      "aggressorPosition": "BTN",
      "actionContext": "rfi",
      "priorAction": "folded-to-hero",
      "priorActions": [
        { "position": "LJ", "actionId": "fold" },
        { "position": "HJ", "actionId": "fold" },
        { "position": "CO", "actionId": "fold" }
      ],
      "potState": "unopened",
      "complete": true,
      "raiseSize": { "type": "open", "sizeBb": 2.3 },
      "legalActions": [
        { "id": "fold", "label": "Fold", "type": "fold" },
        { "id": "raise", "label": "Open 2.3bb", "type": "raise", "sizeBb": 2.3 }
      ],
      "actionsByHand": {
        "AA": { "fold": 0, "raise": 1 },
        "72o": { "fold": 1, "raise": 0 }
      }
    }
  ]
}
```

Supported `sourceType` values are `demo`, `manual`, `generated`, and `licensed`.

Supported hand classes are pairs like `AA`, suited classes like `A5s`, and offsuit classes like `KQo`. Unsuffixed non-pairs like `AK` are rejected because they blur suited and offsuit combos.

Complete spots use `"complete": true` and must include all 169 canonical hand classes. Every hand entry must use only IDs from `legalActions`, and its action frequencies must sum to `1`.

Spot metadata should make the family and action path explicit. Current and future range packs should prefer:

- `family`: stable trainer family such as `rfi`, `bbDefense`, `threeBetVsOpen`, `facingThreeBet`, `facingFourBet`, `limpedPot`, `isoVsLimper`, or `squeeze`.
- `spotType`: a more granular path label such as `rfi`, `bb-defense-vs-open`, `three-bet-vs-open`, or `facing-3bet`.
- `heroPosition`, `openerPosition`, `aggressorPosition`, and `defenderPosition` where those roles exist.
- `priorActions`: ordered preflop actions leading to Hero's decision, including folds, opens, calls, 3-bets, 4-bets, limps, or squeeze-triggering calls as needed.
- Size metadata such as `raiseSize`, `facingOpen`, `threeBetSize`, `facingThreeBet`, `fourBetSize`, or future equivalent fields.

The first real MVP pack is:

```text
data/preflop-ranges/real/fishkiller-6max-100bb-v1.preflop-range.json
```

It contains 50 complete 6-max 100bb preflop spots for the live trainer. This is the flagship range-pack path in the current app; HU, 3-max, and 9-max remain starter scenario-pack drills for now.

It currently contains internally authored, non-proprietary baseline 6-max RFI spots at 100bb after action folds to Hero:

- `fk_6max_100bb_lj_rfi_unopened_v1`
- `fk_6max_100bb_hj_rfi_unopened_v1`
- `fk_6max_100bb_co_rfi_unopened_v1`
- `fk_6max_100bb_btn_rfi_unopened_v1`
- `fk_6max_100bb_sb_rfi_unopened_v1`

LJ/HJ/CO/BTN use 2.3bb opens. SB uses a 3bb open. These are FishKiller internal baseline training ranges, not solver-perfect GTO and not copied commercial charts.

It also contains internally authored non-BB facing-open response spots:

- `fk_6max_100bb_hj_vs_lj_open_v1`
- `fk_6max_100bb_co_vs_lj_open_v1`
- `fk_6max_100bb_btn_vs_lj_open_v1`
- `fk_6max_100bb_btn_vs_hj_open_v1`
- `fk_6max_100bb_sb_vs_lj_open_v1`
- `fk_6max_100bb_sb_vs_hj_open_v1`

These spots use `fold`, `call`, and `threeBet` as legal actions. The facing open size is 2.3bb. They complete common first-response coverage alongside the existing BB defense spots and selected 3-bet versus open spots that are also reusable in the Facing Open drill group.

It also contains internally authored BB defense spots against first-in opens:

- `fk_6max_100bb_bb_vs_lj_open_v1`
- `fk_6max_100bb_bb_vs_hj_open_v1`
- `fk_6max_100bb_bb_vs_co_open_v1`
- `fk_6max_100bb_bb_vs_btn_open_v1`
- `fk_6max_100bb_bb_vs_sb_open_v1`

These spots use `fold`, `call`, and `threeBet` as legal actions. LJ/HJ/CO/BTN open sizes are 2.3bb; SB open size is 3bb. The defense ranges are still FishKiller MVP baseline data rather than universal GTO charts.

The pack also contains internally authored 3-bet versus open drills:

- `fk_6max_100bb_btn_vs_co_open_3bet_v1`
- `fk_6max_100bb_co_vs_hj_open_3bet_v1`
- `fk_6max_100bb_hj_vs_lj_open_3bet_v1`
- `fk_6max_100bb_sb_vs_btn_open_3bet_v1`
- `fk_6max_100bb_sb_vs_co_open_3bet_v1`

These spots use `fold`, `call`, and `threeBet` as legal actions. The facing open size is 2.3bb for all five MVP spots.

The pack also contains internally authored opener responses after facing a 3-bet:

- `fk_6max_100bb_lj_open_vs_hj_3bet_v1`
- `fk_6max_100bb_lj_open_vs_co_3bet_v1`
- `fk_6max_100bb_lj_open_vs_btn_3bet_v1`
- `fk_6max_100bb_lj_open_vs_sb_3bet_v1`
- `fk_6max_100bb_lj_open_vs_bb_3bet_v1`
- `fk_6max_100bb_hj_open_vs_co_3bet_v1`
- `fk_6max_100bb_hj_open_vs_btn_3bet_v1`
- `fk_6max_100bb_hj_open_vs_sb_3bet_v1`
- `fk_6max_100bb_hj_open_vs_bb_3bet_v1`
- `fk_6max_100bb_co_open_vs_btn_3bet_v1`
- `fk_6max_100bb_co_open_vs_sb_3bet_v1`
- `fk_6max_100bb_co_open_vs_bb_3bet_v1`
- `fk_6max_100bb_btn_open_vs_sb_3bet_v1`
- `fk_6max_100bb_btn_open_vs_bb_3bet_v1`
- `fk_6max_100bb_sb_open_vs_bb_3bet_v1`

These spots use `fold`, `call`, and `fourBet` as legal actions. LJ/HJ/CO/BTN opens use 2.3bb, and SB opens use 3bb. IP 3-bets use 7.5bb, blind 3-bets use 9bb to 9.5bb, and 4-bet sizes are simple MVP metadata rather than a universal sizing claim.

The pack also contains selected internally authored 3-bettor responses after facing a 4-bet:

- `fk_6max_100bb_hj_3bet_vs_lj_open_lj_4bet_v1`
- `fk_6max_100bb_co_3bet_vs_hj_open_hj_4bet_v1`
- `fk_6max_100bb_btn_3bet_vs_co_open_co_4bet_v1`
- `fk_6max_100bb_sb_3bet_vs_btn_open_btn_4bet_v1`
- `fk_6max_100bb_bb_3bet_vs_btn_open_btn_4bet_v1`

These selected spots use `fold`, `call`, and `fiveBetJam` as legal actions. They cover high-volume 3-bet versus open paths first; they are not exhaustive facing-4bet coverage.

The pack also contains selected internally authored blind-vs-blind limp spots:

- `fk_6max_100bb_sb_first_in_limp_or_raise_v1`
- `fk_6max_100bb_bb_vs_sb_limp_v1`
- `fk_6max_100bb_sb_limp_vs_bb_raise_v1`

These selected spots use `fold`/`limp`/`raise`, `check`/`raise`, and `fold`/`call`/`threeBet` respectively. SB limp metadata uses a 1bb completed small blind, SB first-in raises use 3bb, and BB raises versus SB limp use 4.5bb.

The pack also contains selected internally authored one-limper iso/overlimp spots:

- `fk_6max_100bb_hj_vs_lj_limp_v1`
- `fk_6max_100bb_co_vs_lj_limp_v1`
- `fk_6max_100bb_btn_vs_lj_limp_v1`
- `fk_6max_100bb_btn_vs_co_limp_v1`
- `fk_6max_100bb_sb_vs_btn_limp_v1`
- `fk_6max_100bb_bb_vs_btn_limp_v1`

These selected one-limper spots use `fold`, `call`, and `isoRaise` as legal actions. In the trainer, `call` is displayed as Overlimp or Complete depending on position, and `isoRaise` is displayed as Iso-raise. Limp metadata uses 1bb and iso-raise metadata uses 4.5bb to 5bb. The current live pack still excludes multi-limper chains and squeeze spots.

## Full 6-Max Preflop MVP Target

The current live MVP is deliberately smaller than the intended complete 6-max 100bb preflop trainer. The full preflop target is to support local range-pack spots for:

- RFI: unopened pots by LJ/HJ/CO/BTN/SB.
- Facing open: calls, 3-bets, and folds versus first-in opens from relevant positions.
- Facing 3-bet: opener responses with fold/call/4-bet.
- Facing 4-bet: selected 3-bettor responses now, with more pairings to add later.
- Blind-vs-blind limp: selected SB limp/raise, BB check/raise, and SB response spots.
- Iso vs limper: selected one-limper overlimp/complete and iso-raise branches.
- Squeeze: 3-bet squeeze decisions after an open and at least one caller.

Explicit exclusions for this MVP target:

- No tournaments or ICM.
- No antes.
- No stack-depth variants beyond 100bb.
- No multiple rake models yet.
- No multi-limper chains or squeeze spots yet.
- No postflop strategy in this preflop MVP.

## Demo Versus Real

Demo packs must have:

```json
{
  "sourceType": "demo",
  "enabled": false,
  "usableAsRealTrainingData": false
}
```

They exist only so validation and conversion paths can be tested without claiming the ranges are real. Demo output is marked `usableAsRealTrainingData: false` and generation refuses it unless `--allow-demo` is passed.

## Validation

Run:

```powershell
npm run preflop:ranges:validate
npm run preflop:ranges:coverage
```

This checks metadata, spot fields, hand syntax, and per-hand action frequencies. It writes:

```text
data/preflop-ranges/validation-report.json
```

The coverage check verifies the launch-supported live 6-max trainer families: five RFI spots, six non-BB facing-open response spots, five BB defense spots, five selected 3-bet versus open spots, 15 facing-3bet spots, five selected facing-4bet spots, three selected BvB limp spots, and six selected iso-vs-limp spots. It also verifies the 15-spot Facing Open coverage umbrella, 169-hand coverage, expected legal actions by family, drill-to-spot mappings, range-matrix construction, and question sampling.

## TexasSolver Range Generation

Run smoke tests:

```powershell
npm run preflop:ranges:texassolver:smoke
```

Manual demo-only generation example:

```powershell
node tools/generate-texassolver-ranges.js --ip-spot demo_6max_btn_rfi_100bb --oop-spot demo_6max_bb_vs_btn_open_100bb --ip-actions raise --oop-actions call,threeBet --out data/texassolver/generated-ranges/demo_btn_bb_srp_100bb_ranges.json --allow-demo
```

Generated range files under `data/texassolver/generated-ranges/` are gitignored.

## Range Types

An opener range is usually built from actions such as `raise` in an RFI spot. A full continue range can combine actions such as `call,threeBet` when facing an open. A flat-call-only range should use only `call`, which intentionally excludes 3-bets and folds.

Do not use the demo range pack for real training, real solver jobs, or strategy claims.
