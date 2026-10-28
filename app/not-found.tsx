import type { Metadata } from 'next';

import { ButtonLink, Section } from '@/shared/ui';

// noindex Next.js добавляет на 404 сам — здесь только заголовок вкладки.
export const metadata: Metadata = {
  title: 'Страница не найдена',
};

export default function NotFound() {
  return (
    <Section
      id="not-found"
      eyebrow="404"
      title="Такой страницы нет"
      lead="Возможно, ссылка устарела."
      headingLevel="h1"
    >
      <ButtonLink href="/" variant="primary">
        На главную
      </ButtonLink>
    </Section>
  );
}
