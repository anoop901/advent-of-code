import wu from "wu";
import { countMatching } from "../util/iterators";
import loadInputLines from "../util/loadInputLines";

interface PasswordPolicy {
  character: string;
  min: number;
  max: number;
}

async function loadPasswordsAndPolicies(): Promise<
  { password: string; policy: PasswordPolicy }[]
> {
  return (await loadInputLines()).map((line) => {
    const pattern = /^(?<min>\d+)-(?<max>\d+) (?<character>.): (?<password>.*)$/;
    const match = pattern.exec(line);
    if (match != null && match.groups != null) {
      return {
        password: match.groups["password"],
        policy: {
          character: match.groups["character"],
          min: Number(match.groups["min"]),
          max: Number(match.groups["max"]),
        },
      };
    } else {
      throw new Error(`malformed input line "${line}"`);
    }
  });
}

function isPasswordValidPart1(
  password: string,
  policy: PasswordPolicy
): boolean {
  const numOccurrences = countMatching(password, (c) => c === policy.character);
  return policy.min <= numOccurrences && numOccurrences <= policy.max;
}

function isPasswordValidPart2(
  password: string,
  policy: PasswordPolicy
): boolean {
  const numOccurrences = countMatching(
    [password[policy.min - 1], password[policy.max - 1]],
    (c) => c === policy.character
  );
  return numOccurrences === 1;
}

function countValidPasswords(
  passwordsAndPolicies: { password: string; policy: PasswordPolicy }[],
  isPasswordValid: (password: string, policy: PasswordPolicy) => boolean
) {
  return countMatching(passwordsAndPolicies, ({ password, policy }) =>
    isPasswordValid(password, policy)
  );
}

async function main() {
  const passwordsAndPolicies = await loadPasswordsAndPolicies();
  console.log(countValidPasswords(passwordsAndPolicies, isPasswordValidPart1));
  console.log(countValidPasswords(passwordsAndPolicies, isPasswordValidPart2));
}

main();
