import type { Metadata } from 'next';

import { PageBuilder } from '@/features/page-builder';
import { DemoPage } from '@/widgets/demo-page';

export const metadata: Metadata = {
  title: 'Демо: конструктор страниц',
  description:
    'Мини-конструктор страниц: блоки из палитры, перетаскивание мышью и с клавиатуры, редактирование, черновик в браузере.',
  alternates: { canonical: '/demo/builder/' },
};

export default function BuilderDemoPage() {
  return (
    <DemoPage
      title="Конструктор страниц — живое демо"
      lead="Своя упрощённая реализация задачи, которую я решаю в админ-панели Sminex: страница собирается из типизированных блоков, порядок меняется перетаскиванием на dnd-kit — мышью или с клавиатуры. Черновик сохраняется в браузере."
      sourcePath="src/features/page-builder"
    >
      <PageBuilder />
    </DemoPage>
  );
}
