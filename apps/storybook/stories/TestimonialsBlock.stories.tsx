import type { Meta, StoryObj } from '@storybook/nextjs';
import { MEDIUM_LOREM, props } from './helpers';
import TestimonialsBlock from '@/app/(friend)/TestimonialsBlock';

const meta = {
  title: 'Friend/TestimonialsBlock', // eslint-disable-line
  component: TestimonialsBlock,
  parameters: { layout: `fullscreen` },
} satisfies Meta<typeof TestimonialsBlock>;

type Story = StoryObj<typeof meta>;

export const One: Story = props({
  testimonials: [
    {
      source: `John Doe`,
      text: MEDIUM_LOREM,
    },
  ],
});

export const Two: Story = props({
  testimonials: [
    ...One.args.testimonials,
    {
      source: `Jane Doe`,
      text: MEDIUM_LOREM,
    },
  ],
});

export const Three: Story = props({
  testimonials: [
    ...Two.args.testimonials,
    {
      source: `Joe Doe`,
      text: MEDIUM_LOREM,
    },
  ],
});

export const Four: Story = props({
  testimonials: [
    ...Three.args.testimonials,
    {
      source: `Jim Doe`,
      text: MEDIUM_LOREM,
    },
  ],
});

export default meta;
