import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CASES, getCaseBySlug } from '@/entities/case';
import { SITE } from '@/shared/config';
import { ButtonLink, ChipList, Container } from '@/shared/ui';

import styles from './page.module.scss';

type CasePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return CASES.map((caseStudy) => ({ slug: caseStudy.slug }));
}

export async function generateMetadata({ params }: CasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseBySlug(slug);

  if (!caseStudy) {
    return {};
  }

  return {
    title: `${caseStudy.client}: ${caseStudy.title}`,
    description: caseStudy.summary,
    alternates: { canonical: `/cases/${caseStudy.slug}/` },
    openGraph: {
      url: `/cases/${caseStudy.slug}/`,
      title: `${caseStudy.client}: ${caseStudy.title} — ${SITE.name}`,
      description: caseStudy.summary,
    },
  };
}

export default async function CasePage({ params }: CasePageProps) {
  const { slug } = await params;
  const caseStudy = getCaseBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  const caseIndex = CASES.indexOf(caseStudy);
  const nextCase = CASES[(caseIndex + 1) % CASES.length];

  return (
    <article className={styles.page}>
      <Container>
        <Link href="/cases/" className={styles.back}>
          ← Все кейсы
        </Link>
        <p className={styles.meta}>
          {caseStudy.client} · {caseStudy.industry}
        </p>
        <h1 className={styles.title}>{caseStudy.title}</h1>
        <p className={styles.summary}>{caseStudy.summary}</p>

        <div className={styles.layout}>
          <div>
            <section className={styles.block} aria-labelledby="task-title">
              <h2 id="task-title" className={styles.heading}>
                Задача
              </h2>
              <p>{caseStudy.task}</p>
            </section>
            <section className={styles.block} aria-labelledby="contribution-title">
              <h2 id="contribution-title" className={styles.heading}>
                Что я сделала
              </h2>
              <ul className={styles.contributions}>
                {caseStudy.contributions.map((contribution) => (
                  <li key={contribution}>{contribution}</li>
                ))}
              </ul>
            </section>
            {caseStudy.url ? (
              <ButtonLink href={caseStudy.url} variant="primary" external>
                Открыть сайт ↗
              </ButtonLink>
            ) : null}
          </div>

          <aside className={styles.aside} aria-label="Факты о проекте">
            {caseStudy.metric ? (
              <div>
                <p className={styles.metricValue}>{caseStudy.metric.value}</p>
                <p className={styles.note}>{caseStudy.metric.label}</p>
              </div>
            ) : null}
            <dl className={styles.facts}>
              <div>
                <dt>Период</dt>
                <dd>{caseStudy.period}</dd>
              </div>
              <div>
                <dt>Компания</dt>
                <dd>{caseStudy.employer}</dd>
              </div>
              {caseStudy.team ? (
                <div>
                  <dt>Команда</dt>
                  <dd>{caseStudy.team}</dd>
                </div>
              ) : null}
              <div>
                <dt>Стек</dt>
                <dd>
                  <ChipList items={caseStudy.stack} />
                </dd>
              </div>
            </dl>
            {caseStudy.visualsNote ? <p className={styles.note}>{caseStudy.visualsNote}</p> : null}
          </aside>
        </div>

        {nextCase && nextCase.slug !== caseStudy.slug ? (
          <nav className={styles.next} aria-label="Следующий кейс">
            <p className={styles.note}>Следующий кейс</p>
            <Link href={`/cases/${nextCase.slug}/`} className={styles.nextLink}>
              {nextCase.client}: {nextCase.title} →
            </Link>
          </nav>
        ) : null}
      </Container>
    </article>
  );
}
