import type { Preview } from '@storybook/react-vite';
import '../src/styles.css';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    // Fail the a11y panel loudly on violations instead of just listing them.
    a11y: { test: 'error' },
  },
  // Render every story on the library's own surface token, so light and dark mode are both
  // shown as they would appear in an app (Storybook's docs canvas is always white otherwise).
  decorators: [
    (Story) => (
      <div
        style={{
          background: 'var(--lumen-surface)',
          color: 'var(--lumen-text)',
          padding: 32,
          minHeight: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default preview;
