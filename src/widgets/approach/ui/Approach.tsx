import { SITE } from '@/shared/config';
import { Section } from '@/shared/ui';

import styles from './Approach.module.scss';

type Principle = {
  title: string;
  text: string;
  link?: { href: string; label: string };
};

const PRINCIPLES: readonly Principle[] = [
  {
    title: 'Архитектура до кода',
    text: 'Проектировала фронтенд Prinzip с разделением сайта и админ-панели и PWA для Imperial Tobacco целиком. Сначала структура и контракты с бэкендом, потом экраны.',
  },
  {
    title: 'UI-kit и документация',
    text: 'Собирала UI-kit для Мосбиржи, Prinzip и «Мира Инструмента», документировала компоненты в Storybook, покрывала тестами на Jest.',
    link: { href: SITE.storybookPath, label: 'Storybook этого сайта' },
  },
  {
    title: 'Производительность',
    text: 'Оптимизировала запросы и рендеринг на клиенте и в SSR: у Prinzip TTFB ~6 мс, полный ответ ~14 мс. Делала SSR и SEO на Next.js.',
  },
  {
    title: 'Code review и наставничество',
    text: 'Оцениваю и декомпозирую задачи, провожу code review в команде Sminex, где около 10 фронтендов. В 2022–2023 была наставником в HTML Academy: проверила 355 пулл-реквестов 50 студентов на курсах по HTML/CSS и JavaScript.',
    link: { href: SITE.mentoringUrl, label: 'Ревью на GitHub' },
  },
  {
    title: 'Опыт тимлида',
    text: 'В kokoc.tech руководила командой из 12 человек: спринты, найм, онбординг и обучение разработчиков. Сейчас ~80% времени пишу код.',
  },
  {
    title: 'CI/CD и AI-инструменты',
    text: 'Пишу пайплайны на GitLab Runner, деплой через Kubernetes / ArgoCD. В работе использую AI-assisted разработку — Claude Code и Codex.',
  },
];

export function Approach() {
  return (
    <Section id="approach" title="Как я работаю">
      <ul className={styles.grid}>
        {PRINCIPLES.map((principle) => (
          <li key={principle.title} className="reveal" suppressHydrationWarning>
            <h3 className={styles.title}>{principle.title}</h3>
            <p className={styles.text}>{principle.text}</p>
            {principle.link && (
              <a className={styles.link} href={principle.link.href}>
                {principle.link.label} <span aria-hidden="true">→</span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}
