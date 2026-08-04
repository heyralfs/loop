import type { ReactNode } from "react";
import type { Matrix } from "../../game/types";
import Board from "../../components/board";
import TargetBoard from "../../components/target-board";
import MoveCounter from "../../components/move-counter";
import BestAndStreak from "../../components/best-and-streak";
import StatusChip from "../../components/status-chip";
import Button from "../../components/button";
import Control from "../../components/control";
import ResultPanel from "../../components/result-panel";
import styles from "./index.module.css";

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

        <Item title="Control — idle & pressed">
          <div className={styles.row}>
            <Control operator="R12" onMove={noop} />
            <Control
              operator="C12"
              onMove={noop}
              activeMove={{ operator: "C12", direction: "forward" }}
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
                onTryAgain={noop}
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
