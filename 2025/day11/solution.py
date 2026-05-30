import sys
from collections import defaultdict

import matplotlib.pyplot as plt
import networkx as nx


def parse_connection(line: str):
    a, bs_str = tuple(line.strip().split(": "))
    bs = bs_str.split(" ")
    return (a, bs)


connections = dict([parse_connection(line) for line in sys.stdin.readlines()])
all_nodes = set()
for a, bs in connections.items():
    all_nodes.add(a)
    for b in bs:
        all_nodes.add(b)


def topo_sort():
    result = []
    visited = set()
    while True:
        candidates = {
            node
            for node in all_nodes
            if node not in visited
            and all(next_node in visited for next_node in connections.get(node, []))
        }
        if not candidates:
            break
        current = candidates.pop()
        visited.add(current)
        print(current)
        result.append(current)
    return reversed(result)


all_nodes_topo_sorted = list(topo_sort())


def count_paths(source: str, target: str):
    num_paths = defaultdict(int)
    num_paths[source] = 1

    for current in all_nodes_topo_sorted:
        for next_node in connections.get(current, []):
            num_paths[next_node] += num_paths[current]
    return num_paths[target]


def part1():
    return count_paths("you", "out")


def part2():
    if count_paths("fft", "dac"):
        return (
            count_paths("svr", "fft")
            * count_paths("fft", "dac")
            * count_paths("dac", "out")
        )
    else:
        return (
            count_paths("svr", "dac")
            * count_paths("dac", "fft")
            * count_paths("fft", "out")
        )


print(f"{part1()} {part2()}")
