import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';

import { TradesTable } from './TradesTable';

const meta = {
  title: 'Features/TradesTable',
  component: TradesTable,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div style={{ maxWidth: 1120 }}>{Story()}</div>],
} satisfies Meta<typeof TradesTable>;

export default meta;

type Story = StoryObj<typeof meta>;

// 50 000 строк, в DOM — только видимые.
export const Default: Story = {};

export const Small: Story = {
  args: { initialCount: 12 },
};

// Интерактивный тест: поиск сужает выдачу, клик по заголовку меняет сортировку.
export const SearchAndSort: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // fireEvent, а не userEvent.type: в сборке Storybook ввод через user-event не доходит до onChange React.
    fireEvent.change(canvas.getByLabelText('Тикер или эмитент'), { target: { value: 'Телемост' } });
    // Таблица догоняет поле поиска через useDeferredValue — ждём, а не проверяем сразу.
    await waitFor(() => expect(canvas.getByText(/^Сделок:/)).not.toHaveTextContent('Сделок: 50 000'));

    const priceHeader = canvas.getByRole('columnheader', { name: /Цена/ });
    await userEvent.click(within(priceHeader).getByRole('button'));
    await expect(priceHeader).toHaveAttribute('aria-sort', 'descending');

    const rows = canvas.getAllByRole('row');
    await expect(rows.length).toBeLessThan(60);
  },
};
