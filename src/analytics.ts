import { readJSON, writeJSON } from "./game/storage";

const ENDPOINT = "https://loop.goatcounter.com/count";
const STORAGE_KEY = "loop:analytics-queue";

const MAX_ATTEMPTS = 5; // per item, per session — then wait for the next visit
const MAX_QUEUE = 50; // drop the oldest beyond this, so we can't grow unbounded
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // stale analytics aren't worth resending
const MAX_BACKOFF_MS = 30_000; // defensive: only matters if MAX_ATTEMPTS ≥ 7

interface Event {
  id: string;
  path: string;
  title: string;
  ts: number;
}

let queue: Event[] = load();
const attempts = new Map<string, number>(); // in-memory: resets each session
const inFlight = new Set<string>();
let retryScheduled = false;

function makeId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function load(): Event[] {
  const parsed = readJSON(STORAGE_KEY);
  if (!Array.isArray(parsed)) return [];
  const now = Date.now();
  return parsed.filter(
    (e): e is Event =>
      !!e &&
      typeof e.id === "string" &&
      typeof e.path === "string" &&
      typeof e.title === "string" &&
      typeof e.ts === "number" &&
      now - e.ts < MAX_AGE_MS,
  );
}

function persist(): void {
  writeJSON(STORAGE_KEY, queue);
}

function url(e: Event): string {
  const params = new URLSearchParams({
    p: e.path,
    t: e.title,
    e: "true", // mark as an event, not a pageview
    rnd: e.id, // cache-buster
  });
  return `${ENDPOINT}?${params.toString()}`;
}

function remove(id: string): void {
  queue = queue.filter((e) => e.id !== id);
  attempts.delete(id);
  persist();
}

function scheduleRetry(attempt: number): void {
  if (retryScheduled) return;
  retryScheduled = true;
  const delay = Math.min(1000 * 2 ** (attempt - 1), MAX_BACKOFF_MS);
  setTimeout(() => {
    retryScheduled = false;
    flush();
  }, delay);
}

function flush(): void {
  for (const e of queue) {
    if (inFlight.has(e.id)) continue;
    if ((attempts.get(e.id) ?? 0) >= MAX_ATTEMPTS) continue; // exhausted here

    inFlight.add(e.id);

    fetch(url(e), { mode: "no-cors", keepalive: true })
      .then(() => remove(e.id)) // reached the server — done
      .catch(() => {
        const n = (attempts.get(e.id) ?? 0) + 1;
        attempts.set(e.id, n);
        // Keep it queued/persisted even when exhausted, so the next visit
        // (fresh attempts) can retry it until it ages out.
        if (n < MAX_ATTEMPTS) scheduleRetry(n);
      })
      .finally(() => inFlight.delete(e.id));
  }
}

/**
 * Record a custom event. Enqueues, persists, and sends with retry — safe to
 * call from any moment (mid-animation, on unmount) without losing the event.
 */
export function track(path: string, title: string): void {
  // Mirror GoatCounter's own localhost skip: don't pollute stats from dev.
  if (import.meta.env.DEV) {
    console.debug("[analytics]", path, title);
    return;
  }

  queue.push({ id: makeId(), path, title, ts: Date.now() });
  if (queue.length > MAX_QUEUE) queue = queue.slice(-MAX_QUEUE);
  persist();
  flush();
}

if (typeof window !== "undefined") {
  // Last-gasp attempt as the tab hides/closes; keepalive lets these outlive
  // unload. Anything still unsent stays persisted and resumes next visit.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
  // Resume events left over from a previous session.
  flush();
}
