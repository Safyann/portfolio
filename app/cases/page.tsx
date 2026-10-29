import type { Metadata } from 'next';

import { CaseList, CASES } from '@/entities/case';
import { Section } from '@/shared/ui';

export const metadata: Metadata = {
  title: 'Кейсы',
  description: 'Все кейсы: девелопмент, финтех, госсектор, e-commerce — задача, вклад и стек.',
  alternates: { canonical: '/cases/' },
};

export default function CasesPage() {
  return (
    <Section id="all-cases" title="Все кейсы" headingLevel="h1">
      <CaseList cases={CASES} />
    </Section>
  );
}
