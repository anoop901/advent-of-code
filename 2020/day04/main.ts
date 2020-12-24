import * as fs from "fs";
import * as readline from "readline";
import { splitIterable } from "../util/iterators";
import wu from "wu";

interface Passport {
  byr?: string;
  iyr?: string;
  eyr?: string;
  hgt?: string;
  hcl?: string;
  ecl?: string;
  pid?: string;
  cid?: string;
  [key: string]: string | undefined;
}

async function loadPassportData(): Promise<Passport[]> {
  const rl = readline.createInterface({
    input: fs.createReadStream("input.txt"),
  });

  const lines = [] as string[];
  for await (const line of rl) {
    lines.push(line);
  }

  return wu(splitIterable(lines, ""))
    .map((passportLines) =>
      passportLines.flatMap((passportLine) => passportLine.split(" "))
    )
    .map((passportFieldsStrings) => {
      const passport: Passport = {};
      for (const passportFieldString of passportFieldsStrings) {
        const [key, value] = passportFieldString.split(":");
        passport[key] = value;
      }
      return passport;
    })
    .toArray();
}

function isPassportValidPart1(passport: Passport): boolean {
  return (
    passport.byr !== undefined &&
    passport.iyr !== undefined &&
    passport.eyr !== undefined &&
    passport.hgt !== undefined &&
    passport.hcl !== undefined &&
    passport.ecl !== undefined &&
    passport.pid !== undefined
  );
}

function isStringAnIntegerInBounds(
  s: string,
  minBound: number,
  maxBound: number
): boolean {
  const value = parseInt(s);
  if (isNaN(value)) {
    return false;
  }
  return minBound <= value && value <= maxBound;
}

function isValidHeight(s: string): boolean {
  let match = /^(?<value>\d+)(?<unit>cm|in)$/.exec(s);
  if (match !== null && match.groups !== undefined) {
    const valueString = match.groups["value"];
    const unit = match.groups["unit"];
    if (unit === "cm") {
      if (!isStringAnIntegerInBounds(valueString, 150, 193)) {
        return false;
      }
    } else if (unit === "in") {
      if (!isStringAnIntegerInBounds(valueString, 59, 76)) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}

function isPassportValidPart2(passport: Passport): boolean {
  return (
    passport.byr !== undefined &&
    isStringAnIntegerInBounds(passport.byr, 1920, 2002) &&
    passport.iyr !== undefined &&
    isStringAnIntegerInBounds(passport.iyr, 2010, 2020) &&
    passport.eyr !== undefined &&
    isStringAnIntegerInBounds(passport.eyr, 2020, 2030) &&
    passport.hgt !== undefined &&
    isValidHeight(passport.hgt) &&
    passport.hcl !== undefined &&
    /^#[0-9a-f]{6}$/.exec(passport.hcl) !== null &&
    passport.ecl !== undefined &&
    ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(passport.ecl) &&
    passport.pid !== undefined &&
    /^\d{9}$/.exec(passport.pid) !== null
  );
}

function countValidPassports(
  passportData: Passport[],
  isPassportValid: (passport: Passport) => boolean
): number {
  let numValidPassports = 0;
  for (const passport of passportData) {
    if (isPassportValid(passport)) {
      numValidPassports++;
    }
  }
  return numValidPassports;
}

async function main() {
  const passportData = await loadPassportData();
  console.log(countValidPassports(passportData, isPassportValidPart1));
  console.log(countValidPassports(passportData, isPassportValidPart2));
}

main();
