import type { ReactNode } from 'react';

import styles from './Container.module.scss';

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return <div className={className ? `${styles.container} ${className}` : styles.container}>{children}</div>;
}
