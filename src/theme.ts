import { readJSON, writeJSON } from "./game/storage";

const THEME_KEY = "loop:theme";

export type Theme = "light" | "dark";

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function apply(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}

// Saved override if present, otherwise follow the OS on first visit.
const saved = readJSON(THEME_KEY);
let theme: Theme = saved === "dark" || saved === "light" ? saved : systemTheme();
apply(theme);

export function getTheme(): Theme {
  return theme;
}

export function persistTheme(next: Theme): void {
  theme = next;
  writeJSON(THEME_KEY, next);
  apply(next);
}
