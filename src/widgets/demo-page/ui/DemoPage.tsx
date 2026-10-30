import type { ReactNode } from 'react';

import { SITE } from '@/shared/config';
import { Container } from '@/shared/ui';

import styles from './DemoPage.module.scss';

type DemoPageProps = {
  title: string;
  lead: ReactNode;
  // Путь к коду демо в репозитории, например src/features/trades-table.
  sourcePath: string;
  children: ReactNode;
};

// Общий каркас страниц демо: заголовок, пояснение со ссылкой на исходный код и само демо.
export function DemoPage({ title, lead, sourcePath, children }: DemoPageProps) {
  return (
    <div className={styles.page}>
      <Container>
        <header className={styles.header}>
          <h1 className={`${styles.title} enter`}>{title}</h1>
          <p className={`${styles.lead} enter`}>
            {lead}{' '}
            <a href={`${SITE.sourceUrl}/tree/main/${sourcePath}`} target="_blank" rel="noopener noreferrer">
              Исходный код
            </a>
          </p>
        </header>
        {children}
      </Container>
    </div>
  );
}
