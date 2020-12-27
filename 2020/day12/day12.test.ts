import { manhattanDistanceToDestination } from "./day12";
import { expect } from "chai";

describe("manhattanDistanceToDestination", () => {
  const navigationInstructions = [
    { action: "F" as const, value: 10 },
    { action: "N" as const, value: 3 },
    { action: "F" as const, value: 7 },
    { action: "R" as const, value: 90 },
    { action: "F" as const, value: 11 },
  ];
  it("direction-based example", () => {
    expect(
      manhattanDistanceToDestination(navigationInstructions, false)
    ).to.equal(25);
  });
  it("waypoint-based example", () => {
    expect(
      manhattanDistanceToDestination(navigationInstructions, true)
    ).to.equal(286);
  });
});
