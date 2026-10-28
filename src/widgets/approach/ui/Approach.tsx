import { Section } from '@/shared/ui';

import styles from './Approach.module.scss';

const PRINCIPLES = [
  {
    title: 'Архитектура до кода',
    text: 'Проектировала фронтенд Prinzip с разделением сайта и админ-панели и PWA для Imperial Tobacco целиком. Сначала структура и контракты с бэкендом, потом экраны.',
  },
  {
    title: 'UI-kit и документация',
    text: 'Собирала UI-kit для Мосбиржи, Prinzip и «Мира Инструмента», документировала компоненты в Storybook, покрывала тестами на Jest.',
  },
  {
    title: 'Производительность',
    text: 'Оптимизировала запросы и рендеринг на клиенте и в SSR: у Prinzip TTFB ~6 мс, полный ответ ~14 мс. Делала SSR и SEO на Next.js.',
  },
  {
    title: 'Code review и декомпозиция',
    text: 'Оцениваю и декомпозирую задачи, провожу code review — сейчас в команде Sminex, где около 10 фронтендов.',
  },
  {
    title: 'Опыт тимлида',
    text: 'В kokoc.tech руководила командой из 12 человек: спринты, найм, онбординг и обучение разработчиков. Сейчас ~80% времени пишу код.',
  },
  {
    title: 'CI/CD и AI-инструменты',
    text: 'Пишу пайплайны на GitLab Runner, деплой через Kubernetes / ArgoCD. В работе использую AI-assisted разработку — Claude Code и Codex.',
  },
] as const;

export function Approach() {
  return (
    <Section id="approach" eyebrow="Подход" title="Как я работаю">
      <ul className={styles.grid}>
        {PRINCIPLES.map((principle) => (
          <li key={principle.title} className="reveal" suppressHydrationWarning>
            <h3 className={styles.title}>{principle.title}</h3>
            <p className={styles.text}>{principle.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
