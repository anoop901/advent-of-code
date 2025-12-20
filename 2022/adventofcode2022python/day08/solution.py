

from pprint import pprint


INPUT_FILENAME = 'input.txt'


class Solution:
    trees: list[list[int]]
    width: int
    height: int

    def __init__(self, input: str):
        self.trees = [[int(s) for s in input_line]
                      for input_line in input.splitlines()]
        self.width = len(self.trees)
        self.height = len(self.trees[0])

    def part1(self) -> int:
        visible = [[False
                    for _ in range(self.width)]
                   for _ in range(self.height)]
        for row_idx in range(self.height):
            prev_max_height = self.trees[row_idx][0]
            visible[row_idx][0] = True
            for col_idx in range(1, self.width):
                curr_height = self.trees[row_idx][col_idx]
                if curr_height > prev_max_height:
                    prev_max_height = curr_height
                    visible[row_idx][col_idx] = True
            prev_max_height = self.trees[row_idx][-1]
            visible[row_idx][-1] = True
            for col_idx in reversed(range(0, self.width - 1)):
                curr_height = self.trees[row_idx][col_idx]
                if curr_height > prev_max_height:
                    prev_max_height = curr_height
                    visible[row_idx][col_idx] = True
        for col_idx in range(self.width):
            prev_max_height = self.trees[0][col_idx]
            visible[0][col_idx] = True
            for row_idx in range(1, self.height):
                curr_height = self.trees[row_idx][col_idx]
                if curr_height > prev_max_height:
                    prev_max_height = curr_height
                    visible[row_idx][col_idx] = True
            prev_max_height = self.trees[-1][col_idx]
            visible[-1][col_idx] = True
            for row_idx in reversed(range(0, self.height - 1)):
                curr_height = self.trees[row_idx][col_idx]
                if curr_height > prev_max_height:
                    prev_max_height = curr_height
                    visible[row_idx][col_idx] = True

        return sum(sum(x) for x in visible)

    def part2(self) -> int:
        raise NotImplementedError


if __name__ == '__main__':
    with open(INPUT_FILENAME) as input_file:
        input = input_file.read()
        solution = Solution(input)
        print(f'part 1: {solution.part1()}')
        # print(f'part 2: {solution.part2()}')
