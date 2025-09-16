export function array<T>(length: number, fill: T | ((i: number) => T)) {
  return Array.from({ length }, fill instanceof Function ? (_, i) => fill(i) : () => fill);
}