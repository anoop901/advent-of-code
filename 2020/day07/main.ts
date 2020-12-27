import loadInputLines from "../../util/loadInputLines";
import { map, sum } from "../../util/iterables";
import { parse as parseLuggageRule } from "./luggage_rule";
import chain from "../../util/chain";

type BagTypeString = string;

interface LuggageRule {
  bagType: BagType;
  conditions: Condition[];
}

interface BagType {
  adjective: string;
  color: string;
}

interface Condition {
  expectedNumber: number;
  bagType: BagType;
}

async function loadLuggageRules(): Promise<LuggageRule[]> {
  return (await loadInputLines()).map((line) => parseLuggageRule(line));
}

function generateContainableBagsMap(
  luggageRules: LuggageRule[]
): Map<BagTypeString, BagType[]> {
  const result = new Map<BagTypeString, BagType[]>();
  for (const luggageRule of luggageRules) {
    for (const condition of luggageRule.conditions) {
      const containingBag = luggageRule.bagType;
      const containedBag = condition.bagType;

      const key = JSON.stringify(containedBag);
      const existingValue = result.get(key);

      if (existingValue !== undefined) {
        result.set(key, [...existingValue, containingBag]);
      } else {
        result.set(key, [containingBag]);
      }
    }
  }
  return result;
}

function luggageRulesToMap(
  luggageRules: LuggageRule[]
): Map<BagTypeString, Condition[]> {
  const result = new Map<BagTypeString, Condition[]>();
  for (const luggageRule of luggageRules) {
    const containingBag = luggageRule.bagType;
    const key = JSON.stringify(containingBag);
    result.set(key, luggageRule.conditions);
  }
  return result;
}

function searchForContainableBags(
  startingBagType: BagType,
  containableBagsMap: Map<BagTypeString, BagType[]>
): BagType[] {
  const stack = [] as BagType[];
  const result = [] as BagType[];

  let current: BagType | undefined = startingBagType;
  while (current !== undefined) {
    const directlyContainableBags =
      containableBagsMap.get(JSON.stringify(current)) ?? [];

    for (const otherBagType of directlyContainableBags) {
      if (!result.includes(otherBagType)) {
        result.push(otherBagType);
        stack.push(otherBagType);
      }
    }

    current = stack.pop();
  }
  return result;
}

function numberOfBagsContainedInBagType(
  bagType: BagType,
  luggageRulesMap: Map<BagTypeString, Condition[]>
): number {
  const conditions = luggageRulesMap.get(JSON.stringify(bagType)) ?? [];

  return chain(conditions)
    .then(
      map(
        (condition) =>
          condition.expectedNumber *
          (1 +
            numberOfBagsContainedInBagType(condition.bagType, luggageRulesMap))
      )
    )
    .then(sum)
    .end();
}

async function main() {
  const myBagType = {
    adjective: "shiny",
    color: "gold",
  };
  const luggageRules = await loadLuggageRules();
  const containableBagsMap = generateContainableBagsMap(luggageRules);
  const containableBags = searchForContainableBags(
    myBagType,
    containableBagsMap
  );
  console.log(containableBags.length);

  const luggageRulesMap = luggageRulesToMap(luggageRules);
  const numberOfBagsContained = numberOfBagsContainedInBagType(
    myBagType,
    luggageRulesMap
  );
  console.log(numberOfBagsContained);
}

main();
