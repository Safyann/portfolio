export const SITE = {
  name: 'Алёна Сафьянникова',
  shortName: 'Алёна С.',
  url: 'https://safyann.ru',
  role: 'Senior Frontend',
  experienceYears: 8,
  title: 'Алёна Сафьянникова — Senior Frontend (React, Next.js, Vue, TypeScript)',
  description:
    // До ~160 символов — дальше поисковики обрезают сниппет.
    'Senior Frontend, 8 лет. React / Next.js и Vue / Nuxt на TypeScript. Сайт продаж Sminex, кабинет Московской биржи, сайт и админка Prinzip.',
  telegramUrl: 'https://t.me/safyann',
  telegramHandle: '@safyann',
  githubUrl: 'https://github.com/Safyann',
  githubHandle: 'Safyann',
  // TODO(safyann): положить PDF резюме в public/ и указать путь — до этого кнопка «Скачать резюме» скрыта.
  resumeUrl: null as string | null,
  sourceUrl: 'https://github.com/Safyann/portfolio',
} as const;

// Общие поля Open Graph. Next.js не сливает openGraph страницы с openGraph layout,
// а заменяет целиком, — поэтому страницы с собственным openGraph подмешивают эту базу.
export const OG_IMAGE = {
  url: '/og.png',
  width: 1200,
  height: 630,
  alt: SITE.title,
  type: 'image/png',
} as const;

export const OPEN_GRAPH_BASE = {
  type: 'website' as const,
  locale: 'ru_RU',
  siteName: SITE.name,
  // Копия, а не сам OG_IMAGE: тип Next.js ждёт изменяемый массив, а as const делает его readonly.
  images: [{ ...OG_IMAGE }],
};

export const NAV_ITEMS = [
  { href: '/#cases', label: 'Кейсы' },
  { href: '/demo/picker/', label: 'Демо' },
  { href: '/#approach', label: 'Подход' },
  { href: '/#contacts', label: 'Контакты' },
] as const;
