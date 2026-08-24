import { useState, type ReactNode } from "react";
import type { Matrix } from "../../game/types";
import Board from "../../components/board";
import TargetBoard from "../../components/target-board";
import MoveCounter from "../../components/move-counter";
import BestAndStreak from "../../components/best-and-streak";
import Button from "../../components/button";
import ControlButton from "../../components/control-button";
import ResultPanel from "../../components/result-panel";
import Stats from "../../components/stats";
import styles from "./index.module.css";
import Countdown from "../../components/countdown";
import IconButton from "../../components/icon-button";
import MuteToggle from "../../components/mute-toggle";
import ThemeToggle from "../../components/theme-toggle";
import HowToPlay from "../../components/how-to-play";
import LanguageSwitcher from "../../components/language-switcher";
import ShareResult from "../../components/share-result";

// prettier-ignore
const SOLVED: Matrix = [
  0, 1, 0, 1,
  1, 0, 1, 0,
  0, 1, 0, 1,
  1, 0, 1, 0,
];
// prettier-ignore
const SCRAMBLED: Matrix = [
  1, 1, 0, 0,
  1, 0, 1, 0,
  0, 0, 1, 1,
  0, 1, 0, 1,
];

const noop = () => {};

// The guide is a modal now, so it can't sit inline — a button pops it open.
function HowToPlayDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open how to play</Button>
      <HowToPlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function Item({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.item}>
      <h2 className={styles.itemTitle}>{title}</h2>
      <div className={styles.stage}>{children}</div>
    </section>
  );
}

// Dev-only gallery of every presentational piece in its states.
// Reach it at `?sandbox` (see app/index.tsx). Add/remove Items freely.
function Sandbox() {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Sandbox · dev</h1>

      <div className={styles.grid}>
        <Item title="Board">
          <Board matrix={SCRAMBLED} label="Your board" />
        </Item>

        <Item title="Target board">
          <TargetBoard matrix={SOLVED} />
        </Item>

        <Item title="Move counter">
          <MoveCounter moves={4} par={6} />
        </Item>

        <Item title="Best and streak">
          <div className={styles.column}>
            <BestAndStreak best={6} streak={0} />
            <BestAndStreak best={5} streak={3} />
            <BestAndStreak streak={2} />
            <BestAndStreak streak={1} bestStreak={16} />
          </div>
        </Item>

        <Item title="Button variants">
          <div className={styles.row}>
            <Button variant="FILLED">Filled</Button>
            <Button variant="TONAL">Tonal</Button>
            <Button variant="OUTLINED">Outlined</Button>
            <Button variant="FILLED" disabled>
              Disabled
            </Button>
          </div>
        </Item>

        <Item title="Icon button">
          <div className={styles.row}>
            <IconButton label="Example icon button" onClick={noop}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </IconButton>
          </div>
        </Item>

        <Item title="Header toggles (live)">
          <div className={styles.row}>
            <MuteToggle />
            <ThemeToggle />
          </div>
        </Item>

        <Item title="Control button">
          <div className={styles.row}>
            <ControlButton
              orientation="row"
              direction="back"
              label="Shift row left"
              onClick={noop}
            />
            <ControlButton
              orientation="row"
              direction="forward"
              label="Shift row right"
              onClick={noop}
            />
            <ControlButton
              orientation="column"
              direction="back"
              label="Shift column up"
              onClick={noop}
            />
            <ControlButton
              orientation="column"
              direction="forward"
              label="Shift column down"
              onClick={noop}
              pressed
            />
          </div>
        </Item>

        <Item title="Stats · distribution">
          <Stats distribution={[8, 5, 3, 1]} played={20} />
        </Item>

        <Item title="Countdown">
          <Countdown onCountdownEnd={noop} />
        </Item>

        <Item title="Language switcher (Live)">
          <LanguageSwitcher />
        </Item>

        <Item title="How to play">
          <HowToPlayDemo />
        </Item>

        <Item title="Share result">
          <div className={styles.column}>
            {/* Optimal */}
            <ShareResult
              puzzleNumber={1}
              moves={6}
              par={6}
              streak={4}
              matrix={SOLVED}
            />
            {/* Solved */}
            <ShareResult
              puzzleNumber={2}
              moves={9}
              par={6}
              streak={2}
              matrix={SOLVED}
            />
          </div>
        </Item>

        <Item title="Result panel">
          <div className={styles.column}>
            <div>
              <ResultPanel
                matrix={SOLVED}
                moves={6}
                par={6}
                bestMoves={6}
                streak={4}
                bestStreak={12}
                onTryAgain={noop}
                remainingResets={5}
                distribution={[8, 5, 3, 1]}
                played={20}
                puzzleNumber={1}
              />
            </div>
            <div>
              <ResultPanel
                matrix={SOLVED}
                moves={18}
                par={6}
                bestMoves={6}
                streak={2}
                bestStreak={16}
                onTryAgain={noop}
                remainingResets={3}
                distribution={[8, 5, 3, 1]}
                played={20}
                puzzleNumber={2}
              />
            </div>
            <div>
              <ResultPanel
                matrix={SOLVED}
                moves={0}
                par={0}
                bestMoves={null}
                streak={0}
                bestStreak={5}
                onTryAgain={noop}
                remainingResets={5}
                distribution={[8, 5, 3, 1]}
                played={20}
                puzzleNumber={3}
                gaveUp
              />
            </div>
            <div>
              <ResultPanel
                matrix={SOLVED}
                moves={20}
                par={6}
                bestMoves={8}
                streak={3}
                bestStreak={20}
                onTryAgain={noop}
                remainingResets={0}
                distribution={[8, 5, 3, 1]}
                played={20}
                puzzleNumber={4}
                gaveUp
              />
            </div>
          </div>
        </Item>
      </div>
    </div>
  );
}

export default Sandbox;
