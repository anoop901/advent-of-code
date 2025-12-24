import sys

diagram = sys.stdin.read()
diagram = diagram.splitlines()
diagram = [list(line) for line in diagram]

start = diagram[0].index("S")


def part1():
    beams = {start}
    result = 0
    for line in diagram[1:]:
        splitters = {index for index, cell in enumerate(line) if cell == "^"}
        out_beams = []
        for beam in beams:
            if beam in splitters:
                out_beams += [beam - 1, beam + 1]
                result += 1
            else:
                out_beams += [beam]
        beams = set(out_beams)
    return result


def part2():
    path_count = [0] * len(diagram[0])
    path_count[start] = 1
    for line in diagram[1:]:
        next_path_count = [0] * len(line)
        for i, x in enumerate(line):
            if x == "^":
                next_path_count[i - 1] += path_count[i]
                next_path_count[i + 1] += path_count[i]
            else:
                next_path_count[i] += path_count[i]
        path_count = next_path_count
    return sum(path_count)


print(part1(), part2())
