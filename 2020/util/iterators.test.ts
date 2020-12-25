import chain from "./chain";
import {
  allIntegersStartingAt,
  countMatching,
  findFirstMatching,
  map,
  splitIterable,
  takeWhile,
} from "./iterators";

describe("splitIterable", () => {
  test("basic", () => {
    expect(Array.from(splitIterable([3, 4, 5, 0, 6, 7, 0, 8], 0))).toEqual([
      [3, 4, 5],
      [6, 7],
      [8],
    ]);
  });
  test("multiple consecutive separators", () => {
    expect(Array.from(splitIterable([3, 4, 5, 0, 0, 6, 7, 0, 8], 0))).toEqual([
      [3, 4, 5],
      [6, 7],
      [8],
    ]);
  });
  test("separators only", () => {
    expect(Array.from(splitIterable([0, 0, 0], 0))).toEqual([]);
  });
  test("empty list", () => {
    expect(Array.from(splitIterable([], 0))).toEqual([]);
  });
  test("only one chunk", () => {
    expect(Array.from(splitIterable([3, 4], 0))).toEqual([[3, 4]]);
  });
  test("chunks have only one element", () => {
    expect(Array.from(splitIterable([3, 0, 4], 0))).toEqual([[3], [4]]);
  });
  test("separator at beginning", () => {
    expect(Array.from(splitIterable([0, 3, 4], 0))).toEqual([[3, 4]]);
  });
  test("separator at end", () => {
    expect(Array.from(splitIterable([3, 4, 0], 0))).toEqual([[3, 4]]);
  });
});

describe("countMatching", () => {
  test("basic", () => {
    expect(
      chain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
        .then(countMatching((x) => x % 3 === 0))
        .run()
    ).toBe(3);
  });
  test("none matching", () => {
    expect(
      chain([1, 2, 4, 5, 7, 8, 10, 11])
        .then(countMatching((x) => x % 3 === 0))
        .run()
    ).toBe(0);
  });
  test("all matching", () => {
    expect(
      chain([3, 6, 9])
        .then(countMatching((x) => x % 3 === 0))
        .run()
    ).toBe(3);
  });
  test("empty iterable", () => {
    expect(
      chain([])
        .then(countMatching((x) => x % 3 === 0))
        .run()
    ).toBe(0);
  });
});

describe("allIntegersStartingAt", () => {
  test("start at 0", () => {
    const iter = allIntegersStartingAt();
    expect(iter.next()).toEqual({ value: 0, done: false });
    expect(iter.next()).toEqual({ value: 1, done: false });
    expect(iter.next()).toEqual({ value: 2, done: false });
    expect(iter.next()).toEqual({ value: 3, done: false });
    expect(iter.next()).toEqual({ value: 4, done: false });
  });
  test("start at 123", () => {
    const iter = allIntegersStartingAt(123);
    expect(iter.next()).toEqual({ value: 123, done: false });
    expect(iter.next()).toEqual({ value: 124, done: false });
    expect(iter.next()).toEqual({ value: 125, done: false });
    expect(iter.next()).toEqual({ value: 126, done: false });
    expect(iter.next()).toEqual({ value: 127, done: false });
  });
});

describe("findFirstMatching", () => {
  test("basic", () => {
    expect(
      findFirstMatching((x: number) => x % 10 === 0)([6, 11, 50, 28, 80])
    ).toBe(50);
  });
  test("no match", () => {
    expect(
      findFirstMatching((x: number) => x % 10 === 0)([6, 11, 28])
    ).toBeNull();
  });
  test("infinite", () => {
    expect(
      findFirstMatching((x: number) => x % 10 === 0)(allIntegersStartingAt(123))
    ).toBe(130);
  });
});

describe("map", () => {
  test("basic", () => {
    const iter = map((x: number) => x * 10)([2, 5, 3]);
    expect(iter.next()).toEqual({ value: 20, done: false });
    expect(iter.next()).toEqual({ value: 50, done: false });
    expect(iter.next()).toEqual({ value: 30, done: false });
    expect(iter.next()).toEqual({ done: true });
  });
  test("infinite", () => {
    const iter = map((x: number) => x * 10)(allIntegersStartingAt(5));
    expect(iter.next()).toEqual({ value: 50, done: false });
    expect(iter.next()).toEqual({ value: 60, done: false });
    expect(iter.next()).toEqual({ value: 70, done: false });
    expect(iter.next()).toEqual({ value: 80, done: false });
    expect(iter.next()).toEqual({ value: 90, done: false });
  });
  test("change type", () => {
    const iter = map((x: string) => x.length)(["the", "quick", "brown", "fox"]);
    expect(iter.next()).toEqual({ value: 3, done: false });
    expect(iter.next()).toEqual({ value: 5, done: false });
    expect(iter.next()).toEqual({ value: 5, done: false });
    expect(iter.next()).toEqual({ value: 3, done: false });
    expect(iter.next()).toEqual({ done: true });
  });
});

describe("takeWhile", () => {
  test("basic", () => {
    const iter = takeWhile((x: number) => x % 10 !== 0)([6, 11, 50, 28, 80]);
    expect(iter.next()).toEqual({ value: 6, done: false });
    expect(iter.next()).toEqual({ value: 11, done: false });
    expect(iter.next()).toEqual({ done: true });
  });
  test("all match", () => {
    const iter = takeWhile((x: number) => x % 10 !== 0)([6, 11, 28]);
    expect(iter.next()).toEqual({ value: 6, done: false });
    expect(iter.next()).toEqual({ value: 11, done: false });
    expect(iter.next()).toEqual({ value: 28, done: false });
    expect(iter.next()).toEqual({ done: true });
  });
  test("infinite", () => {
    const iter = takeWhile((x: number) => x % 10 !== 0)(
      allIntegersStartingAt(127)
    );
    expect(iter.next()).toEqual({ value: 127, done: false });
    expect(iter.next()).toEqual({ value: 128, done: false });
    expect(iter.next()).toEqual({ value: 129, done: false });
    expect(iter.next()).toEqual({ done: true });
  });
});
