import chain from "@anoop901/js-util/chain";
import map from "@anoop901/js-util/iterables/map";
import toArray from "@anoop901/js-util/iterables/toArray";
import loadInputLines from "../../util/loadInputLines";
import { WaitingAreaState } from "./day11";

export default function parseWaitingAreaState(
  waitingAreaLinesStrings: string[]
): WaitingAreaState {
  const seatStates = waitingAreaLinesStrings.map((rowString) =>
    chain(rowString)
      .then(
        map((seatString) => {
          switch (seatString) {
            case "L":
              return "empty";
            case ".":
              return "floor";
            case "#":
              return "occupied";
          }
          throw new Error("invalid waiting area string");
        })
      )
      .then(toArray)
      .end()
  );
  return { seatStates, height: seatStates.length, width: seatStates[0].length };
}

export async function loadWaitingAreaState(): Promise<WaitingAreaState> {
  return parseWaitingAreaState(await loadInputLines());
}
