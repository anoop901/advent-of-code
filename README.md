My solutions to [Advent of Code](adventofcode.com).

# How to run

## Setup

1. Clone this repository.
2. Make sure you have [`npm` and `node` installed](https://www.npmjs.com/get-npm).
3. Run `npm install`.

## Running a challenge

### If the challenge directory contains `solution.ts`

`cd` to the repository root. For example, to run 2021 day 3's challenge, run:

```
npx ts-node ./run_challenge_fn.ts -y 2021 -d 3
```

The program will print the answers to each part.

### If the challenge directory contains `main.ts`

`cd` to the repository root. For example, to run 2020 day 14's challenge, run:

```
node run_challenge.js -y 2020 -d 14
```

The program will print two numbers, which are the answers to each part,
respectively.
