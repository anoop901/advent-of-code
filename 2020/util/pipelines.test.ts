import { buildPipeline, runPipeline } from "./pipelines";

test("single-stage pipeline", () => {
  expect(
    runPipeline(
      5,
      buildPipeline((x) => x * 2)
    )
  ).toBe(10);
});

test("multi-stage pipeline", () => {
  expect(
    runPipeline(
      5,
      buildPipeline((x: number) => x * 2)
        .then((x) => x + 8)
        .then((x) => x * 10)
    )
  ).toBe(180);
});

test("pipeline that modifies type", () => {
  expect(
    runPipeline(
      "hello",
      buildPipeline((x: string) => x.length)
    )
  ).toBe(5);
});

test("multi-stage pipeline that modifies type", () => {
  expect(
    runPipeline(
      "hello",
      buildPipeline((x: string) => x.length).then(
        (x) => `there are ${x} letters`
      )
    )
  ).toBe("there are 5 letters");
});
