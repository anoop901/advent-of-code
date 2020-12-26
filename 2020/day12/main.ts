import {
  loadNavigationInstructions,
  manhattanDistanceToDestination,
} from "./day12";

(async () => {
  const navigationInstructions = await loadNavigationInstructions();
  const answer1 = manhattanDistanceToDestination(navigationInstructions, false);
  console.log(answer1);
  const answer2 = manhattanDistanceToDestination(navigationInstructions, true);
  console.log(answer2);
})();
