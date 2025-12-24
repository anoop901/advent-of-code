import sys

input = sys.stdin.read()
section_fresh_ranges, section_available = input.split("\n\n")
fresh_ranges = [
    tuple(int(s) for s in line.split("-"))
    for line in section_fresh_ranges.strip().splitlines()
]
available = [int(line) for line in section_available.splitlines()]


def in_range(ing, rg):
    first, last = rg
    return first <= ing <= last


def is_fresh(ing):
    return any(in_range(ing, rg) for rg in fresh_ranges)


def part1():
    return sum(is_fresh(ing) for ing in available)


def find_range(rgs: list[tuple[int, int]], key: int) -> tuple[int, bool]:
    for i, (first, last) in enumerate(rgs):
        if key < first:
            return i, False
        elif key <= last:
            return i, True
    return len(rgs), False


def insert_range(rgs: list[tuple[int, int]], rg: tuple[int, int]):
    if len(rgs) == 0:
        rgs.append(rg)
        return
    first, last = rg
    first_idx, first_inside = find_range(rgs, first)
    last_idx, last_inside = find_range(rgs, last)

    cons_rgs_start = first_idx
    cons_rgs_end = last_idx + (1 if last_inside else 0)

    if cons_rgs_start < cons_rgs_end:
        cons_rg = (rgs[cons_rgs_start][0], rgs[cons_rgs_end - 1][1])
        cons_rg = (min(cons_rg[0], rg[0]), max(cons_rg[1], rg[1]))
    else:
        cons_rg = rg
    rgs[cons_rgs_start:cons_rgs_end] = [cons_rg]


def consolidate_ranges(rgs):
    cons_rgs = []
    for rg in rgs:
        insert_range(cons_rgs, rg)
        print(rg, cons_rgs)
    return cons_rgs


def part2():
    consolidated_ranges = consolidate_ranges(fresh_ranges)
    return sum(last - first + 1 for first, last in consolidated_ranges)


print(part1(), part2())
