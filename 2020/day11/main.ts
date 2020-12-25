import {
  behavior1,
  behavior2,
  numberOfOccupiedSeatsAfterStabilization,
} from "./day11";
import { loadWaitingAreaState } from "./parseWaitingAreaState";

async function main() {
  const initialWaitingAreaState = await loadWaitingAreaState();
  const answer1 = numberOfOccupiedSeatsAfterStabilization(
    initialWaitingAreaState,
    behavior1
  );
  console.log(answer1);
  const answer2 = numberOfOccupiedSeatsAfterStabilization(
    initialWaitingAreaState,
    behavior2
  );
  console.log(answer2);
}

main();
