import { expect } from "chai";
import { coordinatesToString } from "./Coordinates";
import PocketDimension from "./PocketDimension";

describe("day17", () => {
  describe("PocketDimension", () => {
    describe("fromString", () => {
      it("basic", () => {
        const pocketDimensionString =
          "z=-1\n" +
          "#..\n" +
          "..#\n" +
          ".#.\n" +
          "\n" +
          "z=0\n" +
          "#.#\n" +
          ".##\n" +
          ".#.\n" +
          "\n" +
          "z=1\n" +
          "#..\n" +
          "..#\n" +
          ".#.\n";
        const pocketDimension = new PocketDimension(
          new Set<string>([
            coordinatesToString({ x: 0, y: 0, z: -1 }),
            coordinatesToString({ x: 2, y: 1, z: -1 }),
            coordinatesToString({ x: 1, y: 2, z: -1 }),
            coordinatesToString({ x: 0, y: 0, z: 0 }),
            coordinatesToString({ x: 2, y: 0, z: 0 }),
            coordinatesToString({ x: 1, y: 1, z: 0 }),
            coordinatesToString({ x: 2, y: 1, z: 0 }),
            coordinatesToString({ x: 1, y: 2, z: 0 }),
            coordinatesToString({ x: 0, y: 0, z: 1 }),
            coordinatesToString({ x: 2, y: 1, z: 1 }),
            coordinatesToString({ x: 1, y: 2, z: 1 }),
          ])
        );
        expect(PocketDimension.fromString(pocketDimensionString)).to.deep.equal(
          pocketDimension
        );
      });
    });
    describe("pad", () => {
      it("basic", () => {
        const before = PocketDimension.fromString(
          "z=-1\n" +
            "#..\n" +
            "..#\n" +
            ".#.\n" +
            "\n" +
            "z=0\n" +
            "#.#\n" +
            ".##\n" +
            ".#.\n" +
            "\n" +
            "z=1\n" +
            "#..\n" +
            "..#\n" +
            ".#.\n"
        );
        const after = PocketDimension.fromString(
          "z=-2\n" +
            ".....\n" +
            ".....\n" +
            ".....\n" +
            ".....\n" +
            ".....\n" +
            "\n" +
            "z=-1\n" +
            ".....\n" +
            ".#...\n" +
            "...#.\n" +
            "..#..\n" +
            ".....\n" +
            "\n" +
            "z=0\n" +
            ".....\n" +
            ".#.#.\n" +
            "..##.\n" +
            "..#..\n" +
            ".....\n" +
            "\n" +
            "z=1\n" +
            ".....\n" +
            ".#...\n" +
            "...#.\n" +
            "..#..\n" +
            ".....\n" +
            "\n" +
            "z=2\n" +
            ".....\n" +
            ".....\n" +
            ".....\n" +
            ".....\n" +
            ".....\n"
        );
        expect(before.pad()).to.deep.equal(after);
      });
    });
  });
});
