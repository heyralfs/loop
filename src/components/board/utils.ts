import { SHIFTS } from "../../game/operators";
import type { Direction, Operator } from "../../game/types";

export function getAffectedTileIndices(operator: Operator): number[] {
  return [...SHIFTS[operator][0]];
}

type Line = readonly [number, number, number, number];

const row = (r: number): Line => [r * 4, r * 4 + 1, r * 4 + 2, r * 4 + 3];
const col = (c: number): Line => [c, c + 4, c + 8, c + 12];

// The two lines each operator shifts.
const LINES: Record<Operator, Line[]> = {
  R12: [row(0), row(1)],
  R34: [row(2), row(3)],
  C12: [col(0), col(1)],
  C34: [col(2), col(3)],
};

// Per shifted line, the cell whose value leaves (exit) and the cell it reappears
// in (entry) — just the two ends, swapped by direction.
export function getWrapTileIndices(
  operator: Operator,
  direction: Direction,
): { entry: number; exit: number }[] {
  return LINES[operator].map((line) =>
    direction === "forward"
      ? { entry: line[0], exit: line[3] }
      : { entry: line[3], exit: line[0] },
  );
}

type Axis = "X" | "Y";

const axisOf = (operator: Operator): Axis =>
  operator.startsWith("R") ? "X" : "Y";

const translate = (axis: Axis, px: number): Keyframe => ({
  transform: `translate${axis}(${px}px)`,
});

const stepDelta = (direction: Direction, step: number): number =>
  direction === "forward" ? step : -step;

export function getKeyframes(
  operator: Operator,
  direction: Direction,
  step: number,
): Keyframe[] {
  const axis = axisOf(operator);
  const delta = stepDelta(direction, step);
  return [translate(axis, 0), translate(axis, delta)];
}

export function getCloneKeyframes(
  operator: Operator,
  direction: Direction,
  step: number,
): Keyframe[] {
  const axis = axisOf(operator);
  const delta = stepDelta(direction, step);
  return [translate(axis, -delta), translate(axis, 0)];
}

export const ANIMATION_OPTIONS: KeyframeAnimationOptions = {
  duration: 500,
  easing: "ease-in-out",
  fill: "forwards",
};

export function getFlipAnimationOptions(
  index: number,
): KeyframeAnimationOptions {
  return {
    duration: 250,
    easing: "ease-in-out",
    fill: "forwards",
    delay: index * 50,
  };
}

export function getStepSize(tile: HTMLDivElement): number {
  const cs = getComputedStyle(tile);
  const tileSize = parseFloat(cs.getPropertyValue("--tile-size"));
  const gap = parseFloat(cs.getPropertyValue("--space-sm"));
  return tileSize + gap;
}
