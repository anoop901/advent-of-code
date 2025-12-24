import {
  loadNavigationInstructions,
  manhattanDistanceToDestination,
} from "./day12";

(async () => {
  const navigationInstructions = await loadNavigationInstructions();
  const answer1 = manhattanDistanceToDestination(navigationInstructions, false);
  const answer2 = manhattanDistanceToDestination(navigationInstructions, true);
  console.log(answer1, answer2);
})();
