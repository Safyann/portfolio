import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Section } from './Section';

const meta = {
  title: 'Shared/Section',
  component: Section,
  parameters: { layout: 'fullscreen' },
  args: {
    id: 'example',
    title: 'Как я работаю',
    lead: 'Секции разделяются отступом и ступенью фона, без линий.',
    children: <p>Содержимое секции.</p>,
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['default', 'surface'] },
    headingLevel: { control: 'inline-radio', options: ['h1', 'h2'] },
  },
} satisfies Meta<typeof Section>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Surface: Story = {
  args: { tone: 'surface', title: 'Другие проекты' },
};

// h1 — когда секция и есть вся страница, как на /cases/ и 404.
export const PageHeading: Story = {
  args: { headingLevel: 'h1', title: 'Все кейсы', lead: undefined },
};
