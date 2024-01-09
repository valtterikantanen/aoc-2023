import fs from "fs";
import path from "path";

type Point = [number, number];

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const lines = input.split("\n");
const WIDTH = lines[0].length;
const HEIGHT = lines.length;

function convertPointToString(point: Point) {
  return `${point[0]}-${point[1]}`;
}

function isWithinBounds(point: Point) {
  const [x, y] = point;
  return x >= 0 && y >= 0 && x < WIDTH && y < HEIGHT;
}

function findStartingPoint(): [number, number] | undefined {
  for (let i = 0; i < lines.length; i++) {
    const j = lines[i].indexOf("S");
    if (j !== -1) return [j, i];
  }
}

function findValueOfS(x: number, y: number) {
  let possibleS = ["-", "|", "J", "7", "L", "F"];
  if (["-", "L", "F"].includes(lines[y][x - 1])) possibleS = possibleS.filter(value => ["-", "J", "7"].includes(value));
  if (["-", "J", "7"].includes(lines[y][x + 1])) possibleS = possibleS.filter(value => ["-", "L", "F"].includes(value));
  if (["|", "L", "J"].includes(lines[y + 1][x])) possibleS = possibleS.filter(value => ["|", "7", "F"].includes(value));
  if (["|", "7", "F"].includes(lines[y - 1][x])) possibleS = possibleS.filter(value => ["|", "L", "J"].includes(value));
  return possibleS[0];
}

function isValidMovement(current: string, next: string, dx: number, dy: number) {
  if (dx === -1 && dy === 0) return ["-", "J", "7", "S"].includes(current) && ["-", "L", "F"].includes(next);
  if (dx === 1 && dy === 0) return ["-", "L", "F", "S"].includes(current) && ["-", "J", "7"].includes(next);
  if (dx === 0 && dy === 1) return ["|", "7", "F", "S"].includes(current) && ["|", "L", "J"].includes(next);
  if (dx === 0 && dy === -1) return ["|", "L", "J", "S"].includes(current) && ["|", "7", "F"].includes(next);
}

function findNeighbors(point: Point) {
  const [x, y] = point;
  const neighbors: Array<Point> = [];
  const directions = [
    [-1, 0],
    [1, 0],
    [0, 1],
    [0, -1],
  ];

  for (const [dx, dy] of directions) {
    const nextPoint: Point = [x + dx, y + dy];

    if (!isWithinBounds(nextPoint)) continue;

    if (isValidMovement(lines[y][x], lines[y + dy][x + dx], dx, dy)) neighbors.push(nextPoint);
  }

  return neighbors;
}

function findVisitedTiles() {
  const visitedPoints = new Set<string>();
  const startingPoint = findStartingPoint();
  let currentPoint: Point | undefined = startingPoint;

  while (currentPoint) {
    visitedPoints.add(convertPointToString(currentPoint));
    const neighbors = findNeighbors(currentPoint);
    const nextPoint = neighbors.find(neighbor => !visitedPoints.has(convertPointToString(neighbor)));
    currentPoint = nextPoint;
  }

  return visitedPoints;
}

function calculateFarthestPoint() {
  return Math.floor((visited.size + 1) / 2);
}

function isWithinEnclosure(char: string, isWithin: boolean, isUp: boolean) {
  if (char === "|") return !isWithin;
  if (["L", "F"].includes(char)) return isWithin;
  if (["7", "J"].includes(char)) return char === (isUp ? "J" : "7") ? isWithin : !isWithin;
  throw new Error("Unknown value");
}

function calculateEnclosedTiles(): number {
  const startingPoint = findStartingPoint();
  if (!startingPoint) throw new Error("Starting point not found");

  const s = findValueOfS(startingPoint[0], startingPoint[1]);

  const updatedGrid = lines.map((line, rowIndex) =>
    line
      .replace("S", s)
      .split("")
      .map((char, colIndex) => (visited.has(convertPointToString([colIndex, rowIndex])) ? char : "."))
      .join("")
  );

  const outside = new Set<string>();

  for (let rowIdx = 0; rowIdx < HEIGHT; rowIdx++) {
    const row = updatedGrid[rowIdx];
    let within = false;
    let up = false;
    for (let colIdx = 0; colIdx < WIDTH; colIdx++) {
      const char = row[colIdx];
      if (["L", "F", "7", "J", "|"].includes(char)) {
        within = isWithinEnclosure(char, within, up);
        up = char === "L";
      }
      if (!within) outside.add(convertPointToString([colIdx, rowIdx]));
    }
  }

  const outsideOrLoop = new Set([...visited, ...outside]);

  return HEIGHT * WIDTH - outsideOrLoop.size;
}

const visited = findVisitedTiles();
console.log(calculateFarthestPoint());
console.log(calculateEnclosedTiles());
