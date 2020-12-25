import wu from "wu";
import { sumNumbers } from "../../util/numbers";

export function numberOf1JoltDifferencesTimesNumberOf3JoltDifferences(
  adapters: number[]
) {
  const sortedAdapters = [0, ...adapters].sort((a, b) => a - b);

  const differences = wu
    .zip(sortedAdapters, wu(sortedAdapters).slice(1))
    .map(([adapter1, adapter2]) => adapter2 - adapter1)
    .toArray();

  const numberOf1JoltDifferences = differences.filter(
    (difference) => difference === 1
  ).length;
  const numberOf3JoltDifferences =
    differences.filter((difference) => difference === 3).length + 1;

  return numberOf1JoltDifferences * numberOf3JoltDifferences;
}

export function numberOfWaysToConnectChartingOutletToDevice(
  adapters: number[]
): number {
  const sortedAdaptersDescending = [0, ...adapters].sort((a, b) => b - a);

  const compatibleAdapters = [sortedAdaptersDescending[0] + 3];
  const pathsFromAdapterToDevice = new Map<number, number>();

  for (const currentAdapter of sortedAdaptersDescending) {
    while (compatibleAdapters[0] > currentAdapter + 3) {
      compatibleAdapters.shift();
    }

    const pathsFromCurrentAdapterToDevice = sumNumbers(
      compatibleAdapters.map(
        (adapter) => pathsFromAdapterToDevice.get(adapter) ?? 1
      )
    );
    pathsFromAdapterToDevice.set(
      currentAdapter,
      pathsFromCurrentAdapterToDevice
    );

    compatibleAdapters.push(currentAdapter);
  }

  return pathsFromAdapterToDevice.get(0) ?? 1;
}
