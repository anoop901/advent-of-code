import chain from "../../util/chain";
import { countMatching } from "../../util/iterators";

export interface PasswordPolicy {
  character: string;
  min: number;
  max: number;
}

export function isPasswordValidPart1(
  password: string,
  policy: PasswordPolicy
): boolean {
  const numOccurrences = chain(password)
    .then(countMatching((c) => c === policy.character))
    .run();
  return policy.min <= numOccurrences && numOccurrences <= policy.max;
}

export function isPasswordValidPart2(
  password: string,
  policy: PasswordPolicy
): boolean {
  const numOccurrences = chain([
    password[policy.min - 1],
    password[policy.max - 1],
  ])
    .then(countMatching((c) => c === policy.character))
    .run();
  return numOccurrences === 1;
}

export function countValidPasswords(
  passwordsAndPolicies: { password: string; policy: PasswordPolicy }[],
  isPasswordValid: (password: string, policy: PasswordPolicy) => boolean
) {
  return chain(passwordsAndPolicies)
    .then(
      countMatching(({ password, policy }) => isPasswordValid(password, policy))
    )
    .run();
}
