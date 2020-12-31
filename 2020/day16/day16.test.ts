import { expect } from "chai";
import { deduceFieldOrder, getTicketScanningErrorRate } from "./day16";

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
              { min: 0, max: 1 },
              { min: 4, max: 19 },
            ],
          },
          {
            name: "row",
            validRanges: [
              { min: 0, max: 5 },
              { min: 8, max: 19 },
            ],
          },
          {
            name: "seat",
            validRanges: [
              { min: 0, max: 13 },
              { min: 16, max: 19 },
            ],
          },
        ],
        [
          [3, 9, 18],
          [15, 1, 5],
          [5, 14, 9],
        ]
      );
      expect(fieldOrder).to.deep.equal(["row", "class", "seat"]);
    });
  });
});
