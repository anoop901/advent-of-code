package main

import (
	"fmt"
	"io"
	"os"
	"sort"
	"strconv"
	"strings"
)

type Solution struct {
	calories      [][]int
	calorieTotals []int
}

func (s *Solution) Init(inputReader io.Reader) error {
	inputBuf := new(strings.Builder)
	_, err := io.Copy(inputBuf, inputReader)
	if err != nil {
		return fmt.Errorf("failed to read input")
	}
	input := inputBuf.String()
	inputSections := strings.Split(strings.Trim(input, "\n"), "\n\n")
	calories := make([][]int, len(inputSections))
	for sectionIndex, inputSection := range inputSections {
		lines := strings.Split(inputSection, "\n")
		calories[sectionIndex] = make([]int, len(lines))
		for lineIndex, line := range lines {
			var err error
			calories[sectionIndex][lineIndex], err = strconv.Atoi(line)
			if err != nil {
				return err
			}
		}
	}
	s.calories = calories

	calorieTotals := make([]int, len(s.calories))
	for i, elfCalories := range s.calories {
		calorieTotals[i] = sum(elfCalories)
	}
	s.calorieTotals = calorieTotals

	return nil
}

func (s *Solution) Part1() (int, error) {
	result, err := max(s.calorieTotals)
	if err != nil {
		return 0, err
	}
	return result, nil
}

func (s *Solution) Part2() (int, error) {
	sortedCalorieTotals := make([]int, len(s.calorieTotals))
	copy(sortedCalorieTotals, s.calorieTotals)
	sort.Slice(sortedCalorieTotals, func(i, j int) bool { return sortedCalorieTotals[i] > sortedCalorieTotals[j] })
	return sum(sortedCalorieTotals[:3]), nil
}

type maxError struct{}

func (e maxError) Error() string {
	return "cannot take the minimum of an empty list"
}

func max(slice []int) (int, error) {
	if len(slice) == 0 {
		return 0, maxError{}
	}
	result := slice[0]
	for _, value := range slice {
		if value > result {
			result = value
		}
	}
	return result, nil
}

func sum(slice []int) int {
	result := 0
	for _, value := range slice {
		result += value
	}
	return result
}

func main() {
	solution := Solution{}
	err := solution.Init(os.Stdin)
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
	fmt.Printf("%v %v\n", part1, part2)
}
