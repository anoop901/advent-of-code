export function parseInputLines(input: string): string[] {
  const lines = input.split("\n");
  if (lines[lines.length - 1] === "") {
    lines.pop();
  }
  return lines;
}
