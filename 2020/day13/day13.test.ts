import {
  earliestBusAvailable,
  earliestTimestampWhenBusesLineUp,
} from "./day13";
import { expect } from "chai";

describe("day13", () => {
  const busSchedule = [7, 13, null, null, 59, null, 31, 19];
  describe("earliestBusAvailable", () => {
    it("example", () => {
      const { busId, waitTime } = earliestBusAvailable(939, busSchedule);
      expect(busId).to.equal(59);
      expect(waitTime).to.equal(5);
    });
  });

  describe("earliestTimestampWhenBusesLineUp", () => {
    it("example 1", () => {
      expect(earliestTimestampWhenBusesLineUp(busSchedule)).to.equal(1068781);
    });
    it("example 2", () => {
      const busSchedule = [17, null, 13, 19];
      expect(earliestTimestampWhenBusesLineUp(busSchedule)).to.equal(3417);
    });
    it("example 3", () => {
      const busSchedule = [67, 7, 59, 61];
      expect(earliestTimestampWhenBusesLineUp(busSchedule)).to.equal(754018);
    });
    it("example 4", () => {
      const busSchedule = [67, null, 7, 59, 61];
      expect(earliestTimestampWhenBusesLineUp(busSchedule)).to.equal(779210);
    });
    it("example 5", () => {
      const busSchedule = [67, 7, null, 59, 61];
      expect(earliestTimestampWhenBusesLineUp(busSchedule)).to.equal(1261476);
    });
    it("example 6", () => {
      const busSchedule = [1789, 37, 47, 1889];
      expect(earliestTimestampWhenBusesLineUp(busSchedule)).to.equal(
        1202161486
      );
    });
  });
});
