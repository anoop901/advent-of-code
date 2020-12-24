import { numberOfOccupiedSeatsAfterStabilization } from "./day11";
import loadWaitingAreaState from "./parseWaitingAreaState";

async function main() {
  const initialWaitingAreaState = await loadWaitingAreaState();
  const answer1 = numberOfOccupiedSeatsAfterStabilization(
    initialWaitingAreaState
  );
  console.log(answer1);
}

main();
