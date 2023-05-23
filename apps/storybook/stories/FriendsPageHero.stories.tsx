import FriendsPageHero from '@evans/pages/friends/FriendsPageHero';
import type { Meta, StoryObj } from '@storybook/react';
import { props } from './helpers';

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
