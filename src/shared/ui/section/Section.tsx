import type { ReactNode } from 'react';

import { Container } from '../container/Container';
import styles from './Section.module.scss';

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  lead?: string;
};

export function Section({ id, eyebrow, title, children, lead }: SectionProps) {
  const headingId = `${id}-title`;

  return (
    <section id={id} className={styles.section} aria-labelledby={headingId}>
      <Container>
        <header className={`${styles.header} reveal`}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 id={headingId} className={styles.title}>
            {title}
          </h2>
          {lead ? <p className={styles.lead}>{lead}</p> : null}
        </header>
        {children}
      </Container>
    </section>
  );
}
