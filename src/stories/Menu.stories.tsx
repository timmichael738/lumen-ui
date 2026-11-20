import type { Meta, StoryObj } from '@storybook/react-vite';
import { Menu } from '../index';

const meta: Meta<typeof Menu> = { title: 'Components/Menu', component: Menu };
export default meta;

type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  render: () => (
    <Menu
      trigger="Actions ▾"
      items={[
        { label: 'Rename', onSelect: () => {} },
        { label: 'Duplicate', onSelect: () => {} },
        { label: 'Move to…', onSelect: () => {}, disabled: true },
        { label: 'Archive', onSelect: () => {} },
        { label: 'Delete', onSelect: () => {}, danger: true },
      ]}
    />
  ),
};
