import chain from "./chain";

test("single transformation", () => {
  expect(
    chain(5)
      .then((x) => x * 2)
      .end()
  ).toBe(10);
});

test("multiple transformation", () => {
  expect(
    chain(5)
      .then((x) => x * 2)
      .then((x) => x + 8)
      .then((x) => x * 10)
      .end()
  ).toBe(180);
});

test("transformation into different type", () => {
  expect(
    chain("hello")
      .then((x) => x.length)
      .end()
  ).toBe(5);
});

test("multiple transformations into different types", () => {
  expect(
    chain("hello")
      .then((x) => x.length)
      .then((x) => `there are ${x} letters`)
      .end()
  ).toBe("there are 5 letters");
});
