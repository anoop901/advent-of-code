import chain from "./chain";
import {
  allIntegersStartingAt,
  allMatch,
  anyMatch,
  countMatching,
  drop,
  enumerate,
  filter,
  filterNonNullish,
  findFirstMatching,
  fold,
  itemAtIndex,
  length,
  map,
  mapFilter,
  max,
  maxBy,
  min,
  minBy,
  pairs,
  reduce,
  repeat,
  slice,
  split,
  sum,
  take,
  takeWhile,
  toArray,
  zip,
} from "./iterables";
import { expect } from "chai";

describe("iterables", () => {
  describe("split", () => {
    it("basic", () => {
      expect(Array.from(split(0)([3, 4, 5, 0, 6, 7, 0, 8]))).to.deep.equal([
        [3, 4, 5],
        [6, 7],
        [8],
      ]);
    });
    it("multiple consecutive separators", () => {
      expect(Array.from(split(0)([3, 4, 5, 0, 0, 6, 7, 0, 8]))).to.deep.equal([
        [3, 4, 5],
        [6, 7],
        [8],
      ]);
    });
    it("separators only", () => {
      expect(Array.from(split(0)([0, 0, 0]))).to.deep.equal([]);
    });
    it("empty list", () => {
      expect(Array.from(split(0)([]))).to.deep.equal([]);
    });
    it("only one chunk", () => {
      expect(Array.from(split(0)([3, 4]))).to.deep.equal([[3, 4]]);
    });
    it("chunks have only one element", () => {
      expect(Array.from(split(0)([3, 0, 4]))).to.deep.equal([[3], [4]]);
    });
    it("separator at beginning", () => {
      expect(Array.from(split(0)([0, 3, 4]))).to.deep.equal([[3, 4]]);
    });
    it("separator at end", () => {
      expect(Array.from(split(0)([3, 4, 0]))).to.deep.equal([[3, 4]]);
    });
  });

  describe("countMatching", () => {
    it("basic", () => {
      expect(
        chain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
          .then(countMatching((x) => x % 3 === 0))
          .end()
      ).to.equal(3);
    });
    it("none matching", () => {
      expect(
        chain([1, 2, 4, 5, 7, 8, 10, 11])
          .then(countMatching((x) => x % 3 === 0))
          .end()
      ).to.equal(0);
    });
    it("all matching", () => {
      expect(
        chain([3, 6, 9])
          .then(countMatching((x) => x % 3 === 0))
          .end()
      ).to.equal(3);
    });
    it("empty iterable", () => {
      expect(
        chain([])
          .then(countMatching((x) => x % 3 === 0))
          .end()
      ).to.equal(0);
    });
  });

  describe("allIntegersStartingAt", () => {
    it("start at 0", () => {
      const iter = allIntegersStartingAt();
      expect(iter.next()).to.deep.equal({ value: 0, done: false });
      expect(iter.next()).to.deep.equal({ value: 1, done: false });
      expect(iter.next()).to.deep.equal({ value: 2, done: false });
      expect(iter.next()).to.deep.equal({ value: 3, done: false });
      expect(iter.next()).to.deep.equal({ value: 4, done: false });
    });
    it("start at 123", () => {
      const iter = allIntegersStartingAt(123);
      expect(iter.next()).to.deep.equal({ value: 123, done: false });
      expect(iter.next()).to.deep.equal({ value: 124, done: false });
      expect(iter.next()).to.deep.equal({ value: 125, done: false });
      expect(iter.next()).to.deep.equal({ value: 126, done: false });
      expect(iter.next()).to.deep.equal({ value: 127, done: false });
    });
  });

  describe("findFirstMatching", () => {
    it("basic", () => {
      expect(
        findFirstMatching((x: number) => x % 10 === 0)([6, 11, 50, 28, 80])
      ).to.equal(50);
    });
    it("match at beginning", () => {
      expect(
        findFirstMatching((x: number) => x % 10 === 0)([40, 6, 11, 50, 28, 80])
      ).to.equal(40);
    });
    it("no match", () => {
      expect(findFirstMatching((x: number) => x % 10 === 0)([6, 11, 28])).to.be
        .null;
    });
    it("infinite", () => {
      expect(
        findFirstMatching((x: number) => x % 10 === 0)(
          allIntegersStartingAt(123)
        )
      ).to.equal(130);
    });
  });

  describe("map", () => {
    it("basic", () => {
      const iter = map((x: number) => x * 10)([2, 5, 3]);
      expect(Array.from(iter)).to.deep.equal([20, 50, 30]);
    });
    it("infinite", () => {
      const iter = map((x: number) => x * 10)(allIntegersStartingAt(5));
      expect(iter.next()).to.deep.equal({ value: 50, done: false });
      expect(iter.next()).to.deep.equal({ value: 60, done: false });
      expect(iter.next()).to.deep.equal({ value: 70, done: false });
      expect(iter.next()).to.deep.equal({ value: 80, done: false });
      expect(iter.next()).to.deep.equal({ value: 90, done: false });
    });
    it("change type", () => {
      const iter = map((x: string) => x.length)([
        "the",
        "quick",
        "brown",
        "fox",
      ]);
      expect(Array.from(iter)).to.deep.equal([3, 5, 5, 3]);
    });
  });

  describe("takeWhile", () => {
    it("basic", () => {
      const iter = takeWhile((x: number) => x % 10 !== 0)([6, 11, 50, 28, 80]);
      expect(Array.from(iter)).to.deep.equal([6, 11]);
    });
    it("take entire iterable", () => {
      const iter = takeWhile((x: number) => x % 10 !== 0)([6, 11, 28]);
      expect(Array.from(iter)).to.deep.equal([6, 11, 28]);
    });
    it("infinite", () => {
      const iter = takeWhile((x: number) => x % 10 !== 0)(
        allIntegersStartingAt(127)
      );
      expect(Array.from(iter)).to.deep.equal([127, 128, 129]);
    });
  });

  describe("filter", () => {
    it("basic", () => {
      const iter = filter((x: number) => x % 10 === 0)([6, 11, 50, 28, 80]);
      expect(Array.from(iter)).to.deep.equal([50, 80]);
    });
    it("all match", () => {
      const iter = filter((x: number) => x % 10 === 0)([50, 80, 70]);
      expect(Array.from(iter)).to.deep.equal([50, 80, 70]);
    });
    it("none match", () => {
      const iter = filter((x: number) => x % 10 === 0)([6, 11, 28]);
      expect(Array.from(iter)).to.deep.equal([]);
    });
  });

  describe("filterNonNullish", () => {
    it("iterable containing some nulls", () => {
      const iter = filterNonNullish([6, 11, null, 28, null]);
      expect(Array.from(iter)).to.deep.equal([6, 11, 28]);
    });
    it("iterable containing some undefineds", () => {
      const iter = filterNonNullish([6, 11, undefined, 28, undefined]);
      expect(Array.from(iter)).to.deep.equal([6, 11, 28]);
    });
    it("iterable containing some nulls and undefineds", () => {
      const iter = filterNonNullish([6, 11, undefined, 28, null]);
      expect(Array.from(iter)).to.deep.equal([6, 11, 28]);
    });
    it("all not nullish", () => {
      const iter = filterNonNullish([6, 11, 28]);
      expect(Array.from(iter)).to.deep.equal([6, 11, 28]);
    });
    it("all nullish", () => {
      const iter = filterNonNullish([null, null, null]);
      expect(Array.from(iter)).to.deep.equal([]);
    });
  });

  describe("length", () => {
    it("basic", () => {
      expect(length([3, 5, 2])).to.equal(3);
    });
    it("empty", () => {
      expect(length([])).to.equal(0);
    });
    it("from generator", () => {
      expect(
        chain(allIntegersStartingAt(0))
          .then(takeWhile((x) => x < 4))
          .then(length)
          .end()
      ).to.equal(4);
    });
  });

  describe("fold", () => {
    it("basic", () => {
      expect(fold(0, (acc, x: number) => acc + x)([5, 2, 9])).to.equal(16);
    });
    it("different accumulator type", () => {
      expect(
        fold(":", (acc, x: number) => acc + x.toString() + ":")([5, 2, 9])
      ).to.equal(":5:2:9:");
    });
  });

  describe("sum", () => {
    it("basic", () => {
      expect(sum([5, 2, 9])).to.equal(16);
    });
  });

  describe("zip", () => {
    it("same size", () => {
      expect(
        Array.from(
          zip([111, 22222, 33333, 444], ["the", "quick", "brown", "fox"])
        )
      ).to.deep.equal([
        { first: 111, second: "the" },
        { first: 22222, second: "quick" },
        { first: 33333, second: "brown" },
        { first: 444, second: "fox" },
      ]);
    });
    it("different sizes (bigger, smaller)", () => {
      expect(
        Array.from(
          zip([111, 22222, 33333, 444, 5, 6], ["the", "quick", "brown", "fox"])
        )
      ).to.deep.equal([
        { first: 111, second: "the" },
        { first: 22222, second: "quick" },
        { first: 33333, second: "brown" },
        { first: 444, second: "fox" },
      ]);
    });
    it("different sizes (smaller, bigger)", () => {
      expect(
        Array.from(zip([111, 22222], ["the", "quick", "brown", "fox"]))
      ).to.deep.equal([
        { first: 111, second: "the" },
        { first: 22222, second: "quick" },
      ]);
    });
    it("first empty", () => {
      expect(
        Array.from(zip([], ["the", "quick", "brown", "fox"]))
      ).to.deep.equal([]);
    });
    it("second empty", () => {
      expect(Array.from(zip([1, 2, 3, 4], []))).to.deep.equal([]);
    });
    it("both empty", () => {
      expect(Array.from(zip([], []))).to.deep.equal([]);
    });
    it("one infinite", () => {
      expect(
        Array.from(
          zip(allIntegersStartingAt(0), ["the", "quick", "brown", "fox"])
        )
      ).to.deep.equal([
        { first: 0, second: "the" },
        { first: 1, second: "quick" },
        { first: 2, second: "brown" },
        { first: 3, second: "fox" },
      ]);
    });
  });

  describe("enumerate", () => {
    it("basic", () => {
      expect(
        Array.from(enumerate(["the", "quick", "brown", "fox"]))
      ).to.deep.equal([
        { index: 0, value: "the" },
        { index: 1, value: "quick" },
        { index: 2, value: "brown" },
        { index: 3, value: "fox" },
      ]);
    });
  });

  describe("slice", () => {
    it("basic", () => {
      expect(
        Array.from(
          slice(2, 5)(["the", "quick", "brown", "fox", "jumps", "over"])
        )
      ).to.deep.equal(["brown", "fox", "jumps"]);
    });
    it("infinite", () => {
      expect(Array.from(slice(2, 5)(allIntegersStartingAt(10)))).to.deep.equal([
        12,
        13,
        14,
      ]);
    });
    it("end out of bounds", () => {
      expect(
        Array.from(slice(2, 5)(["the", "quick", "brown", "fox"]))
      ).to.deep.equal(["brown", "fox"]);
    });
    it("start and end out of bounds", () => {
      expect(
        Array.from(slice(5, 7)(["the", "quick", "brown", "fox"]))
      ).to.deep.equal([]);
    });
    it("start and end equal", () => {
      expect(
        Array.from(slice(2, 2)(["the", "quick", "brown", "fox"]))
      ).to.deep.equal([]);
    });
    it("end before start", () => {
      expect(
        Array.from(slice(2, 1)(["the", "quick", "brown", "fox"]))
      ).to.deep.equal([]);
    });
  });

  describe("pairs", () => {
    it("basic", () => {
      expect(
        Array.from(pairs()(["the", "quick", "brown", "fox", "jumps"]))
      ).to.deep.equal([
        { first: "the", second: "quick" },
        { first: "quick", second: "brown" },
        { first: "brown", second: "fox" },
        { first: "fox", second: "jumps" },
      ]);
    });
    it("offset 2", () => {
      expect(
        Array.from(pairs(2)(["the", "quick", "brown", "fox", "jumps"]))
      ).to.deep.equal([
        { first: "the", second: "brown" },
        { first: "quick", second: "fox" },
        { first: "brown", second: "jumps" },
      ]);
    });
    it("empty iterable", () => {
      expect(Array.from(pairs()([]))).to.deep.equal([]);
    });
    it("one item in iterable", () => {
      expect(Array.from(pairs()(["one"]))).to.deep.equal([]);
    });
  });

  describe("toArray", () => {
    it("basic", () => {
      expect(toArray([3, 6, 5])).to.deep.equal([3, 6, 5]);
    });
    it("from generator", () => {
      expect(
        chain(allIntegersStartingAt(0))
          .then(takeWhile((x) => x < 4))
          .then(toArray)
          .end()
      ).to.deep.equal([0, 1, 2, 3]);
    });
  });

  describe("reduce", () => {
    it("basic", () => {
      expect(
        reduce((a, b) => a + ":" + b)(["the", "quick", "brown", "fox"])
      ).to.equal("the:quick:brown:fox");
    });
    it("one element", () => {
      expect(reduce((a, b) => a + ":" + b)(["fox"])).to.equal("fox");
    });
    it("empty causes error", () => {
      expect(() => reduce((a, b) => a + ":" + b)([])).to.throw();
    });
  });

  describe("min", () => {
    it("basic", () => {
      expect(min([3, 1, 5, 8, 3])).to.equal(1);
    });
    it("one element", () => {
      expect(min([5])).to.equal(5);
    });
    it("empty causes error", () => {
      expect(() => min([])).to.throw();
    });
  });

  describe("max", () => {
    it("basic", () => {
      expect(max([3, 1, 5, 8, 3])).to.equal(8);
    });
    it("one element", () => {
      expect(max([5])).to.equal(5);
    });
    it("empty causes error", () => {
      expect(() => max([])).to.throw();
    });
  });

  describe("minBy", () => {
    it("basic", () => {
      expect(
        minBy((x: string) => x.length)([
          "the",
          "quick",
          "brown",
          "fox",
          "jumps",
          "over",
          "an",
          "amazing",
          "dog",
        ])
      ).to.equal("an");
    });
    it("one element", () => {
      expect(minBy((x: string) => x.length)(["fox"])).to.equal("fox");
    });
    it("empty causes error", () => {
      expect(() => minBy((x: string) => x.length)([])).to.throw();
    });
  });

  describe("maxBy", () => {
    it("basic", () => {
      expect(
        maxBy((x: string) => x.length)([
          "the",
          "quick",
          "brown",
          "fox",
          "jumps",
          "over",
          "an",
          "amazing",
          "dog",
        ])
      ).to.equal("amazing");
    });
    it("one element", () => {
      expect(maxBy((x: string) => x.length)(["fox"])).to.equal("fox");
    });
    it("empty causes error", () => {
      expect(() => maxBy((x: string) => x.length)([])).to.throw();
    });
  });

  describe("mapFilter", () => {
    it("basic", () => {
      expect(
        chain([
          { a: 3, b: "the" },
          { a: null, b: "quick" },
          { a: null, b: "brown" },
          { a: 5, b: "fox" },
        ])
          .then(mapFilter(({ a }) => a))
          .then(toArray)
          .end()
      ).to.deep.equal([3, 5]);
    });
  });

  describe("drop", () => {
    it("basic", () => {
      expect(
        chain(["the", "quick", "brown", "fox", "jumped"])
          .then(drop(2))
          .then(toArray)
          .end()
      ).to.deep.equal(["brown", "fox", "jumped"]);
    });
    it("drop no elements", () => {
      expect(
        chain(["the", "quick", "brown", "fox", "jumped"])
          .then(drop(0))
          .then(toArray)
          .end()
      ).to.deep.equal(["the", "quick", "brown", "fox", "jumped"]);
    });
    it("drop one element", () => {
      expect(
        chain(["the", "quick", "brown", "fox", "jumped"])
          .then(drop(1))
          .then(toArray)
          .end()
      ).to.deep.equal(["quick", "brown", "fox", "jumped"]);
    });
    it("drop all elements", () => {
      expect(
        chain(["the", "quick", "brown", "fox", "jumped"])
          .then(drop(5))
          .then(toArray)
          .end()
      ).to.deep.equal([]);
    });
    it("drop more than all elements", () => {
      expect(
        chain(["the", "quick", "brown", "fox", "jumped"])
          .then(drop(7))
          .then(toArray)
          .end()
      ).to.deep.equal([]);
    });
    it("infinite", () => {
      const iter = drop(3)(allIntegersStartingAt(0))[Symbol.iterator]();
      expect(iter.next()).to.deep.equal({ value: 3, done: false });
      expect(iter.next()).to.deep.equal({ value: 4, done: false });
      expect(iter.next()).to.deep.equal({ value: 5, done: false });
    });
  });

  describe("take", () => {
    it("basic", () => {
      expect(
        chain(["the", "quick", "brown", "fox", "jumped"])
          .then(take(2))
          .then(toArray)
          .end()
      ).to.deep.equal(["the", "quick"]);
    });
    it("take no elements", () => {
      expect(
        chain(["the", "quick", "brown", "fox", "jumped"])
          .then(take(0))
          .then(toArray)
          .end()
      ).to.deep.equal([]);
    });
    it("take one element", () => {
      expect(
        chain(["the", "quick", "brown", "fox", "jumped"])
          .then(take(1))
          .then(toArray)
          .end()
      ).to.deep.equal(["the"]);
    });
    it("take all elements", () => {
      expect(
        chain(["the", "quick", "brown", "fox", "jumped"])
          .then(take(5))
          .then(toArray)
          .end()
      ).to.deep.equal(["the", "quick", "brown", "fox", "jumped"]);
    });
    it("take more than all elements", () => {
      expect(
        chain(["the", "quick", "brown", "fox", "jumped"])
          .then(take(7))
          .then(toArray)
          .end()
      ).to.deep.equal(["the", "quick", "brown", "fox", "jumped"]);
    });
    it("infinite", () => {
      expect(
        chain(allIntegersStartingAt(0)).then(take(3)).then(toArray).end()
      ).to.deep.equal([0, 1, 2]);
    });
  });
  describe("itemAtIndex", () => {
    it("basic", () => {
      expect(
        itemAtIndex(2)(["the", "quick", "brown", "fox", "jumps", "over"])
      ).to.equal("brown");
    });
    it("index 0", () => {
      expect(
        itemAtIndex(0)(["the", "quick", "brown", "fox", "jumps", "over"])
      ).to.equal("the");
    });
    it("last index", () => {
      expect(
        itemAtIndex(5)(["the", "quick", "brown", "fox", "jumps", "over"])
      ).to.equal("over");
    });
    it("out of bounds", () => {
      expect(
        itemAtIndex(8)(["the", "quick", "brown", "fox", "jumps", "over"])
      ).to.equal(null);
    });
  });

  describe("allMatch", () => {
    it("all match", () => {
      expect(
        chain([3, 6, 2, 6])
          .then(allMatch((x) => x < 10))
          .end()
      ).to.be.true;
    });
    it("mixed", () => {
      expect(
        chain([3, 6, 12, 6])
          .then(allMatch((x) => x < 10))
          .end()
      ).to.be.false;
    });
    it("none match", () => {
      expect(
        chain([13, 16, 12, 16])
          .then(allMatch((x) => x < 10))
          .end()
      ).to.be.false;
    });
    it("empty", () => {
      expect(
        chain([])
          .then(allMatch((x) => x < 10))
          .end()
      ).to.be.true;
    });
  });

  describe("anyMatch", () => {
    it("all match", () => {
      expect(
        chain([3, 6, 2, 6])
          .then(anyMatch((x) => x < 10))
          .end()
      ).to.be.true;
    });
    it("mixed", () => {
      expect(
        chain([3, 6, 12, 6])
          .then(anyMatch((x) => x < 10))
          .end()
      ).to.be.true;
    });
    it("none match", () => {
      expect(
        chain([13, 16, 12, 16])
          .then(anyMatch<number>((x) => x < 10))
          .end()
      ).to.be.false;
    });
    it("empty", () => {
      expect(
        chain([])
          .then(anyMatch((x) => x < 10))
          .end()
      ).to.be.false;
    });
  });
  describe("repeat", () => {
    it("basic", () => {
      expect(chain(repeat("buffalo", 3)).then(toArray).end()).to.deep.equal([
        "buffalo",
        "buffalo",
        "buffalo",
      ]);
    });
    it("0 times", () => {
      expect(chain(repeat("buffalo", 0)).then(toArray).end()).to.deep.equal([]);
    });
    it("infinite", () => {
      const iter = repeat("buffalo")[Symbol.iterator]();
      expect(iter.next()).to.deep.equal({ value: "buffalo", done: false });
      expect(iter.next()).to.deep.equal({ value: "buffalo", done: false });
      expect(iter.next()).to.deep.equal({ value: "buffalo", done: false });
      expect(iter.next()).to.deep.equal({ value: "buffalo", done: false });
      expect(iter.next()).to.deep.equal({ value: "buffalo", done: false });
    });
  });
});
