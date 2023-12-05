import FormBlock from '@evans/contact/FormBlock';
import type { Meta, StoryObj } from '@storybook/react';
import { props } from './helpers';

const meta = {
  title: 'Contact/Form', // eslint-disable-line
  component: FormBlock,
  parameters: { layout: `fullscreen` },
} satisfies Meta<typeof FormBlock>;

type Story = StoryObj<typeof meta>;

export const Default: Story = props({ onSubmit: async () => true });

export default meta;
