package day03

import (
	"bufio"
	"fmt"
	"io"
)

type rucksack struct {
	compartment1Items []rune
	compartment2Items []rune
	items             []rune
}

type Solution struct {
	rucksacks []rucksack
}

func (s *Solution) Init(inputReader io.Reader) error {

	scanner := bufio.NewScanner(inputReader)
	for scanner.Scan() {
		line := scanner.Text()
		items := []rune(line)
		numItems := len(items)
		if numItems%2 != 0 {
			return fmt.Errorf("rucksack %q contains odd number of items %v", line, numItems)
		}
		compartment1Items := items[0 : numItems/2]
		compartment2Items := items[numItems/2 : numItems]
		s.rucksacks = append(s.rucksacks, rucksack{
			compartment1Items: compartment1Items,
			compartment2Items: compartment2Items,
			items:             items,
		})
	}

	if scanner.Err() != nil {
		return fmt.Errorf("failed to scan input file: %v", scanner.Err())
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

type set[T comparable] map[T]struct{}

func sliceToSet[T comparable](slice []T) set[T] {
	result := make(set[T])
	for _, x := range slice {
		result[x] = struct{}{}
	}
	return result
}

func intersection[T comparable](set1 set[T], set2 set[T]) map[T]struct{} {
	result := make(set[T])
	for x1 := range set1 {
		for x2 := range set2 {
			if x1 == x2 {
				result[x1] = struct{}{}
			}
		}
	}
	return result
}

func intersectionAll[T comparable](sets []set[T]) set[T] {
	if len(sets) == 0 {
		return make(set[T])
	}
	result := sets[0]
	for _, set := range sets {
		result = intersection(result, set)
	}
	return result
}

func (set set[T]) getSomeItem() (T, error) {
	for x := range set {
		return x, nil
	}
	return *new(T), fmt.Errorf("cannot get item from empty set")
}

func (s *Solution) Part2() (int, error) {
	numRucksacksInGroup := 3
	groups := make([][]rucksack, 0)
	for i := 0; i < len(s.rucksacks); i += numRucksacksInGroup {
		if i+numRucksacksInGroup > len(s.rucksacks) {
			return 0, fmt.Errorf(
				"number of rucksacks %v is not a multiple of %v",
				len(s.rucksacks),
				numRucksacksInGroup)
		}
		groups = append(groups, s.rucksacks[i:i+numRucksacksInGroup])
	}

	prioritySum := 0
	for _, group := range groups {
		rucksackItemsInGroup := make([][]rune, 0)
		for _, rucksack := range group {
			rucksackItemsInGroup = append(rucksackItemsInGroup, rucksack.items)
		}
		rucksackItemTypesInGroup := make([]set[rune], 0)
		for _, oneRucksackItemsInGroup := range rucksackItemsInGroup {
			rucksackItemTypesInGroup = append(rucksackItemTypesInGroup, sliceToSet(oneRucksackItemsInGroup))
		}
		commonItemsSet := intersectionAll(rucksackItemTypesInGroup)
		commonItemType, err := commonItemsSet.getSomeItem()
		if err != nil {
			return 0, fmt.Errorf("no common items between rucksacks %q", rucksackItemsInGroup)
		}
		priority, err := priorityOfItemType(commonItemType)
		if err != nil {
			return 0, fmt.Errorf("failed to find priority of common item %q: %v", commonItemType, err)
		}
		prioritySum += priority
	}
	return prioritySum, nil
}
