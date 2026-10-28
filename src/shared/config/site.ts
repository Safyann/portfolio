export const SITE = {
  name: 'Алёна Сафьянникова',
  shortName: 'Алёна С.',
  url: 'https://safyann.ru',
  role: 'Senior Frontend',
  experienceYears: 8,
  title: 'Алёна Сафьянникова — Senior Frontend (React, Next.js, Vue, TypeScript)',
  description:
    'Senior Frontend-разработчик, 8 лет в коммерческой разработке. React / Next.js и Vue / Nuxt на TypeScript. Сайт продаж Sminex, личный кабинет Московской биржи, сайт и админ-панель Prinzip.',
  telegramUrl: 'https://t.me/safyann',
  telegramHandle: '@safyann',
  githubUrl: 'https://github.com/Safyann',
  githubHandle: 'Safyann',
  // TODO(safyann): положить PDF резюме в public/ и указать путь — до этого кнопка «Скачать резюме» скрыта.
  resumeUrl: null as string | null,
  sourceUrl: 'https://github.com/Safyann/portfolio',
} as const;

export const NAV_ITEMS = [
  { href: '/#cases', label: 'Кейсы' },
  { href: '/demo/picker/', label: 'Демо' },
  { href: '/#approach', label: 'Подход' },
  { href: '/#contacts', label: 'Контакты' },
] as const;
