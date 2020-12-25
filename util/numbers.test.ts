import { sumNumbers } from "./numbers";

describe("sumNumberArray", () => {
  test("basic", () => {
    expect(sumNumbers([5, 2, 9])).toBe(5 + 2 + 9);
  });
});
