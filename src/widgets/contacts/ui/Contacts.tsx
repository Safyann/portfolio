import { SITE } from '@/shared/config';
import { ButtonLink, Section } from '@/shared/ui';

import styles from './Contacts.module.scss';

export function Contacts() {
  return (
    <Section
      id="contacts"
      eyebrow="Контакты"
      title="Давайте обсудим вашу задачу"
      lead="Ищу позицию Senior Frontend в продуктовой команде: удалённо по России или офис / гибрид в Екатеринбурге."
    >
      <dl className={styles.list}>
        <div className={`${styles.item} reveal`}>
          <dt className={styles.label}>Telegram</dt>
          <dd>
            <a className={styles.link} href={SITE.telegramUrl} target="_blank" rel="noopener noreferrer">
              {SITE.telegramHandle}
            </a>
          </dd>
        </div>
        <div className={`${styles.item} reveal`}>
          <dt className={styles.label}>GitHub</dt>
          <dd>
            <a className={styles.link} href={SITE.githubUrl} target="_blank" rel="noopener noreferrer">
              {SITE.githubHandle}
            </a>
          </dd>
        </div>
      </dl>
      {SITE.resumeUrl ? (
        <ButtonLink href={SITE.resumeUrl} download>
          Скачать резюме
        </ButtonLink>
      ) : null}
    </Section>
  );
}
