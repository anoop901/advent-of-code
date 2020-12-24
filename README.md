My solutions to [Advent of Code](adventofcode.com).

# How to run

## Setup

1. Clone this repository.
2. Make sure you have [`npm` and `node` installed](https://www.npmjs.com/get-npm).
3. Run `npm install`.

## Running a challenge

There is a `main.ts` and `input.txt` inside each of the day subdirectories in
each year. Each `main.ts` file can be executed from the repository root with
`npx ts-node`. It accepts the input file on standard input. For example, to run
the 2020 day 1 challenge:

```
npx ts-node 2020/day01/main.ts < 2020/day01/input.txt
```

The program will print two numbers, which are the answers to each part,
respectively.
