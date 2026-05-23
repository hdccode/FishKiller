#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const CHECKER = path.join(ROOT, "tools", "check-texassolver-input.js");

main();

function main() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "fishkiller-texassolver-input-"));

  try {
    const cases = [
      {
        name: "valid input",
        file: "valid.txt",
        content: createInput(),
        expectPass: true,
      },
      {
        name: "demo input",
        file: "demo.txt",
        content: createInput({ header: "# demo training input" }),
        expectPass: false,
        expectedText: "demo",
      },
      {
        name: "missing dump_result",
        file: "missing-dump.txt",
        content: createInput({ omitDump: true }),
        expectPass: false,
        expectedText: "dump_result",
      },
      {
        name: "empty ranges",
        file: "empty-ranges.txt",
        content: createInput({ ipRange: "", oopRange: "" }),
        expectPass: false,
        expectedText: "range is empty",
      },
      {
        name: "invalid board",
        file: "invalid-board.txt",
        content: createInput({ board: "Ks,Ks,2x" }),
        expectPass: false,
        expectedText: "board",
      },
      {
        name: "existing output warning",
        file: "existing-output.txt",
        content: createInput({ outputPath: path.join(tempDir, "already.json") }),
        expectPass: true,
        expectedText: "already exists",
        beforeRun: () => fs.writeFileSync(path.join(tempDir, "already.json"), "{}", "utf8"),
      },
    ];

    cases.forEach((testCase) => runCase(tempDir, testCase));
    console.log("TexasSolver input checker smoke tests passed.");
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function runCase(tempDir, testCase) {
  const inputPath = path.join(tempDir, testCase.file);
  testCase.beforeRun?.();
  fs.writeFileSync(inputPath, testCase.content, "utf8");

  const result = spawnSync(process.execPath, [CHECKER, "--input", inputPath], {
    cwd: ROOT,
    encoding: "utf8",
  });
  const combined = `${result.stdout || ""}\n${result.stderr || ""}`;

  if (testCase.expectPass && result.status !== 0) {
    process.stderr.write(combined);
    throw new Error(`${testCase.name} should have passed.`);
  }

  if (!testCase.expectPass && result.status === 0) {
    process.stderr.write(combined);
    throw new Error(`${testCase.name} should have failed.`);
  }

  if (testCase.expectedText && !combined.toLowerCase().includes(testCase.expectedText.toLowerCase())) {
    process.stderr.write(combined);
    throw new Error(`${testCase.name} did not mention "${testCase.expectedText}".`);
  }
}

function createInput({
  header = "# usableAsRealTrainingData true",
  board = "Ks,7d,2c",
  ipRange = "AA,KK,QQ,JJ,TT,AKs,AKo,AQs,AQo,AJs,KQs",
  oopRange = "QQ,JJ,TT,99,88,AQs,AQo,AJs,ATs,KQs,KJs,QJs",
  outputPath = "data/texassolver/raw/smoke_nonreal_output.json",
  omitDump = false,
} = {}) {
  return [
    header,
    "set_pot 5.5",
    "set_effective_stack 97.5",
    `set_board ${board}`,
    `set_range_oop ${oopRange}`,
    `set_range_ip ${ipRange}`,
    "set_bet_sizes oop,flop,bet,33",
    "set_bet_sizes ip,flop,bet,33,75",
    "build_tree",
    "set_thread_num 4",
    "set_accuracy 1.0",
    "set_max_iteration 80",
    "start_solve",
    "set_dump_rounds 3",
    omitDump ? "" : `dump_result ${outputPath}`,
    "",
  ].join("\n");
}
