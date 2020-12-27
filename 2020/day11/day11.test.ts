import {
  behavior1,
  behavior2,
  findNeighborLocationsVisible,
  numberOfOccupiedSeatsAfterStabilization,
  runRound,
} from "./day11";
import parseWaitingAreaState from "./parseWaitingAreaState";
import { expect } from "chai";

describe("day11", () => {
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
      it("example", () => {
        expect(
          numberOfOccupiedSeatsAfterStabilization(waitingAreaState, behavior1)
        ).to.equal(37);
      });
    });
    describe("based on behavior 2", () => {
      it("example", () => {
        expect(
          numberOfOccupiedSeatsAfterStabilization(waitingAreaState, behavior2)
        ).to.equal(26);
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
      it("example round 1", () => {
        expect(runRound(waitingAreaState, behavior1)).to.deep.equal(
          waitingAreaState1
        );
      });

      it("example round 2", () => {
        expect(runRound(waitingAreaState1, behavior1)).to.deep.equal(
          waitingAreaState2
        );
      });

      it("example round 3", () => {
        expect(runRound(waitingAreaState2, behavior1)).to.deep.equal(
          waitingAreaState3
        );
      });

      it("example round 4", () => {
        expect(runRound(waitingAreaState3, behavior1)).to.deep.equal(
          waitingAreaState4
        );
      });

      it("example round 5", () => {
        expect(runRound(waitingAreaState4, behavior1)).to.deep.equal(
          waitingAreaState5
        );
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
      it("example round 1", () => {
        expect(runRound(waitingAreaState, behavior2)).to.deep.equal(
          waitingAreaState1
        );
      });
      it("example round 2", () => {
        expect(runRound(waitingAreaState1, behavior2)).to.deep.equal(
          waitingAreaState2
        );
      });
      it("example round 3", () => {
        expect(runRound(waitingAreaState2, behavior2)).to.deep.equal(
          waitingAreaState3
        );
      });
      it("example round 4", () => {
        expect(runRound(waitingAreaState3, behavior2)).to.deep.equal(
          waitingAreaState4
        );
      });
      it("example round 5", () => {
        expect(runRound(waitingAreaState4, behavior2)).to.deep.equal(
          waitingAreaState5
        );
      });
      it("example round 6", () => {
        expect(runRound(waitingAreaState5, behavior2)).to.deep.equal(
          waitingAreaState6
        );
      });
    });
  });

  describe("findNeighborLocationsVisible", () => {
    it("seat visible in all directions", () => {
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
        Array.from(
          findNeighborLocationsVisible({ x: 3, y: 4 }, waitingAreaState)
        )
      ).to.deep.equal([
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
    it("obscured seats", () => {
      const waitingAreaState = parseWaitingAreaState([
        ".............",
        ".L.L.#.#.#.#.",
        ".............",
      ]);
      expect(
        Array.from(
          findNeighborLocationsVisible({ x: 1, y: 1 }, waitingAreaState)
        )
      ).to.deep.equal([{ x: 3, y: 1 }]);
    });
    it("no visible seats", () => {
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
        Array.from(
          findNeighborLocationsVisible({ x: 3, y: 3 }, waitingAreaState)
        )
      ).to.deep.equal([]);
    });
  });
});
