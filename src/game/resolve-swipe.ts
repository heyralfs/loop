import type { Direction, Operator } from "./types";

export function resolveSwipe(
  {
    startRow,
    startCol,
    dx,
    dy,
  }: { startRow: number; startCol: number; dx: number; dy: number },
  { threshold }: { threshold: number },
): { operator: Operator; direction: Direction } | null {
  if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
    return null;
  }

  const isMovingHorizontally = Math.abs(dx) > Math.abs(dy);

  if (isMovingHorizontally) {
    const operator = `R${startRow + 1}` as Operator;
    if (dx > 0) {
      return { operator, direction: "forward" };
    }
    return { operator, direction: "back" };
  }

  const operator = `C${startCol + 1}` as Operator;
  if (dy > 0) {
    return { operator, direction: "forward" };
  }
  return { operator, direction: "back" };
}
