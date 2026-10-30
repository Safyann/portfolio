import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';

import { PageBuilder } from './PageBuilder';

const meta = {
  title: 'Features/PageBuilder',
  component: PageBuilder,
  parameters: { layout: 'padded' },
  args: { persist: false },
  decorators: [(Story) => <div style={{ maxWidth: 1180 }}>{Story()}</div>],
} satisfies Meta<typeof PageBuilder>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Интерактивный тест: добавить блок, отредактировать его и поднять кнопкой «↑».
export const AddEditMove: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: /\+ Текст/ }));
    await expect(await canvas.findByRole('heading', { name: /Страница · 5 блоков/ })).toBeInTheDocument();

    // Состояние обновляется асинхронно — поэтому findBy и waitFor, а не getBy сразу после события.
    const textField = await canvas.findByRole('textbox', { name: 'Текст' });
    // fireEvent, а не userEvent.type: в сборке Storybook ввод через user-event не доходит до onChange React.
    fireEvent.change(textField, { target: { value: 'Новый абзац' } });
    await expect(textField).toHaveValue('Новый абзац');
    await expect(await canvas.findByText('Новый абзац', { selector: 'p' })).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Поднять блок 5 «Текст»' }));
    await waitFor(() =>
      expect(canvas.getByRole('button', { name: 'Переместить блок «Кнопка», позиция 5 из 5' })).toBeInTheDocument()
    );
  },
};
