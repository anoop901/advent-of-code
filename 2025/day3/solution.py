import sys


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


def part1(banks: list[list[int]]) -> int:
    return sum(maximum_joltage(bank, num_batteries_to_turn_on=2) for bank in banks)


def part2(banks: list[list[int]]) -> int:
    return sum(maximum_joltage(bank, num_batteries_to_turn_on=12) for bank in banks)


if __name__ == "__main__":
    input_text = sys.stdin.read()
    banks = [[int(digit_str) for digit_str in line] for line in input_text.splitlines()]
    print(part1(banks), part2(banks))
