import plugin from 'tailwindcss/plugin';
import type { Config } from 'tailwindcss';
import type { Lang } from '@friends-library/types';
import * as c from './color';

export default function tailwindPreset(lang: Lang = `en`): Omit<Config, 'content'> {
  return {
    theme: {
      fontFamily: {
        sans: `Cabin, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
        serif: `Baskerville, Georgia, Cambria, "Times New Roman", Times, serif`,
        mono: `Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
      },
      extend: {
        colors: {
          flprimary: rgb(lang === `en` ? c.MAROON_RGB : c.GOLD_RGB),
          flgold: rgb(c.GOLD_RGB),
          flmaroon: rgb(c.MAROON_RGB),
          flblue: rgb(c.BLUE_RGB),
          flgreen: rgb(c.GREEN_RGB),
          flgray: rgb(c.GRAY_RGB),
          flblack: rgb(c.BLACK_RGB),
          'flprimary-800': rgb(lang === `en` ? c.MAROON_800_RGB : c.GOLD_800_RGB),
          'flprimary-600': rgb(lang === `en` ? c.MAROON_600_RGB : c.GOLD_600_RGB),
          'flprimary-500': rgb(lang === `en` ? c.MAROON_500_RGB : c.GOLD_500_RGB),
          'flprimary-400': rgb(lang === `en` ? c.MAROON_400_RGB : c.GOLD_400_RGB),
          'flmaroon-800': rgb(c.MAROON_800_RGB),
          'flmaroon-600': rgb(c.MAROON_600_RGB),
          'flmaroon-500': rgb(c.MAROON_500_RGB),
          'flmaroon-400': rgb(c.MAROON_400_RGB),
          'flgreen-800': rgb(c.GREEN_800_RGB),
          'flgreen-700': rgb(c.GREEN_700_RGB),
          'flgreen-600': rgb(c.GREEN_600_RGB),
          'flgreen-400': rgb(c.GREEN_400_RGB),
          'flblue-800': rgb(c.BLUE_800_RGB),
          'flblue-700': rgb(c.BLUE_700_RGB),
          'flblue-600': rgb(c.BLUE_600_RGB),
          'flblue-400': rgb(c.BLUE_400_RGB),
          'flgold-800': rgb(c.GOLD_800_RGB),
          'flgold-600': rgb(c.GOLD_600_RGB),
          'flgold-500': rgb(c.GOLD_500_RGB),
          'flgold-400': rgb(c.GOLD_400_RGB),
          'flgray-900': rgb(c.GRAY_900_RGB),
          'flgray-800': rgb(c.GRAY_800_RGB),
          'flgray-700': rgb(c.GRAY_700_RGB),
          'flgray-600': rgb(c.GRAY_600_RGB),
          'flgray-500': rgb(c.GRAY_500_RGB),
          'flgray-400': rgb(c.GRAY_400_RGB),
          'flgray-300': rgb(c.GRAY_300_RGB),
          'flgray-200': rgb(c.GRAY_200_RGB),
          'flgray-100': rgb(c.GRAY_100_RGB),
        },
        fontSize: {
          '1-5xl': `1.375rem`,
          '2-5xl': `1.6875rem`,
          '3-5xl': `2.0625rem`,
        },
        boxShadow: {
          btn: `rgba(0, 0, 0, 0.15) 0px 0px 10px 4px`,
          direct: `0 -7px 25px -5px rgba(0, 0, 0, 0.1), 0 15px 10px -5px rgba(0, 0, 0, 0.04)`,
        },
      },
    },
    variants: [
      `responsive`,
      `group-hover`,
      `focus-within`,
      `first`,
      `last`,
      `odd`,
      `even`,
      `hover`,
      `focus`,
      `active`,
      `visited`,
      `disabled`,
    ],
    plugins: [
      plugin(({ addVariant }) => {
        addVariant(`en`, `html[lang=en] &`);
        addVariant(`es`, `html[lang=es] &`);
      }),
    ],
  };
}

function rgb(color: [number, number, number]): string {
  return `rgb(${color.join(`, `)})`;
}
