import {
  loadNavigationInstructions,
  manhattanDistanceToDestination,
} from "./day12";

(async () => {
  const navigationInstructions = await loadNavigationInstructions();
  const answer1 = manhattanDistanceToDestination(navigationInstructions);
  console.log(answer1);
})();
