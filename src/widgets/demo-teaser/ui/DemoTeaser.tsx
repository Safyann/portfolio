import { SITE } from '@/shared/config';
import { ButtonLink, Section } from '@/shared/ui';

import styles from './DemoTeaser.module.scss';

export function DemoTeaser() {
  return (
    <Section
      id="demo"
      eyebrow="Живое демо"
      title="Параметрический подбор квартир"
      lead="Та же задача, что я решала на сайте Sminex, — но своя реализация на вымышленных данных. Код открыт."
    >
      <div className={styles.card}>
        <ul className={styles.list}>
          <li>Фильтры по цене, площади, этажу, комнатам, проекту и сроку сдачи</li>
          <li>Состояние фильтров хранится в URL — подборкой можно поделиться</li>
          <li>Работает с клавиатуры, логика фильтрации покрыта тестами на Jest</li>
        </ul>
        <div className={styles.actions}>
          <ButtonLink href="/demo/picker/" variant="primary">
            Открыть демо
          </ButtonLink>
          <ButtonLink href={`${SITE.sourceUrl}/tree/main/src/features/apartment-picker`} external>
            Исходники
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
