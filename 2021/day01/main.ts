import chain from "@anoop901/js-util/chain";
import countMatching from "@anoop901/js-util/iterables/countMatching";
import map from "@anoop901/js-util/iterables/map";
import pairs from "@anoop901/js-util/iterables/pairs";
import sum from "@anoop901/js-util/iterables/sum";
import loadInputLines from "../../util/loadInputLines";

function* windows<T>(array: T[], windowSize: number) {
  for (let i = 0; i + windowSize <= array.length; i++) {
    yield array.slice(i, i + windowSize);
  }
}

function countNumIncreases(nums: Iterable<number>) {
  return chain(nums)
    .then(pairs())
    .then(countMatching(({ first, second }) => second > first))
    .end();
}

(async function main() {
  const lines = await loadInputLines();
  const depths = lines.map(Number);
  const part1Answer = countNumIncreases(depths);

  const part2Answer = chain(windows(depths, 3))
    .then(map(sum))
    .then(countNumIncreases)
    .end();
  console.log(part1Answer);
  console.log(part2Answer);
})();