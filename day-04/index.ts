import fs from "fs";
import path from "path";

type Card = {
  id: number;
  matches: number;
  count: number;
};

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const lines = input.split("\n");

function parseCards(lines: string[]): Card[] {
  return lines.map(line => {
    const [cardNumber, numbers] = line.split(": ");
    const [winningNumbersStr, receivedNumbersStr] = numbers.split(" | ");
    const winningNumbers: string[] = winningNumbersStr.match(/\d+/g) || [];
    const receivedNumbers: string[] = receivedNumbersStr.match(/\d+/g) || [];

    const matches = receivedNumbers.reduce((sum, number) => (winningNumbers.includes(number) ? sum + 1 : sum), 0);

    return { id: parseInt(cardNumber.slice(5)), matches, count: 1 };
  });
}

function calculateTotalPoints(cards: Card[]) {
  return cards.reduce((sum, { matches }) => (matches > 0 ? sum + 2 ** (matches - 1) : sum), 0);
}

function calculateTotalScratchcards(cards: Card[]) {
  const updatedCards: Card[] = cards.map(card => ({ ...card }));
  return updatedCards.reduce((sum, { matches, count }, index, array) => {
    for (let i = 1; i <= matches; i++) {
      array[index + i].count += count;
    }
    return sum + count;
  }, 0);
}

const cards = parseCards(lines);

console.log(calculateTotalPoints(cards));
console.log(calculateTotalScratchcards(cards));
