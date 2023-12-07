import { tailwindPreset } from '@friends-library/theme';
import { LANG } from './lib/env';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [tailwindPreset(LANG)],
  content: [`./pages/**/*.{ts,tsx}`, `./components/**/*.{ts,tsx}`, `./app/**/*.{ts,tsx}`],
};
