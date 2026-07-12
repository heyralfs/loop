import { createTarget } from "../../game/target";
import { scramble } from "../../game/scramble";
import { createRandom } from "../../game/random";
import { todaySeed } from "../../game/seed";
import { findShortestPath } from "../../game/path";
import { daysBetween } from "../../game/days-between";

const DAY_ONE = "2026-07-11";

export const seed = todaySeed();
export const puzzleNumber = daysBetween(DAY_ONE, seed) + 1;

const random = createRandom(seed);

export const target = createTarget(random);
export const initial = scramble(target, random);
export const par = findShortestPath(initial, target)?.length ?? 0;
