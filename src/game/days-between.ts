export function daysBetween(from: string, to: string): number {
  const diffTime = new Date(to).getTime() - new Date(from).getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}
