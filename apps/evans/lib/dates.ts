import { LANG } from './env';

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

export function shortDate(dateStr: ISODateString): string {
  const date = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat(`en-US`, { month: `short` });
  let month = formatter.format(date);
  if (LANG === `es`) {
    month = spanishShortMonth(month);
  }
  return `${month} ${date.getDate()}`;
}

export function spanishShortMonth(short: string): string {
  switch (short.toLowerCase()) {
    case `jan`:
      return `Ene`;
    case `apr`:
      return `Abr`;
    case `aug`:
      return `Ago`;
    case `dec`:
      return `Dic`;
  }
  return short;
}
