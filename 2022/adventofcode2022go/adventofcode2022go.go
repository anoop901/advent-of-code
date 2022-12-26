package main

import (
	"fmt"
	"os"

	day "github.com/anoop901/adventofcode/2022/adventofcode2022go/day05"
)

const inputFilename = "day05/input.txt"

func main() {
	solution := day.Solution{}

	f, err := os.Open(inputFilename)
	if err != nil {
		panic(fmt.Errorf("failed to open input file: %v", err))
	}

	err = solution.Init(f)
	if err != nil {
		panic(fmt.Errorf("failed to initialize solution: %v", err))
	}

	part1, err := solution.Part1()
	if err != nil {
		panic(fmt.Errorf("failed to run part 1: %v", err))
	}

	part2, err := solution.Part2()
	if err != nil {
		panic(fmt.Errorf("failed to run part 2: %v", err))
	}

	fmt.Printf("part 1 answer: %v\n", part1)
	fmt.Printf("part 2 answer: %v\n", part2)

	err = f.Close()
	if err != nil {
		panic(fmt.Errorf("failed to close input file: %v", err))
	}
}
