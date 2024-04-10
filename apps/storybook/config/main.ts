import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  env: {
    NEXT_PUBLIC_LANG: `en`,
    NEXT_PUBLIC_TEST_STRIPE_PUBLISHABLE_KEY: `pk_test_51H`,
  },
  stories: [`../stories/**/*.stories.tsx`],
  addons: [`@storybook/addon-essentials`],
  framework: `@storybook/nextjs`,
  typescript: { reactDocgen: false },
  docs: { autodocs: false },
};

export default config;
