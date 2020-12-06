import * as fs from "fs";
import * as readline from 'readline';
import { isMainThread } from "worker_threads";

async function loadBoardingPasses(): Promise<string[]> {
  const rl = readline.createInterface(fs.createReadStream('input.txt'))
  const ret = [];
  for await (const line of rl) {
    ret.push(line);
  }
  return ret;
}

function binarySpacePartitioningToNumber(bsp: string, lowerHalfChar: string, upperHalfChar: string) {
  // 'BBFFFBF'
  // '' -> 0
  // 'B' -> 1
  // 'BB' -> 3
  // 'BBF' -> 6
  // 'BBFF' -> 12 (between 0 to 15)
  // 'BBFFF' -> 24 (between 0 to 31)
  // 'BBFFFB' -> 49
  let result = 0;
  for (const c of bsp) {
    result *= 2;
    if (c === upperHalfChar) {
      result += 1;
    }
  }
  return result;
}

function boardingPassToSeatId(boardingPass: string): number {
  const rowPart = boardingPass.slice(0, 7);
  const columnPart = boardingPass.slice(7);

  const rowIndex = binarySpacePartitioningToNumber(rowPart, 'F', 'B');
  const columnIndex = binarySpacePartitioningToNumber(columnPart, 'L', 'R');

  const seatId = rowIndex * 8 + columnIndex;
  return seatId;
}

function findHoleInefficient(nums: number[]): number {
  // [5, 6, 7, 9, 10] -> 8
  const sortedNums = [...nums].sort((a, b) => a - b)
  for (let i = 0; i < sortedNums.length - 1; i++) {
    const val1 = sortedNums[i];
    const val2 = sortedNums[i + 1];
    if (val2 - val1 !== 1) {
      return val1 + 1;
    }
  }
  throw new Error('no hole in array');
}

function findHole(nums: number[]): number {
  const numsSet = new Set(nums);
  for (const num of nums) {
    if (!numsSet.has(num + 1) && numsSet.has(num + 2)) {
      return num + 1;
    }
  }
  throw new Error('no hole in array');
}

async function main() {
  const boardingPasses = (await loadBoardingPasses());

  const seatIds = boardingPasses.map(boardingPassToSeatId)
  console.log(Math.max(...seatIds));
  console.log(findHole(seatIds));
}

main();
