from pathlib import Path
import sys
import itertools
from pprint import pprint
import pixie

red_squares = [
    tuple([int(s) for s in line.split(",")]) for line in sys.stdin.read().splitlines()
]


def area_of_rectangle_made_by_squares(square1, square2):
    x1, y1 = square1
    x2, y2 = square2
    left = min(x1, x2)
    right = max(x1, x2) + 1
    top = min(y1, y2)
    bottom = max(y1, y2) + 1
    return (right - left) * (bottom - top)


def square_is_inside_rectangle_made_by_squares(square, corner1, corner2):
    x, y = square
    x1, y1 = corner1
    x2, y2 = corner2

    # make (x1, y1) the top left corner, and (x2, y2) the bottom right corner
    x1, x2 = min(x1, x2), max(x1, x2)
    y1, y2 = min(y1, y2), max(y1, y2)

    return x1 < x < x2 and y1 < y < y2


def part1() -> int:
    return max(
        area_of_rectangle_made_by_squares(square1, square2)
        for square1, square2 in itertools.combinations(red_squares, 2)
    )


def rectangle_enclosed_in_area_with_verticals_by_y(corner1, corner2, verticals_by_y):
    x1, y1 = corner1
    x2, y2 = corner2

    # make (x1, y1) the top left corner, and (x2, y2) the bottom right corner
    x1, x2 = min(x1, x2), max(x1, x2)
    y1, y2 = min(y1, y2), max(y1, y2)

    assert all([len(verticals_by_y[y]) % 2 == 0 for y in range(y1, y2)])

    return all(
        any(
            vert_x1 <= x1 <= x2 <= vert_x2
            for vert_x1, vert_x2 in itertools.batched(verticals_by_y[y], 2)
        )
        for y in range(y1, y2)
    )


def calc_compression(coords):
    xx = sorted(set(x for x, y in coords))
    yy = sorted(set(y for x, y in coords))
    x_to_xcomp = {x: i for i, x in enumerate(xx)}
    y_to_ycomp = {y: i for i, y in enumerate(yy)}

    def uncompress(compressed_coord):
        xcomp, ycomp = compressed_coord
        return (xx[xcomp], yy[ycomp])

    def compress(coord):
        x, y = coord
        return (x_to_xcomp[x], y_to_ycomp[y])

    return (compress, uncompress, len(xx), len(yy))


def part2() -> int:
    compress, uncompress, _, num_ys = calc_compression(red_squares)
    red_squares_comp = [compress(sq) for sq in red_squares]

    verticals = [[] for y in range(num_ys - 1)]
    for (x1, y1), (x2, y2) in itertools.pairwise(
        red_squares_comp + red_squares_comp[:1]
    ):
        if x1 == x2 and y1 != y2:
            x = x1
            for y in range(min(y1, y2), max(y1, y2)):
                verticals[y].append(x)
    for verts in verticals:
        verts.sort()

    return max(
        area_of_rectangle_made_by_squares(uncompress(corner1), uncompress(corner2))
        for (corner1, corner2) in itertools.combinations(red_squares_comp, 2)
        if rectangle_enclosed_in_area_with_verticals_by_y(corner1, corner2, verticals)
    )


print(f"{part1()} {part2()}")
