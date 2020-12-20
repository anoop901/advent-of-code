import { countMatching, splitIterable } from "./iterators";

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
      countMatching([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], (x) => x % 3 === 0)
    ).toBe(3);
  });
  test("none matching", () => {
    expect(countMatching([1, 2, 4, 5, 7, 8, 10, 11], (x) => x % 3 === 0)).toBe(
      0
    );
  });
  test("all matching", () => {
    expect(countMatching([3, 6, 9], (x) => x % 3 === 0)).toBe(3);
  });
  test("empty iterable", () => {
    expect(countMatching([], (x) => x % 3 === 0)).toBe(0);
  });
});
