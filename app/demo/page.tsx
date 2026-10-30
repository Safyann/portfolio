import type { Metadata } from 'next';
import Link from 'next/link';

import { Section } from '@/shared/ui';

import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Демо',
  description: 'Живые демо на вымышленных данных: подбор квартир и таблица сделок с виртуализацией.',
  alternates: { canonical: '/demo/' },
};

const DEMOS = [
  {
    href: '/demo/picker/',
    title: 'Подбор квартир',
    text: 'Фильтры по комнатам, цене, площади и этажу, сортировка, состояние в URL. Как выборщик на сайте Sminex.',
  },
  {
    href: '/demo/trades/',
    title: 'Таблица сделок',
    text: '50 000 строк с виртуализацией, сортировка, поиск и поток новых сделок. Как таблицы в кабинете Мосбиржи.',
  },
] as const;

export default function DemoIndexPage() {
  return (
    <Section
      id="demo"
      title="Демо"
      lead="Свои реализации задач из коммерческих проектов. Код открыт, данные вымышленные."
      headingLevel="h1"
    >
      <ul className={styles.list}>
        {DEMOS.map((demo) => (
          <li key={demo.href} className={`${styles.item} reveal`} suppressHydrationWarning>
            <h2 className={styles.title}>
              <Link href={demo.href} className={styles.link}>
                {demo.title} →
              </Link>
            </h2>
            <p>{demo.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
