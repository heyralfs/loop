import type { ButtonHTMLAttributes } from "react";
import styles from "./index.module.css";
import { play } from "../../audio/sounds";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  variant?: "FILLED" | "OUTLINED" | "TONAL";
}

function Button({
  pressed,
  className,
  type = "button",
  variant = "FILLED",
  onClick,
  ...props
}: Props) {
  return (
    <button
      {...props}
      type={type}
      data-pressed={pressed}
      className={[styles.button, styles[variant.toLowerCase()], className]
        .filter(Boolean)
        .join(" ")}
      onClick={(e) => {
        onClick?.(e);
        play("click");
      }}
    />
  );
}

export default Button;
