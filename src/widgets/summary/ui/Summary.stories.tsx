import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Summary } from './Summary';

const meta = {
  title: 'Widgets/Summary',
  component: Summary,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Summary>;

export default meta;

type Story = StoryObj<typeof meta>;

// Блок «Коротко»: факты из конфига сайта и статус поиска работы.
export const Default: Story = {};
