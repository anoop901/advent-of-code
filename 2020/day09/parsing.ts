import loadInputLines from "../../util/loadInputLines";
import { XmasData } from "./day09";

export async function loadXmasData(): Promise<XmasData> {
  const numbers = (await loadInputLines()).map((line) => {
    const n = parseInt(line, 10);
    if (isNaN(n)) {
      throw new Error("malformed input");
    }
    return n;
  });
  return { numbers, preambleLength: 25 };
}
