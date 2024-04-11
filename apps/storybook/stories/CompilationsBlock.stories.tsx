import CompilationsBlock from '@evans/blocks/CompilationsBlock';
import type { Meta, StoryObj } from '@storybook/react';
import { props } from './helpers';

const meta = {
  title: 'Friends/CompilationsBlock', // eslint-disable-line
  component: CompilationsBlock,
  parameters: { layout: `fullscreen` },
} satisfies Meta<typeof CompilationsBlock>;

type Story = StoryObj<typeof meta>;

export const Default: Story = props({
  numFriends: 113,
});

export default meta;
