import Button from '@evans/core/Button';
import type { ComponentProps } from 'react';
import type { Meta, StoryFn } from '@storybook/react';

const meta = {
  title: 'Core/Button', // eslint-disable-line
  component: Button,
  parameters: { layout: `centered` },
} satisfies Meta<typeof Button>;

export default meta;

const DefaultTemplate: StoryFn<typeof Button> = () => <ColorsTemplate />;
export const Default = DefaultTemplate.bind({});

const ShadowTemplate: StoryFn<typeof Button> = () => <ColorsTemplate shadow />;
export const Shadow = ShadowTemplate.bind({});

const DisabledTemplate: StoryFn<typeof Button> = () => <ColorsTemplate disabled />;
export const Disabled = DisabledTemplate.bind({});

const ColorsTemplate: React.FC<ComponentProps<typeof Button>> = (props) => (
  <div className="flex items-center justify-center flex-wrap gap-4">
    <Button {...props} bg="gold">
      Gold
    </Button>
    <Button {...props} bg="blue">
      Blue
    </Button>
    <Button {...props} bg="green">
      Green
    </Button>
    <Button {...props} bg="maroon">
      Maroon
    </Button>
    <Button {...props} bg="primary">
      Primary
    </Button>
  </div>
);
