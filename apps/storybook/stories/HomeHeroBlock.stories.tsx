import HeroBlock from '@evans/pages/home/HeroBlock';
import type { Meta, StoryObj } from '@storybook/react';
import { props } from './helpers';

const meta = {
  title: 'Home/HeroBlock', // eslint-disable-line
  component: HeroBlock,
  parameters: { layout: `fullscreen` },
} satisfies Meta<typeof HeroBlock>;

type Story = StoryObj<typeof meta>;

export const Default: Story = props({});

export default meta;
