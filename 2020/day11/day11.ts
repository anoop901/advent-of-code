import { isEqual } from "lodash";
import { sumNumbers } from "../util/numbers";

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

type findNeighborLocationsFunction = (
  location: Location,
  waitingAreaState: WaitingAreaState
) => Location[];

export function findNeighborLocationsImmediate(
  location: Location,
  waitingAreaState: WaitingAreaState
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
  ].filter(
    ({ x, y }) =>
      x >= 0 &&
      y >= 0 &&
      x < waitingAreaState.width &&
      y < waitingAreaState.height
  );
}

export function runRound(
  waitingAreaState: WaitingAreaState,
  findNeighborLocations: findNeighborLocationsFunction
): WaitingAreaState {
  return {
    width: waitingAreaState.width,
    height: waitingAreaState.height,
    seatStates: waitingAreaState.seatStates.map((row, y) =>
      row.map((seatState, x) => {
        const neighborLocations = findNeighborLocations(
          { x, y },
          waitingAreaState
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
    ),
  };
}

function countOccupiedSeats(waitingAreaState: WaitingAreaState): number {
  return sumNumbers(
    waitingAreaState.seatStates.map(
      (row) => row.filter((seatState) => seatState === "occupied").length
    )
  );
}

export function numberOfOccupiedSeatsAfterStabilization(
  initialWaitingAreaState: WaitingAreaState,
  findNeighborLocations: findNeighborLocationsFunction
): number {
  let currentWaitingAreaState = initialWaitingAreaState;
  while (true) {
    const nextWaitingAreaState = runRound(
      currentWaitingAreaState,
      findNeighborLocations
    );
    if (isEqual(currentWaitingAreaState, nextWaitingAreaState)) {
      return countOccupiedSeats(currentWaitingAreaState);
    }
    currentWaitingAreaState = nextWaitingAreaState;
  }
}
