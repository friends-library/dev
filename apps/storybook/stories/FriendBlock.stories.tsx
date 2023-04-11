import type { Meta, StoryObj } from '@storybook/react';
import FriendBlock from '../../next-evans/components/pages/friend/FriendBlock';
import '../styles/globals.css';

const meta: Meta<typeof FriendBlock> = {
  title: 'Friend/FriendBlock',
  component: FriendBlock,
};

export default meta;

type Story = StoryObj<typeof FriendBlock>;

export const Male: Story = {
  args: {
    name: `George Fox`,
    gender: `male`,
    blurb: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam tempore debitis alias sapiente similique illum quidem at, aliquid ducimus magnam facilis placeat esse dolorum dicta quam, veritatis libero asperiores vitae! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Animi totam porro corrupti vitae? Eaque rem ad possimus quae excepturi incidunt quos distinctio officia ab optio iusto inventore, recusandae officiis laudantium. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed doloremque dicta, dolorum ducimus eius temporibus pariatur quaerat, tempore accusantium corrupti eos vero laudantium dolorem minus placeat iste harum modi optio?`,
  },
};

export const Female: Story = {
  args: {
    name: `Elizabeth Webb`,
    gender: `female`,
    blurb: Male.args?.blurb,
  },
};
