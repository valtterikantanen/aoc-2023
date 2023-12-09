import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const [instructions, ...network] = input.split("\n").filter(line => line !== "");

function parseNetworkMap(network: string[]) {
  const networkMap = new Map<string, Record<string, string>>();

  for (const node of network) {
    const [currentNode, neighbors] = node.split(" = ");
    const [left, right] = neighbors.replace(/[()]/g, "").split(", ");
    networkMap.set(currentNode, { left, right });
  }
  return networkMap;
}

function greatestCommonDivisor(a: number, b: number): number {
  return b !== 0 ? greatestCommonDivisor(b, a % b) : a;
}

function leastCommonMultiple(numbers: number[]) {
  return numbers.reduce((a, b) => (a * b) / greatestCommonDivisor(a, b));
}

function calculateStepsRequired(startingNode: string, multipleNodes = false) {
  let steps = 0;
  let currentElement = startingNode;

  for (let i = 0; i < instructions.length; i++) {
    const direction = instructions[i];
    currentElement = direction === "L" ? networkMap.get(currentElement)!.left : networkMap.get(currentElement)!.right;
    steps++;
    if ((multipleNodes && currentElement.endsWith("Z")) || currentElement === "ZZZ") break;
    if (i === instructions.length - 1) i = -1;
  }

  return steps;
}

function calculateStepsRequiredForSimultaneousNodes() {
  const startingNodes = Array.from(networkMap.keys()).filter(node => node.endsWith("A"));
  const stepsRequired = startingNodes.map(startingNode => calculateStepsRequired(startingNode, true));
  return leastCommonMultiple(stepsRequired);
}

const networkMap = parseNetworkMap(network);
console.log(calculateStepsRequired("AAA"));
console.log(calculateStepsRequiredForSimultaneousNodes());
