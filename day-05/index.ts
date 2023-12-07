import fs from "fs";
import path from "path";

type AlmanacMap = {
  seed: number;
  soil?: number;
  fertilizer?: number;
  water?: number;
  light?: number;
  temperature?: number;
  humidity?: number;
  location?: number;
};

type Range = [number, number];

type Row = [number, number, number];

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const lines = input.split("\n");
const groupedLines = input.split("\n\n");

function calculateLowestLocation(lines: string[]) {
  const seeds = lines[0].slice(7).split(" ").map(Number);
  const almanacMaps: AlmanacMap[] = seeds.map(seed => ({ seed }));

  const categories: (keyof AlmanacMap)[] = [
    "seed",
    "soil",
    "fertilizer",
    "water",
    "light",
    "temperature",
    "humidity",
    "location",
  ];

  for (let i = 0; i < categories.length - 1; i++) {
    const previousCategory = categories[i];
    const currentCategory = categories[i + 1];
    const categoryStart = lines.indexOf(`${previousCategory}-to-${currentCategory} map:`) + 1;
    const categoryEnd = lines.indexOf("", categoryStart);
    const mapEntries = lines.slice(categoryStart, categoryEnd).map(row => row.split(" ").map(Number));

    almanacMaps.forEach(map => {
      const previousCategoryValue = map[previousCategory];
      if (!previousCategoryValue) return;

      const correctMapEntry = mapEntries.find(
        ([, sourceStart, length]) =>
          previousCategoryValue >= sourceStart && previousCategoryValue < sourceStart + length
      );

      map[currentCategory] = correctMapEntry
        ? previousCategoryValue + (correctMapEntry[0] - correctMapEntry[1])
        : previousCategoryValue;
    });
  }

  return Math.min(...(almanacMaps as Required<AlmanacMap>[]).map(({ location }) => location));
}

function calculateLowestLocationForRanges(lines: string[]) {
  const [seeds, ...blocks] = lines.map(line => {
    if (line.startsWith("seeds: ")) return line.slice(7).split(" ").map(Number);

    return line
      .split(":\n")[1]
      .split("\n")
      .map(value => value.split(" ").map(Number)) as Array<Row>;
  });

  let ranges: Array<Range> = [];

  for (let i = 0; i < seeds.length - 1; i += 2) {
    const rangeStart = seeds[i] as number;
    const rangeLength = seeds[i + 1] as number;

    ranges.push([rangeStart, rangeStart + rangeLength]);
  }

  for (const block of blocks as Array<Array<Row>>) {
    const newRanges: Array<Range> = [];

    while (ranges.length > 0) {
      const [rangeStart, rangeEnd] = ranges.pop()!;
      let overlapFound = false;

      for (const [destStart, sourceStart, length] of block) {
        const overlapStart = Math.max(rangeStart, sourceStart);
        const overlapEnd = Math.min(rangeEnd, sourceStart + length);
        const offset = destStart - sourceStart;
        if (overlapStart < overlapEnd) {
          overlapFound = true;
          newRanges.push([overlapStart + offset, overlapEnd + offset]);
          // Some of the numbers from the start or the end of the range might not
          // be included in the overlap so they need to be handled separately
          if (overlapStart > rangeStart) ranges.push([rangeStart, overlapStart]);
          if (rangeEnd > overlapEnd) ranges.push([overlapEnd, rangeEnd]);
          break;
        }
      }

      // If there was no corresponding row in the block, the range is kept as is
      if (!overlapFound) newRanges.push([rangeStart, rangeEnd]);
    }
    ranges = newRanges;
  }

  return Math.min(...ranges.map(range => range[0]));
}

console.log(calculateLowestLocation(lines));
console.log(calculateLowestLocationForRanges(groupedLines));
