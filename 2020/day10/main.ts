import loadInputLines from "../../util/loadInputLines";
import {
  numberOf1JoltDifferencesTimesNumberOf3JoltDifferences,
  numberOfWaysToConnectChartingOutletToDevice,
} from "./day10";

async function loadAdaptersList(): Promise<number[]> {
  return (await loadInputLines()).map((line) => parseInt(line, 10));
}

async function main() {
  const adaptersList = await loadAdaptersList();
  const answerPart1 = numberOf1JoltDifferencesTimesNumberOf3JoltDifferences(
    adaptersList
  );
  console.log(answerPart1);
  const answerPart2 = numberOfWaysToConnectChartingOutletToDevice(adaptersList);
  console.log(answerPart2);
}

main();
