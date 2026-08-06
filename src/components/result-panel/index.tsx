import type { Matrix } from "../../game/types";
import Board from "../board";
import Button from "../button";
import BestAndStreak from "../best-and-streak";
import styles from "./index.module.css";

interface Props {
  matrix: Matrix;
  moves: number;
  par: number;
  bestMoves: number | null;
  streak: number;
  onTryAgain: () => void;
  remainingResets: number;
  gaveUp?: boolean;
}

function ResultPanel({
  matrix,
  moves,
  par,
  bestMoves,
  streak,
  onTryAgain,
  remainingResets,
  gaveUp,
}: Props) {
  if (gaveUp) {
    return <GaveUpResultPanel matrix={matrix} />;
  }

  const atPar = moves === par; // par is the optimum, so moves >= par always.

  if (atPar) {
    return <OptimalResultPanel matrix={matrix} par={par} streak={streak} />;
  }

  return (
    <SolvedResultPanel
      matrix={matrix}
      moves={moves}
      par={par}
      bestMoves={bestMoves}
      streak={streak}
      onTryAgain={onTryAgain}
      remainingResets={remainingResets}
    />
  );
}

function GaveUpResultPanel({ matrix }: Pick<Props, "matrix">) {
  return (
    <div className={styles.wrapper}>
      <div>
        <Board matrix={matrix} label="Your final board" />
      </div>
      <div className={styles.panel} role="status">
        <p className={[styles.headline, styles.gaveUp].join(" ")}>
          You gave up on today's puzzle.
        </p>
        <p className={styles.subhead}>Come back tomorrow for a new one. </p>
      </div>
    </div>
  );
}

function OptimalResultPanel({
  matrix,
  par,
  streak,
}: Pick<Props, "matrix" | "par" | "streak">) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.optimalBoard}>
        <Board matrix={matrix} label="Your final board" />
      </div>
      <div className={styles.panel} role="status">
        <p className={[styles.headline, styles.optimal].join(" ")}>
          Optimal! 🏆
        </p>
        <p className={styles.subhead}>
          You matched par ({par}) — the fewest moves possible.
        </p>
        <BestAndStreak streak={streak} />
      </div>
    </div>
  );
}

function SolvedResultPanel({
  matrix,
  moves,
  par,
  bestMoves,
  streak,
  onTryAgain,
  remainingResets,
}: Omit<Props, "gaveUp">) {
  return (
    <div className={styles.wrapper}>
      <div>
        <Board matrix={matrix} label="Your final board" />
      </div>
      <div className={styles.panel} role="status">
        <p className={styles.headline}>{`Solved in ${moves}`}</p>
        <p className={styles.subhead}>{`Par is ${par}. Can you match it?`}</p>
        <BestAndStreak best={bestMoves} streak={streak} />
        <Button
          className={styles.button}
          onClick={onTryAgain}
          disabled={remainingResets <= 0}
        >
          {remainingResets > 0 ? `Try again (${remainingResets})` : "No resets left"}
        </Button>
      </div>
    </div>
  );
}

export default ResultPanel;
