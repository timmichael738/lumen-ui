import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  // GitHub Pages serves the site from /<repo>/; the build workflow sets BASE_PATH.
  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    base: process.env.BASE_PATH ?? viteConfig.base,
  }),
};

export default config;
