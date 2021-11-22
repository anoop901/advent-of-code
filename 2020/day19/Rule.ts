export type RuleSet = Map<number, Rule>;
export type Rule = CharacterRule | CompositeRule;

export interface CharacterRule {
  ruleType: "CharacterRule";
  character: string;
}

export interface CompositeRule {
  ruleType: "CompositeRule";
  possibleSequences: number[][];
}
