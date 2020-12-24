import { countMatching } from "../util/iterators";

export interface PasswordPolicy {
  character: string;
  min: number;
  max: number;
}

export function isPasswordValidPart1(
  password: string,
  policy: PasswordPolicy
): boolean {
  const numOccurrences = countMatching(password, (c) => c === policy.character);
  return policy.min <= numOccurrences && numOccurrences <= policy.max;
}

export function isPasswordValidPart2(
  password: string,
  policy: PasswordPolicy
): boolean {
  const numOccurrences = countMatching(
    [password[policy.min - 1], password[policy.max - 1]],
    (c) => c === policy.character
  );
  return numOccurrences === 1;
}

export function countValidPasswords(
  passwordsAndPolicies: { password: string; policy: PasswordPolicy }[],
  isPasswordValid: (password: string, policy: PasswordPolicy) => boolean
) {
  return countMatching(passwordsAndPolicies, ({ password, policy }) =>
    isPasswordValid(password, policy)
  );
}
