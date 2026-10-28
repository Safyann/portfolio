import type { SideProject } from '../model/types';

export const SIDE_PROJECTS: readonly SideProject[] = [
  {
    name: 'Adamas',
    industry: 'Интернет-магазин ювелирных украшений',
    employer: 'The Head',
    period: '2024 — 2025',
    stack: ['React', 'Redux Toolkit', 'webpack', 'Cypress'],
    summary:
      'Рефакторинг главной, навигации и личного кабинета, адаптивные фильтры каталога, страница поиска, подарочные карты и ввод гравировки.',
    url: 'https://adamas.ru/',
  },
  {
    name: 'Drive Fitness',
    industry: 'Сеть фитнес-клубов',
    employer: 'kokoc.tech',
    period: '2021 — 2023',
    stack: ['Next.js', 'TypeScript', 'SWR', 'FSD'],
    summary:
      'Компоненты UI-kit, hero-баннер, фильтр вакансий, расписание, страницы клубных карт и промо, выбор клуба с геолокацией.',
    url: 'https://drivefitness.ru/',
  },
  {
    name: 'Workki',
    industry: 'Сеть коворкингов: личный кабинет и сайт',
    employer: 'The Head',
    period: '2024 — 2026',
    stack: ['React', 'Redux', 'Next.js'],
    summary:
      'Бронирование рабочих мест и переговорных, интерактивные планы этажей, дашборд и профиль, пропуска, согласие на обработку ПД.',
  },
  {
    name: 'DSM',
    industry: 'Сервис заявок на мероприятия и лекторов',
    employer: 'The Head',
    period: '2024 — 2026',
    stack: ['React', 'TypeScript', 'Vite', 'MobX', 'Zustand', 'Vitest'],
    summary:
      'UI-kit, мастер создания заявки с валидацией, клиенты и справочник, права на документы, расчёт НДФЛ лектора.',
  },
  {
    name: 'Novex',
    industry: 'Интернет-магазин',
    employer: 'The Head',
    period: '2025 — 2026',
    stack: ['Nuxt', 'Vue'],
    summary: 'Авторизация через SDK, капча, календарь в корзине, JSON-схема товара.',
  },
  {
    name: 'China Campus',
    industry: 'Школа китайского языка',
    employer: 'kokoc.tech',
    period: '2023',
    stack: ['October CMS', 'HTML', 'CSS'],
    summary: 'Вёрстка темы: hero-блоки, тарифы, преподаватели, адаптив.',
  },
];
