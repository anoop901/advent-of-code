INPUT_FILENAME = 'input.txt'


class Solution:

    def __init__(self, input: str):
        pass

    def part1(self) -> int:
        raise NotImplementedError

    def part2(self) -> int:
        raise NotImplementedError


if __name__ == '__main__':
    with open(INPUT_FILENAME) as input_file:
        input = input_file.read()
        solution = Solution(input)
        # print(f'part 1: {solution.part1()}')
        # print(f'part 2: {solution.part2()}')
