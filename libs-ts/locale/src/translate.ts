import type { Lang } from '@friends-library/types';
import dict from './strings';

let locale: Lang | null = null;

export function t(strings: TemplateStringsArray, ...vars: (string | number)[]): string {
  const string = translate(strings.join(`%s`));
  return string.replace(`%s`, String(vars[0]));
}

export function tOpt(
  strings: TemplateStringsArray,
  ...vars: (string | number)[]
): string {
  const string = translateOptional(strings.join(`%s`));
  return string.replace(`%s`, String(vars[0]));
}

export function translate(str: string): string {
  const translation = getTranslation(str);
  if (translation === null) {
    throw new Error(`missing translation for string: ${str}`);
  }
  return translation;
}

export function translateOptional(str: string): string {
  return getTranslation(str) ?? str;
}

export function setLocale(set: Lang): void {
  locale = set;
}

function getTranslation(str: string): string | null {
  if (!locale) {
    locale = localeFromEnv();
  }

  if (locale === `es`) {
    const translated = dict[str];
    if (typeof translated === `string`) {
      return translated;
    } else {
      return null;
    }
  }
  return str;
}

function localeFromEnv(): Lang {
  try {
    if (
      typeof process !== `undefined` &&
      process.env &&
      // !!! keep full, exact token for Webpack.definePlugin !!!
      process.env.NEXT_PUBLIC_LANG === `es`
    ) {
      return `es`;
    }

    if (typeof window !== `undefined`) {
      return document.documentElement.lang === `es` ? `es` : `en`;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Error determining locale from env`, err);
  }

  return `en`;
}
