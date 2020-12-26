import { manhattanDistanceToDestination } from "./day12";

describe("manhattanDistanceToDestination", () => {
  const navigationInstructions = [
    { action: "F" as const, value: 10 },
    { action: "N" as const, value: 3 },
    { action: "F" as const, value: 7 },
    { action: "R" as const, value: 90 },
    { action: "F" as const, value: 11 },
  ];
  test("direction-based example", () => {
    expect(manhattanDistanceToDestination(navigationInstructions, false)).toBe(
      25
    );
  });
  test("waypoint-based example", () => {
    expect(manhattanDistanceToDestination(navigationInstructions, true)).toBe(
      286
    );
  });
});
