import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const steps = input.split(",");

type Lens = {
  label: string;
  focalLength: number;
};

enum Operation {
  "REMOVE",
  "ADD",
}

function runHash(chars: string) {
  return [...chars].reduce((hash, char) => ((hash + char.charCodeAt(0)) * 17) % 256, 0);
}

function calculateSumOfResults() {
  return steps.reduce((sum, step) => sum + runHash(step), 0);
}

function calculateFocusingPower() {
  const boxes: Lens[][] = Array(256)
    .fill(null)
    .map(() => []);

  for (const step of steps) {
    const operation: Operation = step.indexOf("-") !== -1 ? Operation.REMOVE : Operation.ADD;
    const label = operation === Operation.ADD ? step.split("=")[0] : step.slice(0, -1);
    const hash = runHash(label);
    const focalLength = operation === Operation.ADD ? parseInt(step.split("=")[1]) : null;
    const indexInBox = boxes[hash].findIndex(lens => lens.label === label);

    switch (operation) {
      case Operation.REMOVE:
        if (indexInBox !== -1) boxes[hash].splice(indexInBox, 1);
        break;
      case Operation.ADD:
        if (indexInBox !== -1) {
          boxes[hash][indexInBox].focalLength = focalLength!;
        } else {
          boxes[hash].push({ label, focalLength: focalLength! });
        }
    }
  }

  return boxes.reduce(
    (totalFocusingPower, box, boxIndex) =>
      totalFocusingPower +
      box.reduce((boxSum, { focalLength }, lensIndex) => (boxSum += (boxIndex + 1) * (lensIndex + 1) * focalLength), 0),
    0
  );
}

console.log(calculateSumOfResults());
console.log(calculateFocusingPower());
