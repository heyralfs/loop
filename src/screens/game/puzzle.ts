import { createTarget } from "../../game/target";
import { scramble } from "../../game/scramble";
import { createRandom } from "../../game/random";
import { todaySeed } from "../../game/seed";
import { distancesFrom, encode } from "../../game/path";
import { daysBetween } from "../../game/days-between";

const DAY_ONE = "2026-08-05";

export const seed = todaySeed();
export const puzzleNumber = daysBetween(DAY_ONE, seed) + 1;

const random = createRandom(seed);

export const target = createTarget(random);

// One BFS from the target answers everything: which scrambles are far enough,
// and par (the scramble's own distance back to the target).
const distances = distancesFrom(target);
export const initial = scramble(target, random, distances);
export const par = distances.get(encode(initial)) ?? 0;
