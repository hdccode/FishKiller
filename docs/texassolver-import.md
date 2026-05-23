# TexasSolver Import

FishKiller can consume TexasSolver strategy dumps without bundling TexasSolver itself.

TexasSolver is AGPL-3.0/commercial-license-sensitive, so keep it as a separate tool. Generate solves with your own local copy, then convert the exported `output_result.json` into either FishKiller's legacy `solver-library.js` or the newer solved-tree format used by full-hand practice.

## 1. Run TexasSolver

Download TexasSolver from its GitHub releases and run the console solver with an input file:

```powershell
console_solver.exe -i resources/text/commandline_sample_input.txt
```

The console input should end with something like:

```text
set_dump_rounds 2
dump_result output_result.json
```

TexasSolver's console documentation says the dump contains action nodes with an `actions` array and a `strategy` object keyed by exact combos such as `Ac5c`.

## 2. Convert The Export

From the FishKiller folder:

```powershell
node tools\convert-texassolver.js --input path\to\output_result.json --output solver-library.js --pack-id hu-river-pack --pack-name "HU River TexasSolver Pack" --table-size hu --hero-seat "SB / BTN" --preflop-action-includes Open --board "Jc,Qc,3d,Kc,7s" --pot 58 --pot-bb-range "20,35"
```

Then restart or refresh FishKiller. Imported spots are used before the local FishSolver fallback.

For continuous full-hand practice, emit the solved-tree schema instead:

```powershell
node tools\convert-texassolver.js --input path\to\output_result.json --output solver-trees-imported.js --schema solved-tree --tree-id btn-bb-srp-k72r --tree-name "BTN vs BB SRP K72r" --formation BTN_vs_BB_SRP --hero-position BTN --villain-position BB --board "Ks,7d,2c" --pot 5.5 --stack-depth-bb 100 --max-action-depth 2
```

For the local-first MVP, prefer plain JSON in `data/solves/real`. After saving a real TexasSolver dump at:

```text
data\texassolver\raw\btn_bb_srp_100bb_k72r.json
```

run:

```powershell
npm run import:k72
```

This writes:

```text
data\solves\real\btn_bb_srp_100bb_k72r.json
```

The local server exposes every JSON file in `data/solves/real` through `/api/solves/real`, and the trainer loads those real trees automatically on refresh.

## Useful Options

- `--board`: Board at the exported node in TexasSolver notation, e.g. `Qs,Jh,2h`.
- `--pot`: Pot amount used in the solve. This helps map TexasSolver actions like `BET 19.14` to FishKiller's `bet-small` or `bet-big`.
- `--pot-bb-range`: Matching range for lesson spots, e.g. `20,35`.
- `--max-action-depth`: Defaults to `0`, which exports root action nodes only. Increase it if you want child action nodes, but FishKiller lessons currently match mostly by board/street/spot metadata, not a full postflop action path.
- `--schema solved-tree`: Emits `window.FISHKILLER_SOLVED_TREES` with `SolverNode` style nodes, legal actions, combo strategies, and child links where the export includes them.
- `--format json`: With `--schema solved-tree`, emits plain JSON instead of a browser JS wrapper. This is the format used by `data/solves/real`.

## Try The Fixture

```powershell
node tools\convert-texassolver.js --input examples\texassolver-output-sample.json --output solver-library.js --pack-id sample-river --pack-name "Sample River Pack" --table-size hu --hero-seat "SB / BTN" --preflop-action-includes Open --board "Jc,Qc,3d,Kc,7s" --pot 58 --pot-bb-range "20,35"
```

This writes a small pack into `solver-library.js`, proving the import route works. Replace it with real TexasSolver output when you are ready.

To test solved-tree output with the same fixture:

```powershell
node tools\convert-texassolver.js --input examples\texassolver-output-sample.json --output - --schema solved-tree --tree-id sample-tree --board "Jc,Qc,3d,Kc,7s" --pot 58 --max-action-depth 1
```

Solved-tree output is intentionally strict about supported actions. If a node lacks children or EV values, the trainer still runs but marks feedback as approximate instead of pretending to have precise solver data.
