import wu from "wu";

export function sumNumbers(arr: Iterable<number>): number {
  return wu(arr).reduce((a, b) => a + b, 0);
}
