import chain from "@anoop901/js-util/chain";
import countMatching from "@anoop901/js-util/iterables/countMatching";
import map from "@anoop901/js-util/iterables/map";
import pairs from "@anoop901/js-util/iterables/pairs";
import sum from "@anoop901/js-util/iterables/sum";
import loadInputLines from "../../util/loadInputLines";

function windows<T>(windowSize: number) {
  return function* (iterable: Iterable<T>) {
    const currentWindow = [];
    for (const t of iterable) {
      currentWindow.push(t);
      if (currentWindow.length > windowSize) {
        currentWindow.shift();
      }
      if (currentWindow.length === windowSize) {
        yield currentWindow.slice();
      }
    }
  };
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
  console.log(part1Answer);

  const part2Answer = chain(depths)
    .then(windows(3))
    .then(map(sum))
    .then(countNumIncreases)
    .end();
  console.log(part1Answer, part2Answer);
})();
