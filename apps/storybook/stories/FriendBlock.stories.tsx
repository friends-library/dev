import type { Meta, StoryObj } from '@storybook/nextjs';
import { MEDIUM_LOREM, props } from './helpers';
import FriendBlock from '@/app/(friend)/FriendBlock';

const meta = {
  title: 'Friend/FriendBlock', // eslint-disable-line
  component: FriendBlock,
  parameters: { layout: `fullscreen` },
} satisfies Meta<typeof FriendBlock>;

type Story = StoryObj<typeof meta>;

export const Male: Story = props({
  name: `George Fox`,
  gender: `male`,
  blurb: MEDIUM_LOREM,
});

export const Female: Story = props({
  name: `Elizabeth Webb`,
  gender: `female`,
  blurb: MEDIUM_LOREM,
});

export default meta;
