import Link from 'next/link';

import { NAV_ITEMS, SITE } from '@/shared/config';
import { Container } from '@/shared/ui';

import styles from './Header.module.scss';

// На узком экране оставляем самые важные пункты, чтобы меню не уезжало за край.
const MOBILE_HIDDEN_HREFS = new Set<string>(['/#approach']);

export function Header() {
  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label={`${SITE.name} — на главную`}>
          <span className={styles.logoFull}>{SITE.name}</span>
          <span className={styles.logoShort} aria-hidden="true">
            {SITE.shortName}
          </span>
        </Link>
        <nav aria-label="Основная навигация">
          <ul className={styles.nav}>
            {NAV_ITEMS.map((item) => (
              <li key={item.href} className={MOBILE_HIDDEN_HREFS.has(item.href) ? styles.hideOnMobile : undefined}>
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
