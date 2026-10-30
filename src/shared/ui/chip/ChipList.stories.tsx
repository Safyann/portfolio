import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ChipList } from './ChipList';

const meta = {
  title: 'Shared/ChipList',
  component: ChipList,
  args: {
    items: ['Next.js', 'React', 'TypeScript', 'GraphQL'],
    label: 'Стек',
  },
} satisfies Meta<typeof ChipList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Длинный список переносится, высота чипов не меняется.
export const Wrapping: Story = {
  args: {
    items: [
      'Next.js 14',
      'React',
      'TypeScript',
      'Apollo Client',
      'GraphQL',
      'Zustand',
      'Lexical',
      'dnd-kit',
      'CSS Modules',
    ],
  },
  decorators: [(Story) => <div style={{ maxWidth: 320 }}>{Story()}</div>],
};
