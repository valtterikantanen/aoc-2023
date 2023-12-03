import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const lines = input.split("\n");

const stars: Map<string, number[]> = new Map();

function isSymbol(char: string) {
  return !["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."].includes(char);
}

function processStar(row: number, col: number, partNumber: number) {
  const key = `${row}-${col}`;
  const partNumbers = stars.get(key) ?? [];
  stars.set(key, [...partNumbers, partNumber]);
}

function checkForSymbols(partNumber: number, row: number, startCol: number, endCol: number) {
  const lineSegment = lines[row].slice(Math.max(0, startCol), endCol);
  const hasSymbols = [...lineSegment].some(isSymbol);

  if (hasSymbols) {
    const starIndex = lineSegment.indexOf("*");
    if (starIndex !== -1) processStar(row, Math.max(0, startCol) + starIndex, partNumber);
  }

  return hasSymbols;
}

function numberIsAdjacentToSymbol(partNumber: string, row: number, col: number) {
  const length = partNumber.length;
  if (length === 0) return false;
  const partNum = parseInt(partNumber);

  return (
    (col > 0 && checkForSymbols(partNum, row, col - 1, col)) ||
    (col + length < lines[row].length - 1 && checkForSymbols(partNum, row, col + length, col + length + 1)) ||
    (row > 0 && checkForSymbols(partNum, row - 1, col - 1, col + length + 1)) ||
    (row + 1 < lines.length && checkForSymbols(partNum, row + 1, col - 1, col + length + 1))
  );
}

function calculateSumOfPartNumbers(lines: string[]) {
  return lines.reduce((sum, line, row) => {
    let currentPartNumber = "";
    let sumFromLine = 0;

    line.split("").forEach((char, col) => {
      if (!isNaN(parseInt(char))) {
        currentPartNumber += char;
        if (
          col === line.length - 1 &&
          numberIsAdjacentToSymbol(currentPartNumber, row, col - currentPartNumber.length)
        ) {
          sumFromLine += parseInt(currentPartNumber);
        }
      } else if (numberIsAdjacentToSymbol(currentPartNumber, row, col - currentPartNumber.length)) {
        sumFromLine += parseInt(currentPartNumber);
        currentPartNumber = "";
      } else {
        currentPartNumber = "";
      }
    });

    return sum + sumFromLine;
  }, 0);
}

function calculateSumOfGearRatios() {
  const gears = Array.from(stars.values()).filter(arr => arr.length === 2);
  return gears.reduce((sum, gear) => sum + gear[0] * gear[1], 0);
}

console.log(calculateSumOfPartNumbers(lines));
console.log(calculateSumOfGearRatios());
