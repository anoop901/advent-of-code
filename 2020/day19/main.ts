import { chain } from "@anoop901/js-util";
import map from "@anoop901/js-util/iterables/map";
import split from "@anoop901/js-util/iterables/split";
import toArray from "@anoop901/js-util/iterables/toArray";
import loadInputLines from "../../util/loadInputLines";
import peg from "pegjs";
import { Rule, RuleSet } from "./Rule";
import countMatching from "@anoop901/js-util/iterables/countMatching";

async function parseInput(): Promise<{ ruleSet: RuleSet; messages: string[] }> {
  const ruleSet = new Map<number, Rule>();

  const lines = await loadInputLines();
  const [ruleSetLines, messages] = chain(lines)
    .then(split(""))
    .then(toArray)
    .end();

  for (const ruleSetLine of ruleSetLines) {
    const [ruleNumberString, ruleString] = ruleSetLine.split(": ", 2);
    const ruleNumber = Number(ruleNumberString);

    const match = ruleString.match(/"([a-z])"/);
    if (match) {
      ruleSet.set(ruleNumber, {
        ruleType: "CharacterRule",
        character: match[1],
      });
      continue;
    }

    const ruleSequencesStrings = ruleString.split(" | ");
    const possibleSequences = ruleSequencesStrings.map((ruleSequenceString) =>
      ruleSequenceString.split(" ").map(Number)
    );
    ruleSet.set(ruleNumber, { ruleType: "CompositeRule", possibleSequences });
  }

  return { ruleSet, messages };
}

function updateRuleSet(ruleSet: RuleSet): void {
  ruleSet.set(8, {
    ruleType: "CompositeRule",
    possibleSequences: [[42], [42, 8]],
  });
  ruleSet.set(11, {
    ruleType: "CompositeRule",
    possibleSequences: [
      [42, 31],
      [42, 11, 31],
    ],
  });
}

function generatePegGrammar(ruleSet: RuleSet): string {
  return chain(ruleSet.entries())
    .then(
      map(([ruleNumber, rule]) => {
        const ruleString =
          rule.ruleType === "CharacterRule"
            ? `"${rule.character}"`
            : rule.possibleSequences
                .map((sequence) => sequence.map((r) => `rule${r}`).join(" "))
                .join(" / ");
        return `rule${ruleNumber} = ${ruleString}`;
      })
    )
    .then(toArray)
    .then((arr) => ["start = rule0", ...arr])
    .then((arr) => arr.join("\n"))
    .end();
}

function numMessagesValidWithRuleSet(
  ruleSet: RuleSet,
  messages: string[]
): number {
  const parser = peg.generate(generatePegGrammar(ruleSet));
  const messageIsValid = (message: string) => {
    try {
      parser.parse(message);
      return true;
    } catch (e) {
      return false;
    }
  };
  return chain(messages).then(countMatching(messageIsValid)).end();
}

(async () => {
  const { ruleSet, messages } = await parseInput();
  const part1Answer = numMessagesValidWithRuleSet(ruleSet, messages);
  updateRuleSet(ruleSet);
  const part2Answer = numMessagesValidWithRuleSet(ruleSet, messages);

  console.log(part1Answer, part2Answer);
})();
