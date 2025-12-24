import loadInputLines from "../../util/loadInputLines";

type Operation = "acc" | "jmp" | "nop";

interface Instruction {
  operation: Operation;
  argument: number;
}

async function loadBootCode(): Promise<Instruction[]> {
  return (await loadInputLines()).map((line) => {
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
    yield { instructionIndex, accumulator };

    if (instructionIndex === bootCode.length) {
      break;
    } else if (instructionIndex > bootCode.length || instructionIndex < 0) {
      throw new Error("instruction index out of bounds");
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

function accumulatorValueOnTerminationOrLoop(bootCode: Instruction[]): {
  terminated: boolean;
  finalAccumulator: number;
} {
  const previouslyExecutedInstructions = new Set<number>();
  let instructionIndex = 0;
  let accumulator = 0;
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
      const { finalAccumulator, terminated } =
        accumulatorValueOnTerminationOrLoop(potentialFixedBootCode);
      if (terminated) {
        return finalAccumulator;
      }
    }
  }
  throw new Error("unable to fix program");
}

async function main() {
  const bootCode = await loadBootCode();
  const answerPart1 =
    accumulatorValueOnTerminationOrLoop(bootCode).finalAccumulator;
  const answerPart2 = accumulatorValueOnFixedBootCodeTermination(bootCode);
  console.log(answerPart1, answerPart2);
}

main();
