import chain from "@anoop901/js-util/chain";
import take from "@anoop901/js-util/iterables/take";
import toArray from "@anoop901/js-util/iterables/toArray";
import { expect } from "chai";
import { get2020thNumber, get30000000thNumber, playGame } from "./day15";

describe("day15", () => {
  describe("playGame", () => {
    it("example", () => {
      expect(
        chain(playGame([0, 3, 6]))
          .then(take(10))
          .then(toArray)
          .end()
      ).to.deep.equal([0, 3, 6, 0, 3, 3, 1, 0, 4, 0]);
    });
  });
  describe("get2020thNumber", () => {
    it("example 0", () => {
      expect(get2020thNumber([0, 3, 6])).to.equal(436);
    });
    it("example 1", () => {
      expect(get2020thNumber([1, 3, 2])).to.equal(1);
    });
    it("example 2", () => {
      expect(get2020thNumber([2, 1, 3])).to.equal(10);
    });
    it("example 3", () => {
      expect(get2020thNumber([1, 2, 3])).to.equal(27);
    });
    it("example 4", () => {
      expect(get2020thNumber([2, 3, 1])).to.equal(78);
    });
    it("example 5", () => {
      expect(get2020thNumber([3, 2, 1])).to.equal(438);
    });
    it("example 6", () => {
      expect(get2020thNumber([3, 1, 2])).to.equal(1836);
    });
  });

  describe("get30000000thNumber", () => {
    it("example 0", () => {
      expect(get30000000thNumber([0, 3, 6])).to.equal(175594);
    });
    it("example 1", () => {
      expect(get30000000thNumber([1, 3, 2])).to.equal(2578);
    });
    it("example 2", () => {
      expect(get30000000thNumber([2, 1, 3])).to.equal(3544142);
    });
    it("example 3", () => {
      expect(get30000000thNumber([1, 2, 3])).to.equal(261214);
    });
    it("example 4", () => {
      expect(get30000000thNumber([2, 3, 1])).to.equal(6895259);
    });
    it("example 5", () => {
      expect(get30000000thNumber([3, 2, 1])).to.equal(18);
    });
    it("example 6", () => {
      expect(get30000000thNumber([3, 1, 2])).to.equal(362);
    });
  });
});
