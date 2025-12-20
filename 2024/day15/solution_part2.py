from copy import deepcopy


input_data = open("input.txt").read()
input_map, input_instructions = input_data.split("\n\n")
input_map = input_map.splitlines()
input_map = list(map(lambda l: list(l), input_map))
input_instructions = "".join(input_instructions.strip().splitlines())
box_locations = []

map_size = (50, 100)
robot_coord = (24, 24 * 2)

def expand_map():
    global box_locations
    box_locations = []
    for c0 in range(map_size[0]):
        new_line = []
        for c1 in range(map_size[1] // 2):
            symbol = read_map((c0, c1))
            if symbol  == 'O':
                box_locations.append((c0, c1 * 2))
            if symbol in {'.', '@', 'O'}:
                new_line += ['.', '.']
            elif symbol == '#':
                new_line += ['#', '#']
        input_map[c0] = new_line


def coord_offset(coord, offset):
    return (coord[0] + offset[0], coord[1] + offset[1])


def read_map(coord):
    return input_map[coord[0]][coord[1]]


def write_map(coord, symbol):
    input_map[coord[0]][coord[1]] = symbol


def print_map():
    input_map_copy = deepcopy(input_map)
    for box_location in box_locations:
        input_map_copy[box_location[0]][box_location[1]] = '['
        input_map_copy[box_location[0]][box_location[1] + 1] = ']'
    input_map_copy[robot_coord[0]][robot_coord[1]] = "@"
    print("\n".join(["".join(l) for l in input_map_copy]))

def coords_occupied_by_box(box_index):
    box_coord = box_locations[box_index]
    return {box_coord, (box_coord[0], box_coord[1] + 1)}

def index_of_box_at(coord):
    for i, _ in enumerate(box_locations):
        if coord in coords_occupied_by_box(i):
            return i
    return None


def indices_of_boxes_to_move(push_from_coord, push_offset):
    initial_pushed_box_index = index_of_box_at(coord_offset(push_from_coord, push_offset))
    if initial_pushed_box_index is None:
        if read_map(coord_offset(push_from_coord, push_offset)) == '#':
            return None
        else:
            return set()
    dfs_stack = [initial_pushed_box_index]
    visited = set()
    while len(dfs_stack) > 0:
        curr_box = dfs_stack.pop()
        visited.add(curr_box)
        next_boxes = set()
        curr_box_coords = coords_occupied_by_box(curr_box)
        for coord in curr_box_coords:
            next_coord = coord_offset(coord, push_offset)
            if read_map(next_coord) == '#':
                return None
            next_box = index_of_box_at(next_coord)
            if next_box is not None and next_box != curr_box:
                next_boxes.add(next_box)
        dfs_stack += list(next_boxes)
    return visited



expand_map()
# print_map()

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


    box_indices = indices_of_boxes_to_move(robot_coord, offset)

    ahead_coord = coord_offset(robot_coord, offset)
    if box_indices is not None:
        for box_index in box_indices:
            box_locations[box_index] = coord_offset(box_locations[box_index], offset)
        robot_coord = ahead_coord

sum_of_gps = 0
for (c0, c1) in box_locations:
    sum_of_gps += c0 * 100 + c1

print(sum_of_gps)
