import { SITE } from '@/shared/config';
import { ButtonLink, Container } from '@/shared/ui';

import styles from './Hero.module.scss';

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <Container>
        <p className={styles.eyebrow}>
          {SITE.role} · {SITE.experienceYears} лет в коммерческой разработке
        </p>
        <h1 id="hero-title" className={styles.title}>
          Делаю быстрые и аккуратные интерфейсы на React, Next.js и Vue
        </h1>
        <p className={styles.lead}>
          Сайт продаж Sminex, личный кабинет Московской биржи, сайт и админ-панель Prinzip. Архитектура фронтенда,
          UI-kit, SSR и code review.
        </p>
        <div className={styles.actions}>
          <ButtonLink href={SITE.telegramUrl} variant="primary" external>
            Написать в Telegram
          </ButtonLink>
          {SITE.resumeUrl ? (
            <ButtonLink href={SITE.resumeUrl} download>
              Скачать резюме
            </ButtonLink>
          ) : null}
          <ButtonLink href="/#cases">Смотреть кейсы</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
