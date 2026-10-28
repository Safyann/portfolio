import Link from 'next/link';

import { ChipList } from '@/shared/ui';

import type { CaseStudy } from '../model/types';
import styles from './CaseCard.module.scss';

type CaseCardProps = {
  caseStudy: CaseStudy;
};

export function CaseCard({ caseStudy }: CaseCardProps) {
  const { slug, client, industry, title, summary, stack, metric } = caseStudy;

  return (
    <article className={`${styles.card} reveal`} suppressHydrationWarning>
      <div>
        <p className={styles.meta}>
          {client} · {industry}
        </p>
        <h3 className={styles.title}>
          <Link href={`/cases/${slug}/`} className={styles.link}>
            {title}
          </Link>
        </h3>
        <p className={styles.summary}>{summary}</p>
        <ChipList items={stack.slice(0, 5)} />
      </div>
      {metric ? (
        <div className={styles.metric}>
          <p className={styles.metricValue}>{metric.value}</p>
          <p className={styles.metricLabel}>{metric.label}</p>
        </div>
      ) : null}
    </article>
  );
}
