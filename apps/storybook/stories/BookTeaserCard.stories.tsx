import type { Meta, StoryObj } from '@storybook/react';
import BookTeaserCard from '@evans/core/BookTeaserCard';
import { SHORT_LOREM, props } from './helpers';
import WebCoverStyles from '../decorators/CoverStyles';

const meta = {
  title: 'Core/BookTeaserCard', // eslint-disable-line
  component: BookTeaserCard,
  parameters: {
    layout: `centered`,
    backgrounds: {
      default: `offwhite`,
      values: [{ name: `offwhite`, value: `rgb(240, 240, 240)` }],
    },
  },
  decorators: [WebCoverStyles],
} satisfies Meta<typeof BookTeaserCard>;

type Story = StoryObj<typeof meta>;

export const Default: Story = props({
  isbn: ``,
  title: `A Short Treatise on Purity as a Virtue`,
  editions: [],
  customCSS: ``,
  customHTML: ``,
  authorName: `John Doe`,
  htmlShortTitle: `A Short Treatise on Purity as a Virtue`,
  documentUrl: ``,
  authorUrl: ``,
  description: SHORT_LOREM,
});
export const Audiobook: Story = props({
  ...Default.args,
  audioDuration: `2:58:04`,
});

export default meta;
