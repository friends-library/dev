import Audiobook from '@evans/pages/audiobooks/Audiobook';
import type { Meta, StoryObj } from '@storybook/react';
import { DOCUMENT_1, SHORT_LOREM, props } from './helpers';
import WebCoverStyles from 'decorators/CoverStyles';

const meta = {
  title: 'Audiobooks/Audiobook', // eslint-disable-line
  component: Audiobook,
  parameters: { layout: `centered` },
  decorators: [WebCoverStyles],
} satisfies Meta<typeof Audiobook>;

type Story = StoryObj<typeof meta>;

export const Default: Story = props({ ...DOCUMENT_1, bgColor: `green`, duration: 14392 });

export default meta;
