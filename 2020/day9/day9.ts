import wu from "wu";

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
  for (const [value, index] of wu(xmasData.numbers)
    .enumerate()
    .slice(xmasData.preambleLength)) {
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
  for (const [startValue, startIndex] of wu(arr).enumerate()) {
    let { length, runningSum } = wu(arr)
      .slice(startIndex, startIndex + minLengthOfRange)
      .reduce(
        (acc, x) => ({
          length: acc.length + 1,
          runningSum: acc.runningSum + x,
        }),
        { length: 0, runningSum: 0 }
      );

    if (length === minLengthOfRange) {
      yield {
        startIndex,
        endIndex: startIndex + minLengthOfRange,
        sum: runningSum,
      };
      for (const [endValue, endIndex] of wu(arr)
        .enumerate()
        .slice(startIndex + minLengthOfRange)) {
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
  const sumMetadata = wu(allContiguousRangeSums(xmasData.numbers, 2)).find(
    ({ sum }) => sum === invalidNumber
  );
  if (sumMetadata == null) {
    throw new Error("unable to find encryption weakness");
  }
  const { startIndex, endIndex } = sumMetadata;

  const range = xmasData.numbers.slice(startIndex, endIndex);

  return Math.max(...range) + Math.min(...range);
}
