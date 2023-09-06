export function isNotNullish<T>(x: T | null | undefined): x is T {
  return x !== null && x !== undefined;
}

export function inflect(str: string, count: number): string {
  return count === 1 ? str : `${str}s`;
}
