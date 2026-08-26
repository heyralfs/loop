import { useImperativeHandle, useRef, type Ref } from "react";
import Tile from "../tile";
import styles from "./index.module.css";
import type { Direction, Matrix, Operator } from "../../game/types";
import { describeBoard } from "../../game/describe";
import { animateMove, animateFlip } from "./animate";
import { resolveSwipe } from "../../game/resolve-swipe";

const SWIPE_THRESHOLD_RATIO = 0.5; // half of a tile's width/height

type BoardHandle = {
  animateMove: (
    operator: Operator,
    direction: Direction,
    solved: boolean,
    atPar: boolean,
    commit: () => void,
  ) => Promise<void>;
  animateFlip: (commit: () => void) => Promise<void>;
};
interface Props {
  matrix: Matrix;
  label: string;
  handleMove?: (operator: Operator, direction: Direction) => void;
  ref?: Ref<BoardHandle>;
}

function Board({ matrix, label, handleMove, ref }: Props) {
  const tileRefs = useRef(new Map<number, HTMLDivElement | null>());

  const pointerCaptureRef = useRef<{ clientX: number; clientY: number } | null>(
    null,
  );

  useImperativeHandle(
    ref,
    () => ({
      animateMove: async (
        operator: Operator,
        direction: Direction,
        solved,
        atPar,
        commit: () => void,
      ) =>
        animateMove(
          tileRefs.current,
          operator,
          direction,
          solved,
          atPar,
          commit,
        ),
      animateFlip: async (commit: () => void) =>
        animateFlip(tileRefs.current, commit),
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
          onPointerDown={(e) => {
            e.preventDefault();
            e.currentTarget.setPointerCapture(e.pointerId);
            pointerCaptureRef.current = e;
          }}
          onPointerCancel={() => {
            pointerCaptureRef.current = null;
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            if (pointerCaptureRef.current) {
              const startRow = Math.floor(index / 4);
              const startCol = index % 4;
              const dx = e.clientX - pointerCaptureRef.current.clientX;
              const dy = e.clientY - pointerCaptureRef.current.clientY;
              const swipe = resolveSwipe(
                { startRow, startCol, dx, dy },
                {
                  threshold:
                    e.currentTarget.offsetWidth * SWIPE_THRESHOLD_RATIO,
                },
              );
              if (swipe) {
                handleMove?.(swipe.operator, swipe.direction);
              }
              pointerCaptureRef.current = null;
            }
          }}
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
