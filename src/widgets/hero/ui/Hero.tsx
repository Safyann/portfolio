import { PickerTeaser } from '@/features/apartment-picker';
import { SITE } from '@/shared/config';
import { ButtonLink, Container } from '@/shared/ui';

import styles from './Hero.module.scss';

// Первый экран отвечает «кто и что делает» крупным шрифтом, а справа — то, что можно потрогать:
// подбор квартир, ту же задачу, что на сайте Sminex.
export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <Container>
        <h1 id="hero-title" className={`${styles.title} enter`}>
          {SITE.name}
        </h1>
        <div className={styles.grid}>
          <div className={styles.intro}>
            <p className={`${styles.lead} enter`}>
              {SITE.role}-разработчик, {SITE.experienceYears} лет. React / Next.js и Vue / Nuxt на TypeScript: сайт
              продаж Sminex, кабинет Московской биржи, сайт и админка Prinzip.
            </p>
            <div className={`${styles.actions} enter`}>
              <ButtonLink href={SITE.telegramUrl} variant="primary" external>
                Написать в Telegram
              </ButtonLink>
              {SITE.resumeUrl ? (
                <ButtonLink href={SITE.resumeUrl} download>
                  Скачать резюме (PDF)
                </ButtonLink>
              ) : null}
              <ButtonLink href="/#cases">Смотреть кейсы</ButtonLink>
            </div>
          </div>
          <div className={`${styles.demo} enter`}>
            <PickerTeaser />
          </div>
        </div>
      </Container>
    </section>
  );
}
