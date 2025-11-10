import type { Meta, StoryObj } from '@storybook/nextjs';
import { props } from './helpers';
import ContactForm from '@/app/contact/ContactFormPage';

const meta = {
  title: 'Contact/Form', // eslint-disable-line
  component: ContactForm,
  parameters: { layout: `fullscreen` },
} satisfies Meta<typeof ContactForm>;

type Story = StoryObj<typeof meta>;

export const Default: Story = props({
  name: `Jared`,
  setName: () => {},
  email: `you@example.com`,
  setEmail: () => {},
  message: ``,
  setMessage: () => {},
  subject: `tech`,
  setSubject: () => {},
  state: `default`,
  onSubmit: async () => {},
  success: true,
  setTurnstileToken: () => {},
});

export const Submitting: Story = props({
  ...Default.args,
  state: `submitting`,
});

export const SubmitSuccess: Story = props({
  ...Default.args,
  state: `submitted`,
  success: true,
});

export const SubmitError: Story = props({
  ...Default.args,
  state: `submitted`,
  success: false,
});

export default meta;
