import type { Matrix } from "../../game/types";
import Button from "../button";
import BestAndStreak from "../best-and-streak";
import styles from "./index.module.css";
import { useTranslations } from "../../i18n";
import TargetBoard from "../target-board";
import Stats from "../stats";
import { overParBucket } from "../../game/stats";

interface Props {
  matrix: Matrix;
  moves: number;
  par: number;
  bestMoves: number | null;
  streak: number;
  distribution: number[];
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
  distribution,
  onTryAgain,
  remainingResets,
  gaveUp,
}: Props) {
  if (gaveUp) {
    return <GaveUpResultPanel matrix={matrix} distribution={distribution} />;
  }

  const atPar = moves === par; // par is the optimum, so moves >= par always.

  if (atPar) {
    return (
      <OptimalResultPanel
        matrix={matrix}
        par={par}
        streak={streak}
        distribution={distribution}
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
      onTryAgain={onTryAgain}
      remainingResets={remainingResets}
    />
  );
}

function GaveUpResultPanel({
  matrix,
  distribution,
}: Pick<Props, "matrix" | "distribution">) {
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
        <Stats distribution={distribution} />
      </div>
    </div>
  );
}

function OptimalResultPanel({
  matrix,
  par,
  streak,
  distribution,
}: Pick<Props, "matrix" | "par" | "streak" | "distribution">) {
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
        <Stats distribution={distribution} highlight={0} />
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
  onTryAgain,
  remainingResets,
}: Omit<Props, "gaveUp">) {
  const t = useTranslations();

  return (
    <div className={styles.wrapper}>
      <div>
        <TargetBoard matrix={matrix} />
      </div>
      <div className={styles.panel} role="status">
        <p className={styles.headline}>{t.solvedHeadline(moves)}</p>
        <p className={styles.subhead}>{t.solvedSubhead(par)}</p>
        <BestAndStreak best={bestMoves} streak={streak} />
        <Stats
          distribution={distribution}
          highlight={overParBucket(moves - par)}
        />
        <Button
          className={styles.button}
          onClick={onTryAgain}
          disabled={remainingResets <= 0}
        >
          {remainingResets > 0 ? t.tryAgain(remainingResets) : t.noResetsLeft}
        </Button>
      </div>
    </div>
  );
}

export default ResultPanel;
