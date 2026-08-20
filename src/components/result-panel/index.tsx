import type { Matrix } from "../../game/types";
import Button from "../button";
import BestAndStreak from "../best-and-streak";
import styles from "./index.module.css";
import { useTranslations } from "../../i18n";
import TargetBoard from "../target-board";
import Stats from "../stats";
import ShareResult from "../share-result";

interface Props {
  matrix: Matrix;
  moves: number;
  par: number;
  bestMoves: number | null;
  streak: number;
  distribution: number[];
  played: number;
  onTryAgain: () => void;
  remainingResets: number;
  gaveUp?: boolean;
  puzzleNumber: number;
}

function ResultPanel({
  matrix,
  moves,
  par,
  bestMoves,
  streak,
  distribution,
  played,
  onTryAgain,
  remainingResets,
  gaveUp,
  puzzleNumber,
}: Props) {
  if (gaveUp && bestMoves === null) {
    return (
      <GaveUpResultPanel
        matrix={matrix}
        distribution={distribution}
        played={played}
      />
    );
  }

  const atPar = moves === par; // par is the optimum, so moves >= par always.

  if (atPar) {
    return (
      <OptimalResultPanel
        matrix={matrix}
        par={par}
        streak={streak}
        distribution={distribution}
        played={played}
        puzzleNumber={puzzleNumber}
      />
    );
  }

  return (
    <SolvedResultPanel
      matrix={matrix}
      moves={moves}
      par={par}
      bestMoves={bestMoves}
      streak={streak}
      distribution={distribution}
      played={played}
      onTryAgain={onTryAgain}
      remainingResets={remainingResets}
      gaveUp={gaveUp}
      puzzleNumber={puzzleNumber}
    />
  );
}

function GaveUpResultPanel({
  matrix,
  distribution,
  played,
}: Pick<Props, "matrix" | "distribution" | "played">) {
  const t = useTranslations();

  return (
    <div className={styles.wrapper}>
      <div>
        <TargetBoard matrix={matrix} />
      </div>
      <div className={styles.panel} role="status">
        <p className={[styles.headline, styles.gaveUp].join(" ")}>
          {t.gaveUpHeadline}
        </p>
        <p className={styles.subhead}>{t.gaveUpSubhead}</p>
        <Stats distribution={distribution} played={played} />
      </div>
    </div>
  );
}

function OptimalResultPanel({
  matrix,
  par,
  streak,
  distribution,
  played,
  puzzleNumber,
}: Pick<
  Props,
  "matrix" | "par" | "streak" | "distribution" | "played" | "puzzleNumber"
>) {
  const t = useTranslations();

  return (
    <div className={styles.wrapper}>
      <div className={styles.optimalBoard}>
        <TargetBoard matrix={matrix} />
      </div>
      <div className={styles.panel} role="status">
        <p className={[styles.headline, styles.optimal].join(" ")}>
          {t.optimalHeadline}
        </p>
        <p className={styles.subhead}>{t.optimalSubhead(par)}</p>
        <BestAndStreak streak={streak} />
        <Stats distribution={distribution} played={played} />
        <ShareResult
          puzzleNumber={puzzleNumber}
          moves={par}
          par={par}
          streak={streak}
        />
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
  distribution,
  played,
  onTryAgain,
  remainingResets,
  gaveUp = false,
  puzzleNumber,
}: Props) {
  const t = useTranslations();

  // if player gave up, then "moves" doesn't reflect the actual number
  // of moves to solve the puzzle, so we use bestMoves instead (if available)
  // to show the player how well they did.
  const winMoves = gaveUp ? (bestMoves ?? moves) : moves;

  // Sharing always brags today's best — not the current (possibly worse)
  // re-solve. A re-solve in 8 after a 7 still shares the 7.
  const shareMoves = bestMoves ?? moves;

  return (
    <div className={styles.wrapper}>
      <div>
        <TargetBoard matrix={matrix} />
      </div>
      <div className={styles.panel} role="status">
        <p className={styles.headline}>{t.solvedHeadline(winMoves)}</p>
        {!gaveUp && <p className={styles.subhead}>{t.solvedSubhead(par)}</p>}
        <BestAndStreak best={bestMoves} streak={streak} />
        <Stats distribution={distribution} played={played} />
        <div className={styles.actions}>
          {!gaveUp && (
            <Button
              className={styles.button}
              onClick={onTryAgain}
              disabled={remainingResets <= 0}
            >
              {remainingResets > 0
                ? t.tryAgain(remainingResets)
                : t.noResetsLeft}
            </Button>
          )}
          <ShareResult
            variant={gaveUp ? "FILLED" : "OUTLINED"}
            puzzleNumber={puzzleNumber}
            moves={shareMoves}
            par={par}
            streak={streak}
          />
        </div>
      </div>
    </div>
  );
}

export default ResultPanel;
