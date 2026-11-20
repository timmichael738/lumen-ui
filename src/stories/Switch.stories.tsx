import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Switch } from '../index';

const meta: Meta<typeof Switch> = { title: 'Components/Switch', component: Switch };
export default meta;

type Story = StoryObj<typeof Switch>;

function SwitchDemo() {
  const [on, setOn] = useState(true);
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Switch
        label="Email notifications"
        description="A daily summary of activity"
        checked={on}
        onCheckedChange={setOn}
      />
      <Switch label="Beta features" />
      <Switch label="Locked setting" disabled defaultChecked />
    </div>
  );
}

export const Default: Story = {
  render: () => <SwitchDemo />,
};
