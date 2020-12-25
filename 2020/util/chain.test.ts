import chain from "./chain";

test("single transformation", () => {
  expect(
    chain(5)
      .then((x) => x * 2)
      .run()
  ).toBe(10);
});

test("multiple transformation", () => {
  expect(
    chain(5)
      .then((x) => x * 2)
      .then((x) => x + 8)
      .then((x) => x * 10)
      .run()
  ).toBe(180);
});

test("transformation into different type", () => {
  expect(
    chain("hello")
      .then((x) => x.length)
      .run()
  ).toBe(5);
});

test("multiple transformations into different types", () => {
  expect(
    chain("hello")
      .then((x) => x.length)
      .then((x) => `there are ${x} letters`)
      .run()
  ).toBe("there are 5 letters");
});
