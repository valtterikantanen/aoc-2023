import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const lines = input.split("\n").map(line => line.split(" ").map(Number));

function calculateDifferences(line: number[]) {
  return line.slice(1).map((value, index) => value - line[index]);
}

function calculateNextValue(line: number[]): number {
  const differences = calculateDifferences(line);
  if (differences.every(diff => diff === 0)) {
    return line.at(-1)! + differences.at(-1)!;
  }
  return line.at(-1)! + calculateNextValue(differences);
}

function calculatePreviousValue(line: number[]): number {
  const differences = calculateDifferences(line);
  if (differences.every(diff => diff === 0)) {
    return line[0] - differences[0];
  }
  return line[0] - calculatePreviousValue(differences);
}

function sumNextValues(lines: number[][]) {
  return lines.reduce((sum, line) => sum + calculateNextValue(line), 0);
}

function sumPreviousValues(lines: number[][]) {
  return lines.reduce((sum, line) => sum + calculatePreviousValue(line), 0);
}

console.log(sumNextValues(lines));
console.log(sumPreviousValues(lines));
