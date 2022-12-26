package day05

import (
	"bufio"
	"fmt"
	"io"
	"regexp"
	"sort"
	"strconv"
)

type Solution struct {
	stacks       map[rune][]rune
	instructions []instruction
}

type instruction struct {
	numCrates        int
	sourceStack      rune
	destinationStack rune
}

func parseStacks(stacksLines []string) (map[rune][]rune, error) {
	if len(stacksLines) == 0 {
		return nil, fmt.Errorf("stacks lines are empty")
	}
	cratesLines := stacksLines[0 : len(stacksLines)-1]
	namesLine := stacksLines[len(stacksLines)-1]
	numStacks := (len([]rune(namesLine)) + 2) / 4
	maxStackHeight := len(cratesLines)
	result := make(map[rune][]rune)
	for stackIndex := 0; stackIndex < numStacks; stackIndex++ {
		runeIndex := stackIndex*4 + 1
		stackName := []rune(namesLine)[runeIndex]
		for lineIndex := maxStackHeight - 1; lineIndex >= 0; lineIndex-- {
			cratesLineRunes := []rune(cratesLines[lineIndex])
			if runeIndex >= len(cratesLineRunes) {
				break
			}
			if cratesLineRunes[runeIndex] == ' ' {
				break
			}
			result[stackName] = append(result[stackName], cratesLineRunes[runeIndex])
		}
	}
	return result, nil
}

func parseInstruction(instructionStr string) (instruction, error) {
	pattern := regexp.MustCompile(`^move (\d+) from (.) to (.)$`)
	submatches := pattern.FindStringSubmatch(instructionStr)
	if submatches == nil || len(submatches) != 4 {
		return instruction{}, fmt.Errorf("invalid instruction")
	}
	numCrates, err := strconv.Atoi(submatches[1])
	if err != nil {
		return instruction{}, fmt.Errorf("expected integer number of crates, but got %v", submatches[1])
	}
	sourceStack := []rune(submatches[2])[0]
	destinationStack := []rune(submatches[3])[0]
	return instruction{numCrates, sourceStack, destinationStack}, nil
}

func (s *Solution) Init(input io.Reader) error {
	scanner := bufio.NewScanner(input)
	stacksLines := make([]string, 0)
	for scanner.Scan() {
		line := scanner.Text()
		if line == "" {
			break
		}
		stacksLines = append(stacksLines, line)
	}
	stacks, err := parseStacks(stacksLines)
	if err != nil {
		return fmt.Errorf("failed to parse stacks: %v", err)
	}
	s.stacks = stacks
	for scanner.Scan() {
		line := scanner.Text()
		instruction, err := parseInstruction(line)
		if err != nil {
			return fmt.Errorf("failed to parse instruction %q: %v", line, err)
		}
		s.instructions = append(s.instructions, instruction)
	}
	return nil
}

type runeSlice []rune

func (rs runeSlice) Len() int {
	return len(rs)
}
func (rs runeSlice) Swap(i, j int) {
	rs[i], rs[j] = rs[j], rs[i]
}
func (rs runeSlice) Less(i, j int) bool {
	return rs[i] < rs[j]
}

func getTopItems(stacks map[rune][]rune) []rune {
	stackNames := make([]rune, 0, len(stacks))
	for stackName := range stacks {
		stackNames = append(stackNames, stackName)
	}
	sort.Sort(runeSlice(stackNames))
	topItems := make([]rune, 0, len(stacks))
	for _, stackName := range stackNames {
		stack := stacks[stackName]
		topItems = append(topItems, stack[len(stack)-1])
	}
	return topItems
}

func moveCrate(stacks map[rune][]rune, source rune, destination rune) {
	moveCratesTogether(stacks, 1, source, destination)
}

func moveCratesOneByOne(stacks map[rune][]rune, numCrates int, source rune, destination rune) {
	for i := 0; i < numCrates; i++ {
		moveCrate(stacks, source, destination)
	}
}

func (s *Solution) Part1() (string, error) {
	stacks := make(map[rune][]rune)
	for stackName, stack := range s.stacks {
		stacks[stackName] = make([]rune, len(stack))
		copy(stacks[stackName], stack)
	}
	for _, inst := range s.instructions {
		moveCratesOneByOne(stacks, inst.numCrates, inst.sourceStack, inst.destinationStack)
	}
	return string(getTopItems(stacks)), nil
}

func moveCratesTogether(stacks map[rune][]rune, numCrates int, source rune, destination rune) {
	cratesToMove := stacks[source][len(stacks[source])-numCrates : len(stacks[source])]
	stacks[source] = stacks[source][0 : len(stacks[source])-numCrates]
	stacks[destination] = append(stacks[destination], cratesToMove...)
}

func (s *Solution) Part2() (string, error) {
	stacks := make(map[rune][]rune)
	for stackName, stack := range s.stacks {
		stacks[stackName] = make([]rune, len(stack))
		copy(stacks[stackName], stack)
	}
	for _, inst := range s.instructions {
		moveCratesTogether(stacks, inst.numCrates, inst.sourceStack, inst.destinationStack)
	}
	return string(getTopItems(stacks)), nil
}
