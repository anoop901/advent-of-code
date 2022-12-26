package day04

import (
	"bufio"
	"fmt"
	"io"
	"strconv"
	"strings"
)

type sectionRange struct {
	low  int
	high int
}

type assignmentPair struct {
	assignment1 sectionRange
	assignment2 sectionRange
}

type Solution struct {
	assignmentPairs []assignmentPair
}

func parseSectionRange(sectionRangeStr string) (sectionRange, error) {
	endpointsStrs := strings.Split(sectionRangeStr, "-")
	if len(endpointsStrs) != 2 {
		return sectionRange{}, fmt.Errorf("expected 2 hyphen-separated endpoints but found %v", len(endpointsStrs))
	}
	low, err := strconv.Atoi(endpointsStrs[0])
	if err != nil {
		return sectionRange{}, fmt.Errorf("expected lower endpoint %q to be an integer, but it's not", endpointsStrs[0])
	}
	high, err := strconv.Atoi(endpointsStrs[1])
	if err != nil {
		return sectionRange{}, fmt.Errorf("expected higher endpoint %q to be an integer, but it's not", endpointsStrs[1])
	}
	return sectionRange{low, high}, nil
}

func parseAssignmentPair(assignmentPairStr string) (assignmentPair, error) {
	assignmentsStrs := strings.Split(assignmentPairStr, ",")
	if len(assignmentsStrs) != 2 {
		return assignmentPair{}, fmt.Errorf("expected 2 comma-separated section ranges but found %v", len(assignmentsStrs))
	}
	assignment1, err := parseSectionRange(assignmentsStrs[0])
	if err != nil {
		return assignmentPair{}, fmt.Errorf("failed to parse first assignment %q: %v", assignmentsStrs[0], err)
	}
	assignment2, err := parseSectionRange(assignmentsStrs[1])
	if err != nil {
		return assignmentPair{}, fmt.Errorf("failed to parse second assignment %q: %v", assignmentsStrs[1], err)
	}
	return assignmentPair{assignment1, assignment2}, nil
}

func (s *Solution) Init(inputReader io.Reader) error {
	scanner := bufio.NewScanner(inputReader)
	for scanner.Scan() {
		line := scanner.Text()
		assignmentPair, err := parseAssignmentPair(line)
		if err != nil {
			return fmt.Errorf("failed to parse assignment pair %q: %v", line, err)
		}
		s.assignmentPairs = append(s.assignmentPairs, assignmentPair)
	}
	if scanner.Err() != nil {
		return fmt.Errorf("failed to scan input file: %v", scanner.Err())
	}
	return nil
}

func (sr1 sectionRange) fullyContains(sr2 sectionRange) bool {
	return sr1.high >= sr2.high && sr1.low <= sr2.low
}

func (sr1 sectionRange) overlaps(sr2 sectionRange) bool {
	return sr1.high >= sr2.low && sr2.high >= sr1.low
}

func (ap assignmentPair) oneAssignmentFullyContainsOther() bool {
	return ap.assignment1.fullyContains(ap.assignment2) || ap.assignment2.fullyContains(ap.assignment1)
}

func (s *Solution) Part1() (int, error) {
	numContainingAssignmentPairs := 0
	for _, assignmentPair := range s.assignmentPairs {
		if assignmentPair.oneAssignmentFullyContainsOther() {
			numContainingAssignmentPairs++
		}
	}
	return numContainingAssignmentPairs, nil
}

func (s *Solution) Part2() (int, error) {
	numContainingAssignmentPairs := 0
	for _, assignmentPair := range s.assignmentPairs {
		if assignmentPair.assignment1.overlaps(assignmentPair.assignment2) {
			numContainingAssignmentPairs++
		}
	}
	return numContainingAssignmentPairs, nil
}
