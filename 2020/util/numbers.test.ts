import { sumNumberArray } from "./numbers";

describe("sumNumberArray", () => {
  test("basic", () => {
    expect(sumNumberArray([5, 2, 9])).toBe(5 + 2 + 9);
  });
});
