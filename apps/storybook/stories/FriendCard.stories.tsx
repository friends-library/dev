import type { Meta, StoryObj } from '@storybook/nextjs';
import { props } from './helpers';
import FriendCard from '@/app/friends/FriendCard';

const meta = {
  title: 'Friends/FriendCard', // eslint-disable-line
  component: FriendCard,
  parameters: {
    layout: `centered`,
    backgrounds: {
      default: `offwhite`,
      values: [{ name: `offwhite`, value: `rgb(240, 240, 240)` }],
    },
  },
} satisfies Meta<typeof FriendCard>;

type Story = StoryObj<typeof meta>;

export const Default: Story = props({
  gender: `male`,
  name: `John Doe`,
  born: 1652,
  died: 1723,
  region: `Traverse City, Michigan`,
  numBooks: 3,
  url: `#`,
  color: `maroon`,
});

export const Featured: Story = props({
  ...Default.args,
  featured: true,
  className: `px-12`,
});

export default meta;
