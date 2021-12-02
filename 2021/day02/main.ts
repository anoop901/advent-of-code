import { chain } from "@anoop901/js-util";
import { map, toArray } from "@anoop901/js-util/iterables";
import loadInputLines from "../../util/loadInputLines";

type Direction = "forward" | "down" | "up";

interface Command {
  direction: Direction;
  amount: number;
}

interface Position {
  horizontal: number;
  depth: number;
}

async function loadCommands(): Promise<Command[]> {
  return chain(await loadInputLines())
    .then(map((line) => line.split(" ")))
    .then(
      map(([directionStr, amountStr]) => ({
        direction: directionStr as Direction,
        amount: Number(amountStr),
      }))
    )
    .then(toArray)
    .end();
}

function positionAfterFollowingCommands(commands: Command[]) {
  const position = { horizontal: 0, depth: 0 };
  for (const command of commands) {
    switch (command.direction) {
      case "forward":
        position.horizontal += command.amount;
        break;
      case "down":
        position.depth += command.amount;
        break;
      case "up":
        position.depth -= command.amount;
        break;
    }
  }
  return position;
}

function positionAfterFollowingCommandsComplicated(commands: Command[]) {
  const position = { horizontal: 0, depth: 0 };
  let aim = 0;
  for (const command of commands) {
    switch (command.direction) {
      case "forward":
        position.horizontal += command.amount;
        position.depth += aim * command.amount;
        break;
      case "down":
        aim += command.amount;
        break;
      case "up":
        aim -= command.amount;
        break;
    }
  }
  return position;
}

(async () => {
  const commands = await loadCommands();
  const finalPosition = positionAfterFollowingCommands(commands);
  const part1Answer = finalPosition.horizontal * finalPosition.depth;
  console.log(part1Answer);

  const finalPosition2 = positionAfterFollowingCommandsComplicated(commands);
  const part2Answer = finalPosition2.horizontal * finalPosition2.depth;
  console.log(part2Answer);
})();
