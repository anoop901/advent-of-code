import * as fs from "fs";
import * as readline from "readline";

interface PasswordPolicy {
  character: string;
  min: number;
  max: number;
}

async function loadInput(): Promise<
  { password: string; policy: PasswordPolicy }[]
> {
  const rl = readline.createInterface({
    input: fs.createReadStream("input.txt"),
  });
  const ret = [];
  for await (const line of rl) {
    const pattern = /^(?<minOccurrences>\d+)-(?<maxOccurrences>\d+) (?<character>.): (?<password>.*)$/;
    const match = pattern.exec(line);
    if (match != null && match.groups != null) {
      ret.push({
        password: match.groups["password"],
        policy: {
          character: match.groups["character"],
          min: parseInt(match.groups["minOccurrences"]),
          max: parseInt(match.groups["maxOccurrences"]),
        },
      });
    } else {
      throw new Error(`malformed input line "${line}"`);
    }
  }
  return ret;
}

function isPasswordValidPart1(
  password: string,
  policy: PasswordPolicy
): boolean {
  const numOccurrences = Array.from(password)
    .map((c) => c === policy.character)
    .reduce((acc, x) => (x ? acc + 1 : acc), 0);
  return policy.min <= numOccurrences && numOccurrences <= policy.max;
}

function isPasswordValidPart2(
  password: string,
  policy: PasswordPolicy
): boolean {
  const numOccurrences = [password[policy.min - 1], password[policy.max - 1]]
    .map((c) => c === policy.character)
    .reduce((acc, x) => (x ? acc + 1 : acc), 0);
  return numOccurrences === 1;
}

function countValidPasswords(
  passwordsAndPolicies: { password: string; policy: PasswordPolicy }[],
  isPasswordValid: (password: string, policy: PasswordPolicy) => boolean
) {
  return passwordsAndPolicies
    .map(({ password, policy }) => isPasswordValid(password, policy))
    .reduce((acc, x) => (x ? acc + 1 : acc), 0);
}

async function main() {
  const passwordsAndPolicies = await loadInput();
  console.log(countValidPasswords(passwordsAndPolicies, isPasswordValidPart1));
  console.log(countValidPasswords(passwordsAndPolicies, isPasswordValidPart2));
}

main();
