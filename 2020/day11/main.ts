import loadInputLines from "../util/loadInputLines";
import * as fs from "fs";
import parseWaitingAreaState from "./parseWaitingAreaState";
import { numberOfOccupiedSeatsAfterStabilization } from "./day11";

async function main() {
  const initialWaitingAreaStateString = (
    await fs.promises.readFile("input.txt", "utf-8")
  ).trim();
  const initialWaitingAreaState = parseWaitingAreaState(
    initialWaitingAreaStateString
  );
  const answer1 = numberOfOccupiedSeatsAfterStabilization(
    initialWaitingAreaState
  );
  console.log(answer1);
}

main();
