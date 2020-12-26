import { manhattanDistanceToDestination } from "./day12";

describe("manhattanDistanceToDestination", () => {
  test("example", () => {
    const navigationInstructions = [
      { action: "F", value: 10 },
      { action: "N", value: 3 },
      { action: "F", value: 7 },
      { action: "R", value: 90 },
      { action: "F", value: 11 },
      { action: "F", value: 0 },
    ];

    expect(manhattanDistanceToDestination(navigationInstructions)).toBe(25);
  });
});
