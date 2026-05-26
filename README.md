# FishKiller

FishKiller is a local-first poker training website. The current live MVP is a 6-max 100bb preflop trainer backed by local range-pack JSON and lightweight validation tooling.

## Current MVP

- 6-max is the flagship trainer.
- The live 6-max range pack contains 50 complete preflop spots.
- Supported 6-max families are RFI, Facing Open, BB Defense, 3-bet, Facing 3-bet, selected Facing 4-bet, selected BvB Limp, and selected Iso vs Limp.
- Each live 6-max spot has 169 starting hand classes, frequency-based grading, a range matrix, progress tracking, mistake review, and a compact progress summary.
- HU, 3-max, and 9-max remain starter/legacy scenario-pack drills.
- Postflop and TexasSolver import tooling exists in the repo, but real postflop solving is not part of the current live MVP.

The shipped 6-max ranges are FishKiller internal-authored baseline training ranges. They are not universal GTO claims and are not copied commercial charts.

## Install

```powershell
npm install
```

## Run Locally

```powershell
npm start
```

Then open:

```text
http://127.0.0.1:4173
```

## MVP Checks

Run these lightweight checks before demoing or deploying the current MVP:

```powershell
npm run test:preflop
npm run preflop:ranges:validate
npm run preflop:ranges:coverage
npm test
npm run preflop:ranges:texassolver:smoke
```

These checks do not run TexasSolver.

## Demo Script

1. Start the app with `npm start`.
2. Open `http://127.0.0.1:4173`.
3. Select `6-Max`.
4. Try `All RFI`.
5. Try `All Facing Open`.
6. Try `All BB Defense`.
7. Try `All 3-bet`.
8. Try `All Facing 3-bet`.
9. Try `All Facing 4-bet`.
10. Try `All BvB Limp`.
11. Try `All Iso vs Limp`.
12. Open the range table for a hand and confirm the current hand is highlighted.
13. Answer a few hands and check the feedback/frequencies.
14. View the local progress summary.
15. Use Review mistakes after recording a miss.

HU, 3-max, and 9-max can also be opened, but they are starter scenario drills rather than the live 6-max range-pack trainer.

## Range-Pack Docs

See [docs/preflop-range-packs.md](docs/preflop-range-packs.md) for the real/demo range-pack schema, supported spot families, validation rules, and TexasSolver range-string smoke tooling.

## Solver Notes

Do not run TexasSolver as part of normal laptop demo checks. Generated solver inputs, raw solver output, logs, exports, and local third-party solver downloads are intentionally excluded from source control.
