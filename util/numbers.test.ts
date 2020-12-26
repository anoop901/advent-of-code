import { mod } from "./numbers";

describe("mod", () => {
  test("positive dividend, positive divisor", () => {
    expect(mod(12, 5)).toBe(2);
  });
  test("negative dividend, positive divisor", () => {
    expect(mod(-12, 5)).toBe(3);
  });
  test("positive dividend, negative divisor", () => {
    expect(mod(12, -5)).toBe(-3);
  });
  test("negative dividend, negative divisor", () => {
    expect(mod(-12, -5)).toBe(-2);
  });
  test("positive dividend, positive divisor, evenly divisible", () => {
    expect(mod(15, 5)).toBe(0);
  });
  test("negative dividend, positive divisor, evenly divisible", () => {
    expect(mod(-15, 5)).toBe(0);
  });
  test("positive dividend, negative divisor, evenly divisible", () => {
    expect(mod(15, -5)).toBe(-0);
  });
  test("negative dividend, negative divisor, evenly divisible", () => {
    expect(mod(-15, -5)).toBe(-0);
  });
});
