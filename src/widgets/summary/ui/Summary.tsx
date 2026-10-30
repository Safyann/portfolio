import { AVAILABILITY, SITE } from '@/shared/config';
import { Section } from '@/shared/ui';

import styles from './Summary.module.scss';

const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

// Всё, что рекрутер проверяет в первые 30 секунд, — одним блоком над кейсами.
// Значение крупно, пояснение под ним: подпись над значением читалась бы как надзаголовок.
export function Summary() {
  const updatedAt = dateFormatter.format(new Date(AVAILABILITY.updatedAt));
  const statusNote = AVAILABILITY.startDate
    ? `Выход: ${AVAILABILITY.startDate}. Обновлено ${updatedAt}`
    : `Обновлено ${updatedAt}`;

  const facts = [
    { value: `${SITE.experienceYears} лет`, note: `В коммерческой фронтенд-разработке, уровень ${SITE.role}` },
    { value: 'React и Vue', note: 'Next.js и Nuxt на TypeScript' },
    { value: '12 человек', note: 'Команда, которую вела тимлидом в kokoc.tech в 2022–2024' },
    { value: SITE.city, note: SITE.workFormat },
  ];

  return (
    <Section id="summary" title="Коротко">
      <ul className={styles.facts}>
        {facts.map((fact) => (
          <li key={fact.value} className={`${styles.fact} reveal`} suppressHydrationWarning>
            <p className={styles.value}>{fact.value}</p>
            <p className={styles.note}>{fact.note}</p>
          </li>
        ))}
        {AVAILABILITY.isOpen ? (
          <li className={`${styles.fact} ${styles.status} reveal`} suppressHydrationWarning>
            <p className={styles.value}>Открыта к предложениям</p>
            <p className={styles.note}>{statusNote}</p>
          </li>
        ) : null}
      </ul>
    </Section>
  );
}
