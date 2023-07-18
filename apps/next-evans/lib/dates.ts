export const months = {
  en: [
    `January`,
    `February`,
    `March`,
    `April`,
    `May`,
    `June`,
    `July`,
    `August`,
    `September`,
    `October`,
    `November`,
    `December`,
  ],
  es: [
    `enero`,
    `febrero`,
    `marzo`,
    `abril`,
    `mayo`,
    `junio`,
    `julio`,
    `agosto`,
    `setiembre`,
    `octubre`,
    `noviembre`,
    `diciembre`,
  ],
};

export function newestFirst(
  a: Date | string | number,
  b: Date | string | number,
): number {
  return new Date(b).getTime() - new Date(a).getTime();
}
