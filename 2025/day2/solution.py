from collections.abc import Iterator
from pathlib import Path


def parseRange(rangeStr: str) -> tuple[int, int]:
    startStr, endStr = rangeStr.split("-")
    return (int(startStr), int(endStr))


input = open(Path(__file__).parent / "input.txt").read()
idRanges = [parseRange(r) for r in input.strip().split(",")]


def digitCountsInRange(rang: tuple[int, int]) -> list[int]:
    start, end = rang
    return [c for c in range(len(str(start)), len(str(end)) + 1)]


def limitRangeToNDigitInts(rang: tuple[int, int], n: int) -> tuple[int, int]:
    start, end = rang
    lowestNDigitInt = int("1" + "0" * (n - 1))
    highestNDigitInt = int("9" * n)
    if start < lowestNDigitInt:
        start = lowestNDigitInt
    if end > highestNDigitInt:
        end = highestNDigitInt
    if start > end:
        return (0, 0)
    return (start, end)


def invalidIdsInRangeWithNDigitsKRep(
    rang: tuple[int, int], n: int, k: int
) -> Iterator[int]:
    if n % k != 0:
        return
    numRepetitions = n // k
    rang = limitRangeToNDigitInts(rang, n)
    start, end = rang
    assert len(str(start)) == n
    assert len(str(end)) == n
    startHalfDigits = int(str(start)[:k])
    while repeatDigits(startHalfDigits, numRepetitions) < start:
        startHalfDigits += 1
    while repeatDigits(startHalfDigits, numRepetitions) <= end:
        yield repeatDigits(startHalfDigits, numRepetitions)
        startHalfDigits += 1


def repeatDigits(n: int, numRepititions: int) -> int:
    return int(str(n) * numRepititions)


def invalidIdsInRange(rang: tuple[int, int]) -> Iterator[int]:
    for digitCount in digitCountsInRange(rang):
        if digitCount % 2 == 0:
            yield from invalidIdsInRangeWithNDigitsKRep(
                rang, digitCount, digitCount // 2
            )


def invalidIdsInRange2(rang: tuple[int, int]) -> Iterator[int]:
    for digitCount in digitCountsInRange(rang):
        for k in range(1, digitCount):
            if digitCount % k == 0:
                yield from invalidIdsInRangeWithNDigitsKRep(rang, digitCount, k)


def part1() -> int:
    result = 0
    for rang in idRanges:
        ids = set(invalidIdsInRange(rang))
        result += sum(ids)
    return result


def part2() -> int:
    result = 0
    for rang in idRanges:
        ids = set(invalidIdsInRange2(rang))
        result += sum(ids)
    return result


print(part1(), part2())
