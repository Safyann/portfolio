import type { Metadata } from 'next';

import { CaseCard, CASES } from '@/entities/case';
import { Section } from '@/shared/ui';

export const metadata: Metadata = {
  title: 'Кейсы',
  description: 'Все кейсы: девелопмент, финтех, госсектор, e-commerce — задача, вклад и стек.',
  alternates: { canonical: '/cases/' },
};

export default function CasesPage() {
  return (
    <Section id="all-cases" eyebrow="Кейсы" title="Все кейсы" headingLevel="h1">
      <div>
        {CASES.map((caseStudy) => (
          <CaseCard key={caseStudy.slug} caseStudy={caseStudy} />
        ))}
      </div>
    </Section>
  );
}
