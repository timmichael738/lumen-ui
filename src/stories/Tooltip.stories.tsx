import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Tooltip } from '../index';

const meta: Meta<typeof Tooltip> = { title: 'Components/Tooltip', component: Tooltip };
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip content="Copies a link anyone can view">
      <Button>Share</Button>
    </Tooltip>
  ),
};
