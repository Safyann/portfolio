import { SITE } from '@/shared/config';
import { ButtonLink, Section } from '@/shared/ui';

import styles from './Contacts.module.scss';

const CONTACTS = [
  { name: 'Telegram', handle: SITE.telegramHandle, href: SITE.telegramUrl },
  { name: 'GitHub', handle: SITE.githubHandle, href: SITE.githubUrl },
] as const;

export function Contacts() {
  return (
    <Section
      id="contacts"
      title="Контакты"
      lead="Ищу позицию Senior Frontend в продуктовой команде: удалённо по России или офис / гибрид в Екатеринбурге."
    >
      <ul className={styles.list}>
        {CONTACTS.map((contact) => (
          <li key={contact.name} className={`${styles.item} reveal`} suppressHydrationWarning>
            <a className={styles.link} href={contact.href} target="_blank" rel="noopener noreferrer">
              {contact.name}
            </a>
            <p className={styles.label}>{contact.handle}</p>
          </li>
        ))}
      </ul>
      {SITE.resumeUrl ? (
        <ButtonLink href={SITE.resumeUrl} download>
          Скачать резюме
        </ButtonLink>
      ) : null}
    </Section>
  );
}
