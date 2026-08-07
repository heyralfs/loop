import type { ReactNode } from "react";
import styles from "./index.module.css";

interface Props {
  label: string;
  onClick: () => void;
  pressed?: boolean;
  children: ReactNode;
}

function IconButton({ label, onClick, pressed, children }: Props) {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
    >
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
    </button>
  );
}

export default IconButton;
