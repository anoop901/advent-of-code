package day06

import (
	"bufio"
	"fmt"
	"io"
)

type Solution struct {
	datastream []rune
}

func (s *Solution) Init(inputReader io.Reader) error {
	scanner := bufio.NewScanner(inputReader)
	ok := scanner.Scan()
	if !ok {
		if scanner.Err() != nil {
			return fmt.Errorf("failed to scan input file: %v", scanner.Err())
		}
		return fmt.Errorf("input was empty")
	}
	line := scanner.Text()
	s.datastream = []rune(line)
	ok = scanner.Scan()
	if ok {
		return fmt.Errorf("found excessive lines in input (only 1 expected)")
	} else if scanner.Err() != nil {
		return fmt.Errorf("failed to scan input file: %v", scanner.Err())
	}
	return nil
}

type set[T comparable] map[T]struct{}

func isMarker(possibleMarker []rune) bool {
	seenRunes := make(set[rune])
	for _, r := range possibleMarker {
		if _, ok := seenRunes[r]; ok {
			return false
		}
		seenRunes[r] = struct{}{}
	}
	return true
}

func (s *Solution) Part1() (int, error) {
	markerLen := 4
	for i := markerLen; i < len(s.datastream); i++ {
		possibleMarker := s.datastream[i-markerLen : i]
		if isMarker(possibleMarker) {
			return i, nil
		}
	}
	return 0, fmt.Errorf("no marker present in input")
}

func (s *Solution) Part2() (int, error) {
	markerLen := 14
	for i := markerLen; i < len(s.datastream); i++ {
		possibleMarker := s.datastream[i-markerLen : i]
		if isMarker(possibleMarker) {
			return i, nil
		}
	}
	return 0, fmt.Errorf("no marker present in input")
}
