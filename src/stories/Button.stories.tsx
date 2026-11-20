import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Tooltip, VisuallyHidden } from '../index';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Save changes',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Delete</Button>
      <Button loading>Saving</Button>
      <Button disabled>Disabled</Button>
    </div>
  ),
};

export const IconOnly: Story = {
  name: 'Icon-only (with hidden label)',
  render: () => (
    <Tooltip content="Add to favourites">
      <Button variant="ghost">
        <span aria-hidden="true">★</span>
        <VisuallyHidden>Favourite</VisuallyHidden>
      </Button>
    </Tooltip>
  ),
};
