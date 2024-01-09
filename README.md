# Advent of Code 2023

This repository contains my solutions for the [Advent of Code 2023](https://adventofcode.com/2023) challenge. All solutions are written in TypeScript.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)

### Installation

Clone the repository to your local machine:

```bash
git clone git@github.com:valtterikantanen/aoc-2023.git
cd aoc-2023
```

Then, install the necessary dependencies:

```bash
npm install
```

## Usage

### Running Individual Solutions

To execute the solution for a specific day, use the following command:

```bash
npm run tsx -- <folder-name>
```

Replace `<folder-name>` with the appropriate folder name for the day's challenge (e.g., day-01).

#### Note

When attempting to run individual TypeScript solutions using the command `npm run tsx`, you may encounter an issue if there's a corresponding JavaScript file in the same folder. This happens because tsx prioritizes JavaScript files over TypeScript files by default.

To ensure the TypeScript file is executed, you have two options:

1. Delete the JavaScript file from the folder.
2. Specify the TypeScript file directly in the command:

```bash
npm run tsx -- <folder-name>/index.ts
```

### Transpiling TypeScript to JavaScript

To convert all TypeScript solutions to JavaScript, run:

```bash
npm run build
```

After transpilation, you can execute the JavaScript solution for a specific day:

```bash
node <folder-name>
```

## Structure of the Repository

- Each day's solution is stored in its separate folder (e.g., day-01, day-02, etc.).
- Inside each folder, you'll find the TypeScript solution file along with any input data or additional files used.
