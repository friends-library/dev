import type { Meta, StoryObj } from '@storybook/nextjs';
import { props } from './helpers';
import FriendsPageHero from '@/app/friends/FriendsPageHero';

const meta = {
  title: 'Friends/FriendsPageHero', // eslint-disable-line
  component: FriendsPageHero,
  parameters: { layout: `fullscreen` },
} satisfies Meta<typeof FriendsPageHero>;

type Story = StoryObj<typeof meta>;

export const Default: Story = props({
  numFriends: 113,
});

export default meta;
