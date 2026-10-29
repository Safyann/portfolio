import { SIDE_PROJECTS } from '@/entities/case';
import { ChipList, Section } from '@/shared/ui';

import styles from './SideProjects.module.scss';

// Список строк, а не сетка карточек: композиция отличается от кейсов выше.
export function SideProjects() {
  return (
    <Section
      id="projects"
      title="Другие проекты"
      tone="surface"
      lead="Проекты, в которых я работала в составе команды."
    >
      <ul className={styles.list}>
        {SIDE_PROJECTS.map((project) => (
          <li key={project.name} className={`${styles.row} reveal`} suppressHydrationWarning>
            <div>
              <h3 className={styles.name}>{project.name}</h3>
              <p className={styles.meta}>{project.industry}</p>
              <p className={styles.meta}>
                {project.employer} · {project.period}
              </p>
            </div>
            <div className={styles.details}>
              <p>{project.summary}</p>
              <ChipList items={project.stack} />
              {project.url ? (
                <a className={styles.link} href={project.url} target="_blank" rel="noopener noreferrer">
                  Открыть сайт <span aria-hidden="true">↗</span>
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
