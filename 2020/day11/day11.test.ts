import {
  behavior1,
  behavior2,
  findNeighborLocationsVisible,
  numberOfOccupiedSeatsAfterStabilization,
  runRound,
} from "./day11";
import parseWaitingAreaState from "./parseWaitingAreaState";

const waitingAreaState = parseWaitingAreaState([
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

describe("numberOfOccupiedSeatsAfterStabilization", () => {
  describe("based on behavior 1", () => {
    test("example", () => {
      expect(
        numberOfOccupiedSeatsAfterStabilization(waitingAreaState, behavior1)
      ).toBe(37);
    });
  });
  describe("based on behavior 2", () => {
    test("example", () => {
      expect(
        numberOfOccupiedSeatsAfterStabilization(waitingAreaState, behavior2)
      ).toBe(26);
    });
  });
});

describe("runRound", () => {
  describe("based on immediate neighbors", () => {
    const waitingAreaState1 = parseWaitingAreaState([
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
    const waitingAreaState2 = parseWaitingAreaState([
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
    const waitingAreaState3 = parseWaitingAreaState([
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
    const waitingAreaState4 = parseWaitingAreaState([
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
    const waitingAreaState5 = parseWaitingAreaState([
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
    test("example round 1", () => {
      expect(runRound(waitingAreaState, behavior1)).toEqual(waitingAreaState1);
    });

    test("example round 2", () => {
      expect(runRound(waitingAreaState1, behavior1)).toEqual(waitingAreaState2);
    });

    test("example round 3", () => {
      expect(runRound(waitingAreaState2, behavior1)).toEqual(waitingAreaState3);
    });

    test("example round 4", () => {
      expect(runRound(waitingAreaState3, behavior1)).toEqual(waitingAreaState4);
    });

    test("example round 5", () => {
      expect(runRound(waitingAreaState4, behavior1)).toEqual(waitingAreaState5);
    });
  });
  describe("based on visible neighbors", () => {
    const waitingAreaState1 = parseWaitingAreaState([
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
    const waitingAreaState2 = parseWaitingAreaState([
      "#.LL.LL.L#",
      "#LLLLLL.LL",
      "L.L.L..L..",
      "LLLL.LL.LL",
      "L.LL.LL.LL",
      "L.LLLLL.LL",
      "..L.L.....",
      "LLLLLLLLL#",
      "#.LLLLLL.L",
      "#.LLLLL.L#",
    ]);
    const waitingAreaState3 = parseWaitingAreaState([
      "#.L#.##.L#",
      "#L#####.LL",
      "L.#.#..#..",
      "##L#.##.##",
      "#.##.#L.##",
      "#.#####.#L",
      "..#.#.....",
      "LLL####LL#",
      "#.L#####.L",
      "#.L####.L#",
    ]);
    const waitingAreaState4 = parseWaitingAreaState([
      "#.L#.L#.L#",
      "#LLLLLL.LL",
      "L.L.L..#..",
      "##LL.LL.L#",
      "L.LL.LL.L#",
      "#.LLLLL.LL",
      "..L.L.....",
      "LLLLLLLLL#",
      "#.LLLLL#.L",
      "#.L#LL#.L#",
    ]);
    const waitingAreaState5 = parseWaitingAreaState([
      "#.L#.L#.L#",
      "#LLLLLL.LL",
      "L.L.L..#..",
      "##L#.#L.L#",
      "L.L#.#L.L#",
      "#.L####.LL",
      "..#.#.....",
      "LLL###LLL#",
      "#.LLLLL#.L",
      "#.L#LL#.L#",
    ]);
    const waitingAreaState6 = parseWaitingAreaState([
      "#.L#.L#.L#",
      "#LLLLLL.LL",
      "L.L.L..#..",
      "##L#.#L.L#",
      "L.L#.LL.L#",
      "#.LLLL#.LL",
      "..#.L.....",
      "LLL###LLL#",
      "#.LLLLL#.L",
      "#.L#LL#.L#",
    ]);
    test("example round 1", () => {
      expect(runRound(waitingAreaState, behavior2)).toEqual(waitingAreaState1);
    });
    test("example round 2", () => {
      expect(runRound(waitingAreaState1, behavior2)).toEqual(waitingAreaState2);
    });
    test("example round 3", () => {
      expect(runRound(waitingAreaState2, behavior2)).toEqual(waitingAreaState3);
    });
    test("example round 4", () => {
      expect(runRound(waitingAreaState3, behavior2)).toEqual(waitingAreaState4);
    });
    test("example round 5", () => {
      expect(runRound(waitingAreaState4, behavior2)).toEqual(waitingAreaState5);
    });
    test("example round 6", () => {
      expect(runRound(waitingAreaState5, behavior2)).toEqual(waitingAreaState6);
    });
  });
});

describe("findNeighborLocationsVisible", () => {
  test("seat visible in all directions", () => {
    const waitingAreaState = parseWaitingAreaState([
      ".......#.",
      "...#.....",
      ".#.......",
      ".........",
      "..#L....#",
      "....#....",
      ".........",
      "#........",
      "...#.....",
    ]);
    expect(
      Array.from(findNeighborLocationsVisible({ x: 3, y: 4 }, waitingAreaState))
    ).toEqual([
      { x: 1, y: 2 },
      { x: 2, y: 4 },
      { x: 0, y: 7 },
      { x: 3, y: 1 },
      { x: 3, y: 8 },
      { x: 7, y: 0 },
      { x: 8, y: 4 },
      { x: 4, y: 5 },
    ]);
  });
  test("obscured seats", () => {
    const waitingAreaState = parseWaitingAreaState([
      ".............",
      ".L.L.#.#.#.#.",
      ".............",
    ]);
    expect(
      Array.from(findNeighborLocationsVisible({ x: 1, y: 1 }, waitingAreaState))
    ).toEqual([{ x: 3, y: 1 }]);
  });
  test("no visible seats", () => {
    const waitingAreaState = parseWaitingAreaState([
      ".##.##.",
      "#.#.#.#",
      "##...##",
      "...L...",
      "##...##",
      "#.#.#.#",
      ".##.##.",
    ]);
    expect(
      Array.from(findNeighborLocationsVisible({ x: 3, y: 3 }, waitingAreaState))
    ).toEqual([]);
  });
});
