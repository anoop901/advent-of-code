import chain from "../../util/chain";
import {
  allIntegersStartingAt,
  enumerate,
  filterNonNullish,
  findFirstMatching,
  fold,
  map,
  map_filter,
  minBy,
} from "../../util/iterators";
import { mod } from "../../util/numbers";

type BusId = number;
export type BusSchedule = (BusId | null)[];

function getNextDepartureTimestampForBus(
  busId: BusId,
  currentTimestamp: number
): number {
  return Math.ceil(currentTimestamp / busId) * busId;
}

// WARNING: this doesn't work if divisor1 and divisor2 aren't relatively prime
function intersectionOfModClasses(
  { divisor: divisor1, mod: mod1 }: { divisor: number; mod: number },
  { divisor: divisor2, mod: mod2 }: { divisor: number; mod: number }
): { divisor: number; mod: number } {
  return {
    mod: chain(allIntegersStartingAt(0))
      .then(map((i) => mod1 + i * divisor1))
      .then(findFirstMatching((x) => mod(x, divisor2) === mod2))
      .then((x) => {
        if (x == null) {
          throw new Error("unreachable");
        }
        return x;
      })
      .end(),
    divisor: divisor1 * divisor2,
  };
}

export function earliestTimestampWhenBusesLineUp(
  busSchedule: BusSchedule
): number {
  return chain(busSchedule)
    .then(enumerate)
    .then(
      map_filter(({ index, value }) =>
        value == null ? null : { busId: value, offset: index }
      )
    )
    .then(
      map(({ busId, offset }) => ({
        divisor: busId,
        mod: mod(-offset, busId),
      }))
    )
    .then(fold({ divisor: 1, mod: 0 }, intersectionOfModClasses))
    .then(({ mod }) => mod)
    .end();
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
        waitTime:
          getNextDepartureTimestampForBus(busId, currentTimestamp) -
          currentTimestamp,
      }))
    )
    .then(minBy(({ waitTime }) => waitTime))
    .end();
}
