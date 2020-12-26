import chain from "../../util/chain";
import { map, toArray } from "../../util/iterators";
import loadInputLines from "../../util/loadInputLines";
import { BusSchedule, earliestBusAvailable } from "./day13";

async function loadCurrentTimestampAndBusSchedule(): Promise<{
  currentTimestamp: number;
  busSchedule: BusSchedule;
}> {
  const [timestampLine, busScheduleLine] = await loadInputLines();
  return {
    currentTimestamp: Number(timestampLine),
    busSchedule: chain(busScheduleLine.split(","))
      .then(
        map((busString) => {
          const busId = Number(busString);
          if (isNaN(busId)) {
            return null;
          }
          return busId;
        })
      )
      .then(toArray)
      .end(),
  };
}

(async () => {
  const {
    currentTimestamp,
    busSchedule,
  } = await loadCurrentTimestampAndBusSchedule();
  const { busId, waitTime } = earliestBusAvailable(
    currentTimestamp,
    busSchedule
  );
  const answer1 = busId * waitTime;
  console.log(answer1);
})();
