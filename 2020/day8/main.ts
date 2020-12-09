import * as fs from "fs";
import * as readline from "readline";

type Operation = "acc" | "jmp" | "nop";

interface Instruction {
  operation: Operation;
  argument: number;
}

async function loadBootCode(): Promise<Instruction[]> {
  const rl = readline.createInterface(fs.createReadStream("input.txt"));
  const lines = [] as string[];
  for await (const line of rl) {
    lines.push(line);
  }

  return lines.map((line) => {
    const [operation, argumentString] = line.split(" ");
    const argument = parseInt(argumentString, 10);
    return { operation: operation as Operation, argument };
  });
}

// the yielded accumulator value is active before the instruction at
// instructionIndex is executed
function* interpretBootCode(
  bootCode: Instruction[]
): Iterable<{ instructionIndex: number; accumulator: number }> {
  let accumulator = 0;
  let instructionIndex = 0;
  while (true) {
    console.log({ instructionIndex, accumulator });
    yield { instructionIndex, accumulator };

    if (instructionIndex === bootCode.length) {
      break;
    }

    const instruction = bootCode[instructionIndex];
    switch (instruction.operation) {
      case "acc":
        accumulator += instruction.argument;
        break;
      case "jmp":
        instructionIndex += instruction.argument;
        break;
      case "nop":
        break;
    }
    if (instruction.operation !== "jmp") {
      instructionIndex++;
    }
  }
}

function accumulatorValueOnTerminationOrLoop(
  bootCode: Instruction[]
): { terminated: boolean; finalAccumulator: number } {
  const previouslyExecutedInstructions = new Set<number>();
  let instructionIndex: number = 0;
  let accumulator: number = 0;
  for ({ instructionIndex, accumulator } of interpretBootCode(bootCode)) {
    if (previouslyExecutedInstructions.has(instructionIndex)) {
      return { terminated: false, finalAccumulator: accumulator };
    } else {
      previouslyExecutedInstructions.add(instructionIndex);
    }
  }
  return { terminated: true, finalAccumulator: accumulator };
}

function patchBootCode(
  bootCode: Instruction[],
  instructionIndex: number
): Instruction[] | null {
  const currentInstruction = bootCode[instructionIndex];
  const newInstruction: Instruction = {
    ...currentInstruction,
    operation:
      currentInstruction.operation === "nop"
        ? "jmp"
        : currentInstruction.operation === "jmp"
        ? "nop"
        : currentInstruction.operation,
  };

  if (
    currentInstruction.operation === "nop" ||
    currentInstruction.operation === "jmp"
  ) {
    const patchedBootCode = [...bootCode];
    console.log(
      `at index ${instructionIndex}, flipped ${JSON.stringify(
        currentInstruction
      )} to ${JSON.stringify(newInstruction)}`
    );
    patchedBootCode[instructionIndex] = newInstruction;
    return patchedBootCode;
  } else {
    return null;
  }
}

function accumulatorValueOnFixedBootCodeTermination(
  bootCode: Instruction[]
): number {
  for (
    let instructionIndex = 0;
    instructionIndex < bootCode.length;
    instructionIndex++
  ) {
    const potentialFixedBootCode = patchBootCode(bootCode, instructionIndex);
    if (potentialFixedBootCode !== null) {
      const {
        finalAccumulator,
        terminated,
      } = accumulatorValueOnTerminationOrLoop(potentialFixedBootCode);
      if (terminated) {
        return finalAccumulator;
      }
    }
  }
  throw new Error("unable to fix boot code");
}

async function main() {
  const bootCode = await loadBootCode();
  const answerPart1 = accumulatorValueOnTerminationOrLoop(bootCode)
    .finalAccumulator;
  console.log(answerPart1);

  const answerPart2 = accumulatorValueOnFixedBootCodeTermination(bootCode);
  console.log(answerPart2);
}

main();
