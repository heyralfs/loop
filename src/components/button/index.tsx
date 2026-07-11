import type { ButtonHTMLAttributes } from "react";
import styles from "./index.module.css";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
}

function Button({ pressed, className, type = "button", ...props }: Props) {
  return (
    <button
      {...props}
      type={type}
      data-pressed={pressed}
      className={[styles.button, className].filter(Boolean).join(" ")}
    />
  );
}

export default Button;
