import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { useState, type ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  Accordion,
  AccordionItem,
  Button,
  Dialog,
  Menu,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Tooltip,
} from './index';

/** Renders a component and fails on any axe-core accessibility violation. */
async function expectAccessible(ui: ReactElement) {
  const { container } = render(ui);
  // color-contrast needs real layout, which jsdom doesn't do; it's covered in Storybook's a11y addon.
  const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
  expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
}

describe('Button', () => {
  it('fires onClick, but not while loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Save</Button>);
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <Button onClick={onClick} loading>
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('defaults to type="button" so it never submits forms by accident', () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('is accessible', () => expectAccessible(<Button variant="primary">Continue</Button>));
});

describe('Switch', () => {
  it('toggles with click and keyboard, and via its label', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch label="Email alerts" description="Daily summary" onCheckedChange={onChange} />);
    const sw = screen.getByRole('switch', { name: 'Email alerts' });
    expect(sw).toHaveAccessibleDescription('Daily summary');
    expect(sw).not.toBeChecked();

    await user.click(sw);
    expect(sw).toBeChecked();
    sw.focus();
    await user.keyboard(' ');
    expect(sw).not.toBeChecked();
    await user.click(screen.getByText('Email alerts'));
    expect(sw).toBeChecked();
    expect(onChange.mock.calls.map(([v]) => v)).toEqual([true, false, true]);
  });

  it('supports controlled usage', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [on, setOn] = useState(true);
      return <Switch label="Wi-Fi" checked={on} onCheckedChange={setOn} />;
    }
    render(<Controlled />);
    await user.click(screen.getByRole('switch'));
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('is accessible', () => expectAccessible(<Switch label="Dark mode" />));
});

describe('Tabs', () => {
  const ui = (
    <Tabs defaultValue="account">
      <TabList label="Settings">
        <Tab value="account">Account</Tab>
        <Tab value="security" disabled>
          Security
        </Tab>
        <Tab value="billing">Billing</Tab>
      </TabList>
      <TabPanel value="account">Account settings</TabPanel>
      <TabPanel value="security">Security settings</TabPanel>
      <TabPanel value="billing">Billing settings</TabPanel>
    </Tabs>
  );

  it('links tabs and panels and shows only the active panel', () => {
    render(ui);
    const tab = screen.getByRole('tab', { name: 'Account' });
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Account' })).toHaveTextContent('Account settings');
    expect(screen.queryByText('Billing settings')).not.toBeVisible();
  });

  it('uses arrow keys with roving tabindex, skipping disabled tabs and wrapping', async () => {
    const user = userEvent.setup();
    render(ui);
    await user.tab();
    expect(screen.getByRole('tab', { name: 'Account' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    const billing = screen.getByRole('tab', { name: 'Billing' });
    expect(billing).toHaveFocus();
    expect(billing).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Account' })).toHaveAttribute('tabindex', '-1');
    await user.keyboard('{ArrowRight}'); // wraps to the first tab
    expect(screen.getByRole('tab', { name: 'Account' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(billing).toHaveFocus();
  });

  it('is accessible', () => expectAccessible(ui));
});

describe('Accordion', () => {
  const ui = (type: 'single' | 'multiple') => (
    <Accordion type={type} defaultValue={['a']}>
      <AccordionItem value="a" title="Shipping">
        Ships in 2 days
      </AccordionItem>
      <AccordionItem value="b" title="Returns">
        30-day returns
      </AccordionItem>
    </Accordion>
  );

  it('expands one section at a time in single mode', async () => {
    const user = userEvent.setup();
    render(ui('single'));
    const shipping = screen.getByRole('button', { name: 'Shipping' });
    const returns = screen.getByRole('button', { name: 'Returns' });
    expect(shipping).toHaveAttribute('aria-expanded', 'true');
    await user.click(returns);
    expect(returns).toHaveAttribute('aria-expanded', 'true');
    expect(shipping).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('region', { name: 'Returns' })).toHaveTextContent('30-day returns');
  });

  it('keeps several sections open in multiple mode', async () => {
    const user = userEvent.setup();
    render(ui('multiple'));
    await user.click(screen.getByRole('button', { name: 'Returns' }));
    expect(screen.getAllByRole('button', { expanded: true })).toHaveLength(2);
  });

  it('renders real headings for the document outline', () => {
    render(ui('single'));
    expect(screen.getByRole('heading', { level: 3, name: 'Shipping' })).toBeInTheDocument();
  });

  it('is accessible', () => expectAccessible(ui('single')));
});

describe('Dialog', () => {
  function Example() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Delete project</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Delete project?"
          description="This cannot be undone."
        >
          <Button variant="danger" onClick={() => setOpen(false)}>
            Delete
          </Button>
        </Dialog>
      </>
    );
  }

  it('is labelled, closes with Escape, and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Delete project' });
    await user.click(trigger);

    const dialog = screen.getByRole('dialog', { name: 'Delete project?' });
    expect(dialog).toHaveAccessibleDescription('This cannot be undone.');

    dialog.dispatchEvent(new Event('cancel', { cancelable: true })); // what the browser fires on Escape
    await vi.waitFor(() =>
      expect(screen.queryByText('This cannot be undone.')).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveFocus();
  });

  it('is accessible when open', () =>
    expectAccessible(
      <Dialog open onOpenChange={() => {}} title="Settings">
        <p>Body</p>
      </Dialog>,
    ));
});

describe('Menu', () => {
  const setup = () => {
    const onRename = vi.fn();
    const onDelete = vi.fn();
    render(
      <Menu
        trigger="Actions"
        items={[
          { label: 'Rename', onSelect: onRename },
          { label: 'Duplicate', onSelect: vi.fn(), disabled: true },
          { label: 'Archive', onSelect: vi.fn() },
          { label: 'Delete', onSelect: onDelete, danger: true },
        ]}
      />,
    );
    return { onRename, onDelete, user: userEvent.setup() };
  };

  it('opens from the keyboard, moves with arrows (skipping disabled), and activates with Enter', async () => {
    const { user, onDelete } = setup();
    const trigger = screen.getByRole('button', { name: 'Actions' });
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveFocus();
    await user.keyboard('{End}{Enter}');
    expect(onDelete).toHaveBeenCalled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('supports typeahead and closes with Escape', async () => {
    const { user } = setup();
    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{Enter}');
    await user.keyboard('a');
    expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus();
  });

  it('opens on the last item with ArrowUp', async () => {
    const { user } = setup();
    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
  });

  it('closes on outside click', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.click(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('is accessible when open', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    // "region" (content inside landmarks) is a page-level rule, not meaningful for a lone component.
    const results = await axe.run(document.body, {
      rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
    });
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});

describe('Tooltip', () => {
  it('describes its trigger on focus and is dismissable with Escape (WCAG 1.4.13)', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Copies the share link">
        <button type="button">Share</button>
      </Tooltip>,
    );
    await user.tab();
    const button = screen.getByRole('button', { name: 'Share' });
    expect(button).toHaveFocus();
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Copies the share link');
    expect(button).toHaveAccessibleDescription('Copies the share link');

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(button).toHaveFocus(); // dismissing doesn't move focus
  });
});
