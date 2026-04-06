/** Pool of large numbers (official Countdown rules) */
const LARGE = [25, 50, 75, 100];

/** Two sets of 1–10 as the small number pool */
const SMALL_POOL = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
];

/** Fisher-Yates shuffle — mutates and returns the array */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate the 6 numbers for a round.
 * @param largeCount  How many large numbers (0–4) the player chose.
 */
export function generateNumbers(largeCount: number): number[] {
  const large = shuffle([...LARGE]).slice(0, largeCount);
  const small = shuffle([...SMALL_POOL]).slice(0, 6 - largeCount);
  return [...large, ...small];
}

/** Random integer between 101 and 999 inclusive */
export function generateTarget(): number {
  return Math.floor(Math.random() * 899) + 101;
}
