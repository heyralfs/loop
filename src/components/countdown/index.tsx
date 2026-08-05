import { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import { msUntilTomorrow } from "../../game/ms-until-tomorrow";

interface Props {
  onCountdownEnd: () => void;
}

function Countdown({ onCountdownEnd }: Props) {
  const [target] = useState(() => Date.now() + msUntilTomorrow());
  const [ms, setMs] = useState(() => target - Date.now());

  const onCountdownEndRef = useRef(onCountdownEnd);

  useEffect(() => {
    onCountdownEndRef.current = onCountdownEnd;
  }, [onCountdownEnd]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newMs = target - Date.now();
      setMs(Math.max(newMs, 0));

      if (newMs <= 0) {
        clearInterval(intervalId);
        onCountdownEndRef.current();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [target]);

  return (
    <div className={styles.countdown}>
      <span>
        Next puzzle in{" "}
        <strong>{new Date(ms).toISOString().slice(11, 19)}</strong>
      </span>
    </div>
  );
}

export default Countdown;
