import NotFoundHeroBlock from '@evans/404/NotFoundHeroBlock';
import type { Meta, StoryObj } from '@storybook/react';
import { props } from './helpers';

const meta = {
  title: 'Misc/404', // eslint-disable-line
  component: NotFoundHeroBlock,
  parameters: { layout: `fullscreen` },
} satisfies Meta<typeof NotFoundHeroBlock>;

type Story = StoryObj<typeof meta>;

export const Default: Story = props({});

export default meta;
