import { numberOfOccupiedSeatsAfterStabilization, runRound } from "./day11";
import parseWaitingAreaState from "./parseWaitingAreaState";

describe("numberOfOccupiedSeatsAfterStabilization", () => {
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
        ])
      )
    ).toBe(37);
  });
});

describe("runRound", () => {
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
    expect(runRound(before)).toEqual(after);
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
    expect(runRound(before)).toEqual(after);
  });
});
