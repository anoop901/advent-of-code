import chain from "../../util/chain";
import { fold, map, toArray } from "../../util/iterators";
import loadInputLines from "../../util/loadInputLines";

type Direction = "north" | "south" | "east" | "west";
type Action = "N" | "S" | "E" | "W" | "F" | "L" | "R";

interface NavigationInstruction {
  action: Action;
  value: number;
}

interface Position {
  ew: number;
  ns: number;
}

interface Waypoint {
  ew: number;
  ns: number;
}

type NavigationInstructions = NavigationInstruction[];

export async function loadNavigationInstructions(): Promise<NavigationInstructions> {
  return chain(await loadInputLines())
    .then(
      map((line) => {
        const pattern = /(?<action>[NSEWLRF])(?<value>\d+)/;
        const match = pattern.exec(line);
        if (match && match.groups) {
          return {
            action: match.groups["action"] as Action,
            value: Number(match.groups["value"]),
          };
        } else {
          throw new Error(`invalid line in input "${line}"`);
        }
      })
    )
    .then(toArray)
    .end();
}

function findDestinationDirectionBased(
  navigationInstructions: NavigationInstructions
): Position {
  return chain(navigationInstructions)
    .then(
      fold(
        { position: { ew: 0, ns: 0 }, direction: "east" as Direction },
        ({ position, direction }, navigationInstruction) => {
          switch (navigationInstruction.action) {
            case "N":
              return {
                position: moveNorth(position, navigationInstruction.value),
                direction,
              };
            case "S":
              return {
                position: moveSouth(position, navigationInstruction.value),
                direction,
              };
            case "E":
              return {
                position: moveEast(position, navigationInstruction.value),
                direction,
              };
            case "W":
              return {
                position: moveWest(position, navigationInstruction.value),
                direction,
              };
            case "L":
              return {
                position,
                direction: rotateDirectionLeft(
                  direction,
                  navigationInstruction.value
                ),
              };
            case "R":
              return {
                position,
                direction: rotateDirectionRight(
                  direction,
                  navigationInstruction.value
                ),
              };
            case "F":
              return {
                position: moveForward(
                  position,
                  navigationInstruction.value,
                  direction
                ),
                direction,
              };
          }
        }
      )
    )
    .then(({ position }) => position)
    .end();
}

function findDestinationWaypointBased(
  navigationInstructions: NavigationInstructions
): Position {
  return chain(navigationInstructions)
    .then(
      fold(
        { position: { ew: 0, ns: 0 }, waypoint: { ew: 10, ns: 1 } },
        ({ position, waypoint }, navigationInstruction) => {
          switch (navigationInstruction.action) {
            case "N":
              return {
                position,
                waypoint: moveNorth(waypoint, navigationInstruction.value),
              };
            case "S":
              return {
                position,
                waypoint: moveSouth(waypoint, navigationInstruction.value),
              };
            case "E":
              return {
                position,
                waypoint: moveEast(waypoint, navigationInstruction.value),
              };
            case "W":
              return {
                position,
                waypoint: moveWest(waypoint, navigationInstruction.value),
              };
            case "L":
              return {
                position,
                waypoint: rotateWaypointLeft(
                  waypoint,
                  navigationInstruction.value
                ),
              };
            case "R":
              return {
                position,
                waypoint: rotateWaypointRight(
                  waypoint,
                  navigationInstruction.value
                ),
              };
            case "F":
              return {
                position: moveToWaypoint(
                  position,
                  waypoint,
                  navigationInstruction.value
                ),
                waypoint,
              };
          }
        }
      )
    )
    .then(({ position }) => position)
    .end();
}

function manhattanDistanceToPosition(position: Position): number {
  return Math.abs(position.ew) + Math.abs(position.ns);
}

export function manhattanDistanceToDestination(
  navigationInstructions: NavigationInstructions,
  waypointBased: boolean
): number {
  const findDestination = waypointBased
    ? findDestinationWaypointBased
    : findDestinationDirectionBased;
  return manhattanDistanceToPosition(findDestination(navigationInstructions));
}

function moveNorth(initialPosition: Position, distance: number): Position {
  return { ew: initialPosition.ew, ns: initialPosition.ns + distance };
}

function moveSouth(initialPosition: Position, distance: number): Position {
  return { ew: initialPosition.ew, ns: initialPosition.ns - distance };
}

function moveEast(initialPosition: Position, distance: number): Position {
  return { ew: initialPosition.ew + distance, ns: initialPosition.ns };
}

function moveWest(initialPosition: Position, distance: number): Position {
  return { ew: initialPosition.ew - distance, ns: initialPosition.ns };
}

function moveForward(
  initialPosition: Position,
  distance: number,
  direction: Direction
): Position {
  switch (direction) {
    case "north":
      return moveNorth(initialPosition, distance);
    case "south":
      return moveSouth(initialPosition, distance);
    case "east":
      return moveEast(initialPosition, distance);
    case "west":
      return moveWest(initialPosition, distance);
  }
}

function moveToWaypoint(
  position: Position,
  waypoint: Waypoint,
  numberOfTimes: number
): Position {
  return {
    ew: position.ew + numberOfTimes * waypoint.ew,
    ns: position.ns + numberOfTimes * waypoint.ns,
  };
}

function rotateDirectionRight(
  initialDirection: Direction,
  rotationAngle: number
): Direction {
  const directionOrder: Direction[] = ["north", "east", "south", "west"];
  const initialDirectionIndex = directionOrder.indexOf(initialDirection);
  const rotationSteps = rotationAngleToNumberOfSteps(rotationAngle);
  const finalDirectionIndex = positiveMod(
    initialDirectionIndex + rotationSteps,
    4
  );
  const finalDirection = directionOrder[finalDirectionIndex];
  return finalDirection;
}

function rotateDirectionLeft(
  initialDirection: Direction,
  rotationAngle: number
): Direction {
  return rotateDirectionRight(initialDirection, -rotationAngle);
}

function rotateWaypointRight(
  waypoint: Waypoint,
  rotationAngle: number
): Waypoint {
  const numSteps = positiveMod(rotationAngleToNumberOfSteps(rotationAngle), 4);
  let result = { ...waypoint };
  for (let i = 0; i < numSteps; i++) {
    result = { ew: result.ns, ns: -result.ew };
  }
  return result;
}

function rotateWaypointLeft(
  waypoint: Waypoint,
  rotationAngle: number
): Waypoint {
  return rotateWaypointRight(waypoint, -rotationAngle);
}

function positiveMod(a: number, b: number): number {
  return ((a % b) + b) % b;
}

function rotationAngleToNumberOfSteps(rotationAngle: number): number {
  return Math.floor(rotationAngle / 90);
}
