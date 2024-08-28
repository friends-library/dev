import type { Meta, StoryObj } from '@storybook/react';
import { LONG_LOREM, SHORT_LOREM, props } from './helpers';
import FeaturedQuoteBlock from '@/app/(friend)/FeaturedQuoteBlock';

const meta = {
  title: 'Friend/FeaturedQuoteBlock', // eslint-disable-line
  component: FeaturedQuoteBlock,
  parameters: { layout: `fullscreen` },
} satisfies Meta<typeof FeaturedQuoteBlock>;

type Story = StoryObj<typeof meta>;

export const Default: Story = props({
  quote: SHORT_LOREM,
  cite: `John Doe (on his death bed)`,
});

export const Long: Story = props({
  quote: LONG_LOREM,
  cite: `John Doe (on his death bed)`,
});

export default meta;
