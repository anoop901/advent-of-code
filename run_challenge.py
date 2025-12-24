#!/usr/bin/env python3
"""
Unified Advent of Code Challenge Runner

Supports all solution types in the project:
- TypeScript main.ts (2020, 2021): Run directly with ts-node, input via stdin
- Go (2022): Generate inline Go program to run the day
- Python (2022, 2024, 2025): Run directly with python, input via stdin
"""

import argparse
import importlib.util
import os
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Literal, Optional

SolutionType = Literal["typescript", "go", "python"]

# Project root is the directory containing this script
PROJECT_ROOT = Path(__file__).parent.resolve()


def get_day_folder_name(day: int) -> str:
    """Get the folder name for a day (e.g., 'day01' or 'day1')."""
    if not 1 <= day <= 25:
        raise ValueError(f"Day {day} is out of bounds; must be between 1 and 25")
    return f"day{day:02d}"


def detect_solution_type(year: int, day: int) -> tuple[SolutionType, Path]:
    """
    Auto-detect the solution type based on which files exist.
    Returns (solution_type, challenge_directory).
    """
    day_folder_name = get_day_folder_name(day)
    challenge_dir = PROJECT_ROOT / str(year) / get_day_folder_name(day)

    # Check TypeScript (2020, 2021 pattern)
    ts_main_path = challenge_dir / "main.ts"
    if ts_main_path.exists():
        return "typescript", ts_main_path.parent

    # Check Python (2024, 2025 pattern)
    py_direct_path = challenge_dir / "solution.py"
    if py_direct_path.exists():
        return "python", py_direct_path.parent

    # Check Go (2022 pattern - dayXX.go in dayXX folder)
    go_path = challenge_dir / f"{day_folder_name}.go"
    if go_path.exists():
        return "go", go_path.parent

    raise FileNotFoundError(
        f"No solution found for year {year}, day {day}. "
        f"Searched for main.ts, solution.ts, solution.py, day{day_folder_name}.go in {challenge_dir}."
    )


def get_input_path(challenge_dir: Path, custom_input: Optional[str]) -> Path:
    """Get the path to the input file."""
    if custom_input:
        return Path(custom_input).resolve()
    return challenge_dir / "input.txt"


def run_typescript(challenge_dir: Path, input_path: Path) -> None:
    """Run TypeScript main.ts solutions (spawn ts-node, pipe input to stdin)."""
    main_ts = challenge_dir / "main.ts"
    with open(input_path, "r") as input_file:
        result = subprocess.run(
            ["npx", "ts-node", str(main_ts)],
            stdin=input_file,
            cwd=PROJECT_ROOT,
        )
    sys.exit(result.returncode)


def run_go(year: int, day: int, input_path: Path) -> None:
    """Run Go solutions by generating an inline Go program."""
    day_folder_name = get_day_folder_name(day)
    go_module_dir = PROJECT_ROOT / str(year)

    go_code = f"""package main

import (
    "fmt"
    "os"

    day "github.com/anoop901/adventofcode/{year}/{day_folder_name}"
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


def run_python(challenge_dir: Path, input_path: Path) -> None:
    """Run Python solutions directly (spawn python, pipe input to stdin)."""
    solution_py = challenge_dir / "solution.py"
    with open(input_path, "r") as input_file:
        result = subprocess.run(
            [sys.executable, str(solution_py)],
            stdin=input_file,
            cwd=challenge_dir,
        )
    sys.exit(result.returncode)


def list_solutions() -> list[tuple[int, int, SolutionType, Path]]:
    """
    Discover all available solutions in the project.
    Returns a list of (year, day, solution_type, challenge_dir) tuples.
    """
    solutions: list[tuple[int, int, SolutionType, Path]] = []

    # Find all year directories (4-digit numbers)
    for year_dir in sorted(PROJECT_ROOT.iterdir()):
        if not year_dir.is_dir():
            continue
        try:
            year = int(year_dir.name)
            if not (2000 <= year <= 2099):
                continue
        except ValueError:
            continue

        # Find all day directories within this year
        for day_dir in sorted(year_dir.iterdir()):
            if not day_dir.is_dir():
                continue

            # Try to extract day number from folder name (day01, day1, etc.)
            day_name = day_dir.name
            if not day_name.startswith("day"):
                continue
            try:
                day = int(day_name[3:])
                if not (1 <= day <= 25):
                    continue
            except ValueError:
                continue

            # Try to detect solution type for this year/day
            try:
                solution_type, challenge_dir = detect_solution_type(year, day)
                solutions.append((year, day, solution_type, challenge_dir))
            except FileNotFoundError:
                # No valid solution found for this day
                continue

    return solutions


def print_solutions_list() -> None:
    """Print all available solutions in a formatted table."""
    solutions = list_solutions()

    if not solutions:
        print("No solutions found.")
        return

    # Group by year for nicer output
    current_year = None
    for year, day, solution_type, challenge_dir in solutions:
        if year != current_year:
            if current_year is not None:
                print()  # Blank line between years
            print(f"=== {year} ===")
            current_year = year

        relative_path = challenge_dir.relative_to(PROJECT_ROOT)
        print(f"Day {day:2d}: {solution_type:<12} ({relative_path})")


def run_solution(args: argparse.Namespace) -> None:
    """Handle the 'run' subcommand."""
    try:
        if args.lang:
            # User specified language, determine the challenge directory
            solution_type: SolutionType = args.lang
            day_folder_name = get_day_folder_name(args.day)
            challenge_dir = PROJECT_ROOT / str(args.year) / day_folder_name
        else:
            solution_type, challenge_dir = detect_solution_type(args.year, args.day)

        input_path = get_input_path(challenge_dir, args.input)

        if not input_path.exists():
            print(f"Error: Input file not found: {input_path}", file=sys.stderr)
            sys.exit(1)

        print(f"Running {args.year} day {args.day} ({solution_type})", file=sys.stderr)
        print(f"Input: {input_path}", file=sys.stderr)
        print("-" * 40, file=sys.stderr)

        if solution_type == "typescript":
            run_typescript(challenge_dir, input_path)
        elif solution_type == "go":
            run_go(args.year, args.day, input_path)
        elif solution_type == "python":
            run_python(challenge_dir, input_path)

    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Run Advent of Code solutions",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""\
Examples:
  python run_challenge.py run -y 2020 -d 1              # TypeScript
  python run_challenge.py run -y 2022 -d 1 --lang go    # Go
  python run_challenge.py run -y 2024 -d 16             # Python
  python run_challenge.py run -y 2025 -d 1 -i custom.txt
  python run_challenge.py list                          # List all solutions
        """,
    )

    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # 'run' subcommand
    run_parser = subparsers.add_parser("run", help="Run a specific solution")
    run_parser.add_argument(
        "-y", "--year", type=int, required=True, help="Advent of Code year"
    )
    run_parser.add_argument(
        "-d", "--day", type=int, required=True, help="Day number (1-25)"
    )
    run_parser.add_argument(
        "-i", "--input", type=str, help="Custom input file path (optional)"
    )
    run_parser.add_argument(
        "-l",
        "--lang",
        type=str,
        choices=["typescript", "go", "python"],
        help="Force solution type (auto-detected if omitted)",
    )

    # 'list' subcommand
    subparsers.add_parser("list", help="List all available solutions")

    args = parser.parse_args()

    if args.command == "list":
        print_solutions_list()
    elif args.command == "run":
        run_solution(args)
    else:
        # No subcommand given, show help
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
