import Link from 'next/link';

import { ChipList, Screenshot } from '@/shared/ui';

import type { CaseStudy } from '../model/types';
import styles from './CaseCard.module.scss';

type CaseCardProps = {
  caseStudy: CaseStudy;
};

export function CaseCard({ caseStudy }: CaseCardProps) {
  const { slug, client, industry, title, summary, stack, metric, image } = caseStudy;
  const href = `/cases/${slug}/`;

  return (
    <article className={`${styles.card} ${image ? styles.withImage : styles.compact} reveal`} suppressHydrationWarning>
      <div className={styles.body}>
        <h3 className={styles.title}>
          <Link href={href} className={styles.link}>
            {title}
          </Link>
        </h3>
        <p className={styles.meta}>
          {client} · {industry}
        </p>
        <p>{summary}</p>
      </div>
      {metric ? (
        <div className={styles.metric}>
          <p className={styles.metricValue}>{metric.value}</p>
          <p className={styles.metricLabel}>{metric.label}</p>
        </div>
      ) : null}
      <div className={styles.stack}>
        <ChipList items={stack.slice(0, 5)} />
      </div>
      {image ? (
        // Дубль ссылки заголовка для мыши; из порядка табуляции и дерева доступности убран.
        <Link href={href} className={styles.media} tabIndex={-1} aria-hidden="true">
          <Screenshot name={image.name} alt="" sizes="(min-width: 960px) 600px, 100vw" />
        </Link>
      ) : null}
    </article>
  );
}
