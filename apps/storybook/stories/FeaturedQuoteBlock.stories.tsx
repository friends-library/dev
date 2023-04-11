import type { Meta, StoryObj } from '@storybook/react';
import FeaturedQuoteBlock from '../../next-evans/components/pages/friend/FeaturedQuoteBlock';
import '../styles/globals.css';

const meta: Meta<typeof FeaturedQuoteBlock> = {
  title: 'Friend/FeaturedQuoteBlock',
  component: FeaturedQuoteBlock,
};

export default meta;

type Story = StoryObj<typeof FeaturedQuoteBlock>;

export const Default: Story = {
  args: {
    quote: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas tempora necessitatibus magni culpa ab placeat saepe vitae doloremque ipsa debitis laudantium, eos quasi veniam, dicta alias. Aliquam reiciendis aliquid perspiciatis? Lorem ipsum, dolor sit amet consectetur adipisicing elit.`,
    cite: `John Doe (on his death bed)`,
  },
};

export const Long: Story = {
  args: {
    quote: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas tempora necessitatibus magni culpa ab placeat saepe vitae doloremque ipsa debitis laudantium, eos quasi veniam, dicta alias. Aliquam reiciendis aliquid perspiciatis? Lorem ipsum dolor, sit amet consectetur adipisicing elit. At harum aspernatur neque enim natus veritatis laborum ut eius libero voluptates earum quis ullam cupiditate odit, et ab id cum similique! Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos molestias aliquid quo suscipit in iusto quos, porro cum asperiores laudantium consequatur blanditiis, provident architecto facere! Odio ratione neque aspernatur corporis! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit excepturi alias non quidem laborum nemo eveniet quis similique soluta voluptatum libero commodi architecto, animi, et quos sed esse, dolores amet.`,
    cite: `John Doe (on his death bed)`,
  },
};
