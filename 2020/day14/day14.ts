import { maxHeaderSize } from "http";
import { add } from "lodash";
import { isReturnStatement } from "typescript";
import { sumNumbers } from "../util/numbers";

export type Bit = "1" | "0";
export type MaskBit = "X" | Bit;
export type Mask = MaskBit[];

export type MemoryAddress = number;
export type MemoryValue = number;

export interface MaskInstruction {
  type: "mask";
  mask: Mask;
}

export interface MemoryInstruction {
  type: "memory";
  address: MemoryAddress;
  value: MemoryValue;
}

export type Instruction = MaskInstruction | MemoryInstruction;
export type Program = Instruction[];

export type Memory = Map<MemoryAddress, MemoryValue>;

function applyMaskToValue(mask: Mask, value: MemoryValue): MemoryValue {
  if (mask.length === 0) {
    return value;
  }

  const subResult = applyMaskToValue(
    mask.slice(0, mask.length - 1),
    Math.floor(value / 2)
  );

  switch (mask[mask.length - 1]) {
    case "0":
      return subResult * 2;
    case "1":
      return subResult * 2 + 1;
    case "X":
      return subResult * 2 + (value % 2);
  }
}

function* decodeAddress(
  mask: Mask,
  address: MemoryAddress
): Iterable<MemoryAddress> {
  if (mask.length === 0) {
    yield address;
  } else {
    const subResults = decodeAddress(
      mask.slice(0, mask.length - 1),
      Math.floor(address / 2)
    );

    for (const subResult of subResults) {
      switch (mask[mask.length - 1]) {
        case "0":
          yield subResult * 2 + (address % 2);
          break;
        case "1":
          yield subResult * 2 + 1;
          break;
        case "X":
          yield subResult * 2;
          yield subResult * 2 + 1;
          break;
      }
    }
  }
}

function executeProgram(program: Instruction[], version2: boolean): Memory {
  const memory: Memory = new Map();
  let currentMask: MaskBit[] | null = null;
  for (const instruction of program) {
    switch (instruction.type) {
      case "mask":
        currentMask = instruction.mask;
        break;
      case "memory":
        // instruction.address, instruction.value, currentMask

        if (currentMask !== null) {
          if (!version2) {
            memory.set(
              instruction.address,
              applyMaskToValue(currentMask, instruction.value)
            );
          } else {
            for (const decodedAddress of decodeAddress(
              currentMask,
              instruction.address
            )) {
              memory.set(decodedAddress, instruction.value);
            }
          }
        } else {
          throw new Error("didn't set mask before using");
        }
        break;
    }
  }
  return memory;
}

export function sumMemoryAfterExecuting(
  program: Program,
  version2 = false
): number {
  const finalMemory = executeProgram(program, version2);
  return sumNumbers(finalMemory.values());
}
