import wu from "wu";
import * as _ from "lodash";
import { sumNumberArray } from "../util/numbers";

export type SeatState = "empty" | "occupied" | "floor";

export interface WaitingAreaState {
  seatStates: SeatState[][];
  width: number;
  height: number;
}

interface Location {
  x: number;
  y: number;
}

function findNeighborLocations(
  location: Location,
  width: number,
  height: number
): Location[] {
  return [
    { x: location.x - 1, y: location.y - 1 },
    { x: location.x - 1, y: location.y },
    { x: location.x - 1, y: location.y + 1 },
    { x: location.x, y: location.y - 1 },
    { x: location.x, y: location.y + 1 },
    { x: location.x + 1, y: location.y - 1 },
    { x: location.x + 1, y: location.y },
    { x: location.x + 1, y: location.y + 1 },
  ].filter(({ x, y }) => x >= 0 && y >= 0 && x < width && y < height);
}

export function runRound(waitingAreaState: WaitingAreaState): WaitingAreaState {
  return {
    width: waitingAreaState.width,
    height: waitingAreaState.height,
    seatStates: wu(waitingAreaState.seatStates)
      .enumerate()
      .map(([row, y]) =>
        wu(row)
          .enumerate()
          .map(([seatState, x]) => {
            const neighborLocations = findNeighborLocations(
              { x, y },
              waitingAreaState.width,
              waitingAreaState.height
            );
            const occupiedSeatsNeighbors = neighborLocations.filter(
              ({ x, y }) => waitingAreaState.seatStates[y][x] === "occupied"
            ).length;

            switch (seatState) {
              case "empty":
                return occupiedSeatsNeighbors === 0 ? "occupied" : "empty";
              case "occupied":
                return occupiedSeatsNeighbors >= 4 ? "empty" : "occupied";
              case "floor":
                return "floor";
            }
          })
          .toArray()
      )
      .toArray(),
  };
}

function countOccupiedSeats(waitingAreaState: WaitingAreaState): number {
  return sumNumberArray(
    waitingAreaState.seatStates.map(
      (row) => row.filter((seatState) => seatState === "occupied").length
    )
  );
}

export function numberOfOccupiedSeatsAfterStabilization(
  initialWaitingAreaState: WaitingAreaState
): number {
  let currentWaitingAreaState = initialWaitingAreaState;
  while (true) {
    const nextWaitingAreaState = runRound(currentWaitingAreaState);
    if (_.isEqual(currentWaitingAreaState, nextWaitingAreaState)) {
      return countOccupiedSeats(currentWaitingAreaState);
    }
    currentWaitingAreaState = nextWaitingAreaState;
  }
}
