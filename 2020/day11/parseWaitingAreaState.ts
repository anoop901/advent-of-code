import loadInputLines from "../util/loadInputLines";
import { WaitingAreaState } from "./day11";

export default async function loadWaitingAreaState(): Promise<WaitingAreaState> {
  const seatStates = (await loadInputLines()).map((rowString) =>
    Array.from(rowString).map((seatString) => {
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
  );
  return { seatStates, height: seatStates.length, width: seatStates[0].length };
}
