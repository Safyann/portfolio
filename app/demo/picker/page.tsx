import type { Metadata } from 'next';
import { Suspense } from 'react';

import { ApartmentPicker, ApartmentPickerFallback } from '@/features/apartment-picker';
import { DemoPage } from '@/widgets/demo-page';

export const metadata: Metadata = {
  title: 'Демо: подбор квартир',
  description: 'Параметрический подбор квартир на вымышленных данных: фильтры, сортировка, состояние в URL.',
  alternates: { canonical: '/demo/picker/' },
};

export default function PickerDemoPage() {
  return (
    <DemoPage
      title="Подбор квартир — живое демо"
      lead="Своя реализация задачи, которую я решала на сайте Sminex. Данные вымышленные. Фильтры сохраняются в адресе страницы — подборку можно отправить ссылкой."
      sourcePath="src/features/apartment-picker"
    >
      <Suspense fallback={<ApartmentPickerFallback />}>
        <ApartmentPicker />
      </Suspense>
    </DemoPage>
  );
}
