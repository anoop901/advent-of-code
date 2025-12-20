from enum import Enum

instructions = open("example.txt").readlines()
position = 50
password = 0
password2 = 0


class Direction(Enum):
    LEFT = "L"
    RIGHT = "R"

for instruction in instructions:
    instruction = instruction.strip()
    direction = Direction(instruction[:1])
    amount = int(instruction[1:])

    # update password2
    if position == 0:
        password2 += amount // 100
    else:
        rotation_to_next_zero = (
            position if direction == Direction.LEFT else 100 - position
        )
        if amount >= rotation_to_next_zero:
            password2 += (amount - rotation_to_next_zero) // 100 + 1

    # update position
    match direction:
        case Direction.LEFT:
            position -= amount
        case Direction.RIGHT:
            position += amount
        case _:
            raise ValueError()
    position %= 100

    # update password
    if position == 0:
        password += 1

print(password, password2)
