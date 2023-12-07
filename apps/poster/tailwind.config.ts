// @ts-check
import { tailwindPreset } from '@friends-library/theme';

const lang = process.env.LANG === `es` ? `es` : `en`;

/** @type {import('tailwindcss').Config} */
export default {
  presets: [tailwindPreset(lang)],
  content: [
    `./src/**/*.tsx`,
    `../evans/components/core/LogoAmigos.tsx`,
    `../evans/components/core/LogoFriends.tsx`,
    `../evans/components/core/Album.tsx`,
  ],
};
