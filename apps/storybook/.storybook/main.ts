import { mergeConfig } from 'vite';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      define: { 'process.env': {} },
    });
  },
  stories: ['../stories/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react-vite',
  docs: {
    autodocs: 'tag',
  },
};
export default config;
