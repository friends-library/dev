export function isNotNullish<T>(x: T | null | undefined): x is T {
  return x !== null && x !== undefined;
}
