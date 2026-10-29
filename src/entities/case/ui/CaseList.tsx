import type { CaseStudy } from '../model/types';
import { CaseCard } from './CaseCard';
import styles from './CaseCard.module.scss';

type CaseListProps = {
  cases: readonly CaseStudy[];
};

export function CaseList({ cases }: CaseListProps) {
  return (
    <div className={styles.list}>
      {cases.map((caseStudy) => (
        <CaseCard key={caseStudy.slug} caseStudy={caseStudy} />
      ))}
    </div>
  );
}
