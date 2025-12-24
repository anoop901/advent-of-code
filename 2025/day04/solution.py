import sys


lines = sys.stdin.readlines()
grid = [[c == "@" for c in line.strip()] for line in lines]

offsets = set((di, dj) for di in [-1, 0, 1] for dj in [-1, 0, 1]) - {(0, 0)}

height = len(grid)
width = len(grid[0])


def coord_offset(ij: tuple[int, int], didj: tuple[int, int]) -> tuple[int, int]:
    i, j = ij
    di, dj = didj
    return (i + di, j + dj)


def is_roll_at_coord(coord) -> bool:
    if not (0 <= coord[0] < height and 0 <= coord[1] < width):
        return False
    return grid[coord[0]][coord[1]]


def removable_rolls():
    for i in range(height):
        for j in range(width):
            coord = (i, j)
            if is_roll_at_coord(coord):
                num_neighbors = 0
                for offset in offsets:
                    neighbor_coord = coord_offset(coord, offset)
                    if is_roll_at_coord(neighbor_coord):
                        num_neighbors += 1
                if num_neighbors < 4:
                    yield coord


def remove_removable_rolls():
    rolls = list(removable_rolls())
    for roll_coord in rolls:
        i, j = roll_coord
        grid[i][j] = False
    return len(rolls)


def part1(grid, height, width):
    return len(list(removable_rolls()))


def part2(grid, height, width):
    result = 0
    for _ in range(100):
        num_removed_rolls = remove_removable_rolls()
        result += num_removed_rolls
        if num_removed_rolls == 0:
            break
    return result


print(part1(grid, height, width), part2(grid, height, width))
