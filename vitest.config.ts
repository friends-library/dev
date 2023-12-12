/// <reference types="vitest" />
import { configDefaults, defineConfig } from 'vitest/config';

process.env.NEXT_PUBLIC_LANG = `en`;

export default defineConfig({
  test: {
    exclude: [
      ...configDefaults.exclude,
      `libs-swift/**`,
      `apps/api/**`,
      `apps/native/**`,
    ],
  },
});
