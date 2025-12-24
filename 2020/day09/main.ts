import { findEncryptionWeakness, firstNumberThatBreaksPattern } from "./day09";
import { loadXmasData } from "./parsing";

async function main() {
  const xmasData = await loadXmasData();
  const answerPart1 = firstNumberThatBreaksPattern(xmasData);
  const answerPart2 = findEncryptionWeakness(xmasData, answerPart1);
  console.log(answerPart1, answerPart2);
}

main();
