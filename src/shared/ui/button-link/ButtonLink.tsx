import Link from 'next/link';
import type { ReactNode } from 'react';

import styles from './ButtonLink.module.scss';

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  external?: boolean;
  download?: boolean;
};

export function ButtonLink({ href, children, variant = 'secondary', external, download }: ButtonLinkProps) {
  const className = `${styles.button} ${styles[variant]}`;

  if (external || download) {
    return (
      <a
        className={className}
        href={href}
        download={download}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}
