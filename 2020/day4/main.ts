import * as fs from "fs";
import * as readline from "readline";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
// type Passport = string[];
interface Passport {
  byr?: string;
  iyr?: string;
  eyr?: string;
  hgt?: string;
  hcl?: string;
  ecl?: string;
  pid?: string;
  cid?: string;
}

async function loadPassportData(): Promise<Passport[]> {
  const rl = readline.createInterface({
    input: fs.createReadStream("input.txt"),
  });

  const passports: Passport[] = [];
  let currentPassport: Passport | null = null;

  function pushCurrentPassport() {
    if (currentPassport !== null) {
      passports.push(currentPassport);
      currentPassport = null;
    }
  }

  for await (const line of rl) {
    if (line === "") {
      pushCurrentPassport();
    } else {
      if (currentPassport === null) {
        currentPassport = {};
      }
      for (const entry of line.split(" ")) {
        const [fieldName, value] = entry.split(":");
        currentPassport = { ...currentPassport, [fieldName]: value };
      }
    }
  }
  pushCurrentPassport();

  return passports;
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
