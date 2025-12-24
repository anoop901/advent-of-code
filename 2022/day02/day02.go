package day02

import (
	"bufio"
	"fmt"
	"io"
	"strings"
)

type StrategyGuideRound struct {
	firstColumn  string
	secondColumn string
}

type StrategyGuide []StrategyGuideRound

type Solution struct {
	strategyGuide StrategyGuide
}

func (s *Solution) Init(inputReader io.Reader) error {
	s.strategyGuide = make(StrategyGuide, 0)
	scanner := bufio.NewScanner(inputReader)
	for scanner.Scan() {
		line := scanner.Text()
		words := strings.Split(line, " ")
		round := StrategyGuideRound{firstColumn: words[0], secondColumn: words[1]}
		s.strategyGuide = append(s.strategyGuide, round)
	}
	if scanner.Err() != nil {
		return fmt.Errorf("failed to scan input file: %v", scanner.Err())
	}
	return nil
}

var firstColumnToShape = map[string]string{
	"A": "rock",
	"B": "paper",
	"C": "scissors",
}

var secondColumnToShape = map[string]string{
	"X": "rock",
	"Y": "paper",
	"Z": "scissors",
}

var secondColumnToOutcome = map[string]string{
	"X": "loss",
	"Y": "draw",
	"Z": "win",
}

var winStrategy = map[string]string{
	"rock":     "paper",
	"paper":    "scissors",
	"scissors": "rock",
}

var loseStrategy = map[string]string{
	"rock":     "scissors",
	"paper":    "rock",
	"scissors": "paper",
}

var shapeToScore = map[string]int{
	"rock":     1,
	"paper":    2,
	"scissors": 3,
}

func outcome(myShape string, opponentShape string) (string, error) {
	switch myShape {
	case winStrategy[opponentShape]:
		return "win", nil
	case loseStrategy[opponentShape]:
		return "loss", nil
	case opponentShape:
		return "draw", nil
	default:
		return "", fmt.Errorf("unexpected shapes %v %v", myShape, opponentShape)
	}
}

func shapeForDesiredOutcome(opponentShape string, desiredOutcome string) (string, error) {
	switch desiredOutcome {
	case "draw":
		return opponentShape, nil
	case "win":
		return winStrategy[opponentShape], nil
	case "loss":
		return loseStrategy[opponentShape], nil
	default:
		return "", fmt.Errorf("unknown outcome %v", desiredOutcome)
	}
}

var outcomeToScore = map[string]int{
	"win":  6,
	"draw": 3,
	"loss": 0,
}

func (s *Solution) Part1() (int, error) {
	totalScore := 0
	for _, round := range s.strategyGuide {
		opponentShape, ok := firstColumnToShape[round.firstColumn]
		if !ok {
			return 0, fmt.Errorf("unexpected firstColumn %v", round.firstColumn)
		}
		myShape, ok := secondColumnToShape[round.secondColumn]
		if !ok {
			return 0, fmt.Errorf("unexpected secondColumn %v", round.secondColumn)
		}
		shapeScore, ok := shapeToScore[myShape]
		if !ok {
			return 0, fmt.Errorf("unexpected shape %v", myShape)
		}
		outcome, err := outcome(myShape, opponentShape)
		if err != nil {
			return 0, fmt.Errorf(
				"failed to compute outcome between %v and %v: %v",
				myShape,
				opponentShape,
				err)
		}
		outcomeScore, ok := outcomeToScore[outcome]
		if !ok {
			return 0, fmt.Errorf("unexpected outcome %v", outcome)
		}
		roundScore := shapeScore + outcomeScore
		totalScore += roundScore
	}
	return totalScore, nil
}

func (s *Solution) Part2() (int, error) {
	totalScore := 0
	for _, round := range s.strategyGuide {
		opponentShape, ok := firstColumnToShape[round.firstColumn]
		if !ok {
			return 0, fmt.Errorf("unexpected firstColumn %v", round.firstColumn)
		}
		desiredOutcome, ok := secondColumnToOutcome[round.secondColumn]
		if !ok {
			return 0, fmt.Errorf("unexpected secondColumn %v", round.secondColumn)
		}
		myShape, err := shapeForDesiredOutcome(opponentShape, desiredOutcome)
		if err != nil {
			return 0, fmt.Errorf(
				"failed to compute shape to play when opponent plays %v for desired "+
					"outcome %v: %v",
				opponentShape,
				desiredOutcome,
				err)
		}
		shapeScore, ok := shapeToScore[myShape]
		if !ok {
			return 0, fmt.Errorf("unexpected shape %v", myShape)
		}
		outcomeScore, ok := outcomeToScore[desiredOutcome]
		if !ok {
			return 0, fmt.Errorf("unexpected outcome %v", desiredOutcome)
		}
		roundScore := shapeScore + outcomeScore
		totalScore += roundScore
	}
	return totalScore, nil
}
