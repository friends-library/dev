import FeaturedBooksBlock from '@evans/pages/home/FeaturedBooksBlock';
import type { Meta, StoryObj } from '@storybook/react';
import { SHORT_LOREM, props } from './helpers';
import WebCoverStyles from 'decorators/CoverStyles';

const meta = {
  title: 'Home/FeaturedBooksBlock', // eslint-disable-line
  component: FeaturedBooksBlock,
  parameters: { layout: `fullscreen` },
  decorators: [WebCoverStyles],
} satisfies Meta<typeof FeaturedBooksBlock>;

type Story = StoryObj<typeof meta>;

export const Default: Story = props({
  books: [
    {
      isbn: ``,
      title: `A Brief Account of my Exercises from my Childhood`,
      slug: ``,
      customCSS: ``,
      customHTML: ``,
      authorName: `Christian Man`,
      authorSlug: ``,
      authorGender: `male`,
      shortDescription: SHORT_LOREM,
      mostModernEdition: {
        type: `updated`,
        numPages: [200],
        size: 'm',
        audiobook: null,
        impressionCreatedAt: new Date().toISOString(),
      },
      featuredDescription: SHORT_LOREM,
    },
    {
      isbn: ``,
      title: `A Treatise Concerning the Fear of God`,
      slug: ``,
      customCSS: ``,
      customHTML: ``,
      authorName: `Christian Woman`,
      authorSlug: ``,
      authorGender: `female`,
      shortDescription: SHORT_LOREM,
      mostModernEdition: {
        type: `modernized`,
        numPages: [600],
        size: 'm',
        audiobook: null,
        impressionCreatedAt: new Date().toISOString(),
      },
      featuredDescription: SHORT_LOREM,
    },
  ],
});

export default meta;
