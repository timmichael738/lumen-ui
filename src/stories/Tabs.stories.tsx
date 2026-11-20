import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tab, TabList, TabPanel, Tabs } from '../index';

const meta: Meta<typeof Tabs> = { title: 'Components/Tabs', component: Tabs };
export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <Tabs defaultValue="profile">
        <TabList label="Account settings">
          <Tab value="profile">Profile</Tab>
          <Tab value="security">Security</Tab>
          <Tab value="billing" disabled>
            Billing
          </Tab>
          <Tab value="team">Team</Tab>
        </TabList>
        <TabPanel value="profile">Update your name, avatar and bio.</TabPanel>
        <TabPanel value="security">Passwords, passkeys and active sessions.</TabPanel>
        <TabPanel value="billing">Plans and invoices.</TabPanel>
        <TabPanel value="team">Invite teammates and manage roles.</TabPanel>
      </Tabs>
    </div>
  ),
};
