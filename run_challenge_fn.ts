import { readFile } from "fs/promises";
import yargs from "yargs";

async function main() {
  const args = await yargs(process.argv.slice(2))
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

  await runChallenge(args);
}

async function runChallenge(args: any) {
  const input = await readFile(getPathToInputTxt(args), "utf8");
  const solutionModule = await import("./2021/day03/solution");
  const { part1Answer, part2Answer } = solutionModule.solution(input);
  console.log(`part 1 answer: ${part1Answer}`);
  console.log(`part 2 answer: ${part2Answer}`);
}

function getPathToInputTxt(args: any) {
  return args.input || `${getPathToChallengeDirectory(args)}/input.txt`;
}

function getPathToChallengeDirectory(args: any) {
  return `${args.year}/${getDayFolderName(args.day)}`;
}

function getDayFolderName(day: number) {
  if (day >= 1 && day <= 25) {
    return "day" + day.toString().padStart(2, "0");
  } else {
    throw new Error(
      `day number ${day} is out of bounds; it must be between 1 and 25 (inclusive)`
    );
  }
}

main();
