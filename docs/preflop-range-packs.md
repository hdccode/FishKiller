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
      "heroPosition": "BTN",
      "actionContext": "rfi",
      "priorAction": "folded-to-hero",
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

The first real MVP pack is:

```text
data/preflop-ranges/real/fishkiller-6max-100bb-v1.preflop-range.json
```

It currently contains one internally authored, non-proprietary baseline spot: 6-max BTN RFI at 100bb after action folds to Hero. It is not presented as solver-perfect GTO.

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
```

This checks metadata, spot fields, hand syntax, and per-hand action frequencies. It writes:

```text
data/preflop-ranges/validation-report.json
```

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
