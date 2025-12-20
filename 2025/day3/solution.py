from pathlib import Path

input = (Path(__file__).parent / "input.txt").read_text()
banks = [[int(digit_str) for digit_str in line] for line in input.splitlines()]


# def maximum_joltage_part1(bank) -> int:
#     battery1_index, battery1_value = max(enumerate(bank[:-1]), key=lambda ix: ix[1])
#     battery2_value = max(bank[battery1_index + 1 :])
#     return battery1_value * 10 + battery2_value


def maximum_joltage(bank: list[int], num_batteries_to_turn_on: int) -> int:
    last_battery_idx = -1
    result = 0
    for i in range(num_batteries_to_turn_on):
        batteries_left = num_batteries_to_turn_on - i
        leftmost_candidate_idx = last_battery_idx + 1
        rightmost_candidate_idx = len(bank) - batteries_left
        curr_battery_idx, curr_battery_value = max(
            list(enumerate(bank))[leftmost_candidate_idx : rightmost_candidate_idx + 1],
            key=lambda ix: ix[1],
        )
        result = result * 10 + curr_battery_value
        last_battery_idx = curr_battery_idx
    return result


def part1() -> int:
    return sum(maximum_joltage(bank, num_batteries_to_turn_on=2) for bank in banks)


def part2() -> int:
    return sum(maximum_joltage(bank, num_batteries_to_turn_on=12) for bank in banks)


print(part1(), part2())
