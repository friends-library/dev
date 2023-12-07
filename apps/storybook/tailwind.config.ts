import { tailwindPreset } from '@friends-library/theme';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [tailwindPreset(`en`)],
  content: [`./stories/**/*.tsx`, `../evans/**/*.tsx`],
  plugins: [],
};
