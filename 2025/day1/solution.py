import sys
from enum import Enum


class Direction(Enum):
    LEFT = "L"
    RIGHT = "R"


def parse_instructions(input_text: str) -> list[tuple[Direction, int]]:
    lines = input_text.strip().splitlines()
    return [(Direction(line[0]), int(line[1:])) for line in lines]


def part1(input_text: str) -> int:
    instructions = parse_instructions(input_text)
    position = 50
    password = 0

    for direction, amount in instructions:
        match direction:
            case Direction.LEFT:
                position -= amount
            case Direction.RIGHT:
                position += amount
        position %= 100

        if position == 0:
            password += 1

    return password


def part2(input_text: str) -> int:
    instructions = parse_instructions(input_text)
    position = 50
    password = 0

    for direction, amount in instructions:
        if position == 0:
            password += amount // 100
        else:
            rotation_to_next_zero = (
                position if direction == Direction.LEFT else 100 - position
            )
            if amount >= rotation_to_next_zero:
                password += (amount - rotation_to_next_zero) // 100 + 1

        match direction:
            case Direction.LEFT:
                position -= amount
            case Direction.RIGHT:
                position += amount
        position %= 100

    return password


if __name__ == "__main__":
    input_text = sys.stdin.read()
    print(part1(input_text), part2(input_text))
