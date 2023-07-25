import FeaturedBooksBlock from '@evans/pages/home/FeaturedBooksBlock';
import type { Meta, StoryObj } from '@storybook/react';
import { DOCUMENT_1, DOCUMENT_2, SHORT_LOREM, props } from './helpers';
import WebCoverStyles from 'decorators/CoverStyles';

const meta = {
  title: 'Home/FeaturedBooksBlock', // eslint-disable-line
  component: FeaturedBooksBlock,
  parameters: { layout: `fullscreen` },
  decorators: [WebCoverStyles],
} satisfies Meta<typeof FeaturedBooksBlock>;

type Story = StoryObj<typeof meta>;

export const Default: Story = props({
  books: [DOCUMENT_1, DOCUMENT_2],
});

export default meta;
