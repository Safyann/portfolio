import { SITE } from '@/shared/config';
import { Container } from '@/shared/ui';

import styles from './Footer.module.scss';

// Подвал — завершение страницы, а не карта сайта: имя крупно и короткая строка ссылок.
export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <p className={styles.name}>{SITE.name}</p>
        <div className={styles.row}>
          <p>
            {SITE.role} · <a href={SITE.telegramUrl}>Telegram {SITE.telegramHandle}</a> ·{' '}
            <a href={SITE.githubUrl}>GitHub</a>
          </p>
          <p>
            © {new Date().getFullYear()} · Сайт на Next.js и TypeScript,{' '}
            <a href={SITE.sourceUrl} target="_blank" rel="noopener noreferrer">
              исходный код
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
