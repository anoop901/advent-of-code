import { startWith } from "./Transformable";

test("single transformation", () => {
  expect(startWith(5).thenApply((x) => x * 2).value).toBe(10);
});

test("multiple transformation", () => {
  expect(
    startWith(5)
      .thenApply((x) => x * 2)
      .thenApply((x) => x + 8)
      .thenApply((x) => x * 10).value
  ).toBe(180);
});

test("transformation into different type", () => {
  expect(startWith("hello").thenApply((x) => x.length).value).toBe(5);
});

test("multiple transformations into different types", () => {
  expect(
    startWith("hello")
      .thenApply((x) => x.length)
      .thenApply((x) => `there are ${x} letters`).value
  ).toBe("there are 5 letters");
});
