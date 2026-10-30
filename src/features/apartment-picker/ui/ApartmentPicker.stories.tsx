import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ApartmentPicker, ApartmentPickerFallback } from './ApartmentPicker';

const meta = {
  title: 'Features/ApartmentPicker/ApartmentPicker',
  component: ApartmentPicker,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div style={{ maxWidth: 1120 }}>{Story()}</div>],
} satisfies Meta<typeof ApartmentPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

// Фильтры читаются из URL: здесь query подставляет мок навигации Next.js.
export const FromUrl: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/demo/picker/', query: { rooms: '2,3', price_max: '60' } } },
  },
};

export const NoFilters: Story = {
  parameters: { nextjs: { navigation: { pathname: '/demo/picker/', query: {} } } },
};

// То, что попадает в статический HTML до загрузки JS: подбор с фильтрами по умолчанию.
export const StaticFallback: Story = {
  render: () => <ApartmentPickerFallback />,
};
