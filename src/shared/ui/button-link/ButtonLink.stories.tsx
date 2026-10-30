import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ButtonLink } from './ButtonLink';

const meta = {
  title: 'Shared/ButtonLink',
  component: ButtonLink,
  args: {
    href: '/#cases',
    children: 'Смотреть кейсы',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary'] },
  },
} satisfies Meta<typeof ButtonLink>;

export default meta;

type Story = StoryObj<typeof meta>;

// Единственное основное действие на экране — заливка акцентом.
export const Primary: Story = {
  args: { variant: 'primary', children: 'Написать в Telegram', href: 'https://t.me/safyann', external: true },
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Download: Story = {
  args: { href: '/resume.pdf', download: true, children: 'Скачать резюме (PDF)' },
};
