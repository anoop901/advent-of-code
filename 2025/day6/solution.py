import sys
import numpy as np

input_text = sys.stdin.read()


def part1():
    grid = np.array([line.split() for line in input_text.splitlines()])
    operators = grid[-1]
    grid_numbers = grid[:-1].astype("int")
    print(grid.shape, operators.shape, grid_numbers.shape)
    result = 0
    for operator, column in zip(operators, grid_numbers.T):
        match operator:
            case "+":
                result += np.sum(column)
            case "*":
                result += np.prod(column)
            case _:
                raise ValueError()
    return result


def part2():
    grid = np.asarray([list(line) for line in input_text.splitlines()])
    operands = []
    result = 0
    for column in grid.T[::-1]:
        if (column == " ").all():
            operands.clear()
            continue
        digits = column[:-1]
        num = int("".join(digits).strip())
        operands.append(num)
        operator = column[-1]
        match operator:
            case "+":
                result += np.sum(operands)
            case "*":
                result += np.prod(operands)
    return result


print(part1(), part2())
