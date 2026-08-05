export function msUntilTomorrow(): number {
  const now = new Date();

  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );

  return tomorrow.getTime() - now.getTime();
}
