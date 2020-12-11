import * as fs from "fs";
import * as readline from "readline";
import { XmasData } from "./day9";

export async function loadXmasData(): Promise<XmasData> {
  const rl = readline.createInterface(fs.createReadStream("input.txt"));

  const result = [] as number[];
  for await (const line of rl) {
    const n = parseInt(line, 10);
    if (isNaN(n)) {
      throw new Error("malformed input");
    }
    result.push(n);
  }
  return { numbers: result, preambleLength: 25 };
}
