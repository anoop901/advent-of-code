import chain from "../../util/chain";
import { itemAtIndex } from "../../util/iterables";

export function* playGame(
  startingNumbers: number[]
): Generator<number, void, undefined> {
  const numberToLastSeenIndex = new Map<number, number>();
  let index = 0;
  let lastStartingNumberSpoken: number | null = null;
  for (const currentNumber of startingNumbers) {
    yield currentNumber;

    if (lastStartingNumberSpoken !== null) {
      numberToLastSeenIndex.set(lastStartingNumberSpoken, index - 1);
    }
    index++;
    lastStartingNumberSpoken = currentNumber;
  }

  if (lastStartingNumberSpoken === null) {
    throw new Error("starting numbers must contain some numbers");
  }
  let lastNumberSpoken = lastStartingNumberSpoken;

  while (true) {
    const lastSeenIndexOfLastNumber = numberToLastSeenIndex.get(
      lastNumberSpoken
    );
    const lastIndex = index - 1;
    const currentNumber =
      lastSeenIndexOfLastNumber === undefined
        ? 0
        : lastIndex - lastSeenIndexOfLastNumber;

    yield currentNumber;

    if (lastNumberSpoken !== null) {
      numberToLastSeenIndex.set(lastNumberSpoken, index - 1);
    }
    index++;
    lastNumberSpoken = currentNumber;
  }
}

export function get2020thNumber(startingNumbers: number[]): number {
  const result = chain(playGame(startingNumbers))
    .then(itemAtIndex(2020 - 1))
    .end();
  if (result === null) {
    throw new Error("unreachable");
  }
  return result;
}

export function get30000000thNumber(startingNumbers: number[]): number {
  const result = chain(playGame(startingNumbers))
    .then(itemAtIndex(30000000 - 1))
    .end();
  if (result === null) {
    throw new Error("unreachable");
  }
  return result;
}
