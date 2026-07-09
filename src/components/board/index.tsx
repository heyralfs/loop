import { useImperativeHandle, useRef, type Ref } from "react";
import { flushSync } from "react-dom";
import Tile from "../tile";
import styles from "./index.module.css";
import type { Direction, Matrix, Operator } from "../../game/types";
import { describeBoard } from "../../game/describe";
import {
  getAffectedTileIndices,
  getKeyframes,
  getStepSize,
  ANIMATION_OPTIONS,
  getWrapTileIndices,
  getCloneKeyframes,
} from "./utils";

type BoardHandle = {
  animateMove: (
    operator: Operator,
    direction: Direction,
    commit: () => void,
  ) => Promise<void>;
};
interface Props {
  matrix: Matrix;
  label: string;
  ref?: Ref<BoardHandle>;
}

function Board({ matrix, label, ref }: Props) {
  const tileRefs = useRef(new Map<number, HTMLDivElement | null>());

  useImperativeHandle(
    ref,
    () => ({
      animateMove: async (
        operator: Operator,
        direction: Direction,
        commit: () => void,
      ) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          commit();
          return;
        }

        const animations: Animation[] = [];
        const clones: HTMLElement[] = [];

        const affectedIndices = getAffectedTileIndices(operator);

        // affected tiles
        for (const index of affectedIndices) {
          const tile = tileRefs.current.get(index);
          if (!tile) continue;

          animations.push(
            tile.animate(
              getKeyframes(operator, direction, getStepSize(tile)),
              ANIMATION_OPTIONS,
            ),
          );
        }

        const wrapIndices = getWrapTileIndices(operator, direction);

        // We must clone the exit tiles and animate
        // them to the entry position.
        for (const { entry, exit } of wrapIndices) {
          const entryTile = tileRefs.current.get(entry);
          const exitTile = tileRefs.current.get(exit);

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
      },
    }),
    [],
  );

  return (
    <div
      className={styles.board}
      role="img"
      aria-label={`${label}. ${describeBoard(matrix)}`}
    >
      {matrix.map((value, index) => (
        <Tile
          key={index}
          value={value}
          ref={(el) => {
            tileRefs.current.set(index, el);
          }}
        />
      ))}
    </div>
  );
}

export default Board;
export type { BoardHandle };
