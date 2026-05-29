# 02:08 - 03:51
from jedi.inference.base_value import Value
from collections import deque
from dataclasses import dataclass
from pprint import pprint
import sys
import numpy as np
from tqdm import tqdm
from ortools.sat.python import cp_model

input_txt = sys.stdin.read()
input_lines = input_txt.splitlines()


@dataclass
class Machine:
    indicator_lights: list[bool]
    button_schematics: list[list[int]]
    joltage_requirements: list[int]


def parse_machine(input_line: str) -> Machine:
    words = input_line.split()
    indicator_lights_txt = words[0]
    indicator_lights = [c == "#" for c in indicator_lights_txt[1:-1]]
    button_schematics = [
        [int(s) for s in word[1:-1].split(",")] for word in words[1:-1]
    ]
    joltage_requirements_txt = words[-1]
    joltage_requirements = [int(s) for s in joltage_requirements_txt[1:-1].split(",")]
    return Machine(indicator_lights, button_schematics, joltage_requirements)


machines = [parse_machine(input_line) for input_line in input_lines]


def press_button_indicator_lights(lights: tuple[bool], button_schematic: list[int]):
    next_lights = list(lights)
    for light_idx in button_schematic:
        next_lights[light_idx] ^= True
    return tuple(next_lights)


def format_lights(lights: list[bool]):
    return f"[{''.join('#' if light else '.' for light in lights)}]"


def fewest_button_presses_required_to_configure_indicator_lights(
    machine: Machine,
) -> int:
    initial_lights = tuple([False for _ in machine.indicator_lights])
    deq: deque[tuple] = deque()
    deq.append((initial_lights, 0))
    visited: set[tuple[bool]] = set()
    while len(deq) > 0:
        curr_lights, num_presses = deq.popleft()
        if curr_lights in visited:
            continue
        if curr_lights == tuple(machine.indicator_lights):
            return num_presses
        visited.add(curr_lights)
        for button_schematic in machine.button_schematics:
            deq.append(
                (
                    press_button_indicator_lights(curr_lights, button_schematic),
                    num_presses + 1,
                )
            )
    raise ValueError()


def press_button_joltage_levels(
    joltage_levels: list[int], button_schematic: list[int], num_times=1
):
    next_joltage_levels = joltage_levels.copy()
    for button in button_schematic:
        next_joltage_levels[button] += num_times
    return next_joltage_levels


def joltage_levels_in_range(joltage_levels: list[int], joltage_requirements: list[int]):
    return all(
        0 <= level <= requirement
        for level, requirement in zip(joltage_levels, joltage_requirements)
    )


def fewest_button_presses_required_to_configure_joltage_levels(machine: Machine) -> int:
    initial_joltage_levels = [0 for _ in machine.joltage_requirements]
    initial_state = (tuple(initial_joltage_levels), 0, 0)
    button_schematics = sorted(machine.button_schematics, key=len, reverse=True)
    deq: deque[tuple] = deque()
    deq.append(initial_state)
    visited = set()
    while len(deq) > 0:
        state = deq.popleft()
        # print(state)
        curr_joltage_levels_tup, button_idx, num_presses = state
        curr_joltage_levels = list(curr_joltage_levels_tup)
        if state in visited:
            continue
        if curr_joltage_levels == machine.joltage_requirements:
            return num_presses
        if button_idx == len(button_schematics):
            continue
        visited.add(state)
        button_schematic = button_schematics[button_idx]
        max_presses_for_this_button = max_button_presses_before_exceeding_requirements(
            button_schematic, curr_joltage_levels, machine.joltage_requirements
        )
        for num_presses_for_this_button in reversed(
            range(0, max_presses_for_this_button + 1)
        ):
            deq.append(
                (
                    tuple(
                        press_button_joltage_levels(
                            curr_joltage_levels,
                            button_schematic,
                            num_times=num_presses_for_this_button,
                        )
                    ),
                    button_idx + 1,
                    num_presses + num_presses_for_this_button,
                )
            )
    raise ValueError()


def part1():
    return sum(
        fewest_button_presses_required_to_configure_indicator_lights(machine)
        for machine in (machines)
    )


def max_button_presses_before_exceeding_requirements(
    button_schematic: list[int],
    joltage_levels: list[int],
    joltage_requirements: list[int],
):
    return min(
        joltage_requirements[idx] - joltage_levels[idx] for idx in button_schematic
    )


def part2():
    result = 0
    for machine in machines:
        n = len(machine.button_schematics)
        m = len(machine.joltage_requirements)
        upper_bound = max(machine.joltage_requirements)

        model = cp_model.CpModel()
        vars = [
            model.new_int_var(0, upper_bound, f"x{button_idx}")
            for button_idx in range(n)
        ]

        for joltage_level_idx, joltage_level in enumerate(machine.joltage_requirements):
            expression = sum(
                var
                for button_idx, var in enumerate(vars)
                if joltage_level_idx in machine.button_schematics[button_idx]
            )
            model.add(expression == joltage_level)
        model.minimize(sum(vars))

        solver = cp_model.CpSolver()
        status = solver.solve(model)

        if status == cp_model.OPTIMAL:
            result += sum(solver.value(var) for var in vars)
        else:
            raise ValueError(f"Unexpected solver status {status}")
    return result


print(f"{part1()} {part2()}")
