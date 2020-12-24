import loadInputLines from "../util/loadInputLines";
import {
  PasswordPolicy,
  countValidPasswords,
  isPasswordValidPart1,
  isPasswordValidPart2,
} from "./day02";

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

async function main() {
  const passwordsAndPolicies = await loadPasswordsAndPolicies();
  console.log(countValidPasswords(passwordsAndPolicies, isPasswordValidPart1));
  console.log(countValidPasswords(passwordsAndPolicies, isPasswordValidPart2));
}

main();
