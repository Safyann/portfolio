import { SIDE_PROJECTS } from '@/entities/case';
import { ChipList, Section } from '@/shared/ui';

import styles from './SideProjects.module.scss';

export function SideProjects() {
  return (
    <Section
      id="projects"
      eyebrow="Ещё проекты"
      title="Другие проекты"
      lead="Проекты, в которых я работала в составе команды."
    >
      <ul className={styles.grid}>
        {SIDE_PROJECTS.map((project) => (
          <li key={project.name} className={`${styles.card} reveal`} suppressHydrationWarning>
            <p className={styles.meta}>
              {project.employer} · {project.period}
            </p>
            <h3 className={styles.name}>{project.name}</h3>
            <p className={styles.industry}>{project.industry}</p>
            <p className={styles.summary}>{project.summary}</p>
            <ChipList items={project.stack} />
            {project.url ? (
              <a className={styles.link} href={project.url} target="_blank" rel="noopener noreferrer">
                Открыть сайт <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}
