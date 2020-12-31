import { expect } from "chai";
import { describe } from "mocha";
import { simulateCycle } from "./day17";
import PocketDimension from "./PocketDimension";

describe("day17", () => {
  describe("simulateCycle", () => {
    const pocketDimension0 = PocketDimension.fromString(
      "z=0\n" + ".#.\n" + "..#\n" + "###\n"
    );
    const pocketDimension1 = PocketDimension.fromString(
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
    const pocketDimension2 = PocketDimension.fromString(
      "z=-2\n" +
        ".....\n" +
        ".....\n" +
        "..#..\n" +
        ".....\n" +
        ".....\n" +
        "\n" +
        "z=-1\n" +
        "..#..\n" +
        ".#..#\n" +
        "....#\n" +
        ".#...\n" +
        ".....\n" +
        "\n" +
        "z=0\n" +
        "##...\n" +
        "##...\n" +
        "#....\n" +
        "....#\n" +
        ".###.\n" +
        "\n" +
        "z=1\n" +
        "..#..\n" +
        ".#..#\n" +
        "....#\n" +
        ".#...\n" +
        ".....\n" +
        "\n" +
        "z=2\n" +
        ".....\n" +
        ".....\n" +
        "..#..\n" +
        ".....\n" +
        ".....\n"
    );
    const pocketDimension3 = PocketDimension.fromString(
      "z=-2\n" +
        ".......\n" +
        ".......\n" +
        "..##...\n" +
        "..###..\n" +
        ".......\n" +
        ".......\n" +
        ".......\n" +
        "\n" +
        "z=-1\n" +
        "..#....\n" +
        "...#...\n" +
        "#......\n" +
        ".....##\n" +
        ".#...#.\n" +
        "..#.#..\n" +
        "...#...\n" +
        "\n" +
        "z=0\n" +
        "...#...\n" +
        ".......\n" +
        "#......\n" +
        ".......\n" +
        ".....##\n" +
        ".##.#..\n" +
        "...#...\n" +
        "\n" +
        "z=1\n" +
        "..#....\n" +
        "...#...\n" +
        "#......\n" +
        ".....##\n" +
        ".#...#.\n" +
        "..#.#..\n" +
        "...#...\n" +
        "\n" +
        "z=2\n" +
        ".......\n" +
        ".......\n" +
        "..##...\n" +
        "..###..\n" +
        ".......\n" +
        ".......\n" +
        ".......\n"
    );
    it("cycle 1", () => {
      expect(simulateCycle(pocketDimension0)).to.deep.equal(pocketDimension1);
    });
    it("cycle 2", () => {
      expect(simulateCycle(pocketDimension1)).to.deep.equal(pocketDimension2);
    });
    it("cycle 3", () => {
      console.log(pocketDimension3);
      expect(simulateCycle(pocketDimension2)).to.deep.equal(pocketDimension3);
    });
  });
});
