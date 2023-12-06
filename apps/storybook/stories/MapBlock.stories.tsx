import MapBlock from '@evans/pages/friend/MapBlock';
import type { Meta, StoryObj } from '@storybook/react';
import { props } from './helpers';

const meta = {
  title: 'Friend/MapBlock', // eslint-disable-line
  component: MapBlock,
  parameters: { layout: `fullscreen` },
} satisfies Meta<typeof MapBlock>;

type Story = StoryObj<typeof meta>;

export const Default: Story = props({
  friendName: `John Doe`,
  residences: [`Traverse City, Michigan`, `Chicago, Illinois`, `Hamilton, Bermuda`],
  map: `US`,
  markers: [
    {
      label: `Traverse City, Michigan`,
      top: 15,
      left: 16,
    },
    {
      label: `Chicago, Illinois`,
      top: 38,
      left: 9,
    },
    {
      label: `Hamilton, Bermuda`,
      top: 90,
      left: 95,
    },
  ],
});

export default meta;
