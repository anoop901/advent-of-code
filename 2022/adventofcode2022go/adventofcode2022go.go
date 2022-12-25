package main

import (
	"fmt"
	"os"

	day "github.com/anoop901/adventofcode/2022/adventofcode2022go/day03"
)

const inputFilename = "day03/input.txt"

func main() {
	solution := day.Solution{}

	inputBytes, err := os.ReadFile(inputFilename)
	if err != nil {
		panic(fmt.Errorf("failed to read input file: %v", err))
	}
	input := string(inputBytes)

	err = solution.Init(input)
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
}
