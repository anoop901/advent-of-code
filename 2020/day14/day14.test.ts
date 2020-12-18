import { MaskBit, sumMemoryAfterExecuting } from "./day14";

describe("sumMemoryAfterExecuting", () => {
  test("example", () => {
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
    ).toBe(165);
  });
  test("example v2", () => {
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
    ).toBe(208);
  });
});
