import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const lines = input.split("\n");

const letterNumbers = new Map([
  ["one", "1"],
  ["two", "2"],
  ["three", "3"],
  ["four", "4"],
  ["five", "5"],
  ["six", "6"],
  ["seven", "7"],
  ["eight", "8"],
  ["nine", "9"],
]);

function numberFromCurrentWord(currentWord: string) {
  for (const word of Array.from(letterNumbers.keys())) {
    if (currentWord.includes(word)) {
      return letterNumbers.get(word);
    }
  }
}

function reverseString(str: string) {
  return str.split("").reverse().join("");
}

function countCalibrationSum(lines: string[]) {
  return lines.reduce((sum, row) => {
    let currentLetterDigit = "";
    let firstNumber: string | undefined;
    let lastNumber: string | undefined;

    for (const char of row) {
      if (!isNaN(parseInt(char))) {
        firstNumber = char;
        currentLetterDigit = "";
      }
      currentLetterDigit += char;
      const numberFromCurrentLetterDigit = numberFromCurrentWord(currentLetterDigit);
      if (numberFromCurrentLetterDigit) {
        firstNumber = numberFromCurrentLetterDigit;
        currentLetterDigit = "";
      }
      if (firstNumber) break;
    }

    for (const char of reverseString(row)) {
      if (!isNaN(parseInt(char))) {
        lastNumber = char;
      }
      currentLetterDigit = char + currentLetterDigit;
      const numberFromCurrentLetterDigit = numberFromCurrentWord(currentLetterDigit);
      if (numberFromCurrentLetterDigit) {
        lastNumber = numberFromCurrentLetterDigit;
      }
      if (lastNumber) break;
    }
    return sum + parseInt(firstNumber! + lastNumber!);
  }, 0);
}

console.log(countCalibrationSum(lines));
