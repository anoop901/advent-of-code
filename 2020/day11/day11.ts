import { isEqual } from "lodash";
import chain from "../../util/chain";
import {
  allIntegersStartingAt,
  countMatching,
  filterNonNullish,
  findFirstMatching,
  map,
  sum,
  takeWhile,
} from "../../util/iterators";

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
) => Iterable<Location>;

interface Behavior {
  crowdedThreshold: number;
  findNeighborLocations(
    location: Location,
    waitingAreaState: WaitingAreaState
  ): Iterable<Location>;
}

export const behavior1: Behavior = {
  crowdedThreshold: 4,
  findNeighborLocations: findNeighborLocationsImmediate,
};
export const behavior2: Behavior = {
  crowdedThreshold: 5,
  findNeighborLocations: findNeighborLocationsVisible,
};

function isLocationInBounds(
  location: Location,
  waitingAreaState: WaitingAreaState
) {
  const { x, y } = location;
  return (
    x >= 0 &&
    y >= 0 &&
    x < waitingAreaState.width &&
    y < waitingAreaState.height
  );
}

function findNeighborLocationsImmediate(
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
  ].filter((location) => isLocationInBounds(location, waitingAreaState));
}

export function findNeighborLocationsVisible(
  location: Location,
  waitingAreaState: WaitingAreaState
): Iterable<Location> {
  return chain([
    { dx: -1, dy: -1 },
    { dx: -1, dy: 0 },
    { dx: -1, dy: 1 },
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: 1, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 1, dy: 1 },
  ])
    .then(
      map(({ dx, dy }) =>
        chain(allIntegersStartingAt(1))
          .then(
            map((distance) => ({
              x: location.x + dx * distance,
              y: location.y + dy * distance,
            }))
          )
          .then(
            takeWhile((location) =>
              isLocationInBounds(location, waitingAreaState)
            )
          )
          .then(
            findFirstMatching(
              (location) =>
                waitingAreaState.seatStates[location.y][location.x] !== "floor"
            )
          )
          .run()
      )
    )
    .then(filterNonNullish)
    .run();
}

export function runRound(
  waitingAreaState: WaitingAreaState,
  behavior: Behavior
): WaitingAreaState {
  return {
    width: waitingAreaState.width,
    height: waitingAreaState.height,
    seatStates: waitingAreaState.seatStates.map((row, y) =>
      row.map((seatState, x) => {
        const neighborLocations = behavior.findNeighborLocations(
          { x, y },
          waitingAreaState
        );
        const occupiedSeatsNeighbors = chain(neighborLocations)
          .then(
            countMatching(
              ({ x, y }) => waitingAreaState.seatStates[y][x] === "occupied"
            )
          )
          .run();

        switch (seatState) {
          case "empty":
            return occupiedSeatsNeighbors === 0 ? "occupied" : "empty";
          case "occupied":
            return occupiedSeatsNeighbors >= behavior.crowdedThreshold
              ? "empty"
              : "occupied";
          case "floor":
            return "floor";
        }
      })
    ),
  };
}

function countOccupiedSeats(waitingAreaState: WaitingAreaState): number {
  return chain(waitingAreaState.seatStates)
    .then(
      map((row) =>
        chain(row)
          .then(countMatching((seatState) => seatState === "occupied"))
          .run()
      )
    )
    .then(sum)
    .run();
}

export function numberOfOccupiedSeatsAfterStabilization(
  initialWaitingAreaState: WaitingAreaState,
  behavior: Behavior
): number {
  let currentWaitingAreaState = initialWaitingAreaState;
  while (true) {
    const nextWaitingAreaState = runRound(currentWaitingAreaState, behavior);
    if (isEqual(currentWaitingAreaState, nextWaitingAreaState)) {
      return countOccupiedSeats(currentWaitingAreaState);
    }
    currentWaitingAreaState = nextWaitingAreaState;
  }
}
