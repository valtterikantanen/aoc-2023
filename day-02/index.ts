import fs from "fs";
import path from "path";

type Game = {
  id: number;
  rounds: Round[];
};

type Round = {
  red?: number;
  green?: number;
  blue?: number;
};

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const lines = input.split("\n");

function parseGames(lines: string[]): Game[] {
  return lines.map(line => {
    const [gameId, gameRounds] = line.split(": ");
    const id = parseInt(gameId.slice(5));
    const rounds = gameRounds.split("; ").map(round => {
      const cubes = round.split(", ");
      return cubes.reduce((acc: Round, cube) => {
        const [count, color] = cube.split(" ");
        acc[color as keyof Round] = parseInt(count);
        return acc;
      }, {});
    });
    return { id, rounds };
  });
}

function numbersAreWithinLimits({ red = 0, green = 0, blue = 0 }) {
  const limits = { red: 12, green: 13, blue: 14 };
  return red <= limits.red && green <= limits.green && blue <= limits.blue;
}

function calculateSumOfPossibleGames(games: Game[]) {
  return games.reduce(
    (sum, { id, rounds }) => (rounds.every(numbersAreWithinLimits) ? sum + id : sum),
    0
  );
}

function calculateSumOfPowersOfSets(games: Game[]) {
  return games.reduce((sum, { rounds }) => {
    const [minimumOfRed, minimumOfGreen, minimumOfBlue] = rounds.reduce(
      ([red, green, blue], round) => [
        Math.max(red, round.red || 0),
        Math.max(green, round.green || 0),
        Math.max(blue, round.blue || 0),
      ],
      [0, 0, 0]
    );
    return sum + minimumOfRed * minimumOfGreen * minimumOfBlue;
  }, 0);
}

const games = parseGames(lines);

console.log(calculateSumOfPossibleGames(games));
console.log(calculateSumOfPowersOfSets(games));
