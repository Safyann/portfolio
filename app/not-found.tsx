import { ButtonLink, Section } from '@/shared/ui';

export default function NotFound() {
  return (
    <Section id="not-found" eyebrow="404" title="Такой страницы нет" lead="Возможно, ссылка устарела.">
      <ButtonLink href="/" variant="primary">
        На главную
      </ButtonLink>
    </Section>
  );
}
