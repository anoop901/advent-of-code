import * as fs from "fs";
import * as readline from "readline";
import { splitIterable } from "../util/iterators";
import * as wu from "wu";

type Question = string; // 'a', 'b', ...
type CustomsForm = Set<string>;

async function loadCustomsFormsData(): Promise<CustomsForm[][]> {
  const rl = readline.createInterface({
    input: fs.createReadStream("input.txt"),
  });

  const lines = [] as string[];
  for await (const line of rl) {
    lines.push(line);
  }

  return wu(splitIterable(lines, ""))
    .map((chunk) =>
      chunk.map((customsFormString) => new Set(customsFormString))
    )
    .toArray();
}

function union<T>(sets: Set<T>[]): Set<T> {
  const result = new Set<T>();
  for (const set of sets) {
    for (const elem of set) {
      result.add(elem);
    }
  }
  return result;
}

function intersection<T>(sets: Set<T>[]): Set<T> {
  if (sets.length === 0) {
    return new Set();
  }
  const [firstSet, ...restOfSets] = sets;

  const result = new Set(firstSet);
  for (const otherSet of restOfSets) {
    for (const value of result) {
      if (!otherSet.has(value)) {
        result.delete(value);
      }
    }
  }

  return result;
}

function countQuestionsWhereAnyAnsweredYes(
  customsForms: CustomsForm[]
): number {
  return union(customsForms).size;
}

function getAnswerPart1(customsFormsData: CustomsForm[][]): number {
  return customsFormsData
    .map(countQuestionsWhereAnyAnsweredYes)
    .reduce((a, b) => a + b, 0);
}

function countQuestionsWhereAllAnsweredYes(
  customsForms: CustomsForm[]
): number {
  return intersection(customsForms).size;
}

function getAnswerPart2(customsFormsData: CustomsForm[][]): number {
  return customsFormsData
    .map(countQuestionsWhereAllAnsweredYes)
    .reduce((a, b) => a + b, 0);
}

async function main() {
  const customsFormsData = await loadCustomsFormsData();
  console.log(getAnswerPart1(customsFormsData));
  console.log(getAnswerPart2(customsFormsData));
}

main();
