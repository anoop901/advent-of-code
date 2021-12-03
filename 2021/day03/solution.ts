import { chain } from "@anoop901/js-util";
import {
  countMatching,
  filter,
  fold,
  generate,
  map,
  toArray,
} from "@anoop901/js-util/iterables";
import { parseInputLines } from "../../util/parseInputLines";

export function solution(input: string): {
  part1Answer: number;
  part2Answer: number;
} {
  const diagnosticReport = parseDiagnosticReport(input);
  return {
    part1Answer: findPowerConsumption(diagnosticReport),
    part2Answer: findLifeSupportRating(diagnosticReport),
  };
}

function parseDiagnosticReport(input: string): boolean[][] {
  return chain(input)
    .then(parseInputLines)
    .then(map(map((c) => c == "1")))
    .then(map(toArray))
    .then(toArray)
    .end();
}

function bitArrayToNumber(bits: boolean[]): number {
  return chain(bits)
    .then(map(Number))
    .then(fold(0, (acc, x) => acc * 2 + x))
    .end();
}

function findRates(diagnosticReport: boolean[][]): {
  gammaRate: number;
  epsilonRate: number;
} {
  const numBits = diagnosticReport[0].length;
  const mostCommonBitPerPosition = chain(
    generate(
      (bitIndex) =>
        chain(diagnosticReport)
          .then(map((x) => x[bitIndex]))
          .end(),
      numBits
    )
  )
    .then(map(countMatching((bit) => bit)))
    .then(map((numOnes) => numOnes * 2 >= diagnosticReport.length))
    .then(toArray)
    .end();
  const gammaRate = bitArrayToNumber(mostCommonBitPerPosition);
  const leastCommonBitPerPosition = chain(mostCommonBitPerPosition)
    .then(map((bit) => !bit))
    .then(toArray)
    .end();
  const epsilonRate = bitArrayToNumber(leastCommonBitPerPosition);
  return { gammaRate, epsilonRate };
}

function findPowerConsumption(diagnosticReport: boolean[][]): number {
  const { gammaRate, epsilonRate } = findRates(diagnosticReport);
  return gammaRate * epsilonRate;
}

function findRating(
  diagnosticReport: boolean[][],
  filterMostCommon: boolean
): number {
  const numBits = diagnosticReport[0].length;
  let remainingNumbers = diagnosticReport;
  for (let bitIndex = 0; bitIndex < numBits; bitIndex++) {
    const mostCommonBit = chain(remainingNumbers)
      .then(map((x) => x[bitIndex]))
      .then(countMatching((bit) => bit))
      .then((numOnes) => numOnes * 2 >= remainingNumbers.length)
      .end();
    remainingNumbers = chain(remainingNumbers)
      .then(
        filter((x) =>
          filterMostCommon
            ? x[bitIndex] === mostCommonBit
            : x[bitIndex] !== mostCommonBit
        )
      )
      .then(toArray)
      .end();
    if (remainingNumbers.length === 1) {
      return bitArrayToNumber(remainingNumbers[0]);
    }
  }
  return 0;
}

function findOxygenGeneratorRating(diagnosticReport: boolean[][]): number {
  return findRating(diagnosticReport, true);
}
function findCO2ScrubberRating(diagnosticReport: boolean[][]): number {
  return findRating(diagnosticReport, false);
}

function findLifeSupportRating(diagnosticReport: boolean[][]): number {
  return (
    findOxygenGeneratorRating(diagnosticReport) *
    findCO2ScrubberRating(diagnosticReport)
  );
}
