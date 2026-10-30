import { SITE } from '@/shared/config';
import { ButtonLink, Section } from '@/shared/ui';

import styles from './Contacts.module.scss';

type ContactItem = {
  name: string;
  handle: string;
  href: string;
  external: boolean;
};

// Email и hh.ru появляются, как только заполнены в конфиге: часть рекрутеров пишет только на почту
// или смотрит резюме на hh.
function getContacts(): ContactItem[] {
  const contacts: ContactItem[] = [
    { name: 'Telegram', handle: SITE.telegramHandle, href: SITE.telegramUrl, external: true },
  ];

  if (SITE.email) {
    contacts.push({ name: 'Email', handle: SITE.email, href: `mailto:${SITE.email}`, external: false });
  }

  if (SITE.hhUrl) {
    contacts.push({ name: 'hh.ru', handle: 'Резюме на hh.ru', href: SITE.hhUrl, external: true });
  }

  contacts.push({ name: 'GitHub', handle: SITE.githubHandle, href: SITE.githubUrl, external: true });

  return contacts;
}

export function Contacts() {
  return (
    <Section
      id="contacts"
      title="Контакты"
      lead={`Ищу позицию ${SITE.role} в продуктовой команде. ${SITE.workFormat}.`}
    >
      <ul className={styles.list}>
        {getContacts().map((contact) => (
          <li key={contact.name} className={`${styles.item} reveal`} suppressHydrationWarning>
            <a
              className={styles.link}
              href={contact.href}
              target={contact.external ? '_blank' : undefined}
              rel={contact.external ? 'noopener noreferrer' : undefined}
            >
              {contact.name}
            </a>
            <p className={styles.label}>{contact.handle}</p>
          </li>
        ))}
      </ul>
      {SITE.resumeUrl ? (
        <ButtonLink href={SITE.resumeUrl} download>
          Скачать резюме (PDF)
        </ButtonLink>
      ) : null}
    </Section>
  );
}
