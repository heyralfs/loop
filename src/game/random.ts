// Deterministic seeded pseudo-random generator.
//
// A given seed always produces the same sequence, which is what makes the daily
// puzzle reproducible: everyone who plays on the same date gets the same board.
// Feed it the date (e.g. "2026-07-04") and pass the returned function to
// scramble as its random source.
//
// Uses two small, well-known public-domain algorithms — good distribution and
// speed for a game (NOT cryptographically secure, which we don't need).

// xmur3: hash a string into a well-mixed 32-bit seed.
function xmur3(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^ (h >>> 16)) >>> 0;
}

// mulberry32: from a 32-bit seed, produce floats in [0, 1).
function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Create a deterministic random() from a string seed.
export function createRandom(seed: string): () => number {
  return mulberry32(xmur3(seed));
}
