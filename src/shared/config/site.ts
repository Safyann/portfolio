export const SITE = {
  name: 'Алена Сафьянникова',
  shortName: 'Алена С.',
  url: 'https://safyann.ru',
  role: 'Senior Frontend',
  experienceYears: 8,
  city: 'Екатеринбург',
  workFormat: 'Удалённо по России или офис / гибрид в Екатеринбурге',
  title: 'Алена Сафьянникова — Senior Frontend-разработчик, Екатеринбург (React, Next.js, Vue)',
  description:
    // До ~160 символов — дальше поисковики обрезают сниппет.
    'Senior Frontend, 8 лет, Екатеринбург или удалённо. React / Next.js и Vue / Nuxt на TypeScript: сайт продаж Sminex, кабинет Мосбиржи, Prinzip.',
  telegramUrl: 'https://t.me/safyann',
  telegramHandle: '@safyann',
  githubUrl: 'https://github.com/Safyann',
  githubHandle: 'Safyann',
  // Поля со значением null на сайте не показываются — заполнить, когда будут данные.
  // TODO(safyann): положить PDF резюме в public/ (например, /resume.pdf) — появятся кнопки в шапке и на первом экране.
  resumeUrl: null as string | null,
  // Предпочитаемый способ связи по резюме на hh.
  email: 'alena_safyanniko@mail.ru' as string | null,
  // TODO(safyann): публичная ссылка на резюме на hh.ru.
  hhUrl: null as string | null,
  sourceUrl: 'https://github.com/Safyann/portfolio',
} as const;

// Статус поиска работы. updatedAt — дата последней проверки статуса, показывается рядом с ним.
export const AVAILABILITY = {
  isOpen: true,
  updatedAt: '2026-10-30',
  // TODO(safyann): когда готова выйти — например, «через 2 недели после оффера»; null — строка скрыта.
  startDate: null as string | null,
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
