package day03

import (
	"fmt"
	"strings"
)

type rucksack struct {
	compartment1Items []rune
	compartment2Items []rune
}

type Solution struct {
	rucksacks []rucksack
}

func (s *Solution) Init(input string) error {

	linesCh := make(chan string)
	go func() {
		lines := strings.Split(input, "\n")
		for _, line := range lines {
			if line != "" {
				linesCh <- line
			}
		}
		close(linesCh)
	}()

	for line := range linesCh {
		items := []rune(line)
		numItems := len(items)
		if numItems%2 != 0 {
			return fmt.Errorf("rucksack %q contains odd number of items %v", line, numItems)
		}
		compartment1Items := items[0 : numItems/2]
		compartment2Items := items[numItems/2 : numItems]
		s.rucksacks = append(s.rucksacks, rucksack{compartment1Items: compartment1Items, compartment2Items: compartment2Items})
	}

	return nil
}

func findCommonItem(items1 []rune, items2 []rune) (rune, bool) {
	for _, item1 := range items1 {
		for _, item2 := range items2 {
			if item1 == item2 {
				return item1, true
			}
		}
	}
	return 0, false
}

func priorityOfItemType(itemType rune) (int, error) {
	switch {
	case itemType >= 'a' && itemType <= 'z':
		return int(itemType) - 'a' + 1, nil
	case itemType >= 'A' && itemType <= 'Z':
		return int(itemType) - 'A' + 27, nil
	default:
		return 0, fmt.Errorf("invalid item type %q (must be an uppercase or lowercase letter)", itemType)
	}
}

func (s *Solution) Part1() (int, error) {
	prioritySum := 0
	for _, rucksack := range s.rucksacks {
		commonItem, found := findCommonItem(rucksack.compartment1Items, rucksack.compartment2Items)
		if found {
			priority, err := priorityOfItemType(commonItem)
			if err != nil {
				return 0, fmt.Errorf("failed to find priority of common item %q: %v", commonItem, err)
			}
			prioritySum += priority
		} else {
			return 0, fmt.Errorf(
				"no common item type between compartments %q and %q",
				string(rucksack.compartment1Items),
				string(rucksack.compartment2Items))
		}
	}
	return prioritySum, nil
}

func (s *Solution) Part2() (int, error) {
	return 0, nil
}
