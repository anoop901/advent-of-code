import { expect } from "chai";
import deduceFieldOrder, { getTicketScanningErrorRate } from "./day16";

describe("day16", () => {
  describe("getTicketScanningErrorRate", () => {
    it("example", () => {
      const ticketScanningErrorRate = getTicketScanningErrorRate(
        [
          {
            name: "class",
            validRanges: [
              { min: 1, max: 3 },
              { min: 5, max: 7 },
            ],
          },
          {
            name: "row",
            validRanges: [
              { min: 6, max: 11 },
              { min: 33, max: 44 },
            ],
          },
          {
            name: "seat",
            validRanges: [
              { min: 13, max: 40 },
              { min: 45, max: 50 },
            ],
          },
        ],
        [
          [7, 3, 47],
          [40, 4, 50],
          [55, 2, 20],
          [38, 6, 12],
        ]
      );
      expect(ticketScanningErrorRate).to.equal(71);
    });
  });
  describe("deduceFieldOrder", () => {
    it("example", () => {
      const fieldOrder = deduceFieldOrder(
        [
          {
            name: "class",
            validRanges: [
              { min: 1, max: 3 },
              { min: 5, max: 7 },
            ],
          },
          {
            name: "row",
            validRanges: [
              { min: 6, max: 11 },
              { min: 33, max: 44 },
            ],
          },
          {
            name: "seat",
            validRanges: [
              { min: 13, max: 40 },
              { min: 45, max: 50 },
            ],
          },
        ],
        [
          [7, 3, 47],
          [40, 4, 50],
          [55, 2, 20],
          [38, 6, 12],
        ]
      );
      expect(fieldOrder).to.deep.equal(["row", "class", "seat"]);
    });
  });
});
