# Портфолио — Алёна Сафьянникова

Senior Frontend (React / Next.js, Vue / Nuxt, TypeScript). Сайт с кейсами и живым демо параметрического подбора квартир.

## Стек

Next.js (App Router, статический экспорт) · React 19 · TypeScript (strict) · SCSS Modules · Jest · ESLint · Prettier · GitHub Actions → GitHub Pages.

## Запуск

```bash
npm ci
npm run dev
```

Проверки и сборка:

```bash
npm run lint && npm run typecheck && npm test
npm run build   # результат в out/
```

## Структура

```
app/                  маршруты: главная, /cases, /cases/[slug], /demo/picker
src/shared            токены, UI-примитивы, конфиг сайта
src/entities/case     кейсы и проекты: данные, типы, карточка
src/features/apartment-picker  демо подбора: фильтры (lib), тесты (test), UI
src/widgets           секции страниц
```

Демо-выборщик: состояние фильтров живёт только в URL (`?rooms=1,2&price_max=60`), логика фильтрации — чистые функции в `lib/filters.ts`, покрыта тестами. Данные вымышленные и генерируются детерминированно.

## Деплой

Push в `main` → workflow `.github/workflows/deploy.yml` собирает сайт и публикует на GitHub Pages. Для репозитория не вида `<user>.github.io` base path подставляется автоматически. Свой домен: Settings → Pages → Custom domain.
