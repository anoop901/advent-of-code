import * as readline from "readline";

export default async function loadInputLines(): Promise<string[]> {
  const lines = [] as string[];
  const rl = readline.createInterface(process.stdin);
  for await (const line of rl) {
    lines.push(line);
  }
  return lines;
}
