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

export function newestFirst(a: number, b: number): number;
export function newestFirst(a: ISODateString, b: ISODateString): number;
export function newestFirst<T extends { createdAt: ISODateString }>(a: T, b: T): number;

export function newestFirst<
  T extends ISODateString | number | { createdAt: ISODateString },
>(a: T, b: T): number {
  if (typeof a === `object` && typeof b === `object`) {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  } else if (typeof a === `number` && typeof b === `number`) {
    return b - a;
  } else if (typeof a === `string` && typeof b === `string`) {
    return new Date(b).getTime() - new Date(a).getTime();
  }
  throw new Error(`unreachable`);
}
