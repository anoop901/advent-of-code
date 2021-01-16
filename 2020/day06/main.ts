import chain from "@anoop901/js-util/chain";
import map from "@anoop901/js-util/iterables/map";
import split from "@anoop901/js-util/iterables/split";
import loadInputLines from "../../util/loadInputLines";

type Question = string; // 'a', 'b', ...
type CustomsForm = Set<Question>;

async function loadCustomsFormsData(): Promise<CustomsForm[][]> {
  const lines = await loadInputLines();

  return chain(lines)
    .then(split(""))
    .then(
      map((chunk) =>
        chunk.map((customsFormString) => new Set(customsFormString))
      )
    )
    .then((iter) => Array.from(iter))
    .end();
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
