import { ChipList, Section } from '@/shared/ui';

import styles from './TechStack.module.scss';

const STACK_GROUPS = [
  { label: 'Языки', items: ['TypeScript', 'JavaScript (ES2022+)'] },
  { label: 'React', items: ['React', 'Next.js', 'Redux Toolkit', 'React Query', 'MobX', 'Zustand'] },
  { label: 'Vue', items: ['Vue 3', 'Nuxt', 'Vuex'] },
  { label: 'Данные и API', items: ['GraphQL (Apollo)', 'REST / Swagger'] },
  { label: 'Рендеринг', items: ['SSR', 'PWA', 'SEO'] },
  { label: 'UI и стили', items: ['SCSS', 'CSS Modules', 'Storybook', 'UI-kit', 'Адаптивная вёрстка'] },
  { label: 'Качество', items: ['Jest', 'Code review'] },
  { label: 'Инфраструктура', items: ['Webpack', 'Git', 'GitLab CI/CD', 'Kubernetes / ArgoCD'] },
] as const;

export function TechStack() {
  return (
    <Section id="stack" eyebrow="Стек" title="Технологии">
      <div className={styles.groups}>
        {STACK_GROUPS.map((group) => (
          <div key={group.label} className={`${styles.group} reveal`} suppressHydrationWarning>
            <h3 className={styles.label}>{group.label}</h3>
            <ChipList items={group.items} label={group.label} />
          </div>
        ))}
      </div>
    </Section>
  );
}
