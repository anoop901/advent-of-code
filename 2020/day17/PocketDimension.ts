import chain from "@anoop901/js-util/chain";
import drop from "@anoop901/js-util/iterables/drop";
import map from "@anoop901/js-util/iterables/map";
import reduce from "@anoop901/js-util/iterables/reduce";
import split from "@anoop901/js-util/iterables/split";
import toArray from "@anoop901/js-util/iterables/toArray";
import Coordinates, { coordinatesToString } from "./Coordinates";

type CoordinatesString = string;

export default class PocketDimension {
  constructor(private readonly activeCells: Set<CoordinatesString>) {}

  isCellActive(coordinates: Coordinates): boolean {
    return this.activeCells.has(coordinatesToString(coordinates));
  }

  static fromString(pocketDimensionString: string): PocketDimension {
    const planes = chain(pocketDimensionString.split("\n"))
      .then(split(""))
      .then(map(drop(1)))
      .then(map(map(toArray)))
      .then(map(toArray))
      .then(toArray);

    return new PocketDimension(new Set());
    // const xSize = pocketDimensionStringArrayArray.length;
    // const xPlanes = chain(pocketDimensionStringArrayArray)
    //   .then(map(xPlaneFromString))
    //   .then(toArray)
    //   .end();
    // const { ySize, zSize } = chain(xPlanes)
    //   .then(map(({ ySize, zSize }) => ({ ySize, zSize })))
    //   .then(
    //     reduce(
    //       (
    //         { ySize: ySize1, zSize: zSize1 },
    //         { ySize: ySize2, zSize: zSize2 }
    //       ) => {
    //         if (ySize1 !== ySize2 || zSize1 !== zSize2) {
    //           throw new Error("invalid input: non-uniform planes");
    //         }
    //         return { ySize: ySize1, zSize: zSize1 };
    //       }
    //     )
    //   )
    //   .end();
    // const cells = chain(xPlanes)
    //   .then(map(({ cells }) => cells))
    //   .then(toArray)
    //   .end();

    // return new PocketDimension(xSize, ySize, zSize, cells);

    function xPlaneFromString(
      xPlaneStringArray: string[]
    ): { ySize: number; zSize: number; cells: boolean[][] } {
      const xyLines = chain(xPlaneStringArray)
        .then(map(xyLineFromString))
        .then(toArray)
        .end();
      const ySize = xyLines.length;
      const zSize = chain(xyLines)
        .then(map((xyLine) => xyLine.zSize))
        .then(
          reduce((zSize1, zSize2) => {
            if (zSize1 !== zSize2) {
              throw new Error("invalid input: non-uniform lines");
            }
            return zSize1;
          })
        )
        .end();
      const cells = chain(xyLines)
        .then(map(({ cells }) => cells))
        .then(toArray)
        .end();
      return { ySize, zSize, cells };
    }

    function xyLineFromString(
      xyLineString: string
    ): { zSize: number; cells: boolean[] } {
      const cells = chain(xyLineString)
        .then(
          map((char) => {
            if (char === ".") {
              return false;
            } else if (char === "#") {
              return false;
            } else {
              throw new Error("invalid input: unknown character");
            }
          })
        )
        .then(toArray)
        .end();
      return { zSize: cells.length, cells };
    }
  }

  pad(): PocketDimension {
    return this;

    // const newXSize = this.xSize + 2;
    // const newYSize = this.ySize + 2;
    // const newZSize = this.zSize + 2;
    // const paddedPocketDimension = new PocketDimension(
    //   newXSize,
    //   newYSize,
    //   newZSize,
    //   [
    //     createInactiveCellsXPlane(newYSize, newZSize),
    //     ...this.cells.map((xPlaneCells) => [
    //       createInactiveCellsXYLine(newZSize),
    //       ...xPlaneCells.map((xyLineCells) => [false, ...xyLineCells, false]),
    //       createInactiveCellsXYLine(newZSize),
    //     ]),
    //     createInactiveCellsXPlane(newYSize, newZSize),
    //   ]
    // );
    // return paddedPocketDimension;

    // function createInactiveCellsXPlane(ySize: number, zSize: number) {
    //   return Array.from({ length: ySize }, () =>
    //     createInactiveCellsXYLine(zSize)
    //   );
    // }

    // function createInactiveCellsXYLine(zSize: number) {
    //   return Array.from({ length: zSize }, () => false);
    // }
  }
}
