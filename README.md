# Портфолио — Алена Сафьянникова

[![Deploy](https://github.com/Safyann/portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/Safyann/portfolio/actions/workflows/deploy.yml)
[![Site](https://img.shields.io/website?url=https%3A%2F%2Fsafyann.ru&label=safyann.ru)](https://safyann.ru)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)

Senior Frontend (React / Next.js, Vue / Nuxt, TypeScript). Сайт с кейсами и живым демо параметрического подбора квартир — **[safyann.ru](https://safyann.ru)**.

## Стек

Next.js 16 (App Router, статический экспорт) · React 19 · TypeScript (strict, `noUncheckedIndexedAccess`) · SCSS Modules · Jest · ESLint · Prettier · GitHub Actions → GitHub Pages.

## Архитектура

Код разложен по [Feature-Sliced Design](https://feature-sliced.design/): слой импортирует только нижележащие, наружу слайс отдаёт API через `index.ts`.

```
app/                         маршруты: /, /cases, /cases/[slug], /demo/picker, og.png, sitemap, robots
src/
  shared/                    токены и стили, UI-примитивы, конфиг сайта, инлайн-скрипт появления
  entities/case/             кейсы и проекты: данные, типы, карточка и список
  features/apartment-picker/ подбор квартир: model (типы) · lib (фильтры, URL, форматирование) · ui · test
  widgets/                   секции страниц: hero, summary, cases-list, side-projects, approach, stack, contacts
```

Решения, которые стоит посмотреть:

- **Состояние фильтров живёт только в URL** (`?rooms=1,2&price_max=60`). Нет дублирования в `useState`, поэтому «назад», обновление страницы и отправленная ссылка показывают одно и то же — `src/features/apartment-picker/lib/use-url-filters.ts`.
- **Фильтрация — чистые функции** без React (`lib/filters.ts`): разбор и сериализация URL, нормализация «от/до», счётчики по комнатам с учётом остальных фильтров. Покрыты тестами.
- **Статический HTML без пустых заглушек.** `useSearchParams` при статическом экспорте работает только в браузере, поэтому fallback у `Suspense` — тот же подбор с фильтрами по умолчанию, а не «Загрузка…».
- **Анимации появления без зависимости от React.** Инлайн-скрипт в `<head>` отмечает блоки по мере прокрутки, в том числе проскоченные быстрой прокруткой или якорем; без JS и при `prefers-reduced-motion` контент виден сразу — `src/shared/lib/reveal-script.ts`.
- **OG-картинка генерируется при сборке** (`app/og.png/route.tsx`, `next/og`) с локальными шрифтами — без сетевых запросов и с правильным `content-type`.
- **Дизайн-токены**: пять размеров шрифта, цвета и отступы — CSS-переменные в `src/shared/styles/global.scss`, светлая и тёмная тема по `prefers-color-scheme`.

## Качество

```bash
npm run lint        # ESLint: next/core-web-vitals + typescript, eqeqeq, curly, no-explicit-any
npm run typecheck   # tsc --noEmit
npm test            # Jest: логика подбора — фильтры, URL, форматирование, детерминированные данные
npm run build       # статическая сборка в out/
```

Те же шаги запускаются в CI перед каждым деплоем: сайт не публикуется, если упал линтер, типы или тесты.

## Деплой

Push в `main` → [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): установка зависимостей, lint, typecheck, тесты, сборка и публикация на GitHub Pages. Свой домен — [safyann.ru](https://safyann.ru) (Settings → Pages → Custom domain).

## Запуск

```bash
npm ci
npm run dev
```

Контент: кейсы — `src/entities/case/lib/cases.ts`, другие проекты — `side-projects.ts`, контакты и статус поиска работы — `src/shared/config/site.ts`. Данные демо вымышленные и генерируются детерминированно.
