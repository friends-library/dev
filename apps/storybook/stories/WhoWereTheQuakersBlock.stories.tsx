import WhoWereTheQuakersBlock from '@evans/pages/home/WhoWereTheQuakersBlock';
import type { Meta, StoryObj } from '@storybook/react';
import { SHORT_LOREM, props } from './helpers';
import WebCoverStyles from 'decorators/CoverStyles';

const meta = {
  title: 'Home/WhoWereTheQuakersBlock', // eslint-disable-line
  component: WhoWereTheQuakersBlock,
  parameters: { layout: `fullscreen` },
  decorators: [WebCoverStyles],
} satisfies Meta<typeof WhoWereTheQuakersBlock>;

type Story = StoryObj<typeof meta>;

export const Default: Story = props({});

export default meta;
