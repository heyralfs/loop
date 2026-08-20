import { useState } from "react";
import styles from "./index.module.css";
import TargetBoard from "../../components/target-board";
import { puzzleNumber, target, par } from "./puzzle";
import { useGame } from "./use-game";
import Layout from "../../components/layout";
import PlayArea from "../../components/play-area";
import ResultPanel from "../../components/result-panel";
import Countdown from "../../components/countdown";
import {
  hasSeenGuide,
  markGuideAsSeen,
} from "../../components/how-to-play/seen";
import HowToPlay from "../../components/how-to-play";

function GameScreen() {
  const [showGuide, setShowGuide] = useState(() => !hasSeenGuide());

  const dismissGuide = () => {
    markGuideAsSeen();
    setShowGuide(false);
  };

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
    <Layout puzzleNumber={puzzleNumber} openGuide={() => setShowGuide(true)}>
      <HowToPlay open={showGuide} onClose={dismissGuide} />

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
              puzzleNumber={puzzleNumber}
            />
            <Countdown onCountdownEnd={() => location.reload()} />
          </>
        )}
      </div>
    </Layout>
  );
}

export default GameScreen;
