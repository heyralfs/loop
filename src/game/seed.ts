// The local calendar date as a YYYY-MM-DD seed string.
//
// Uses local-time getters (not toISOString, which is UTC), so the daily puzzle
// rolls over at the player's own midnight rather than UTC midnight.
export function dateToSeed(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth is 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function todaySeed(): string {
  return dateToSeed(new Date());
}
