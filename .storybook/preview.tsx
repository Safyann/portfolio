import '@fontsource/golos-text/400.css';
import '@fontsource/golos-text/500.css';
import type { Decorator, Preview } from '@storybook/nextjs-vite';

import '../src/shared/styles/global.scss';

type Theme = 'light' | 'dark';

// На сайте шрифт подключает next/font и кладёт имя в --font-golos; здесь то же семейство из @fontsource.
// Тему переключаем атрибутом data-theme — те же токены, что у сайта в prefers-color-scheme.
const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme ?? 'light') as Theme;

  // Синхронно, до рендера истории: так тема применяется без мигания, а повторная установка ничего не стоит.
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.setProperty('--font-golos', "'Golos Text'");

  return <Story />;
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Тема',
      toolbar: {
        title: 'Тема',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Светлая' },
          { value: 'dark', title: 'Тёмная' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    a11y: { test: 'error' },
    nextjs: { appDirectory: true },
  },
  tags: ['autodocs'],
};

export default preview;
