# Портфолио — Алена Сафьянникова

[![Deploy](https://github.com/Safyann/portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/Safyann/portfolio/actions/workflows/deploy.yml)
[![Site](https://img.shields.io/website?url=https%3A%2F%2Fsafyann.ru&label=safyann.ru)](https://safyann.ru)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)

Senior Frontend (React / Next.js, Vue / Nuxt, TypeScript). Сайт с кейсами и живыми демо — подбор квартир, таблица на 50 000 сделок с виртуализацией и конструктор страниц — — **[safyann.ru](https://safyann.ru)**, витрина компонентов — **[safyann.ru/storybook](https://safyann.ru/storybook/)**.

## Стек

Next.js 16 (App Router, статический экспорт) · React 19 · TypeScript (strict, `noUncheckedIndexedAccess`) · SCSS Modules · Storybook 10 · Jest · ESLint · Prettier · GitHub Actions → GitHub Pages.

## Архитектура

Код разложен по [Feature-Sliced Design](https://feature-sliced.design/): слой импортирует только нижележащие, наружу слайс отдаёт API через `index.ts`.

```
app/                         маршруты: /, /cases, /cases/[slug], /demo, /demo/picker, /demo/trades, /demo/builder, og.png, sitemap, robots
src/
  shared/                    токены и стили, UI-примитивы, конфиг сайта, инлайн-скрипт появления
  entities/case/             кейсы и проекты: данные, типы, карточка и список
  features/apartment-picker/ подбор квартир: model (типы) · lib (фильтры, URL, форматирование) · ui · test
  features/trades-table/     таблица сделок: генератор, сортировка и фильтры, окно виртуализации · ui · test
  features/page-builder/     конструктор страниц: типы блоков, редьюсер, проверка черновика · ui (dnd-kit) · test
  widgets/                   секции страниц и каркас демо: hero, summary, cases-list, approach, demo-page и др.
```

Решения, которые стоит посмотреть:

- **Состояние фильтров живёт только в URL** (`?rooms=1,2&price_max=60`). Нет дублирования в `useState`, поэтому «назад», обновление страницы и отправленная ссылка показывают одно и то же — `src/features/apartment-picker/lib/use-url-filters.ts`.
- **Фильтрация — чистые функции** без React (`lib/filters.ts`): разбор и сериализация URL, нормализация «от/до», счётчики по комнатам с учётом остальных фильтров. Покрыты тестами.
- **Статический HTML без пустых заглушек.** `useSearchParams` при статическом экспорте работает только в браузере, поэтому fallback у `Suspense` — тот же подбор с фильтрами по умолчанию, а не «Загрузка…».
- **Анимации появления без зависимости от React.** Инлайн-скрипт в `<head>` отмечает блоки по мере прокрутки, в том числе проскоченные быстрой прокруткой или якорем; без JS и при `prefers-reduced-motion` контент виден сразу — `src/shared/lib/reveal-script.ts`.
- **Виртуализация без библиотек** (`src/features/trades-table/lib/virtual-window.ts`): чистая функция считает окно видимых строк и отступы, в DOM ~25 строк из 50 000. Таблица остаётся семантической `<table>` с `aria-rowcount` / `aria-rowindex` и `aria-sort`, поиск не блокирует ввод благодаря `useDeferredValue`, сортировка по времени не вызывает `sort()` — массив уже упорядочен.
- **Начальная выгрузка и поток сделок — один детерминированный генератор**: статический HTML и клиент совпадают, поток продолжает те же цены и время. 50 000 строк создаются в клиентском модуле и не попадают в RSC-payload — HTML страницы весит ~30 КБ.
- **Конструктор страниц на размеченном объединении** (`src/features/page-builder`): тип блока задаёт форму его данных, все изменения — чистый редьюсер, черновик из `localStorage` проверяется по схеме перед восстановлением. Порядок блоков меняется на dnd-kit мышью, пальцем или с клавиатуры, с объявлениями для экранного диктора на русском; кнопки ↑ ↓ — запасной путь.
- **OG-картинка генерируется при сборке** (`app/og.png/route.tsx`, `next/og`) с локальными шрифтами — без сетевых запросов и с правильным `content-type`.
- **Дизайн-токены**: пять размеров шрифта, цвета и отступы — CSS-переменные в `src/shared/styles/global.scss`, светлая и тёмная тема по `prefers-color-scheme` или атрибуту `data-theme`.
- **Storybook рядом с компонентами** (`*.stories.tsx`): примитивы, карточки кейсов на реальных данных, подбор с фильтрами из мока URL, play-тест мини-подбора; addon-a11y падает на нарушениях доступности, тема переключается в тулбаре. Собирается в `out/storybook` и публикуется вместе с сайтом.

## Качество

```bash
npm run lint        # ESLint: next/core-web-vitals + typescript, eqeqeq, curly, no-explicit-any
npm run typecheck   # tsc --noEmit
npm test            # Jest: логика демо — фильтры, сортировка, окно виртуализации, редьюсер конструктора, генераторы данных
npm run build       # статическая сборка в out/
npm run storybook   # Storybook на :6006; build-storybook — сборка в out/storybook
```

Те же шаги запускаются в CI перед каждым деплоем: сайт не публикуется, если упал линтер, типы или тесты.

## Деплой

Push в `main` → [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): установка зависимостей, lint, typecheck, тесты, сборка сайта и Storybook, публикация на GitHub Pages. Свой домен — [safyann.ru](https://safyann.ru) (Settings → Pages → Custom domain).

## Запуск

```bash
npm ci
npm run dev
```

Контент: кейсы — `src/entities/case/lib/cases.ts`, другие проекты — `side-projects.ts`, контакты и статус поиска работы — `src/shared/config/site.ts`. Данные демо вымышленные и генерируются детерминированно.
