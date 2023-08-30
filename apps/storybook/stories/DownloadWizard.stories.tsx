import DownloadWizard from '@evans/pages/document/DownloadWizard';
import type { Meta, StoryObj } from '@storybook/react';
import { props } from './helpers';

const meta = {
  title: 'Document/DownloadWizard', // eslint-disable-line
  component: DownloadWizard,
  parameters: {
    layout: `centered`,
    backgrounds: {
      default: `offwhite`,
      values: [{ name: `offwhite`, value: `rgb(240, 240, 240)` }],
    },
  },
} satisfies Meta<typeof DownloadWizard>;

type Story = StoryObj<typeof meta>;

export const Default: Story = props({
  editions: ['modernized', 'updated', 'original'],
  onSelect: () => {},
  top: 200,
  left: 600,
});

export default meta;
