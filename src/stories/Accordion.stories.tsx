import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, AccordionItem } from '../index';

const meta: Meta<typeof Accordion> = { title: 'Components/Accordion', component: Accordion };
export default meta;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <Accordion defaultValue={['shipping']}>
        <AccordionItem value="shipping" title="How long does shipping take?">
          Orders ship within 2 business days and arrive in 3–5 days.
        </AccordionItem>
        <AccordionItem value="returns" title="What is the return policy?">
          Return anything within 30 days for a full refund.
        </AccordionItem>
        <AccordionItem value="support" title="How do I contact support?">
          Email support@example.com. We reply within one business day.
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
