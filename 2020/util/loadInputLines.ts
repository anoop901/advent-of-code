import * as fs from "fs";
import * as readline from "readline";

export default async function loadInputLines(
  filename: string = "input.txt"
): Promise<string[]> {
  const lines = [] as string[];
  const rl = readline.createInterface(fs.createReadStream(filename));
  for await (const line of rl) {
    lines.push(line);
  }
  return lines;
}
