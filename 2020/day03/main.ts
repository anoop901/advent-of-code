import * as fs from "fs";
import * as readline from "readline";

async function loadMap(): Promise<boolean[][]> {
  const rl = readline.createInterface({
    input: fs.createReadStream("input.txt"),
  });
  const ret = [];
  for await (const line of rl) {
    ret.push(Array.from(line, (c) => c === "#"));
  }
  return ret;
}

function countTreesInPath(
  map: boolean[][],
  slope: { right: number; down: number }
): number {
  let count = 0;
  let cellsChecked = 0;
  for (
    let cellsChecked = 0;
    cellsChecked * slope.down < map.length;
    cellsChecked++
  ) {
    const row = cellsChecked * slope.down;
    const col = cellsChecked * slope.right;
    const mapRow = map[row];
    const treePresent = mapRow[col % mapRow.length];
    if (treePresent) {
      count++;
    }
  }
  return count;
}

async function main() {
  const map = await loadMap();
  console.log(countTreesInPath(map, { right: 3, down: 1 }));

  console.log(
    countTreesInPath(map, { right: 1, down: 1 }) *
      countTreesInPath(map, { right: 3, down: 1 }) *
      countTreesInPath(map, { right: 5, down: 1 }) *
      countTreesInPath(map, { right: 7, down: 1 }) *
      countTreesInPath(map, { right: 1, down: 2 })
  );
}
main();
