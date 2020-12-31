import { expect } from "chai";
import { coordinatesFromString, coordinatesToString } from "./Coordinates";

describe("day17", () => {
  describe("coordinatesToString", () => {
    it("basic", () => {
      expect(coordinatesToString({ x: 4, y: 2, z: 9 })).to.equal("4,2,9");
    });
  });
  describe("coordinatesFromString", () => {
    it("basic", () => {
      expect(coordinatesFromString("4,2,9")).to.deep.equal({
        x: 4,
        y: 2,
        z: 9,
      });
    });
  });
});
