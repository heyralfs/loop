import type { ReactNode } from "react";
import type { Matrix } from "../../game/types";
import Board from "../../components/board";
import TargetBoard from "../../components/target-board";
import MoveCounter from "../../components/move-counter";
import BestAndStreak from "../../components/best-and-streak";
import StatusChip from "../../components/status-chip";
import Button from "../../components/button";
import ControlButton from "../../components/control-button";
import ResultPanel from "../../components/result-panel";
import Stats from "../../components/stats";
import styles from "./index.module.css";
import Countdown from "../../components/countdown";
import IconButton from "../../components/icon-button";
import MuteToggle from "../../components/mute-toggle";
import ThemeToggle from "../../components/theme-toggle";

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
          </div>
        </Item>

        <Item title="Status chips">
          <div className={styles.row}>
            <StatusChip status="PLAYING" />
            <StatusChip status="SOLVED" />
            <StatusChip status="OPTIMAL" />
            <StatusChip status="GAVE_UP" />
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
          <Stats distribution={[8, 5, 3, 1]} highlight={1} />
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
                onTryAgain={noop}
                remainingResets={5}
                distribution={[8, 5, 3, 1]}
              />
            </div>
            <div>
              <ResultPanel
                matrix={SOLVED}
                moves={18}
                par={6}
                bestMoves={6}
                streak={2}
                onTryAgain={noop}
                remainingResets={3}
                distribution={[8, 5, 3, 1]}
              />
            </div>
            <div>
              <ResultPanel
                matrix={SOLVED}
                moves={0}
                par={0}
                bestMoves={null}
                streak={0}
                onTryAgain={noop}
                remainingResets={5}
                distribution={[8, 5, 3, 1]}
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
                onTryAgain={noop}
                remainingResets={0}
                distribution={[8, 5, 3, 1]}
                gaveUp
              />
            </div>
          </div>
        </Item>

        <Item title="Countdown">
          <Countdown onCountdownEnd={noop} />
        </Item>
      </div>
    </div>
  );
}

export default Sandbox;
