from copy import deepcopy


input_data = open("input.txt").read()
input_map, input_instructions = input_data.split("\n\n")
input_map = input_map.splitlines()
input_map = list(map(lambda l: list(l), input_map))
input_instructions = "".join(input_instructions.strip().splitlines())


def coord_offset(coord, offset):
    return (coord[0] + offset[0], coord[1] + offset[1])


def read_map(coord):
    return input_map[coord[0]][coord[1]]


def write_map(coord, symbol):
    input_map[coord[0]][coord[1]] = symbol


def print_map():
    input_map_copy = deepcopy(input_map)
    input_map_copy[robot_coord[0]][robot_coord[1]] = "@"
    print("\n".join(["".join(l) for l in input_map_copy]))


map_size = (50, 50)
robot_coord = (24, 24)
input_map[robot_coord[0]][robot_coord[1]] = "."
# print_map()
for instruction in input_instructions:
    # print(instruction)
    # input()

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
    while read_map(ahead_coord) == "O":
        ahead_coord = coord_offset(ahead_coord, offset)
    if read_map(ahead_coord) != "#":
        robot_coord = coord_offset(robot_coord, offset)
        write_map(robot_coord, ".")
        if ahead_coord != robot_coord:
            write_map(ahead_coord, "O")

print_map()

sum_of_gps = 0
for c0 in range(map_size[0]):
    for c1 in range(map_size[1]):
        if read_map((c0, c1)) == "O":
            sum_of_gps += c0 * 100 + c1

print(sum_of_gps)
