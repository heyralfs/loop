import { useImperativeHandle, useRef, type Ref } from "react";
import Tile from "../tile";
import styles from "./index.module.css";
import type { Direction, Matrix, Operator } from "../../game/types";
import { describeBoard } from "../../game/describe";
import { animateMove, animateFlip } from "./animate";

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
