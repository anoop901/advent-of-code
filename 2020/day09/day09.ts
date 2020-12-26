import chain from "../../util/chain";
import {
  enumerate,
  findFirstMatching,
  fold,
  slice,
} from "../../util/iterators";

// k = length of preamble
// n = length of xmas data

export interface XmasData {
  numbers: number[];
  preambleLength: number;
}

export function anyPairSumToTarget(arr: number[], target: number): boolean {
  // O(k)
  const possibleMatches = new Set();
  for (const n of arr) {
    if (possibleMatches.has(n)) {
      return true;
    }

    const opposite = target - n;
    possibleMatches.add(opposite);
  }
  return false;
}

export function firstNumberThatBreaksPattern(xmasData: XmasData): number {
  // O(k * (n - k))
  for (const { value, index } of chain(xmasData.numbers)
    .then(enumerate)
    .then(slice(xmasData.preambleLength))
    .run()) {
    const previousNumbers = xmasData.numbers.slice(
      index - xmasData.preambleLength,
      index
    );
    if (!anyPairSumToTarget(previousNumbers, value)) {
      return value;
    }
  }
  throw new Error("no numbers broke the pattern");
}

export function* allContiguousRangeSums(
  arr: Iterable<number>,
  minLengthOfRange: number
): Iterable<{ startIndex: number; endIndex: number; sum: number }> {
  //  0   1   2   3
  // [ 15, 25, 47, 40 ]
  for (const { index: startIndex } of enumerate(arr)) {
    const { length, initRunningSum } = chain(arr)
      .then(slice(startIndex, startIndex + minLengthOfRange))
      .then(
        fold({ length: 0, initRunningSum: 0 }, (acc, x) => ({
          length: acc.length + 1,
          initRunningSum: acc.initRunningSum + x,
        }))
      )
      .run();

    let runningSum = initRunningSum;

    if (length === minLengthOfRange) {
      yield {
        startIndex,
        endIndex: startIndex + minLengthOfRange,
        sum: runningSum,
      };
      for (const { value: endValue, index: endIndex } of chain(arr)
        .then(enumerate)
        .then(slice(startIndex + minLengthOfRange))
        .run()) {
        runningSum += endValue;
        yield { startIndex, endIndex: endIndex + 1, sum: runningSum };
      }
    }
  }
}

export function findEncryptionWeakness(
  xmasData: XmasData,
  invalidNumber: number
): number {
  const sumMetadata = chain(allContiguousRangeSums(xmasData.numbers, 2))
    .then(findFirstMatching(({ sum }) => sum === invalidNumber))
    .run();
  if (sumMetadata == null) {
    throw new Error("unable to find encryption weakness");
  }
  const { startIndex, endIndex } = sumMetadata;

  const range = xmasData.numbers.slice(startIndex, endIndex);

  return Math.max(...range) + Math.min(...range);
}
