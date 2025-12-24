import sys

INPUT_FILENAME = "input.txt"


class Solution:
    def __init__(self, input: str):
        pass

    def part1(self) -> int:
        raise NotImplementedError

    def part2(self) -> int:
        raise NotImplementedError


if __name__ == "__main__":
    input = sys.stdin.read()
    solution = Solution(input)
    print(f"{solution.part1()} {solution.part2()}")
