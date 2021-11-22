import { chain } from "@anoop901/js-util";
import split from "@anoop901/js-util/iterables/split";
import splitAt from "@anoop901/js-util/iterables/splitAt";
import toArray from "@anoop901/js-util/iterables/toArray";
import loadInputLines from "../../util/loadInputLines";
import { Rule, RuleSet } from "./Rule";

async function parseRules(): Promise<{ ruleSet: RuleSet; messages: string[] }> {
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
    console.log(possibleSequences);
    ruleSet.set(ruleNumber, { ruleType: "CompositeRule", possibleSequences });
  }

  return { ruleSet, messages };
}

(async () => {
  console.log(await parseRules());

  console.log(2);
  console.log(2);
})();
