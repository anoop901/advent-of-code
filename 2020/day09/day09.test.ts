import {
  allContiguousRangeSums,
  anyPairSumToTarget,
  findEncryptionWeakness,
  firstNumberThatBreaksPattern,
} from "./day09";
import { expect } from "chai";

describe("anyPairSumToTarget", () => {
  it("basic match", () => {
    expect(anyPairSumToTarget([35, 20, 15, 25, 47], 40)).to.be.true;
  });
  it("basic mismatch", () => {
    expect(anyPairSumToTarget([95, 102, 117, 150, 182], 40)).to.be.false;
  });
});

describe("firstNumberThatBreaksPattern", () => {
  it("basic", () => {
    expect(
      firstNumberThatBreaksPattern({
        numbers: [
          35,
          20,
          15,
          25,
          47,
          40,
          62,
          55,
          65,
          95,
          102,
          117,
          150,
          182,
          127,
          219,
          299,
          277,
          309,
          576,
        ],
        preambleLength: 5,
      })
    ).to.equal(127);
  });
  it("breaks pattern immediately", () => {
    expect(
      firstNumberThatBreaksPattern({
        numbers: [
          35,
          20,
          15,
          25,
          47,
          41,
          62,
          55,
          65,
          95,
          102,
          117,
          150,
          182,
          127,
          219,
          299,
          277,
          309,
          576,
        ],
        preambleLength: 5,
      })
    ).to.equal(41);
  });
});

describe("allContiguousRangeSums", () => {
  it("basic", () => {
    expect(
      Array.from(allContiguousRangeSums([15, 25, 47, 40], 2))
    ).to.deep.equal([
      { sum: 40, startIndex: 0, endIndex: 2 },
      { sum: 87, startIndex: 0, endIndex: 3 },
      { sum: 127, startIndex: 0, endIndex: 4 },
      { sum: 72, startIndex: 1, endIndex: 3 },
      { sum: 112, startIndex: 1, endIndex: 4 },
      { sum: 87, startIndex: 2, endIndex: 4 },
    ]);
  });
});

describe("findEncryptionWeakness", () => {
  it("basic", () => {
    expect(
      findEncryptionWeakness(
        {
          numbers: [
            35,
            20,
            15,
            25,
            47,
            40,
            62,
            55,
            65,
            95,
            102,
            117,
            150,
            182,
            127,
            219,
            299,
            277,
            309,
            576,
          ],
          preambleLength: 25,
        },
        127
      )
    ).to.equal(62);
  });
});
