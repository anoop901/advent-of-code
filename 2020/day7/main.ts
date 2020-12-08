import * as fs from "fs";
import * as readline from "readline";
import { parse as parseLuggageRule } from "./luggage_rule";

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
  const rl = readline.createInterface(fs.createReadStream("input.txt"));
  const lines = [] as string[];
  for await (const line of rl) {
    lines.push(line);
  }

  return lines.map((line) => parseLuggageRule(line));
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

function searchForContainableBags(
  startingBagType: BagType,
  containableBagsMap: Map<BagTypeString, BagType[]>
): BagType[] {
  const stack = [startingBagType];
  const result = [];

  let current = stack.pop();
  while (current !== undefined) {
    result.push(current);

    const directlyContainableBags =
      containableBagsMap.get(JSON.stringify(current)) ?? [];

    for (const otherBagType of directlyContainableBags) {
      if (!result.includes(otherBagType)) {
        stack.push(otherBagType);
      }
    }

    current = stack.pop();
  }
  return result;
}

async function main() {
  const luggageRules = await loadLuggageRules();
  const containableBagsMap = generateContainableBagsMap(luggageRules);
  const containableBags = searchForContainableBags(
    {
      adjective: "shiny",
      color: "gold",
    },
    containableBagsMap
  );
  console.log(containableBags.length - 1);
}

main();
