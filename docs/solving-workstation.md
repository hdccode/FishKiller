# Solving Workstation Workflow

FishKiller laptops should not run TexasSolver jobs. Use this repo on the laptop for UI work, validation, import, and smoke tests only.

## Workstation Responsibilities

1. Install/build TexasSolver on the stronger workstation.
2. Generate or refresh the preflop range JSON / range-pack export that the target spot should use.
3. Validate local range packs:

   ```powershell
   npm run preflop:ranges:validate
   ```

4. Generate TexasSolver IP/OOP range strings from real range packs. Demo packs are allowed only for smoke tests:

   ```powershell
   node tools/generate-texassolver-ranges.js --ip-spot <ip_spot_id> --oop-spot <oop_spot_id> --ip-actions raise --oop-actions call,threeBet --out data/texassolver/generated-ranges/<spot>_ranges.json
   ```

5. Generate the TexasSolver command input file from those ranges and the spot metadata:

   ```powershell
   node tools/generate-texassolver-input.js --tree-id btn_bb_srp_100bb_k72r --board Ks,7d,2c --pot 5.5 --effective-stack 97.5 --ranges data/texassolver/generated-ranges/<spot>_ranges.json --out data/texassolver/generated-inputs/btn_bb_srp_100bb_k72r_input.generated.txt
   ```

   Keep generated files separate from hand-edited experiments when possible. Do not use demo, mock, or unusable range packs for real solver runs.

6. Run the readiness checker before starting TexasSolver:

   ```powershell
   npm run texassolver:input:check -- --input data/texassolver/btn_bb_srp_100bb_k72r_input.generated.txt
   ```

   If you intentionally want to rerun a solve whose `dump_result` JSON already exists, pass:

   ```powershell
   npm run texassolver:input:check -- --input data/texassolver/btn_bb_srp_100bb_k72r_input.generated.txt --allow-existing-output
   ```

7. Only after the readiness check passes, run TexasSolver manually or through the workstation runner. Save TexasSolver raw exports under:

   ```text
   data/texassolver/raw/
   ```

8. Convert raw exports to FishKiller solved-tree JSON:

   ```powershell
   npm run solves:convert -- --input data/texassolver/raw/<raw>.json --output data/solves/real/<tree>.json --schema solved-tree --format json --board Ks,7d,2c --pot 5.5
   ```

9. Validate and bundle:

   ```powershell
   npm run solves:validate
   npm run solves:bundle
   ```

10. Move either of these back to the laptop:

   ```text
   exports/fishkiller-solves-export.zip
   exports/fishkiller-solves-export/
   ```

## Laptop Responsibilities

On the laptop, keep work lightweight:

```powershell
npm install
npm run test:preflop
npm run preflop:ranges:validate
npm run preflop:ranges:texassolver:smoke
npm run texassolver:input:smoke
npm run texassolver:input:check:smoke
npm run solves:smoke
npm run solves:validate -- --allow-empty
```

If a workstation bundle is present, copy its `data/solves/real/*.json` files into this repo's `data/solves/real/` and copy its `data/solves/index.json` to this repo's `data/solves/index.json`.

Then run:

```powershell
npm run solves:validate
npm start
```

The app first tries to load `data/solves/index.json`, then fetches the listed local solved-tree JSON files. It falls back to the local `/api/solves/real` endpoint for older imports.

## Laptop Guardrails

Do not run these on the laptop unless explicitly requested:

```powershell
npm run solves:run
npm run solves:all
```

Do not copy smoke-test output into `data/solves/real/`. Smoke tests use temporary files only.

The TexasSolver input readiness checker does not run TexasSolver. It only checks command presence, board/card syntax, pot/stack sanity, non-empty ranges, demo/unusable markers, and whether the requested `dump_result` file already exists.
