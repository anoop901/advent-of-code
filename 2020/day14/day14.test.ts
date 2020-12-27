import { MaskBit, sumMemoryAfterExecuting } from "./day14";
import { expect } from "chai";

describe("sumMemoryAfterExecuting", () => {
  it("example", () => {
    expect(
      sumMemoryAfterExecuting([
        {
          type: "mask",
          mask: Array.from(
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X",
            (x) => x as MaskBit
          ),
        },
        {
          type: "memory",
          address: 8,
          value: 11,
        },
        {
          type: "memory",
          address: 7,
          value: 101,
        },
        {
          type: "memory",
          address: 8,
          value: 0,
        },
      ])
    ).to.equal(165);
  });
  it("example v2", () => {
    expect(
      sumMemoryAfterExecuting(
        [
          {
            type: "mask",
            mask: Array.from(
              "000000000000000000000000000000X1001X",
              (x) => x as MaskBit
            ),
          },
          {
            type: "memory",
            address: 42,
            value: 100,
          },
          {
            type: "mask",
            mask: Array.from(
              "00000000000000000000000000000000X0XX",
              (x) => x as MaskBit
            ),
          },
          {
            type: "memory",
            address: 26,
            value: 1,
          },
        ],
        true
      )
    ).to.equal(208);
  });
});
