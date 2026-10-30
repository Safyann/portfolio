import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Screenshot } from './Screenshot';

const meta = {
  title: 'Shared/Screenshot',
  component: Screenshot,
  args: {
    name: 'sminex',
    alt: 'Раздел коммерческой недвижимости на сайте Sminex',
    sizes: '(min-width: 960px) 600px, 100vw',
  },
  argTypes: {
    name: { control: 'select', options: ['sminex', 'prinzip', 'atomstroy'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 720 }}>{Story()}</div>],
} satisfies Meta<typeof Screenshot>;

export default meta;

type Story = StoryObj<typeof meta>;

// Кадр 1440×700, два размера в srcset: 720 и 1440 px.
export const Default: Story = {};
