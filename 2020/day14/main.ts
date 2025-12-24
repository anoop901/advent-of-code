import loadInputLines from "../../util/loadInputLines";
import { MaskBit, Program, sumMemoryAfterExecuting } from "./day14";

async function parseProgram(): Promise<Program> {
  const lines = await loadInputLines();
  return lines.map((line) => {
    const match1 = /^mask = ([01X]{36})$/.exec(line);
    if (match1 !== null) {
      const mask = match1[1];
      return { type: "mask", mask: Array.from(mask, (x) => x as MaskBit) };
    }

    const match2 = /^mem\[(\d+)\] = (\d+)$/.exec(line);
    if (match2 !== null) {
      const addressString = match2[1];
      const valueString = match2[2];
      return {
        type: "memory",
        address: parseInt(addressString, 10),
        value: parseInt(valueString, 10),
      };
    }

    throw new Error(`invalid instruction "${line}"`);
  });
}

(async () => {
  const program = await parseProgram();
  const answer1 = sumMemoryAfterExecuting(program);
  console.log(answer1);
  const answer2 = sumMemoryAfterExecuting(program, true);
  console.log(answer1, answer2);
})();
