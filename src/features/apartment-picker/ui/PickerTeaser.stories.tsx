import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { PickerTeaser } from './PickerTeaser';

const meta = {
  title: 'Features/ApartmentPicker/PickerTeaser',
  component: PickerTeaser,
  decorators: [(Story) => <div style={{ maxWidth: 520 }}>{Story()}</div>],
} satisfies Meta<typeof PickerTeaser>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Интерактивный тест: выбор комнат сужает выдачу и попадает в ссылку на полный подбор.
export const SelectRooms: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const count = canvas.getByText(/^Найдено:/);
    const totalText = count.textContent;

    // Скрытый текст с числом квартир браузер отделяет пробелом: имя кнопки — «2 , 38 квартир».
    const twoRooms = canvas.getByRole('button', { name: /^2\s?,/ });

    await userEvent.click(twoRooms);

    await expect(twoRooms).toHaveAttribute('aria-pressed', 'true');
    await expect(count.textContent).not.toBe(totalText);
    await expect(canvas.getByRole('link', { name: /Открыть полный подбор/ })).toHaveAttribute(
      'href',
      '/demo/picker/?rooms=2'
    );
  },
};
