import type { Matrix } from "./types";

// Creates a new target board: exactly 8 filled cells (1s, maybe a 2) and 8 empty
// (0s). Complexity is opt-in per puzzle (the caller decides the probability by
// date — see puzzle.ts). Probability 0 short-circuits BEFORE drawing from
// `random`, so simple/historical puzzles stay byte-identical to before 2s existed.
export function createTarget(
  random: () => number,
  complexProbability = 0,
): Matrix {
  if (complexProbability > 0 && random() < complexProbability) {
    return createComplexTarget(random);
  }
  return createSimpleTarget(random);
}

function createSimpleTarget(random: () => number): Matrix {
  const refs: number[] = [];

  for (let i = 0; i < 16; i++) {
    refs.push(random());
  }

  const order = [...Array(16).keys()].sort((a, b) => refs[a] - refs[b]);
  const target: Matrix = new Array(16);

  order.forEach((cell, rank) => {
    target[cell] = (rank % 2) as 0 | 1;
  });

  return target;
}

// Complex target includes 0, 1, and 2.
function createComplexTarget(random: () => number, numTwos = 1): Matrix {
  const target = createSimpleTarget(random);

  // Randomly replace some 1s with 2s, ensuring we don't exceed the number of 1s available.
  const onesIndices = target
    .map((value, index) => (value === 1 ? index : -1))
    .filter((index) => index !== -1);

  const numTwosToPlace = Math.min(numTwos, onesIndices.length);

  for (let i = 0; i < numTwosToPlace; i++) {
    const randomIndex = Math.floor(random() * onesIndices.length);
    const indexToReplace = onesIndices[randomIndex];
    target[indexToReplace] = 2;
    onesIndices.splice(randomIndex, 1); // Remove the used index to avoid duplicates
  }

  return target;
}
