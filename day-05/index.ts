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

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const lines = input.split("\n");

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

console.log(calculateLowestLocation(lines));
