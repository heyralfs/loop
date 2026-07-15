import Button from "../button";
import styles from "./index.module.css";

interface Props {
  moves: number;
  par: number;
  bestMoves: number;
  streak: number;
  onTryAgain: () => void;
}

function ResultPanel({ moves, par, bestMoves, streak, onTryAgain }: Props) {
  // par is the optimum, so moves >= par always.
  const atPar = moves === par;

  return (
    <div className={styles.panel} role="status">
      <p className={styles.headline}>
        {atPar ? "Optimal! 🏆" : `Solved in ${moves} moves`}
      </p>

      <p>
        {atPar
          ? `You matched par (${par}) — the fewest possible.`
          : `Par is ${par}. Can you match it?`}
      </p>

      <p>Best today: {bestMoves}</p>
      {streak > 0 && <p>🔥 {streak}-day streak</p>}

      <Button onClick={onTryAgain}>Try again</Button>
    </div>
  );
}

export default ResultPanel;
