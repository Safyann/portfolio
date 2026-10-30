import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: { name: '@storybook/nextjs-vite', options: {} },
  // Скриншоты кейсов лежат в public/cases — истории карточек используют те же файлы, что и сайт.
  staticDirs: [{ from: '../public/cases', to: '/cases' }],
  core: { disableTelemetry: true },
  // Vite по умолчанию копирует весь public/, включая резюме, — витрине нужны только скриншоты.
  viteFinal: (viteConfig) => ({ ...viteConfig, publicDir: false }),
};

export default config;
