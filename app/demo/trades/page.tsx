import type { Metadata } from 'next';

import { TradesTable } from '@/features/trades-table';
import { DemoPage } from '@/widgets/demo-page';

export const metadata: Metadata = {
  title: 'Демо: таблица сделок',
  description:
    'Таблица на 50 000 сделок с виртуализацией строк: сортировка, фильтры, поиск и поток новых сделок на вымышленных данных.',
  alternates: { canonical: '/demo/trades/' },
};

export default function TradesDemoPage() {
  return (
    <DemoPage
      title="Таблица сделок — живое демо"
      lead="Своя реализация задачи, похожей на таблицы торговых данных в кабинете Мосбиржи. 50 000 вымышленных сделок: в DOM только видимые строки, поэтому сортировка, поиск и поток новых сделок работают без задержек. Виртуализация написана без библиотек."
      sourcePath="src/features/trades-table"
    >
      <TradesTable />
    </DemoPage>
  );
}
