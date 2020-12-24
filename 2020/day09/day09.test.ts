import {
  allContiguousRangeSums,
  anyPairSumToTarget,
  findEncryptionWeakness,
  firstNumberThatBreaksPattern,
} from "./day09";

describe("anyPairSumToTarget", () => {
  test("basic match", () => {
    expect(anyPairSumToTarget([35, 20, 15, 25, 47], 40)).toBeTruthy();
  });
  test("basic mismatch", () => {
    expect(anyPairSumToTarget([95, 102, 117, 150, 182], 40)).toBeFalsy();
  });
});

describe("firstNumberThatBreaksPattern", () => {
  test("basic", () => {
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
    ).toBe(127);
  });
  test("breaks pattern immediately", () => {
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
    ).toBe(41);
  });
});

describe("allContiguousRangeSums", () => {
  test("basic", () => {
    expect(Array.from(allContiguousRangeSums([15, 25, 47, 40], 2))).toEqual([
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
  test("basic", () => {
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
    ).toBe(62);
  });
});
