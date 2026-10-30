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
  // Поля со значением null на сайте не показываются.
  // Путь от корня: относительный 'resume.pdf' на страницах кейсов указывал бы на /cases/<slug>/resume.pdf.
  // Файл — public/resume.pdf; пока его нет, кнопки «Резюме (PDF)» ведут на 404.
  resumeUrl: '/resume.pdf' as string | null,
  email: 'alena_safyanniko@mail.ru' as string | null,
  hhUrl: 'https://ekaterinburg.hh.ru/resume/99c0ccd7ff024c040c0039ed1f706f48774575' as string | null,
  sourceUrl: 'https://github.com/Safyann/portfolio',
  // Витрина компонентов собирается рядом с сайтом в out/storybook — это не маршрут Next.js.
  storybookPath: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/storybook/`,
  // Пулл-реквесты студентов HTML Academy, где Алена была наставником-ревьюером.
  mentoringUrl:
    'https://github.com/search?q=involves%3ASafyann+is%3Apr+org%3Ahtmlacademy-htmlcss+org%3Ahtmlacademy-adaptive+org%3Ahtmlacademy-javascript+org%3Ahtmlacademy-univer-javascript-1&type=pullrequests',
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
