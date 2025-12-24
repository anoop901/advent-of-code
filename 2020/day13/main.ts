import chain from "@anoop901/js-util/chain";
import map from "@anoop901/js-util/iterables/map";
import toArray from "@anoop901/js-util/iterables/toArray";
import loadInputLines from "../../util/loadInputLines";
import {
  BusSchedule,
  earliestBusAvailable,
  earliestTimestampWhenBusesLineUp,
} from "./day13";

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
  const { currentTimestamp, busSchedule } =
    await loadCurrentTimestampAndBusSchedule();
  const { busId, waitTime } = earliestBusAvailable(
    currentTimestamp,
    busSchedule
  );
  const answer1 = busId * waitTime;
  const answer2 = earliestTimestampWhenBusesLineUp(busSchedule);
  console.log(answer1, answer2);
})();
