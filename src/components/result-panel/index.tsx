import type { Matrix } from "../../game/types";
import Board from "../board";
import Button from "../button";
import BestAndStreak from "../best-and-streak";
import styles from "./index.module.css";
import { translations as t } from "../../i18n";

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
        <Board matrix={matrix} label={t.yourFinalBoard} />
      </div>
      <div className={styles.panel} role="status">
        <p className={[styles.headline, styles.gaveUp].join(" ")}>
          {t.gaveUpHeadline}
        </p>
        <p className={styles.subhead}>{t.gaveUpSubhead}</p>
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
        <Board matrix={matrix} label={t.yourFinalBoard} />
      </div>
      <div className={styles.panel} role="status">
        <p className={[styles.headline, styles.optimal].join(" ")}>
          {t.optimalHeadline}
        </p>
        <p className={styles.subhead}>{t.optimalSubhead(par)}</p>
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
        <Board matrix={matrix} label={t.yourFinalBoard} />
      </div>
      <div className={styles.panel} role="status">
        <p className={styles.headline}>{t.solvedHeadline(moves)}</p>
        <p className={styles.subhead}>{t.solvedSubhead(par)}</p>
        <BestAndStreak best={bestMoves} streak={streak} />
        <Button
          className={styles.button}
          onClick={onTryAgain}
          disabled={remainingResets <= 0}
        >
          {remainingResets > 0
            ? t.tryAgain(remainingResets)
            : t.noResetsLeft}
        </Button>
      </div>
    </div>
  );
}

export default ResultPanel;
