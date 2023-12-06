import BookteaserCard from '@evans/core/BookTeaserCard';
import type { Meta, StoryObj } from '@storybook/react';
import WebCoverStyles from '../decorators/CoverStyles';
import { SHORT_LOREM, props } from './helpers';

const meta = {
  title: 'Core/BookTeaserCard', // eslint-disable-line
  component: BookteaserCard,
  parameters: {
    layout: `centered`,
    backgrounds: {
      default: `offwhite`,
      values: [{ name: `offwhite`, value: `rgb(240, 240, 240)` }],
    },
  },
  decorators: [WebCoverStyles],
} satisfies Meta<typeof BookteaserCard>;

type Story = StoryObj<typeof meta>;

export const Book: Story = props({
  editionType: `modernized`,
  paperbackVolumes: [400, 200],
  friendName: `John Doe`,
  documentUrl: ``,
  friendUrl: ``,
  htmlShortTitle: `The Journal of John Doe`,
  description: SHORT_LOREM,
  title: `The Journal of John Doe`,
  isCompilation: false,
  isbn: ``,
});

export const Audiobook: Story = props({
  audioDuration: `1:23:54`,
  editionType: `updated`,
  paperbackVolumes: [400, 200],
  friendName: `John Doe`,
  documentUrl: ``,
  friendUrl: ``,
  htmlShortTitle: `The Journal of John Doe`,
  description: SHORT_LOREM,
  title: `The Journal of John Doe`,
  isCompilation: false,
  isbn: ``,
});

export default meta;
