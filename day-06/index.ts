import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const lines = input.split("\n");

function findIntegerSolutions(a: number, b: number, c: number): [number, number] {
  const discriminant = b ** 2 - 4 * a * c;
  if (discriminant <= 0) throw new Error("Only one real solution or no real solutions!");

  const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
  const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);

  const integerRoot1 = Number.isInteger(root1) ? root1 + 1 : Math.ceil(root1);
  const integerRoot2 = Number.isInteger(root2) ? root2 - 1 : Math.floor(root2);

  return [integerRoot1, integerRoot2];
}

function waysToWin(time: number, recordDistance: number) {
  // Because totalDistance = speed * (totalTime - timeUsedForAcceleration), we can form an
  // inequality -(speed^2) + time * speed > recordDistance with only one unknown variable
  const [lowerLimit, upperLimit] = findIntegerSolutions(-1, time, -recordDistance);
  return upperLimit - lowerLimit + 1;
}

function parseLineToNumbers(line: string) {
  return line.match(/\d+/g)?.map(Number) || [];
}

function calculateMultipliedWaysToBeatRecords(lines: string[]) {
  const times = parseLineToNumbers(lines[0]);
  const recordDistances = parseLineToNumbers(lines[1]);
  return times.reduce((result, time, index) => result * waysToWin(time, recordDistances[index]), 1);
}

function calculateWaysToBeatRecord(lines: string[]) {
  const time = parseInt(lines[0].match(/\d+/g)?.join("")!);
  const recordDistance = parseInt(lines[1].match(/\d+/g)?.join("")!);
  return waysToWin(time, recordDistance);
}

console.log(calculateMultipliedWaysToBeatRecords(lines));
console.log(calculateWaysToBeatRecord(lines));
