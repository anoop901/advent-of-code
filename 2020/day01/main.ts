import loadInputLines from "../../util/loadInputLines";

async function loadExpenseReport(): Promise<number[]> {
  return (await loadInputLines()).map((line) => {
    const expense = parseInt(line);
    if (isNaN(expense)) {
      throw new Error(`malformed input line ${line}`);
    }
    return expense;
  });
}

function getAnswerPart1(expenseReport: number[]): number {
  for (let i = 0; i < expenseReport.length; i++) {
    const value1 = expenseReport[i];
    for (let j = 0; j < expenseReport.length; j++) {
      const value2 = expenseReport[j];
      if (value1 + value2 === 2020) {
        return value1 * value2;
      }
    }
  }
  throw new Error("Matching entries not found in expense report.");
}

function getAnswerPart2(expenseReport: number[]): number {
  for (let i = 0; i < expenseReport.length; i++) {
    const value1 = expenseReport[i];
    for (let j = 0; j < expenseReport.length; j++) {
      const value2 = expenseReport[j];
      for (let k = 0; k < expenseReport.length; k++) {
        const value3 = expenseReport[k];
        if (value1 + value2 + value3 === 2020) {
          return value1 * value2 * value3;
        }
      }
    }
  }
  throw new Error("Matching entries not found in expense report.");
}

async function main() {
  const expenseReport = await loadExpenseReport();
  console.log(getAnswerPart1(expenseReport));
  console.log(getAnswerPart2(expenseReport));
}

main();
