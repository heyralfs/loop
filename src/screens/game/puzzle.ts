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

// Complex targets (with a 2) only begin on this date, so a puzzle already played
// today — or one a player is mid-game on when they refresh — keeps its original
// simple board. Keep this on/after the deploy date: any earlier day would stay
// simple anyway, and no already-played day must ever flip to complex.
const COMPLEX_TARGET_START = "2026-08-22";

const COMPLEX_TARGET_PROBABILITY = 0.3;

const complexProbability =
  seed >= COMPLEX_TARGET_START ? COMPLEX_TARGET_PROBABILITY : 0;

export const target = createTarget(random, complexProbability);

// One BFS from the target answers everything: which scrambles are far enough,
// and par (the scramble's own distance back to the target).
const distances = distancesFrom(target);
export const initial = scramble(target, random, distances);
export const par = distances.get(encode(initial)) ?? 0;
