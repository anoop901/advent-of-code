from pprint import pprint
import sys
from copy import deepcopy


input_txt = sys.stdin.read()
input_map_txt, input_instructions_txt = input_txt.split("\n\n")
input_map_txt_lines = input_map_txt.splitlines()
input_instructions = "".join(input_instructions_txt.strip().splitlines())


def coord_offset(coord, offset):
    return (coord[0] + offset[0], coord[1] + offset[1])


def read_map(mp, coord):
    return mp[coord[0]][coord[1]]


def write_map(mp, coord, symbol):
    mp[coord[0]][coord[1]] = symbol


def parse_map_part1() -> tuple[list[list[str]], tuple[int, int]]:
    robot_coord = (-1, -1)
    for i, line in enumerate(input_map_txt_lines):
        try:
            robot_coord = (i, line.index("@"))
        except ValueError:
            pass
    return [list(line) for line in input_map_txt_lines], robot_coord


def part1():
    mp, robot_coord = parse_map_part1()
    map_size = len(mp), len(mp[0])
    mp[robot_coord[0]][robot_coord[1]] = "."
    for instruction in input_instructions:
        offset = (0, 0)
        if instruction == "<":
            offset = (0, -1)
        elif instruction == ">":
            offset = (0, 1)
        elif instruction == "^":
            offset = (-1, 0)
        elif instruction == "v":
            offset = (1, 0)
        else:
            raise ValueError(repr(instruction))

        ahead_coord = coord_offset(robot_coord, offset)
        while read_map(mp, ahead_coord) == "O":
            ahead_coord = coord_offset(ahead_coord, offset)
        if read_map(mp, ahead_coord) != "#":
            robot_coord = coord_offset(robot_coord, offset)
            write_map(mp, robot_coord, ".")
            if ahead_coord != robot_coord:
                write_map(mp, ahead_coord, "O")
    sum_of_gps = 0
    for c0 in range(map_size[0]):
        for c1 in range(map_size[1]):
            if read_map(mp, (c0, c1)) == "O":
                sum_of_gps += c0 * 100 + c1

    return sum_of_gps


def parse_map_part2() -> tuple[list[list[str]], tuple[int, int], list[tuple[int, int]]]:
    box_locations = []
    mp = []
    robot_coord = (-1, -1)
    for c0, line_txt in enumerate(input_map_txt_lines):
        new_line = []
        for c1, symbol in enumerate(line_txt):
            coord = (c0, c1 * 2)
            if symbol == "O":
                box_locations.append(coord)
            if symbol in {".", "@", "O"}:
                new_line += [".", "."]
            elif symbol == "#":
                new_line += ["#", "#"]
            if symbol == "@":
                robot_coord = coord
        mp.append(new_line)
    return mp, robot_coord, box_locations


def coords_occupied_by_box(box_index, box_locations):
    box_coord = box_locations[box_index]
    return {box_coord, (box_coord[0], box_coord[1] + 1)}


def index_of_box_at(coord, box_locations):
    for i, _ in enumerate(box_locations):
        if coord in coords_occupied_by_box(i, box_locations):
            return i
    return None


def indices_of_boxes_to_move(push_from_coord, push_offset, box_locations, mp):
    initial_pushed_box_index = index_of_box_at(
        coord_offset(push_from_coord, push_offset), box_locations
    )
    if initial_pushed_box_index is None:
        if read_map(mp, coord_offset(push_from_coord, push_offset)) == "#":
            return None
        else:
            return set()
    dfs_stack = [initial_pushed_box_index]
    visited = set()
    while len(dfs_stack) > 0:
        curr_box = dfs_stack.pop()
        visited.add(curr_box)
        next_boxes = set()
        curr_box_coords = coords_occupied_by_box(curr_box, box_locations)
        for coord in curr_box_coords:
            next_coord = coord_offset(coord, push_offset)
            if read_map(mp, next_coord) == "#":
                return None
            next_box = index_of_box_at(next_coord, box_locations)
            if next_box is not None and next_box != curr_box:
                next_boxes.add(next_box)
        dfs_stack += list(next_boxes)
    return visited


def part2():
    mp, robot_coord, box_locations = parse_map_part2()

    for instruction in input_instructions:
        offset = (0, 0)
        if instruction == "<":
            offset = (0, -1)
        elif instruction == ">":
            offset = (0, 1)
        elif instruction == "^":
            offset = (-1, 0)
        elif instruction == "v":
            offset = (1, 0)
        else:
            raise ValueError(repr(instruction))

        box_indices = indices_of_boxes_to_move(robot_coord, offset, box_locations, mp)

        ahead_coord = coord_offset(robot_coord, offset)
        if box_indices is not None:
            for box_index in box_indices:
                box_locations[box_index] = coord_offset(
                    box_locations[box_index], offset
                )
            robot_coord = ahead_coord

    sum_of_gps = 0
    for c0, c1 in box_locations:
        sum_of_gps += c0 * 100 + c1

    return sum_of_gps


print(part1(), part2())
