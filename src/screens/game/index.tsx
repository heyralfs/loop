import styles from "./index.module.css";
import TargetBoard from "../../components/target-board";
import { puzzleNumber, target, par } from "./puzzle";
import { useGame } from "./use-game";
import Layout from "../../components/layout";
import PlayArea from "../../components/play-area";
import ResultPanel from "../../components/result-panel";

function GameScreen() {
  const {
    boardRef,
    matrix,
    moves,
    gaveUp,
    bestMoves,
    activeMove,
    currentStats,
    solved,
    handleMove,
    handleGiveUp,
    handleReset,
  } = useGame();

  return (
    <Layout
      puzzleNumber={puzzleNumber}
      status={gaveUp ? "GAVE_UP" : solved ? "SOLVED" : "PLAYING"}
    >
      <div className={styles.wrapper}>
        <TargetBoard matrix={target} />

        {!gaveUp && !solved && (
          <PlayArea
            activeMove={activeMove}
            boardRef={boardRef}
            matrix={matrix}
            moves={moves}
            par={par}
            currentStreak={currentStats.currentStreak}
            bestMoves={bestMoves}
            handleMove={handleMove}
            handleReset={handleReset}
            handleGiveUp={handleGiveUp}
          />
        )}

        {(gaveUp || solved) && (
          <ResultPanel
            matrix={matrix}
            bestMoves={bestMoves}
            moves={moves}
            onTryAgain={handleReset}
            par={par}
            streak={currentStats.currentStreak}
            gaveUp={gaveUp}
          />
        )}
      </div>
    </Layout>
  );
}

export default GameScreen;
