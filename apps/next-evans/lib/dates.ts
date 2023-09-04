import type { Lang } from '@friends-library/types';

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

// hh:mm:ss
export function formatDuration(durationSeconds: number): string {
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds - hours * 3600) / 60);
  const seconds = Math.floor(durationSeconds - hours * 3600 - minutes * 60);
  const hoursPart = hours > 0 ? `${hours}:` : ``;
  let minutesPart =
    minutes > 0 ? `${minutes < 10 && hours > 0 ? `0${minutes}` : minutes}:` : ``;
  let secondsPart =
    seconds > 0 ? `${seconds < 10 && minutes > 0 ? `0${seconds}` : seconds}` : ``;
  if (minutes === 0 && hours > 0) minutesPart = `00:`;
  if (seconds === 0 && minutes > 0) secondsPart = `00`;
  return `${hoursPart}${minutesPart}${secondsPart}`;
}

export function formatMonthDay(date: Date | ISODateString, language: Lang): string {
  const d = new Date(date);
  return `${months[language][d.getMonth()]?.substring(0, 3)} ${d.getDate()}`;
}
