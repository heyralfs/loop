export function readJSON(key: string): unknown {
  try {
    const value = localStorage.getItem(key);
    if (value === null) {
      return null;
    }
    return JSON.parse(value);
  } catch {
    // Storage unavailable or corrupt value — treat as absent.
    return null;
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(key, jsonValue);
  } catch {
    // Storage unavailable or quota exceeded — persistence is best-effort.
  }
}
