import { useSyncExternalStore } from "react";
import { readJSON, writeJSON } from "../game/storage";

// Chrome/Android fire this when the app is installable; it isn't in the DOM lib.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "loop:install-dismissed";
const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000; // re-offer a week after a dismiss

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

// Registered at module load so we don't miss the event before React mounts.
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault(); // suppress Chrome's default mini-bar; we prompt on our button
  deferredPrompt = event as BeforeInstallPromptEvent;
  emit();
});

window.addEventListener("appinstalled", () => {
  installed = true;
  deferredPrompt = null;
  emit();
});

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Can we offer installation right now? (a primitive, so it's a stable snapshot)
// iOS is intentionally excluded — Safari has no programmatic install, and we're
// not doing the manual Add-to-Home-Screen instructions.
function getSnapshot(): boolean {
  return deferredPrompt !== null && !installed && !isStandalone();
}

export function useCanInstall(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function wasRecentlyDismissed(): boolean {
  const at = readJSON(DISMISS_KEY);
  return typeof at === "number" && Date.now() - at < SNOOZE_MS;
}

export function snoozeInstall(): void {
  writeJSON(DISMISS_KEY, Date.now());
}

export async function promptInstall(): Promise<
  "accepted" | "dismissed" | "unavailable"
> {
  if (!deferredPrompt) {
    return "unavailable";
  }
  await deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null; // the prompt can only be used once
  emit();
  return outcome;
}
