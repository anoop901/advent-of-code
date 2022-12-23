package main

import (
	"fmt"
	"os"

	day "github.com/anoop901/adventofcode/2022/adventofcode2022go/day01"
)

const inputFilename = "day01/input.txt"

func main() {
	solution := day.Solution{}

	inputBytes, err := os.ReadFile(inputFilename)
	if err != nil {
		panic(err)
	}
	input := string(inputBytes)

	err = solution.Init(input)
	if err != nil {
		panic(err)
	}

	fmt.Printf("part 1 answer: %v\n", solution.Part1())
	fmt.Printf("part 2 answer: %v\n", solution.Part2())
}
