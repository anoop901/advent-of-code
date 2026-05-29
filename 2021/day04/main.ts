import { chain } from "@anoop901/js-util";
import {
  allMatch,
  anyMatch,
  filter,
  generate,
  map,
  sum,
} from "@anoop901/js-util/iterables";
import loadInputLines from "../../util/loadInputLines";
type BingoBoard = BingoSquare[][];

interface BingoSquare {
  number: number;
  marked: boolean;
}

function parseInput(input: string): {
  calledNumbers: number[];
  bingoBoards: BingoBoard[];
} {
  const [calledNumbersStr, ...bingoBoardsStrs] = input.trim().split("\n\n");
  const calledNumbers = calledNumbersStr.split(",").map(Number);
  const bingoBoards = bingoBoardsStrs.map((bingoBoardStr) =>
    bingoBoardStr.split("\n").map((bingoLineStr) =>
      bingoLineStr
        .trim()
        .split(/\s+/)
        .map(Number)
        .map((number) => ({ number, marked: false })),
    ),
  );
  return { calledNumbers, bingoBoards };
}

export function solution(input: string): {
  part1Answer: number;
  part2Answer: number;
} {
  const { calledNumbers, bingoBoards } = parseInput(input);
  JSON.stringify;

  const part1Answer = playBingo(calledNumbers, bingoBoards);
  const part2Answer = playBingoToLose(calledNumbers, bingoBoards);

  return { part1Answer, part2Answer };
}

function playBingo(calledNumbers: number[], bingoBoards: BingoBoard[]): number {
  for (const calledNumber of calledNumbers) {
    for (const bingoBoard of bingoBoards) {
      updateBingoBoard(bingoBoard, calledNumber);
      if (isWinningBingoBoard(bingoBoard)) {
        return scoreBingoBoard(bingoBoard, calledNumber);
      }
    }
  }
  return 0;
}

function playBingoToLose(
  calledNumbers: number[],
  bingoBoards: BingoBoard[],
): number {
  const wonBoardIdxs = new Set<number>();
  let lastBoardIdx: number | null = null;
  let lastCalledNumber: number | null = null;
  for (const calledNumber of calledNumbers) {
    for (
      let bingoBoardIdx = 0;
      bingoBoardIdx < bingoBoards.length;
      bingoBoardIdx++
    ) {
      if (wonBoardIdxs.has(bingoBoardIdx)) {
        continue;
      }
      const bingoBoard = bingoBoards[bingoBoardIdx];
      updateBingoBoard(bingoBoard, calledNumber);
      if (isWinningBingoBoard(bingoBoard)) {
        wonBoardIdxs.add(bingoBoardIdx);
        lastBoardIdx = bingoBoardIdx;
        lastCalledNumber = calledNumber;
      }
    }
  }
  if (lastBoardIdx == null || lastCalledNumber == null) {
    throw new Error("none of the bingo boards won");
  }
  return scoreBingoBoard(bingoBoards[lastBoardIdx], lastCalledNumber);
}

function scoreBingoBoard(
  bingoBoard: BingoBoard,
  lastCalledNumber: number,
): number {
  const unmarkedSum = chain(bingoBoard)
    .then(map(filter((bingoSquare) => !bingoSquare.marked)))
    .then(map(map((bingoSquare) => bingoSquare.number)))
    .then(map(sum))
    .then(sum)
    .end();
  return unmarkedSum * lastCalledNumber;
}

function updateBingoBoard(bingoBoard: BingoBoard, calledNumber: number): void {
  for (const bingoBoardRow of bingoBoard) {
    for (const bingoSquare of bingoBoardRow) {
      if (bingoSquare.number === calledNumber) {
        bingoSquare.marked = true;
      }
    }
  }
}

function isWinningBingoBoard(bingoBoard: BingoBoard): boolean {
  const rows = bingoBoard;
  const columns = generate(
    (columnIndex) => rows.map((row) => row[columnIndex]),
    rows[0].length,
  );
  return chain([...rows, ...columns])
    .then(anyMatch(allMatch((x) => x.marked)))
    .end();
}

(async () => {
  const input = (await loadInputLines()).join("\n");
  const { part1Answer, part2Answer } = solution(input);
  console.log(part1Answer, part2Answer);
})();
