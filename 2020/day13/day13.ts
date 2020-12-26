import chain from "../../util/chain";
import { filterNonNullish, map, minBy } from "../../util/iterators";

type BusId = number;
export type BusSchedule = (BusId | null)[];

function getWaitTimeForBus(busId: BusId, currentTimestamp: number): number {
  return Math.ceil(currentTimestamp / busId) * busId - currentTimestamp;
}

export function earliestBusAvailable(
  currentTimestamp: number,
  busSchedule: BusSchedule
): { busId: number; waitTime: number } {
  return chain(busSchedule)
    .then(filterNonNullish)
    .then(
      map((busId) => ({
        busId,
        waitTime: getWaitTimeForBus(busId, currentTimestamp),
      }))
    )
    .then(minBy(({ waitTime }) => waitTime))
    .end();
}
