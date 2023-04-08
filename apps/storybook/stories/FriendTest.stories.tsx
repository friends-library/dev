import type { Meta, StoryObj } from '@storybook/react';
import FriendTest from '../../next-evans/components/FriendTest';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof FriendTest> = {
  title: 'Example/FriendTest', // eslint-disable-line
  component: FriendTest,
};

export default meta;
type Story = StoryObj<typeof FriendTest>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Primary: Story = {
  args: {
    name: `George Fox`,
    gender: `male`,
  },
};
