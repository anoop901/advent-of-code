import chain from "@anoop901/js-util/chain";
import allIntegersStartingAt from "@anoop901/js-util/iterables/allIntegersStartingAt";
import enumerate from "@anoop901/js-util/iterables/enumerate";
import filterNonNullish from "@anoop901/js-util/iterables/filterNonNullish";
import findFirstMatching from "@anoop901/js-util/iterables/findFirstMatching";
import fold from "@anoop901/js-util/iterables/fold";
import map from "@anoop901/js-util/iterables/map";
import mapFilter from "@anoop901/js-util/iterables/mapFilter";
import minBy from "@anoop901/js-util/iterables/minBy";
import mod from "@anoop901/js-util/numbers/mod";

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
      mapFilter(({ index, value }) =>
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
