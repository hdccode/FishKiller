# TexasSolver Import

FishKiller can consume TexasSolver strategy dumps without bundling TexasSolver itself.

TexasSolver is AGPL-3.0/commercial-license-sensitive, so keep it as a separate tool. Generate solves with your own local copy, then convert the exported `output_result.json` into FishKiller's `solver-library.js`.

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

## Useful Options

- `--board`: Board at the exported node in TexasSolver notation, e.g. `Qs,Jh,2h`.
- `--pot`: Pot amount used in the solve. This helps map TexasSolver actions like `BET 19.14` to FishKiller's `bet-small` or `bet-big`.
- `--pot-bb-range`: Matching range for lesson spots, e.g. `20,35`.
- `--max-action-depth`: Defaults to `0`, which exports root action nodes only. Increase it if you want child action nodes, but FishKiller lessons currently match mostly by board/street/spot metadata, not a full postflop action path.

## Try The Fixture

```powershell
node tools\convert-texassolver.js --input examples\texassolver-output-sample.json --output solver-library.js --pack-id sample-river --pack-name "Sample River Pack" --table-size hu --hero-seat "SB / BTN" --preflop-action-includes Open --board "Jc,Qc,3d,Kc,7s" --pot 58 --pot-bb-range "20,35"
```

This writes a small pack into `solver-library.js`, proving the import route works. Replace it with real TexasSolver output when you are ready.
