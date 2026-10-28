import { CaseCard, CASES, getFeaturedCases } from '@/entities/case';
import { ButtonLink, Section } from '@/shared/ui';

import styles from './CasesList.module.scss';

export function FeaturedCases() {
  const featuredCases = getFeaturedCases();
  const restCount = CASES.length - featuredCases.length;

  return (
    <Section
      id="cases"
      eyebrow="Кейсы"
      title="Что я сделала"
      lead="Девелопмент, финтех, госсектор и e-commerce. У каждого кейса — задача, мой вклад и стек."
    >
      <div>
        {featuredCases.map((caseStudy) => (
          <CaseCard key={caseStudy.slug} caseStudy={caseStudy} />
        ))}
      </div>
      {restCount > 0 ? (
        <div className={styles.more}>
          <ButtonLink href="/cases/">Все кейсы ({CASES.length})</ButtonLink>
        </div>
      ) : null}
    </Section>
  );
}
