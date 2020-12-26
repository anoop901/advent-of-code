import {
  earliestBusAvailable,
  earliestTimestampWhenBusesLineUp,
} from "./day13";

const busSchedule = [7, 13, null, null, 59, null, 31, 19];

describe("earliestBusAvailable", () => {
  test("example", () => {
    const { busId, waitTime } = earliestBusAvailable(939, busSchedule);
    expect(busId).toBe(59);
    expect(waitTime).toBe(5);
  });
});

describe("earliestTimestampWhenBusesLineUp", () => {
  test("example 1", () => {
    expect(earliestTimestampWhenBusesLineUp(busSchedule)).toBe(1068781);
  });
  test("example 2", () => {
    const busSchedule = [17, null, 13, 19];
    expect(earliestTimestampWhenBusesLineUp(busSchedule)).toBe(3417);
  });
  test("example 3", () => {
    const busSchedule = [67, 7, 59, 61];
    expect(earliestTimestampWhenBusesLineUp(busSchedule)).toBe(754018);
  });
  test("example 4", () => {
    const busSchedule = [67, null, 7, 59, 61];
    expect(earliestTimestampWhenBusesLineUp(busSchedule)).toBe(779210);
  });
  test("example 5", () => {
    const busSchedule = [67, 7, null, 59, 61];
    expect(earliestTimestampWhenBusesLineUp(busSchedule)).toBe(1261476);
  });
  test("example 6", () => {
    const busSchedule = [1789, 37, 47, 1889];
    expect(earliestTimestampWhenBusesLineUp(busSchedule)).toBe(1202161486);
  });
});
