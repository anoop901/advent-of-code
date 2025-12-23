from pprint import pprint
import sys
from dijkstra import dijkstra, dijkstra_full

input_map = [list(line) for line in sys.stdin.read().strip().splitlines()]

input_size = (len(input_map), len(input_map[0]))
assert all(len(l) == input_size[1] for l in input_map)

start_coord = (input_size[0] - 2, 1)
end_coord = (1, input_size[1] - 2)
assert input_map[start_coord[0]][start_coord[1]] == "S"
assert input_map[end_coord[0]][end_coord[1]] == "E"
input_map[start_coord[0]][start_coord[1]] = "."
input_map[end_coord[0]][end_coord[1]] = "."

assert all(all(c in {".", "#"} for c in l) for l in input_map)

LEFT = (0, -1)
RIGHT = (0, 1)
UP = (-1, 0)
DOWN = (1, 0)
DIRECTIONS = [LEFT, RIGHT, UP, DOWN]


def neighbors(coord):
    return [coord_offset(coord, offset) for offset in DIRECTIONS]


def coord_offset(coord, offset):
    return (coord[0] + offset[0], coord[1] + offset[1])


def negative_offset(offset):
    return (-offset[0], -offset[1])


def rotate_cw_offset(offset):
    return (-offset[1], offset[0])


def rotate_ccw_offset(offset):
    return (offset[1], -offset[0])


def read_map(coord):
    return input_map[coord[0]][coord[1]]


def write_map(coord, symbol):
    input_map[coord[0]][coord[1]] = symbol


def print_map():
    print("\n".join("".join(row) for row in input_map))


all_empty_coords = [
    (c0, c1)
    for c0 in range(input_size[0])
    for c1 in range(input_size[1])
    if read_map((c0, c1)) == "."
]


def find_incoming_neighbors(state):
    coord, offset = state
    return {
        (
            coord_offset(coord, negative_offset(offset)),
            offset,
        ): 1,
        (coord, rotate_cw_offset(offset)): 1000,
        (coord, rotate_ccw_offset(offset)): 1000,
    }


def is_blocked_ahead_and_behind(state):
    coord, offset = state
    return (
        read_map(coord_offset(coord, offset)) == "#"
        and read_map(coord_offset(coord, negative_offset(offset))) == "#"
    )


all_states = [
    (coord, offset)
    for coord in all_empty_coords
    for offset in DIRECTIONS
    if not is_blocked_ahead_and_behind((coord, offset)) or coord == start_coord
]
start_state = (start_coord, RIGHT)
end_states = [(end_coord, offset) for offset in DIRECTIONS]

dijkstra_results = dijkstra_full(all_states, end_states, find_incoming_neighbors)


def part1():
    return dijkstra_results[start_state][0]


def part2():
    dfs_stack = [start_state]
    search_results = []
    while len(dfs_stack) > 0:
        curr = dfs_stack.pop()
        search_results += [curr]
        dfs_stack += dijkstra_results[curr][1]

    coords_on_shortest_paths = list({coord for coord, _ in search_results})
    return len(coords_on_shortest_paths)


print(part1(), part2())
