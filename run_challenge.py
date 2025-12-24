#!/usr/bin/env python3
"""
Unified Advent of Code Challenge Runner

Supports all solution types in the project:
- TypeScript main.ts (2020, 2021): Run directly with ts-node, input via stdin
- TypeScript solution.ts (2021): Import and call solution() function
- Go (2022): Generate inline Go program to run the day
- Python Solution class (2022): Import and instantiate Solution class
- Python direct (2024, 2025): Run directly with python, input via stdin
"""

import argparse
import importlib.util
import os
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Literal, Optional

SolutionType = Literal["ts-main", "ts-solution", "go", "python-class", "python"]

# Project root is the directory containing this script
PROJECT_ROOT = Path(__file__).parent.resolve()


def get_day_folder_name(day: int, zero_padded: bool = True) -> str:
    """Get the folder name for a day (e.g., 'day01' or 'day1')."""
    if not 1 <= day <= 25:
        raise ValueError(f"Day {day} is out of bounds; must be between 1 and 25")
    if zero_padded:
        return f"day{day:02d}"
    return f"day{day}"


def detect_solution_type(year: int, day: int) -> tuple[SolutionType, Path]:
    """
    Auto-detect the solution type based on which files exist.
    Returns (solution_type, challenge_directory).
    """
    day_padded = get_day_folder_name(day, zero_padded=True)
    day_unpadded = get_day_folder_name(day, zero_padded=False)

    # Check TypeScript main.ts (2020, 2021 pattern)
    ts_main_path = PROJECT_ROOT / str(year) / day_padded / "main.ts"
    if ts_main_path.exists():
        return "ts-main", ts_main_path.parent

    # Check TypeScript solution.ts (2021 pattern)
    ts_solution_path = PROJECT_ROOT / str(year) / day_padded / "solution.ts"
    if ts_solution_path.exists():
        return "ts-solution", ts_solution_path.parent

    # Check Python direct (2024, 2025 pattern - try both padded and unpadded)
    for day_name in [day_padded, day_unpadded]:
        py_direct_path = PROJECT_ROOT / str(year) / day_name / "solution.py"
        if py_direct_path.exists():
            return "python", py_direct_path.parent

    # Check Go (2022 pattern - dayXX.go in dayXX folder)
    go_path = PROJECT_ROOT / str(year) / day_padded / f"{day_padded}.go"
    if go_path.exists():
        return "go", go_path.parent

    # Check Python Solution class (2022 pattern - solution.py with Solution class)
    # This is checked after python direct, so we need to distinguish by looking for Solution class
    # For now, we'll check if there's a solution.py that we haven't already matched
    # The python direct check above will have already matched if it exists

    raise FileNotFoundError(
        f"No solution found for year {year}, day {day}. "
        f"Searched for main.ts, solution.ts, solution.py, dayXX.go in various locations."
    )


def get_input_path(challenge_dir: Path, custom_input: Optional[str]) -> Path:
    """Get the path to the input file."""
    if custom_input:
        return Path(custom_input).resolve()
    return challenge_dir / "input.txt"


def run_ts_main(challenge_dir: Path, input_path: Path) -> None:
    """Run TypeScript main.ts solutions (spawn ts-node, pipe input to stdin)."""
    main_ts = challenge_dir / "main.ts"
    with open(input_path, "r") as input_file:
        result = subprocess.run(
            ["npx", "ts-node", str(main_ts)],
            stdin=input_file,
            cwd=PROJECT_ROOT,
        )
    sys.exit(result.returncode)


def run_ts_solution(challenge_dir: Path, input_path: Path) -> None:
    """Run TypeScript solution.ts solutions (import and call solution function)."""
    relative_path = challenge_dir.relative_to(PROJECT_ROOT)
    with open(input_path, "r") as f:
        input_content = f.read()

    # Escape the input for embedding in JS
    escaped_input = (
        input_content.replace("\\", "\\\\").replace("`", "\\`").replace("$", "\\$")
    )

    ts_code = f"""
import {{ solution }} from './{relative_path}/solution';
const input = `{escaped_input}`;
const {{ part1Answer, part2Answer }} = solution(input);
console.log('part 1 answer:', part1Answer);
console.log('part 2 answer:', part2Answer);
"""
    result = subprocess.run(
        ["npx", "ts-node", "-e", ts_code],
        cwd=PROJECT_ROOT,
    )
    sys.exit(result.returncode)


def run_go(year: int, day: int, input_path: Path) -> None:
    """Run Go solutions by generating an inline Go program."""
    day_padded = get_day_folder_name(day, zero_padded=True)
    go_module_dir = PROJECT_ROOT / str(year)

    go_code = f"""package main

import (
    "fmt"
    "os"

    day "github.com/anoop901/adventofcode/{year}/{day_padded}"
)

func main() {{
    solution := day.Solution{{}}

    f, err := os.Open("{input_path}")
    if err != nil {{
        panic(fmt.Errorf("failed to open input file: %v", err))
    }}
    defer f.Close()

    err = solution.Init(f)
    if err != nil {{
        panic(fmt.Errorf("failed to initialize solution: %v", err))
    }}

    part1, err := solution.Part1()
    if err != nil {{
        panic(fmt.Errorf("failed to run part 1: %v", err))
    }}

    part2, err := solution.Part2()
    if err != nil {{
        panic(fmt.Errorf("failed to run part 2: %v", err))
    }}

    fmt.Printf("part 1 answer: %v\\n", part1)
    fmt.Printf("part 2 answer: %v\\n", part2)
}}
"""

    # Write to a temporary file and run it
    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".go", dir=go_module_dir, delete=False
    ) as tmp:
        tmp.write(go_code)
        tmp_path = tmp.name

    try:
        result = subprocess.run(["go", "run", tmp_path], cwd=go_module_dir)
        sys.exit(result.returncode)
    finally:
        os.unlink(tmp_path)


def run_python_class(challenge_dir: Path, input_path: Path) -> None:
    """Run Python solutions with Solution class (instantiate, call part1/part2)."""
    solution_py = challenge_dir / "solution.py"

    # Dynamically import the solution module
    spec = importlib.util.spec_from_file_location("solution", solution_py)
    if spec is None or spec.loader is None:
        raise ImportError(f"Could not load module from {solution_py}")

    module = importlib.util.module_from_spec(spec)
    sys.modules["solution"] = module
    spec.loader.exec_module(module)

    with open(input_path, "r") as f:
        input_content = f.read()

    solution = module.Solution(input_content)
    part1 = solution.part1()
    part2 = solution.part2()

    print(f"part 1 answer: {part1}")
    print(f"part 2 answer: {part2}")


def run_python_direct(challenge_dir: Path, input_path: Path) -> None:
    """Run Python solutions directly (spawn python, pipe input to stdin)."""
    solution_py = challenge_dir / "solution.py"
    with open(input_path, "r") as input_file:
        result = subprocess.run(
            [sys.executable, str(solution_py)],
            stdin=input_file,
            cwd=challenge_dir,
        )
    sys.exit(result.returncode)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Run Advent of Code solutions",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python run_challenge.py -y 2020 -d 1              # TypeScript main.ts
  python run_challenge.py -y 2021 -d 3              # TypeScript solution.ts
  python run_challenge.py -y 2022 -d 1 --lang go    # Go solution
  python run_challenge.py -y 2022 -d 7              # Python Solution class (default)
  python run_challenge.py -y 2024 -d 16             # Python direct
  python run_challenge.py -y 2025 -d 1 -i custom.txt
        """,
    )
    parser.add_argument(
        "-y", "--year", type=int, required=True, help="Advent of Code year"
    )
    parser.add_argument(
        "-d", "--day", type=int, required=True, help="Day number (1-25)"
    )
    parser.add_argument(
        "-i", "--input", type=str, help="Custom input file path (optional)"
    )
    parser.add_argument(
        "-l",
        "--lang",
        type=str,
        choices=["ts-main", "ts-solution", "go", "python-class", "python"],
        help="Force solution type (auto-detected if omitted)",
    )

    args = parser.parse_args()

    try:
        if args.lang:
            # User specified language, determine the challenge directory
            solution_type: SolutionType = args.lang
            day_padded = get_day_folder_name(args.day, zero_padded=True)
            day_unpadded = get_day_folder_name(args.day, zero_padded=False)

            if solution_type in ("ts-main", "ts-solution"):
                challenge_dir = PROJECT_ROOT / str(args.year) / day_padded
            elif solution_type == "go":
                challenge_dir = PROJECT_ROOT / str(args.year) / day_padded
            elif solution_type == "python-class":
                challenge_dir = PROJECT_ROOT / str(args.year) / day_padded
            else:  # python direct
                # Try both padded and unpadded
                challenge_dir = PROJECT_ROOT / str(args.year) / day_padded
                if not (challenge_dir / "solution.py").exists():
                    challenge_dir = PROJECT_ROOT / str(args.year) / day_unpadded
        else:
            solution_type, challenge_dir = detect_solution_type(args.year, args.day)

        input_path = get_input_path(challenge_dir, args.input)

        if not input_path.exists():
            print(f"Error: Input file not found: {input_path}", file=sys.stderr)
            sys.exit(1)

        print(f"Running {args.year} day {args.day} ({solution_type})", file=sys.stderr)
        print(f"Input: {input_path}", file=sys.stderr)
        print("-" * 40, file=sys.stderr)

        if solution_type == "ts-main":
            run_ts_main(challenge_dir, input_path)
        elif solution_type == "ts-solution":
            run_ts_solution(challenge_dir, input_path)
        elif solution_type == "go":
            run_go(args.year, args.day, input_path)
        elif solution_type == "python-class":
            run_python_class(challenge_dir, input_path)
        elif solution_type == "python":
            run_python_direct(challenge_dir, input_path)

    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
