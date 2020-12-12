import { WaitingAreaState } from "./day11";

export default function parseWaitingAreaState(
  waitingAreaStateString: string
): WaitingAreaState {
  const seatStates = waitingAreaStateString.split("\n").map((rowString) =>
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
