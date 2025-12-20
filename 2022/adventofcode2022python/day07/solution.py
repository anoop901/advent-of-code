from dataclasses import dataclass
from pprint import pprint
import re
from typing import Optional, Union


INPUT_FILENAME = 'input.txt'

MAX_DIRECTORY_SIZE = 100000
TOTAL_AVAILABLE_SPACE = 70000000
UNUSED_SPACE_NEEDED = 30000000


@dataclass
class UnparsedCommand:
    command_line: str
    output: list[str]


class DirectoryContent:
    pass


@dataclass
class File(DirectoryContent):
    name: str
    size: int


@dataclass
class Directory(DirectoryContent):
    name: str
    contents: list[DirectoryContent]


class Command:
    pass


@dataclass
class CdCommand(Command):
    subdirectory_name: str


@dataclass
class CdRootCommand(Command):
    pass


@dataclass
class CdUpCommand(Command):
    pass


@dataclass
class LsCommand(Command):
    contents: list[DirectoryContent]


def terminal_output_to_unparsed_commands(terminal_output: str) -> list[UnparsedCommand]:
    lines = input.splitlines()
    result = []
    current_command: Optional[UnparsedCommand] = None

    for line in lines:
        m = re.fullmatch(r'\$\s*(.*)', line)
        if m:
            current_command = UnparsedCommand(
                command_line=m.group(1), output=[])
            result.append(current_command)
        else:
            if current_command is not None:
                current_command.output.append(line)
            else:
                raise ValueError('unexpected output before first command')
    return result


def parse_command(unparsed_command: UnparsedCommand) -> Command:
    command_line = unparsed_command.command_line
    if command_line == 'cd ..':
        return CdUpCommand()
    if command_line == 'cd /':
        return CdRootCommand()
    m = re.fullmatch(r'cd\s+(.*)', command_line)
    if m is not None:
        return CdCommand(subdirectory_name=m.group(1))
    if command_line == 'ls':
        contents = []
        for output_line in unparsed_command.output:
            m = re.fullmatch(r'(\d+)\s+(\S+)', output_line)
            if m is not None:
                contents.append(File(name=m.group(2), size=int(m.group(1))))
                continue
            m = re.fullmatch(r'dir\s+(\S+)', output_line)
            if m is not None:
                contents.append(Directory(name=m.group(1), contents=[]))
                continue
            raise ValueError(f'unexpected ls output line {output_line!r}')
        return LsCommand(contents=contents)
    raise ValueError(f'unexpected command {command_line!r}')


def reconstruct_root_directory(commands: list[Command]) -> Directory:
    root = Directory(name='/', contents=[])
    current = root
    directory_stack = []
    for command in commands:
        if isinstance(command, CdCommand):
            subdirectory, = tuple([content
                                   for content in current.contents
                                   if isinstance(content, Directory)
                                   if content.name == command.subdirectory_name])
            directory_stack.append(current)
            current = subdirectory
        if isinstance(command, CdUpCommand):
            current = directory_stack.pop()
        if isinstance(command, CdRootCommand):
            current = root
            directory_stack = []
        if isinstance(command, LsCommand):
            current.contents = command.contents
    return root


def directory_content_total_size(directory_content: DirectoryContent) -> int:
    if isinstance(directory_content, Directory):
        return directory_total_size(directory_content)
    elif isinstance(directory_content, File):
        return directory_content.size
    else:
        raise ValueError


def directory_total_size(directory: Directory) -> int:
    return sum(directory_content_total_size(directory_content)
               for directory_content in directory.contents)


def all_directories(root_directory: Directory):
    yield root_directory
    for content in root_directory.contents:
        if isinstance(content, Directory):
            yield from all_directories(content)


class Solution:
    root_directory: Directory

    def __init__(self, input: str):
        unparsed_commands = terminal_output_to_unparsed_commands(input)
        commands = [parse_command(command) for command in unparsed_commands]
        self.root_directory = reconstruct_root_directory(commands)

    def part1(self) -> int:
        return sum(size
                   for size in (directory_total_size(directory)
                                for directory in all_directories(self.root_directory))
                   if size <= MAX_DIRECTORY_SIZE)

    def part2(self) -> int:
        total_used_space = directory_total_size(self.root_directory)
        return min((size
                    for size in (directory_total_size(directory)
                                 for directory in all_directories(self.root_directory))
                    if total_used_space - size + UNUSED_SPACE_NEEDED <= TOTAL_AVAILABLE_SPACE))


if __name__ == '__main__':
    with open(INPUT_FILENAME) as input_file:
        input = input_file.read()
        solution = Solution(input)
        print(f'part 1: {solution.part1()}')
        print(f'part 2: {solution.part2()}')
