import { useSyncExternalStore } from "react";
import { en } from "./en";
import { pt } from "./pt";
import { readJSON, writeJSON } from "../game/storage";

export type Language = "en" | "pt";

// The shape every locale provides — for non-hook code (e.g. building share
// text) that receives the active dictionary as an argument.
export type Translations = typeof en;

const KEY = "loop:language";

const DICTIONARIES = { en, pt };

// A saved choice wins; otherwise follow the browser.
// Any pt* → Portuguese, everything else → English.
function detectLanguage(): Language {
  const saved = readJSON(KEY);
  if (saved === "en" || saved === "pt") {
    return saved;
  }
  return navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en";
}

let language: Language = detectLanguage();
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Must return a stable value while nothing changed, and since
// `language` is a primitive, it compares by value and won't cause re-render loops.
function getSnapshot(): Language {
  return language;
}

export function setLanguage(next: Language): void {
  if (next === language) {
    return;
  }
  language = next;
  writeJSON(KEY, next);
  listeners.forEach((listener) => listener());
}

export function useLanguage(): Language {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function useTranslations() {
  return DICTIONARIES[useLanguage()];
}
