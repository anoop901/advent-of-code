from collections.abc import Iterator
from pathlib import Path


def parseRange(rangeStr: str) -> tuple[int, int]:
    """Parse a range string into a tuple of integers.

    Args:
        rangeStr: A string in the format "start-end".

    Returns:
        A tuple containing (start, end) as integers.

    Example:
        >>> parseRange("100-999")
        (100, 999)
    """
    startStr, endStr = rangeStr.split("-")
    return (int(startStr), int(endStr))


input = open(Path(__file__).parent / "input.txt").read()
idRanges = [parseRange(r) for r in input.strip().split(",")]


def digitCountsInRange(rang: tuple[int, int]) -> list[int]:
    """Get all possible digit counts for numbers in the given range.

    Args:
        rang: A tuple (start, end) defining the inclusive range.

    Returns:
        A list of possible digit counts for numbers in the range.

    Example:
        >>> digitCountsInRange((50, 1500))
        [2, 3, 4]  # 50 has 2 digits, 1500 has 4 digits
    """
    start, end = rang
    return [c for c in range(len(str(start)), len(str(end)) + 1)]


def limitRangeToNDigitInts(rang: tuple[int, int], n: int) -> tuple[int, int]:
    """Limit a range to only include n-digit integers.

    Args:
        rang: A tuple (start, end) defining the original inclusive range.
        n: The number of digits to limit the range to.

    Returns:
        A tuple (start, end) adjusted to only include n-digit integers.
        Returns (0, 0) if there are no n-digit integers in the range.

    Examples:
        >>> limitRangeToNDigitInts((50, 1500), 3)
        (100, 999)  # Clamps to 3-digit range
        >>> limitRangeToNDigitInts((500, 600), 4)
        (0, 0)  # No 4-digit numbers in range
    """
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
    """Generate invalid IDs in a range with n digits formed by repeating k digits.

    Yields IDs where the first k digits are repeated to form an n-digit number.

    Args:
        rang: A tuple (start, end) defining the inclusive range.
        n: The total number of digits for the IDs.
        k: The number of digits to repeat to form the ID.

    Yields:
        Invalid IDs that are n-digit numbers formed by repeating k digits.

    Example:
        >>> list(invalidIdsInRangeWithNDigitsKRep((1200, 1500), 4, 2))
        [1212, 1313, 1414]  # 4-digit IDs where 2 digits repeat (12->1212, etc.)
    """
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
    """Create a number by repeating the digits of n.

    Args:
        n: The number whose digits will be repeated.
        numRepititions: The number of times to repeat the digits.

    Returns:
        An integer formed by concatenating n's digits numRepititions times.

    Examples:
        >>> repeatDigits(12, 2)
        1212
        >>> repeatDigits(5, 3)
        555
    """
    return int(str(n) * numRepititions)


def invalidIdsInRange(rang: tuple[int, int]) -> Iterator[int]:
    """Generate all invalid IDs in a range (part 1 logic).

    Finds IDs formed by repeating half of their digits (for even digit counts).

    Args:
        rang: A tuple (start, end) defining the inclusive range.

    Yields:
        Invalid IDs where the first half of digits repeats to form the full ID.

    Example:
        >>> list(invalidIdsInRange((1200, 1500)))
        [1212, 1313, 1414]  # 4-digit IDs where first 2 digits repeat
    """
    for digitCount in digitCountsInRange(rang):
        if digitCount % 2 == 0:
            yield from invalidIdsInRangeWithNDigitsKRep(
                rang, digitCount, digitCount // 2
            )


def invalidIdsInRange2(rang: tuple[int, int]) -> Iterator[int]:
    """Generate all invalid IDs in a range (part 2 logic).

    Finds IDs formed by repeating any divisible group of digits.

    Args:
        rang: A tuple (start, end) defining the inclusive range.

    Yields:
        Invalid IDs where k digits repeat to form the full n-digit ID
        for any valid k that divides n.
    """
    for digitCount in digitCountsInRange(rang):
        for k in range(1, digitCount):
            if digitCount % k == 0:
                yield from invalidIdsInRangeWithNDigitsKRep(rang, digitCount, k)


def part1() -> int:
    """Solve part 1 of the puzzle.

    Calculates the sum of all invalid IDs across all input ranges,
    where invalid IDs are those formed by repeating half of their digits.

    Returns:
        The sum of all unique invalid IDs.
    """
    result = 0
    for rang in idRanges:
        ids = set(invalidIdsInRange(rang))
        result += sum(ids)
    return result


def part2() -> int:
    """Solve part 2 of the puzzle.

    Calculates the sum of all invalid IDs across all input ranges,
    where invalid IDs are those formed by repeating any divisible group of digits.

    Returns:
        The sum of all unique invalid IDs.
    """
    result = 0
    for rang in idRanges:
        ids = set(invalidIdsInRange2(rang))
        result += sum(ids)
    return result


print(part1(), part2())
