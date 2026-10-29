import type { ReactNode } from 'react';

import { Container } from '../container/Container';
import styles from './Section.module.scss';

type SectionProps = {
  id: string;
  title: string;
  children: ReactNode;
  lead?: string;
  // h1 — когда секция и есть вся страница (список кейсов, 404); на главной h1 занят первым экраном.
  headingLevel?: 'h1' | 'h2';
  // Секции разделяются отступом, а не линией; surface — ступень фона для смены ритма.
  tone?: 'default' | 'surface';
};

export function Section({ id, title, children, lead, headingLevel = 'h2', tone = 'default' }: SectionProps) {
  const headingId = `${id}-title`;
  const Heading = headingLevel;

  return (
    <section
      id={id}
      className={tone === 'surface' ? `${styles.section} ${styles.surface}` : styles.section}
      aria-labelledby={headingId}
    >
      <Container>
        <header className={`${styles.header} reveal`} suppressHydrationWarning>
          <Heading id={headingId} className={styles.title}>
            {title}
          </Heading>
          {lead ? <p className={styles.lead}>{lead}</p> : null}
        </header>
        {children}
      </Container>
    </section>
  );
}
