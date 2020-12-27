import chain from "./chain";
import { expect } from "chai";

describe("chain", () => {
  it("single transformation", () => {
    expect(
      chain(5)
        .then((x) => x * 2)
        .end()
    ).to.equal(10);
  });

  it("multiple transformation", () => {
    expect(
      chain(5)
        .then((x) => x * 2)
        .then((x) => x + 8)
        .then((x) => x * 10)
        .end()
    ).to.equal(180);
  });

  it("transformation into different type", () => {
    expect(
      chain("hello")
        .then((x) => x.length)
        .end()
    ).to.equal(5);
  });

  it("multiple transformations into different types", () => {
    expect(
      chain("hello")
        .then((x) => x.length)
        .then((x) => `there are ${x} letters`)
        .end()
    ).to.equal("there are 5 letters");
  });
});
