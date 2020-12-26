import { earliestBusAvailable } from "./day13";

describe("earliestBusAvailable", () => {
  test("example", () => {
    const busSchedule = [7, 13, null, null, 59, null, 31, 19];
    const { busId, waitTime } = earliestBusAvailable(939, busSchedule);
    expect(busId).toBe(59);
    expect(waitTime).toBe(5);
  });
});
