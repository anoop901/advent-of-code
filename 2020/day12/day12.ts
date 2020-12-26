import chain from "../../util/chain";
import { fold, map } from "../../util/iterators";
import loadInputLines from "../../util/loadInputLines";

type Direction = "north" | "south" | "east" | "west";

interface NavigationInstruction {
  action: string;
  value: number;
}

interface Position {
  ew: number;
  ns: number;
}

type NavigationInstructions = Iterable<NavigationInstruction>;

export async function loadNavigationInstructions(): Promise<NavigationInstructions> {
  return chain(await loadInputLines())
    .then(
      map((line) => {
        const pattern = /(?<action>[NSEWLRF])(?<value>\d+)/;
        const match = pattern.exec(line);
        if (match && match.groups) {
          return {
            action: match.groups["action"],
            value: Number(match.groups["value"]),
          };
        } else {
          throw new Error(`invalid line in input "${line}"`);
        }
      })
    )
    .end();
}

export function manhattanDistanceToDestination(
  navigationInstructions: NavigationInstructions
): number {
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
          return { position, direction };
        }
      )
    )
    .then(({ position }) => Math.abs(position.ew) + Math.abs(position.ns))
    .end();
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

function rotateDirectionRight(
  initialDirection: Direction,
  rotationAngle: number
): Direction {
  const directionOrder: Direction[] = ["north", "east", "south", "west"];
  const initialDirectionIndex = directionOrder.indexOf(initialDirection);
  const rotationSteps = Math.floor(rotationAngle / 90);
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

function positiveMod(a: number, b: number): number {
  return ((a % b) + b) % b;
}
