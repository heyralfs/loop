import styles from "./index.module.css";
import TargetBoard from "../../components/target-board";
import { puzzleNumber, target, par } from "./puzzle";
import { useGame } from "./use-game";
import Layout from "../../components/layout";
import PlayArea from "../../components/play-area";
import ResultPanel from "../../components/result-panel";
import Countdown from "../../components/countdown";

function GameScreen() {
  const {
    boardRef,
    matrix,
    moves,
    remainingResets,
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
        {!gaveUp && !solved && (
          <>
            <TargetBoard matrix={target} />
            <PlayArea
              activeMove={activeMove}
              boardRef={boardRef}
              matrix={matrix}
              moves={moves}
              remainingResets={remainingResets}
              par={par}
              currentStreak={currentStats.currentStreak}
              bestMoves={bestMoves}
              handleMove={handleMove}
              handleReset={handleReset}
              handleGiveUp={handleGiveUp}
            />
          </>
        )}

        {(gaveUp || solved) && (
          <>
            <ResultPanel
              matrix={matrix}
              bestMoves={bestMoves}
              moves={moves}
              onTryAgain={handleReset}
              remainingResets={remainingResets}
              par={par}
              streak={currentStats.currentStreak}
              distribution={currentStats.distribution}
              gaveUp={gaveUp}
            />
            <Countdown onCountdownEnd={() => location.reload()} />
          </>
        )}
      </div>
    </Layout>
  );
}

export default GameScreen;
