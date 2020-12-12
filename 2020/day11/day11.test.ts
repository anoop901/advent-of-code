import { numberOfOccupiedSeatsAfterStabilization, runRound } from "./day11";
import parseWaitingAreaState from "./parseWaitingAreaState";

describe("numberOfOccupiedSeatsAfterStabilization", () => {
  test("example", () => {
    expect(
      numberOfOccupiedSeatsAfterStabilization(
        parseWaitingAreaState(
          "L.LL.LL.LL\n" +
            "LLLLLLL.LL\n" +
            "L.L.L..L..\n" +
            "LLLL.LL.LL\n" +
            "L.LL.LL.LL\n" +
            "L.LLLLL.LL\n" +
            "..L.L.....\n" +
            "LLLLLLLLLL\n" +
            "L.LLLLLL.L\n" +
            "L.LLLLL.LL\n"
        )
      )
    ).toBe(37);
  });
});

describe("runRound", () => {
  test("example round 1", () => {
    const before = parseWaitingAreaState(
      "L.LL.LL.LL\n" +
        "LLLLLLL.LL\n" +
        "L.L.L..L..\n" +
        "LLLL.LL.LL\n" +
        "L.LL.LL.LL\n" +
        "L.LLLLL.LL\n" +
        "..L.L.....\n" +
        "LLLLLLLLLL\n" +
        "L.LLLLLL.L\n" +
        "L.LLLLL.LL\n"
    );
    const after = parseWaitingAreaState(
      "#.##.##.##\n" +
        "#######.##\n" +
        "#.#.#..#..\n" +
        "####.##.##\n" +
        "#.##.##.##\n" +
        "#.#####.##\n" +
        "..#.#.....\n" +
        "##########\n" +
        "#.######.#\n" +
        "#.#####.##\n"
    );
    expect(runRound(before)).toEqual(after);
  });

  test("example round 2", () => {
    const before = parseWaitingAreaState(
      "#.##.##.##\n" +
        "#######.##\n" +
        "#.#.#..#..\n" +
        "####.##.##\n" +
        "#.##.##.##\n" +
        "#.#####.##\n" +
        "..#.#.....\n" +
        "##########\n" +
        "#.######.#\n" +
        "#.#####.##\n"
    );
    const after = parseWaitingAreaState(
      "#.LL.L#.##\n" +
        "#LLLLLL.L#\n" +
        "L.L.L..L..\n" +
        "#LLL.LL.L#\n" +
        "#.LL.LL.LL\n" +
        "#.LLLL#.##\n" +
        "..L.L.....\n" +
        "#LLLLLLLL#\n" +
        "#.LLLLLL.L\n" +
        "#.#LLLL.##\n"
    );
    expect(runRound(before)).toEqual(after);
  });
});
