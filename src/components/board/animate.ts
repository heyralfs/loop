import { flushSync } from "react-dom";
import type { Direction, Operator } from "../../game/types";
import {
  ANIMATION_OPTIONS,
  getAffectedTileIndices,
  getKeyframes,
  getStepSize,
  getWrapTileIndices,
  getCloneKeyframes,
  getFlipAnimationOptions,
} from "./utils";
import { play } from "../../audio/sounds";

export async function animateMove(
  tileRefs: Map<number, HTMLDivElement | null>,
  operator: Operator,
  direction: Direction,
  commit: () => void,
) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    commit();
    return;
  }

  const animations: Animation[] = [];
  const clones: HTMLElement[] = [];

  const affectedIndices = getAffectedTileIndices(operator);

  // affected tiles
  for (const index of affectedIndices) {
    const tile = tileRefs.get(index);
    if (!tile) continue;

    animations.push(
      tile.animate(
        getKeyframes(operator, direction, getStepSize(tile)),
        ANIMATION_OPTIONS,
      ),
    );
  }

  play("slide");

  const wrapIndices = getWrapTileIndices(operator, direction);

  // We must clone the exit tiles and animate
  // them to the entry position.
  for (const { entry, exit } of wrapIndices) {
    const entryTile = tileRefs.get(entry);
    const exitTile = tileRefs.get(exit);

    if (!entryTile || !exitTile) continue;

    const board = entryTile.parentElement;
    if (!board) continue;

    const clone = exitTile.cloneNode(true) as HTMLDivElement;
    clone.style.position = "absolute";
    clone.style.left = entryTile.offsetLeft + "px";
    clone.style.top = entryTile.offsetTop + "px";

    board.appendChild(clone);
    clones.push(clone);

    animations.push(
      clone.animate(
        getCloneKeyframes(operator, direction, getStepSize(clone)),
        ANIMATION_OPTIONS,
      ),
    );
  }

  await Promise.all(animations.map((animation) => animation.finished));

  // Commit the new state and drop the held transforms in one synchronous
  // task, so the browser paints straight from the animation's end position
  // to the committed board. Fixes flash of the pre-move state in between.
  flushSync(commit);
  animations.forEach((animation) => animation.cancel());
  clones.forEach((clone) => clone.remove());
}

export async function animateFlip(
  tileRefs: Map<number, HTMLDivElement | null>,
  commit: () => void,
) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    commit();
    return;
  }

  const animations: Animation[] = [];

  for (let index = 0; index < tileRefs.size; index++) {
    const tile = tileRefs.get(index);
    if (!tile) continue;

    play("flip", index * 0.05);
    animations.push(
      tile.animate(
        [{ transform: "rotateY(0deg)" }, { transform: "rotateY(90deg)" }],
        getFlipAnimationOptions(index),
      ),
    );
  }

  await Promise.all(animations.map((animation) => animation.finished));
  flushSync(commit);

  for (let index = 0; index < tileRefs.size; index++) {
    const tile = tileRefs.get(index);
    if (!tile) continue;

    play("flip", index * 0.05);
    animations.push(
      tile.animate(
        [{ transform: "rotateY(90deg)" }, { transform: "rotateY(0deg)" }],
        getFlipAnimationOptions(index),
      ),
    );
  }

  await Promise.all(animations.map((animation) => animation.finished));
  animations.forEach((animation) => animation.cancel());
}
