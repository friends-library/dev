export default function invariant(
  condition: unknown,
  message: string | (() => string),
): asserts condition {
  if (condition) {
    return;
  }
  const detail = typeof message === `function` ? message() : message;
  throw new Error(`Invariant failed: ${detail}`);
}
