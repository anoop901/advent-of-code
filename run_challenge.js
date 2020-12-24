#!/usr/bin/env node
const yargs = require("yargs/yargs");
const { spawn } = require("child_process");
const fs = require("fs");

try {
  main();
} catch (e) {
  console.error(`error: ${e.message}`);
}

function main() {
  const args = yargs(process.argv.slice(2))
    .demandOption(["year", "day"])
    .describe("year", "The year of Advent of Code.")
    .describe("day", "The day of the particular challenge.")
    .describe(
      "input",
      "The input file (if omitted, the input.txt in the challenge's directory will be used)"
    )
    .alias("year", "y")
    .alias("day", "d")
    .alias("input", "i").argv;

  runChallengeCommand(args);
}

function runChallengeCommand(args) {
  const subprocess = spawn("npx", ["ts-node", getPathToMainTs(args)], {
    stdio: ["pipe", "inherit", "inherit"],
  });
  fs.createReadStream(getPathToInputTxt(args)).pipe(subprocess.stdin);
  subprocess.on("exit", (code) => {
    process.exit(code);
  });
}

function getPathToMainTs(args) {
  return `${getPathToChallengeDirectory(args)}/main.ts`;
}

function getPathToInputTxt(args) {
  return args.input || `${getPathToChallengeDirectory(args)}/input.txt`;
}

function getPathToChallengeDirectory(args) {
  return `${args.year}/${getDayFolderName(args.day)}`;
}

function getDayFolderName(day) {
  if (day >= 1 && day <= 25) {
    return "day" + day.toString().padStart(2, "0");
  } else {
    throw new Error(
      `day number ${day} is out of bounds; it must be between 1 and 25 (inclusive)`
    );
  }
}
