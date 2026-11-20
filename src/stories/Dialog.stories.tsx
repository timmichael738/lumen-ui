import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button, Dialog } from '../index';

const meta: Meta<typeof Dialog> = { title: 'Components/Dialog', component: Dialog };
export default meta;

type Story = StoryObj<typeof Dialog>;

function DialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete project
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Delete this project?"
        description="All deployments and settings will be removed. This cannot be undone."
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => setOpen(false)}>
            Delete
          </Button>
        </div>
      </Dialog>
    </>
  );
}

export const Default: Story = {
  render: () => <DialogDemo />,
};
