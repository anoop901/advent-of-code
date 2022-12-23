package day02

import (
	"fmt"
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

func (s *Solution) Init(input string) error {
	s.strategyGuide = make(StrategyGuide, 0)
	lines := strings.Split(strings.Trim(input, "\n"), "\n")
	for _, line := range lines {
		words := strings.Split(line, " ")
		round := StrategyGuideRound{firstColumn: words[0], secondColumn: words[1]}
		s.strategyGuide = append(s.strategyGuide, round)
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

func outcome(myShape string, opponentShape string) string {
	switch myShape {
	case winStrategy[opponentShape]:
		return "win"
	case loseStrategy[opponentShape]:
		return "loss"
	case opponentShape:
		return "draw"
	default:
		panic(fmt.Sprintf("unexpected shapes %v %v", myShape, opponentShape))
	}
}

func shapeForDesiredOutcome(opponentShape string, desiredOutcome string) string {
	switch desiredOutcome {
	case "draw":
		return opponentShape
	case "win":
		return winStrategy[opponentShape]
	case "loss":
		return loseStrategy[opponentShape]
	default:
		panic(fmt.Sprintf("unknown outcome %v", desiredOutcome))
	}
}

var outcomeToScore = map[string]int{
	"win":  6,
	"draw": 3,
	"loss": 0,
}

func (s *Solution) Part1() int {
	totalScore := 0
	for _, round := range s.strategyGuide {
		opponentShape, ok := firstColumnToShape[round.firstColumn]
		if !ok {
			panic(fmt.Sprintf("unexpected firstColumn %v", round.firstColumn))
		}
		myShape, ok := secondColumnToShape[round.secondColumn]
		if !ok {
			panic(fmt.Sprintf("unexpected secondColumn %v", round.secondColumn))
		}
		shapeScore, ok := shapeToScore[myShape]
		if !ok {
			panic(fmt.Sprintf("unexpected shape %v", myShape))
		}
		outcome := outcome(myShape, opponentShape)
		outcomeScore, ok := outcomeToScore[outcome]
		if !ok {
			panic(fmt.Sprintf("unexpected outcome %v", outcome))
		}
		roundScore := shapeScore + outcomeScore
		totalScore += roundScore
	}
	return totalScore
}

func (s *Solution) Part2() int {
	totalScore := 0
	for _, round := range s.strategyGuide {
		opponentShape, ok := firstColumnToShape[round.firstColumn]
		if !ok {
			panic(fmt.Sprintf("unexpected firstColumn %v", round.firstColumn))
		}
		desiredOutcome, ok := secondColumnToOutcome[round.secondColumn]
		if !ok {
			panic(fmt.Sprintf("unexpected secondColumn %v", round.secondColumn))
		}
		myShape := shapeForDesiredOutcome(opponentShape, desiredOutcome)
		shapeScore, ok := shapeToScore[myShape]
		if !ok {
			panic(fmt.Sprintf("unexpected shape %v", myShape))
		}
		outcomeScore, ok := outcomeToScore[desiredOutcome]
		if !ok {
			panic(fmt.Sprintf("unexpected outcome %v", desiredOutcome))
		}
		roundScore := shapeScore + outcomeScore
		totalScore += roundScore
	}
	return totalScore
}
