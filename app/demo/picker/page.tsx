import type { Metadata } from 'next';
import { Suspense } from 'react';

import { ApartmentPicker, ApartmentPickerFallback } from '@/features/apartment-picker';
import { SITE } from '@/shared/config';
import { Container } from '@/shared/ui';

import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Демо: подбор квартир',
  description: 'Параметрический подбор квартир на вымышленных данных: фильтры, сортировка, состояние в URL.',
  alternates: { canonical: '/demo/picker/' },
};

export default function PickerDemoPage() {
  return (
    <div className={styles.page}>
      <Container>
        <header className={styles.header}>
          <p className={`${styles.eyebrow} enter`}>Живое демо</p>
          <h1 className={`${styles.title} enter`}>Подбор квартир по параметрам</h1>
          <p className={`${styles.lead} enter`}>
            Своя реализация задачи, которую я решала на сайте Sminex. Данные вымышленные. Фильтры сохраняются в адресе
            страницы — подборку можно отправить ссылкой.{' '}
            <a
              href={`${SITE.sourceUrl}/tree/main/src/features/apartment-picker`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Исходный код
            </a>
          </p>
        </header>
        <Suspense fallback={<ApartmentPickerFallback />}>
          <ApartmentPicker />
        </Suspense>
      </Container>
    </div>
  );
}
