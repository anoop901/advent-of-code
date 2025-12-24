from collections import Counter
import sys
from pprint import pprint
import numpy as np

input = sys.stdin.read()
input_lines = input.splitlines()
boxes = [tuple([int(x) for x in line.split(",")]) for line in input_lines]
num_connections = 1000 if len(boxes) > 20 else 10
num_top_circuits_to_multiply = 3


distances = []
for i1, box1 in enumerate(boxes):
    for box2 in boxes[i1 + 1 :]:
        x1, y1, z1 = box1
        x2, y2, z2 = box2
        distance_sq = (x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2
        distances.append((box1, box2, distance_sq))
distances.sort(key=lambda x: x[2])


def part1():
    boxes_to_connect = [(box1, box2) for (box1, box2, _) in distances[:num_connections]]
    box_to_circuit = {box: i for i, box in enumerate(boxes)}
    for box1, box2 in boxes_to_connect:
        circuit1 = box_to_circuit[box1]
        circuit2 = box_to_circuit[box2]
        if circuit1 != circuit2:
            boxes_in_circuit2 = [
                box for box in boxes if box_to_circuit[box] == circuit2
            ]
            for box_in_circuit2 in boxes_in_circuit2:
                box_to_circuit[box_in_circuit2] = circuit1

    circuit_box_counter = Counter(circuit for box, circuit in box_to_circuit.items())
    return np.prod(
        sorted(circuit_box_counter.values(), reverse=True)[
            :num_top_circuits_to_multiply
        ]
    )


def part2():
    boxes_to_connect = [(box1, box2) for (box1, box2, _) in distances]
    box_to_circuit = {box: i for i, box in enumerate(boxes)}
    for box1, box2 in boxes_to_connect:
        circuit1 = box_to_circuit[box1]
        circuit2 = box_to_circuit[box2]
        if circuit1 != circuit2:
            boxes_in_circuit2 = [
                box for box in boxes if box_to_circuit[box] == circuit2
            ]
            for box_in_circuit2 in boxes_in_circuit2:
                box_to_circuit[box_in_circuit2] = circuit1
            circuit_box_counter = Counter(
                circuit for box, circuit in box_to_circuit.items()
            )
            if len(circuit_box_counter) == 1:
                return box1[0] * box2[0]
    raise ValueError()


print(part1(), part2())
