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
  hasSeenSwipe,
  markGuideAsSeen,
  markSwipeSeen,
} from "../../components/how-to-play/seen";
import HowToPlay from "../../components/how-to-play";
import SwipeAnnouncement from "../../components/swipe-announcement";

function GameScreen() {
  const [showGuide, setShowGuide] = useState(() => !hasSeenGuide());

  const [showSwipe, setShowSwipe] = useState(
    () => hasSeenGuide() && !hasSeenSwipe(),
  );

  const dismissGuide = () => {
    markGuideAsSeen();
    markSwipeSeen();
    setShowGuide(false);
  };

  const dismissSwipe = () => {
    markSwipeSeen();
    setShowSwipe(false);
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
    animating,
    handleMove,
    handleGiveUp,
    handleReset,
  } = useGame();

  const gameOver = gaveUp || solved;
  const showResult = !animating && gameOver;

  return (
    <Layout
      puzzleNumber={puzzleNumber}
      openGuide={() => setShowGuide(true)}
      showFooter={showResult}
    >
      <HowToPlay open={showGuide} onClose={dismissGuide} />
      <SwipeAnnouncement open={showSwipe} onClose={dismissSwipe} />
      <div className={styles.wrapper}>
        {showResult ? (
          <>
            <ResultPanel
              matrix={matrix}
              bestMoves={bestMoves}
              moves={moves}
              onTryAgain={handleReset}
              remainingResets={remainingResets}
              par={par}
              streak={currentStats.currentStreak}
              bestStreak={currentStats.bestStreak}
              distribution={currentStats.distribution}
              played={currentStats.played}
              gaveUp={gaveUp}
              puzzleNumber={puzzleNumber}
            />
            <Countdown onCountdownEnd={() => location.reload()} />
          </>
        ) : (
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
      </div>
    </Layout>
  );
}

export default GameScreen;
