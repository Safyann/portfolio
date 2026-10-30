import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { getCaseBySlug } from '../lib/cases';
import type { CaseStudy } from '../model/types';
import { CaseCard } from './CaseCard';
import { CaseList } from './CaseList';

// Истории берут настоящие кейсы с сайта: так карточка проверяется на реальной длине текстов.
function caseBySlug(slug: string): CaseStudy {
  const caseStudy = getCaseBySlug(slug);

  if (!caseStudy) {
    throw new Error(`Нет кейса ${slug}`);
  }

  return caseStudy;
}

const meta = {
  title: 'Entities/CaseCard',
  component: CaseCard,
  parameters: { layout: 'padded' },
  args: { caseStudy: caseBySlug('sminex') },
  decorators: [(Story) => <div style={{ maxWidth: 1120 }}>{Story()}</div>],
} satisfies Meta<typeof CaseCard>;

export default meta;

type Story = StoryObj<typeof meta>;

// Со скриншотом: во всю ширину, текст и цифра слева, картинка справа.
export const WithImage: Story = {};

// Без скриншота: компактная карточка на подложке, на главной стоит по две в ряд.
export const Compact: Story = {
  args: { caseStudy: caseBySlug('moex') },
  decorators: [(Story) => <div style={{ maxWidth: 540 }}>{Story()}</div>],
};

export const WithoutMetric: Story = {
  args: { caseStudy: caseBySlug('sminex-admin') },
  decorators: [(Story) => <div style={{ maxWidth: 540 }}>{Story()}</div>],
};

// Сетка: широкая карточка, пара компактных, снова широкая.
export const List: Story = {
  render: () => <CaseList cases={['sminex', 'sminex-admin', 'moex', 'prinzip'].map(caseBySlug)} />,
};
