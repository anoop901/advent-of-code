import chain from "@anoop901/js-util/chain";
import map from "@anoop901/js-util/iterables/map";
import pairs from "@anoop901/js-util/iterables/pairs";
import sum from "@anoop901/js-util/iterables/sum";

export function numberOf1JoltDifferencesTimesNumberOf3JoltDifferences(
  adapters: number[]
): number {
  const sortedAdapters = [0, ...adapters].sort((a, b) => a - b);

  const differences = chain(sortedAdapters)
    .then(pairs())
    .then(map(({ first: adapter1, second: adapter2 }) => adapter2 - adapter1))
    .then((iter) => Array.from(iter))
    .end();

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

    const pathsFromCurrentAdapterToDevice = chain(compatibleAdapters)
      .then(map((adapter) => pathsFromAdapterToDevice.get(adapter) ?? 1))
      .then(sum)
      .end();
    pathsFromAdapterToDevice.set(
      currentAdapter,
      pathsFromCurrentAdapterToDevice
    );

    compatibleAdapters.push(currentAdapter);
  }

  return pathsFromAdapterToDevice.get(0) ?? 1;
}
