import * as fs from "fs";
import * as readline from "readline";

type Question = string; // 'a', 'b', ...
type CustomsForm = Set<string>

async function loadCustomsFormsData(): Promise<CustomsForm[][]> {
  const rl = readline.createInterface({
    input: fs.createReadStream("input.txt"),
  });

  const customsFormsData: CustomsForm[][] = [];
  let currentGroupCustomsForms: CustomsForm[] | null = null;

  function pushCurrent() {
    if (currentGroupCustomsForms !== null) {
      customsFormsData.push(currentGroupCustomsForms);
      currentGroupCustomsForms = null;
    }
  }


  for await (const line of rl) {
    if (line === "") {
      pushCurrent();
    } else {
      if (currentGroupCustomsForms === null) {
        currentGroupCustomsForms = [];
      }
      const customsForm = new Set(line);
      currentGroupCustomsForms = [...currentGroupCustomsForms, customsForm]
    }
  }
  pushCurrent();

  return customsFormsData;
}

function union<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  const result = new Set(setA)
  for (const elem of setB) {
    result.add(elem)
  }
  return result;
}

// [set1, set2, set3, set4, set5].reduce(union)
// union(union(union(union(set1, set2), set3), set4), set5)

function unionAll<T>(sets: Set<T>[]): Set<T> {
  return sets.reduce(union);
}

function countQuestionsWhereAnyAnsweredYes(customsForms: CustomsForm[]): number {
  return unionAll(customsForms).size;
}

function getAnswer(customsFormsData: CustomsForm[][]): number {
  return customsFormsData
    .map(countQuestionsWhereAnyAnsweredYes)
    .reduce((a, b) => a + b, 0);
}

async function main() {
  const customsFormsData = await loadCustomsFormsData();
  const answer = getAnswer(customsFormsData);
  console.log(answer);
}

main();