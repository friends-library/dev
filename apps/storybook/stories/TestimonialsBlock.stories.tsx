import type { Meta, StoryObj } from '@storybook/react';
import TestimonialsBlock from '../../next-evans/components/pages/friend/TestimonialsBlock';
import '../styles/globals.css';

const meta: Meta<typeof TestimonialsBlock> = {
  title: 'Friend/TestimonialsBlock',
  component: TestimonialsBlock,
};

export default meta;

type Story = StoryObj<typeof TestimonialsBlock>;

export const One: Story = {
  args: {
    testimonials: [
      {
        cite: 'John Doe',
        quote:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id doloribus, aut fugiat provident alias aperiam quae earum totam! Fugit, velit quod! Qui libero nisi est quidem. Voluptatibus aliquid quasi vel. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus atque reiciendis laboriosam, ab voluptate nemo, ad fugiat placeat facere voluptatum perferendis temporibus deserunt cumque harum, eos est vitae. Reiciendis, voluptatibus?',
      },
    ],
  },
};

export const Two: Story = {
  args: {
    testimonials: [
      ...One.args?.testimonials!,
      {
        cite: 'Jane Doe',
        quote:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id doloribus, aut fugiat provident alias aperiam quae earum totam! Fugit, velit quod! Qui libero nisi est quidem. Voluptatibus aliquid quasi vel. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus atque reiciendis laboriosam, ab voluptate nemo.',
      },
    ],
  },
};

export const Three: Story = {
  args: {
    testimonials: [
      ...Two.args?.testimonials!,
      {
        cite: 'Joe Doe',
        quote:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id doloribus, aut fugiat provident alias aperiam quae earum totam! Fugit, velit quod! Qui libero nisi est quidem. Voluptatibus aliquid quasi vel. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus atque reiciendis laboriosam, ab voluptate nemo. Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      },
    ],
  },
};

export const Four: Story = {
  args: {
    testimonials: [
      ...Three.args?.testimonials!,
      {
        cite: 'Jim Doe',
        quote:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id doloribus, aut fugiat provident alias aperiam quae earum totam! Fugit, velit quod! Qui libero nisi est quidem. Voluptatibus aliquid quasi vel. Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      },
    ],
  },
};
