import { SITE } from '@/shared/config';
import { Container } from '@/shared/ui';

import styles from './Footer.module.scss';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <p>
          © {new Date().getFullYear()} {SITE.name}
        </p>
        <p>
          Сайт сделан на Next.js и TypeScript —{' '}
          <a className={styles.link} href={SITE.sourceUrl} target="_blank" rel="noopener noreferrer">
            исходный код
          </a>
        </p>
      </Container>
    </footer>
  );
}
