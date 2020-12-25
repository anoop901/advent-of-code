import {
  findNeighborLocationsImmediate,
  numberOfOccupiedSeatsAfterStabilization,
  runRound,
} from "./day11";
import parseWaitingAreaState from "./parseWaitingAreaState";

describe("numberOfOccupiedSeatsAfterStabilization", () => {
  describe("based on immediate neighbors", () => {
    test("example", () => {
      expect(
        numberOfOccupiedSeatsAfterStabilization(
          parseWaitingAreaState([
            "L.LL.LL.LL",
            "LLLLLLL.LL",
            "L.L.L..L..",
            "LLLL.LL.LL",
            "L.LL.LL.LL",
            "L.LLLLL.LL",
            "..L.L.....",
            "LLLLLLLLLL",
            "L.LLLLLL.L",
            "L.LLLLL.LL",
          ]),
          findNeighborLocationsImmediate
        )
      ).toBe(37);
    });
  });
});

describe("runRound", () => {
  describe("based on immediate neighbors", () => {
    test("example round 1", () => {
      const before = parseWaitingAreaState([
        "L.LL.LL.LL",
        "LLLLLLL.LL",
        "L.L.L..L..",
        "LLLL.LL.LL",
        "L.LL.LL.LL",
        "L.LLLLL.LL",
        "..L.L.....",
        "LLLLLLLLLL",
        "L.LLLLLL.L",
        "L.LLLLL.LL",
      ]);
      const after = parseWaitingAreaState([
        "#.##.##.##",
        "#######.##",
        "#.#.#..#..",
        "####.##.##",
        "#.##.##.##",
        "#.#####.##",
        "..#.#.....",
        "##########",
        "#.######.#",
        "#.#####.##",
      ]);
      expect(runRound(before, findNeighborLocationsImmediate)).toEqual(after);
    });

    test("example round 2", () => {
      const before = parseWaitingAreaState([
        "#.##.##.##",
        "#######.##",
        "#.#.#..#..",
        "####.##.##",
        "#.##.##.##",
        "#.#####.##",
        "..#.#.....",
        "##########",
        "#.######.#",
        "#.#####.##",
      ]);
      const after = parseWaitingAreaState([
        "#.LL.L#.##",
        "#LLLLLL.L#",
        "L.L.L..L..",
        "#LLL.LL.L#",
        "#.LL.LL.LL",
        "#.LLLL#.##",
        "..L.L.....",
        "#LLLLLLLL#",
        "#.LLLLLL.L",
        "#.#LLLL.##",
      ]);
      expect(runRound(before, findNeighborLocationsImmediate)).toEqual(after);
    });

    test("example round 3", () => {
      const before = parseWaitingAreaState([
        "#.LL.L#.##",
        "#LLLLLL.L#",
        "L.L.L..L..",
        "#LLL.LL.L#",
        "#.LL.LL.LL",
        "#.LLLL#.##",
        "..L.L.....",
        "#LLLLLLLL#",
        "#.LLLLLL.L",
        "#.#LLLL.##",
      ]);
      const after = parseWaitingAreaState([
        "#.##.L#.##",
        "#L###LL.L#",
        "L.#.#..#..",
        "#L##.##.L#",
        "#.##.LL.LL",
        "#.###L#.##",
        "..#.#.....",
        "#L######L#",
        "#.LL###L.L",
        "#.#L###.##",
      ]);
      expect(runRound(before, findNeighborLocationsImmediate)).toEqual(after);
    });

    test("example round 4", () => {
      const before = parseWaitingAreaState([
        "#.##.L#.##",
        "#L###LL.L#",
        "L.#.#..#..",
        "#L##.##.L#",
        "#.##.LL.LL",
        "#.###L#.##",
        "..#.#.....",
        "#L######L#",
        "#.LL###L.L",
        "#.#L###.##",
      ]);
      const after = parseWaitingAreaState([
        "#.#L.L#.##",
        "#LLL#LL.L#",
        "L.L.L..#..",
        "#LLL.##.L#",
        "#.LL.LL.LL",
        "#.LL#L#.##",
        "..L.L.....",
        "#L#LLLL#L#",
        "#.LLLLLL.L",
        "#.#L#L#.##",
      ]);
      expect(runRound(before, findNeighborLocationsImmediate)).toEqual(after);
    });

    test("example round 5", () => {
      const before = parseWaitingAreaState([
        "#.#L.L#.##",
        "#LLL#LL.L#",
        "L.L.L..#..",
        "#LLL.##.L#",
        "#.LL.LL.LL",
        "#.LL#L#.##",
        "..L.L.....",
        "#L#LLLL#L#",
        "#.LLLLLL.L",
        "#.#L#L#.##",
      ]);
      const after = parseWaitingAreaState([
        "#.#L.L#.##",
        "#LLL#LL.L#",
        "L.#.L..#..",
        "#L##.##.L#",
        "#.#L.LL.LL",
        "#.#L#L#.##",
        "..L.L.....",
        "#L#L##L#L#",
        "#.LLLLLL.L",
        "#.#L#L#.##",
      ]);
      expect(runRound(before, findNeighborLocationsImmediate)).toEqual(after);
    });
  });
});
