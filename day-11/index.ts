import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const grid = input.split("\n").map(row => row.split(""));

function findRowsAndColumnsWithNoGalaxies() {
  const rowFlags: boolean[] = new Array(grid.length).fill(true);
  const colFlags: boolean[] = new Array(grid[0].length).fill(true);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "#") {
        rowFlags[i] = false;
        colFlags[j] = false;
      }
    }
  }

  return {
    rows: rowFlags.map((flag, index) => (flag ? index : null)).filter(index => index !== null) as number[],
    cols: colFlags.map((flag, index) => (flag ? index : null)).filter(index => index !== null) as number[],
  };
}

function calculateManhattanDistance(x1: number, y1: number, x2: number, y2: number, scale: number) {
  const startCol = Math.min(x1, x2);
  const startRow = Math.min(y1, y2);
  const endCol = Math.max(x1, x2);
  const endRow = Math.max(y1, y2);
  const emptyRowsBetween = rowsWithoutGalaxies.filter(value => startCol < value && value < endCol).length;
  const emptyColsBetween = colsWithoutGalaxies.filter(value => startRow < value && value < endRow).length;

  return endCol - startCol + endRow - startRow + scale * (emptyColsBetween + emptyRowsBetween);
}

function calculateSumOfLengths(scale?: number) {
  const galaxies = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "#") {
        galaxies.push({ x: i, y: j });
      }
    }
  }

  let totalDistance = 0;

  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      totalDistance += calculateManhattanDistance(
        galaxies[i].x,
        galaxies[i].y,
        galaxies[j].x,
        galaxies[j].y,
        scale ? scale - 1 : 1
      );
    }
  }

  return totalDistance;
}

const { rows: rowsWithoutGalaxies, cols: colsWithoutGalaxies } = findRowsAndColumnsWithNoGalaxies();
console.log(calculateSumOfLengths());
console.log(calculateSumOfLengths(1_000_000));
